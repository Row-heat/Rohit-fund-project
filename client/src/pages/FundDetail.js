"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import apiService from "../services/apiService"

const FundDetail = () => {
  const { schemeCode } = useParams()
  const navigate = useNavigate()
  const [fund, setFund] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [apiStatus, setApiStatus] = useState(null)

  useEffect(() => {
    fetchFundDetails()
  }, [schemeCode])

  const fetchFundDetails = async () => {
    try {
      const result = await apiService.getFundDetails(schemeCode)
      setFund(result.data)

      if (result.fallback) {
        setApiStatus("Using fallback API for fund details")
      } else {
        setApiStatus("Connected to your custom API")
      }
    } catch (error) {
      setError("Failed to fetch fund details")
      console.error("Error fetching fund details:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveFund = async () => {
    setSaving(true)
    setMessage("")
    setError("")

    try {
      await apiService.saveFund(fund.meta.scheme_code, fund.meta.scheme_name)
      setMessage("Fund saved to your portfolio successfully!")
      setTimeout(() => setMessage(""), 5000)
    } catch (error) {
      setError(error.message || "Failed to save fund")
      setTimeout(() => setError(""), 5000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "40px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="spinner"></div>
          <p style={{ marginTop: "16px", color: "#6b7280", fontSize: "16px" }}>📊 Loading fund details via API...</p>
        </div>
      </div>
    )
  }

  if (error && !fund) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              background: "#fef2f2",
              color: "#dc2626",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "24px",
              borderLeft: "4px solid #dc2626",
            }}
          >
            ❌ {error}
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#667eea",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ← Back to Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "2px solid #e5e7eb",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          marginBottom: "20px",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.borderColor = "#667eea"
          e.target.style.color = "#667eea"
        }}
        onMouseOut={(e) => {
          e.target.style.borderColor = "#e5e7eb"
          e.target.style.color = "inherit"
        }}
      >
        ← Back to Search
      </button>

      {fund && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "40px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          {/* API Status Indicator */}
          {apiStatus && (
            <div
              style={{
                marginBottom: "20px",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "500",
                background: apiStatus.includes("fallback") ? "rgba(251, 191, 36, 0.1)" : "rgba(34, 197, 94, 0.1)",
                color: apiStatus.includes("fallback") ? "#d97706" : "#059669",
                textAlign: "center",
              }}
            >
              {apiStatus.includes("fallback") ? "⚠️" : "✅"} {apiStatus}
            </div>
          )}

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "16px",
                lineHeight: "1.3",
              }}
            >
              📈 {fund.meta.scheme_name}
            </h1>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500", marginBottom: "8px" }}>
                🏷️ Scheme Code
              </div>
              <div style={{ fontSize: "18px", color: "#1f2937", fontWeight: "600" }}>{fund.meta.scheme_code}</div>
            </div>

            <div
              style={{
                background: "#f0f9ff",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #bae6fd",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500", marginBottom: "8px" }}>
                🏢 Fund House
              </div>
              <div style={{ fontSize: "18px", color: "#1f2937", fontWeight: "600" }}>{fund.meta.fund_house}</div>
            </div>

            <div
              style={{
                background: "#f0fdf4",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #bbf7d0",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500", marginBottom: "8px" }}>
                📊 Category
              </div>
              <div style={{ fontSize: "18px", color: "#1f2937", fontWeight: "600" }}>{fund.meta.scheme_category}</div>
            </div>

            <div
              style={{
                background: "#fef7ff",
                padding: "20px",
                borderRadius: "12px",
                border: "2px solid #e9d5ff",
              }}
            >
              <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500", marginBottom: "8px" }}>🎯 Type</div>
              <div style={{ fontSize: "18px", color: "#1f2937", fontWeight: "600" }}>{fund.meta.scheme_type}</div>
            </div>
          </div>

          {fund.data && fund.data.length > 0 && (
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "24px",
                borderRadius: "16px",
                marginBottom: "32px",
                color: "white",
              }}
            >
              <h3
                style={{
                  marginBottom: "16px",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                💰 Latest NAV Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "4px" }}>📅 Date</div>
                  <div style={{ fontSize: "18px", fontWeight: "600" }}>{fund.data[0].date}</div>
                </div>
                <div>
                  <div style={{ fontSize: "14px", opacity: "0.9", marginBottom: "4px" }}>💵 NAV</div>
                  <div style={{ fontSize: "24px", fontWeight: "700" }}>₹{fund.data[0].nav}</div>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div
              style={{
                background: "#f0fdf4",
                color: "#16a34a",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "24px",
                borderLeft: "4px solid #16a34a",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ✅ {message}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                padding: "16px",
                borderRadius: "12px",
                marginBottom: "24px",
                borderLeft: "4px solid #dc2626",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ❌ {error}
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <button
              onClick={saveFund}
              disabled={saving}
              style={{
                background: saving ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "16px 32px",
                borderRadius: "12px",
                fontSize: "18px",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              }}
              onMouseOver={(e) => {
                if (!saving) {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.6)"
                }
              }}
              onMouseOut={(e) => {
                if (!saving) {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)"
                }
              }}
            >
              {saving ? "🔄 Saving..." : "💾 Save to Portfolio"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundDetail
