# PayRemind - Integrated Frontend + Backend

This package contains the React frontend and Node/Express/MongoDB backend connected together.

## Project structure

- `payremind-frontend` - React + Vite frontend
- `payremind-backend` - Express + MongoDB backend with JWT authentication

## Requirements

- Node.js 18+ (Node 20+ recommended)
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Start the backend

Open a terminal:

```bash
cd payremind-backend
npm install
npm run dev
```

The backend runs at:

`http://localhost:5000`

The included `.env` is configured for local MongoDB at:

`mongodb://127.0.0.1:27017/payremind`

If you use MongoDB Atlas, edit `payremind-backend/.env` and replace `MONGO_URI`.

## 2. Start the frontend

Open a second terminal:

```bash
cd payremind-frontend
npm install
npm run dev
```

Open the URL Vite shows, normally:

`http://localhost:5173`

The frontend is configured to call:

`http://localhost:5000/api`

If the backend uses another URL, edit `payremind-frontend/.env`.

## What is integrated

- Real registration through `/api/auth/register`
- Real login through `/api/auth/login`
- JWT token storage and protected routes
- Dashboard data from `/api/dashboard`
- Customer CRUD
- Payment CRUD and mark-as-paid
- Product CRUD
- Expense CRUD
- Payment reminders
- API error handling
- Logout and expired-token handling

## Important

The backend `.env` contains a development JWT secret. Change it before using the project outside local development.
