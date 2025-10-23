# AI Science Builder

A full-stack application with FastAPI backend and React frontend, featuring Firebase Authentication, Supabase database, and Lemon Squeezy payment integration.

## 🏗️ Project Structure

```
ai-science-builder/
├── backend/              # FastAPI backend
│   ├── main.py          # Main application entry point
│   ├── config.py        # Configuration settings
│   ├── database.py      # Supabase client setup
│   ├── auth.py          # Firebase authentication
│   ├── payments.py      # Lemon Squeezy integration
│   ├── requirements.txt # Python dependencies
│   └── env.example      # Environment variables template
│
└── frontend/            # React + Vite frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── contexts/    # React contexts (Auth)
    │   └── config/      # Configuration files
    ├── package.json     # Node dependencies
    ├── vite.config.js   # Vite configuration
    ├── tailwind.config.js # Tailwind CSS config
    └── env.example      # Environment variables template
```

## 🚀 Features

- **FastAPI Backend**: High-performance Python backend with automatic API documentation
- **React Frontend**: Modern React 18 with React Router for navigation
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Vite**: Lightning-fast build tool and development server
- **Firebase Auth**: Secure authentication with email/password and Google sign-in
- **Supabase**: PostgreSQL database with real-time capabilities
- **Lemon Squeezy**: Payment processing integration (placeholder implementation)

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- A Supabase account and project
- A Firebase project
- A Lemon Squeezy account (optional, for payments)

## ⚙️ Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables:**
   - Copy `env.example` to `.env`:
     ```bash
     copy env.example .env  # Windows
     cp env.example .env    # macOS/Linux
     ```
   - Fill in your actual credentials in `.env`

6. **Set up Firebase Admin:**
   - Download your Firebase service account key from Firebase Console
   - Save it as `firebase-credentials.json` in the backend directory
   - Update `FIREBASE_CREDENTIALS_PATH` in `.env`

7. **Run the backend server:**
   ```bash
   python main.py
   ```
   
   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `env.example` to `.env`:
     ```bash
     copy env.example .env  # Windows
     cp env.example .env    # macOS/Linux
     ```
   - Fill in your actual credentials in `.env`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🔑 Environment Variables

### Backend (.env)

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Firebase Configuration
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Lemon Squeezy Configuration
LEMON_SQUEEZY_API_KEY=your-lemon-squeezy-api-key
LEMON_SQUEEZY_STORE_ID=your-store-id

# Application Configuration
DEBUG=False
```

### Frontend (.env)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Lemon Squeezy Configuration
VITE_LEMON_SQUEEZY_STORE_ID=your-store-id
```

## 🗄️ Database Setup (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings > API
3. Create your database tables using the Supabase SQL editor or through the API

## 🔐 Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and choose sign-in methods (Email/Password, Google)
3. Get your web app configuration from Project Settings
4. Download the service account key for the backend

## 💳 Lemon Squeezy Setup (Optional)

1. Create an account at [lemonsqueezy.com](https://lemonsqueezy.com)
2. Create a store and products
3. Get your API key from Settings > API
4. Update the environment variables with your credentials

## 🏃‍♂️ Running in Production

### Backend

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🛠️ Available Scripts

### Backend

- `python main.py` - Run the development server
- `uvicorn main:app --reload` - Run with auto-reload

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Key Files

### Backend

- **main.py**: Main FastAPI application with CORS configuration and basic routes
- **config.py**: Centralized configuration management
- **database.py**: Supabase client initialization and database helpers
- **auth.py**: Firebase Admin SDK integration for token verification
- **payments.py**: Lemon Squeezy API integration

### Frontend

- **src/App.jsx**: Main application component with routing
- **src/contexts/AuthContext.jsx**: Authentication context using Firebase
- **src/config/firebase.js**: Firebase client configuration
- **src/config/supabase.js**: Supabase client configuration
- **src/config/api.js**: Axios instance with auth interceptors

## 🎨 UI Components

The application includes:
- Responsive navbar with authentication state
- Landing page with hero section and features
- Login/Signup page with email and Google authentication
- Protected dashboard with user information
- Protected route wrapper component

## 🔒 Security Best Practices

- Environment variables are never committed to version control
- Firebase tokens are verified on the backend
- CORS is properly configured
- API routes can be protected with authentication middleware
- Sensitive credentials use environment variables

## 📝 Next Steps

1. Customize the UI to match your brand
2. Create database tables in Supabase for your data model
3. Add more API endpoints in the backend
4. Implement actual payment flows with Lemon Squeezy
5. Add error tracking (e.g., Sentry)
6. Set up CI/CD pipeline
7. Deploy to production (Vercel/Netlify for frontend, Railway/Render for backend)

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

This project is open source and available under the MIT License.

