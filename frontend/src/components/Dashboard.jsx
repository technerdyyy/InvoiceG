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
import { Eye, EyeOff, Save, Download, AlertCircle } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const { currentUser, isAuthenticated } = useAuth();

  // ✅ Load initial state from localStorage if exists (with edit support)
  const [invoice, setInvoice] = useState(() => {
    const saved = localStorage.getItem("invoiceData");
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // If it's editing data, use it; otherwise fallback to initial state
        return parsedData.isEditing ? parsedData : initialInvoiceState;
      } catch (error) {
        console.error("Error parsing saved invoice data:", error);
        return initialInvoiceState;
      }
    }
    return initialInvoiceState;
  });

  const [showBusinessHeader, setShowBusinessHeader] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditingBusinessInfo, setIsEditingBusinessInfo] = useState(false);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [itemAddedOnce, setItemAddedOnce] = useState(false);
  const [isEditingExistingInvoice, setIsEditingExistingInvoice] = useState(
    false
  );
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  const [summary, setSummary] = useState({
    discount: 0,
    cgst: 0,
    sgst: 0,
  });

  const previewRef = useRef();

  // ✅ Check if we're editing an existing invoice on component mount
  useEffect(() => {
    const saved = localStorage.getItem("invoiceData");
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        if (parsedData.isEditing && parsedData.originalInvoiceId) {
          setIsEditingExistingInvoice(true);
          setEditingInvoiceId(parsedData.originalInvoiceId);

          // 🔹 Map backend data to frontend structure
          const mappedInvoice = {
            // Business Details - Map from flat structure to nested businessInfo
            businessInfo: {
              businessName: parsedData.businessName || "",
              registrationNumber: parsedData.registrationNumber || "",
              businessAddress: parsedData.businessAddress || "",
              cityRegion: parsedData.cityRegion || "",
              representativeName: parsedData.representativeName || "",
            },

            // Invoice Details
            invoiceNumber: parsedData.invoiceNumber || "",
            date: parsedData.date || new Date().toISOString().split("T")[0],

            // Client Details
            clientDetails: parsedData.clientDetails || "",
            contactInfo: parsedData.contactInformation || "",
            referenceNumber: parsedData.referenceNumber || "",
            serviceDescription: parsedData.serviceDescription || "",

            // Items - Map 'name' to 'description' and ensure all required fields
            items:
              parsedData.items?.map((item, index) => ({
                id: item.id || Date.now() + index,
                description: item.name || item.description || "",
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || 0,
                amount: item.amount || item.quantity * item.unitPrice || 0,
                userId: currentUser ? currentUser._id : "guest",
              })) || [],

            // Payment Terms
            paymentTerms: parsedData.paymentTerms || "",

            // Customer Number
            customerNumber: parsedData.customerNumber || "0000000000",
          };

          setInvoice(mappedInvoice);

          // Set summary from the loaded data
          setSummary({
            discount: parsedData.discount || 0,
            cgst: parsedData.cgst || 0,
            sgst: parsedData.sgst || 0,
          });
        }
      } catch (error) {
        console.error("Error checking edit mode:", error);
      }
    }
  }, [currentUser]);

  // ✅ Update localStorage whenever invoice changes (but preserve edit info)
  useEffect(() => {
    const dataToSave = {
      ...invoice,
      isEditing: isEditingExistingInvoice,
      originalInvoiceId: editingInvoiceId,
    };
    localStorage.setItem("invoiceData", JSON.stringify(dataToSave));
  }, [invoice, isEditingExistingInvoice, editingInvoiceId]);

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

  // ✅ Handle Save - Update existing invoice or create new one
  const handleSave = async () => {
    if (!isAuthenticated || !currentUser) {
      setShowGuestPopup(true);
      return;
    }

    try {
      const totalAmount = invoice.items.reduce(
        (acc, item) => acc + item.quantity * item.unitPrice,
        0
      );

      const invoiceData = {
        // 🔹 Business Details - Map from nested structure to flat
        businessName: invoice.businessInfo?.businessName || "",
        registrationNumber: invoice.businessInfo?.registrationNumber || "",
        businessAddress: invoice.businessInfo?.businessAddress || "",
        cityRegion: invoice.businessInfo?.cityRegion || "",
        representativeName: invoice.businessInfo?.representativeName || "",

        // 🔹 Invoice Info
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.date,

        // 🔹 Client Details
        clientDetails: invoice.clientDetails,
        contactInformation: invoice.contactInfo,
        referenceNumber: invoice.referenceNumber,
        serviceDescription: invoice.serviceDescription,

        // 🔹 Items List - Map 'description' to 'name'
        items: invoice.items.map((item) => ({
          name: item.description, // Map description to name for backend
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.quantity * item.unitPrice,
        })),

        // 🔹 Totals & Tax
        totalAmount,
        discount: summary.discount || 0,
        cgst: summary.cgst || 0,
        sgst: summary.sgst || 0,

        // 🔹 Payment Terms
        paymentTerms: invoice.paymentTerms,

        // 🔹 Customer Number
        customerNumber: invoice.customerNumber || "0000000000",
      };

      let response;
      let successMessage;

      if (isEditingExistingInvoice && editingInvoiceId) {
        // Update existing invoice
        response = await axios.put(
          `http://localhost:5000/api/invoices/${editingInvoiceId}`,
          invoiceData,
          {
            withCredentials: true,
          }
        );
        successMessage = "Invoice updated successfully!";
      } else {
        // Create new invoice
        response = await axios.post(
          "http://localhost:5000/api/invoices",
          invoiceData,
          {
            withCredentials: true,
          }
        );
        successMessage = "Invoice saved successfully!";
      }

      console.log("✅ Invoice operation completed:", response.data);
      alert(successMessage);

      // ✅ Clear localStorage and reset invoice form
      localStorage.removeItem("invoiceData");
      setInvoice(initialInvoiceState);
      setIsEditingExistingInvoice(false);
      setEditingInvoiceId(null);
      setSummary({ discount: 0, cgst: 0, sgst: 0 });
    } catch (error) {
      console.error("❌ Error saving invoice:", error);
      alert("Failed to save invoice. See console.");
    }
  };

  // ✅ Handle creating new invoice (clear edit mode)
  const handleCreateNew = () => {
    localStorage.removeItem("invoiceData");
    setInvoice(initialInvoiceState);
    setIsEditingExistingInvoice(false);
    setEditingInvoiceId(null);
    setSummary({ discount: 0, cgst: 0, sgst: 0 });
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
        {/* ✅ Edit Mode Indicator */}
        {isEditingExistingInvoice && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Editing Existing Invoice
                </span>
              </div>
              <Button
                variant="secondary"
                onClick={handleCreateNew}
                className="text-sm"
              >
                Create New Invoice
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-row justify-between items-center mb-6 gap-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-800 hidden sm:block">
              {isEditingExistingInvoice ? "Edit Invoice" : "Create Invoice"}
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
              <span className="ml-2 hidden sm:inline">
                {isEditingExistingInvoice ? "Update" : "Save"}
              </span>
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
                  summary={summary}
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
