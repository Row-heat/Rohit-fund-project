"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import apiService from "../services/apiService"

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [apiStatus, setApiStatus] = useState(null)
  const navigate = useNavigate()

  const searchFunds = async (term) => {
    if (!term.trim()) return

    setLoading(true)
    setApiStatus(null)

    try {
      const result = await apiService.searchFunds(term)

      setFunds(result.data || [])
      setSearched(true)

      // Show API status
      if (result.fallback) {
        setApiStatus("Using fallback API (mfapi.in)")
      } else {
        setApiStatus("Connected to your custom API")
      }
    } catch (error) {
      console.error("Error searching funds:", error)
      setFunds([])
      setApiStatus("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    searchFunds(searchTerm)
  }

  const handleFundClick = (schemeCode) => {
    navigate(`/fund/${schemeCode}`)
  }

  const handleSuggestionClick = (term) => {
    setSearchTerm(term)
    searchFunds(term)
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          padding: "40px",
          marginBottom: "30px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "16px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🏦 Find Your Perfect Mutual Fund
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "18px",
            marginBottom: "32px",
            maxWidth: "600px",
            margin: "0 auto 32px auto",
          }}
        >
          Search from thousands of mutual funds using our integrated API and build your investment portfolio
        </p>

        <form onSubmit={handleSearch} style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search mutual funds (try 'SBI', 'HDFC', 'ICICI')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 24px",
                fontSize: "18px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                paddingRight: "120px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea"
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb"
                e.target.style.boxShadow = "none"
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#667eea",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "🔄" : "🔍 Search"}
            </button>
          </div>
        </form>

        {/* API Status Indicator */}
        {apiStatus && (
          <div
            style={{
              marginTop: "16px",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "500",
              background: apiStatus.includes("fallback")
                ? "rgba(251, 191, 36, 0.1)"
                : apiStatus.includes("failed")
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(34, 197, 94, 0.1)",
              color: apiStatus.includes("fallback") ? "#d97706" : apiStatus.includes("failed") ? "#dc2626" : "#059669",
              display: "inline-block",
            }}
          >
            {apiStatus.includes("fallback") ? "⚠️" : apiStatus.includes("failed") ? "❌" : "✅"} {apiStatus}
          </div>
        )}
      </div>

      {loading && (
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
          <p style={{ marginTop: "16px", color: "#6b7280", fontSize: "16px" }}>🔍 Searching funds via API...</p>
        </div>
      )}

      {!loading && searched && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "30px",
            backdropFilter: "blur(10px)",
          }}
        >
          {funds.length > 0 ? (
            <>
              <h2
                style={{
                  marginBottom: "20px",
                  color: "#1f2937",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                📊 Found {funds.length} funds
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {funds.slice(0, 20).map((fund) => (
                  <div
                    key={fund.schemeCode}
                    style={{
                      background: "white",
                      borderRadius: "12px",
                      padding: "20px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border: "2px solid transparent",
                    }}
                    onClick={() => handleFundClick(fund.schemeCode)}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-2px)"
                      e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)"
                      e.target.style.borderColor = "#667eea"
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)"
                      e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                      e.target.style.borderColor = "transparent"
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#1f2937",
                        marginBottom: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      {fund.schemeName}
                    </h3>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        🏷️ Code: <span style={{ fontWeight: "500" }}>{fund.schemeCode}</span>
                      </p>
                      {fund.fundHouse && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#6b7280",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          🏢 {fund.fundHouse}
                        </p>
                      )}
                      {fund.category && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#667eea",
                            fontWeight: "500",
                          }}
                        >
                          📊 {fund.category}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {funds.length > 20 && (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      fontStyle: "italic",
                      marginTop: "16px",
                    }}
                  >
                    📝 Showing first 20 results of {funds.length} funds
                  </p>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h3 style={{ color: "#374151", marginBottom: "16px", fontSize: "24px" }}>😔 No funds found</h3>
              <p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "16px" }}>
                Try searching with different keywords
              </p>
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            padding: "30px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3
            style={{
              color: "#374151",
              marginBottom: "20px",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            💡 Popular Searches
          </h3>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["SBI", "HDFC", "ICICI", "Equity", "Debt", "ELSS"].map((term) => (
              <button
                key={term}
                onClick={() => handleSuggestionClick(term)}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)"
                  e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)"
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "none"
                }}
              >
                {term} Funds
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Landing
