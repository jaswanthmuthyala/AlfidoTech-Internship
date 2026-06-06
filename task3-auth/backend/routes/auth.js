const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const UserStore = require("../models/users");
const { signAccess, signRefresh, verify } = require("../middleware/jwt");
const { requireAuth } = require("../middleware/authMiddleware");

// ── Cookie config ─────────────────────────────────────────────────────────────
const COOKIE_OPTS = {
  httpOnly: true,        // JS cannot read this cookie → XSS protection
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict",    // CSRF protection
  path: "/",
};

const ACCESS_COOKIE_TTL  = 15 * 60 * 1000;          // 15 min  in ms
const REFRESH_COOKIE_TTL = 7  * 24 * 60 * 60 * 1000; // 7 days in ms

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    if (UserStore.findByEmail(email)) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // bcrypt: salt rounds = 12 (good balance of security vs. speed)
    const passwordHash = await bcrypt.hash(password, 12);
    const user = UserStore.create({ email, passwordHash });

    const accessToken  = signAccess(user);
    const refreshToken = signRefresh(user);

    res
      .cookie("accessToken",  accessToken,  { ...COOKIE_OPTS, maxAge: ACCESS_COOKIE_TTL  })
      .cookie("refreshToken", refreshToken, { ...COOKIE_OPTS, maxAge: REFRESH_COOKIE_TTL })
      .status(201)
      .json({ user: UserStore.toPublic(user) });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = UserStore.findByEmail(email);
    if (!user) {
      // Constant-time-ish: still hash even on missing user to prevent timing attacks
      await bcrypt.hash(password, 12);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken  = signAccess(user);
    const refreshToken = signRefresh(user);

    res
      .cookie("accessToken",  accessToken,  { ...COOKIE_OPTS, maxAge: ACCESS_COOKIE_TTL  })
      .cookie("refreshToken", refreshToken, { ...COOKIE_OPTS, maxAge: REFRESH_COOKIE_TTL })
      .json({ user: UserStore.toPublic(user) });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post("/refresh", (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = verify(token);
    const user    = UserStore.findById(payload.sub);
    if (!user) return res.status(401).json({ message: "User not found" });

    const newAccessToken = signAccess(user);
    res
      .cookie("accessToken", newAccessToken, { ...COOKIE_OPTS, maxAge: ACCESS_COOKIE_TTL })
      .json({ message: "Token refreshed" });
  } catch {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  res
    .clearCookie("accessToken",  { path: "/" })
    .clearCookie("refreshToken", { path: "/" })
    .json({ message: "Logged out" });
});

// ── GET /api/auth/me  (requires valid access token) ───────────────────────────
router.get("/me", requireAuth, (req, res) => {
  const user = UserStore.findById(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: UserStore.toPublic(user) });
});

module.exports = router;
