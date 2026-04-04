# 🚀 Quick Deployment Reference

## Three Independent Deployments

```
┌─────────────────────────────┐    ┌──────────────────────┐    ┌────────────────────────── ┐
│                             │    │                      │    │                            │
│   FRONTEND (PUBLIC)         │    │   BACKEND (API)      │    │   ADMIN PANEL              │
│                             │    │                      │    │                            │
│  → Vercel                   │    │  → Render            │    │  → Vercel (Separate)       │
│                             │    │                      │    │                            │
├─────────────────────────────┤    ├──────────────────────┤    ├────────────────────────── ┤
│                             │    │                      │    │                            │
│ Framework: React/Vite       │    │ Framework: Spring    │    │ Framework: React/Vite      │
│ Build: npm run build        │    │ Build: mvn package   │    │ Build: npm run build       │
│ Output: dist/               │    │ Start: java -jar     │    │ Output: dist/              │
│                             │    │                      │    │                            │
├─────────────────────────────┤    ├──────────────────────┤    ├────────────────────────── ┤
│ ENV VARS:                   │    │ ENV VARS:            │    │ ENV VARS:                  │
│ VITE_API_URL=               │    │ DATABASE_URL=        │    │ VITE_API_URL=              │
│ backend-url/api             │    │ DB_USER, DB_PASSWORD │    │ backend-url/api            │
│                             │    │ CORS_ALLOWED_...     │    │ VITE_ADMIN_API_URL=        │
│                             │    │ JWT_SECRET           │    │ backend-url/api/admin      │
│                             │    │ SPRING_PROFILES_...  │    │                            │
│                             │    │                      │    │                            │
└─────────────────────────────┘    └──────────────────────┘    └────────────────────────── ┘
         ↑                                 ↑                              ↑
         │                                 │                              │
    https://your-portfolio.                 https://your-backend.     https://your-admin.
    vercel.app                              onrender.com                vercel.app
```

---

## Step-by-Step Deployment Checklist

### ☑️ Step 1: Setup Backend on Render (FIRST)

```bash
1. Create PostgreSQL database on Render
   - Save connection string

2. Create Web Service on Render
   - Connect your GitHub (backend folder)
   - Build Command: mvn clean package -DskipTests
   - Start Command: java -jar target/portfolio-backend-1.0.0.jar
   
3. Add Environment Variables:
   - DATABASE_URL=<your-postgres-connection>
   - DB_USER=postgres
   - DB_PASSWORD=<strong-password>
   - CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-admin.vercel.app
   - JWT_SECRET=<min-32-character-random-string>
   - SPRING_PROFILES_ACTIVE=production

4. Deploy and get URL: https://your-backend.onrender.com
```

### ☑️ Step 2: Deploy Admin Panel on Vercel

```bash
1. Create new GitHub repository for admin-panel
2. Push admin-panel code to GitHub
3. Go to Vercel → Add New Project
   - Select admin-panel repository
   - Framework: Vite
   - Build: npm run build
   - Add Environment Variables:
     VITE_API_URL=https://your-backend.onrender.com/api
     VITE_ADMIN_API_URL=https://your-backend.onrender.com/api/admin
4. Deploy and get URL: https://your-admin.vercel.app
```

### ☑️ Step 3: Deploy Frontend on Vercel

```bash
1. Push frontend code to GitHub (already clean)
2. Go to Vercel → Add New Project
   - Select frontend repository
   - Framework: Vite
   - Build: npm run build
   - Add Environment Variables:
     VITE_API_URL=https://your-backend.onrender.com/api
3. Deploy and get URL: https://your-portfolio.vercel.app
```

---

## 📋 Replace These Values

```
your-backend.onrender.com          → Your Render backend URL
your-portfolio.vercel.app          → Your Vercel frontend URL
your-admin.vercel.app              → Your Vercel admin panel URL
<your-postgres-connection>         → PostgreSQL connection string from Render
<strong-password>                  → Generated database password
<min-32-character-random-string>   → Generated JWT secret
```

---

## 🔗 Important Links

| Task | Link |
|------|------|
| Create Render Account | https://render.com |
| Create Vercel Account | https://vercel.com |
| PostgreSQL on Render | https://render.com/docs/databases |
| Deploy Spring Boot | https://render.com/docs/deploy-spring-boot |
| Vercel Environment Vars | https://vercel.com/docs/projects/environment-variables |

---

## ✅ Final Verification

After deployment, visit:

- ✅ `https://your-portfolio.vercel.app` - Public portfolio
- ✅ `https://your-portfolio.vercel.app/contact` - Contact page (calls backend)
- ✅ `https://your-admin.vercel.app/login` - Admin login
- ✅ `https://your-backend.onrender.com/api/projects` - Backend API

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Update CORS_ALLOWED_ORIGINS in backend |
| API not responding | Verify VITE_API_URL matches backend URL exactly |
| Admin login fails | Check JWT_SECRET is set in backend |
| Database connection error | Verify DATABASE_URL connection string |
| Vercel can't find modules | Run `npm install` before deploying |

---

**Ready to deploy? Follow the 3 steps above in order!** 🚀
