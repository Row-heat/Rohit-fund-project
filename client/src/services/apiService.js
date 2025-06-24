import axios from "axios"

class ApiService {
  constructor() {
    // FIXED: Use production backend URL
    this.baseURL = process.env.REACT_APP_API_URL || "https://rohit-fund-project.onrender.com"
    
    // Set default axios config
    axios.defaults.baseURL = this.baseURL
    axios.defaults.timeout = 30000 // 30 seconds for slow Render startup
  }

  async searchFunds(searchTerm) {
    try {
      console.log(`🔍 Searching funds: "${searchTerm}"`)
      console.log(`🌐 Using API: ${this.baseURL}`)

      const response = await axios.get(`/api/funds/search`, {
        params: { q: searchTerm },
        timeout: 30000,
      })

      console.log(`✅ Search completed: ${response.data.count} results`)
      return response.data
    } catch (error) {
      console.error("❌ Search failed:", error.message)
      console.log("🔄 Trying fallback API...")
      
      try {
        const fallbackResponse = await axios.get("https://api.mfapi.in/mf", {
          timeout: 15000,
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

  async getFundDetails(schemeCode) {
    try {
      console.log(`🔍 Getting fund details: ${schemeCode}`)

      const response = await axios.get(`/api/funds/details/${schemeCode}`, {
        timeout: 20000,
      })

      console.log("✅ Fund details received")
      return response.data
    } catch (error) {
      console.error("❌ Fund details failed:", error.message)
      console.log("🔄 Trying fallback API for fund details...")
      
      try {
        const fallbackResponse = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, {
          timeout: 15000,
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

  async saveFund(schemeCode, schemeName) {
    try {
      const response = await axios.post(`/api/funds/save`, {
        schemeCode,
        schemeName,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to save fund")
    }
  }

  async getSavedFunds() {
    try {
      const response = await axios.get(`/api/funds`)
      return response.data
    } catch (error) {
      throw new Error("Failed to fetch saved funds")
    }
  }

  async removeFund(fundId) {
    try {
      const response = await axios.delete(`/api/funds/${fundId}`)
      return response.data
    } catch (error) {
      throw new Error("Failed to remove fund")
    }
  }
}

export default new ApiService()