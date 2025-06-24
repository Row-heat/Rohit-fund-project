const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/database")
const authRoutes = require("./routes/auth")
const fundRoutes = require("./routes/funds")

const app = express()

// Connect to MongoDB Atlas
connectDB()

// ULTRA-SIMPLE CORS - NO RESTRICTIONS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Basic CORS as backup
app.use(cors())

// Middleware
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/funds", fundRoutes)

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "🏦 Mutual Fund API is running!",
    database: "MongoDB Atlas Connected",
    timestamp: new Date().toISOString(),
  })
})

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})