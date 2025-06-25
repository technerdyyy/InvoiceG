import React from "react";

const ItemSuggestions = ({ suggestions, onSelect, show }) => {
  if (!show || suggestions.length === 0) return null;

  return (
    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(suggestion)}
          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default ItemSuggestions;
