"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom" // <-- import useNavigate
import { useAuth } from "../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate() // <-- initialize navigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    const result = await register(formData.email, formData.password)

    if (!result.success) {
      setError(result.message)
      setLoading(false)
      return
    }

    // Redirect to login page after successful registration
    navigate("/login")
    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#333", marginBottom: "8px" }}>🎯 Create Account</h1>
          <p style={{ color: "#666", fontSize: "16px" }}>Join MutualFund Pro and start investing</p>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              borderLeft: "4px solid #dc2626",
              fontSize: "14px",
            }}
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              📧 Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              🔒 Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min 6 characters)"
              minLength="6"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#374151",
                fontSize: "14px",
              }}
            >
              🔐 Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "16px",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#9ca3af" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              marginBottom: "20px",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "🔄 Creating Account..." : "🎉 Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "14px" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
