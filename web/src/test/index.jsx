// BulkInsertView.jsx - Main component (now much smaller!)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgency } from '../../../../stateManagement/contexts/dashboard/agency_admin';

// Import reusable UI components
import { Button } from '../../../ui';
import { ArrowLeft } from 'lucide-react';
import { BulkImportRequirement, BulkInsertTable } from './';

// Import our new smaller components
import { FileProcessor } from './FileProcessor';
import ErrorMessages from './ErrorMessages';
import FileUploadSection from './FileUploadSection';
import DebugDataViewer from './DebugDataViewer';

const BulkInsertView = ({ setView }) => {
  const { bulkImportBuses, loading, error, successMessage } = useAgency();
  const [buses, setBuses] = useState([]);
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [selectedStation, setSelectedStation] = useState('');

  // Mock stations data - replace with actual stations from your context/API
  const stations = [
    { id: 'station-1', name: 'Bonaberi Douala' },
    { id: 'station-2', name: 'Yaoundé Central' },
    { id: 'station-3', name: 'Douala Central' },
    { id: 'station-4', name: 'Bafoussam Station' },
    // Add more stations as needed
  ];

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
      // Add the selected station to all buses before importing
      const busesWithStation = buses.map(bus => ({
        ...bus,
        baseStationId: selectedStation
      }));

      const result = await bulkImportBuses(busesWithStation);
      if (result.success) {
        setView();
      }
    }
  };

  const handleChangeFile = () => {
    setFile(null);
    setBuses([]);
    setValidationError('');
    setSelectedStation(''); // Reset station selection
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
        <>
          <DebugDataViewer buses={buses} />
          <BulkInsertTable
            buses={buses}
            handleImport={handleImport}
            loading={loading}
            stations={stations}
            selectedStation={selectedStation}
            onStationChange={setSelectedStation}
          />
        </>
      )}
    </div>
  );
};

export default BulkInsertView;