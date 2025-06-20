import React from 'react';
import { X } from 'lucide-react';

const FilePreviewModal = ({ file, onClose }) => {
    if (!file) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-2 pb-2 border-b">
                    <h3 className="font-semibold">{file.name}</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20}/></button>
                </div>
                {file.type.startsWith('image/') ? (
                    <img src={file.preview} alt="Preview" className="max-w-full max-h-[80vh] object-contain" />
                ) : (
                    <iframe src={file.preview} title="Preview" className="w-[80vw] h-[80vh]"></iframe>
                )}
            </div>
        </div>
    );
};

export default FilePreviewModal;
