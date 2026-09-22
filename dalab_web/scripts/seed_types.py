import sqlite3
import uuid
import datetime

def seed_types():
    conn = sqlite3.connect('prisma/dev.db')
    cursor = conn.cursor()
    now = datetime.datetime.now().isoformat()

    # Define types and their attributes
    types_data = [
        {
            "name": "General Mobile",
            "attributes": [
                {"name": "Brand", "type": "TEXT"},
                {"name": "Model", "type": "TEXT"},
                {"name": "Storage", "type": "TEXT"},
                {"name": "RAM", "type": "TEXT"},
                {"name": "Color", "type": "TEXT"}
            ]
        },
        {
            "name": "Beauty & Skincare",
            "attributes": [
                {"name": "Brand", "type": "TEXT"},
                {"name": "Volume/Weight", "type": "TEXT"},
                {"name": "Skin Type", "type": "TEXT"},
                {"name": "Ingredients", "type": "TEXT"}
            ]
        },
        {
            "name": "Home Appliance",
            "attributes": [
                {"name": "Brand", "type": "TEXT"},
                {"name": "Power", "type": "TEXT"},
                {"name": "Warranty", "type": "TEXT"},
                {"name": "Material", "type": "TEXT"}
            ]
        },
        {
            "name": "Electronics",
            "attributes": [
                {"name": "Brand", "type": "TEXT"},
                {"name": "Power Output", "type": "TEXT"},
                {"name": "Battery Life", "type": "TEXT"},
                {"name": "Connectivity", "type": "TEXT"}
            ]
        }
    ]

    print("🌱 Seeding Product Types and Attributes...")

    for t in types_data:
        type_id = f"type_{uuid.uuid4().hex[:8]}"
        cursor.execute(
            "INSERT INTO ProductType (id, name) VALUES (?, ?)",
            (type_id, t["name"])
        )
        print(f"  + Added Type: {t['name']}")

        for attr in t["attributes"]:
            attr_id = f"attr_{uuid.uuid4().hex[:8]}"
            cursor.execute(
                "INSERT INTO Attribute (id, name, type, productTypeId) VALUES (?, ?, ?, ?)",
                (attr_id, attr["name"], attr["type"], type_id)
            )
            print(f"    - Added Attribute: {attr['name']}")

    conn.commit()
    conn.close()
    print("\n✨ Seeding complete! You can now select Product Types.")

if __name__ == "__main__":
    seed_types()
