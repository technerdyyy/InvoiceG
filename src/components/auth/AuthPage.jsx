import React, { useState } from "react";
import LoginForm from "./loginForm";
import SignupForm from "./SignupForm";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <img src="/assets/invoice-logo.png" alt="" />
            InvoiceG
          </h1>
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
