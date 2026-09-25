# PayRemind Backend

Node.js + Express + MongoDB backend for the PayRemind React application.

## 1. Requirements

Install:
- Node.js
- MongoDB Community Server, OR create a MongoDB Atlas database

## 2. Install packages

Open this folder in VS Code terminal:

```bash
npm install
```

## 3. Create `.env`

Copy `.env.example` to `.env`.

For local MongoDB:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/payremind
JWT_SECRET=payremind_super_secret_change_me
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## 4. Start backend

Development:

```bash
npm run dev
```

Normal:

```bash
npm start
```

Backend:
http://localhost:5000

Test:
http://localhost:5000/

## API

Authentication:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

Customers:
- GET `/api/customers`
- POST `/api/customers`
- PUT `/api/customers/:id`
- DELETE `/api/customers/:id`

Payments:
- GET `/api/payments`
- POST `/api/payments`
- PUT `/api/payments/:id`
- DELETE `/api/payments/:id`

Products:
- GET `/api/products`
- POST `/api/products`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

Expenses:
- GET `/api/expenses`
- POST `/api/expenses`
- PUT `/api/expenses/:id`
- DELETE `/api/expenses/:id`

Reminders:
- GET `/api/reminders`
- POST `/api/reminders`
- PUT `/api/reminders/:id`
- DELETE `/api/reminders/:id`

Dashboard:
- GET `/api/dashboard`

Protected routes need:

`Authorization: Bearer YOUR_JWT_TOKEN`

## Important

Your current PayRemind frontend still uses demo data/localStorage. This backend is ready, but the frontend must be changed to call these APIs. The backend does not automatically replace the existing frontend demo logic.
