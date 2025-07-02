import React from "react";
import Input from "../ui/Input";

const InvoiceHeader = ({ invoice, onUpdate }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Invoice Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        label="Invoice Number"
        value={invoice.invoiceNumber}
        onChange={(e) => onUpdate("invoiceNumber", e.target.value)}
      />
      <Input
        label="Date"
        type="date"
        value={new Date().toISOString().split("T")[0]}
        onChange={(e) => onUpdate("date", e.target.value)}
      />
    </div>
  </div>
);

export default InvoiceHeader;
