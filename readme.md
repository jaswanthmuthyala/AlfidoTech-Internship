# Task 1 – RESTful CRUD API (Node + Express + MongoDB)

A fully-featured CRUD REST API for **Products**, built with Node.js, Express, and MongoDB via Mongoose.

---

## Project Structure

```
task1-crud-api/
├── src/
│   ├── server.js                  # Entry point
│   ├── app.js                     # Express app & middleware
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   └── Product.js             # Mongoose schema + validation
│   ├── controllers/
│   │   └── productController.js   # All CRUD business logic
│   ├── routes/
│   │   └── productRoutes.js       # Express router
│   └── middleware/
│       └── errorHandler.js        # Global error handler
├── products_api.postman_collection.json
├── .env.example
├── package.json
└── README.md
```

---

## Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas connection string

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and set MONGO_URI to your MongoDB connection string
```

### 4. Run the server
```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`

---

## API Endpoints

| Method   | Endpoint                | Description                          |
|----------|-------------------------|--------------------------------------|
| `GET`    | `/api/products`         | List all products (with pagination)  |
| `GET`    | `/api/products/:id`     | Get a single product by ID           |
| `POST`   | `/api/products`         | Create a new product                 |
| `PUT`    | `/api/products/:id`     | Full replace (all fields required)   |
| `PATCH`  | `/api/products/:id`     | Partial update (only sent fields)    |
| `DELETE` | `/api/products/:id`     | Delete a product                     |

### Query Parameters (GET /api/products)
| Param         | Type    | Example              | Description               |
|---------------|---------|----------------------|---------------------------|
| `page`        | number  | `?page=2`            | Page number (default: 1)  |
| `limit`       | number  | `?limit=5`           | Items per page (default: 10) |
| `category`    | string  | `?category=electronics` | Filter by category     |
| `isAvailable` | boolean | `?isAvailable=true`  | Filter by availability    |

---

## Product Schema

```json
{
  "name":        "string  (required, 2–100 chars)",
  "description": "string  (optional, max 500 chars)",
  "price":       "number  (required, ≥ 0)",
  "category":    "enum    (required) → electronics | clothing | food | books | other",
  "stock":       "number  (required, ≥ 0)",
  "isAvailable": "boolean (default: true)"
}
```

---

## Sample Requests (curl)

**Create a product:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Headphones",
    "description": "Noise-cancelling, 30-hour battery",
    "price": 2999,
    "category": "electronics",
    "stock": 50
  }'
```

**List all products:**
```bash
curl http://localhost:5000/api/products?page=1&limit=5
```

**Partial update (price only):**
```bash
curl -X PATCH http://localhost:5000/api/products/<ID> \
  -H "Content-Type: application/json" \
  -d '{"price": 2499}'
```

**Delete:**
```bash
curl -X DELETE http://localhost:5000/api/products/<ID>
```

---

## Error Responses

All errors follow this shape:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "price", "message": "Price is required" }
  ]
}
```

| Status | Cause                          |
|--------|-------------------------------|
| `400`  | Validation error / bad ID     |
| `404`  | Product not found             |
| `409`  | Duplicate key                 |
| `500`  | Unexpected server error       |

---

## Postman Collection

Import `products_api.postman_collection.json` into Postman:
1. Open Postman → **Import** → select the file
2. Set the `product_id` collection variable after creating a product
3. All 8 sample requests are ready to run
# Task 2 – Frontend SPA with React

A production-quality React Single-Page Application that consumes the Task 1 REST API, providing a full UI for CRUD operations on Products.

---

## Features

- **List View** — paginated products table with category & availability filters
- **Detail View** — full product info page
- **Create** — form with client-side validation
- **Edit** — pre-filled form using PATCH
- **Delete** — confirmation modal before deletion
- **Loading & error states** on every async operation
- **Toast notifications** for all actions
- **React Router v6** — clean URL-based navigation

---

## Project Structure

```
src/
├── App.jsx                    # Routes
├── index.js                   # Entry point
├── services/
│   └── api.js                 # Axios instance + productService
├── hooks/
│   └── useProducts.js         # useProducts() + useProduct(id)
├── components/
│   ├── Navbar.jsx
│   ├── ProductForm.jsx        # Shared create/edit form
│   └── DeleteModal.jsx
├── pages/
│   ├── ProductList.jsx        # GET /products — table + filters
│   ├── ProductDetail.jsx      # GET /products/:id
│   ├── CreateProduct.jsx      # POST /products
│   └── EditProduct.jsx        # PATCH /products/:id
└── styles/
    └── global.css             # Full design system
```

---

## Quick Start

### 1. Make sure Task 1 backend is running
```bash
cd ../task1-crud-api
npm run dev   # runs on http://localhost:5000
```

### 2. Install & configure
```bash
cd task2-react-spa
npm install
cp .env.example .env
# .env already points to http://localhost:5000/api — no changes needed for local dev
```

### 3. Start the app
```bash
npm start
# Opens http://localhost:3000
```

---

## Routes

| Path                   | Component       | Description             |
|------------------------|-----------------|-------------------------|
| `/`                    | ProductList     | All products + filters  |
| `/products/new`        | CreateProduct   | Add new product         |
| `/products/:id`        | ProductDetail   | View single product     |
| `/products/:id/edit`   | EditProduct     | Edit product            |

---

## Environment Variables

| Variable              | Default                        | Description            |
|-----------------------|--------------------------------|------------------------|
| `REACT_APP_API_URL`   | `http://localhost:5000/api`    | Backend API base URL   |

---

## Tech Stack

- React 18 (functional components + hooks)
- React Router v6
- Axios (with interceptors)
- react-hot-toast
- Custom CSS design system (no UI framework)
# Task 3 — Authentication & Protected Routes (JWT)

## Project Structure

```
task3-auth/
├── backend/
│   ├── middleware/
│   │   ├── authMiddleware.js   # requireAuth + requireRole
│   │   └── jwt.js              # signAccess, signRefresh, verify
│   ├── models/
│   │   └── users.js            # In-memory user store (swap with DB)
│   ├── routes/
│   │   ├── auth.js             # signup / login / refresh / logout / me
│   │   └── protected.js        # Demo protected endpoints
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx  # Global auth state + authFetch helper
│       ├── components/
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── SignupPage.jsx
│       │   └── DashboardPage.jsx
│       └── App.jsx              # Route layout
└── SECURITY_NOTES.md
```

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env          # Edit JWT_SECRET to a random string
npm install
npm run dev                   # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start                     # Starts on http://localhost:3000
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | — | Register new user |
| POST | /api/auth/login | — | Login, sets cookies |
| POST | /api/auth/refresh | refresh cookie | Get new access token |
| POST | /api/auth/logout | — | Clear cookies |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/dashboard | ✅ | Protected data |
| GET | /api/profile | ✅ | User profile |
| GET | /api/admin | ✅ admin only | Role-restricted |

## How Auth Flow Works

```
1. User submits login form
2. Server validates credentials, bcrypt.compare()
3. Server sets two httpOnly cookies:
   - accessToken  (15 min)
   - refreshToken (7 days)
4. Browser automatically sends cookies on every request
5. requireAuth middleware verifies accessToken
6. If accessToken expires → client calls /auth/refresh → new token issued
7. Logout clears both cookies
```
