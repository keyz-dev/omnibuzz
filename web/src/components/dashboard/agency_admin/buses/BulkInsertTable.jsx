import React from "react";
import { Card, Table, Button, StatusPill } from "../../../ui";
import { StationSelector } from "./";

const BulkInsertTable = ({
  buses,
  handleImport,
  loading,
  stations = [],
  selectedStation,
  onStationChange,
}) => {
  const columns = [
    {
      Header: "Plate Number",
      accessor: "plateNumber",
      Cell: ({ row }) => {
        return <span className="font-medium">{row.plateNumber}</span>;
      },
    },
    {
      Header: "Type",
      accessor: "busType",
      Cell: ({ row }) => <span className="text-gray-600">{row.busType}</span>,
    },
    {
      Header: "Capacity",
      accessor: "capacity",
      Cell: ({ row }) => <span className="text-gray-600">{row.capacity}</span>,
    },
    {
      Header: "Seat Layout",
      accessor: "seatLayout",
      Cell: ({ row }) => (
        <span className="text-gray-600">{row.seatLayout}</span>
      ),
    },
    {
      Header: "Amenities",
      accessor: "amenities",
      Cell: ({ row }) => (
        <span className="text-gray-600">{row.amenities.join(", ")}</span>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ row }) => <StatusPill status={row.status || "inactive"} />,
    },
  ];

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Preview ({buses.length} Buses)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table columns={columns} data={buses.slice(0, 5)} />
        </div>

        {buses.length > 5 && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            ... and {buses.length - 5} more buses
          </p>
        )}

        {/* Station Selector */}
        <div className="mt-6">
          <StationSelector
            stations={stations}
            selectedStation={selectedStation}
            onStationChange={onStationChange}
            loading={loading}
          />
        </div>
        <div className="flex justify-end mt-6">
          <Button
            onClickHandler={handleImport}
            isLoading={loading}
            isDisabled={loading || buses.length === 0 || !selectedStation}
            additionalClasses="primarybtn"
          >
            {loading ? "Importing..." : `Import ${buses.length} Buses`}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BulkInsertTable;
