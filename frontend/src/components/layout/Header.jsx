import React, { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/invoice-logo.png";

const Header = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // const currencyOptions = [
  //   { label: "₹ INR", value: "INR" },
  //   { label: "$ USD", value: "USD" },
  //   { label: "€ EUR", value: "EUR" },
  //   { label: "£ GBP", value: "GBP" },
  //   { label: "¥ JPY", value: "JPY" },
  // ];

  // useEffect(() => {
  //   // redirect if not authenticated
  //   if (!isAuthenticated) navigate("/auth");
  // }, [isAuthenticated, navigate]);

  // useEffect(() => {
  //   document.documentElement.setAttribute("data-currency", currency);
  // }, [currency]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="InvoiceG logo"
              className="w-10 h-10 object-contain"
            /> <h1 className="text-xl font-bold text-gray-900">InvoiceKart</h1>
            {isAuthenticated && (
              <span className="text-sm text-gray-500">
                ({currentUser?.businessName})
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* 💱 Currency Selector */}
            {/* <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="border text-sm rounded px-2 py-1"
            >
              {currencyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select> */}

            {/* 👤 Authenticated User Dropdown OR Login Button */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-black focus:outline-none cursor-pointer"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        onClick={() => alert("My Profile clicked")}
                      >
                        My Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                        onClick={logout}
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition cursor-pointer"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
