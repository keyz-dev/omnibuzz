import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgency } from '../../../stateManagement/contexts/dashboard';
import { Button } from '../../../components/ui';
import { Map, List } from 'lucide-react';
import StationsListView from '../../../components/dashboard/agency_admin/stations/StationsListView';
import StationsMapView from '../../../components/dashboard/agency_admin/stations/StationsMapView';
import SearchBar from '../../../components/ui/SearchBar';
import FilterDropdown from '../../../components/ui/FilterDropdown';

const Stations = () => {
  const navigate = useNavigate();
  const { stations, loading, error, fetchStations } = useAgency();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!stations || stations.length === 0) {
      fetchStations();
    }
  }, []);

  const filteredStations = (stations || []).filter(station => {
    const stationName = station.name || '';
    const stationAddress = station.address?.fullAddress || '';
    const stationTown = station.address?.town || '';
    const stationStatus = station.status || '';

    const matchesSearch = stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stationAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter ? stationTown === locationFilter : true;
    const matchesStatus = statusFilter ? stationStatus === statusFilter : true;
    
    return matchesSearch && matchesLocation && matchesStatus;
  });

  const locationOptions = stations ? [...new Set(stations.map(s => s.address?.town).filter(Boolean))].map(town => ({ value: town, label: town })) : [];
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-end md:items-center mb-6 gap-4">
        
        <Button
          onClickHandler={() => navigate('/agency/admin/station-setup')}
          additionalClasses="bg-accent text-white"
          leadingIcon="fas fa-plus"
        >
          Add New Station
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto md:flex-1">
             <SearchBar placeholder="Search Stations..." searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <FilterDropdown label="Location" options={locationOptions} selected={locationFilter} setSelected={setLocationFilter} />
            <FilterDropdown label="Status" options={statusOptions} selected={statusFilter} setSelected={setStatusFilter} />
            <div className="flex items-center border border-gray-300 rounded-md self-stretch">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-l-md flex items-center gap-2 text-sm w-full justify-center sm:w-auto ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={16} />
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-r-md flex items-center gap-2 text-sm w-full justify-center sm:w-auto ${viewMode === 'map' ? 'bg-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Map size={16} />
                Map View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading && <div className="p-6 text-center">Loading stations...</div>}
        {error && <div className="p-6 text-center text-red-500">Error: {error}</div>}
        {!loading && !error && (
          viewMode === 'list'
            ? <StationsListView stations={filteredStations} />
            : <StationsMapView stations={filteredStations} />
        )}
      </div>
    </div>
  );
};

export default Stations;