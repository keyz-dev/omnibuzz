import React from 'react';
import { MapPin, Edit3 } from 'lucide-react';
import AgencyOverviewContacts from '../../agency/overview/AgencyOverviewContacts';
import { LeafletMapView } from '../../maps/leaflet';

const ProfileMapView = ({ agency, publishStatus, handlePublishStatusChange, handleEdit }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Agency Info Card */}
      <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white mb-4">
              {agency.logo ? (
                <img
                  src={
                    typeof agency.logo === "string"
                      ? agency.logo
                      : URL.createObjectURL(agency.logo)
                  }
                  alt="Agency Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{agency.name ? agency.name[0] : "A"}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{agency.name}</h2>
              <p className="text-sm text-gray-500 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{agency.id}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Publish Status</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePublishStatusChange}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${publishStatus ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${publishStatus ? 'translate-x-5' : 'translate-x-1'
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
          <h3 className="text-sm font-medium text-gray-900 mb-3">Occupancy Towns ({agency.towns.length})</h3>
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
          <AgencyOverviewContacts
            contactInfo={Object.entries(agency.contactInfo).map(([key, value]) => {
              let type;
              switch (key) {
                case 'website': type = 'url'; break;
                case 'phone': type = 'tel'; break;
                case 'email': type = 'email'; break;
                case 'whatsapp': type = 'whatsapp'; break;
                default: return null;
              }
              return { type, value };
            }).filter(Boolean).filter(c => c.value)}
            isEditable={false}
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
        <div className="absolute top-4 left-[50%] z-10 translate-x-[-50%]">
          <div className="bg-accent px-3 py-2 rounded-md shadow-md flex items-center gap-2">
            <MapPin size={16} className="text-white" />
            <span className="text-sm font-normal text-white">{agency.name}</span>
          </div>
        </div>
        <LeafletMapView coordinates={agency.coordinates} address={agency.headAddress} />
      </div>
    </div>
  );
};

export default ProfileMapView;