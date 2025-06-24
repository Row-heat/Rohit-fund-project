import axios from "axios"

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || ""
  }

  // Search funds using your API
  async searchFunds(searchTerm) {
    try {
      console.log(`🔍 Searching funds: "${searchTerm}"`)

      const response = await axios.get(`${this.baseURL}/api/funds/search`, {
        params: { q: searchTerm },
        timeout: 15000,
      })

      console.log(`✅ Search completed: ${response.data.count} results`)
      return response.data
    } catch (error) {
      console.error("❌ Search failed:", error.message)

      // Fallback to direct mfapi.in call if your API fails
      console.log("🔄 Trying fallback API...")
      try {
        const fallbackResponse = await axios.get("https://api.mfapi.in/mf", {
          timeout: 10000,
        })

        const filteredFunds = fallbackResponse.data.filter((fund) =>
          fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        return {
          success: true,
          count: filteredFunds.length,
          data: filteredFunds,
          fallback: true,
        }
      } catch (fallbackError) {
        throw new Error("Unable to search funds. Please try again later.")
      }
    }
  }

  // Get fund details using your API
  async getFundDetails(schemeCode) {
    try {
      console.log(`🔍 Getting fund details: ${schemeCode}`)

      const response = await axios.get(`${this.baseURL}/api/funds/details/${schemeCode}`, {
        timeout: 10000,
      })

      console.log("✅ Fund details received")
      return response.data
    } catch (error) {
      console.error("❌ Fund details failed:", error.message)

      // Fallback to direct mfapi.in call
      console.log("🔄 Trying fallback API for fund details...")
      try {
        const fallbackResponse = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, {
          timeout: 10000,
        })

        return {
          success: true,
          data: fallbackResponse.data,
          fallback: true,
        }
      } catch (fallbackError) {
        throw new Error("Unable to fetch fund details. Please try again later.")
      }
    }
  }

  // Save fund (uses existing auth endpoints - UNCHANGED)
  async saveFund(schemeCode, schemeName) {
    try {
      const response = await axios.post(`${this.baseURL}/api/funds/save`, {
        schemeCode,
        schemeName,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to save fund")
    }
  }

  // Get saved funds (UNCHANGED)
  async getSavedFunds() {
    try {
      const response = await axios.get(`${this.baseURL}/api/funds`)
      return response.data
    } catch (error) {
      throw new Error("Failed to fetch saved funds")
    }
  }

  // Remove saved fund (UNCHANGED)
  async removeFund(fundId) {
    try {
      const response = await axios.delete(`${this.baseURL}/api/funds/${fundId}`)
      return response.data
    } catch (error) {
      throw new Error("Failed to remove fund")
    }
  }
}

export default new ApiService()
