"""
Migration script to add host_id to events that don't have it.
This script matches events to users based on the host name.
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

def migrate_host_ids():
    """Add host_id to events that are missing it"""

    # Get all events
    events = db.events.find()

    updated_count = 0
    skipped_count = 0
    error_count = 0

    for event in events:
        # Skip if host_id already exists
        if event.get('host_id'):
            skipped_count += 1
            continue

        # Get the host name
        host_name = event.get('host')

        if not host_name:
            print(f"❌ Event {event['_id']} has no host name")
            error_count += 1
            continue

        # Try to find the user by matching first_name and last_name
        # Host name format is typically "FirstName LastName"
        try:
            name_parts = host_name.strip().split(' ', 1)
            if len(name_parts) == 2:
                first_name, last_name = name_parts

                # Find user with matching name
                user = db.users.find_one({
                    'first_name': first_name,
                    'last_name': last_name
                })

                if user:
                    # Update the event with the host_id
                    db.events.update_one(
                        {'_id': event['_id']},
                        {'$set': {'host_id': str(user['_id'])}}
                    )
                    print(f"✓ Updated event '{event.get('title')}' with host_id for {host_name}")
                    updated_count += 1
                else:
                    print(f"⚠ No user found for host name: {host_name} (event: {event.get('title')})")
                    error_count += 1
            else:
                print(f"⚠ Could not parse host name: {host_name} (event: {event.get('title')})")
                error_count += 1

        except Exception as e:
            print(f"❌ Error processing event {event['_id']}: {e}")
            error_count += 1

    print(f"\n=== Migration Summary ===")
    print(f"✓ Updated: {updated_count} events")
    print(f"⊙ Skipped (already had host_id): {skipped_count} events")
    print(f"❌ Errors: {error_count} events")
    print(f"Total events processed: {updated_count + skipped_count + error_count}")

if __name__ == '__main__':
    print("Starting migration to add host_id to events...\n")
    migrate_host_ids()
    print("\nMigration complete!")
