const mongoose = require("mongoose");
const FundData = require("../models/FundData");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname");
  await FundData.deleteMany({});

  await FundData.insertMany([
    // Pie Chart
    { category: "Equity", percentage: 40 },
    { category: "Debt", percentage: 35 },
    { category: "Gold", percentage: 25 },
    // Bar Chart
    { month: "Jan", investment: 2000 },
    { month: "Feb", investment: 2500 },
    { month: "Mar", investment: 1800 },
    // Line Chart
    { date: "Week 1", nav: 10.5 },
    { date: "Week 2", nav: 11.2 },
    { date: "Week 3", nav: 10.9 },
    { date: "Week 4", nav: 11.5 },
  ]);

  console.log("Seeded FundData!");
  process.exit();
};

seed();