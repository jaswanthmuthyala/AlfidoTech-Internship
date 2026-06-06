const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Collection routes
router.route("/").get(getAllProducts).post(createProduct);

// Single-resource routes
router.route("/:id").get(getProductById).put(replaceProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
