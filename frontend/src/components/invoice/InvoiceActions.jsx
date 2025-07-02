import React from "react";
import Input from "../ui/Input";

const InvoiceActions = ({ invoice, onUpdate }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <Input
        label="Payment Terms"
        value={invoice.terms}
        onChange={(e) => onUpdate("terms", e.target.value)}
        placeholder="Net 30, Due on receipt, etc."
        className="flex-1"
      />
    </div>
  </div>
);

export default InvoiceActions;
