const express = require("express")
const User = require("../models/User")
const auth = require("../middleware/auth")
const fundService = require("../services/fundService")
const FundData = require("../models/FundData")

const router = express.Router()

// Get all funds with search functionality
router.get("/search", async (req, res) => {
  try {
    const { q: searchTerm } = req.query

    console.log(`🔍 Search request: "${searchTerm}"`)

    // Get all funds from your API
    const allFunds = await fundService.getAllFunds()

    // If search term provided, filter results
    let results = allFunds
    if (searchTerm) {
      results = fundService.searchFunds(allFunds, searchTerm)
      console.log(`📊 Found ${results.length} funds matching "${searchTerm}"`)
    }

    res.json({
      success: true,
      count: results.length,
      data: results.slice(0, 50), // Limit to 50 results for performance
      searchTerm: searchTerm || null,
    })
  } catch (error) {
    console.error("❌ Search error:", error.message)
    res.status(500).json({
      success: false,
      message: "Failed to search funds",
      error: error.message,
    })
  }
})

// Get specific fund details
router.get("/details/:schemeCode", async (req, res) => {
  try {
    const { schemeCode } = req.params

    console.log(`🔍 Fund details request: ${schemeCode}`)

    const fundDetails = await fundService.getFundDetails(schemeCode)

    res.json({
      success: true,
      data: fundDetails,
    })
  } catch (error) {
    console.error("❌ Fund details error:", error.message)
    res.status(500).json({
      success: false,
      message: "Failed to fetch fund details",
      error: error.message,
    })
  }
})

// Save a mutual fund (UNCHANGED - keeping your existing functionality)
router.post("/save", auth, async (req, res) => {
  try {
    const { schemeCode, schemeName } = req.body
    const user = await User.findById(req.user._id)

    // Check if fund is already saved
    const existingFund = user.savedFunds.find((fund) => fund.schemeCode === schemeCode)
    if (existingFund) {
      return res.status(400).json({ message: "Fund already saved" })
    }

    // Add fund to saved funds
    user.savedFunds.push({ schemeCode, schemeName })
    await user.save()

    res.json({ message: "Fund saved successfully", savedFunds: user.savedFunds })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all saved funds (UNCHANGED)
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ savedFunds: user.savedFunds })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Remove a saved fund (UNCHANGED)
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    user.savedFunds = user.savedFunds.filter((fund) => fund._id.toString() !== req.params.id)
    await user.save()

    res.json({ message: "Fund removed successfully", savedFunds: user.savedFunds })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// GET /api/fund/category
router.get("/category", async (req, res) => {
  try {
    const data = await FundData.find(
      { category: { $exists: true }, percentage: { $exists: true } },
      { category: 1, percentage: 1, _id: 0 }
    )
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category data" })
  }
})

// GET /api/fund/monthly
router.get("/monthly", async (req, res) => {
  try {
    const data = await FundData.find(
      { month: { $exists: true }, investment: { $exists: true } },
      { month: 1, investment: 1, _id: 0 }
    )
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch monthly data" })
  }
})

// GET /api/fund/nav
router.get("/nav", async (req, res) => {
  try {
    const data = await FundData.find(
      { date: { $exists: true }, nav: { $exists: true } },
      { date: 1, nav: 1, _id: 0 }
    )
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch NAV data" })
  }
})

module.exports = router
