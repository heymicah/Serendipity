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

# CORS configuration
CORS(app,
     resources={r"/api/*": {
         "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": True
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

# Add after_request handler for CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Allow OPTIONS requests to pass through for CORS preflight
        if request.method == 'OPTIONS':
            return '', 200

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
                'email': data['email'],
                'interests': data['interests']
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
                'email': user['email'],
                'interests': user.get('interests', [])
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/profile', methods=['GET', 'OPTIONS'])
@token_required
def get_profile(current_user):
    return jsonify({
        'user': {
            'id': str(current_user['_id']),
            'first_name': current_user['first_name'],
            'last_name': current_user['last_name'],
            'email': current_user['email'],
            'gender': current_user.get('gender'),
            'school': current_user.get('school'),
            'grade_level': current_user.get('grade_level'),
            'interests': current_user.get('interests'),
            'bio': current_user.get('bio'),
            'profile_pic': current_user.get('profile_pic'),
            'created_at': current_user['created_at'].isoformat()
        }
    }), 200

# Event routes
@app.route('/api/events', methods=['GET', 'OPTIONS'])
@token_required
def get_events(current_user):
    try:
        # Get query parameters for filtering
        category = request.args.get('category')
        interests_only = request.args.get('interests_only', 'false').lower() == 'true'

        # Build query
        query = {}
        if category:
            query['category'] = category
        elif interests_only:
            # Filter events by user's interests
            user_interests = current_user.get('interests', [])
            print(f"User interests: {user_interests}")
            if user_interests:
                query['category'] = {'$in': user_interests}
            print(f"Query: {query}")

        # Fetch events from database, sorted by created_at (newest first)
        events = list(mongo.db.events.find(query).sort('created_at', -1))
        print(f"Found {len(events)} events")

        # Format events for response
        formatted_events = []
        for event in events:
            # Check if current user has RSVP'd
            registered_users = event.get('registered_users', [])
            user_rsvp = str(current_user['_id']) in [str(attendee) for attendee in registered_users]

            formatted_events.append({
                'id': str(event['_id']),
                'title': event['title'],
                'description': event['description'],
                'location': event['location'],
                'date': str(event.get('date', '')),
                'time': event.get('time', ''),
                'organizer': event.get('host', 'Unknown'),
                'organizer_id': str(event.get('organizer_id', '')),
                'category': event.get('category', 'General'),
                'capacity': event.get('capacity'),
                'attendees_count': len(registered_users),
                'image': event.get('image', ''),
                'user_rsvp': user_rsvp,
                'created_at': event.get('created_at', event.get('date', '')).isoformat() if hasattr(event.get('created_at', event.get('date', '')), 'isoformat') else str(event.get('created_at', ''))
            })

        return jsonify({'events': formatted_events}), 200

    except Exception as e:
        print(f"Get events error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/events', methods=['POST'])
@token_required
def create_event(current_user):
    try:
        data = request.get_json()

        # Validation
        required_fields = ['title', 'description', 'location', 'date', 'category']
        missing_fields = [field for field in required_fields if not data.get(field)]

        if missing_fields:
            return jsonify({
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Create event
        event = {
            'title': data['title'],
            'description': data['description'],
            'location': data['location'],
            'date': data['date'],
            'time': data.get('time', ''),
            'organizer': f"{current_user['first_name']} {current_user['last_name']}",
            'organizer_id': current_user['_id'],
            'category': data['category'],
            'capacity': data.get('capacity'),
            'rsvp_attendees': [current_user['_id']],  # Organizer is automatically RSVP'd
            'image': data.get('image', ''),
            'created_at': datetime.utcnow()
        }

        result = mongo.db.events.insert_one(event)

        return jsonify({
            'message': 'Event created successfully',
            'event': {
                'id': str(result.inserted_id),
                'title': event['title'],
                'description': event['description'],
                'location': event['location'],
                'date': event['date'],
                'time': event['time'],
                'organizer': event['organizer'],
                'category': event['category'],
                'capacity': event['capacity'],
                'attendees_count': 1
            }
        }), 201

    except Exception as e:
        print(f"Create event error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/events/<event_id>/rsvp', methods=['POST', 'DELETE', 'OPTIONS'])
@token_required
def rsvp_event(current_user, event_id):
    try:
        # Find the event
        event = mongo.db.events.find_one({'_id': ObjectId(event_id)})

        if not event:
            return jsonify({'message': 'Event not found'}), 404

        user_id = current_user['_id']
        rsvp_attendees = event.get('rsvp_attendees', [])

        if request.method == 'POST':
            # RSVP to event
            if user_id in rsvp_attendees:
                return jsonify({'message': 'Already RSVP\'d to this event'}), 400

            # Check capacity
            capacity = event.get('capacity')
            if capacity and len(rsvp_attendees) >= capacity:
                return jsonify({'message': 'Event is at full capacity'}), 400

            # Add user to attendees
            mongo.db.events.update_one(
                {'_id': ObjectId(event_id)},
                {'$push': {'rsvp_attendees': user_id}}
            )

            return jsonify({
                'message': 'RSVP successful',
                'attendees_count': len(rsvp_attendees) + 1
            }), 200

        elif request.method == 'DELETE':
            # Cancel RSVP
            if user_id not in rsvp_attendees:
                return jsonify({'message': 'Not RSVP\'d to this event'}), 400

            # Remove user from attendees
            mongo.db.events.update_one(
                {'_id': ObjectId(event_id)},
                {'$pull': {'rsvp_attendees': user_id}}
            )

            return jsonify({
                'message': 'RSVP cancelled',
                'attendees_count': len(rsvp_attendees) - 1
            }), 200

    except Exception as e:
        print(f"RSVP error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

@app.route('/api/events/<event_id>', methods=['GET', 'OPTIONS'])
@token_required
def get_event(current_user, event_id):
    try:
        event = mongo.db.events.find_one({'_id': ObjectId(event_id)})

        if not event:
            return jsonify({'message': 'Event not found'}), 404

        # Check if current user has RSVP'd
        user_rsvp = current_user['_id'] in event.get('rsvp_attendees', [])

        return jsonify({
            'event': {
                'id': str(event['_id']),
                'title': event['title'],
                'description': event['description'],
                'location': event['location'],
                'date': event['date'],
                'time': event.get('time', ''),
                'organizer': event['organizer'],
                'organizer_id': str(event['organizer_id']),
                'category': event.get('category', 'General'),
                'capacity': event.get('capacity'),
                'attendees_count': len(event.get('rsvp_attendees', [])),
                'image': event.get('image', ''),
                'user_rsvp': user_rsvp,
                'created_at': event['created_at'].isoformat()
            }
        }), 200

    except Exception as e:
        print(f"Get event error: {e}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)