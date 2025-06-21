import React from 'react';
import { Globe, Phone, Mail, Save, X } from 'lucide-react';

const ProfileEditView = ({
  agency,
  editData,
  publishStatus,
  setPublishStatus,
  handleInputChange,
  toggleTown,
  handleContactChange,
  handleSave,
  hasUnsavedChanges,
  handleCancel
}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">GV</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{editData.name}</h2>
            <p className="text-sm text-gray-500">{editData.id}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Publish Status</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPublishStatus(!publishStatus)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${publishStatus ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${publishStatus ? 'translate-x-5' : 'translate-x-1'
                  }`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
          <textarea
            value={editData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Enter agency description..."
          />
        </div>

        {/* Occupancy Towns */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Occupancy Towns ({editData.towns.length.toString().padStart(2, '0')})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {agency.towns.map((town) => (
              <button
                key={town}
                onClick={() => toggleTown(town)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${editData.towns.includes(town)
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {town}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">Contact Information</label>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-purple-600 mt-2" />
              <input
                type="text"
                value={editData.contactInfo.website}
                onChange={(e) => handleContactChange('website', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="www.example.com"
              />
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-purple-600 mt-2" />
              <input
                type="text"
                value={editData.contactInfo.phone}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="+237xxxxxxxxx"
              />
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-purple-600 mt-2" />
              <input
                type="email"
                value={editData.contactInfo.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="contact@example.com"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${hasUnsavedChanges
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            <Save size={16} />
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditView;