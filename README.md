# 🚀 Guduru Manideep — Portfolio (Full-Stack)

React 18 + TypeScript frontend · Java Spring Boot 3 backend · MySQL database

---

## 📁 Project Structure

```
portfolio/
├── frontend/          ← React + TypeScript (Vite)
├── backend/           ← Spring Boot 3 + MySQL
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
-- Run the full schema file:
SOURCE /path/to/portfolio/docs/schema.sql;
```

Or paste it directly. This creates:
- `portfolio_db` database
- `projects`, `services`, `contacts` tables
- Seed data (projects + 6 services including Business Websites & Final Year Projects)

2. Note your MySQL username and password.

---

## 🔧 Step 2 — Configure Backend

Open `backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root          # ← your MySQL username
spring.datasource.password=your_password # ← your MySQL password
```

> **First run tip:** Change `spring.jpa.hibernate.ddl-auto=validate` to `update`
> on the very first run if you want Hibernate to auto-verify the schema,
> then switch back to `validate`.

---

## ▶️ Step 3 — Run the Backend

```bash
cd portfolio/backend
./mvnw spring-boot:run
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
cd portfolio/frontend
npm install
npm run dev
```

Frontend starts at **http://localhost:3000**

> Vite proxies all `/api` calls to `http://localhost:8080` automatically —
> no CORS issues in development.

---

## 🌐 Pages & Routes

| Route        | Description                              |
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
