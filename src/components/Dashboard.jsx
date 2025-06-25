import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import initialInvoiceState from "../data";
import Button from "./ui/Button";
import InvoiceHeader from "./invoice/InvoiceHeader";
import ClientDetails from "./invoice/ClientDetails";
import ItemList from "./invoice/ItemList";
import InvoiceActions from "./invoice/InvoiceActions";
import InvoicePreview from "./invoice/InvoicePreview";
import Header from "./layout/Header";
import { Eye, EyeOff } from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [invoice, setInvoice] = useState(initialInvoiceState);
  const [showBusinessHeader, setShowBusinessHeader] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const handleInvoiceUpdate = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (id) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Invoice</h2>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => setShowBusinessHeader(!showBusinessHeader)}
              className="cursor-pointer"
            >
              {showBusinessHeader ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="ml-2">
                {showBusinessHeader ? "Hide" : "Show"} Business Header
              </span>
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden cursor-pointer"
            >
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Form Section */}
          <div className={`space-y-6 ${showPreview ? "hidden lg:block" : ""}`}>
            <InvoiceHeader invoice={invoice} onUpdate={handleInvoiceUpdate} />
            <ClientDetails invoice={invoice} onUpdate={handleInvoiceUpdate} />
            <ItemList
              invoice={invoice}
              onUpdate={handleInvoiceUpdate}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
            <InvoiceActions invoice={invoice} onUpdate={handleInvoiceUpdate} />
          </div>

          {/* Preview Section */}
          <div
            className={`${
              !showPreview ? "hidden lg:block" : ""
            } lg:sticky lg:top-8`}
          >
            <div className="lg:h-screen lg:overflow-hidden">
              <h3 className="text-lg font-semibold mb-4 lg:hidden">
                Invoice Preview
              </h3>
              <InvoicePreview
                invoice={invoice}
                showBusinessHeader={showBusinessHeader}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
