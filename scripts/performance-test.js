// Performance test for mfapi.in integration
const axios = require("axios")

async function performanceTest() {
  console.log("⚡ Performance Testing MF API Integration\n")

  const MFAPI_BASE_URL = "https://api.mfapi.in"
  const testResults = []

  try {
    // Test 1: API Response Time
    console.log("1. Testing API response time...")
    const startTime = Date.now()
    const response = await axios.get(`${MFAPI_BASE_URL}/mf`)
    const endTime = Date.now()
    const responseTime = endTime - startTime

    testResults.push({
      test: "API Response Time",
      result: `${responseTime}ms`,
      status: responseTime < 5000 ? "✅ Good" : "⚠️ Slow",
    })

    // Test 2: Data Size
    const dataSize = JSON.stringify(response.data).length
    const dataSizeMB = (dataSize / (1024 * 1024)).toFixed(2)

    testResults.push({
      test: "Data Size",
      result: `${dataSizeMB} MB`,
      status: dataSize < 10000000 ? "✅ Reasonable" : "⚠️ Large",
    })

    // Test 3: Search Performance
    console.log("2. Testing search performance...")
    const searchStartTime = Date.now()
    const searchResults = response.data.filter((fund) => fund.schemeName.toLowerCase().includes("sbi"))
    const searchEndTime = Date.now()
    const searchTime = searchEndTime - searchStartTime

    testResults.push({
      test: "Search Performance",
      result: `${searchTime}ms for ${searchResults.length} results`,
      status: searchTime < 100 ? "✅ Fast" : "⚠️ Slow",
    })

    // Test 3: Fund Details API Performance
    if (searchResults.length > 0) {
      console.log("3. Testing fund details API performance...")
      const detailStartTime = Date.now()
      await axios.get(`${MFAPI_BASE_URL}/mf/${searchResults[0].schemeCode}`)
      const detailEndTime = Date.now()
      const detailTime = detailEndTime - detailStartTime

      testResults.push({
        test: "Fund Details API",
        result: `${detailTime}ms`,
        status: detailTime < 2000 ? "✅ Fast" : "⚠️ Slow",
      })
    }

    // Display results
    console.log("\n📊 Performance Test Results:")
    console.log("=".repeat(50))
    testResults.forEach((result) => {
      console.log(`${result.test}: ${result.result} ${result.status}`)
    })

    console.log("\n🎯 Recommendations:")
    if (responseTime > 3000) {
      console.log("- Consider implementing caching for fund list")
    }
    if (dataSizeMB > 5) {
      console.log("- Consider pagination for large datasets")
    }
    if (searchTime > 50) {
      console.log("- Consider implementing server-side search")
    }

    console.log("\n✅ Performance test completed!")
  } catch (error) {
    console.error("❌ Performance test failed:", error.message)
  }
}

performanceTest()
