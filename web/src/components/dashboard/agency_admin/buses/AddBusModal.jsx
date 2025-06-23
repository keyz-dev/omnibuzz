import React, { useState, useEffect } from 'react';
import { useAgency } from '../../../../stateManagement/contexts/dashboard/agency_admin';
import { Input, Button } from '../../../ui';

const AMENITIES_LIST = ['Wi-Fi', 'AC', 'Power Outlet', 'Restroom', 'TV'];

const AddBusModal = ({ onClose }) => {
    const { addBus, stations, fetchStations, loading, error } = useAgency();
    const [formData, setFormData] = useState({
        plateNumber: '',
        busType: 'Standard',
        capacity: '',
        seatLayout: '3x2',
        baseStationId: '',
        amenities: [],
    });

    useEffect(() => {
        if (stations.length === 0) {
            fetchStations();
        }
    }, [stations, fetchStations]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAmenityChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const amenities = checked
                ? [...prev.amenities, value]
                : prev.amenities.filter(a => a !== value);
            return { ...prev, amenities };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await addBus(formData);
        if (result.success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Add a new bus to your agency</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-error text-xs mt-1 mb-4">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            name="plateNumber"
                            label="Plate Number"
                            value={formData.plateNumber}
                            onChangeHandler={handleChange}
                            required
                        />
                        <SelectField
                            name="busType"
                            label="Bus Type *"
                            value={formData.busType}
                            onChange={handleChange}
                            options={['Classic', 'VIP', 'Standard']}
                            required
                        />
                        <Input
                            name="capacity"
                            label="Capacity"
                            type="number"
                            value={formData.capacity}
                            onChangeHandler={handleChange}
                            required
                        />
                        <SelectField
                            name="seatLayout"
                            label="Seat Layout *"
                            value={formData.seatLayout}
                            onChange={handleChange}
                            options={['3x2', '2x2', '2x1']}
                            required
                        />
                        <SelectField
                            name="baseStationId"
                            label="Assign to a station *"
                            value={formData.baseStationId}
                            onChange={handleChange}
                            options={stations.map(s => ({ value: s.id, label: s.name }))}
                            required
                        />
                    </div>

                    <div className="mt-6">
                        <label className="block text-base font-medium text-black px-2 mb-2">Amenities</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {AMENITIES_LIST.map(amenity => (
                                <label key={amenity} className="flex items-center space-x-2">
                                    <input type="checkbox" value={amenity} onChange={handleAmenityChange} className="rounded text-accent focus:ring-accent" />
                                    <span>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-8 gap-4">
                        <Button onClickHandler={onClose} additionalClasses="bg-gray-200 text-gray-800 hover:bg-gray-300">
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading} isDisabled={loading} additionalClasses="bg-accent text-white hover:bg-accent-dark">
                            Add Bus
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Styled Select component to match the app's UI
const SelectField = ({ label, options, ...props }) => (
    <div className="w-full flex flex-col">
        <label htmlFor={props.id || props.name} className="block default_transition transform text-base font-medium text-primary z-0 px-2">
            {label}
        </label>
        <select
            {...props}
            className="bg-light_bg outline-none p-2 w-full border-2 border-light_bg focus:border-accent default_transition text-secondary text-md duration-600 rounded-xs mt-1"
        >
            <option value="" disabled>Select an option</option>
            {options.map(opt => (
                typeof opt === 'object'
                    ? <option key={opt.value} value={opt.value}>{opt.label}</option>
                    : <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

export default AddBusModal;
