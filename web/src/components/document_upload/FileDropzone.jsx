import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '../ui';

const FileDropzone = ({ onDrop }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/gif': [],
            'image/webp': [],
            'application/pdf': []
        },
        maxSize: 10485760 // 10MB
    });

    return (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-sm p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
                <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600">
                    {isDragActive ? 'Drop the files here ...' : 'Drag and Drop'}
                </p>
                <p className="text-gray-500 text-sm mb-4">or browse for files</p>
                <Button type="button" additionalClasses="primarybtn">
                    Browse Files
                </Button>
            </div>
        </div>
    );
};

export default FileDropzone;
