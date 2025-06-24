const express = require("express")
const cors = require("cors")
require("dotenv").config()

// Import database connection
const connectDB = require("./config/database")

const authRoutes = require('./routes/auth');
const fundRoutes = require("./routes/funds")

const app = express()

// Connect to MongoDB Atlas
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes);
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
  console.log(`🌐 API URL: http://localhost:${PORT}`)
  console.log(`📊 Health Check: http://localhost:${PORT}/health`)
})
