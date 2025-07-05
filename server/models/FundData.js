const mongoose = require("mongoose");

const FundDataSchema = new mongoose.Schema({
  category: String,
  percentage: Number,
  month: String,
  investment: Number,
  date: String,
  nav: Number,
});

module.exports = mongoose.model("FundData", FundDataSchema);