import React from 'react'
import { Card, Table, Button } from '../../../ui';

const BulkInsertTable = ({ buses, handleImport, loading }) => {
    const columns = [
        {
            Header: 'Plate Number',
            accessor: 'plateNumber',
            Cell: ({ row }) => {
                console.log("Plate Number: ", row)
                return <span className="font-medium">{row.plateNumber}</span>
            }
        },
        {
            Header: 'Base Station',
            accessor: 'baseStationId',
            Cell: ({ row }) => <span className="text-gray-600">{row.baseStationId}</span>
        },
        {
            Header: 'Type',
            accessor: 'busType',
            Cell: ({ row }) => <span className="text-gray-600">{row.busType}</span>
        },
        {
            Header: 'Capacity',
            accessor: 'capacity',
            Cell: ({ row }) => <span className="text-gray-600">{row.capacity}</span>
        },
        {
            Header: 'Seat Layout',
            accessor: 'seatLayout',
            Cell: ({ row }) => <span className="text-gray-600">{row.seatLayout}</span>
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                    {row.status}
                </span>
            )
        },
    ];

    return (
        <Card>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Preview ({buses.length} Buses)</h2>
                </div>

                <div className="overflow-x-auto">
                    <Table columns={columns} data={buses.slice(0, 10)} />
                </div>

                {buses.length > 10 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        ... and {buses.length - 10} more buses
                    </p>
                )}

                <div className="flex justify-end mt-6">
                    <Button
                        onClickHandler={handleImport}
                        isLoading={loading}
                        isDisabled={loading || buses.length === 0}
                        additionalClasses="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2"
                    >
                        {loading ? 'Importing...' : `Import ${buses.length} Buses`}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default BulkInsertTable