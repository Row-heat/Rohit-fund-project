"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import apiService from "../services/apiService"

const Landing = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [funds, setFunds] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [apiStatus, setApiStatus] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceTimer = useRef(null)

  const navigate = useNavigate()

  const searchFunds = async (term) => {
    if (!term.trim()) {
      setFunds([])
      setSearched(false)
      setShowDropdown(false)
      setApiStatus(null)
      return
    }

    setLoading(true)
    setApiStatus(null)

    try {
      const result = await apiService.searchFunds(term)
      setFunds(result.data || [])
      setSearched(true)
      setShowDropdown(true)

      // Show API status
      if (result.fallback) {
        setApiStatus("Using fallback API (mfapi.in)")
      } else {
        setApiStatus("Connected to your custom API")
      }
    } catch (error) {
      console.error("Error searching funds:", error)
      setFunds([])
      setSearched(true)
      setShowDropdown(true)
      setApiStatus("Search failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Debounced search effect - triggers 350ms after user stops typing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (searchTerm.trim()) {
        searchFunds(searchTerm)
      } else {
        setFunds([])
        setSearched(false)
        setShowDropdown(false)
      }
    }, 350)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchTerm])

  const handleFundClick = (schemeCode) => {
    navigate(`/fund/${schemeCode}`)
    setShowDropdown(false)
  }

  const handleSuggestionClick = (term) => {
    setSearchTerm(term)
    // searchFunds will be called automatically via useEffect
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

        {/* Search Form - NO SUBMIT HANDLER, NO BUTTON */}
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}
        >
          <div style={{ position: "relative" }}>
            {/* Search Icon/Loading Spinner */}
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              {loading ? <span style={{ fontSize: "20px" }}>🔄</span> : <span style={{ fontSize: "20px" }}>🔍</span>}
            </div>

            <input
              type="text"
              placeholder="Search mutual funds (try 'SBI', 'HDFC', 'ICICI')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 24px 16px 50px", // Left padding for icon, no right padding for button
                fontSize: "18px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea"
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)"
                if (searchTerm.trim() && funds.length > 0) {
                  setShowDropdown(true)
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb"
                e.target.style.boxShadow = "none"
                setTimeout(() => setShowDropdown(false), 200)
              }}
            />

            {/* SEARCH BUTTON COMPLETELY REMOVED */}
          </div>

          {/* Real-time Dropdown Results */}
          {showDropdown && searchTerm.trim() && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "0",
                right: "0",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                border: "2px solid #e5e7eb",
                marginTop: "8px",
                maxHeight: "400px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              {loading && (
                <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                  <div className="spinner"></div>
                  <p>Searching funds...</p>
                </div>
              )}

              {!loading && funds.length === 0 && searched && (
                <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                  <p style={{ fontSize: "16px", marginBottom: "8px" }}>😔 No funds found</p>
                  <p style={{ fontSize: "14px" }}>Try different keywords</p>
                </div>
              )}

              {!loading && funds.length > 0 && (
                <>
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #e5e7eb",
                      fontSize: "14px",
                      color: "#6b7280",
                      fontWeight: "500",
                    }}
                  >
                    📊 {funds.length} funds found
                  </div>
                  {funds.slice(0, 10).map((fund) => (
                    <div
                      key={fund.schemeCode}
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #f3f4f6",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                      onClick={() => handleFundClick(fund.schemeCode)}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#f8fafc"
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "transparent"
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                          marginBottom: "4px",
                          lineHeight: "1.3",
                        }}
                      >
                        {fund.schemeName}
                      </h4>
                      <p style={{ fontSize: "14px", color: "#6b7280" }}>🏷️ Code: {fund.schemeCode}</p>
                    </div>
                  ))}
                  {funds.length > 10 && (
                    <div
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#6b7280",
                        fontStyle: "italic",
                      }}
                    >
                      Showing first 10 results. Total: {funds.length} funds
                    </div>
                  )}
                </>
              )}
            </div>
          )}
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

      {loading && !showDropdown && (
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

      {!loading && searched && !showDropdown && (
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
