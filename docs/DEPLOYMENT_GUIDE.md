# 🚀 AI Science Builder - Production Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Options](#deployment-options)
4. [Post-Deployment](#post-deployment)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Services
- ✅ Google Gemini API Key (FREE) or OpenAI API Key
- ✅ Firebase Project (for authentication)
- ✅ Supabase Account (for database) - Optional
- ✅ Domain name (for production)
- ✅ SSL Certificate (Let's Encrypt recommended)

### System Requirements
- **Docker Deployment**: 
  - Docker Engine 20.10+
  - Docker Compose 2.0+
  - 2GB RAM minimum, 4GB recommended
  - 10GB disk space

- **Manual Deployment**:
  - Python 3.11+
  - Node.js 20+
  - Nginx or similar web server
  - PostgreSQL (if not using Supabase)

---

## Environment Configuration

### 1. Backend Environment Variables

Create `.env` file in the project root:

```env
# AI Services (at least one required)
GEMINI_API_KEY=AIza-your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash

# OpenAI (optional fallback)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini

# Database (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# Firebase Authentication
FIREBASE_CREDENTIALS_PATH=./backend/firebase-credentials.json

# Lemon Squeezy Payments (optional)
LEMON_SQUEEZY_API_KEY=your-lemon-squeezy-api-key
LEMON_SQUEEZY_STORE_ID=your-store-id

# Application Configuration
DEBUG=False
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
```

### 2. Frontend Environment Variables

Create `frontend/.env`:

```env
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Supabase Configuration (optional)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Step 1: Build Images

```bash
# Production build
docker-compose build --no-cache

# Or use the production compose file
docker-compose -f docker-compose.yml build
```

#### Step 2: Start Services

```bash
# Start in detached mode
docker-compose up -d

# Check logs
docker-compose logs -f

# Check status
docker-compose ps
```

#### Step 3: Configure Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/ai-science-builder`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings for long AI requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:8000/health;
        access_log off;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/ai-science-builder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Cloud Platform Deployment

#### AWS ECS/Fargate

1. **Push Docker images to ECR**
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL
docker tag ai-science-builder-backend:latest YOUR_ECR_URL/backend:latest
docker tag ai-science-builder-frontend:latest YOUR_ECR_URL/frontend:latest
docker push YOUR_ECR_URL/backend:latest
docker push YOUR_ECR_URL/frontend:latest
```

2. **Create ECS Task Definition** (use `docker-compose.yml` as reference)

3. **Set up Application Load Balancer** for traffic routing

#### Google Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT/backend ./backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/frontend ./frontend

# Deploy backend
gcloud run deploy backend \
  --image gcr.io/YOUR_PROJECT/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY

# Deploy frontend
gcloud run deploy frontend \
  --image gcr.io/YOUR_PROJECT/frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - **Backend**: Dockerfile, port 8000
   - **Frontend**: Dockerfile, port 80
3. Set environment variables in dashboard
4. Deploy!

#### Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
```bash
cd frontend
vercel --prod
```

**Backend (Railway):**
1. Connect GitHub repository
2. Railway will auto-detect Dockerfile
3. Set environment variables
4. Deploy

### Option 3: VPS Manual Deployment

#### Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### Deploy Backend

```bash
# Clone repository
git clone https://github.com/yourusername/ai-science-builder.git
cd ai-science-builder/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run with systemd
sudo nano /etc/systemd/system/ai-science-backend.service
```

Add to service file:
```ini
[Unit]
Description=AI Science Builder Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/ai-science-builder/backend
Environment="PATH=/path/to/ai-science-builder/backend/venv/bin"
ExecStart=/path/to/ai-science-builder/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable ai-science-backend
sudo systemctl start ai-science-backend
```

#### Deploy Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Copy to Nginx directory
sudo cp -r dist/* /var/www/ai-science-builder/

# Configure Nginx (see Nginx config above)
```

---

## Post-Deployment

### 1. Database Setup

Run database migrations:

```bash
# Using psql
psql -h your-db-host -U your-user -d your-database -f backend/database/schema.sql

# Or using Supabase SQL Editor
# Copy contents of backend/database/schema.sql and run in Supabase dashboard
```

### 2. SSL Certificate

```bash
# Get Let's Encrypt certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (should be automatic, but verify)
sudo certbot renew --dry-run
```

### 3. Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

### 4. Verify Deployment

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Check frontend
curl https://yourdomain.com

# Check API documentation
open https://api.yourdomain.com/docs
```

---

## Monitoring & Maintenance

### Health Monitoring

Set up monitoring for:
- `/health` endpoint (every 1 minute)
- SSL certificate expiration
- Disk space usage
- Memory usage
- API response times

### Automated Backups

**Database Backups:**
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h your-db-host -U your-user your-database > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

### Log Management

```bash
# View application logs
docker-compose logs -f --tail=100

# Or for manual deployment
sudo journalctl -u ai-science-backend -f

# Rotate logs
sudo logrotate -f /etc/logrotate.d/nginx
```

### Updates & Maintenance

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Or for manual deployment
cd backend
git pull
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart ai-science-backend

cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/ai-science-builder/
```

### Performance Optimization

1. **Enable Caching**
   - Redis for session storage
   - CDN for static assets
   - Browser caching headers

2. **Database Optimization**
   - Regular VACUUM ANALYZE
   - Index optimization
   - Query optimization

3. **Load Balancing**
   - Multiple backend instances
   - Load balancer (nginx, HAProxy)

### Security Checklist

- [ ] All environment variables are set
- [ ] Firewall is configured
- [ ] SSL certificate is installed and auto-renewing
- [ ] Database credentials are secure
- [ ] API keys are rotated regularly
- [ ] Backups are automated
- [ ] Monitoring is set up
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Security headers are enabled

---

## Troubleshooting

### Common Issues

**Backend not starting:**
```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env

# Check Python errors
docker-compose exec backend python -c "import main"
```

**Frontend not loading:**
```bash
# Check nginx config
sudo nginx -t

# View nginx logs
sudo tail -f /var/log/nginx/error.log

# Verify frontend build
docker-compose logs frontend
```

**Database connection issues:**
```bash
# Test database connection
docker-compose exec backend python -c "from database import get_db; print(get_db())"
```

**SSL issues:**
```bash
# Renew certificate manually
sudo certbot renew

# Check certificate expiration
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -noout -dates
```

---

## Support

For issues and questions:
- 📖 Documentation: [README.md](./README.md)
- 🐛 Bug Reports: Open an issue
- 💬 Discussions: GitHub Discussions

---

**Made with ❤️ for science education**

Last Updated: October 23, 2025

