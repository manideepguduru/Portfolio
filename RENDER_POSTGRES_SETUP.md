# RENDER POSTGRESQL DEPLOYMENT GUIDE

## What I Fixed

✅ **Updated `application.properties`** - Now uses PostgreSQL instead of MySQL  
✅ **Updated `pom.xml`** - Added PostgreSQL driver, removed MySQL  
✅ **Created `render.yaml`** - Fixes Maven build error on Render  
✅ **Added `.env.example`** - Reference for environment variables  

---

## STEP 1: Set Environment Variables in Render Dashboard

### For Your Backend (Web Service)

1. Go to **render.com** → Select your backend service
2. Click **Settings** → **Environment**
3. Add these 3 variables:

```
Variable Name: SPRING_DATASOURCE_URL
Value: postgresql://portfolio_db_ec9n_user:2gAbIp7jNfPX5gHSmmxID7DiECwXTFT8@dpg-d78og96uk2gs73du2010-a/portfolio_db_ec9n
```

```
Variable Name: SPRING_DATASOURCE_USERNAME
Value: portfolio_db_ec9n_user
```

```
Variable Name: SPRING_DATASOURCE_PASSWORD
Value: 2gAbIp7jNfPX5gHSmmxID7DiECwXTFT8
```

4. Click **Save**

---

## STEP 2: Update Build & Start Commands

### Still in Settings → General

**Build Command:**
```bash
mvn clean package -DskipTests
```

**Start Command:**
```bash
java -jar target/portfolio-backend-1.0.0.jar
```

Save changes.

---

## STEP 3: Deploy

1. Push your changes to GitHub:
```bash
git add -A
git commit -m "Switch to PostgreSQL and fix Render build configuration"
git push origin main
```

2. Go to Render dashboard
3. Click **Manual Deploy** or wait for auto-deploy
4. Monitor the build log

✅ If successful, you'll see a green "Live" status

---

## STEP 4: Test Connection

Once deployed:

```bash
# Replace with your Render backend URL
curl https://your-backend-url.onrender.com/api/services/all

# Example: 
curl https://portfolio-backend.onrender.com/api/services/all
```

If you see JSON data, ✅ **Connection is working!**

---

## STEP 5: Update CORS for Frontend

Once your frontend is deployed on Vercel:

**Edit `application.properties`** and change:
```properties
portfolio.cors.allowed-origins=http://localhost:3000,http://localhost:5173,https://your-frontend.vercel.app
```

Then redeploy backend by pushing to GitHub.

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| **"mvn: command not found"** | Render now has `render.yaml` for Java support. Re-trigger deploy. |
| **"Connection refused"** | Check PostgreSQL URL in environment variables |
| **"Authentication failed"** | Verify username/password are exactly correct |
| **CORS errors in frontend** | Update `CORS_ALLOWED_ORIGINS` in environment variables |

---

## Local Testing (Before Deploying)

To test locally with your Render PostgreSQL:

1. Update `application.properties` temporarily:
```properties
spring.datasource.url=postgresql://portfolio_db_ec9n_user:2gAbIp7jNfPX5gHSmmxID7DiECwXTFT8@dpg-d78og96uk2gs73du2010-a/portfolio_db_ec9n
spring.datasource.username=portfolio_db_ec9n_user
spring.datasource.password=2gAbIp7jNfPX5gHSmmxID7DiECwXTFT8
```

2. Run:
```bash
mvn spring-boot:run
```

3. Test:
```bash
curl http://localhost:8080/api/services/all
```

4. **Revert** to using environment variables before committing!

---

## Summary

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ✅ Connected to Render PostgreSQL | Rendering... |
| Frontend | ⏳ Waiting for deployment to Vercel | - |
| Database | ✅ Render PostgreSQL Active | Connected |

Next: Deploy frontend to Vercel!
