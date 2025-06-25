import React from "react";
import TextArea from "../ui/TextArea";
import Input from "../ui/Input";

const ClientDetails = ({ invoice, onUpdate }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold mb-4">Bill To</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextArea
        label="Client Details"
        value={invoice.clientDetails}
        onChange={(e) => onUpdate("clientDetails", e.target.value)}
        placeholder="Client name and address"
      />
      <TextArea
        label="Contact Information"
        value={invoice.contactInfo}
        onChange={(e) => onUpdate("contactInfo", e.target.value)}
        placeholder="Phone, email, etc."
      />
      <Input
        label="Reference Number"
        value={invoice.referenceNumber}
        onChange={(e) => onUpdate("referenceNumber", e.target.value)}
        placeholder="PO number, etc."
      />
      <Input
        label="Service/Product Description"
        value={invoice.serviceDescription}
        onChange={(e) => onUpdate("serviceDescription", e.target.value)}
        placeholder="Brief description"
      />
    </div>
  </div>
);

export default ClientDetails;
