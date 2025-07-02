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
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-red-600 mb-3">
          Guest Access Restricted
        </h2>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          You are currently using{" "}
          <span className="font-semibold text-gray-900">guest mode</span>. To
          unlock full features, please{" "}
          <span className="font-semibold text-blue-600">log in</span>:
        </p>

        <ul className="list-disc list-inside text-gray-800 text-sm space-y-1 mb-6">
          <li>
            <span className="font-medium">Save</span> your invoices for future
            use
          </li>
          <li>
            <span className="font-medium">Auto-suggest</span> frequently used
            items
          </li>
          <li>
            <span className="font-medium">Access</span> your saved data across
            devices
          </li>
        </ul>

        <div className="flex justify-end">
          <button
            onClick={() => navigate("/auth")}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
