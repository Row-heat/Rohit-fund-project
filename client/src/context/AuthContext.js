"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ FIXED: Using your correct API URL
    const baseURL = process.env.REACT_APP_API_URL || "https://rohit-fund-project-3.onrender.com"

    console.log("🔗 API Base URL:", baseURL)

    // ✅ Create axios instance with proper configuration
    axios.defaults.baseURL = baseURL
    axios.defaults.timeout = 30000
    axios.defaults.withCredentials = true

    // ✅ Add request interceptor for better error handling
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        console.log(`🚀 Making request to: ${config.baseURL}${config.url}`)
        console.log(`📋 Headers:`, config.headers)

        return config
      },
      (error) => {
        console.error("❌ Request interceptor error:", error)
        return Promise.reject(error)
      },
    )

    // ✅ Add response interceptor for token expiry handling
    axios.interceptors.response.use(
      (response) => {
        console.log(`✅ Response received from: ${response.config.url}`)
        return response
      },
      (error) => {
        console.error("❌ Response interceptor error:", error)

        if (error.response?.status === 401) {
          console.log("🔐 Token expired, logging out")
          localStorage.removeItem("token")
          setUser(null)
        }

        return Promise.reject(error)
      },
    )

    const token = localStorage.getItem("token")
    if (token) {
      console.log("🔑 Token found, fetching user")
      fetchUser()
    } else {
      console.log("🔓 No token found")
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [])

  const fetchUser = async () => {
    try {
      console.log("👤 Fetching user profile...")
      const response = await axios.get("/api/auth/me")
      console.log("✅ User fetched successfully:", response.data.user)
      setUser(response.data.user)
    } catch (error) {
      console.error("❌ Fetch user error:", error)
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log("🔐 Attempting login...")
      console.log("📧 Email:", email)
      console.log("🔗 Login URL:", `${axios.defaults.baseURL}/api/auth/login`)

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      })

      console.log("✅ Login successful:", response.data)

      const { token, user } = response.data
      localStorage.setItem("token", token)
      setUser(user)

      return { success: true }
    } catch (error) {
      console.error("❌ Login error:", error)

      // ✅ Better error handling
      let errorMessage = "Login failed"

      if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your connection and try again."
        console.error("🌐 Network error details:", {
          message: error.message,
          config: error.config,
          request: error.request,
        })
      } else if (error.name === "AxiosError" && error.message.includes("CORS")) {
        errorMessage = "CORS error. Please contact support."
        console.error("🚫 CORS error details:", error)
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      return {
        success: false,
        message: errorMessage,
      }
    }
  }

  const register = async (email, password) => {
    try {
      console.log("📝 Attempting registration...")
      console.log("📧 Email:", email)

      const response = await axios.post("/api/auth/register", {
        email,
        password,
      })

      console.log("✅ Registration successful:", response.data)

      const { token, user } = response.data
      localStorage.setItem("token", token)
      setUser(user)

      return { success: true }
    } catch (error) {
      console.error("❌ Register error:", error)

      let errorMessage = "Registration failed"

      if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check your connection and try again."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      return {
        success: false,
        message: errorMessage,
      }
    }
  }

  const logout = () => {
    console.log("🚪 Logging out...")
    localStorage.removeItem("token")
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>Loading...</div> : children}
    </AuthContext.Provider>
  )
}
