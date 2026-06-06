# Security Notes — JWT Authentication (Task 3)

## Token Storage: Where & Why

### ✅ Recommended: httpOnly Cookies

This project uses `httpOnly` cookies to store both the access token and the refresh token.

| Property | Value | Why |
|---|---|---|
| `httpOnly` | `true` | JavaScript cannot read the cookie — prevents XSS token theft |
| `secure` | `true` in production | Cookie is only sent over HTTPS |
| `sameSite` | `"strict"` | Browser refuses to send the cookie on cross-site requests — prevents CSRF |

```js
res.cookie("accessToken", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000, // 15 min
});
```

### ❌ Avoid: localStorage / sessionStorage

Many tutorials store JWTs in `localStorage`. **Do not do this in production.**

- Any JavaScript on the page can read `localStorage` — including injected scripts (XSS)
- A single XSS vulnerability (a bad npm package, a user-generated content flaw) can silently steal every user's token

---

## Access Token vs. Refresh Token

| | Access Token | Refresh Token |
|---|---|---|
| **TTL** | Short (15 min) | Long (7 days) |
| **Purpose** | Sent with each API request | Only used to get a new access token |
| **If stolen** | Attacker has 15 min max | Attacker can get unlimited access tokens |
| **Storage** | httpOnly cookie | httpOnly cookie (separate) |

Short-lived access tokens limit the damage window if a token is somehow leaked.

---

## Password Hashing

```js
// ✅ Correct — bcrypt with 12 salt rounds
const hash = await bcrypt.hash(password, 12);

// ❌ Never store or compare plain-text passwords
// ❌ Never use MD5/SHA1/SHA256 alone — they're too fast
```

**Why bcrypt?**
- Designed to be *slow* (computationally expensive) — makes brute-force attacks impractical
- Automatically salts each hash — two identical passwords produce different hashes
- Salt rounds of 12 is a good default (~250ms per hash). Increase over time as hardware improves.

---

## Common Pitfalls

### 1. Timing Attacks on Login
If you return an error immediately when an email is not found (before hashing), attackers can enumerate valid emails by measuring response time.

```js
// ✅ Always hash even when the user doesn't exist
if (!user) {
  await bcrypt.hash(password, 12); // dummy work
  return res.status(401).json({ message: "Invalid credentials" });
}
```

### 2. Leaking Token Payload to the Client
JWTs are **signed, not encrypted**. Anyone can base64-decode the payload.

```
// Never put sensitive data in the JWT payload:
{ sub: 1, email: "user@example.com", role: "user" }  // ✅ fine
{ creditCard: "4111...", ssn: "xxx-xx" }              // ❌ never
```

### 3. Not Verifying the Algorithm
Specify the expected algorithm explicitly when verifying:

```js
jwt.verify(token, SECRET, { algorithms: ["HS256"] });
```
Without this, an attacker could potentially forge a token with `alg: "none"`.

### 4. Not Revoking Refresh Tokens on Logout
This implementation clears the cookie on logout. In a real app, store a refresh token **denylist** (Redis is ideal) so stolen tokens can be revoked server-side.

### 5. CORS + Credentials
When using cookies cross-origin, both sides must opt in:

```js
// Server
cors({ origin: "http://localhost:3000", credentials: true })

// Client
fetch(url, { credentials: "include" })
```

---

## Production Checklist

- [ ] `JWT_SECRET` is a random 32+ byte string (not committed to git)
- [ ] `NODE_ENV=production` so `secure: true` is set on cookies
- [ ] HTTPS is enforced (cookies with `secure` won't be sent over HTTP)
- [ ] Refresh token denylist for logout revocation (Redis)
- [ ] Rate-limit `/auth/login` and `/auth/signup` (express-rate-limit)
- [ ] Input validation library (e.g., Zod or Joi) on all request bodies
- [ ] Helmet.js for HTTP security headers
