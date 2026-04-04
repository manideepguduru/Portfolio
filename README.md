# 🚀 Guduru Manideep — Portfolio (Full-Stack)

React 18 + TypeScript frontend · Java Spring Boot 3 backend · MySQL database · Admin Dashboard

---

## 📋 Overview

A modern full-stack portfolio application with:
- **Public Portfolio** — Showcase projects, services, and contact form
- **Admin Dashboard** — Manage projects, services, and contact submissions
- **RESTful API** — Spring Boot backend with JWT-capable authentication
- **Responsive Design** — Works seamlessly across all devices

---

## 📁 Project Structure

```
portfolio/
├── frontend/          ← React 18 + TypeScript (Vite) + Admin Panel
├── backend/           ← Spring Boot 3 + Java 17 + MySQL
└── docs/
    └── schema.sql     ← Database schema + seed data
```

---

## ⚙️ Prerequisites

| Tool        | Version  |
|-------------|----------|
| Node.js     | 18 +     |
| npm         | 9 +      |
| Java JDK    | 17 +     |
| Maven       | 3.8 +    |
| MySQL       | 8.0 +    |

---

## 🗄️ Step 1 — Set up MySQL

1. Open MySQL Workbench or terminal and run:

```sql
SOURCE /path/to/portfolio/docs/schema.sql;
```

This creates:
- `portfolio_db` database
- `projects`, `services`, `contacts` tables
- Seed data for demonstration

2. Note your MySQL username and password.

---

## 🔧 Step 2 — Configure Backend

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root          # ← your MySQL username
spring.datasource.password=your_password # ← your MySQL password
portfolio.cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

---

## ▶️ Step 3 — Run the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
# Windows: mvnw.cmd spring-boot:run
```

Backend starts at **http://localhost:8080**

### Verify it's working:
```
GET http://localhost:8080/api/projects   → lists all projects
GET http://localhost:8080/api/services   → lists active services
```

---

## ▶️ Step 4 — Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:3000** (or **http://localhost:5173** if 3000 is in use)

---

## 👤 Admin Panel Access

### Admin Login Credentials

```
Email:    admin@portfolio.com
Password: admin@123
```

### Access Points

| Route | Purpose |
|-------|---------|
| `/admin/login` | Admin login page |
| `/admin` | Admin dashboard (requires authentication) |

### Features
- ✅ View all portfolio contacts
- ✅ Mark messages as read/unread
- ✅ Delete contact submissions
- ✅ Manage projects (add, edit, delete)
- ✅ Manage services (add, edit, delete)
- ✅ View contact statistics

---

## 🌐 Pages & Routes

### Public Routes
| Route | Description |
|-------|-------------|
| `/` | Home page with hero, stats, featured projects |
| `/projects` | All portfolio projects |
| `/services` | Available services |
| `/contact` | Contact form with WhatsApp link |

### Admin Routes
| Route | Description |
|-------|-------------|
| `/admin/login` | Admin authentication |
| `/admin` | Dashboard with management tabs |

---

## 📦 API Endpoints

### Public Endpoints
```
GET    /api/projects          → List active projects
GET    /api/services          → List active services
POST   /api/contact           → Submit contact form
```

### Admin Endpoints (Protected)
```
GET    /api/admin/contact          → All messages
GET    /api/admin/contact/unread   → Unread messages
GET    /api/admin/projects         → All projects
POST   /api/admin/projects         → Create project
PUT    /api/admin/projects/:id     → Update project
DELETE /api/admin/projects/:id     → Delete project
```

---

## 🚀 Deployment

### Frontend to Vercel
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

Environment variables (`.env.production`):
```
VITE_API_URL=https://your-backend-render.onrender.com/api
```

### Backend to Render

1. Create `render.yaml` in project root (already included)
2. Connect repository to Render
3. Set environment variables:
```
DATABASE_URL=mysql://user:pass@host:3306/portfolio_db
SPRING_PROFILES_ACTIVE=production
JWT_SECRET=your-secret-key-change-this
```

---

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Change default admin credentials** in database after first deployment
2. **Enable JWT authentication** in backend for production
3. **Use environment variables** for sensitive data (DB password, JWT secret)
4. **Enable HTTPS** on production domains
5. **Update CORS allowed origins** to match your deployed frontend

---

## 📱 Features

### Frontend
- ⚡ Lightning-fast with Vite
- 🎨 Beautiful UI with CSS modules
- 📱 Fully responsive design
- ♿ Accessible components
- 🌙 Dark theme ready
- 🔗 React Router navigation

### Backend
- 🛡️ CORS configured for development & production
- 📦 RESTful API architecture
- 🔄 MySQL with JPA/Hibernate ORM
- 📝 Comprehensive API documentation
- ⚡ Optimized database queries
- 🚀 Spring Boot 3 with Java 17

---

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript 5.2
- Vite 5.4
- React Router v6
- CSS Modules

### Backend
- Spring Boot 3.2
- Java 17
- MySQL 8.0
- JPA/Hibernate
- Maven 3.8

---

## 📝 Environment Files

### Frontend (`.env.example`)
```
VITE_API_URL=http://localhost:8080/api
VITE_ADMIN_API_URL=http://localhost:8080/api/admin
```

### Backend (`application.properties`)
```
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=validate
```

---

## 📚 Database Schema

**projects** table:
```sql
id, title, description, link, image_url, created_at, updated_at
```

**services** table:
```sql
id, title, description, is_active, created_at, updated_at
```

**contacts** table:
```sql
id, name, email, message, is_read, created_at, updated_at
```

See `docs/schema.sql` for complete schema with indexes and seed data.

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Frontend can't reach backend | Check CORS settings in `application.properties` |
| Admin login fails | Verify admin credentials in database |
| Port 3000 already in use | Run `npm run dev -- --port 5173` |
| MySQL connection error | Check username, password, and database exists |
| TypeScript errors | Run `npm install` in frontend folder |

---

## 📧 Contact & Support

- **Portfolio:** [Your Portfolio Link]
- **Email:** softwarekattubanisa@gmail.com
- **WhatsApp:** +91 9346929001
- **GitHub:** [Your GitHub Profile]

---

## 📄 License

MIT License - feel free to use this template for your portfolio!

---

## 🎯 Future Enhancements

- [ ] Email notifications for new contacts
- [ ] File upload for project images
- [ ] Analytics dashboard
- [ ] Newsletter subscription
- [ ] Blog section
- [ ] Dark/Light theme toggle

---

**Made with ☕ and clean code**

|--------------|------------------------------------------|
| `/`          | Home — Hero, Stats, About, Services, Projects, Contact |
| `/projects`  | Full project list with featured filter   |
| `/services`  | All services + How It Works section      |
| `/contact`   | Contact form + direct contact info       |
| `/admin`     | Admin panel — manage projects, services, read messages |

---

## 🔌 API Endpoints

### Projects
| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | /api/projects            | All projects          |
| GET    | /api/projects/featured   | Featured only         |
| GET    | /api/projects/{id}       | Single project        |
| POST   | /api/projects            | Create project        |
| PUT    | /api/projects/{id}       | Update project        |
| DELETE | /api/projects/{id}       | Delete project        |

### Services
| Method | Endpoint                 | Description           |
|--------|--------------------------|-----------------------|
| GET    | /api/services            | Active services only  |
| GET    | /api/services/all        | All (admin)           |
| POST   | /api/services            | Create service        |
| PUT    | /api/services/{id}       | Update service        |
| DELETE | /api/services/{id}       | Delete service        |

### Contact
| Method | Endpoint                     | Description         |
|--------|------------------------------|---------------------|
| POST   | /api/contact                 | Submit contact form |
| GET    | /api/contact                 | All messages        |
| GET    | /api/contact/unread          | Unread only         |
| GET    | /api/contact/unread-count    | Badge count         |
| PUT    | /api/contact/{id}/read       | Mark as read        |
| DELETE | /api/contact/{id}            | Delete message      |

---

## 🧪 Running Tests

### Backend (JUnit 5 + Mockito)
```bash
cd portfolio/backend
./mvnw test
```

Tests use Mockito mocks only — **no database connection needed** for unit tests.

Test files:
- `ProjectServiceTest`   — 7 tests
- `ServiceServiceTest`   — 8 tests
- `ContactServiceTest`   — 7 tests
- `ProjectControllerTest` — 7 tests
- `ServiceControllerTest` — 6 tests
- `ContactControllerTest` — 8 tests

### Frontend (Vitest + React Testing Library)
```bash
cd portfolio/frontend
npm test
```

Test file: `src/tests/components.test.tsx`
- ProjectCard — 6 tests
- ServiceCard — 5 tests
- ContactForm — 5 tests (including API mock + validation)

---

## 🏗️ Build for Production

### Backend — build JAR
```bash
cd portfolio/backend
./mvnw clean package -DskipTests
java -jar target/portfolio-backend-1.0.0.jar
```

### Frontend — build static files
```bash
cd portfolio/frontend
npm run build
# Output in: frontend/dist/
```

Deploy `dist/` to Netlify, Vercel, or serve via Nginx.
Point the Spring Boot app's `portfolio.cors.allowed-origins` to your production domain.

---

## 🔑 Admin Panel

Visit **http://localhost:3000/admin**

- ✅ Add / edit / delete projects
- ✅ Add / edit / delete services (toggle active/inactive)
- ✅ Read all contact messages, mark as read, delete, reply via email
- ✅ Unread badge count

> For production, add Spring Security with a login endpoint to protect `/admin`.

---

## 📞 Contact / Support

| Channel   | Details                              |
|-----------|--------------------------------------|
| WhatsApp  | +91 93469 29001                      |
| Email     | softwarekattubanisa@gmail.com        |
| Instagram | @antha_manadey                       |
| Location  | Bapatla, Andhra Pradesh              |
