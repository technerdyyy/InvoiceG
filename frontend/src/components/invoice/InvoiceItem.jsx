import React, { useState, useRef } from "react";
import axios from "axios";
import Input from "../ui/Input";
import ItemSuggestions from "./ItemSuggestions";
import Button from "../ui/Button";
import { Trash2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";

const InvoiceItem = ({ item, onUpdate, onRemove, canRemove }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const handleDescriptionChange = async (value) => {
    onUpdate(item.id, "description", value);
    setHighlightedIndex(-1);

    if (!isAuthenticated) return; // 👈 Block unauthenticated suggestion fetch

    const userIdToUse = item.userId || null;

    if (value.trim().length > 0) {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/suggestions?q=${value}&userId=${userIdToUse}`
        );

        const suggestionNames = data.map((s) => s.name);
        setSuggestions(suggestionNames);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = async (suggestion) => {
    onUpdate(item.id, "description", suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);

    if (!isAuthenticated) return; // 👈 Block saving if not logged in

    try {
      await axios.post("http://localhost:5000/api/suggestions", {
        name: suggestion,
        userId: item.userId || null,
      });
    } catch (err) {
      console.error("Failed to save suggestion:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSuggestionSelect(suggestions[highlightedIndex]);
      }
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg items-end">
      <div className="col-span-12 md:col-span-4 relative">
        <Input
          label="Description"
          ref={inputRef}
          value={item.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Item name"
        />
        <ItemSuggestions
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          show={showSuggestions && item.description}
          highlightedIndex={highlightedIndex}
        />
      </div>

      <div className="col-span-6 md:col-span-2">
        <Input
          label="Quantity"
          type="number"
          value={item.quantity}
          onChange={(e) =>
            onUpdate(item.id, "quantity", parseInt(e.target.value) || 0)
          }
          min="1"
        />
      </div>

      <div className="col-span-6 md:col-span-2">
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
      </div>

      <div className="col-span-6 md:col-span-2">
        <Input label="Amount (₹)" value={item.amount.toFixed(2)} readOnly />
      </div>

      <div className="col-span-6 md:col-span-2 flex justify-end items-end">
        <Button
          variant="danger"
          size="md"
          onClick={() => onRemove(item.id)}
          disabled={!canRemove}
          className="p-3"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default InvoiceItem;
