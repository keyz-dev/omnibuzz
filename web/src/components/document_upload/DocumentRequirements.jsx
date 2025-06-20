import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const DocumentRequirements = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-8 border border-line_clr rounded-sm">
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
                        <li>Upload clear, readable copies of your agency documents</li>
                        <li>Accepted formats: JPG, PNG, GIF, WebP, PDF</li>
                        <li>Maximum file size: 10MB per document</li>
                        <li>Label each document clearly (e.g., "Business License", "Tax Certificate")</li>
                        <li>Include business license, registration certificates, and identity documents</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DocumentRequirements;
