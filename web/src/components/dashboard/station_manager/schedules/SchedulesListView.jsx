import React from "react";
import { Table, StatusPill, DropdownMenu } from "../../../ui";
import { Edit, Trash2 } from "lucide-react";

const SchedulesListView = ({ onEdit, onDelete, loading, schedules }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Route",
        accessor: "route",
        Cell: ({ row }) => {
          console.log(row);

          return (
            <div className="flex flex-col gap-2">
              <span>
                {row.route?.originStation?.name} (
                {row.route?.originStation?.baseTown}) -
              </span>
              <span>
                {row.route?.destinationStation?.name} (
                {row.route?.destinationStation?.baseTown})
              </span>
            </div>
          );
        },
      },
      {
        Header: "Travel Timeline",
        accessor: "departureTime",
        Cell: ({ row }) => {
          const departureTime = row.departureTime;
          const arrivalTime = row.estimatedArrivalTime;
          return (
            <div className="flex flex-wrap">
              <span>
                {departureTime || "N/A"} - {arrivalTime || "N/A"}
              </span>
            </div>
          );
        },
      },
      {
        Header: "Frequency",
        accessor: "frequency",
        Cell: ({ row }) => (
          <span>
            {row.frequency.charAt(0).toUpperCase() + row.frequency.slice(1) ||
              "N/A"}
          </span>
        ),
      },
      {
        Header: "Bus Type",
        accessor: "busType",
      },
      {
        Header: "Session",
        accessor: "session",
        Cell: ({ row }) => (
          <span>
            {row.session.charAt(0).toUpperCase() + row.session.slice(1) ||
              "N/A"}
          </span>
        ),
      },

      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => <StatusPill status={row.status} />,
      },
      {
        id: "actions",
        Cell: ({ row }) => {
          console.log(row);
          const menuItems = [
            {
              label: "Edit Schedule",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
            },
            {
              label: "Delete Schedule",
              icon: <Trash2 size={16} />,
              onClick: () => onDelete(row),
              isDestructive: true,
            },
          ];
          return <DropdownMenu items={menuItems} />;
        },
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <Table
      columns={columns}
      data={schedules}
      isLoading={loading}
      emptyStateMessage="No schedules found. Try adjusting your filters or adding a new schedule."
    />
  );
};

export default SchedulesListView;
