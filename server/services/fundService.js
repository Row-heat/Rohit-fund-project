const axios = require("axios")
const API_CONFIG = require("../config/api")

class FundService {
  constructor() {
    this.customAPI = API_CONFIG.CUSTOM_MF_API
    this.publicAPI = API_CONFIG.PUBLIC_MF_API
    this.headers = API_CONFIG.HEADERS
  }

  // Get all funds - tries your API first, then fallback
  async getAllFunds() {
    try {
      console.log("🔍 Fetching funds from custom API...")

      // Try your custom API first
      if (this.customAPI && this.customAPI !== "https://your-api-endpoint.com/api") {
        try {
          const response = await axios.get(`${this.customAPI}/funds`, {
            headers: this.headers,
            timeout: 10000,
          })

          console.log("✅ Custom API response received")
          return this.formatFundsData(response.data)
        } catch (customError) {
          console.log("⚠️ Custom API failed, trying fallback...")
          console.log("Custom API Error:", customError.message)
        }
      }

      // Fallback to public API
      console.log("🔄 Using fallback public API...")
      const response = await axios.get(this.publicAPI, {
        timeout: 15000,
      })

      console.log("✅ Public API response received")
      return this.formatFundsData(response.data)
    } catch (error) {
      console.error("❌ All APIs failed:", error.message)
      throw new Error("Unable to fetch mutual funds data")
    }
  }

  // Get specific fund details
  async getFundDetails(schemeCode) {
    try {
      console.log(`🔍 Fetching details for fund: ${schemeCode}`)

      // Try your custom API first
      if (this.customAPI && this.customAPI !== "https://your-api-endpoint.com/api") {
        try {
          const response = await axios.get(`${this.customAPI}/fund/${schemeCode}`, {
            headers: this.headers,
            timeout: 10000,
          })

          console.log("✅ Custom API fund details received")
          return this.formatFundDetails(response.data)
        } catch (customError) {
          console.log("⚠️ Custom API failed for fund details, trying fallback...")
        }
      }

      // Fallback to public API
      const response = await axios.get(`${this.publicAPI}/${schemeCode}`, {
        timeout: 10000,
      })

      console.log("✅ Public API fund details received")
      return this.formatFundDetails(response.data)
    } catch (error) {
      console.error("❌ Failed to fetch fund details:", error.message)
      throw new Error("Unable to fetch fund details")
    }
  }

  // Format funds data to ensure consistent structure
  formatFundsData(data) {
    if (Array.isArray(data)) {
      return data.map((fund) => ({
        schemeCode: fund.schemeCode || fund.scheme_code || fund.code,
        schemeName: fund.schemeName || fund.scheme_name || fund.name,
        // Add any other fields your API provides
        category: fund.category || fund.scheme_category,
        fundHouse: fund.fundHouse || fund.fund_house,
        type: fund.type || fund.scheme_type,
      }))
    }

    // If your API returns data in a different structure, handle it here
    if (data.funds) {
      return this.formatFundsData(data.funds)
    }

    if (data.data) {
      return this.formatFundsData(data.data)
    }

    return data
  }

  // Format fund details to ensure consistent structure
  formatFundDetails(data) {
    // If it's already in the expected format, return as is
    if (data.meta && data.data) {
      return data
    }

    // Transform your API response to match expected format
    return {
      meta: {
        scheme_code: data.schemeCode || data.scheme_code || data.code,
        scheme_name: data.schemeName || data.scheme_name || data.name,
        fund_house: data.fundHouse || data.fund_house || data.amc,
        scheme_type: data.type || data.scheme_type || data.schemeType,
        scheme_category: data.category || data.scheme_category || data.schemeCategory,
      },
      data: data.navData ||
        data.data ||
        data.history || [
          {
            date: data.date || data.nav_date || new Date().toISOString().split("T")[0],
            nav: data.nav || data.navValue || data.netAssetValue || "N/A",
          },
        ],
    }
  }

  // Search funds by term
  searchFunds(funds, searchTerm) {
    if (!searchTerm || !funds) return []

    const term = searchTerm.toLowerCase()
    return funds.filter(
      (fund) =>
        (fund.schemeName && fund.schemeName.toLowerCase().includes(term)) ||
        (fund.schemeCode && fund.schemeCode.toString().includes(term)) ||
        (fund.fundHouse && fund.fundHouse.toLowerCase().includes(term)) ||
        (fund.category && fund.category.toLowerCase().includes(term)),
    )
  }
}

module.exports = new FundService()
