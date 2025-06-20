import React from 'react';
import { FileText, X, Eye } from 'lucide-react';

const UploadedFileItem = ({ file, documentType, error, onTypeChange, onRemove, onPreview, documentTypes }) => {

    const renderFilePreview = (file) => {
        if (file.type.startsWith('image/')) {
            return <img src={file.preview} alt={file.name} className="w-10 h-10 object-cover rounded-md" />;
        }
        return <FileText className="w-10 h-10 text-gray-500" />;
    };

    const formatTypeName = (name) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
                {renderFilePreview(file)}
                <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button type="button" onClick={() => onPreview(file)} className="p-2 text-gray-500 hover:text-gray-800"><Eye /></button>
                <button type="button" onClick={() => onRemove(file.path)} className="p-2 text-gray-500 hover:text-red-600"><X /></button>
            </div>
            <div className="mt-4">
                <label htmlFor={`docType-${file.path}`} className="block text-sm font-medium text-gray-700 mb-1">Document Type <span className="text-red-500">*</span></label>
                <select
                    id={`docType-${file.path}`}
                    value={documentType || ''}
                    onChange={(e) => onTypeChange(file.path, e.target.value)}
                    className={`w-full px-3 py-2 border rounded-xs focus:outline-none focus:ring ${error ? 'border-error focus:ring-error' : 'border-gray-300 focus:ring-accent'}`}
                >
                    <option value="" disabled>Select document type...</option>
                    {documentTypes.map(type => (
                        <option key={type} value={type}>
                            {formatTypeName(type)}
                        </option>
                    ))}
                </select>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        </div>
    );
};

export default UploadedFileItem;
