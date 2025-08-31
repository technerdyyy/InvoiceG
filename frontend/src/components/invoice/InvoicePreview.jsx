import React from "react";

const InvoicePreview = ({ invoice, showBusinessHeader, summary }) => {
  // Ensure invoice and items exist
  if (!invoice || !invoice.items) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        Invalid invoice data
      </div>
    );
  }

  const calculateSubtotal = () =>
    invoice.items.reduce((total, item) => {
      const amount =
        item.amount || (item.quantity || 0) * (item.unitPrice || 0);
      return total + amount;
    }, 0);

  const subtotal = calculateSubtotal();
  const discountAmount = ((summary?.discount || 0) * subtotal) / 100;
  const taxableAmount = subtotal - discountAmount;
  const cgstAmount = ((summary?.cgst || 0) * taxableAmount) / 100;
  const sgstAmount = ((summary?.sgst || 0) * taxableAmount) / 100;
  const total = taxableAmount + cgstAmount + sgstAmount;

  const businessInfo = invoice.businessInfo || {};

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg overflow-visible mx-auto"
      style={{ maxWidth: "900px", boxSizing: "border-box" }}
    >
      {/* Main Invoice Title */}
      <h1 className="text-2xl text-center font-bold pb-4 text-gray-800">
        INVOICE
      </h1>

      <div
        className="border-2 border-gray-200 rounded-lg p-6"
        style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
      >
        {/* Business Header */}
        {showBusinessHeader && businessInfo.businessName && (
          <div
            className="mb-6 border-b pb-4"
            style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
          >
            <h2 className="font-bold text-xl text-blue-600 mb-2">
              {businessInfo.businessName}
            </h2>
            <div className="text-sm space-y-1">
              {businessInfo.registrationNumber && (
                <p className="text-gray-700">
                  Reg. No: {businessInfo.registrationNumber}
                </p>
              )}
              {businessInfo.address && (
                <p className="text-gray-700">{businessInfo.address}</p>
              )}
              {businessInfo.city && (
                <p className="text-gray-700">{businessInfo.city}</p>
              )}
              {businessInfo.representative && (
                <p className="text-gray-700">
                  Representative: {businessInfo.representative}
                </p>
              )}
              {businessInfo.department && (
                <p className="text-gray-700">
                  Department: {businessInfo.department}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Client & Invoice Info */}
        <div className="flex justify-between mb-6 gap-6">
          <div className="flex-1">
            <h3 className="font-bold mb-2 text-gray-800">Bill To:</h3>
            <div className="text-sm space-y-1">
              {invoice.clientDetails && (
                <p className="text-blue-600 font-medium">
                  {invoice.clientDetails}
                </p>
              )}
              {invoice.contactInfo && (
                <p className="text-gray-700">{invoice.contactInfo}</p>
              )}
              {invoice.serviceDescription && (
                <p className="text-gray-700">
                  <span className="font-medium">Service:</span>{" "}
                  {invoice.serviceDescription}
                </p>
              )}
            </div>
          </div>
          <div className="text-right text-sm space-y-2 min-w-48">
            {invoice.invoiceNumber && (
              <p className="text-gray-700">
                <strong>Invoice No:</strong> {invoice.invoiceNumber}
              </p>
            )}
            {invoice.date && (
              <p className="text-gray-700">
                <strong>Date:</strong> {invoice.date}
              </p>
            )}
            {invoice.referenceNumber && (
              <p className="text-gray-700">
                <strong>Reference:</strong> {invoice.referenceNumber}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div
          className="border border-gray-300 rounded mb-6"
          style={{ overflow: "visible" }}
        >
          <div
            className="grid grid-cols-4 gap-4 p-4 bg-gray-100 font-semibold text-sm border-b"
            style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
          >
            <div>Description</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Unit Price</div>
            <div className="text-right">Amount</div>
          </div>
          {invoice.items.map((item, index) => {
            const itemAmount =
              item.amount || (item.quantity || 0) * (item.unitPrice || 0);
            return (
              <div
                key={item.id || index}
                className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0 text-sm hover:bg-gray-50"
                style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
              >
                <div
                  className="text-gray-800"
                  style={{ wordBreak: "break-word" }}
                >
                  {item.description || item.name || "No description"}
                </div>
                <div className="text-center text-gray-700">
                  {item.quantity || 0}
                </div>
                <div className="text-right text-gray-700">
                  ₹{(item.unitPrice || 0).toFixed(2)}
                </div>
                <div className="text-right font-medium">
                  ₹{itemAmount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Always show breakdown at the bottom */}
        <div className="flex justify-end mt-8">
          <div className="w-80 space-y-2">
            <div className="bg-gray-50 text-sm rounded-lg p-4 space-y-2 border">
              <div className="flex justify-between text-gray-800">
                <span>Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({summary?.discount || 0}%):</span>
                  <span className="font-medium">
                    - ₹{discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Taxable Amount:</span>
                  <span className="font-medium">
                    ₹{taxableAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {cgstAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>CGST ({summary?.cgst || 0}%):</span>
                  <span className="font-medium">
                    + ₹{cgstAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {sgstAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>SGST ({summary?.sgst || 0}%):</span>
                  <span className="font-medium">
                    + ₹{sgstAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold pt-4 border-t text-2xl text-gray-900">
                <span>Grand Total:</span>
                <span className="text-blue-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        {invoice.terms && (
          <div className="mt-8 pt-4 border-t text-xs text-gray-600">
            <h4 className="font-semibold mb-2">Payment Terms:</h4>
            <p>
              {invoice.terms}
              {invoice.invoiceNumber &&
                ` (Reference: Invoice #${invoice.invoiceNumber})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;
