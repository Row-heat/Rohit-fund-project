"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user) return null

  return (
    <nav
      style={{
        background: "rgba(255,255,255,0.95)",
        padding: "16px 0",
        marginBottom: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)",
        position: "relative",
        zIndex: 100,
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
          position: "relative",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#667eea",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          🏦 MutualFund Pro
        </Link>
        {/* Hamburger button for mobile */}
        <button
          className="navbar-hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "none", // will be shown by CSS on mobile
            background: "none",
            border: "none",
            fontSize: "2rem",
            cursor: "pointer",
            color: "#667eea",
            padding: "4px 8px",
            zIndex: 110,
          }}
        >
          ☰
        </button>
        {/* Desktop links */}
        <div className="navbar-desktop-links" style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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
        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="navbar-mobile-dropdown">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              style={{
                color: location.pathname === "/" ? "#667eea" : "#666",
                textDecoration: "none",
                fontWeight: "500",
                padding: "10px 24px",
                borderRadius: "12px",
                background: location.pathname === "/" ? "rgba(102, 126, 234, 0.1)" : "transparent",
                fontSize: "16px",
              }}
            >
              🔍 Search Funds
            </Link>
            <Link
              to="/saved"
              onClick={() => setMenuOpen(false)}
              style={{
                color: location.pathname === "/saved" ? "#667eea" : "#666",
                textDecoration: "none",
                fontWeight: "500",
                padding: "10px 24px",
                borderRadius: "12px",
                background: location.pathname === "/saved" ? "rgba(102, 126, 234, 0.1)" : "transparent",
                fontSize: "16px",
              }}
            >
              💼 My Portfolio
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false)
                logout()
              }}
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "10px 24px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                marginTop: "4px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={e => (e.target.style.background = "#dc2626")}
              onMouseOut={e => (e.target.style.background = "#ef4444")}
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
