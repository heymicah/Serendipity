# Serendipity

A full-stack authentication app with React, Flask, and MongoDB.

## Setup

### Backend

1. Install MongoDB locally or use MongoDB Atlas
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Update `.env` file with your MongoDB URI and secret key

6. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Features

- User signup with email and password
- User login with JWT authentication
- Protected home page displaying user profile
- Session persistence using localStorage
- Responsive design

## Tech Stack

**Frontend:**
- React
- React Router
- Context API for state management

**Backend:**
- Flask
- Flask-PyMongo
- JWT for authentication
- Werkzeug for password hashing

**Database:**
- MongoDB