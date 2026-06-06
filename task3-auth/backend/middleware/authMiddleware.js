const { verify } = require("./jwt");

/**
 * requireAuth — verifies the JWT sent as an httpOnly cookie OR
 *               a Bearer token in the Authorization header.
 *
 * Cookie strategy is preferred (more secure for web apps).
 * Bearer header fallback keeps API clients (Postman, mobile) working.
 */
function requireAuth(req, res, next) {
  try {
    let token;

    // 1. Prefer httpOnly cookie (set by /auth/login)
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // 2. Fallback: Authorization: Bearer <token>
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.slice(7);
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = verify(token);
    req.user = payload; // { sub, email, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * requireRole("admin") — chain AFTER requireAuth.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
