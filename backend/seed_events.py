from pymongo import MongoClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
client = MongoClient(os.environ.get('MONGO_URI'))
db = client.get_database()

# Sample events data
test_events = [
    # Sports Events
    {
        'title': 'Intramural Basketball Tournament',
        'description': 'Join us for an exciting basketball tournament! All skill levels welcome. Teams of 5 players.',
        'date': (datetime.now() + timedelta(days=7)).isoformat(),
        'time': '3:00 PM - 6:00 PM',
        'location': 'Main Gymnasium',
        'category': 'Sports',
        'image': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
        'host': 'Campus Recreation',
        'school': 'uf'
    },
    {
        'title': 'Weekend Soccer Match',
        'description': 'Casual soccer game on the field. Bring your friends and join the fun!',
        'date': (datetime.now() + timedelta(days=5)).isoformat(),
        'time': '10:00 AM - 12:00 PM',
        'location': 'Athletic Field',
        'category': 'Sports',
        'image': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
        'host': 'Soccer Club',
        'school': 'uf'
    },
    {
        'title': 'Yoga in the Park',
        'description': 'Relaxing outdoor yoga session. Bring your own mat. Perfect for stress relief!',
        'date': (datetime.now() + timedelta(days=3)).isoformat(),
        'time': '7:00 AM - 8:00 AM',
        'location': 'Central Park',
        'category': 'Sports',
        'image': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
        'host': 'Wellness Center',
        'school': 'uf'
    },

    # Music Events
    {
        'title': 'Open Mic Night',
        'description': 'Showcase your musical talent! Singers, rappers, and instrumentalists welcome. Sign up at the door.',
        'date': (datetime.now() + timedelta(days=10)).isoformat(),
        'time': '7:00 PM - 10:00 PM',
        'location': 'Student Union Café',
        'category': 'Music',
        'image': 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
        'host': 'Music Society',
        'school': 'uf'
    },
    {
        'title': 'Jazz Band Performance',
        'description': 'Evening of smooth jazz performed by our talented student jazz ensemble.',
        'date': (datetime.now() + timedelta(days=14)).isoformat(),
        'time': '8:00 PM - 10:00 PM',
        'location': 'Concert Hall',
        'category': 'Music',
        'image': 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800',
        'host': 'Jazz Ensemble',
        'school': 'uf'
    },
    {
        'title': 'Battle of the Bands',
        'description': 'Student bands compete for the top prize! Come support your favorites.',
        'date': (datetime.now() + timedelta(days=21)).isoformat(),
        'time': '6:00 PM - 11:00 PM',
        'location': 'Outdoor Amphitheater',
        'category': 'Music',
        'image': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        'host': 'Student Activities',
        'school': 'uf'
    },

    # Art Events
    {
        'title': 'Student Art Exhibition',
        'description': 'Featuring works from talented student artists across all mediums. Opening reception with refreshments.',
        'date': (datetime.now() + timedelta(days=6)).isoformat(),
        'time': '5:00 PM - 8:00 PM',
        'location': 'Campus Art Gallery',
        'category': 'Art',
        'image': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
        'host': 'Art Department',
        'school': 'uf'
    },
    {
        'title': 'Pottery Workshop',
        'description': 'Learn the basics of pottery and create your own ceramic piece. All materials provided.',
        'date': (datetime.now() + timedelta(days=8)).isoformat(),
        'time': '2:00 PM - 5:00 PM',
        'location': 'Art Studio 201',
        'category': 'Art',
        'image': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
        'host': 'Ceramics Club',
        'school': 'uf'
    },
    {
        'title': 'Life Drawing Session',
        'description': 'Open drawing session with live models. Bring your own supplies or use ours.',
        'date': (datetime.now() + timedelta(days=12)).isoformat(),
        'time': '6:00 PM - 9:00 PM',
        'location': 'Fine Arts Building',
        'category': 'Art',
        'image': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
        'host': 'Drawing Society',
        'school': 'uf'
    },

    # Technology Events
    {
        'title': 'Hackathon 2025',
        'description': '24-hour coding challenge! Build innovative solutions and compete for prizes. Free food and swag!',
        'date': (datetime.now() + timedelta(days=15)).isoformat(),
        'time': '9:00 AM (Sat) - 9:00 AM (Sun)',
        'location': 'Computer Science Building',
        'category': 'Technology',
        'image': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        'host': 'CS Club',
        'school': 'uf'
    },
    {
        'title': 'AI & Machine Learning Workshop',
        'description': 'Introduction to machine learning concepts and hands-on coding exercises with Python.',
        'date': (datetime.now() + timedelta(days=9)).isoformat(),
        'time': '4:00 PM - 6:00 PM',
        'location': 'Tech Lab 305',
        'category': 'Technology',
        'image': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        'host': 'AI Research Group',
        'school': 'uf'
    },
    {
        'title': 'Web Development Bootcamp',
        'description': 'Learn React and modern web development in this intensive weekend workshop.',
        'date': (datetime.now() + timedelta(days=18)).isoformat(),
        'time': '10:00 AM - 4:00 PM',
        'location': 'Innovation Hub',
        'category': 'Technology',
        'image': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        'host': 'Tech Society',
        'school': 'uf'
    },

    # Science Events
    {
        'title': 'Astronomy Night',
        'description': 'Stargazing event with telescopes. Learn about constellations and observe planets.',
        'date': (datetime.now() + timedelta(days=11)).isoformat(),
        'time': '8:00 PM - 11:00 PM',
        'location': 'Observatory Rooftop',
        'category': 'Science',
        'image': 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800',
        'host': 'Physics Department',
        'school': 'uf'
    },
    {
        'title': 'Chemistry Demo Show',
        'description': 'Exciting chemistry demonstrations and experiments. Explosive fun for all!',
        'date': (datetime.now() + timedelta(days=13)).isoformat(),
        'time': '3:00 PM - 5:00 PM',
        'location': 'Science Auditorium',
        'category': 'Science',
        'image': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
        'host': 'Chemistry Club',
        'school': 'uf'
    },

    # Reading Events
    {
        'title': 'Book Club Discussion',
        'description': 'Monthly book club meeting. This month: "The Midnight Library". Coffee and snacks provided.',
        'date': (datetime.now() + timedelta(days=4)).isoformat(),
        'time': '6:00 PM - 7:30 PM',
        'location': 'Campus Library Room 201',
        'category': 'Reading',
        'image': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
        'host': 'Book Club',
        'school': 'uf'
    },
    {
        'title': 'Poetry Reading Night',
        'description': 'Share your original poetry or listen to others. Open to all writing styles.',
        'date': (datetime.now() + timedelta(days=16)).isoformat(),
        'time': '7:00 PM - 9:00 PM',
        'location': 'English Department Lounge',
        'category': 'Reading',
        'image': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
        'host': 'Creative Writing Club',
        'school': 'uf'
    },
    {
        'title': 'Author Visit & Q&A',
        'description': 'Meet bestselling author Jane Smith. Book signing and discussion to follow.',
        'date': (datetime.now() + timedelta(days=20)).isoformat(),
        'time': '5:00 PM - 7:00 PM',
        'location': 'Main Library Auditorium',
        'category': 'Reading',
        'image': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
        'host': 'Literature Department',
        'school': 'uf'
    },

    # Gaming Events
    {
        'title': 'Super Smash Bros Tournament',
        'description': 'Competitive Smash tournament! Prizes for top 3. Bring your main!',
        'date': (datetime.now() + timedelta(days=5)).isoformat(),
        'time': '4:00 PM - 9:00 PM',
        'location': 'Student Gaming Lounge',
        'category': 'Gaming',
        'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
        'host': 'Gaming Club',
        'school': 'uf'
    },
    {
        'title': 'Board Game Night',
        'description': 'Try new board games! We have everything from Catan to Ticket to Ride.',
        'date': (datetime.now() + timedelta(days=7)).isoformat(),
        'time': '6:00 PM - 11:00 PM',
        'location': 'Recreation Center',
        'category': 'Gaming',
        'image': 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800',
        'host': 'Board Game Society',
        'school': 'uf'
    },
    {
        'title': 'League of Legends Clash',
        'description': 'Form your team of 5 and compete in LoL! Tournament starts at 6 PM sharp.',
        'date': (datetime.now() + timedelta(days=17)).isoformat(),
        'time': '6:00 PM - 10:00 PM',
        'location': 'Esports Arena',
        'category': 'Gaming',
        'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        'host': 'Esports Team',
        'school': 'uf'
    },

    # Cooking Events
    {
        'title': 'International Cuisine Workshop',
        'description': 'Learn to cook authentic Thai curry! Ingredients provided. Eat what you make!',
        'date': (datetime.now() + timedelta(days=6)).isoformat(),
        'time': '5:00 PM - 7:00 PM',
        'location': 'Culinary Arts Kitchen',
        'category': 'Cooking',
        'image': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
        'host': 'Culinary Club',
        'school': 'uf'
    },
    {
        'title': 'Baking Competition',
        'description': 'Show off your baking skills! Best dessert wins. Judges and prizes await.',
        'date': (datetime.now() + timedelta(days=19)).isoformat(),
        'time': '2:00 PM - 6:00 PM',
        'location': 'Student Kitchen',
        'category': 'Cooking',
        'image': 'https://images.unsplash.com/photo-1587241321921-91a834d6d191?w=800',
        'host': 'Baking Society',
        'school': 'uf'
    },

    # Travel Events
    {
        'title': 'Study Abroad Fair',
        'description': 'Explore international study opportunities. Representatives from 20+ countries.',
        'date': (datetime.now() + timedelta(days=8)).isoformat(),
        'time': '11:00 AM - 3:00 PM',
        'location': 'International Center',
        'category': 'Travel',
        'image': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        'host': 'Study Abroad Office',
        'school': 'uf'
    },
    {
        'title': 'Weekend Hiking Trip',
        'description': 'Day trip to nearby mountain trails. Transportation provided. Bring water and snacks!',
        'date': (datetime.now() + timedelta(days=9)).isoformat(),
        'time': '7:00 AM - 6:00 PM',
        'location': 'Departs from Student Center',
        'category': 'Travel',
        'image': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
        'host': 'Outdoor Adventures Club',
        'school': 'uf'
    },
    {
        'title': 'Travel Photography Showcase',
        'description': 'Student photographers share their travel adventures. Tips for budget travel included!',
        'date': (datetime.now() + timedelta(days=22)).isoformat(),
        'time': '6:00 PM - 8:00 PM',
        'location': 'Media Center',
        'category': 'Travel',
        'image': 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',
        'host': 'Photography Club',
        'school': 'uf'
    }
]

def seed_events():
    try:
        # Clear existing events (optional - remove if you want to keep existing data)
        print("Clearing existing events...")
        db.events.delete_many({})

        # Insert test events
        print(f"Inserting {len(test_events)} test events...")
        result = db.events.insert_many(test_events)

        print(f"✓ Successfully inserted {len(result.inserted_ids)} events!")

        # Print summary by category
        print("\nEvents by category:")
        for category in ['Sports', 'Music', 'Art', 'Technology', 'Science', 'Reading', 'Gaming', 'Cooking', 'Travel']:
            count = db.events.count_documents({'category': category})
            print(f"  {category}: {count} events")

        print("\n✓ Database seeding complete!")

    except Exception as e:
        print(f"✗ Error seeding database: {e}")
    finally:
        client.close()

if __name__ == '__main__':
    seed_events()
