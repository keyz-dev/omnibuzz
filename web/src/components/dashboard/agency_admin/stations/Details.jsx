import React from 'react';
import { Button } from '../../../ui';
import { ArrowLeft, Globe, Phone, Mail, Edit, MapPin } from 'lucide-react';
import Card from '../../../ui/Card';

const Details = ({ station, setView }) => {

    const getContactIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'whatsapp':
            case 'phone':
                return <Phone size={16} className="mr-2" />;
            case 'email':
                return <Mail size={16} className="mr-2" />;
            case 'website':
                return <Globe size={16} className="mr-2" />;
            default:
                return null;
        }
    };

    const getContactLink = (contact) => {
        switch (contact.type?.toLowerCase()) {
            case 'whatsapp':
                return `https://wa.me/${contact.value.replace(/\+/g, '')}`;
            case 'phone':
                return `tel:${contact.value}`;
            case 'email':
                return `mailto:${contact.value}`;
            case 'website':
                return `http://${contact.value}`;
            default:
                return '#';
        }
    };

    if (!station) {
        return <div>Loading station details...</div>; // Or some other placeholder
    }

    return (
        <div className="">
            <div className="flex justify-start items-center mb-6">
                <Button
                    onClickHandler={() => setView('main')}
                    additionalClasses="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Stations
                </Button>

                {/* <Button
                    // onClickHandler={() => openEditModal(station)}
                    additionalClasses="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    <Edit size={16} className="mr-2" />
                    Edit Station
                </Button> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex flex-row items-start justify-between p-6">
                            <div className="flex items-start">
                                {/* The station object from screenshot does not have a logo, so it's removed. */}
                                <div>
                                    <h2 className="text-2xl font-bold">{station.name}</h2>
                                    <p className="text-sm text-gray-500">ID: {station.id}</p>
                                </div>
                            </div>
                            <span
                                className={`px-3 py-1 text-sm rounded-full ${station.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {station.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold">{station.totalBookings || 0}</p>
                                    <p className="text-sm text-gray-500">Total Bookings</p>
                                </div>
                            </div>

                            <Button
                                additionalClasses="w-full md:w-auto mb-6 border border-gray-300 text-gray-700 hover:bg-gray-100"

                            >
                                <MapPin size={16} className="mr-2" />
                                View On Map
                            </Button>

                            <div>
                                <h3 className="font-semibold mb-2">Destination Towns ({(station.destinations || []).length})</h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(station.destinations || []).map(town => (
                                        <span key={town} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">{town}</span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Contact Information</h3>
                                <div className="space-y-2">
                                    {(station.contactInfo || []).map((contact, index) => (
                                        <a key={index} href={getContactLink(contact)} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                                            {getContactIcon(contact.type)} {contact.value}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-line_clr">
                                <h3 className="font-semibold mb-4">Station Manager</h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <img src={station.manager?.avatar} alt="Manager" className="w-12 h-12 rounded-full mr-4" />
                                        <div>
                                            <p className="font-semibold">{station.manager?.fullName}</p>
                                            <p className="text-sm text-gray-500">{station.manager?.email}</p>
                                        </div>
                                    </div>
                                    <a href={`mailto:${station.manager?.email}`}>
                                        <Button
                                            additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-100"
                                        >
                                            <Mail size={16} className="mr-2" />
                                            Contact
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1">
                    {station.images && station.images.length > 0 && (
                        <div className="grid gap-4">
                            <img src={station.images[0]} alt="Bus" className="w-full h-auto rounded-lg object-cover aspect-[4/3]" />
                            <div className="grid grid-cols-3 gap-4">
                                {station.images.slice(1).map((img, index) => (
                                    <img key={index} src={img} alt={`Bus thumbnail ${index + 1}`} className="w-full h-auto rounded-lg object-cover aspect-square" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Details;