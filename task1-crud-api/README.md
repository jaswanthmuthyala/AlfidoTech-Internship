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
