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
      const BACKEND_URL =
        import.meta.env.BACKEND_URL || "https://invoicegen.dotdevz.com";
      const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
        credentials: "include", // ✅ send cookies
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const BACKEND_URL =
        import.meta.env.BACKEND_URL || "https://invoicegen.dotdevz.com";
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
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
      const BACKEND_URL =
        import.meta.env.BACKEND_URL || "https://invoicegen.dotdevz.com";
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
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
      const BACKEND_URL =
        import.meta.env.BACKEND_URL || "https://invoicegen.dotdevz.com";
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
