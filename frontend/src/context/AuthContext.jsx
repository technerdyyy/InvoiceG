// context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading

  useEffect(() => {
    fetchUser(); // fetch on mount
  }, []);

  const fetchUser = async () => {
    try {
      const VITE_BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${VITE_BACKEND_URL}/api/auth/me`, {
        credentials: "include", // ✅ send cookies
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!res.ok) {
        throw new Error("Authentication failed");
      }

      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("isAuthenticated", "true");
      } else {
        throw new Error("No user data received");
      }
    } catch (err) {
      console.error("Auth error:", err);
      localStorage.removeItem("isAuthenticated");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const VITE_BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ send and save cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Something went wrong" };
    }
  };

  const signup = async (formData) => {
    try {
      const VITE_BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${VITE_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ save cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Something went wrong" };
    }
  };

  const logout = async () => {
    try {
      const VITE_BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      await fetch(`${VITE_BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // ✅ clear cookies
      });
    } catch (e) {
      console.error("Logout failed");
    } finally {
      setCurrentUser(null);
      setLoading(false);
    }
  };

  const updateProfile = async (updateData) => {
    try {
      const VITE_BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${VITE_BACKEND_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update the current user state with new data
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      throw new Error(err.message || "Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        login,
        signup,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
