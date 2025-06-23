import React, { useContext, createContext, useState, useCallback } from 'react'
import { useAgency } from './';
import { stationsAPI } from '../../../../api/agency_admin/stations';

const AgencyStationContext = createContext();

const AgencyStationContextProvider = ({ children }) => {
    const { agencyProfile } = useAgency()
    const [stations, setStations] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const fetchStations = useCallback(async () => {
        if (!agencyProfile?.agency?.id) {
            return;
        }
        setLoading(true);
        const agencyId = agencyProfile.agency.id
        try {
            const response = await stationsAPI.fetchStations(agencyId);
            if (response.success) {
                setStations(response.data);
            } else {
                setStations([]);
                setError(response.message || 'Failed to fetch stations');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [agencyProfile]);



    const value = {
        // state
        stations,
        loading,
        error,
        success,

        // actions
        fetchStations,
        setError,
        setSuccess,
    }
    return (
        <AgencyStationContext.Provider value={value}>
            {children}
        </AgencyStationContext.Provider>
    )
}

export default AgencyStationContextProvider

export const useAgencyStation = () => {
    const context = useContext(AgencyStationContext)
    if (!context) {
        throw new Error("useAgencyStation must be used within a AgencyStationContextProvider")
    }
    return context
};
