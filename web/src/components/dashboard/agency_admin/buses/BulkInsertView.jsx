// BulkInsertView.jsx - Main component (now much smaller!)
import React, { useState } from 'react';
import { useAgency, useAgencyStation, useAgencyBuses } from '../../../../contexts/dashboard/agency_admin';

// Import reusable UI components
import { Button } from '../../../ui';
import { ArrowLeft } from 'lucide-react';
import { BulkImportRequirement, BulkInsertTable } from './';

// Import our new smaller components
import { FileProcessor } from './utils/FileProcessor';
import ErrorMessages from './ErrorMessages';
import FileUploadSection from './FileUploadSection';

const BulkInsertView = ({ setView }) => {
    const { stations } = useAgencyStation();
    const { bulkInsertBuses, loading, error } = useAgencyBuses();

    const [buses, setBuses] = useState([]);
    const [file, setFile] = useState(null);
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedStation, setSelectedStation] = useState('');

    const handleFileDrop = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (selectedFile) {
            setFile(selectedFile);
            setValidationError('');
            setBuses([]);

            // Use FileProcessor to handle the file
            FileProcessor.processFile(
                selectedFile,
                // Success callback
                (processedBuses) => {
                    setBuses(processedBuses);
                    setValidationError('');
                },
                // Error callback
                (errorMessage) => {
                    setValidationError(errorMessage);
                    setBuses([]);
                }
            );
        }
    };

    const handleImport = async () => {
        if (buses.length > 0 && selectedStation) {
            const busesWithStation = buses.map(bus => ({
                ...bus,
                baseStationId: selectedStation
            }));

            const result = await bulkInsertBuses(busesWithStation);
            if (result.success) {
                setSuccessMessage(result.message || 'Buses imported successfully!');
                setBuses([]);
                setSelectedStation('');
                setFile(null);
                setValidationError('');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            }
        }
    };

    const handleChangeFile = () => {
        setFile(null);
        setBuses([]);
        setValidationError('');
        setSelectedStation('');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Button
                onClickHandler={setView}
                additionalClasses="mb-6 inline-flex items-center text-placeholder hover:text-secondary default_transition cursor-pointer"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to main
            </Button>

            <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2">Bulk Import your Buses</h1>

                <ErrorMessages
                    successMessage={successMessage}
                    error={error}
                    validationError={validationError}
                />
            </div>

            {/* Instructions Section */}
            <BulkImportRequirement />

            {/* File Upload Section */}
            <FileUploadSection
                onFileDrop={handleFileDrop}
                file={file}
                buses={buses}
                onChangeFile={handleChangeFile}
            />

            {/* Data Preview Section */}
            {buses.length > 0 && !validationError && (
                <BulkInsertTable
                    buses={buses}
                    handleImport={handleImport}
                    loading={loading}
                    stations={stations}
                    selectedStation={selectedStation}
                    onStationChange={setSelectedStation}
                />
            )}
        </div>
    );
};

export default BulkInsertView;
