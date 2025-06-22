// ErrorMessages.jsx - Displays different types of error messages
import React from 'react';

const ErrorMessages = ({ successMessage, error, validationError }) => {
    return (
        <div className="mb-4">
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-error px-4 py-3 rounded-md mb-4">
                    {error}
                </div>
            )}
            {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                    <strong>File Validation Error:</strong> {validationError}
                </div>
            )}
        </div>
    );
};

export default ErrorMessages;