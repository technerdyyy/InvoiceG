import { createContext, useState } from "react";
import mockUsers from "../data/mockUser";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const login = (email, password) => {
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
  };

  const signup = (userData) => {
    if (userData.password !== userData.confirmPassword) {
      return { success: false, error: "Passwords do not match" };
    }
    const newUser = {
      id: mockUsers.length + 1,
      email: userData.email,
      password: userData.password,
      businessName: userData.businessName,
    };
    mockUsers.push(newUser);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
