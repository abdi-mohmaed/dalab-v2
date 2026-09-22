import sqlite3
import uuid

# Configuration
DB_PATH = 'prisma/dev.db'

# Default tags to seed
DEFAULT_TAGS = [
    {
        'name': 'best-seller',
        'displayName': 'Best Seller',
        'color': '#FFD700',  # Gold
        'icon': '⭐'
    },
    {
        'name': 'new-arrival',
        'displayName': 'New Arrival',
        'color': '#4CAF50',  # Green
        'icon': '🆕'
    },
    {
        'name': 'hot-selling',
        'displayName': 'Hot Selling',
        'color': '#FF5722',  # Red-Orange
        'icon': '🔥'
    },
    {
        'name': 'limited-time',
        'displayName': 'Limited Time Only',
        'color': '#FF6B6B',  # Red
        'icon': '⏰'
    },
    {
        'name': 'selling-fast',
        'displayName': 'Selling Fast',
        'color': '#9C27B0',  # Purple
        'icon': '⚡'
    },
    {
        'name': 'trending',
        'displayName': 'Trending',
        'color': '#FF9800',  # Orange
        'icon': '📈'
    },
    {
        'name': 'exclusive',
        'displayName': 'Exclusive',
        'color': '#3F51B5',  # Indigo
        'icon': '💎'
    },
]

def seed_tags():
    print("🏷️  Seeding Default Product Tags...\n")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if tags already exist
    cursor.execute("SELECT COUNT(*) FROM Tag")
    existing_count = cursor.fetchone()[0]
    
    if existing_count > 0:
        print(f"⚠️  Found {existing_count} existing tags. Skipping seed to avoid duplicates.")
        print("   (Delete all tags first if you want to re-seed)\n")
        conn.close()
        return
    
    success_count = 0
    for tag_data in DEFAULT_TAGS:
        tag_id = f"tag_{uuid.uuid4().hex[:8]}"
        
        try:
            cursor.execute("""
                INSERT INTO Tag (id, name, displayName, color, icon, createdAt)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
            """, (
                tag_id,
                tag_data['name'],
                tag_data['displayName'],
                tag_data['color'],
                tag_data['icon']
            ))
            
            print(f"  ✓ Added: {tag_data['displayName']} ({tag_data['color']})")
            success_count += 1
        except Exception as e:
            print(f"  ✗ Failed to add {tag_data['displayName']}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"\n✨ Seeding complete! Added {success_count}/{len(DEFAULT_TAGS)} tags.")
    print("\n👉 You can now use these tags in the Admin Panel!")

if __name__ == "__main__":
    seed_tags()
