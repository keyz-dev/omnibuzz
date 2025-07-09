import React from "react";
import { Table, StatusPill, DropdownMenu } from "../../../ui";
import { Edit, Trash2 } from "lucide-react";

const RoutesListView = ({ routes, onEdit, onDelete }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Origin",
        accessor: "from",
        Cell: ({ row }) => (
          <span>
            {row.originStation?.name} ({row.originStation?.baseTown})
          </span>
        ),
      },
      {
        Header: "Destination",
        accessor: "to",
        Cell: ({ row }) => (
          <span>
            {row.destinationStation?.name} ({row.destinationStation?.baseTown})
          </span>
        ),
      },
      {
        Header: "Price (XAF)",
        accessor: "price",
        Cell: ({ row }) => row.basePrice?.toLocaleString(),
      },
      {
        Header: "Distance (Km)",
        accessor: "distance",
        Cell: ({ row }) => row.distance,
      },
      {
        Header: "Duration (H)",
        accessor: "duration",
        Cell: ({ row }) => row.estimatedDuration,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => <StatusPill status={row.status} />,
      },
      {
        id: "actions",
        Cell: ({ row }) => {
          const menuItems = [
            {
              label: "Edit Route",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
            },
            {
              label: "Delete",
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
      data={routes}
      emptyStateMessage="No routes found. Try adjusting your filters or adding a new route."
    />
  );
};

export default RoutesListView;
