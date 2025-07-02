import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import initialInvoiceState from "../data";
import Button from "./ui/Button";
import InvoiceHeader from "./invoice/InvoiceHeader";
import ClientDetails from "./invoice/ClientDetails";
import ItemList from "./invoice/ItemList";
import InvoiceActions from "./invoice/InvoiceActions";
import InvoicePreview from "./invoice/InvoicePreview";
import Header from "./layout/Header";
import BusinessDetails from "./invoice/BusinessDetails";
import Popup from "./ui/Popup"; // 👈 Make sure this file exists and is styled properly
import { Eye, EyeOff, Save, Download } from "lucide-react";

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const [invoice, setInvoice] = useState(initialInvoiceState);
  const [showBusinessHeader, setShowBusinessHeader] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditingBusinessInfo, setIsEditingBusinessInfo] = useState(false);

  // 👇 Popup & First Item State
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [itemAddedOnce, setItemAddedOnce] = useState(false);

  // ✅ 3. Update items with userId if missing

  useEffect(() => {
    if (currentUser) {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.userId ? item : { ...item, userId: currentUser._id }
        ),
      }));
    }
  }, [currentUser]);

  // Toggle edit mode for BusinessDetails
  const handleToggleEditBusinessInfo = () => {
    setIsEditingBusinessInfo((prev) => !prev);
  };

  const handleInvoiceUpdate = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Only show guest popup when first item is added
 const addItem = () => {
  const newItem = {
    id: Date.now(),
    description: "",
    quantity: 1,
    unitPrice: 0,
    amount: 0,
    userId: currentUser ? currentUser._id : "guest", // ✅ FIXED: safe check
  };

  setInvoice((prev) => ({
    ...prev,
    items: [...prev.items, newItem],
  }));

  if (!itemAddedOnce && !isAuthenticated) {
    setItemAddedOnce(true);
    setShowGuestPopup(true);
  }
};


  const removeItem = (id) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  // ✅ Show popup if guest tries to save
  const handleSave = () => {
    if (!isAuthenticated) {
      setShowGuestPopup(true);
      return;
    }

    // 👇 Add your save logic here for authenticated users
    console.log("Saving invoice...", invoice);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 hidden sm:block">
            Create Invoice
          </h2>

          <div className="flex flex-wrap justify-center sm:justify-end items-center space-x-2 mt-4 sm:mt-0">
            {/* All buttons go here */}
            <div className="flex space-x-2">
              <Button variant="primary" onClick={handleSave}>
                <Save size={16} />
              </Button>
              <Button variant="success">
                <Download size={16} />
              </Button>
            </div>

            <Button
              variant="secondary"
              onClick={() => setShowBusinessHeader(!showBusinessHeader)}
            >
              {showBusinessHeader ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="ml-2 hidden md:inline">
                {showBusinessHeader ? "Hide" : "Show"} Business Header
              </span>
            </Button>

            <Button
              variant="primary"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden"
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="ml-2 hidden md:inline">
                {showPreview ? "Hide Preview" : "Preview"}
              </span>
            </Button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Form Section */}
          <div className={`space-y-6 ${showPreview ? "hidden lg:block" : ""}`}>
            <InvoiceHeader invoice={invoice} onUpdate={handleInvoiceUpdate} />

            {/* Business Info Toggle */}
            {showBusinessHeader && (
              <BusinessDetails
                businessInfo={invoice.businessInfo}
                isEditing={isEditingBusinessInfo}
                handleChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    businessInfo: {
                      ...prev.businessInfo,
                      [e.target.name]: e.target.value,
                    },
                  }))
                }
                onToggleEdit={handleToggleEditBusinessInfo}
              />
            )}

            <ClientDetails invoice={invoice} onUpdate={handleInvoiceUpdate} />

            <ItemList
              invoice={invoice}
              onUpdate={handleInvoiceUpdate}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />

            <InvoiceActions
              invoice={invoice}
              onUpdate={handleInvoiceUpdate}
              onSave={handleSave}
            />
          </div>

          {/* Preview Section */}
          <div
            className={`${
              !showPreview ? "hidden lg:block" : ""
            } lg:sticky lg:top-8`}
          >
            <div className="lg:h-screen lg:overflow-hidden">
              <InvoicePreview
                invoice={invoice}
                showBusinessHeader={showBusinessHeader}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Guest Restriction Popup */}
      {showGuestPopup && <Popup onClose={() => setShowGuestPopup(false)} />}
    </div>
  );
};

export default Dashboard;
