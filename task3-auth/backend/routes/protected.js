const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ── GET /api/dashboard ────────────────────────────────────────────────────────
// Any authenticated user can access
router.get("/dashboard", requireAuth, (req, res) => {
  res.json({
    message: `Welcome back, ${req.user.email}!`,
    data: {
      stats: { items: 42, pending: 7, completed: 35 },
      lastLogin: new Date().toISOString(),
    },
  });
});

// ── GET /api/profile ──────────────────────────────────────────────────────────
router.get("/profile", requireAuth, (req, res) => {
  res.json({
    userId: req.user.sub,
    email:  req.user.email,
    role:   req.user.role,
  });
});

// ── GET /api/admin ────────────────────────────────────────────────────────────
// Only "admin" role — demonstrates RBAC
router.get("/admin", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ message: "Admin-only data", secret: "🔒 top secret admin stuff" });
});

module.exports = router;
