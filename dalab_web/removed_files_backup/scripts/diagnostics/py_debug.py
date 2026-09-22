
import os
import sqlite3
import sys

IMAGE_DIR = r'C:\Users\user\OneDrive\图片\dalab-categories-products\electronics\electronics-imporved-images'
DB_PATH = 'prisma/dev.db'

def main():
    print(f"Python: {sys.version}")
    print(f"Directory exists: {os.path.exists(IMAGE_DIR)}")
    if os.path.exists(IMAGE_DIR):
        files = [f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        print(f"Files found: {len(files)}")
    
    print(f"DB exists: {os.path.exists(DB_PATH)}")
    if os.path.exists(DB_PATH):
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM Product")
            print(f"Product count: {cursor.fetchone()[0]}")
            conn.close()
        except Exception as e:
            print(f"DB Error: {e}")

if __name__ == "__main__":
    main()
