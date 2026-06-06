const express = require("express");
const morgan = require("morgan");
const cors = require("cors"); // ADD THIS

const productRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors()); // ADD THIS
app.use(express.json());
app.use(morgan("dev")); // HTTP request logger

// ── Routes ──────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Products CRUD API is running 🚀", version: "1.0.0" });
});

app.use("/api/products", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;