import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and verify with backend
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);

          // Refresh profile in background
          const res = await api.get("/auth/me");
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch (error) {
          console.error("Token verification failed, clearing auth:", error.message);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.success && res.data) {
      const { token: userToken, ...userData } = res.data;
      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || "Login failed");
  };

  const signup = async (username, email, password) => {
    const res = await api.post("/auth/signup", { username, email, password });
    if (res.success && res.data) {
      const { token: userToken, ...userData } = res.data;
      localStorage.setItem("token", userToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(userToken);
      setUser(userData);
      return userData;
    }
    throw new Error(res.message || "Signup failed");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.put("/users/profile", profileData);
    if (res.success && res.data) {
      const updated = { ...user, ...res.data };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    }
    throw new Error(res.message || "Failed to update profile");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

