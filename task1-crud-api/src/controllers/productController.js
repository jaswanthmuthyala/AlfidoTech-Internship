const Product = require("../models/Product");

// ── GET /api/products  ──────────────────────────────────────────────────────
// List all products with optional filtering & pagination
const getAllProducts = async (req, res, next) => {
  try {
    const { category, isAvailable, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/products/:id  ──────────────────────────────────────────────────
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/products  ─────────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/products/:id  ──────────────────────────────────────────────────
// Full replace — all required fields must be sent
const replaceProduct = async (req, res, next) => {
  try {
    // runValidators ensures schema rules are applied on update too
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      overwrite: true, // PUT = full replace
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/products/:id  ────────────────────────────────────────────────
// Partial update — send only the fields you want to change
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/products/:id  ───────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully", data: {} });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};
