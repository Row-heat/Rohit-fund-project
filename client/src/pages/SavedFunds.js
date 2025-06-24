"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const SavedFunds = () => {
  const [savedFunds, setSavedFunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchSavedFunds()
  }, [])

  const fetchSavedFunds = async () => {
    try {
      const response = await axios.get("/api/funds")
      setSavedFunds(response.data.savedFunds)
    } catch (error) {
      console.error("Error fetching saved funds:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFund = async (fundId) => {
    if (!window.confirm("Are you sure you want to remove this fund from your portfolio?")) {
      return
    }

    try {
      await axios.delete(`/api/funds/${fundId}`)
      setSavedFunds(savedFunds.filter((fund) => fund._id !== fundId))
      setMessage("Fund removed from portfolio successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error removing fund:", error)
    }
  }

  const handleFundClick = (schemeCode) => {
    navigate(`/fund/${schemeCode}`)
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="spinner"></div>
          <p style={{ marginTop: "16px", color: "#6b7280", fontSize: "16px" }}>📊 Loading your portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          padding: "30px",
          marginBottom: "30px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          💼 My Investment Portfolio
        </h1>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>
          {savedFunds.length} fund{savedFunds.length !== 1 ? "s" : ""} in your portfolio
        </p>
      </div>

      {message && (
        <div
          style={{
            background: "#f0fdf4",
            color: "#16a34a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
            borderLeft: "4px solid #16a34a",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          ✅ {message}
        </div>
      )}

      {savedFunds.length > 0 ? (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "30px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "grid", gap: "16px" }}>
            {savedFunds.map((fund) => (
              <div
                key={fund._id}
                style={{
                  background: "white",
                  borderRadius: "15px",
                  padding: "24px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  border: "2px solid transparent",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"
                  e.currentTarget.style.borderColor = "#667eea"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
                  e.currentTarget.style.borderColor = "transparent"
                }}
              >
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => handleFundClick(fund.schemeCode)}>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "8px",
                      lineHeight: "1.4",
                    }}
                  >
                    📈 {fund.schemeName}
                  </h3>
                  <div style={{ display: "flex", gap: "20px", marginBottom: "8px" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      🏷️ <strong>Code:</strong> {fund.schemeCode}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      fontStyle: "italic",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    📅 Saved on{" "}
                    {new Date(fund.savedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFund(fund._id)
                  }}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    marginLeft: "20px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = "#dc2626"
                    e.target.style.transform = "scale(1.05)"
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = "#ef4444"
                    e.target.style.transform = "scale(1)"
                  }}
                >
                  🗑️ Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "60px 40px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📊</div>
          <h3
            style={{
              color: "#374151",
              marginBottom: "16px",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            Your portfolio is empty
          </h3>
          <p
            style={{
              color: "#6b7280",
              marginBottom: "32px",
              fontSize: "16px",
              maxWidth: "400px",
              margin: "0 auto 32px auto",
            }}
          >
            Start building your investment portfolio by searching and saving mutual funds that match your investment
            goals.
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.6)"
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)"
            }}
          >
            🔍 Start Searching Funds
          </button>
        </div>
      )}
    </div>
  )
}

export default SavedFunds
