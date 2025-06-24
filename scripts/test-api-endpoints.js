// Script to test all API endpoints
const axios = require("axios")

const BASE_URL = "http://localhost:5000"
let authToken = ""

async function testEndpoints() {
  console.log("🚀 Testing Mutual Fund API Endpoints\n")

  try {
    // Test 1: Register a new user
    console.log("1. Testing user registration...")
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: "testuser@example.com",
      password: "password123",
    })
    console.log("✅ Registration successful")
    authToken = registerResponse.data.token

    // Test 2: Login
    console.log("\n2. Testing user login...")
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "testuser@example.com",
      password: "password123",
    })
    console.log("✅ Login successful")

    // Test 3: Get current user
    console.log("\n3. Testing get current user...")
    const userResponse = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    console.log("✅ Get user successful")

    // Test 4: Save a fund
    console.log("\n4. Testing save fund...")
    const saveFundResponse = await axios.post(
      `${BASE_URL}/api/funds/save`,
      {
        schemeCode: "120503",
        schemeName: "Test Mutual Fund",
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    )
    console.log("✅ Save fund successful")

    // Test 5: Get saved funds
    console.log("\n5. Testing get saved funds...")
    const savedFundsResponse = await axios.get(`${BASE_URL}/api/funds`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
    console.log("✅ Get saved funds successful")
    console.log(`Found ${savedFundsResponse.data.savedFunds.length} saved funds`)

    // Test 6: Remove a fund
    if (savedFundsResponse.data.savedFunds.length > 0) {
      console.log("\n6. Testing remove fund...")
      const fundId = savedFundsResponse.data.savedFunds[0]._id
      await axios.delete(`${BASE_URL}/api/funds/${fundId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      console.log("✅ Remove fund successful")
    }

    console.log("\n🎉 All API endpoints are working correctly!")
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data?.message || error.message)
  }
}

// Run the tests
testEndpoints()
