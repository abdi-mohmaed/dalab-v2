import os
import requests
from dotenv import load_dotenv

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def list_supabase_files(bucket_name, path=""):
    print(f"📂 Listing files in Supabase bucket: {bucket_name}, path: '{path}'...")
    list_url = f"{SUPABASE_URL}/storage/v1/object/list/{bucket_name}"
    headers = {"Authorization": f"Bearer {SUPABASE_KEY}"}
    
    res = requests.post(list_url, headers=headers, json={"prefix": path})
    if res.status_code != 200:
        print(f"❌ Error: {res.text}")
        return
        
    items = res.json()
    if not items:
        print("Empty folder.")
        return

    for item in items:
        if item.get('id') is None: # Folder
            print(f"📁 {item['name']}/")
            list_supabase_files(bucket_name, f"{path}{item['name']}/")
        else:
            print(f"📄 {item['name']} ({item.get('metadata', {}).get('size', 0)} bytes)")

if __name__ == "__main__":
    list_supabase_files("products")
