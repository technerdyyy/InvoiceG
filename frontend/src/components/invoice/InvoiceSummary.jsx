import React from "react";

const SummaryDetails = ({ summary, onUpdate }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="text-md font-semibold">Tax & Discount Settings</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            value={summary.discount}
            onChange={(e) =>
              onUpdate("discount", parseFloat(e.target.value) || 0)
            }
            className="w-full border rounded px-3 py-1"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CGST (%)
          </label>
          <input
            type="number"
            value={summary.cgst}
            onChange={(e) =>
              onUpdate("cgst", parseFloat(e.target.value) || 0)
            }
            className="w-full border rounded px-3 py-1"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SGST (%)
          </label>
          <input
            type="number"
            value={summary.sgst}
            onChange={(e) =>
              onUpdate("sgst", parseFloat(e.target.value) || 0)
            }
            className="w-full border rounded px-3 py-1"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default SummaryDetails;
