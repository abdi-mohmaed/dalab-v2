import os
import sqlite3
import uuid
from pathlib import Path
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv('.env.local')

# Configuration
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
IMAGE_DIR = r'C:\Users\user\OneDrive\图片\dalab-categories-products\mobiles'
DB_PATH = 'prisma/dev.db'
STORE_ID = 'cmkvifmt40002tks8r6z5o5hn'  # Dalab
CATEGORY_ID = 'cat_mobiles'  # Mobiles
BUCKET_NAME = 'products'

def upload_to_supabase(image_path: str, product_id: str) -> str:
    """Upload image to Supabase using HTTP API and return public URL"""
    try:
        file_ext = Path(image_path).suffix
        storage_path = f'mobiles/{product_id}{file_ext}'
        
        # Upload file
        with open(image_path, 'rb') as f:
            headers = {
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': f'image/{file_ext[1:]}'
            }
            upload_url = f'{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{storage_path}'
            response = requests.post(upload_url, headers=headers, data=f)
            
            if response.status_code in [200, 201]:
                # Construct public URL
                public_url = f'{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{storage_path}'
                print(f"  [SUCCESS] Uploaded: {storage_path}")
                return public_url
            else:
                print(f"  [FAILED] Upload failed: {response.status_code} - {response.text}")
                return None
    except Exception as e:
        print(f"  [ERROR] Upload failed: {e}")
        return None

def create_product(conn, product_id: str, title: str, image_url: str):
    """Create product and default variant in database"""
    cursor = conn.cursor()
    
    try:
        # Insert Product
        cursor.execute("""
            INSERT INTO Product (id, title, description, image, storeId, categoryId, status, rating, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (product_id, title, f"Mobile product - {title}", image_url, STORE_ID, CATEGORY_ID, 'ACTIVE', 0))
        
        # Insert ProductImage
        image_id = f"img_{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT INTO ProductImage (id, url, productId, "order")
            VALUES (?, ?, ?, ?)
        """, (image_id, image_url, product_id, 0))
        
        # Insert Default Variant
        variant_id = f"var_{uuid.uuid4().hex[:8]}"
        sku = f"MOB-{uuid.uuid4().hex[:12]}"
        cursor.execute("""
            INSERT INTO ProductVariant (id, productId, sku, price, stock, status, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (variant_id, product_id, sku, 0, 100, 'ACTIVE'))
        
        conn.commit()
        print(f"  [SUCCESS] Created product: {title}")
        return True
    except Exception as e:
        print(f"  [ERROR] Database error: {e}")
        conn.rollback()
        return False

def main():
    print("Starting Bulk Mobiles Product Ingestion...\n")
    
    if not os.path.exists(IMAGE_DIR):
        print(f"Error: {IMAGE_DIR} not found")
        return

    # Connect to database
    conn = sqlite3.connect(DB_PATH)
    
    # Get all images
    image_files = sorted([f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    
    print(f"Found {len(image_files)} images\n")
    
    success_count = 0
    for idx, filename in enumerate(image_files, 1):
        product_id = f"mob_{uuid.uuid4().hex[:8]}"
        # Create a more descriptive title from filename if possible, otherwise generic
        title = filename.split('.')[0].replace('-', ' ').replace('_', ' ').capitalize()
        if title.startswith('Whatsapp image'):
            title = f"Mobile Product {idx}"
        image_path = os.path.join(IMAGE_DIR, filename)
        
        print(f"[{idx}/{len(image_files)}] Processing: {filename}")
        
        # Upload to Supabase
        image_url = upload_to_supabase(image_path, product_id)
        
        if image_url:
            # Create in database
            if create_product(conn, product_id, title, image_url):
                success_count += 1
        
        print()
    
    conn.close()
    
    print("Ingestion Complete!")
    print(f"   Success: {success_count}/{len(image_files)}")
    print("\nCheck your Admin Panel to see the new products!")

if __name__ == "__main__":
    main()
