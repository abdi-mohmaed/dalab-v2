import sqlite3
import os

DB_PATH = 'prisma/dev.db'

def main():
    if not os.path.exists(DB_PATH):
        print(f"Error: {DB_PATH} not found")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("--- Tables ---")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    for row in cursor.fetchall():
        print(row[0])

    print("\n--- Category Rows ---")
    cursor.execute("SELECT COUNT(*) FROM Category")
    print(f"Count: {cursor.fetchone()[0]}")

    print("\n--- Store Rows ---")
    cursor.execute("SELECT COUNT(*) FROM Store")
    print(f"Count: {cursor.fetchone()[0]}")

    conn.close()

if __name__ == "__main__":
    main()
