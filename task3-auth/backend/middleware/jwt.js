const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;
const ACCESS_TTL = process.env.JWT_EXPIRES_IN || "15m";
const REFRESH_TTL = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

/**
 * Issue a short-lived access token (15 min default).
 * Payload: { sub: userId, email, role }
 */
function signAccess(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

/**
 * Issue a long-lived refresh token (7 days default).
 * Keeps payload minimal — only userId needed.
 */
function signRefresh(user) {
  return jwt.sign({ sub: user.id }, SECRET, { expiresIn: REFRESH_TTL });
}

/**
 * Verify any token; throws on invalid/expired.
 */
function verify(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signAccess, signRefresh, verify };
