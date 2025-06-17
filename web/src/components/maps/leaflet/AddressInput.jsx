import React, { useRef } from "react";
import { Search } from "lucide-react";

const AddressInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  focused,
  onSelect,
}) => {
  const inputRef = useRef(null);

  return (
    <div className="relative w-full mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search for an address..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
    </div>
  );
};

export default AddressInput;
