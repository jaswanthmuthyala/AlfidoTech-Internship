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
