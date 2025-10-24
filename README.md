# AI Science Builder 🔬🤖

An AI-powered science project generator with a FastAPI backend and React frontend. Generate creative science projects with hypotheses, data visualizations, and comprehensive PDF reports powered by Google Gemini (FREE) or OpenAI GPT-4o mini and Matplotlib.

[![GitHub stars](https://img.shields.io/github/stars/Hassan-Cheema/ai-science-project-builder?style=social)](https://github.com/Hassan-Cheema/ai-science-project-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Live Demo

**🌐 Live Application:** [Add your deployment URL here]  
**📚 API Documentation:** [Add your API docs URL here]/docs  
**📊 API Status:** [Add your API health URL here]/health

> **Note:** Replace the URLs above with your actual deployment links once deployed!

## ✨ Key Features

- 🤖 **AI Project Generation** - Google Gemini (FREE) or OpenAI GPT-4o mini generates unique science project ideas
- 📊 **Data Visualization** - Matplotlib creates beautiful sample data graphs
- 📄 **PDF Reports** - Download comprehensive project reports with embedded visualizations
- 🔐 **Firebase Authentication** - Secure email/password and Google sign-in
- 💾 **Supabase Integration** - PostgreSQL database for project storage
- 💳 **Payment Integration** - Lemon Squeezy for subscription management
- 🐳 **Docker Support** - Full containerization for easy deployment

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

## 🎯 What You Can Do

1. **Generate Science Projects** - Enter a subject, topic, and grade level
2. **Get AI Ideas** - Receive creative, grade-appropriate project ideas
3. **View Hypotheses** - Get testable hypotheses for your projects
4. **See Data** - View sample data visualizations (bar charts)
5. **Download PDFs** - Export complete project reports as professional PDFs
6. **Manage Subscriptions** - Free, Student, and Educator tiers

## 📖 Usage Guide

### Getting Started

1. **Access the Application**
   - Navigate to the homepage at `http://localhost:5173` (local) or your deployed URL
   - No login required to try the basic features!

2. **Generate Your First Project**
   - Go to the "Try It" page
   - Enter a subject (e.g., "Biology", "Physics", "Chemistry")
   - Enter a topic (e.g., "photosynthesis", "gravity", "chemical reactions")
   - Select a grade level (K-5, 6-8, 9-12, or College)
   - Click "Generate Project"

3. **View Results**
   - **Title & Idea:** See your AI-generated project idea
   - **Hypothesis:** Get a testable, scientific hypothesis
   - **Visualization:** View sample data charts
   - **Download:** Export as PDF for offline use

4. **Create an Account (Optional)**
   - Click "Login" in the navigation bar
   - Sign up with email or Google
   - Save and manage your projects
   - Access premium features

### Using the AI Mentor

1. Navigate to the "AI Mentor" page
2. Ask questions about your science project
3. Get personalized guidance and suggestions
4. Receive step-by-step help with methodology

### API Usage

**Generate a project idea:**
```bash
curl "http://localhost:8000/api/idea?topic=biology&grade=9-12&subject=science"
```

**Generate a graph:**
```bash
curl "http://localhost:8000/api/graph?title=Plant+Growth&categories=Day1,Day2,Day3&values=5,10,15"
```

**Check API health:**
```bash
curl "http://localhost:8000/health"
```

**Interactive API Documentation:**
Visit `http://localhost:8000/docs` for full Swagger UI documentation with try-it-out functionality.

### Managing Projects

**Save a Project (requires authentication):**
```bash
curl -X GET "http://localhost:8000/api/idea?topic=physics&save_to_db=true" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

**List Your Projects:**
```bash
curl "http://localhost:8000/api/projects" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

**Get a Specific Project:**
```bash
curl "http://localhost:8000/api/projects/{project_id}" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

## 🏗️ Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini** - FREE AI project idea generation (primary)
- **OpenAI GPT-4o mini** - AI project idea generation (fallback)
- **Matplotlib** - Data visualization and graph creation
- **Firebase Admin** - Token verification and authentication
- **Supabase** - PostgreSQL database client
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling (Notion-inspired theme)
- **React Router** - Client-side routing
- **Firebase Auth** - User authentication
- **jsPDF** - Client-side PDF generation
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Production web server for frontend

## 📋 Prerequisites

### For Local Development:
- Python 3.11 or higher
- Node.js 20 or higher
- npm or yarn
- **Google Gemini API key (FREE)** or OpenAI API key (for AI features)
- Firebase project (for authentication)
- Supabase account (optional, for database)
- Lemon Squeezy account (optional, for payments)

### For Docker Deployment:
- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB RAM available
- **Google Gemini API key (FREE)** or OpenAI API key (required)

## 🚀 Quick Start

### Option 1: Docker (Recommended) 🐳

**Fastest way to get started - just 3 commands!**

```bash
# 1. Copy environment file
cp env.docker.example .env

# 2. Edit .env and add your FREE Gemini API key
# GEMINI_API_KEY=AIza-your-key-here
# Get your free key at: https://aistudio.google.com/

# 3. Start everything
docker-compose up -d
```

**Access your app:**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

📚 **Gemini Setup Guide**: See [GEMINI_SETUP.md](./GEMINI_SETUP.md) for FREE AI!  
📚 **Full Docker Guide**: See documentation in README

---

### Option 2: Local Development 💻

## ⚙️ Local Setup Instructions

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

### Backend (.env) - Required for Local Development

```env
# Google Gemini Configuration (FREE - Recommended!)
GEMINI_API_KEY=AIza-your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash

# OpenAI Configuration (Optional - Fallback)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini

# Supabase Configuration (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Firebase Configuration (Optional)
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Lemon Squeezy Configuration (Optional)
LEMON_SQUEEZY_API_KEY=your-lemon-squeezy-api-key
LEMON_SQUEEZY_STORE_ID=your-store-id

# Application Configuration
DEBUG=False
```

### Frontend (.env) - Required for Local Development

```env
# Firebase Configuration (for authentication)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Supabase Configuration (optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Lemon Squeezy Configuration (optional)
VITE_LEMON_SQUEEZY_STORE_ID=your-store-id
```

**Note**: OpenAI API key is REQUIRED for AI features. Firebase is required for authentication. Others are optional.

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

### Interactive API Docs

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/idea` | GET | Generate AI project idea |
| `/api/graph` | GET | Generate sample data visualization |
| `/api/report` | POST | Generate comprehensive markdown report |
| `/api/projects` | GET/POST | Manage saved projects |

### Example Usage

```bash
# Generate a project idea
curl "http://localhost:8000/api/idea?topic=biology&grade=8"

# Generate a graph
curl "http://localhost:8000/api/graph?topic=plant%20growth"

# Generate full report
curl -X POST "http://localhost:8000/api/report" \
  -H "Content-Type: application/json" \
  -d '{"idea": "...", "hypothesis": "...", "graph_description": "..."}'
```

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

## 📸 Screenshots

*Add screenshots of your application here once you capture them!*

### Homepage
![Homepage](./assets/homepage-screenshot.png)
*Landing page with hero section and feature highlights*

### AI Mentor
![AI Mentor Interface](./assets/mentor-screenshot.png)
*Interactive AI mentor for science project guidance*

### Project Generator
![Project Generator](./assets/project-generator-screenshot.png)
*Generate science projects with AI*

### Generated Results
![Results with Visualization](./assets/results-screenshot.png)
*View generated hypotheses and data visualizations*

> **To add screenshots:** Take screenshots of your app, save them in the `assets/` directory with descriptive names, and they'll appear here automatically!

## 🔒 Security Best Practices

- Environment variables are never committed to version control
- Firebase tokens are verified on the backend
- CORS is properly configured
- API routes can be protected with authentication middleware
- Sensitive credentials use environment variables

## 📖 Documentation

- **[DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md)** - 5-minute Docker setup
- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Complete Docker guide
- **[DOCKER_FILES_SUMMARY.md](./DOCKER_FILES_SUMMARY.md)** - Docker architecture overview
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Firebase authentication setup
- **Backend README** - Backend-specific documentation
- **Frontend README** - Frontend-specific documentation

## 🎨 Pages & Features

### Frontend Pages

- **Home** (`/`) - Landing page with hero section and features
- **Try It** (`/try`) - Generate science projects (no login required)
- **Pricing** (`/pricing`) - Subscription plans (Free, Student, Educator)
- **Login** (`/login`) - Email/password and Google sign-in
- **Dashboard** (`/dashboard`) - Protected page with user info and subscription

### Components

- **Navbar** - Responsive navigation with auth state
- **Footer** - Site-wide footer with links
- **Results** - Tabbed interface showing idea, hypothesis, and graph
- **Protected Route** - HOC for route protection

## 🔒 Security Features

- ✅ Environment variables never committed
- ✅ Firebase token verification on backend
- ✅ CORS properly configured
- ✅ Authenticated API routes
- ✅ Secure password handling
- ✅ Input validation with Pydantic

## 🚢 Deployment Options

### Docker (Recommended)

```bash
# Production
docker-compose up -d

# Development with hot reload
docker-compose -f docker-compose.dev.yml up
```

### Cloud Platforms

- **AWS ECS** - Use docker-compose.yml
- **Google Cloud Run** - Push images to GCR
- **DigitalOcean** - App Platform or Droplets
- **Azure** - Container Instances
- **Heroku** - Use Docker containers

### Traditional Hosting

- **Frontend**: Vercel, Netlify, Cloudflare Pages
- **Backend**: Railway, Render, Fly.io, DigitalOcean

## 📊 Performance

### Docker Production:
- **Backend**: ~500MB RAM, 10% CPU idle
- **Frontend**: ~50MB RAM, <1% CPU
- **Build time**: ~3-5 minutes
- **Startup time**: ~10 seconds

### Features:
- ✅ Multi-stage builds (optimized images)
- ✅ Nginx with gzip compression
- ✅ Static asset caching
- ✅ Health checks
- ✅ Auto-restart

## 🐛 Troubleshooting

### Docker Issues

```bash
# Check logs
docker-compose logs -f

# Restart services
docker-compose restart

# Clean start
docker-compose down -v && docker-compose up --build
```

### Backend Issues

```bash
# Check if running
curl http://localhost:8000/health

# View backend logs
docker-compose logs backend
```

### Frontend Issues

```bash
# Check if running
curl http://localhost

# View frontend logs
docker-compose logs frontend
```

## 📝 Next Steps

1. ✅ Set up OpenAI API key (required)
2. ✅ Configure Firebase authentication
3. ⬜ Set up Supabase database tables
4. ⬜ Configure Lemon Squeezy for payments
5. ⬜ Customize UI/branding
6. ⬜ Add more science subjects
7. ⬜ Implement user project history
8. ⬜ Add social sharing features
9. ⬜ Set up monitoring (Sentry, LogRocket)
10. ⬜ Deploy to production

## 💡 Use Cases

- **Students** - Generate science fair project ideas
- **Teachers** - Get project ideas for classroom assignments
- **Parents** - Help kids with homework and projects
- **Educators** - Create curricula and lesson plans
- **Science Enthusiasts** - Explore interesting experiments

## 🤝 Want to Contribute? Here's How!

We love contributions! Whether you're fixing bugs, adding features, or improving documentation, your help makes this project better for everyone. Here's how to get started:

### 🌟 Ways to Contribute

1. **Report Bugs** 🐛
   - Found a bug? [Open an issue](https://github.com/Hassan-Cheema/ai-science-project-builder/issues/new)
   - Include: What happened, what you expected, steps to reproduce
   - Add screenshots if possible!

2. **Suggest Features** 💡
   - Have an idea? [Create a feature request](https://github.com/Hassan-Cheema/ai-science-project-builder/issues/new)
   - Describe the feature, its benefits, and potential use cases
   - Discuss implementation ideas

3. **Improve Documentation** 📚
   - Fix typos, clarify instructions, add examples
   - Update README, add tutorials, improve code comments
   - Documentation is just as important as code!

4. **Submit Code** 💻
   - Fix bugs, implement features, optimize performance
   - Follow our coding standards and best practices
   - Add tests for new features

### 🛠️ Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/ai-science-project-builder.git
   cd ai-science-project-builder
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Set up your development environment**
   ```bash
   # Backend setup
   cd backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   
   # Frontend setup
   cd ../frontend
   npm install
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Update documentation as needed

5. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   pytest
   
   # Frontend (if you add tests)
   cd frontend
   npm test
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   # Use conventional commits: feat:, fix:, docs:, style:, refactor:, test:, chore:
   ```

7. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Then open a Pull Request on GitHub
   ```

### 📋 Pull Request Guidelines

- **Title:** Clear and descriptive (e.g., "Add support for chemistry projects")
- **Description:** Explain what changes you made and why
- **Testing:** Describe how you tested your changes
- **Screenshots:** Add before/after screenshots for UI changes
- **Documentation:** Update README or docs if needed
- **Small PRs:** Keep changes focused and manageable

### 🎨 Code Style

**Backend (Python):**
- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions and classes
- Keep functions focused and single-purpose

**Frontend (JavaScript/React):**
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Keep components small and reusable

### ✅ Checklist Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] Tests added/updated (if applicable)
- [ ] No new warnings or errors
- [ ] Tested locally and works as expected

### 🌱 First Time Contributing?

**Welcome!** Here are some good first issues to get started:

- Fix typos in documentation
- Add more test cases
- Improve error messages
- Add input validation
- Enhance UI components
- Add more chart types
- Improve mobile responsiveness

Look for issues labeled `good first issue` or `help wanted` in the GitHub issues!

### 💬 Questions?

- **General questions:** Open a [GitHub Discussion](https://github.com/Hassan-Cheema/ai-science-project-builder/discussions)
- **Bug reports:** Create an [Issue](https://github.com/Hassan-Cheema/ai-science-project-builder/issues)
- **Feature ideas:** Start a [Discussion](https://github.com/Hassan-Cheema/ai-science-project-builder/discussions) first!

### 🙌 Recognition

All contributors will be recognized in our [Contributors](https://github.com/Hassan-Cheema/ai-science-project-builder/graphs/contributors) page. Thank you for making this project better!

---

**Not ready to code?** You can still help by:
- ⭐ Starring the repository
- 📢 Sharing the project with others
- 🐛 Reporting bugs you find
- 💬 Helping answer questions in discussions
- 📖 Improving documentation

Every contribution matters! 🎉

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **OpenAI** - GPT-4o mini for AI generation
- **Firebase** - Authentication services
- **Supabase** - Database and backend services
- **Tailwind CSS** - Beautiful UI styling
- **FastAPI** - High-performance Python framework
- **React** - Modern UI library

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review docker-compose logs
3. Open an issue on GitHub
4. Check API documentation at `/docs`

---

**Made with ❤️ for science education**

🚀 **Ready to generate amazing science projects!**

