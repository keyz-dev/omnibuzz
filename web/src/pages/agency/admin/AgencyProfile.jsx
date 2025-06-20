import React, { useState } from 'react';
import { MapPin, Globe, Phone, Mail, Edit3, Save, X } from 'lucide-react';
import { useAgency } from '../../../stateManagement/contexts/dashboard/index'
import { Loader } from '../../../components/ui'
import { useNavigate } from 'react-router-dom';

const AgencyProfile = () => {
  // View state
  const navigate = useNavigate()
  const { agencyProfile , loading } = useAgency();
  const [currentView, setCurrentView] = useState('map');
  const [publishStatus, setPublishStatus] = useState(false);

  // Form state
  const [editData, setEditData] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  if( loading ) return <Loader />;
  const {agency} = !agencyProfile
  
  if (!agency) navigate("/agency/admin");

  const handleEdit = () => {
    setCurrentView('edit');
    setEditData(agency);
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    // setAgency(editData);
    setCurrentView('map');
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    setCurrentView('map');
    setEditData(agency);
    setHasUnsavedChanges(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleContactChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const toggleTown = (town) => {
    setEditData(prev => ({
      ...prev,
      towns: prev.towns.includes(town)
        ? prev.towns.filter(t => t !== town)
        : [...prev.towns, town]
    }));
    setHasUnsavedChanges(true);
  };

  const MapView = () => (
    <div className="flex gap-6">
      {/* Agency Info Card */}
      <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-600 rounded flex items-center justify-center">
              <img src={agency.logo} alt="Agency Logo" />
              <span className="text-white font-bold text-lg">GV</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{agency.name}</h2>
              <p className="text-sm text-gray-500">{agency.id}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Publish Status</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPublishStatus(!publishStatus)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    publishStatus ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    publishStatus ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Edit3 size={16} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{agency.description}</p>
        </div>

        {/* Occupancy Towns */}
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Occupancy Towns (07)</h3>
          <div className="flex flex-wrap gap-2">
            {agency.towns.map((town) => (
              <span
                key={town}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {town}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-purple-600" />
              <a href={`https://${agency.contactInfo.website}`} className="text-purple-600 text-sm hover:underline">
                {agency.contactInfo.website}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-purple-600" />
              <span className="text-gray-600 text-sm">{agency.contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-purple-600" />
              <a href={`mailto:${agency.contactInfo.email}`} className="text-purple-600 text-sm hover:underline">
                {agency.contactInfo.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">General Express, Bonaneri, Douala, Cameroon</span>
          </div>
        </div>
        
        {/* Mock Map */}
        <div className="w-full h-full bg-gradient-to-br from-green-100 via-blue-50 to-blue-100 relative">
          {/* Mock map elements */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 800 600" className="w-full h-full">
              <path d="M100,100 Q200,50 300,100 T500,150 Q600,200 700,150" stroke="#10b981" strokeWidth="2" fill="none" />
              <path d="M50,200 Q150,180 250,220 T450,250 Q550,280 650,250" stroke="#3b82f6" strokeWidth="2" fill="none" />
              <circle cx="300" cy="200" r="3" fill="#ef4444" />
              <circle cx="400" cy="180" r="2" fill="#6366f1" />
              <circle cx="500" cy="220" r="2" fill="#8b5cf6" />
            </svg>
          </div>
          
          {/* Location marker */}
          <div className="absolute left-1/3 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPin size={16} className="text-white" />
            </div>
          </div>
          
          {/* Mock location labels */}
          <div className="absolute top-20 left-20 text-xs font-medium text-gray-600 bg-white/80 px-2 py-1 rounded">
            Bafussam
          </div>
          <div className="absolute top-32 right-32 text-xs font-medium text-gray-600 bg-white/80 px-2 py-1 rounded">
            Maroua
          </div>
          <div className="absolute bottom-24 left-24 text-xs font-medium text-gray-600 bg-white/80 px-2 py-1 rounded">
            Kribi
          </div>
        </div>
      </div>
    </div>
  );

  const EditView = () => (
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
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  publishStatus ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  publishStatus ? 'translate-x-5' : 'translate-x-1'
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
          <div className="grid grid-cols-3 gap-2">
            {agency.towns.map((town) => (
              <button
                key={town}
                onClick={() => toggleTown(town)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  editData.towns.includes(town)
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
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              hasUnsavedChanges
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {currentView === 'map' ? <MapView /> : <EditView />}

   </div>
  );
};

export default AgencyProfile;