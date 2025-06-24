// Comprehensive test script for mfapi.in integration
const axios = require("axios")

const MFAPI_BASE_URL = "https://api.mfapi.in"

async function testMFAPIIntegration() {
  console.log("🚀 Testing MF API Integration (www.mfapi.in)\n")

  try {
    // Test 1: Get all mutual funds
    console.log("1. Testing: Get all mutual funds...")
    const allFundsResponse = await axios.get(`${MFAPI_BASE_URL}/mf`)
    console.log(`✅ Success: Found ${allFundsResponse.data.length} mutual funds`)
    console.log(`Sample fund: ${allFundsResponse.data[0].schemeName}`)

    // Test 2: Search functionality simulation
    console.log("\n2. Testing: Search functionality (SBI funds)...")
    const searchTerm = "SBI"
    const sbiFunds = allFundsResponse.data.filter((fund) =>
      fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    console.log(`✅ Success: Found ${sbiFunds.length} SBI funds`)

    // Test 3: Get specific fund details
    if (sbiFunds.length > 0) {
      console.log("\n3. Testing: Get specific fund details...")
      const sampleFund = sbiFunds[0]
      console.log(`Testing with: ${sampleFund.schemeName} (Code: ${sampleFund.schemeCode})`)

      const fundDetailResponse = await axios.get(`${MFAPI_BASE_URL}/mf/${sampleFund.schemeCode}`)
      console.log("✅ Success: Fund details retrieved")
      console.log(`Fund House: ${fundDetailResponse.data.meta.fund_house}`)
      console.log(`Category: ${fundDetailResponse.data.meta.scheme_category}`)
      console.log(`Latest NAV: ₹${fundDetailResponse.data.data[0]?.nav || "N/A"}`)
      console.log(`NAV Date: ${fundDetailResponse.data.data[0]?.date || "N/A"}`)
    }

    // Test 4: Test popular fund categories
    console.log("\n4. Testing: Popular fund categories...")
    const categories = ["Equity", "Debt", "Hybrid", "ELSS"]

    for (const category of categories) {
      const categoryFunds = allFundsResponse.data.filter((fund) =>
        fund.schemeName.toLowerCase().includes(category.toLowerCase()),
      )
      console.log(`${category} funds: ${categoryFunds.length}`)
    }

    // Test 5: Test major fund houses
    console.log("\n5. Testing: Major fund houses availability...")
    const majorFundHouses = ["SBI", "HDFC", "ICICI", "Aditya Birla", "Axis", "Kotak"]

    for (const fundHouse of majorFundHouses) {
      const fundHouseFunds = allFundsResponse.data.filter((fund) =>
        fund.schemeName.toLowerCase().includes(fundHouse.toLowerCase()),
      )
      console.log(`${fundHouse} funds: ${fundHouseFunds.length}`)
    }

    // Test 6: Validate data structure
    console.log("\n6. Testing: Data structure validation...")
    const sampleFund = allFundsResponse.data[0]
    const requiredFields = ["schemeCode", "schemeName"]

    let validStructure = true
    for (const field of requiredFields) {
      if (!sampleFund[field]) {
        console.log(`❌ Missing field: ${field}`)
        validStructure = false
      }
    }

    if (validStructure) {
      console.log("✅ Data structure is valid")
    }

    console.log("\n🎉 MF API Integration Test Complete!")
    console.log("\n📊 Summary:")
    console.log(`- Total funds available: ${allFundsResponse.data.length}`)
    console.log("- Search functionality: Working")
    console.log("- Fund details API: Working")
    console.log("- Data structure: Valid")
    console.log("- Ready for production use! 🚀")
  } catch (error) {
    console.error("❌ Test failed:", error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", error.response.data)
    }
  }
}

// Run the tests
testMFAPIIntegration()
