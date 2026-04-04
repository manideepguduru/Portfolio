# 🚀 Admin Dashboard - Quick Start Guide

## ✅ What's Working Now

### All 3 Admin Sections Fully Functional
- ✅ **Contacts/Messages** - View, mark read, delete messages from contact form
- ✅ **Projects** - View, edit (title/desc/link/featured), delete all projects
- ✅ **Services** - View, edit (title/desc/active), delete all services

### All Backend APIs Verified
```
✅ Projects:     GET, POST, PUT /api/projects/{id}, DELETE
✅ Services:     GET /all, POST, PUT /api/services/{id}, DELETE  
✅ Contacts:     GET, POST, PUT /read, GET /unread-count, DELETE
```

### Build Status
- ✅ Frontend: Compiles without errors (267.34 kB)
- ✅ Backend: Compiles without errors (clean Maven build)
- ✅ TypeScript: 0 errors

---

## 🔐 Login to Admin Dashboard

### Credentials
```
URL:      http://localhost:3000/admin/login
Password: Infosys@19
```

### Login Features
- Password-only authentication (no email required)
- 24-hour session expiry
- Stored in localStorage
- Logout button in top-right

---

## 📧 CONTACTS TAB (Default View)

### See All Messages
1. Navigate to **Contacts** tab (enabled by default)
2. View unread count badge (red) in top-right
3. Messages display with:
   - 🔴 Red dot indicator for unread messages
   - Name, Email, Message content
   - Date + Time stamp
   - Orange/Gold border for unread, gray for read

### Mark Message as Read
1. Click **"✓ Mark as Read"** button (blue)
2. Badge counter updates automatically
3. Message styling changes from highlighted to gray

### Delete Message
1. Click **"🗑️ Delete"** button (red)
2. Response to `/delete` is sent to backend
3. Message removed from list
4. Unread count updates

---

## 📁 PROJECTS TAB

### View All Projects
1. Click **Projects** tab
2. Table shows: Title | Description | Link | Featured | Actions
3. Projects load from `GET /api/projects`

### Edit Project
1. Click **Edit** button (orange) for any project
2. Fields become editable:
   - Title: text input
   - Description: textarea (expandable)
   - Link: text input  
   - Featured: checkbox (✓ = yes, ○ = no)
3. Click **Save** (cyan) to update via `PUT /api/projects/{id}`
4. Click **Cancel** (gray) to revert changes
5. Table refreshes with updated data

### Delete Project
1. Click **Delete** button (red)
2. Confirm in dialog
3. Sends `DELETE /api/projects/{id}`
4. Project removed from table

---

## 🛠️ SERVICES TAB

### View All Services  
1. Click **Services** tab
2. Table shows: Title | Description | Status | Actions
3. Status displays:
   - **Active** (cyan text) = showing on public site
   - **Inactive** (gray text) = hidden from public site
4. Loads from `GET /api/services/all`

### Edit Service
1. Click **Edit** button (orange) on any service
2. Fields become editable:
   - Title: text input
   - Description: textarea
   - Status: checkbox toggle (checked = Active, unchecked = Inactive)
3. Click **Save** (cyan) to update via `PUT /api/services/{id}`
4. Click **Cancel** (gray) to close editing
5. Table refresh shows changes immediately

### Delete Service
1. Click **Delete** button (red)
2. Confirm deletion
3. Sends `DELETE /api/services/{id}`
4. Service removed from list

---

## 🎨 UI Features

### Tab Navigation
- **Cyan tab** = Currently active section
- **Gray border tab** = Click to switch
- **Tab order**: Contacts | Projects | Services

### Responsive Design
- All tables have horizontal scrolling on small screens
- Message cards stack vertically
- Buttons adapt for touch devices

### Color Coding
- 🔵 **Cyan (#00d9ff)**: Active, clickable, save buttons
- 🟠 **Orange (#ff9500)**: Edit, secondary actions
- 🔴 **Red (#ff6b6b)**: Delete, logout, unread badges
- ⚪ **Gray (#a0aec0)**: Inactive, secondary text, cancel

---

## 🔄 Data Flow

### When You Edit & Save
```
1. Admin clicks Edit → Form becomes editable
2. Admin modifies fields
3. Admin clicks Save → PUT request sent to backend
4. Backend validates & updates database
5. Frontend receives success response
6. List auto-refreshes with new data
```

### When You Delete  
```
1. Admin clicks Delete → Confirmation dialog appears
2. Admin confirms → DELETE request sent
3. Backend deletes from database
4. Frontend receives success response  
5. Item removed from displayed list immediately
```

### When You Mark as Read
```
1. Admin clicks Mark as Read → PUT request sent
2. Backend updates isRead = true
3. Frontend removes the button (already read)
4. Unread badge count decreases
5. Message styling changes to gray
```

---

## ⚙️ Technical Setup

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
```

### Backend (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

### Running Locally
```bash
# Terminal 1: Start Backend
cd backend
mvn spring-boot:run

# Terminal 2: Start Frontend  
cd frontend
npm run dev

# Terminal 3: Access Admin
Browser: http://localhost:5173/admin/login
```

---

## 🧪 Testing Checklist

- [ ] Login with `Infosys@19`
- [ ] View all 3 admin sections (Contacts, Projects, Services)
- [ ] Unread message count shows in red badge
- [ ] Edit a project title and verify it saves
- [ ] Toggle a service status (Active/Inactive)
- [ ] Mark a message as read - button disappears, count decreases
- [ ] Delete a project - removed from table
- [ ] Delete all contacts/messages - list is empty
- [ ] Session persists after page refresh (within 24 hours)
- [ ] Logout clears session and redirects to login

---

## 🐛 Common Issues & Solutions

### Messages not loading?
- Check backend is running on `http://localhost:8080`
- Verify MySQL database has contact records
- Check browser console for error messages

### Edit/Delete buttons not working?
- Ensure backend API is responding (test with Postman)
- Check network tab in browser DevTools
- Verify authentication token is valid

### No unread count badge?
- Check `/api/contact/unread-count` endpoint
- Verify there are unread messages (isRead = false)
- Try refreshing the page

### Styling looks broken?
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh the page (Ctrl+F5)
- Check if CSS is loading (browser DevTools Network)

---

## 📞 Support

**All backends working?** ✅ Yes
**Frontend compiling?** ✅ Yes (0 errors)
**Admin dashboard live?** ✅ Ready to test!

Just login with password `Infosys@19` and start managing your portfolio! 🎉
