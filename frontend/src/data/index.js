const initialInvoiceState = {
  businessInfo: {
    businessName: "",
    registrationNumber: "",
    businessAddress: "",
    cityRegion: "",
    representativeName: "",
    department: "",
  },
  invoiceNumber: "",
  date: new Date().toLocaleDateString(),
  clientDetails: "",
  referenceNumber: "",
  contactInfo: "",
  serviceDescription: "",
  terms: "",
  items: [{ id: 1, description: "", quantity: 1, unitPrice: 0, amount: 0 }],
};

export default initialInvoiceState;
