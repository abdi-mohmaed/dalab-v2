import sqlite3
import uuid
import datetime

def seed_amazon():
    conn = sqlite3.connect('prisma/dev.db')
    cursor = conn.cursor()

    # 1. Create Amazon Store
    amazon_id = f"store_{uuid.uuid4().hex[:8]}"
    now = datetime.datetime.now().isoformat()
    
    # Check if exists (paranoia)
    cursor.execute("SELECT id FROM Store WHERE slug = 'amazon'")
    row = cursor.fetchone()
    if row:
        amazon_id = row[0]
        print(f"Amazon store already exists with ID: {amazon_id}")
    else:
        # Get an admin user ID
        cursor.execute("SELECT id FROM User LIMIT 1")
        admin_id = cursor.fetchone()[0]
        
        cursor.execute(
            "INSERT INTO Store (id, slug, name, description, ownerId, status, createdAt, updatedAt) "
            "VALUES (?, 'amazon', 'Amazon', 'Global Amazon Marketplace', ?, 'ACTIVE', ?, ?)",
            (amazon_id, admin_id, now, now)
        )
        print("Created Amazon store.")

    # 2. Get some Category IDs
    cursor.execute("SELECT id, name FROM Category")
    categories = {name: id for id, name in cursor.execute("SELECT name, id FROM Category").fetchall()}
    
    # 3. Add Sample Amazon Products
    sample_products = [
        {
            "title": "Amazon Echo Dot (5th Gen, 2022)",
            "description": "Our best-sounding Echo Dot yet - Enjoy an improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals, deeper bass and vibrant sound in any room.",
            "image": "https://m.media-amazon.com/images/I/71C3lbbeLsL._AC_SL1500_.jpg",
            "price": 49.99,
            "category": "electronic equipment"
        },
        {
            "title": "Apple AirPods Pro (2nd Generation)",
            "description": "Up to 2x more Active Noise Cancellation than the previous generation AirPods Pro.",
            "image": "https://m.media-amazon.com/images/I/61SUj2W5yXL._AC_SL1500_.jpg",
            "price": 249.00,
            "category": "electronic equipment"
        },
        {
            "title": "Instant Pot Duo Plus 9-in-1",
            "description": "9-IN-1 FUNCTIONALITY: Pressure cook, slow cook, rice cooker, yogurt maker, steamer, sauté pan, sterilizer, food warmer and sous vide.",
            "image": "https://m.media-amazon.com/images/I/71WtwEvY85L._AC_SL1500_.jpg",
            "price": 129.95,
            "category": "home kitchen"
        }
    ]

    for p in sample_products:
        prod_id = f"prod_{uuid.uuid4().hex[:8]}"
        cat_id = categories.get(p["category"]) or list(categories.values())[0]
        
        cursor.execute(
            "INSERT INTO Product (id, title, description, image, storeId, categoryId, status, createdAt, updatedAt) "
            "VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)",
            (prod_id, p["title"], p["description"], p["image"], amazon_id, cat_id, now, now)
        )
        
        # Add a default variant
        cursor.execute(
            "INSERT INTO ProductVariant (id, productId, sku, price, stock, status, createdAt, updatedAt) "
            "VALUES (?, ?, ?, ?, 100, 'ACTIVE', ?, ?)",
            (f"var_{uuid.uuid4().hex[:8]}", prod_id, f"AMZ-{uuid.uuid4().hex[:6].upper()}", p["price"], now, now)
        )

    conn.commit()
    conn.close()
    print("Done seeding Amazon products.")

if __name__ == "__main__":
    seed_amazon()
