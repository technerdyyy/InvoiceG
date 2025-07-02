// context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ⬅️ New

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false); // ⬅️ No token, stop loading
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      setLoading(false); // ✅ Mark done
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Something went wrong" };
    }
  };

  const signup = async (formData) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: "Something went wrong" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setToken(null);
    setLoading(false); // ✅ ensure loading ends
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!currentUser,
        currentUser,
        login,
        signup,
        logout,
        token,
        loading, // ⬅️ pass loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
