# AI Science Builder - Frontend

A beautiful React + Vite frontend with Notion-inspired design for generating AI-powered science projects.

## 🎨 Features

### Pages
- **Home** - Hero section with CTAs, features, and how it works
- **Try It Free** - Interactive form with subject/topic/grade selection
- **Results Component** - Displays generated ideas, hypotheses, and visualizations
- **Pricing** - Three-tier pricing with FAQ section
- **Login/Dashboard** - Firebase authentication

### Design
- **Notion-inspired** blue and white theme
- **Responsive** mobile-first design
- **Modern UI** with smooth transitions and hover effects
- **Clean typography** using system fonts

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### 3. Make Sure Backend is Running
The frontend connects to: **http://localhost:8000**

To start the backend:
```bash
cd ../backend
.\run.ps1
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Footer.jsx          # Footer with links
│   ├── Navbar.jsx          # Navigation with active states
│   ├── ProtectedRoute.jsx  # Auth guard
│   └── ResultsComponent.jsx # Results display with tabs
├── contexts/
│   └── AuthContext.jsx     # Firebase auth context
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── TryIt.jsx           # Project generation form
│   ├── Pricing.jsx         # Pricing plans
│   ├── Login.jsx           # Authentication
│   └── Dashboard.jsx       # User dashboard
├── config/
│   ├── api.js              # Axios configuration
│   ├── firebase.js         # Firebase setup
│   └── supabase.js         # Supabase setup
├── App.jsx                 # Main app with routes
└── main.jsx                # Entry point
```

## 🎯 How to Use

### Try It Free Page (`/try`)

1. **Select Subject**: Choose from Biology, Chemistry, Physics, etc.
2. **Enter Topic** (optional): Specific topic or leave blank for AI to choose
3. **Select Grade**: Middle School, High School, or College
4. **Generate**: Click to create your project

### Results Display

The results component shows:
- **Project Idea Tab**: Full description
- **Hypothesis Tab**: Testable hypothesis with tips
- **Visualization Tab**: Sample data chart (downloadable)

### Features:
- Copy individual sections
- Download graph as PNG
- Generate another project
- View pricing options

## 🎨 Theme Customization

The theme is defined in `tailwind.config.js`:

```javascript
colors: {
  notion: {
    bg: '#ffffff',
    text: '#37352f',
    gray: '#787774',
    lightgray: '#f7f6f3',
    blue: '#2383e2',
    lightblue: '#e7f3ff',
  }
}
```

## 🔌 API Integration

The frontend connects to the backend at `http://localhost:8000`:

### Endpoints Used:
- `GET /api/idea` - Generate project ideas
- `GET /api/graph` - Generate visualizations
- `POST /api/report` - Generate reports (premium)

### Example API Call:
```javascript
import axios from 'axios';

const response = await axios.get('http://localhost:8000/api/idea', {
  params: {
    topic: 'biology - photosynthesis (Grade 9-12)'
  }
});
```

## 🔧 Environment Variables

Create `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
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
```

## 🧪 Testing the App

1. **Start Backend**:
   ```bash
   cd backend
   .\run.ps1
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Visit Pages**:
   - Home: http://localhost:5173/
   - Try It: http://localhost:5173/try
   - Pricing: http://localhost:5173/pricing

4. **Generate a Project**:
   - Go to `/try`
   - Select "Biology"
   - Enter topic "photosynthesis"
   - Select grade level
   - Click "Generate Project"

## 📦 Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Preview Production Build:
```bash
npm run preview
```

## 🎨 Components Guide

### ResultsComponent

Props:
```javascript
{
  results: {
    title: string,
    idea: string,
    hypothesis: string,
    graphBase64: string,
    graphDescription: string
  }
}
```

Features:
- Tabbed interface
- Copy to clipboard
- Download graph
- Generate another project

### Navbar

Features:
- Active route highlighting
- Responsive design
- Auth state awareness
- Notion-style branding

### Footer

Features:
- Product links
- Resource links
- Social links
- Copyright info

## 🚀 Deployment

### Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify:
```bash
npm install -g netlify-cli
netlify deploy
```

## 🎯 Key Features Implemented

✅ Home page with hero section and CTA  
✅ Try It page with subject/topic/grade inputs  
✅ Results component showing idea, hypothesis, and graph  
✅ Pricing page with 3 tiers  
✅ Navbar with active states  
✅ Footer with links  
✅ Notion-inspired blue/white theme  
✅ Backend API integration  
✅ Responsive mobile design  
✅ Loading states and error handling  

## 🐛 Troubleshooting

### "Failed to generate project"
- Make sure backend is running at http://localhost:8000
- Check that OpenAI API key is configured in backend/.env
- Check browser console for errors

### CORS Errors
- Backend must be running with CORS enabled for localhost:5173
- Check backend/main.py CORS configuration

### Styling Issues
- Run `npm install` to ensure Tailwind is installed
- Check that Tailwind directives are in index.css
- Clear browser cache

## 📝 Next Steps

1. Set up Firebase authentication
2. Configure Supabase for project storage
3. Add user profiles
4. Implement project history
5. Add export to PDF feature

## 🤝 Contributing

Feel free to customize the design and add new features!

## 📄 License

MIT License

