from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Connect to MongoDB
client = MongoClient(os.environ.get('MONGO_URI'))
db = client.get_database()

# Sample events data
sample_events = [
    {
        'title': 'Drone Flying',
        'description': 'We will be flying drones over Paynes Prairie this Friday at sunset!',
        'location': 'Paynes Prairie State Park',
        'date': '2025-07-09',
        'time': '7:05pm',
        'organizer': 'Roberto Martinez',
        'organizer_id': None,  # Will be set to first user
        'category': 'Technology',
        'capacity': 15,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Basketball Pickup Game',
        'description': 'Weekly basketball game at the Southwest Rec Center. All skill levels welcome! Bring your A-game and let\'s have some fun!',
        'location': 'Southwest Recreation Center',
        'date': '2025-07-12',
        'time': '6:00pm',
        'organizer': 'Mike Johnson',
        'organizer_id': None,
        'category': 'Sports',
        'capacity': 10,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Music Jam Session',
        'description': 'Bring your instruments and join us for an acoustic jam session in the park! All musicians welcome.',
        'location': 'Depot Park',
        'date': '2025-07-15',
        'time': '4:30pm',
        'organizer': 'Sarah Williams',
        'organizer_id': None,
        'category': 'Music',
        'capacity': 20,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Art Gallery Opening',
        'description': 'Come celebrate local artists at our new gallery opening downtown! Free refreshments and live music.',
        'location': 'Downtown Gallery',
        'date': '2025-07-18',
        'time': '7:00pm',
        'organizer': 'Emma Davis',
        'organizer_id': None,
        'category': 'Art',
        'capacity': 50,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Coding Workshop: Python for Beginners',
        'description': 'Learn the basics of Python programming in this hands-on workshop. Laptops will be provided!',
        'location': 'Marston Science Library',
        'date': '2025-07-20',
        'time': '2:00pm',
        'organizer': 'Alex Chen',
        'organizer_id': None,
        'category': 'Technology',
        'capacity': 25,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Book Club Meeting',
        'description': 'Monthly book club discussion! This month we\'re reading "The Great Gatsby". Coffee and snacks provided.',
        'location': 'Starbucks on University Ave',
        'date': '2025-07-22',
        'time': '5:00pm',
        'organizer': 'Jessica Brown',
        'organizer_id': None,
        'category': 'Reading',
        'capacity': 12,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Gaming Tournament: Super Smash Bros',
        'description': 'Join us for an epic Super Smash Bros tournament! Prizes for top 3 winners. Bring your own controller!',
        'location': 'Student Union Game Room',
        'date': '2025-07-25',
        'time': '6:30pm',
        'organizer': 'Chris Garcia',
        'organizer_id': None,
        'category': 'Gaming',
        'capacity': 16,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Cooking Class: Italian Cuisine',
        'description': 'Learn to make authentic Italian pasta and tiramisu! All ingredients provided. Limited spots available.',
        'location': 'Community Kitchen',
        'date': '2025-07-27',
        'time': '3:00pm',
        'organizer': 'Maria Romano',
        'organizer_id': None,
        'category': 'Cooking',
        'capacity': 8,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Photography Walk',
        'description': 'Explore the campus with fellow photography enthusiasts! Bring your camera and capture beautiful moments.',
        'location': 'UF Campus - Meet at Plaza of the Americas',
        'date': '2025-07-30',
        'time': '9:00am',
        'organizer': 'David Lee',
        'organizer_id': None,
        'category': 'Photography',
        'capacity': 15,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    },
    {
        'title': 'Soccer Match - Friendly Game',
        'description': 'Casual soccer match open to everyone! We\'ll split into teams when we get there. Just bring water and good vibes!',
        'location': 'Lake Wauburg North Shore',
        'date': '2025-08-02',
        'time': '5:30pm',
        'organizer': 'Carlos Rodriguez',
        'organizer_id': None,
        'category': 'Sports',
        'capacity': 22,
        'rsvp_attendees': [],
        'image': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop',
        'created_at': datetime.utcnow()
    }
]

try:
    # Get the first user to assign as organizer for all events
    first_user = db.users.find_one()

    if not first_user:
        print("No users found in database. Please create a user first.")
        exit(1)

    # Set organizer_id for all events
    for event in sample_events:
        event['organizer_id'] = first_user['_id']
        event['rsvp_attendees'] = [first_user['_id']]  # Organizer auto-RSVP'd

    # Clear existing events (optional - comment out if you want to keep existing events)
    # db.events.delete_many({})

    # Insert sample events
    result = db.events.insert_many(sample_events)

    print(f"✓ Successfully added {len(result.inserted_ids)} events to the database!")
    print("\nEvents added:")
    for event in sample_events:
        print(f"  - {event['title']} ({event['category']}) on {event['date']} at {event['time']}")

except Exception as e:
    print(f"✗ Error adding events: {e}")
finally:
    client.close()
