import React from 'react';
import { SearchBar, FilterDropdown } from '../../../ui';

const DocumentFilters = ({ searchTerm, setSearchTerm, filters, handleFilterChange }) => {
    const dateRangeOptions = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'Last 7 Days' },
        { value: 'month', label: 'Last 30 Days' },
    ];

    const agencyOptions = [
        { value: 'General Express Voyage', label: 'General Express Voyage' },
        { value: 'Sama Voyage', label: 'Sama Voyage' },
    ];

    const statusOptions = [
        { value: 'approved', label: 'Approved' },
        { value: 'pending', label: 'Pending' },
        { value: 'rejected', label: 'Rejected' },
    ];

    return (
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-200">
            <div className="w-full md:w-auto">
                <SearchBar
                    placeholder="Search Documents..."
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <FilterDropdown
                    label="Date Range"
                    options={dateRangeOptions}
                    selected={filters.dateRange}
                    setSelected={(value) => handleFilterChange('dateRange', value)}
                />
                <FilterDropdown
                    label="Agency"
                    options={agencyOptions}
                    selected={filters.agency}
                    setSelected={(value) => handleFilterChange('agency', value)}
                />
                <FilterDropdown
                    label="Status"
                    options={statusOptions}
                    selected={filters.status}
                    setSelected={(value) => handleFilterChange('status', value)}
                />
            </div>
        </div>
    );
};

export default DocumentFilters;