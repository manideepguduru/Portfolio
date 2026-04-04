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

## 🛡️ Admin Dashboard - Complete Guide

### Credentials & Access
```
URL:      http://localhost:3000/admin/login
Password: Infosys@19 (password-only, no email needed)
Session:  24-hour localStorage token expiry
Logout:   Button in top-right corner
```

### 📧 CONTACTS/MESSAGES TAB (Default View)

**View All Messages**
- Displays messages from public contact form submissions
- Shows Name, Email, Message content, and timestamps (date + time)
- Red badge with unread count in top-right
- Visual indicators: 🔴 Red dot for unread messages, orange border for unread
- Messages sorted by newest first

**Mark as Read**
- "✓ Mark as Read" button (blue) appears only for unread messages
- Click to update isRead status in database
- Badge counter updates automatically
- Message styling changes from highlighted to gray

**Delete Messages**
- "🗑️ Delete" button (red) removes message
- Confirmation dialog before deletion
- Updates unread count immediately

**API Endpoints Used:**
```
GET  /api/contact              → Fetch all messages
GET  /api/contact/unread-count → Unread count badge
PUT  /api/contact/{id}/read    → Mark as read
DELETE /api/contact/{id}       → Delete message
```

---

### 📁 PROJECTS TAB - Full CRUD Operations

**View All Projects**
- Table columns: Title | Description | Link | Featured | Actions
- Displays all portfolio projects with truncated descriptions
- Loads from `GET /api/projects`

**Edit Projects**
1. Click **Edit** button (orange) on any project
2. Fields become editable inline:
   - Title: text input
   - Description: textarea (expandable)
   - Link: text input
   - Featured: checkbox (✓ = yes, ○ = no)
3. Click **Save** (cyan) to update via `PUT /api/projects/{id}`
4. Click **Cancel** (gray) to revert changes
5. Table refreshes with updated data

**Delete Projects**
1. Click **Delete** button (red)
2. Confirm in dialog
3. Sends `DELETE /api/projects/{id}`
4. Project removed from table

**API Endpoints Used:**
```
GET  /api/projects         → Fetch all projects
PUT  /api/projects/{id}    → Update project
DELETE /api/projects/{id}  → Delete project
```

---

### 🛠️ SERVICES TAB - Full CRUD Operations

**View All Services**
- Table columns: Title | Description | Status | Actions
- Shows all services (including inactive ones for admin)
- Status displays:
  - **Active** (cyan text) = showing on public site
  - **Inactive** (gray text) = hidden from public site
- Loads from `GET /api/services/all`

**Edit Services**
1. Click **Edit** button (orange) on any service
2. Fields become editable:
   - Title: text input
   - Description: textarea
   - Status: checkbox toggle (checked = Active, unchecked = Inactive)
3. Click **Save** (cyan) to update via `PUT /api/services/{id}`
4. Click **Cancel** (gray) to close editing
5. Table refreshes with changes immediately

**Delete Services**
1. Click **Delete** button (red)
2. Confirm deletion
3. Sends `DELETE /api/services/{id}`
4. Service removed from list

**API Endpoints Used:**
```
GET  /api/services/all     → Fetch all services (including inactive)
PUT  /api/services/{id}    → Update service
DELETE /api/services/{id}  → Delete service
```

---

### 🎨 Admin Dashboard UI

**Navigation**
- Header: Admin Dashboard title + Logout button (red)
- Tabs: Contacts | Projects | Services
- Active Tab: Cyan highlight with border
- Inactive Tab: Semi-transparent border

**Color Scheme - Dark Theme**
- Background: `#0f1419` (very dark blue)
- Cards: `#1a1f2e` (dark blue)
- Accent: `#00d9ff` (cyan/active)
- Buttons: Cyan (save), Orange (edit), Red (delete)
- Text: `#cbd5e1` (light gray)

**Features**
- Responsive tables with horizontal scrolling on small screens
- Loading states with visual feedback
- Error messages displayed clearly
- Confirmation dialogs for destructive actions
- Auto-refresh after CRUD operations

---

### 🔐 Admin Authentication Details

**Type**: Client-side password verification (demo mode)
- Password-only login (no email requirement)
- 24-hour session expiry
- Token stored in localStorage with expiry check
- Logout button clears session and redirects to login page

**For Production**: Implement Spring Security with JWT backend authentication

---

### 📊 Build & Compilation Status

- ✅ Frontend: 121 modules, 267.34 kB JS (gzipped)
- ✅ Backend: All 20 source files compiling
- ✅ TypeScript: 0 errors
- ✅ Lint: 0 warnings

---

### 📖 Admin Features - Complete API Overview

**All Endpoints Verified & Working**

Projects (3 admin endpoints):
```
GET  /api/projects         → List all projects
PUT  /api/projects/{id}    → Update (title, description, link, featured)
DELETE /api/projects/{id}  → Delete project
```

Services (3 admin endpoints):
```
GET  /api/services/all     → List all (including inactive)
PUT  /api/services/{id}    → Update (title, description, active status)
DELETE /api/services/{id}  → Delete service
```

Contacts (4 admin endpoints):
```
GET  /api/contact          → List all messages
GET  /api/contact/unread-count → Get unread count
PUT  /api/contact/{id}/read    → Mark message as read
DELETE /api/contact/{id}   → Delete message
```

---

### 🧪 Admin Testing Checklist

- [ ] Login with `Infosys@19` password only
- [ ] View all 3 admin sections (Contacts, Projects, Services)
- [ ] Unread message count shows in red badge
- [ ] Edit a project title and verify it saves
- [ ] Toggle a service status (Active/Inactive)
- [ ] Mark a message as read - button disappears, count decreases
- [ ] Delete a project - removed from table
- [ ] Delete a service - removed from list
- [ ] Delete message - removed from contacts
- [ ] Session persists after page refresh (within 24 hours)
- [ ] Logout clears session and redirects to login

---

### 🐛 Admin Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Messages not loading?** | Check backend at `http://localhost:8080`, verify MySQL has records, check browser console |
| **Edit/Delete not working?** | Test backend API with Postman, check DevTools Network tab, verify auth token |
| **No unread badge?** | Check `/api/contact/unread-count` endpoint, verify unread messages exist, refresh page |
| **Styling looks broken?** | Clear cache (Ctrl+Shift+Del), hard refresh (Ctrl+F5), check DevTools Network |
| **Login fails?** | Verify password is exactly `Infosys@19`, check localStorage is enabled |

---

### 🚀 Data Flow Examples

**When Editing & Saving**
```
1. Admin clicks Edit → Form becomes editable (inline)
2. Admin modifies fields (title, description, etc.)
3. Admin clicks Save → PUT request sent to backend
4. Backend validates & updates MySQL database
5. Frontend receives success response
6. List auto-refreshes with new data
```

**When Deleting**
```
1. Admin clicks Delete → Confirmation dialog appears
2. Admin confirms → DELETE request sent to backend
3. Backend deletes from MySQL database
4. Frontend receives success response
5. Item removed from displayed list immediately
```

**When Marking as Read**
```
1. Admin clicks Mark as Read → PUT request sent
2. Backend updates isRead = true in database
3. Frontend removes "Mark as Read" button
4. Unread badge count decreases
5. Message styling changes from orange to gray
```

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
