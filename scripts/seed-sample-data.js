// Sample data seeding script for testing
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mutualfunds")

// User schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  savedFunds: [
    {
      schemeCode: String,
      schemeName: String,
      savedAt: { type: Date, default: Date.now },
    },
  ],
})

const User = mongoose.model("User", userSchema)

async function seedData() {
  try {
    // Clear existing data
    await User.deleteMany({})

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 12)

    const sampleUsers = [
      {
        email: "demo@example.com",
        password: hashedPassword,
        savedFunds: [
          {
            schemeCode: "120503",
            schemeName: "Aditya Birla Sun Life Tax Relief 96 - Growth",
          },
          {
            schemeCode: "120504",
            schemeName: "Aditya Birla Sun Life Frontline Equity Fund - Growth",
          },
        ],
      },
      {
        email: "test@example.com",
        password: hashedPassword,
        savedFunds: [],
      },
    ]

    await User.insertMany(sampleUsers)
    console.log("Sample data seeded successfully!")
    console.log("Demo credentials:")
    console.log("Email: demo@example.com")
    console.log("Password: password123")
  } catch (error) {
    console.error("Error seeding data:", error)
  } finally {
    mongoose.connection.close()
  }
}

seedData()
