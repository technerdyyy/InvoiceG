import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const InvoicePreview = ({ invoice, showBusinessHeader, summary }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const calculateSubtotal = () =>
    invoice.items.reduce((total, item) => total + item.amount, 0);

  const subtotal = calculateSubtotal();
  const discountAmount = ((summary?.discount || 0) * subtotal) / 100;
  const cgstAmount = ((summary?.cgst || 0) * subtotal) / 100;
  const sgstAmount = ((summary?.sgst || 0) * subtotal) / 100;
  const total = subtotal - discountAmount + cgstAmount + sgstAmount;

  const businessInfo = invoice.businessInfo || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-object-fit overflow-auto">
      <h1 className="text-2xl text-center font-bold pb-3">Preview</h1>

      <div className="border-2 border-gray-200 rounded-lg p-6">
        {/* Business Header */}
        {showBusinessHeader && businessInfo.businessName && (
          <div className="mb-6 border-b pb-4">
            <h2 className="font-bold text-lg text-blue-600">
              {businessInfo.businessName}
            </h2>
            {businessInfo.registrationNumber && (
              <p>{businessInfo.registrationNumber}</p>
            )}
            {businessInfo.address && <p>{businessInfo.address}</p>}
            {businessInfo.city && <p>{businessInfo.city}</p>}
            {businessInfo.representative && (
              <p>Representative: {businessInfo.representative}</p>
            )}
            {businessInfo.department && (
              <p>Department: {businessInfo.department}</p>
            )}
          </div>
        )}

        {/* Client & Invoice Info */}
        <div className="flex justify-between mb-6">
          <div className="w-1/2">
            <h3 className="font-bold mb-2">Bill To</h3>
            <div className="text-sm text-blue-600 space-y-1">
              {invoice.clientDetails && <p>{invoice.clientDetails}</p>}
              {invoice.referenceNumber && <p>{invoice.referenceNumber}</p>}
              {invoice.contactInfo && <p>{invoice.contactInfo}</p>}
              {invoice.serviceDescription && (
                <p>Service: {invoice.serviceDescription}</p>
              )}
              {invoice.terms && <p>Terms: {invoice.terms}</p>}
            </div>
          </div>
          <div className="text-right text-sm space-y-1">
            {invoice.invoiceNumber && (
              <p>
                <strong>Invoice No:</strong> {invoice.invoiceNumber}
              </p>
            )}
            {invoice.date && (
              <p>
                <strong>Date:</strong> {invoice.date}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-gray-300 rounded">
          <div className="grid grid-cols-4 gap-5 p-3 bg-gray-50 font-medium text-sm border-b">
            <div>Name</div>
            <div>Quantity</div>
            <div>Unit Price</div>
            <div>Amount</div>
          </div>
          {invoice.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-4 gap-4 p-3 border-b text-sm"
            >
              <div>{item.description}</div>
              <div>{item.quantity}</div>
              <div>₹{item.unitPrice.toFixed(2)}</div>
              <div>₹{item.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Total + Breakdown */}
        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div
              className="flex justify-between font-bold text-lg cursor-pointer pt-2"
              onClick={() => setShowBreakdown(!showBreakdown)}
            >
              <span>Grand Total</span>
              <div className="flex items-center space-x-2">
                <span>₹{total.toFixed(2)}</span>
                {showBreakdown ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            </div>

            {showBreakdown && (
              <div className="bg-gray-50 text-sm rounded p-3 space-y-1 border mt-2">
                <div className="flex justify-between text-gray-800">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({summary?.discount}%)</span>
                    <span>- ₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {cgstAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>CGST ({summary?.cgst}%)</span>
                    <span>+ ₹{cgstAmount.toFixed(2)}</span>
                  </div>
                )}

                {sgstAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>SGST ({summary?.sgst}%)</span>
                    <span>+ ₹{sgstAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold pt-2 border-t text-gray-900">
                  <span>Grand Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Terms */}
        {invoice.terms && (
          <div className="mt-6 text-xs text-gray-600">
            <p>
              Payment terms: {invoice.terms}. In reference to invoice #
              {invoice.invoiceNumber}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;
