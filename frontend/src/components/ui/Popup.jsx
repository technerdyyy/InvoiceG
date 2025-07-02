import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Popup = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      {/* Dimming Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={onClose} // close when clicking outside
      />

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Guest Access Restricted
        </h2>
        <p className="text-gray-700 mb-6">
          You cannot save your invoice because you are a guest user.{" "}
          <strong>Login</strong> to save invoices for future use!
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
