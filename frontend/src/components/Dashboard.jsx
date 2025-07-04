import React, { useState, useEffect, useRef } from "react";
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
import InvoiceSummary from "./invoice/InvoiceSummary";
import Popup from "./ui/Popup";
import { Eye, EyeOff, Save, Download } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // ✅ Load initial state from localStorage if exists
  const [invoice, setInvoice] = useState(() => {
    const saved = localStorage.getItem("invoiceData");
    return saved ? JSON.parse(saved) : initialInvoiceState;
  });

  const [showBusinessHeader, setShowBusinessHeader] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditingBusinessInfo, setIsEditingBusinessInfo] = useState(false);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [itemAddedOnce, setItemAddedOnce] = useState(false);

  const [summary, setSummary] = useState({
    discount: 0,
    cgst: 0,
    sgst: 0,
  });

  const previewRef = useRef();

  // ✅ Update localStorage whenever invoice changes
  useEffect(() => {
    localStorage.setItem("invoiceData", JSON.stringify(invoice));
  }, [invoice]);

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

  const handleToggleEditBusinessInfo = () => {
    setIsEditingBusinessInfo((prev) => !prev);
  };

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
      userId: currentUser ? currentUser._id : "guest",
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

  const handleSave = async () => {
  if (!isAuthenticated || !currentUser) {
    setShowGuestPopup(true);
    return;
  }

  try {
    const invoiceData = {
      customerName: invoice.clientDetails || "Unnamed Client",
      customerEmail: invoice.contactInfo || "noemail@example.com",
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      totalAmount: invoice.items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      ),
    };

    const response = await axios.post(
      "http://localhost:5000/api/invoices",
      invoiceData,
      {
        withCredentials: true, // ✅ Send cookies automatically
      }
    );

    console.log("✅ Invoice saved:", response.data);
    alert("Invoice saved successfully!");

    // ✅ Clear saved data from localStorage and reset state
    localStorage.removeItem("invoiceData");
    setInvoice(initialInvoiceState);
  } catch (error) {
    console.error("❌ Error saving invoice:", error);
    alert("Failed to save invoice. See console.");
  }
};


  const handleDownloadPDF = async () => {
    try {
      console.log("⏳ Downloading invoice as PDF...");
      const html2pdf = (await import("html2pdf.js")).default;
      const element = previewRef.current;

      if (!element) {
        console.error("❌ PDF element not found.");
        return;
      }

      const options = {
        margin: 0.5,
        filename: `Invoice_${invoice.invoiceNumber || "Preview"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(options).from(element).save();
      console.log("✅ PDF download complete!");
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      alert("Failed to download PDF. Check the console for details.");
    }
  };

  const handleSummaryUpdate = (field, value) => {
    setSummary((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-row justify-between items-center mb-6 gap-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-800 hidden sm:block">
              Create Invoice
            </h2>
            <Button
              variant="secondary"
              onClick={() => setShowBusinessHeader(!showBusinessHeader)}
              className="flex items-center justify-center"
            >
              {showBusinessHeader ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="ml-2 hidden md:inline">
                {showBusinessHeader ? "Hide" : "Show"} Business Header
              </span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save size={16} />
            </Button>

            <Button variant="success" onClick={handleDownloadPDF}>
              <Download size={16} />
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
          <div
            className={`space-y-5 space-x-5 ${
              showPreview ? "hidden lg:block" : ""
            }`}
          >
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

            <InvoiceHeader invoice={invoice} onUpdate={handleInvoiceUpdate} />
            <ClientDetails invoice={invoice} onUpdate={handleInvoiceUpdate} />

            <ItemList
              invoice={invoice}
              onUpdate={handleInvoiceUpdate}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />

            <InvoiceSummary
              items={invoice.items}
              summary={summary}
              onUpdate={handleSummaryUpdate}
            />

            <InvoiceActions
              invoice={invoice}
              onUpdate={handleInvoiceUpdate}
              onSave={handleSave}
            />
          </div>

          <div
            className={`${
              !showPreview ? "hidden lg:block" : ""
            } lg:sticky lg:top-8`}
          >
            <div className="lg:h-screen lg:overflow-hidden">
              <div
                ref={previewRef}
                className="pdf-safe"
                style={{ color: "#000", backgroundColor: "#fff" }}
              >
                <InvoicePreview
                  invoice={invoice}
                  showBusinessHeader={showBusinessHeader}
                  currentUser={currentUser}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {showGuestPopup && <Popup onClose={() => setShowGuestPopup(false)} />}
    </div>
  );
};

export default Dashboard;
