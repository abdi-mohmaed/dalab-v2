import os
import json
import sqlite3
import uuid
import datetime
import requests
from dotenv import load_dotenv

# Load credentials
load_dotenv(".env.local")

DB_PATH = "prisma/dev.db"
MARKETPLACE_ID = 'A2VIG63S8CSXZR' # UAE
SP_API_ENDPOINT = 'https://sellingpartnerapi-eu.amazon.com'

class AmazonAutopilot:
    def __init__(self):
        self.client_id = os.getenv("AMAZON_CLIENT_ID")
        self.client_secret = os.getenv("AMAZON_CLIENT_SECRET")
        self.refresh_token = os.getenv("AMAZON_REFRESH_TOKEN")
        self.access_token = None

    def get_token(self):
        print("🔑 Fetching Amazon Access Token...")
        if not self.client_secret or self.client_secret == "PASTE_YOUR_SECRET_HERE":
            print("❌ ERROR: Please add your AMAZON_CLIENT_SECRET to .env.local first!")
            return False
            
        res = requests.post('https://api.amazon.com/auth/o2/token', json={
            'grant_type': 'refresh_token',
            'refresh_token': self.refresh_token,
            'client_id': self.client_id,
            'client_secret': self.client_secret
        })
        if res.status_code == 200:
            self.access_token = res.json().get("access_token")
            return True
        else:
            print(f"❌ Token Error: {res.text}")
            return False

    def search_and_sync(self, keyword="Apple", max_results=20):
        if not self.access_token and not self.get_token():
            return

        print(f"🔎 Searching Amazon for '{keyword}'...")
        headers = {'x-amz-access-token': self.access_token}
        params = {
            'marketplaceIds': MARKETPLACE_ID,
            'keywords': keyword,
            'includedData': 'summaries,attributes,images'
        }
        
        url = f"{SP_API_ENDPOINT}/catalog/2022-09-01/items"
        res = requests.get(url, params=params, headers=headers)
        
        if res.status_code != 200:
            print(f"❌ Search Error: {res.text}")
            return

        items = res.json().get("items", [])
        print(f"✅ Found {len(items)} items. Starting ingestion...")
        
        self.ingest_to_db(items)

    def ingest_to_db(self, items):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        now = datetime.datetime.now().isoformat()
        
        # Get Amazon Store ID
        cursor.execute("SELECT id FROM Store WHERE slug = 'amazon'")
        store_row = cursor.fetchone()
        if not store_row:
            print("❌ Amazon store not found. Please run seed_amazon.py first.")
            return
        store_id = store_row[0]
        
        # Get a default category
        cursor.execute("SELECT id FROM Category LIMIT 1")
        category_id = cursor.fetchone()[0]

        count = 0
        for item in items:
            asin = item.get("asin")
            summary = item.get("summaries", [{}])[0]
            title = summary.get("itemName")
            image = item.get("images", [{}])[0].get("images", [{}])[0].get("link")
            
            if not title or not image: continue

            # Check if exists
            cursor.execute("SELECT id FROM Product WHERE externalId = ?", (asin,))
            if cursor.fetchone():
                continue

            prod_id = f"prod_{uuid.uuid4().hex[:8]}"
            cursor.execute(
                "INSERT INTO Product (id, title, description, image, storeId, categoryId, status, externalId, source, createdAt, updatedAt) "
                "VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?, 'Amazon', ?, ?)",
                (prod_id, title, title, image, store_id, category_id, asin, now, now)
            )
            
            # Simple variant with dummy price (SP-API Price usually needs another call)
            cursor.execute(
                "INSERT INTO ProductVariant (id, productId, sku, price, stock, status, createdAt, updatedAt) "
                "VALUES (?, ?, ?, 99.00, 100, 'ACTIVE', ?, ?)",
                (f"var_{uuid.uuid4().hex[:8]}", prod_id, f"AMZ-{asin}", now, now)
            )
            count += 1

        conn.commit()
        conn.close()
        print(f"🚀 Successfully imported {count} new products to your Amazon page!")

if __name__ == "__main__":
    auto = AmazonAutopilot()
    # You can change keywords here or make it a loop for different categories
    auto.search_and_sync(keyword="Gaming Laptop", max_results=10)
    auto.search_and_sync(keyword="Smart Watch", max_results=10)
    auto.search_and_sync(keyword="Kitchen gadgets", max_results=10)
