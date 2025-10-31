"""
Script to assign seed events to a real user or delete them.
"""

from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.environ.get('MONGO_URI')
client = MongoClient(mongo_uri)
db = client.get_database()

def fix_seed_events():
    """Assign seed events without host_id to the first available user"""

    # Find events without host_id
    events_without_host = db.events.find({'host_id': None})
    count = db.events.count_documents({'host_id': None})

    if count == 0:
        print("✓ All events already have a host_id!")
        return

    print(f"Found {count} events without host_id\n")
    print("Options:")
    print("1. Assign all seed events to your user account")
    print("2. Delete all seed events")
    print("3. Cancel")

    choice = input("\nEnter your choice (1-3): ").strip()

    if choice == "1":
        # Get the first user (or you can specify an email)
        print("\nFinding your user account...")
        users = list(db.users.find().limit(5))

        if not users:
            print("❌ No users found in database!")
            return

        print("\nAvailable users:")
        for i, user in enumerate(users, 1):
            print(f"{i}. {user.get('first_name')} {user.get('last_name')} ({user.get('email')})")

        user_choice = input(f"\nSelect user (1-{len(users)}): ").strip()

        try:
            selected_user = users[int(user_choice) - 1]
            user_id = str(selected_user['_id'])
            user_name = f"{selected_user.get('first_name')} {selected_user.get('last_name')}"

            # Update all events without host_id
            result = db.events.update_many(
                {'host_id': None},
                {
                    '$set': {
                        'host_id': user_id,
                        'host': user_name
                    }
                }
            )

            print(f"\n✓ Assigned {result.modified_count} events to {user_name}")

        except (ValueError, IndexError):
            print("❌ Invalid selection")

    elif choice == "2":
        confirm = input(f"\n⚠ Are you sure you want to delete {count} seed events? (yes/no): ").strip().lower()

        if confirm == "yes":
            result = db.events.delete_many({'host_id': None})
            print(f"\n✓ Deleted {result.deleted_count} seed events")
        else:
            print("❌ Cancelled")

    else:
        print("❌ Cancelled")

if __name__ == '__main__':
    print("=== Fix Seed Events Script ===\n")
    fix_seed_events()
    print("\nDone!")
