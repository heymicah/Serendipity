"""
Script to assign all seed events to the first user in the database.
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

def assign_seed_events():
    """Assign seed events without host_id to the first user"""

    # Find events without host_id
    count = db.events.count_documents({'host_id': None})

    if count == 0:
        print("✓ All events already have a host_id!")
        return

    print(f"Found {count} events without host_id\n")

    # Get the first user
    first_user = db.users.find_one()

    if not first_user:
        print("❌ No users found in database!")
        return

    user_id = str(first_user['_id'])
    user_name = f"{first_user.get('first_name')} {first_user.get('last_name')}"

    print(f"Assigning all seed events to: {user_name} ({first_user.get('email')})\n")

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

    print(f"✓ Successfully assigned {result.modified_count} events to {user_name}")
    print(f"\nNow all events have a host_id and you can view profiles!")

if __name__ == '__main__':
    print("=== Assigning Seed Events to User ===\n")
    assign_seed_events()
    print("\nDone!")
