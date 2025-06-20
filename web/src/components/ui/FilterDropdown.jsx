import React from 'react';
import { ChevronDown } from 'lucide-react';

const FilterDropdown = ({ label, options, selected, setSelected }) => {
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      >
        <option value="">{`All ${label}s`}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={16} />
      </div>
    </div>
  );
};

export default FilterDropdown;
