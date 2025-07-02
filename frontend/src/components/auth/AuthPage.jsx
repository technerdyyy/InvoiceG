import React, { useState, useEffect } from "react";
import LoginForm from "./loginForm";
import SignupForm from "./SignupForm";
import logo from "../../assets/invoice-logo.png";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // <-- Make sure you import this

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect on successful login/signup
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <img
              src={logo}
              alt="InvoiceG logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-3xl font-bold text-gray-800">InvoiceKart</h1>
          </div>
          <p className="text-gray-600">For Restaurant & Food Business</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              showLogin ? "bg-white text-gray-800 shadow-sm" : "text-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !showLogin ? "bg-white text-gray-800 shadow-sm" : "text-gray-600"
            }`}
          >
            Sign Up
          </button>
        </div>

        {showLogin ? (
          <LoginForm onToggle={() => setShowLogin(false)} />
        ) : (
          <SignupForm onToggle={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
