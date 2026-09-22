import os
import sqlite3
import requests
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image

# Load environment variables
load_dotenv('.env.local')

# Configuration
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
IMAGE_DIR = r'C:\Users\user\OneDrive\图片\dalab-categories-products\category images'
DB_PATH = 'prisma/dev.db'
BUCKET_NAME = 'products'

MAPPINGS = {
    'accessories.png': 'accessories',
    'appliance-home.png': 'home appliances',
    'beauty.png': 'beauty',
    'clothing.png': 'clothing',
    'electronics.png': 'electronics',
    'home & kitchen.png': 'home & kitchen',
    'mobiles.png': 'mobiles',
    'personal-care.png': 'personal care'
}

def process_and_upload(image_filename, category_name):
    """Resize image and upload to Supabase"""
    try:
        source_path = os.path.join(IMAGE_DIR, image_filename)
        if not os.path.exists(source_path):
            print(f"  [MISSING] {image_filename}")
            return None

        # 1. Resize Image
        temp_path = f"temp_{image_filename}"
        with Image.open(source_path) as img:
            # Resize logic
            img = img.convert("RGBA")
            img.thumbnail((512, 512), Image.Resampling.LANCZOS)
            
            width, height = img.size
            if width != height:
                new_img = Image.new("RGBA", (512, 512), (255, 255, 255, 0))
                offset = ((512 - width) // 2, (512 - height) // 2)
                new_img.paste(img, offset)
                img_to_save = new_img
            else:
                img_to_save = img.resize((512, 512), Image.Resampling.LANCZOS)
                
            img_to_save.save(temp_path, "PNG")

        # 2. Upload to Supabase
        storage_path = f'category-images/{image_filename}'
        public_url = None
        with open(temp_path, 'rb') as f:
            headers = {
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': 'image/png'
            }
            upload_url = f'{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{storage_path}'
            response = requests.post(upload_url, headers=headers, data=f)
            
            if response.status_code in [200, 201]:
                public_url = f'{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{storage_path}'
                print(f"  [SUCCESS] Uploaded: {image_filename} -> {public_url}")
            else:
                # 400 or 409 might mean it already exists, grab the URL anyway
                public_url = f'{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{storage_path}'
                print(f"  [INFO] Already exists or update required: {image_filename}")
        
        # Cleanup temp file outside the 'with open' block
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass
        return public_url
    except Exception as e:
        print(f"  [ERROR] {image_filename}: {e}")
        return None

def update_db(conn, category_name, image_url):
    """Update Category image URL in database"""
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE Category SET image = ? WHERE name = ?", (image_url, category_name))
        conn.commit()
        return cursor.rowcount > 0
    except Exception as e:
        print(f"  [DB ERROR] {category_name}: {e}")
        return False

def main():
    print("Starting Category Image Ingestion...\n")
    
    if not os.path.exists(IMAGE_DIR):
        print(f"Error: {IMAGE_DIR} not found")
        return

    conn = sqlite3.connect(DB_PATH)
    
    success_count = 0
    for filename, cat_name in MAPPINGS.items():
        print(f"Processing: {cat_name} ({filename})")
        url = process_and_upload(filename, cat_name)
        if url:
            if update_db(conn, cat_name, url):
                print(f"  [DONE] Database updated for {cat_name}")
                success_count += 1
            else:
                print(f"  [FAILED] Could not find category '{cat_name}' in database")
    
    conn.close()
    print(f"\nCompleted! Successfully updated {success_count}/{len(MAPPINGS)} categories.")

if __name__ == "__main__":
    main()
