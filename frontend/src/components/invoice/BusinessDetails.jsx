import React from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const BusinessDetails = ({
  businessInfo = {},
  isEditing,
  handleChange,
  onToggleEdit,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Bill From</h3>
        <Button onClick={onToggleEdit} variant="orange">
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Name"
            name="businessName"
            value={businessInfo.businessName || ""}
            onChange={handleChange}
            placeholder="Your business name"
          />
          <Input
            label="Registration Number"
            name="registrationNumber"
            value={businessInfo.registrationNumber}
            onChange={handleChange}
            placeholder="Business registration ID"
          />
          <Input
            label="Business Address"
            name="address"
            value={businessInfo.address}
            onChange={handleChange}
            placeholder="Street, area, etc."
          />
          <Input
            label="City, Region"
            name="city"
            value={businessInfo.city}
            onChange={handleChange}
            placeholder="City and state"
          />
          <Input
            label="Representative Name"
            name="representative"
            value={businessInfo.representative}
            onChange={handleChange}
            placeholder="Your name or manager"
          />
          <Input
            label="Department"
            name="department"
            value={businessInfo.department}
            onChange={handleChange}
            placeholder="Sales, Admin, etc."
          />
        </div>
      ) : (
        <div className="text-sm text-blue-600 space-y-1">
          <h2 className="font-bold text-lg">
            {businessInfo.businessName || "[Business Name]"}
          </h2>
          <p>{businessInfo.registrationNumber || "[Registration Number]"}</p>
          <p>{businessInfo.address || "[Business Address]"}</p>
          <p>{businessInfo.city || "[City, Region]"}</p>
          <p>Representative: {businessInfo.representative || "[Name]"}</p>
          <p>Department: {businessInfo.department || "[Unit]"}</p>
        </div>
      )}
    </div>
  );
};

export default BusinessDetails;
