import React from "react";
import { X } from "lucide-react";

const Tag = ({ children, onRemove }) => {
  return (
    <div className="inline-flex items-center bg-secondary-bg text-secondary px-3 py-1 rounded-full text-sm">
      {children}
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 text-secondary hover:text-secondary transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Tag;
