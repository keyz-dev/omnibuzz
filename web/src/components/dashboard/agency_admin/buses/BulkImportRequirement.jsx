import React, { useState } from 'react'
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const BulkImportRequirement = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-line_clr rounded-sm">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-t-lg focus:outline-none">
                <div className="flex items-center space-x-3">
                    <Info className="text-blue-600" />
                    <span className="font-semibold text-blue-800">Document Requirements</span>
                </div>
                {isOpen ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-blue-600" />}
            </button>
            {isOpen && (
                <div className="p-4 border-t border-line_clr">
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Upload a CSV or Excel file with bus data</li>
                        <li>Required columns: plateNumber, busType, capacity, seatLayout, and amenities</li>
                        <li>Capacity should be numeric</li>
                        <li>Amenities should be comma-separated</li>
                        <li>After upload, you'll select which station to assign all buses to</li>
                        <li>Download the template below for the correct format</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BulkImportRequirement