import React, { useState } from "react";
import Button from "../ui/Button";

const InvoicePreview = ({ invoice, showBusinessHeader, currentUser }) => {
  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => total + item.amount, 0);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: currentUser?.businessName || "",
    registrationNumber: "",
    address: "",
    city: "",
    representative: "",
    department: "",
  });

  const handleChange = (e) => {
    setBusinessInfo({ ...businessInfo, [e.target.name]: e.target.value });
  };

  return (
    <div id="invoice-content"> {/* ✅ Added for PDF export */}
      <div className="bg-white p-6 rounded-lg shadow-lg h-full overflow-auto">
        <div className="border-2 border-gray-200 rounded-lg p-6">
          {showBusinessHeader && (
            <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-800">
              <div className="flex items-start space-x-4 w-full">
                <div className="w-20 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                  Your Logo
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-1">
                      <input type="text" name="businessName" value={businessInfo.businessName} onChange={handleChange} className="border w-full px-2 py-1 rounded text-sm" placeholder="Business Name" />
                      <input type="text" name="registrationNumber" value={businessInfo.registrationNumber} onChange={handleChange} className="border w-full px-2 py-1 rounded text-sm" placeholder="Registration Number" />
                      <input type="text" name="address" value={businessInfo.address} onChange={handleChange} className="border w-full px-2 py-1 rounded text-sm" placeholder="Business Address" />
                      <input type="text" name="city" value={businessInfo.city} onChange={handleChange} className="border w-full px-2 py-1 rounded text-sm" placeholder="City, Region" />
                      <input type="text" name="representative" value={businessInfo.representative} onChange={handleChange} className="border w-full px-2 py-1 rounded text-sm" placeholder="Representative" />
                      <input type="text" name="department" value={businessInfo.department} onChange={handleChange} className="border w-full px-2 py-1 rounded text-sm" placeholder="Department" />
                    </div>
                  ) : (
                    <div className="text-sm text-blue-600 space-y-1">
                      <h2 className="font-bold text-lg">{businessInfo.businessName || "[Business Name]"}</h2>
                      <p>{businessInfo.registrationNumber || "[Registration Number]"}</p>
                      <p>{businessInfo.address || "[Business Address]"}</p>
                      <p>{businessInfo.city || "[City, Region]"}</p>
                      <p>Representative: {businessInfo.representative || "[Name]"}</p>
                      <p>Department: {businessInfo.department || "[Unit]"}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                <Button onClick={() => setIsEditing((prev) => !prev)} variant="orange">
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-between mb-6">
            <div className="w-1/2">
              <h3 className="font-bold mb-2">Bill To</h3>
              <div className="text-sm space-y-1">
                <p className="text-blue-600">{invoice.clientDetails || "[Client Details]"}</p>
                <p className="text-blue-600">{invoice.referenceNumber || "[Reference Number]"}</p>
                <p className="text-blue-600">{invoice.contactInfo || "[Contact Information]"}</p>
                <p className="text-blue-600">Service/Product: {invoice.serviceDescription || "[Description]"}</p>
                <p className="text-blue-600">Terms: {invoice.terms || "[Conditions]"}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="font-medium">Invoice Number:</span>
                <span className="ml-2">{invoice.invoiceNumber}</span>
              </div>
              <div>
                <span className="font-medium">Date:</span>
                <span className="ml-2">{invoice.date}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 rounded">
            <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-medium text-sm border-b">
              <div>Description</div>
              <div>Quantity</div>
              <div>Unit price</div>
              <div>Amount</div>
            </div>
            {invoice.items.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 p-3 border-b last:border-b-0 text-sm">
                <div>{item.description || "Product/Service"}</div>
                <div>{item.quantity}</div>
                <div>₹{item.unitPrice.toFixed(2)}</div>
                <div>₹{item.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 font-bold text-lg border-t">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="bg-gray-100 p-3 rounded mt-2">
                <div className="flex justify-between text-sm">
                  <span>Paid Amount</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between font-bold mt-1">
                  <span>Balance Due</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-600">
            <p>
              Payment terms: {invoice.terms || "[specify terms]"}. Please reference invoice #{invoice.invoiceNumber}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
