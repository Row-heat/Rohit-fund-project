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
    const baseURL = process.env.REACT_APP_API_URL || "https://rohit-fund-project-2.onrender.com"
    axios.defaults.baseURL = baseURL
    axios.defaults.timeout = 30000
    axios.defaults.withCredentials = true // ✅ VERY IMPORTANT

    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/auth/me", {
        withCredentials: true, // ✅ Ensure CORS works
      })
      setUser(response.data.user)
    } catch (error) {
      console.error("Fetch user error:", error)
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true } // ✅ Required for cookies/token
      )
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
      const response = await axios.post(
        "/api/auth/register",
        { email, password },
        { withCredentials: true } // ✅ Required for CORS success
      )
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

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
          Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
