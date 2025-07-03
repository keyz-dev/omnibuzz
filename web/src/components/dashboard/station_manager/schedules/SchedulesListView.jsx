import React from "react";
import { useSchedules } from "../../../../contexts/dashboard/station_manager/SchedulesContext";
import { Table, StatusPill, DropdownMenu } from "../../../ui";
import { Edit, Trash2 } from "lucide-react";

const SchedulesListView = ({ onEdit, onDelete }) => {
  const { schedules, loading } = useSchedules();

  const columns = React.useMemo(
    () => [
      {
        Header: "Route",
        accessor: "route",
        Cell: ({ row }) => <span>{row.original.route?.name || "N/A"}</span>,
      },
      {
        Header: "Departure Time",
        accessor: "departureTime",
      },
      {
        Header: "Frequency",
        accessor: "frequency",
      },
      {
        Header: "Bus Type",
        accessor: "busType",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => <StatusPill status={row.original.status} />,
      },
      {
        id: "actions",
        Cell: ({ row }) => {
          const menuItems = [
            {
              label: "Edit Schedule",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row.original),
            },
            {
              label: "Delete Schedule",
              icon: <Trash2 size={16} />,
              onClick: () => onDelete(row.original),
              isdestructive: "true",
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
