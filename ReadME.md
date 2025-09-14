# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



# Multi-Tenant SaaS Notes Application

A secure, multi-tenant notes application with role-based access control and subscription plans.

## Features

- Multi-tenancy with data isolation
- JWT-based authentication
- Role-based access control (Admin/Member)
- Subscription plans (Free/Pro) with feature gating
- Full CRUD operations for notes
- Responsive design with Tailwind CSS

## Multi-Tenancy Approach

This application uses a **shared schema with tenant ID column** approach. All data is stored in a single database with tenant IDs used to isolate data between different companies. This approach provides:

1. **Data Isolation**: Each tenant can only access their own data through tenant ID checks
2. **Scalability**: Easy to add new tenants without schema changes
3. **Maintenance**: Single database to maintain and backup

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend

   Edit the .env file with your configuration:

env
MONGODB_URI=mongodb://localhost:27017/notes-saas
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-saas

JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000

3. Frontend Setup
bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
Edit the .env file:

env
VITE_API_BASE_URL=http://localhost:5000/api
4. Database Setup
 Using Local MongoDB
bash
# Make sure MongoDB is running on your system
# On Windows: Start MongoDB service
# On macOS: brew services start mongodb-community
# On Ubuntu: sudo systemctl start mongod

# Seed the database with test data
cd backend
npm run seed
Running the Application
Start Backend Server
bash
cd backend
npm run dev
Backend will run on http://localhost:5000

Start Frontend Development Server
bash
cd frontend
npm run dev
Frontend will run on http://localhost:5173

Test Accounts
The application comes with pre-configured test accounts:

Acme Corporation
Admin: admin@acme.test / password

User: user@acme.test / password

Globex Corporation
Admin: admin@globex.test / password

User: user@globex.test / password

API Endpoints
Authentication
POST /api/auth/login - User login

GET /api/auth/me - Get current user

Notes
GET /api/notes - Get all notes for current tenant

POST /api/notes - Create a new note

GET /api/notes/:id - Get a specific note

PUT /api/notes/:id - Update a note

DELETE /api/notes/:id - Delete a note

Tenants
POST /api/tenants/:slug/upgrade - Upgrade tenant subscription (Admin only)

GET /api/tenants/subscription - Get tenant subscription info

Health Check
GET /api/health - Server health status

Multi-Tenancy Approach
This application uses a shared schema with tenant ID column approach:

All data is stored in a single database

Each document includes a tenantId field for data isolation

Middleware ensures users can only access their tenant's data

Provides good scalability while maintaining data isolation

Subscription Plans
Free Plan
Maximum of 3 notes per tenant

Basic note management features

Pro Plan
Unlimited notes

All features unlocked

Accessible via admin upgrade endpoint