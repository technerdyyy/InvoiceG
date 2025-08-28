import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "./layout/Header";
import Button from "./ui/Button";
import {
  User,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Mail,
  Building,
  FileEdit,
} from "lucide-react";
import axios from "axios";

const Profile = () => {
  const { currentUser, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!isAuthenticated) return;

      try {
        setInvoiceLoading(true);
        const res = await axios.get("/api/invoices", {
          withCredentials: true,
        });

        setInvoices(res.data);
      } catch (err) {
        console.error("❌ Error fetching invoices:", err);
      } finally {
        setInvoiceLoading(false);
      }
    };

    fetchInvoices();
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState({
    businessName: false,
    email: false,
    password: false,
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        businessName: currentUser.businessName || "",
        email: currentUser.email || "",
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    if (isEditing[field]) {
      if (field === "businessName") {
        setFormData((prev) => ({
          ...prev,
          businessName: currentUser.businessName || "",
        }));
      } else if (field === "email") {
        setFormData((prev) => ({ ...prev, email: currentUser.email || "" }));
      } else if (field === "password") {
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveField = async (field) => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      let updateData = {};

      if (field === "businessName") {
        updateData = { businessName: formData.businessName };
      } else if (field === "email") {
        updateData = { email: formData.email };
      } else if (field === "password") {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error("New passwords don't match");
        }
        if (formData.newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters");
        }
        updateData = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        };
      }

      await updateProfile(updateData);

      setMessage({
        type: "success",
        text: `${field
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())} updated successfully!`,
      });
      setIsEditing((prev) => ({ ...prev, [field]: false }));

      if (field === "password") {
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fixed Handle Edit Invoice - Navigate to Dashboard with invoice data
  const handleEditInvoice = (invoice) => {
  try {
    if (!invoice._id) throw new Error("Missing invoice ID");

    // ✅ Navigate with ID only
    navigate(`/?edit=${invoice._id}`);
  } catch (error) {
    console.error("❌ Error preparing invoice for editing:", error);
    setMessage({
      type: "error",
      text: "Failed to load invoice for editing",
    });
  }
};


  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Profile Settings
              </h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            {/* Business Name Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Business Name
                  </h3>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => toggleEdit("businessName")}
                  disabled={isLoading}
                >
                  {isEditing.businessName ? (
                    <X size={16} />
                  ) : (
                    <Edit size={16} />
                  )}
                  <span className="ml-2">
                    {isEditing.businessName ? "Cancel" : "Edit"}
                  </span>
                </Button>
              </div>
              {isEditing.businessName ? (
                <div className="flex space-x-3">
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter business name"
                  />
                  <Button
                    variant="primary"
                    onClick={() => saveField("businessName")}
                    disabled={isLoading || !formData.businessName.trim()}
                  >
                    <Save size={16} />
                    <span className="ml-2">Save</span>
                  </Button>
                </div>
              ) : (
                <p className="text-gray-700">
                  {currentUser.businessName || "No business name set"}
                </p>
              )}
            </div>

            {/* Email Section */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Email Address
                  </h3>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => toggleEdit("email")}
                  disabled={isLoading}
                >
                  {isEditing.email ? <X size={16} /> : <Edit size={16} />}
                  <span className="ml-2">
                    {isEditing.email ? "Cancel" : "Edit"}
                  </span>
                </Button>
              </div>
              {isEditing.email ? (
                <div className="flex space-x-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                  <Button
                    variant="primary"
                    onClick={() => saveField("email")}
                    disabled={isLoading || !formData.email.trim()}
                  >
                    <Save size={16} />
                    <span className="ml-2">Save</span>
                  </Button>
                </div>
              ) : (
                <p className="text-gray-700">{currentUser.email}</p>
              )}
            </div>

            {/* Password Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Password</h3>
                <Button
                  variant="danger"
                  onClick={() => toggleEdit("password")}
                  disabled={isLoading}
                >
                  {isEditing.password ? <X size={16} /> : <Edit size={16} />}
                  <span className="ml-2">
                    {isEditing.password ? "Cancel" : "Change Password"}
                  </span>
                </Button>
              </div>

              {isEditing.password && (
                <div className="space-y-4">
                  {["currentPassword", "newPassword", "confirmPassword"].map(
                    (field, i) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </label>
                        <div className="relative">
                          <input
                            type={
                              showPasswords[field.split("Password")[0]]
                                ? "text"
                                : "password"
                            }
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              togglePasswordVisibility(
                                field.split("Password")[0]
                              )
                            }
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPasswords[field.split("Password")[0]] ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    )
                  )}
                  <Button
                    variant="primary"
                    onClick={() => saveField("password")}
                    disabled={
                      isLoading ||
                      !formData.currentPassword ||
                      !formData.newPassword ||
                      !formData.confirmPassword
                    }
                    className="w-full sm:w-auto"
                  >
                    <span className="ml-2">Update Password</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice List with Edit Buttons */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Saved Invoices
          </h3>

          {invoiceLoading ? (
            <p className="text-gray-500">Loading invoices...</p>
          ) : invoices.length === 0 ? (
            <p className="text-gray-500">No invoices found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Invoice Number
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Invoice Date
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Customer Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Contact Number
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {invoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {invoice.invoiceNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {invoice.date
                          ? new Date(invoice.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {invoice.clientDetails || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {invoice.customerNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ₹{invoice.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="secondary"
                          onClick={() => handleEditInvoice(invoice)}
                          className="flex items-center space-x-1"
                        >
                          <FileEdit size={14} />
                          <span>Edit</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
