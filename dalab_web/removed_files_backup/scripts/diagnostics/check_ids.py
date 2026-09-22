import sqlite3
import os

DB_PATH = 'prisma/dev.db'

def main():
    if not os.path.exists(DB_PATH):
        print(f"Error: {DB_PATH} not found")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("--- Categories ---")
    cursor.execute("SELECT id, name FROM Category")
    for row in cursor.fetchall():
        print(f"ID: {row[0]}, Name: {row[1]}")

    print("\n--- Stores ---")
    cursor.execute("SELECT id, name FROM Store")
    for row in cursor.fetchall():
        print(f"ID: {row[0]}, Name: {row[1]}")

    conn.close()

if __name__ == "__main__":
    main()
