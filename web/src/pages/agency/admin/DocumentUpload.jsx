import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DocumentRequirements, FilePreviewModal, FileDropzone, UploadedFileItem } from '../../../components/document_upload/';
import { useAgency } from '../../../stateManagement/contexts/dashboard';

const documentTypeList = [
  "business_registration",
  "tax_clearance",
  "operating_license",
  "insurance_certificate",
  "safety_certificate",
  "vehicle_registration",
  "driver_license",
  "other"
];

const DocumentUpload = () => {
  const navigate = useNavigate();
  const { saveDocuments, loading, error: apiError, fetchAgencyProfile } = useAgency();

  const [files, setFiles] = useState([]);
  const [documentTypes, setDocumentTypes] = useState({});
  const [errors, setErrors] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    const newErrors = {};
    newFiles.forEach(file => {
      if (!documentTypes[file.path]) {
        newErrors[file.path] = 'Please select a document type.';
      }
    });
    setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
  }, [documentTypes]);

  const handleRemoveFile = (filePath) => {
    setFiles(files => files.filter(file => file.path !== filePath));
    const newDocumentTypes = { ...documentTypes };
    delete newDocumentTypes[filePath];
    setDocumentTypes(newDocumentTypes);
    const newErrors = { ...errors };
    delete newErrors[filePath];
    setErrors(newErrors);
  };

  const handleTypeChange = (filePath, type) => {
    setDocumentTypes({ ...documentTypes, [filePath]: type });
    if (type) {
      const newErrors = { ...errors };
      delete newErrors[filePath];
      setErrors(newErrors);
    } else {
      setErrors({ ...errors, [filePath]: 'Please select a document type.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadSuccess(false);
    let hasErrors = false;
    const newErrors = {};
    files.forEach(file => {
      if (!documentTypes[file.path]) {
        newErrors[file.path] = 'Please select a document type.';
        hasErrors = true;
      }
    });
    setErrors(newErrors);
    if (!hasErrors && files.length > 0) {
      const documentsToUpload = files.map(file => ({
        file,
        type: documentTypes[file.path]
      }));

      try {
        await saveDocuments(documentsToUpload);
        await fetchAgencyProfile();

        setUploadSuccess(true);
        setFiles([]);
        setDocumentTypes({});
        setErrors({});
        setPreviewFile(null);

        setTimeout(() => {
          navigate('/agency/admin/profile-completion');
        }, 2000);
      } catch (err) {
        // Error is already set in context, but you could add specific UI updates here
        console.error("Upload failed", err);
      }
    }
  };

  const isSubmitDisabled = files.length === 0 || files.some(file => !documentTypes[file.path]) || loading;

  return (
    <div className="">
      <div className="max-w-2xl mx-auto bg-white p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Agency Verification Documents</h1>
          <p className="text-gray-500 mt-2">Upload your agency documents for verification. Accepted formats: Images (JPG, PNG, GIF, WebP) and PDF files.</p>
        </div>

        {apiError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-sm relative mb-4" role="alert">{apiError}</div>}
        {uploadSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-sm relative mb-4" role="alert">Documents submitted successfully!</div>}

        <FileDropzone onDrop={onDrop} />

        {files.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-secondary mb-4">Uploaded Documents</h2>
            <div className="space-y-6">
              {files.map(file => (
                <UploadedFileItem
                  key={file.path}
                  file={file}
                  documentTypes={documentTypeList}
                  documentType={documentTypes[file.path]}
                  error={errors[file.path]}
                  onTypeChange={handleTypeChange}
                  onRemove={handleRemoveFile}
                  onPreview={setPreviewFile}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xs text-white font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>

        <DocumentRequirements />
      </div>

      <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
    </div>
  );
};

export default DocumentUpload;
