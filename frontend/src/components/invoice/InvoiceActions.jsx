import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Download, Save } from "lucide-react";

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
      <div className="flex space-x-4">
        <Button variant="primary" className="cursor-pointer">
          <Save size={16} className="mr-2" />
          Save Invoice
        </Button>
        <Button variant="success" className="cursor-pointer">
          <Download size={16} className="mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  </div>
);

export default InvoiceActions;
