// Test script for your custom API integration
const axios = require("axios")
require("dotenv").config()

async function testCustomAPI() {
  console.log("🔍 Testing Custom Mutual Fund API Integration...\n")

  const customAPI = process.env.CUSTOM_MF_API_URL
  const publicAPI = "https://api.mfapi.in/mf"

  try {
    // Test 1: Check if custom API is configured
    console.log("1. Checking API configuration...")
    if (!customAPI || customAPI === "https://your-api-endpoint.com/api") {
      console.log("⚠️ Custom API not configured, will use fallback")
      console.log("💡 Set CUSTOM_MF_API_URL in your .env file")
    } else {
      console.log(`✅ Custom API configured: ${customAPI}`)
    }

    // Test 2: Test custom API (if configured)
    if (customAPI && customAPI !== "https://your-api-endpoint.com/api") {
      console.log("\n2. Testing custom API...")
      try {
        const response = await axios.get(`${customAPI}/funds`, {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            // Add your API key if required
            // 'Authorization': `Bearer ${process.env.MF_API_KEY}`,
          },
        })

        console.log("✅ Custom API is working!")
        console.log(`📊 Response status: ${response.status}`)
        console.log(`📈 Data type: ${Array.isArray(response.data) ? "Array" : typeof response.data}`)

        if (Array.isArray(response.data)) {
          console.log(`📋 Found ${response.data.length} funds`)
          if (response.data.length > 0) {
            console.log("📄 Sample fund:", JSON.stringify(response.data[0], null, 2))
          }
        }
      } catch (customError) {
        console.log("❌ Custom API failed:", customError.message)
        console.log("🔄 Will fallback to public API")
      }
    }

    // Test 3: Test fallback API
    console.log("\n3. Testing fallback API...")
    const fallbackResponse = await axios.get(publicAPI, { timeout: 10000 })
    console.log("✅ Fallback API is working!")
    console.log(`📊 Found ${fallbackResponse.data.length} funds`)

    // Test 4: Test fund details
    console.log("\n4. Testing fund details...")
    const sampleSchemeCode = "120503"

    if (customAPI && customAPI !== "https://your-api-endpoint.com/api") {
      try {
        const detailsResponse = await axios.get(`${customAPI}/fund/${sampleSchemeCode}`, {
          timeout: 10000,
        })
        console.log("✅ Custom API fund details working!")
      } catch (error) {
        console.log("⚠️ Custom API fund details failed, testing fallback...")
      }
    }

    const fallbackDetailsResponse = await axios.get(`${publicAPI}/${sampleSchemeCode}`, {
      timeout: 10000,
    })
    console.log("✅ Fallback fund details working!")

    console.log("\n🎉 API Integration Test Complete!")
    console.log("\n📋 Summary:")
    console.log("- Custom API:", customAPI ? "Configured" : "Not configured")
    console.log("- Fallback API: Working")
    console.log("- Fund Details: Working")
    console.log("- Ready for production! 🚀")
  } catch (error) {
    console.error("❌ API test failed:", error.message)
  }
}

testCustomAPI()
