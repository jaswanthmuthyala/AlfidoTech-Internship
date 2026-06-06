import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function DashboardPage() {
  const { user, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [data,  setData]  = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch(`${API}/dashboard`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [authFetch]);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <div className="header-right">
          <span className="badge">{user?.role}</span>
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="btn-outline">Logout</button>
        </div>
      </header>

      {error && <p className="error-msg">{error}</p>}

      {data && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Items</h3>
            <p className="stat-num">{data.data.stats.items}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-num">{data.data.stats.pending}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-num">{data.data.stats.completed}</p>
          </div>
        </div>
      )}

      <p style={{ marginTop: "1rem", color: "#666" }}>
        {data?.message}
      </p>
    </div>
  );
}
