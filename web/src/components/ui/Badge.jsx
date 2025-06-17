import React from "react";
import { X } from "lucide-react";

const Badge = ({ children, variant = "default", onRemove }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}
    >
      {children}
      {onRemove && (
        <button onClick={onRemove} className="ml-2 hover:text-red-600">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
};

export default Badge;
