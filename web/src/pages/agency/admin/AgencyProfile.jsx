import React, { useState, useEffect } from 'react';
import { useAgency } from '../../../stateManagement/contexts/dashboard/index'
import { Loader } from '../../../components/ui'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProfileMapView from '../../../components/dashboard/agency_admin/ProfileMapView';
import ProfileEditView from '../../../components/dashboard/agency_admin/ProfileEditView';
import { SecurityNotice } from '../../../components/ui';

const AgencyProfile = () => {
  // View state
  const navigate = useNavigate()
  const { agencyProfile, loading } = useAgency();
  const [currentView, setCurrentView] = useState('map');
  const [publishStatus, setPublishStatus] = useState(false);

  // Form state
  const [editData, setEditData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!loading && !agencyProfile) {
      navigate("/agency/admin");
    }
    if (agencyProfile) {
      setEditData(agencyProfile.agency);
    }
  }, [loading, agencyProfile, navigate]);

  if (loading || !agencyProfile || !editData) return <Loader />;

  const { agency } = agencyProfile;

  const handleEdit = () => {
    setCurrentView('edit');
    setEditData(agency);
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    // Here you would typically call an API to save the data
    // For now, we just switch the view
    setCurrentView('map');
    setHasUnsavedChanges(false);
    // You might want to update the main agencyProfile state here
  };

  const handlePublishStatusChange = () => {
    if (agencyProfile.isPublishable) {
      setPublishStatus(!publishStatus);
    } else {
      toast.error("Agency is not publishable");
    }
  };

  const handleCancel = () => {
    setCurrentView('map');
    setEditData(agency); // Reset changes
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

  return (
    <section>
      {!agencyProfile.isPublishable && (
        <button className="mb-4 w-full md:w-auto">
          <SecurityNotice
            title="Complete Required Steps"
            description="Complete all required steps to publish your agency profile"
            action={() => navigate("/agency/admin/profile-completion")}
          />
        </button>
      )}
      <div className="">
        {currentView === 'map' ? (
          <ProfileMapView
            agency={agency}
            publishStatus={publishStatus}
            handlePublishStatusChange={handlePublishStatusChange}
            handleEdit={handleEdit}
          />
        ) : (
          <ProfileEditView
            agency={agency}
            editData={editData}
            publishStatus={publishStatus}
            setPublishStatus={setPublishStatus}
            handleInputChange={handleInputChange}
            toggleTown={toggleTown}
            handleContactChange={handleContactChange}
            handleSave={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
            handleCancel={handleCancel}
          />
        )}
      </div>
    </section>
  );
};

export default AgencyProfile;