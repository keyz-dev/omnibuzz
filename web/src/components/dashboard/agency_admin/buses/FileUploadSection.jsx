// FileUploadSection.jsx - Handles file upload UI and interactions
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../../ui';
import FileDropzone from '../../../document_upload/FileDropzone';

const FileUploadSection = ({
    onFileDrop,
    file,
    buses,
    onChangeFile,
    onDownloadTemplate
}) => {
    const handleDownloadTemplate = () => {
        const csvContent = "plateNumber,busType,capacity,seatLayout,baseStationId,amenities,status\nStation-001,Standard,67,3 by 2,Bonaberi Douala,Classic,Active\nStation-002,Standard,67,3 by 2,Bonaberi Douala,Classic,Active\nStation-003,Standard,67,3 by 2,Bonaberi Douala,Classic,Active\n";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "bus_import_template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const acceptedFileTypes = {
        'text/csv': ['.csv'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    };

    return (
        <section className="">
            {/* Download Template Button */}
            <Button
                onClickHandler={onDownloadTemplate || handleDownloadTemplate}
                additionalClasses="my-6 inline-flex items-center text-green-600 border-green-600 hover:bg-green-100"
            >
                <Download size={16} className="mr-2" />
                Download Template
            </Button>

            {/* File Upload Section */}
            <div className="mb-6">
                <FileDropzone onDrop={onFileDrop} accept={acceptedFileTypes} />
                {file && (
                    <div className="mt-2">
                        <p className="text-sm text-gray-600">
                            Selected file: <span className="font-medium">{file.name}</span>
                        </p>
                        {buses.length > 0 && (
                            <p className="text-sm text-green-600">
                                ✓ File validated successfully - {buses.length} buses found
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Change File Button */}
            {file && (
                <Button
                    onClickHandler={onChangeFile}
                    additionalClasses="mb-6 bg-blue-600 text-white hover:bg-blue-700"
                >
                    Change File
                </Button>
            )}
        </section>
    );
};

export default FileUploadSection;