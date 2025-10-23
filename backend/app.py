from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
import jwt
from datetime import datetime, timedelta
from functools import wraps
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# CORS configuration - Allow both localhost and 127.0.0.1
CORS(app,
     resources={r"/api/*": {
         "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True,
         "expose_headers": ["Content-Type", "Authorization"]
     }})

# Configuration
app.config['MONGO_URI'] = os.environ.get('MONGO_URI')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

# Initialize PyMongo
try:
    mongo = PyMongo(app)
    # Test connection
    mongo.db.command('ping')
    print("✓ MongoDB connection successful!")
except Exception as e:
    print(f"✗ MongoDB connection failed: {e}")
    mongo = None

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            print("❌ No token provided in Authorization header")
            return jsonify({'message': 'Token is missing'}), 401

        try:
            if token.startswith('Bearer '):
                token = token[7:]
            print(f"🔍 Decoding token: {token[:20]}...")
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            print(f"✓ Token decoded successfully, user_id: {data['user_id']}")
            current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                print(f"❌ User not found with id: {data['user_id']}")
                return jsonify({'message': 'User not found'}), 401
            print(f"✓ User found: {current_user.get('email')}")
        except Exception as e:
            print(f"❌ Token validation error: {str(e)}")
            return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/api/signup', methods=['POST', 'OPTIONS'])
def signup():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()

        # Validation
        required_fields = ['email', 'password', 'first_name', 'last_name', 'gender', 'school', 'grade_level', 'interests']
        missing_fields = [field for field in required_fields if not data.get(field)]
        
        if missing_fields:
            return jsonify({
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Check if user exists
        if mongo.db.users.find_one({'email': data['email']}):
            return jsonify({'message': 'User already exists'}), 409

        # Create user
        hashed_password = generate_password_hash(data['password'])
        user = {
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'email': data['email'],
            'gender': data['gender'],
            'school': data['school'],
            'grade_level': data['grade_level'],
            'interests': data['interests'],
            'password': hashed_password,
            'bio': None,
            'profile_pic': None,
            'created_at': datetime.utcnow()
        }

        result = mongo.db.users.insert_one(user)

        # Generate token
        token = jwt.encode({
            'user_id': str(result.inserted_id),
            'exp': datetime.utcnow() + timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': {
                'id': str(result.inserted_id),
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'email': data['email']
            }
        }), 201
        
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        data = request.get_json()

        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing email or password'}), 400

        user = mongo.db.users.find_one({'email': data['email']})

        if not user or not check_password_hash(user['password'], data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401

        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(days=7)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'email': user['email']
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/profile', methods=['GET', 'OPTIONS'])
def get_profile():
    if request.method == 'OPTIONS':
        return '', 200

    # Get current user from token
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
    except Exception as e:
        return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

    return jsonify({
        'user': {
            'id': str(current_user['_id']),
            'first_name': current_user['first_name'],
            'last_name': current_user['last_name'],
            'email': current_user['email'],
            'gender': current_user.get('gender'),
            'school': current_user.get('school'),
            'grade_level': current_user.get('grade_level'),
            'interests': current_user.get('interests', []),
            'bio': current_user.get('bio'),
            'profile_pic': current_user.get('profile_pic'),
            'created_at': current_user['created_at'].isoformat()
        }
    }), 200

@app.route('/api/user/<user_id>', methods=['GET', 'OPTIONS'])
def get_user_by_id(user_id):
    if request.method == 'OPTIONS':
        return '', 200

    # Get current user from token
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
    except Exception as e:
        return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

    try:
        # Find the user by ID
        user = mongo.db.users.find_one({'_id': ObjectId(user_id)})

        if not user:
            return jsonify({'message': 'User not found'}), 404

        return jsonify({
            'user': {
                'id': str(user['_id']),
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'profile_pic': user.get('profile_pic'),
                'bio': user.get('bio')
            }
        }), 200

    except Exception as e:
        print(f"Error fetching user: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/user/events', methods=['GET', 'OPTIONS'])
def get_user_events():
    if request.method == 'OPTIONS':
        return '', 200

    # Get current user from token
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
    except Exception as e:
        return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

    try:
        user_id = str(current_user['_id'])
        print(f"🔍 Fetching events for user_id: {user_id}")

        # Find all events where this user is registered
        # Assuming events have a 'registered_users' array field with user IDs
        registered_events = mongo.db.events.find({
            'registered_users': user_id
        }).sort('date', 1)

        events_list = []
        for event in registered_events:
            events_list.append({
                'id': str(event['_id']),
                'title': event.get('title'),
                'description': event.get('description'),
                'date': event.get('date'),
                'time': event.get('time'),
                'location': event.get('location'),
                'category': event.get('category'),
                'image': event.get('image'),
                'host': event.get('host'),
                'school': event.get('school')
            })

        print(f"✓ Found {len(events_list)} events for user")

        return jsonify({
            'events': events_list,
            'count': len(events_list)
        }), 200

    except Exception as e:
        print(f"❌ Error fetching user events: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/events/categories', methods=['GET', 'OPTIONS'])
def get_event_categories():
    if request.method == 'OPTIONS':
        return '', 200

    # Get current user from token
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
    except Exception as e:
        return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

    try:
        # Get user's school to filter events
        user_school = current_user.get('school')

        # Define categories with their gradients
        categories = [
            {
                'name': 'Sports',
                'gradient': 'radial-gradient(circle, #ffecd2 0%, #fcb69f 50%, #fdcb6e 100%)'
            },
            {
                'name': 'Music',
                'gradient': 'radial-gradient(circle at 40% 30%, rgba(240, 147, 251, 0.9) 0%, rgba(245, 87, 108, 0.7) 50%, rgba(240, 147, 251, 0.4) 100%)'
            },
            {
                'name': 'Art',
                'gradient': 'radial-gradient(circle at 50% 50%, rgba(79, 172, 254, 0.9) 0%, rgba(0, 242, 254, 0.7) 50%, rgba(79, 172, 254, 0.4) 100%)'
            },
            {
                'name': 'Technology',
                'gradient': 'radial-gradient(circle at 35% 45%, rgba(67, 233, 123, 0.9) 0%, rgba(56, 249, 215, 0.7) 50%, rgba(67, 233, 123, 0.4) 100%)'
            },
            {
                'name': 'Science',
                'gradient': 'radial-gradient(circle at 45% 35%, rgba(250, 112, 154, 0.9) 0%, rgba(254, 225, 64, 0.7) 50%, rgba(250, 112, 154, 0.4) 100%)'
            },
            {
                'name': 'Reading',
                'gradient': 'radial-gradient(circle, #d4b5f7 0%, #b3e5fc 100%)'
            },
            {
                'name': 'Gaming',
                'gradient': 'radial-gradient(circle, #eb3349 0%, #f093fb 50%, #764ba2 100%)'
            },
            {
                'name': 'Cooking',
                'gradient': 'radial-gradient(circle at 40% 40%, rgba(255, 154, 86, 0.9) 0%, rgba(255, 106, 136, 0.7) 50%, rgba(255, 154, 86, 0.4) 100%)'
            },
            {
                'name': 'Travel',
                'gradient': 'radial-gradient(circle, #4facfe 0%, #3cc9c9 50%, #43e97b 100%)'
            }
        ]

        # Count events for each category at the user's school
        categories_with_counts = []
        for category in categories:
            count = mongo.db.events.count_documents({
                'category': category['name'],
                'school': user_school
            })
            categories_with_counts.append({
                'name': category['name'],
                'gradient': category['gradient'],
                'events': count
            })

        return jsonify({'categories': categories_with_counts}), 200

    except Exception as e:
        print(f"Error fetching categories: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/events/category/<category_name>', methods=['GET', 'OPTIONS'])
def get_events_by_category(category_name):
    if request.method == 'OPTIONS':
        return '', 200

    # Get current user from token
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
    except Exception as e:
        return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

    try:
        # Get user's school to filter events
        user_school = current_user.get('school')

        # Find all events in this category at the user's school
        events = mongo.db.events.find({
            'category': category_name,
            'school': user_school
        }).sort('date', 1)

        # Convert to list and format
        events_list = []
        for event in events:
            events_list.append({
                'id': str(event['_id']),
                'title': event.get('title'),
                'description': event.get('description'),
                'date': event.get('date'),
                'time': event.get('time'),
                'location': event.get('location'),
                'category': event.get('category'),
                'image': event.get('image'),
                'host': event.get('host'),
                'school': event.get('school')
            })

        return jsonify({
            'category': category_name,
            'events': events_list
        }), 200

    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/events/create', methods=['POST', 'OPTIONS'])
def create_event():
    if request.method == 'OPTIONS':
        return '', 200

    # Get current user from token
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
    except Exception as e:
        return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

    try:
        event_data = request.get_json()

        # Validation
        required_fields = ['title', 'description', 'category', 'date', 'time', 'location']
        missing_fields = [field for field in required_fields if not event_data.get(field)]

        if missing_fields:
            return jsonify({
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Get host info from current user
        host_name = f"{current_user.get('first_name', '')} {current_user.get('last_name', '')}".strip()
        if not host_name:
            host_name = current_user.get('email', 'Unknown Host')

        # Create event document
        new_event = {
            'title': event_data['title'],
            'description': event_data['description'],
            'category': event_data['category'],
            'date': event_data['date'],
            'time': event_data['time'],
            'start_time': event_data.get('start_time'),
            'end_time': event_data.get('end_time'),
            'location': event_data['location'],
            'school_years': event_data.get('school_years', 'All'),
            'genders': event_data.get('genders', 'All'),
            'image': event_data['image'],
            'host': host_name,
            'host_id': str(current_user['_id']),
            'school': current_user.get('school'),
            'registered_users': [],
            'created_at': datetime.utcnow()
        }

        result = mongo.db.events.insert_one(new_event)

        # Return created event
        created_event = {
            'id': str(result.inserted_id),
            'title': new_event['title'],
            'description': new_event['description'],
            'category': new_event['category'],
            'date': str(new_event['date']),
            'time': new_event['time'],
            'location': new_event['location'],
            'image': new_event['image'],
            'host': new_event['host'],
            'host_id': new_event['host_id'],
            'school': new_event['school'],
            'attendees_count': 0,
            'user_rsvp': False
        }

        return jsonify({
            'message': 'Event created successfully',
            'event': created_event
        }), 201

    except Exception as e:
        print(f"Error creating event: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/events/<event_id>', methods=['GET', 'OPTIONS'])
def get_event_by_id(event_id):
    if request.method == 'OPTIONS':
        return '', 200

    # Get current user from token
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
    except Exception as e:
        return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

    try:
        # Find the event by ID
        event = mongo.db.events.find_one({'_id': ObjectId(event_id)})

        if not event:
            return jsonify({'message': 'Event not found'}), 404

        # Check if user is registered
        registered_users = event.get('registered_users', [])
        user_registered = str(current_user['_id']) in [str(uid) for uid in registered_users]

        event_data = {
            'id': str(event['_id']),
            'title': event.get('title'),
            'description': event.get('description'),
            'date': str(event.get('date', '')),
            'time': event.get('time'),
            'location': event.get('location'),
            'category': event.get('category'),
            'image': event.get('image'),
            'host': event.get('host'),
            'host_id': event.get('host_id'),
            'school': event.get('school'),
            'school_years': event.get('school_years', 'All'),
            'genders': event.get('genders', 'All'),
            'attendees_count': len(registered_users),
            'user_rsvp': user_registered
        }

        return jsonify({'event': event_data}), 200

    except Exception as e:
        print(f"Error fetching event: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/events/all', methods=['GET', 'OPTIONS'])
def get_all_events():
    print(f"🔵 /api/events/all called with method: {request.method}")
    if request.method == 'OPTIONS':
        print("🔵 Returning OPTIONS response")
        return '', 200

    # Get current user from token
    token = request.headers.get('Authorization')
    print(f"🔵 Token present: {bool(token)}")
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token[7:]
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
    except Exception as e:
        return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

    try:
        # Get query parameters
        interests_only = request.args.get('interests_only', 'false').lower() == 'true'

        # Get user's school to filter events
        user_school = current_user.get('school')

        # Build query
        query = {'school': user_school}

        # Add interest filtering if requested
        if interests_only:
            user_interests = current_user.get('interests', [])
            print(f"User interests: {user_interests}")
            if user_interests:
                query['category'] = {'$in': user_interests}
            print(f"Query: {query}")

        # Find all events at the user's school, sorted by _id descending (most recent first)
        # Using _id for sorting since ObjectId contains timestamp
        events = mongo.db.events.find(query).sort('_id', -1)
        print(f"Found {mongo.db.events.count_documents(query)} events")

        # Convert to list and format
        events_list = []
        for event in events:
            # Check if user is registered
            registered_users = event.get('registered_users', [])
            user_registered = str(current_user['_id']) in [str(uid) for uid in registered_users]

            events_list.append({
                'id': str(event['_id']),
                'title': event.get('title'),
                'description': event.get('description'),
                'date': str(event.get('date', '')),
                'time': event.get('time'),
                'location': event.get('location'),
                'category': event.get('category'),
                'image': event.get('image'),
                'host': event.get('host'),
                'school': event.get('school'),
                'organizer': event.get('host', 'Unknown'),
                'attendees_count': len(registered_users),
                'user_rsvp': user_registered
            })

        return jsonify({'events': events_list}), 200

    except Exception as e:
        print(f"Error fetching all events: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)