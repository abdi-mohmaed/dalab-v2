import os
import sqlite3
import requests
from dotenv import load_dotenv

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def clear_supabase_bucket(bucket_name):
    print(f"🧹 Clearing Supabase bucket: {bucket_name}...")
    list_url = f"{SUPABASE_URL}/storage/v1/object/list/{bucket_name}"
    headers = {"Authorization": f"Bearer {SUPABASE_KEY}"}
    
    # We need to list files recursively or folder by folder. 
    # For simplicity, we'll try to list common folders if any.
    # A more robust way is to list and delete iteratively.
    
    def delete_recursive(path=""):
        res = requests.post(list_url, headers=headers, json={"prefix": path})
        if res.status_code != 200:
            print(f"  ❌ Error listing {path}: {res.text}")
            return
            
        items = res.json()
        if not items:
            return

        files_to_delete = []
        for item in items:
            full_path = f"{path}/{item['name']}" if path else item['name']
            if item.get('id') is None: # It's a folder
                delete_recursive(full_path)
            else:
                files_to_delete.append(full_path)
        
        if files_to_delete:
            print(f"  🗑️ Deleting {len(files_to_delete)} files in {path or 'root'}...")
            del_url = f"{SUPABASE_URL}/storage/v1/object/{bucket_name}"
            res = requests.delete(del_url, headers=headers, json={"prefixes": files_to_delete})
            if res.status_code == 200:
                print(f"  ✅ Deleted {len(files_to_delete)} files.")
            else:
                print(f"  ❌ Delete failed: {res.text}")

    try:
        delete_recursive()
    except Exception as e:
        print(f"  ❌ Critical error: {e}")

def clear_local_db():
    print("🧹 Clearing local Product database...")
    try:
        conn = sqlite3.connect("prisma/dev.db")
        cursor = conn.cursor()
        
        # Disable foreign key checks for clean wipe if needed, or delete in order
        cursor.execute("DELETE FROM ProductAttribute")
        cursor.execute("DELETE FROM ProductVariant")
        cursor.execute("DELETE FROM ProductImage")
        cursor.execute("DELETE FROM Product")
        
        conn.commit()
        print(f"  ✅ Database cleared. {cursor.rowcount} product records removed.")
        conn.close()
    except Exception as e:
        print(f"  ❌ DB Error: {e}")

if __name__ == "__main__":
    clear_supabase_bucket("products")
    clear_local_db()
    print("\n✨ Workspace is clean! You can now start adding products manually.")
