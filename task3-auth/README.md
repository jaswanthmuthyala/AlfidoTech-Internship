# Task 3 — Authentication & Protected Routes (JWT)

## Project Structure

```
task3-auth/
├── backend/
│   ├── middleware/
│   │   ├── authMiddleware.js   # requireAuth + requireRole
│   │   └── jwt.js              # signAccess, signRefresh, verify
│   ├── models/
│   │   └── users.js            # In-memory user store (swap with DB)
│   ├── routes/
│   │   ├── auth.js             # signup / login / refresh / logout / me
│   │   └── protected.js        # Demo protected endpoints
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   └── src/
│       ├── context/
│       │   └── AuthContext.jsx  # Global auth state + authFetch helper
│       ├── components/
│       │   └── ProtectedRoute.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── SignupPage.jsx
│       │   └── DashboardPage.jsx
│       └── App.jsx              # Route layout
└── SECURITY_NOTES.md
```

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env          # Edit JWT_SECRET to a random string
npm install
npm run dev                   # Starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start                     # Starts on http://localhost:3000
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | — | Register new user |
| POST | /api/auth/login | — | Login, sets cookies |
| POST | /api/auth/refresh | refresh cookie | Get new access token |
| POST | /api/auth/logout | — | Clear cookies |
| GET | /api/auth/me | ✅ | Get current user |
| GET | /api/dashboard | ✅ | Protected data |
| GET | /api/profile | ✅ | User profile |
| GET | /api/admin | ✅ admin only | Role-restricted |

## How Auth Flow Works

```
1. User submits login form
2. Server validates credentials, bcrypt.compare()
3. Server sets two httpOnly cookies:
   - accessToken  (15 min)
   - refreshToken (7 days)
4. Browser automatically sends cookies on every request
5. requireAuth middleware verifies accessToken
6. If accessToken expires → client calls /auth/refresh → new token issued
7. Logout clears both cookies
```
