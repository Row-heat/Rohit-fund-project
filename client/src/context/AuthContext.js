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
    // FIXED: Set base URL for production
    const baseURL = process.env.REACT_APP_API_URL || "https://rohit-fund-project.onrender.com"
    axios.defaults.baseURL = baseURL
    axios.defaults.timeout = 30000
    
    console.log("🌐 API Base URL:", baseURL)

    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me")
      setUser(response.data.user)
    } catch (error) {
      console.error("Fetch user error:", error)
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/register", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      return { success: true }
    } catch (error) {
      console.error("Register error:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}