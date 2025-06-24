"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user) return null

  return (
    <nav
      style={{
        background: "rgba(255,255,255,0.95)",
        padding: "16px 0",
        marginBottom: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#667eea",
            textDecoration: "none",
          }}
        >
          🏦 MutualFund Pro
        </Link>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              color: location.pathname === "/" ? "#667eea" : "#666",
              textDecoration: "none",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "20px",
              background: location.pathname === "/" ? "rgba(102, 126, 234, 0.1)" : "transparent",
            }}
          >
            🔍 Search Funds
          </Link>
          <Link
            to="/saved"
            style={{
              color: location.pathname === "/saved" ? "#667eea" : "#666",
              textDecoration: "none",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "20px",
              background: location.pathname === "/saved" ? "rgba(102, 126, 234, 0.1)" : "transparent",
            }}
          >
            💼 My Portfolio
          </Link>
          <span
            style={{
              color: "#333",
              fontWeight: "500",
              background: "rgba(102, 126, 234, 0.1)",
              padding: "8px 12px",
              borderRadius: "15px",
              fontSize: "14px",
            }}
          >
            👤 {user.email}
          </span>
          <button
            onClick={logout}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#dc2626")}
            onMouseOut={(e) => (e.target.style.background = "#ef4444")}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
