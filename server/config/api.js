// API configuration for your custom mutual fund API
const API_CONFIG = {
  // Your custom API endpoint
  CUSTOM_MF_API: process.env.CUSTOM_MF_API_URL || "https://your-api-endpoint.com/api",

  // Fallback to public mfapi.in
  PUBLIC_MF_API: "https://api.mfapi.in/mf",

  // API headers if needed
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Add your API key if required
    // 'Authorization': `Bearer ${process.env.MF_API_KEY}`,
    // 'X-API-Key': process.env.MF_API_KEY,
  },
}

module.exports = API_CONFIG
