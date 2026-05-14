# 🌳 Rent-a-Tree Platform

A full-stack web application for renting/adopting fruit trees from farmers.

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, react-hot-toast, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Auth**: JWT (JSON Web Tokens)
- **File Uploads**: Multer

## Color Theme
- Primary: **Pista Green** (#93C572)
- Background: **White** (#FFFFFF)

---

## 🚀 Setup Instructions

### 1. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source /path/to/rent-a-tree/database.sql
```

### 2. Backend Setup
```bash
cd backend
npm install

# Edit .env file with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=rent_a_tree
# JWT_SECRET=your_secret_key

npm run dev   # Development (with nodemon)
# OR
npm start     # Production
```
Backend runs on: http://localhost:5000

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

---

## 👥 Test Accounts

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Admin    | admin@rentAtree.com    | admin123    |
| Farmer   | farmer@test.com        | farmer123   |
| Customer | customer@test.com      | customer123 |

---

## 📁 Project Structure
```
rent-a-tree/
├── database.sql              # MySQL schema + sample data
├── backend/
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── src/
│       ├── server.js         # Express entry point
│       ├── config/db.js      # MySQL connection pool
│       ├── middleware/
│       │   ├── auth.js       # JWT auth middleware
│       │   └── upload.js     # Multer image upload
│       └── routes/
│           ├── auth.js       # Login/Register
│           ├── trees.js      # Tree CRUD
│           ├── adoptions.js  # Adoption management
│           ├── activity.js   # Maintenance + Harvest
│           └── admin.js      # Admin operations
└── frontend/
    ├── public/index.html
    └── src/
        ├── App.jsx           # Routes
        ├── index.css         # Global styles (pista theme)
        ├── context/AuthContext.jsx
        ├── utils/api.js      # Axios instance
        ├── components/
        │   ├── Sidebar.jsx
        │   └── Layout.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── customer/     # Dashboard, Browse, Adoptions
            ├── farmer/       # Dashboard, Trees, Maintenance, Harvest
            └── admin/        # Dashboard, Trees, Users, Reports, Disputes
```

## 🔑 Features
- ✅ Role-based auth (Customer / Farmer / Admin)
- ✅ Tree adoption with delivery type selection
- ✅ Image uploads (tree, fruit, profile)
- ✅ Maintenance logging
- ✅ Harvest recording with profit calculation (10% commission)
- ✅ Admin approve/reject trees and farmers
- ✅ Dispute management
- ✅ Analytics & Reports
- ✅ Responsive design (mobile + desktop)
- ✅ White + Pista green theme
