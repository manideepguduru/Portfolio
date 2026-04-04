# Portfolio Project - Deployment Guide

This project is divided into three separate parts for independent deployment:

## 📁 Project Structure

```
portfolio/
├── frontend/          # Public Portfolio Website → Vercel
├── backend/          # Spring Boot API → Render
├── admin-panel/      # Admin Dashboard → Vercel (separate)
└── docs/            # Database schema
```

---

## 🚀 PART 1: Deploy Frontend to Vercel

### Prerequisites
- Frontend code pushed to GitHub
- Vercel account connected to GitHub

### Steps

1. **Prepare Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Clean frontend - admin removed"
   git push origin main
   ```

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Select your GitHub repository (frontend folder)
   - **Build Settings:**
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-render-backend.onrender.com/api
     ```
   - Click "Deploy"

4. **Get your live URL** (e.g., `portfolio-abc123.vercel.app`)

---

## 🚀 PART 2: Deploy Backend to Render

### Prerequisites
- Backend code pushed to GitHub
- Render account

### Steps

1. **Prepare Backend**
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```

2. **Create PostgreSQL Database on Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "PostgreSQL"
   - Name: `portfolio-db`
   - PostgreSQL Version: 15
   - Region: Choose closest to you
   - Note the connection string

3. **Deploy Spring Boot**
   - Click "New" → "Web Service"
   - Connect your GitHub repository (backend folder)
   - **Configuration:**
     - Name: `portfolio-backend`
     - Environment: `Java`
     - Build Command: `mvn clean package -DskipTests`
     - Start Command: `java -jar target/portfolio-backend-1.0.0.jar`
   - **Environment Variables:**
     ```
     DATABASE_URL=postgresql://user:password@host:port/portfolio
     DB_USER=postgres
     DB_PASSWORD=xxxxx
     CORS_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
     JWT_SECRET=your-super-secret-key-change-this
     SPRING_PROFILES_ACTIVE=production
     ```
   - Click "Create Web Service"

4. **Get your backend URL** (e.g., `portfolio-backend.onrender.com`)

5. **Update Frontend Environment Variable**
   - Go back to Vercel → Project Settings → Environment Variables
   - Update: `VITE_API_URL=https://portfolio-backend.onrender.com/api`
   - Redeploy

---

## 🚀 PART 3: Deploy Admin Panel to Vercel (Separate)

### Prerequisites
- Admin panel code in separate GitHub repository
- Vercel account

### Steps

1. **Initialize Admin Panel Git**
   ```bash
   cd admin-panel
   git init
   git add .
   git commit -m "Initial admin panel"
   git push origin main
   ```

2. **Create New Vercel Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Select your admin-panel GitHub repository
   - **Configuration:**
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://portfolio-backend.onrender.com/api
     VITE_ADMIN_API_URL=https://portfolio-backend.onrender.com/api/admin
     ```
   - Click "Deploy"

3. **Access Admin Panel**
   - URL: `https://portfolio-admin.vercel.app` (or custom domain)
   - Login with your admin credentials

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` in backend production environment
- [ ] Use strong database password
- [ ] Enable HTTPS on all domains
- [ ] Set `CORS_ALLOWED_ORIGINS` to specific domains only
- [ ] Use environment variables for all secrets
- [ ] Never commit `.env` files to Git
- [ ] Set database to private (non-public)
- [ ] Enable firewall rules on Render

---

## 📝 Environment Variables Reference

### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain/api
```

### Backend (Render)
```
DATABASE_URL=postgresql://user:pass@host:port/db
DB_USER=postgres
DB_PASSWORD=strong-password
CORS_ALLOWED_ORIGINS=https://your-frontend-domain,https://your-admin-domain
JWT_SECRET=your-secret-key-min-32-chars
SPRING_PROFILES_ACTIVE=production
```

### Admin Panel (.env)
```
VITE_API_URL=https://your-backend-domain/api
VITE_ADMIN_API_URL=https://your-backend-domain/api/admin
```

---

## 🛠️ Local Development

### Start all three services locally

**Terminal 1 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 3 - Admin Panel:**
```bash
cd admin-panel
npm install
npm run dev
```

Access:
- Portfolio: http://localhost:5173
- Admin Panel: http://localhost:3001
- Backend: http://localhost:8080/api

---

## 📚 Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Spring Boot on Render](https://render.com/docs/deploy-spring-boot)
- [PostgreSQL on Render](https://render.com/docs/databases)

---

## 🆘 Troubleshooting

**CORS Error?**
- Update `CORS_ALLOWED_ORIGINS` in backend
- Ensure frontend domain matches exactly

**Backend not connecting?**
- Check `VITE_API_URL` in frontend matches your backend URL
- Verify database connection string

**Admin panel not loading?**
- Check JWT token expiry
- Verify `VITE_ADMIN_API_URL` is correct
- Check browser console for errors

---

Last Updated: April 2026
