# 🚀 Quick Access Guide

## 📍 **Your Application URLs**

### **Frontend (User Interface)**
- 🌐 **URL**: http://localhost:5173
- 📄 **Pages**:
  - Home: http://localhost:5173/
  - Try It: http://localhost:5173/try
  - Pricing: http://localhost:5173/pricing
  - Login: http://localhost:5173/login
  - Dashboard: http://localhost:5173/dashboard

### **Backend (API)**
- 🔧 **URL**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs
- 🔍 **Endpoints**:
  - Health Check: http://localhost:8000/health
  - Generate Idea: http://localhost:8000/api/idea?topic=biology
  - Generate Graph: http://localhost:8000/api/graph?title=Test
  - Generate Report: http://localhost:8000/api/report

## 🎮 **Quick Commands**

### **Start Everything**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### **Stop Everything**
```bash
docker-compose -f docker-compose.dev.yml down
```

### **View Logs**
```bash
# Backend logs
docker logs ai-science-builder-backend-dev --tail 50

# Frontend logs
docker logs ai-science-builder-frontend-dev --tail 50

# Follow logs in real-time
docker logs -f ai-science-builder-backend-dev
```

### **Restart Services**
```bash
# Restart backend only
docker-compose -f docker-compose.dev.yml restart backend

# Restart frontend only
docker-compose -f docker-compose.dev.yml restart frontend

# Restart everything
docker-compose -f docker-compose.dev.yml restart
```

### **Rebuild After Code Changes**
```bash
# Rebuild and restart
docker-compose -f docker-compose.dev.yml up --build -d
```

## 🧪 **Test API Endpoints**

### **1. Generate a Science Project Idea**
```bash
curl "http://localhost:8000/api/idea?topic=chemistry&grade=8"
```

### **2. Generate a Graph**
```bash
curl "http://localhost:8000/api/graph?title=My+Project"
```

### **3. Check Server Health**
```bash
curl http://localhost:8000/health
```

## 📊 **Check Status**

### **See Running Containers**
```bash
docker ps
```

### **Check Container Health**
```bash
docker ps | grep ai-science-builder
```

### **Access Container Shell (for debugging)**
```bash
# Backend
docker exec -it ai-science-builder-backend-dev /bin/bash

# Frontend
docker exec -it ai-science-builder-frontend-dev /bin/sh
```

## 🔧 **Troubleshooting**

### **Problem: Port already in use**
```bash
# Find what's using the port
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Stop Docker containers
docker-compose -f docker-compose.dev.yml down
```

### **Problem: Changes not showing**
```bash
# Force rebuild
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build -d
```

### **Problem: Database/API connection issues**
```bash
# Check .env file exists
type .env

# Restart backend
docker-compose -f docker-compose.dev.yml restart backend
```

## 📁 **Important Files**

### **Configuration**
- `.env` - Environment variables (API keys, secrets)
- `docker-compose.dev.yml` - Development Docker setup
- `backend/config.py` - Backend settings
- `frontend/src/config/api.js` - Frontend API configuration

### **Documentation**
- `README.md` - Full project documentation
- `FINAL_SETUP_SUMMARY.md` - Complete setup guide
- `QUICK_ACCESS.md` - This file (quick reference)

## 🎯 **Quick Development Workflow**

1. **Start servers**: `docker-compose -f docker-compose.dev.yml up -d`
2. **Open frontend**: http://localhost:5173
3. **Test API**: http://localhost:8000/docs
4. **Make changes** (code hot-reloads automatically)
5. **View logs** if needed: `docker logs -f ai-science-builder-backend-dev`
6. **Stop when done**: `docker-compose -f docker-compose.dev.yml down`

## 🆘 **Getting Help**

### **View Full Documentation**
```bash
# Windows
start README.md

# Or just open in any text editor
```

### **Check API Status**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

**Your application is ready to use!** 🎉

**Frontend**: http://localhost:5173  
**Backend**: http://localhost:8000  
**API Docs**: http://localhost:8000/docs

