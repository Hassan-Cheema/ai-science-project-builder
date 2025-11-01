# AI Science Builder - Backend API

FastAPI backend with OpenAI GPT-4o mini integration and Matplotlib visualizations for generating science project ideas, graphs, and reports.

## 🚀 Features

- **AI-Powered Project Ideas**: Generate creative science project ideas and hypotheses using OpenAI GPT-4o mini
- **Data Visualizations**: Create bar charts, line graphs, and scatter plots with Matplotlib
- **Report Generation**: Automatically generate comprehensive markdown reports
- **Supabase Integration**: Store projects in PostgreSQL database
- **Firebase Authentication**: Secure API endpoints with Firebase Auth
- **Async Endpoints**: All endpoints are asynchronous for better performance

## 📋 Prerequisites

- Python 3.8+
- OpenAI API key (for GPT-4o mini)
- Supabase account and project
- Firebase project (optional, for authentication)

## ⚙️ Installation

1. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your credentials:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_KEY`: Your Supabase anon/service key
   - `FIREBASE_CREDENTIALS_PATH`: Path to Firebase credentials JSON

4. **Set up Supabase database:**
   
   Run the SQL schema in your Supabase SQL Editor:
   ```bash
   # Copy contents of supabase_schema.sql to Supabase SQL Editor
   ```

5. **Run the server:**
   ```bash
   python main.py
   
   # Or with uvicorn
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`

## 📚 API Endpoints

### Health Check

#### `GET /`
Root endpoint with API information
```json
{
  "message": "AI Science Builder API",
  "status": "running",
  "version": "1.0.0",
  "endpoints": {
    "idea": "/api/idea",
    "graph": "/api/graph",
    "report": "/api/report",
    "projects": "/api/projects"
  }
}
```

#### `GET /health`
Health check endpoint
```json
{
  "status": "healthy"
}
```

### Project Endpoints

#### `GET /api/idea`
Generate an AI-powered science project idea and hypothesis

**Query Parameters:**
- `topic` (optional): Topic for the project idea
- `save_to_db` (optional, default: false): Whether to save to database

**Example Request:**
```bash
curl "http://localhost:8000/api/idea?topic=climate%20change&save_to_db=true"
```

**Example Response:**
```json
{
  "title": "The Impact of Ocean Acidification on Coral Reef Ecosystems",
  "idea": "This project investigates how increasing CO2 levels affect ocean pH and subsequently impact coral reef health...",
  "hypothesis": "Increased ocean acidification will lead to decreased coral calcification rates and increased bleaching events.",
  "project_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### `GET /api/graph`
Generate a chart and return as base64 encoded image

**Query Parameters:**
- `title` (optional, default: "Sample Data Analysis"): Chart title
- `chart_type` (optional, default: "bar"): Type of chart (bar, line, scatter)
- `categories` (optional): Comma-separated category names
- `values` (optional): Comma-separated values

**Example Request:**
```bash
curl "http://localhost:8000/api/graph?title=Temperature%20Data&chart_type=bar&categories=Jan,Feb,Mar,Apr,May&values=20,25,30,28,22"
```

**Example Response:**
```json
{
  "graph_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "description": "Bar chart showing 5 categories with values ranging from 20 to 30. Average value: 25.0. Highest: Mar (30). Lowest: Jan (20)."
}
```

To display the image in HTML:
```html
<img src="data:image/png;base64,{graph_base64}" />
```

#### `POST /api/report`
Generate a comprehensive markdown report

**Query Parameters:**
- `project_id` (optional): Project ID to generate report for
- `idea` (optional): Project idea (if not using project_id)
- `hypothesis` (optional): Project hypothesis (if not using project_id)
- `graph_description` (optional): Description of graph data
- `save_to_db` (optional, default: false): Whether to save report to database

**Example Request:**
```bash
curl -X POST "http://localhost:8000/api/report?project_id=123e4567-e89b-12d3-a456-426614174000&save_to_db=true"
```

**Example Response:**
```json
{
  "report": "# Executive Summary\n\nThis project investigates...",
  "project_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

#### `GET /api/projects`
List all projects from database

**Query Parameters:**
- `limit` (optional, default: 10, max: 100): Number of projects to return

**Example Request:**
```bash
curl "http://localhost:8000/api/projects?limit=5"
```

#### `GET /api/projects/{project_id}`
Get a specific project by ID

**Example Request:**
```bash
curl "http://localhost:8000/api/projects/123e4567-e89b-12d3-a456-426614174000"
```

## 📖 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Interactive documentation with all endpoints, parameters, and examples.

## 🗄️ Database Schema

The `projects` table includes:
- `id` (UUID): Primary key
- `user_id` (TEXT): Optional user identifier
- `title` (TEXT): Project title
- `idea` (TEXT): Project idea description
- `hypothesis` (TEXT): Project hypothesis
- `graph_data` (TEXT): Base64 encoded graph image
- `report` (TEXT): Generated markdown report
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp

## 🔧 Configuration

### Environment Variables

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Supabase Configuration
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ...

# Firebase Configuration
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Lemon Squeezy Configuration
LEMON_SQUEEZY_API_KEY=...
LEMON_SQUEEZY_STORE_ID=...

# Application Configuration
DEBUG=False
```

## 🧪 Testing the API

### Using curl

1. **Generate a project idea:**
```bash
curl -X GET "http://localhost:8000/api/idea?topic=renewable%20energy&save_to_db=true"
```

2. **Generate a graph:**
```bash
curl -X GET "http://localhost:8000/api/graph?title=Solar%20Power%20Output&categories=Mon,Tue,Wed,Thu,Fri&values=45,52,48,55,50"
```

3. **Generate a report:**
```bash
curl -X POST "http://localhost:8000/api/report?idea=Solar%20energy%20project&hypothesis=Solar%20panels%20increase%20efficiency&graph_description=Weekly%20power%20output"
```

### Using Python

```python
import requests
import base64
from PIL import Image
import io

# Generate idea
response = requests.get(
    "http://localhost:8000/api/idea",
    params={"topic": "robotics", "save_to_db": True}
)
idea_data = response.json()
print(f"Title: {idea_data['title']}")
print(f"Idea: {idea_data['idea']}")
print(f"Hypothesis: {idea_data['hypothesis']}")

# Generate graph
response = requests.get(
    "http://localhost:8000/api/graph",
    params={
        "title": "Robot Speed Test",
        "categories": "Test1,Test2,Test3",
        "values": "10,15,12"
    }
)
graph_data = response.json()

# Decode and display graph
img_data = base64.b64decode(graph_data['graph_base64'])
img = Image.open(io.BytesIO(img_data))
img.show()

# Generate report
response = requests.post(
    "http://localhost:8000/api/report",
    params={
        "project_id": idea_data['project_id'],
        "graph_description": graph_data['description'],
        "save_to_db": True
    }
)
report_data = response.json()
print(report_data['report'])
```

## 🏗️ Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── config.py              # Configuration settings
├── database.py            # Supabase client
├── auth.py                # Firebase authentication
├── payments.py            # Lemon Squeezy integration
├── models.py              # Pydantic models
├── routes/
│   └── projects.py        # Project-related endpoints
├── services/
│   ├── ai_service.py      # OpenAI integration
│   └── graph_service.py   # Matplotlib chart generation
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables template
└── supabase_schema.sql   # Database schema
```

## 🎯 Key Features Explained

### AI Service (OpenAI GPT-4o mini)
- Generates creative science project ideas
- Creates testable hypotheses
- Produces comprehensive markdown reports
- Uses structured JSON responses for consistency

### Graph Service (Matplotlib)
- Generates bar charts, line graphs, scatter plots
- Returns base64 encoded PNG images
- Includes data analysis descriptions
- Customizable titles, labels, and colors

### Database Integration (Supabase)
- PostgreSQL database with Row Level Security
- Automatic timestamp management
- Optional user-specific data isolation
- Real-time capabilities

## 🔒 Security Notes

- API endpoints can be protected with Firebase authentication
- Supabase RLS policies control data access
- Environment variables store sensitive credentials
- CORS configured for specific origins

## 🚀 Deployment

### Using Docker (recommended)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Using Railway / Render

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

## 📝 Next Steps

1. Add authentication middleware to protect endpoints
2. Implement rate limiting
3. Add more chart types (pie charts, heatmaps, etc.)
4. Implement caching for expensive operations
5. Add WebSocket support for real-time updates
6. Implement file upload for data visualization
7. Add unit and integration tests

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT License

