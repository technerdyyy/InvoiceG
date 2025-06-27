import React from "react";

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  ...props
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      {...props}
    />
  </div>
);

export default Input;
