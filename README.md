# Mini CRM 👥

A modern, fast, and secure full-stack customer relationship management (CRM) application built using the MERN stack (MongoDB, Express, React, Node.js). 

This application provides a highly polished, responsive layout, dynamic visual analytics dashboards, comprehensive leads CRUD management, JWT-based secure user authentication, and a persistent dark mode toggle featuring premium monochromatic SVG icons.

---

## 🚀 Features

### 🔐 Secure Authentication & Access Control
- Full **JWT-based user registration and login** systems.
- Robust server-side validation using **express-validator**.
- Secure password hashing using **bcryptjs**.
- Client-side route protection with auto-redirection of unauthenticated users.

### 📊 Real-Time Analytics Dashboard
- Comprehensive KPI status tracking cards with responsive design.
- **Interactive charts** powered by **Recharts**:
  - **Leads by Status** (Vertical Bar Chart).
  - **Pipeline Distribution** (Donut Pie Chart).
- Smooth SVG micro-animations and stylized custom tooltips.

### 👥 Interactive Leads Manager
- Complete **CRUD (Create, Read, Update, Delete) Pipeline** for customer leads.
- Full-text search by lead **name** and **email**.
- Status filtering controls (*New*, *Contacted*, *Converted*).
- Dynamic team assignments (leads can be assigned to different registered users).
- Client-side notification toasts indicating success/error states.

### 🎨 State-Of-The-Art Premium UI
- Styled using **Tailwind CSS v4** with a highly curated custom utility system.
- Persistent **Light / Dark Theme** toggling via global React context.
- Full responsive sidebar and header layouts.
- Replaced standard emojis with a hand-crafted **premium monochromatic SVG icon set** for unified professional branding.
- Full dark mode contrast correction for all form fields and native select options.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite-powered environment)
- **Styling**: Tailwind CSS v4 & custom Vanilla CSS
- **Data Visualization**: Recharts (fully responsive SVG charts)
- **HTTP Client**: Axios with interceptors for token management
- **Routing**: React Router DOM v7

### Backend
- **Runtime**: Node.js
- **Framework**: Express (with robust custom middleware)
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Environment Management**: dotenv

---

## 📁 Repository Structure

```text
Mini CRM/
├── backend/
│   ├── controllers/      # Route controllers (auth, leads)
│   ├── middleware/       # Custom auth verification
│   ├── models/           # Mongoose schemas (User, Lead)
│   ├── routes/           # Express router endpoints
│   ├── seed.js           # Database seeder script
│   ├── server.js         # Entry point for backend
│   └── .env              # Backend secrets and environment configuration
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios client config with JWT authorization headers
│   │   ├── components/   # Shared elements (Modal, ProtectedRoute, Icons)
│   │   ├── context/      # Global contexts (Auth, Theme, Toast)
│   │   ├── layouts/      # App layouts (Sidebar, Header, AppLayout)
│   │   ├── pages/        # Dashboard overview, Leads manager, Auth form
│   │   ├── index.css     # Global styles and dark-theme configurations
│   │   └── main.jsx      # Vite React app bootstrap
│   └── .env              # Frontend client environment configuration
│
└── package.json          # Root scripts to run both apps concurrently
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v16+ recommended)
- **npm** (v8+ recommended)
- **MongoDB** (Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

### 2. Clone and Install Dependencies
Navigate into the root directory of the project and install all required modules:

```bash
# Clone the repository (if not already done)
git clone https://github.com/MohsinImtiaz524/Mini-CRM.git
cd Mini-CRM

# Install root developer dependencies
npm install

# Install backend dependencies
npm run install --prefix backend

# Install frontend dependencies
npm run install --prefix frontend
```

### 3. Environment Variables Setup
Configure your environment variables in both `backend` and `frontend` directories.

#### Backend Env (`backend/.env`)
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini_crm
JWT_SECRET=your_jwt_secret_key
```

#### Frontend Env (`frontend/.env`)
Create a `.env` file inside the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the Database (Optional)
To quickly populate the database with mock leads and users for testing purposes, run the backend seeder script:
```bash
npm run seed --prefix backend
```

### 5. Running the Application
You can run both the frontend and backend servers concurrently with a single command from the project root directory:

```bash
npm run dev
```

- **Frontend Server**: Launches at [http://localhost:5173/](http://localhost:5173/) (or next available port, e.g. `5174`)
- **Backend Server**: Launches at [http://localhost:5000/](http://localhost:5000/)

---

## 📡 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| **POST** | `/api/auth/register` | Register a new user | No |
| **POST** | `/api/auth/login` | Login to receive a JWT access token | No |
| **GET** | `/api/auth/users` | Retrieve all registered users | Yes |

### Leads Pipeline Routes
| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| **GET** | `/api/leads` | Retrieve all leads (supports search, status, and pagination query params) | Yes |
| **POST** | `/api/leads` | Create a new lead | Yes |
| **PUT** | `/api/leads/:id` | Update an existing lead status or details | Yes |
| **DELETE** | `/api/leads/:id` | Remove a lead from the system | Yes |
