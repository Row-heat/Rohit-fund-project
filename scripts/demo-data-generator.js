// Generate demo data using real mfapi.in data
const axios = require("axios")
const fs = require("fs")

async function generateDemoData() {
  console.log("📊 Generating demo data from mfapi.in...\n")

  try {
    // Fetch all funds
    const response = await axios.get("https://api.mfapi.in/mf")
    const allFunds = response.data

    // Select popular funds from different categories
    const popularFunds = [
      // SBI Funds
      ...allFunds.filter((fund) => fund.schemeName.includes("SBI")).slice(0, 5),
      // HDFC Funds
      ...allFunds.filter((fund) => fund.schemeName.includes("HDFC")).slice(0, 5),
      // ICICI Funds
      ...allFunds.filter((fund) => fund.schemeName.includes("ICICI")).slice(0, 5),
      // Axis Funds
      ...allFunds.filter((fund) => fund.schemeName.includes("Axis")).slice(0, 3),
      // Kotak Funds
      ...allFunds.filter((fund) => fund.schemeName.includes("Kotak")).slice(0, 3),
    ]

    // Create demo data structure
    const demoData = {
      totalFunds: allFunds.length,
      popularFunds: popularFunds.map((fund) => ({
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
      })),
      categories: {
        equity: allFunds.filter((fund) => fund.schemeName.toLowerCase().includes("equity")).length,
        debt: allFunds.filter((fund) => fund.schemeName.toLowerCase().includes("debt")).length,
        hybrid: allFunds.filter((fund) => fund.schemeName.toLowerCase().includes("hybrid")).length,
        elss: allFunds.filter((fund) => fund.schemeName.toLowerCase().includes("elss")).length,
      },
      fundHouses: {
        sbi: allFunds.filter((fund) => fund.schemeName.includes("SBI")).length,
        hdfc: allFunds.filter((fund) => fund.schemeName.includes("HDFC")).length,
        icici: allFunds.filter((fund) => fund.schemeName.includes("ICICI")).length,
        axis: allFunds.filter((fund) => fund.schemeName.includes("Axis")).length,
        kotak: allFunds.filter((fund) => fund.schemeName.includes("Kotak")).length,
      },
      lastUpdated: new Date().toISOString(),
    }

    // Save to file
    fs.writeFileSync("demo-data.json", JSON.stringify(demoData, null, 2))

    console.log("✅ Demo data generated successfully!")
    console.log(`📈 Total funds available: ${demoData.totalFunds}`)
    console.log(`🏆 Popular funds selected: ${demoData.popularFunds.length}`)
    console.log("\n📊 Fund Categories:")
    Object.entries(demoData.categories).forEach(([category, count]) => {
      console.log(`   ${category.toUpperCase()}: ${count} funds`)
    })
    console.log("\n🏢 Fund Houses:")
    Object.entries(demoData.fundHouses).forEach(([house, count]) => {
      console.log(`   ${house.toUpperCase()}: ${count} funds`)
    })
    console.log("\n💾 Data saved to: demo-data.json")
  } catch (error) {
    console.error("❌ Failed to generate demo data:", error.message)
  }
}

generateDemoData()
