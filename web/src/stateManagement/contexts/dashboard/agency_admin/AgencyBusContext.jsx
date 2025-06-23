import React, { createContext, useContext, useState, useCallback } from 'react';
import { busesAPI } from '../../../../api/agency_admin/buses';
import { useAgency } from './';

const AgencyBusContext = createContext();

const AgencyBusProvider = ({ children }) => {
    const { agencyProfile } = useAgency()
    const [buses, setBuses] = useState([]);
    const [bus, setBus] = useState(null);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0 });
    const [busStats, setBusStats] = useState({ total: 0, active: 0, available: 0, maintenance: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    const fetchBuses = useCallback(async (page = 1, filters = {}) => {
        if (!agencyProfile?.agency?.id) return;
        setLoading(true);
        clearMessages();
        try {
            const data = await busesAPI.fetchBuses(agencyProfile.agency.id, page, filters);
            setBuses(data.buses);
            setPagination(data.pagination);
            return data;
        } catch (err) {
            setError(err.message || 'Failed to fetch buses.');
        } finally {
            setLoading(false);
        }
    }, [agencyProfile]);

    const getBus = useCallback(async (busId) => {
        setLoading(true);
        clearMessages();
        try {
            const data = await busesAPI.getBus(busId);
            setBus(data);
            return data;
        } catch (err) {
            setError(err.message || 'Failed to fetch bus details.');
        } finally {
            setLoading(false);
        }
    }, []);

    const createBus = useCallback(async (busData) => {
        if (!agencyProfile?.agency?.id) return;
        setLoading(true);
        clearMessages();
        try {
            const payload = { ...busData, agencyId: agencyProfile.agency.id };
            const newBus = await busesAPI.createBus(payload);
            setSuccess('Bus created successfully!');
            await Promise.all([fetchBuses(pagination.currentPage), fetchBusStats()]);
            return { success: true, data: newBus };
        } catch (err) {
            setError(err.message || 'Failed to create bus.');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchBuses, agencyProfile]);

    const updateBus = useCallback(async (busId, busData) => {
        setLoading(true);
        clearMessages();
        try {
            const updatedBus = await busesAPI.updateBus(busId, busData);
            setSuccess('Bus updated successfully!');
            await fetchBuses(pagination.currentPage); // Refresh list
            return { success: true, data: updatedBus };
        } catch (err) {
            setError(err.message || 'Failed to update bus.');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchBuses, pagination.currentPage]);

    const deleteBus = useCallback(async (busId) => {
        setLoading(true);
        clearMessages();
        try {
            await busesAPI.deleteBus(busId);
            setSuccess('Bus deleted successfully!');
            await Promise.all([fetchBuses(pagination.currentPage), fetchBusStats()]);
            return { success: true };
        } catch (err) {
            setError(err.message || 'Failed to delete bus.');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchBuses]);

    const bulkInsertBuses = useCallback(async (busesData) => {
        if (!agencyProfile?.agency?.id) return;
        setLoading(true);
        clearMessages();
        try {
            const result = await busesAPI.bulkInsertBuses(agencyProfile.agency.id, busesData);
            setSuccess(result.message || 'Buses inserted successfully!');
            await fetchBuses(); // Refresh the list
            return { success: true, data: result };
        } catch (err) {
            setError(err.message || 'Failed to bulk insert buses.');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [fetchBuses, agencyProfile]);

    const fetchBusStats = useCallback(async () => {
        if (!agencyProfile?.agency?.id) return;
        setLoading(true);
        try {
            const data = await busesAPI.fetchBusStats(agencyProfile.agency.id);
            setBusStats(data.stats);
        } catch (err) {
            setError(err.message || 'Failed to fetch bus stats.');
        } finally {
            setLoading(false);
        }
    }, [agencyProfile]);

    const value = {
        // state
        buses,
        bus,
        pagination,
        busStats,
        loading,
        error,
        success,

        // actions
        fetchBuses,
        getBus,
        createBus,
        updateBus,
        deleteBus,
        bulkInsertBuses,
        fetchBusStats,
        setError,
        setSuccess,
    };

    return (
        <AgencyBusContext.Provider value={value}>
            {children}
        </AgencyBusContext.Provider>
    );
};

export default AgencyBusProvider;

export const useAgencyBuses = () => {
    const context = useContext(AgencyBusContext);
    if (!context) {
        throw new Error('useAgencyBuses must be used within an AgencyBusProvider');
    }
    return context;
};
