import React, { useState } from "react";
import mockFoodItems from "../../data/mockFoodItems";
import Input from "../ui/Input";
import ItemSuggestions from "./ItemSuggestions";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";

const InvoiceItem = ({ item, onUpdate, onRemove, canRemove }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleDescriptionChange = (value) => {
    onUpdate(item.id, "description", value);
    if (value.length > 0) {
      const filtered = mockFoodItems.filter((foodItem) =>
        foodItem.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    onUpdate(item.id, "description", suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="md:col-span-2 relative">
        <Input
          label="Description"
          value={item.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Start typing food item..."
        />
        <ItemSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          show={showSuggestions && item.description}
        />
      </div>
      <Input
        label="Quantity"
        type="number"
        value={item.quantity}
        onChange={(e) =>
          onUpdate(item.id, "quantity", parseInt(e.target.value) || 0)
        }
        min="1"
      />
      <Input
        label="Unit Price (₹)"
        type="number"
        value={item.unitPrice}
        onChange={(e) =>
          onUpdate(item.id, "unitPrice", parseFloat(e.target.value) || 0)
        }
        min="0"
        step="0.01"
      />
      <Input
        label="Amount (₹)"
        value={item.amount.toFixed(2)}
        readOnly
        className="bg-gray-100"
      />
      <div className="flex items-end">
        <Button
          variant="danger"
          size="md"
          onClick={() => onRemove(item.id)}
          disabled={!canRemove}
          className="p-3 cursor-pointer"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItem;
