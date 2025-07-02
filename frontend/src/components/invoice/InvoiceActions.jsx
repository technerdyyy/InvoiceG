import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Download, Save } from "lucide-react";
import html2pdf from "html2pdf.js"; // ⬅️ Import pdf lib

const InvoiceActions = ({ invoice, onUpdate }) => {
  const handleDownload = () => {
    const element = document.getElementById("invoice-content"); // 👈 Make sure invoice is wrapped with this id

    if (!element) {
      console.error("Invoice content not found!");
      return;
    }

    const options = {
      margin: 0.5,
      filename: `invoice-${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

     html2pdf()
      .set({
        margin: 0.5,
        filename: `invoice-${invoice.invoiceNumber || "preview"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
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
          <Button variant="success" onClick={handleDownload} className="cursor-pointer">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceActions;
