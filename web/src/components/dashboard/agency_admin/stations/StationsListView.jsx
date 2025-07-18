import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2, MapPin, UserPlus } from "lucide-react";
import { Table, StatusPill, DropdownMenu, UserInfo } from "../../../ui";

const StationsListView = ({ stations, setView, setStation, onAddWorker }) => {
  const navigate = useNavigate();
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <MapPin size={20} className="text-gray-500" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {row.name}
              </div>
              <div className="text-sm text-gray-500">
                {row.baseTown}, {row.address?.region}
              </div>
            </div>
          </div>
        ),
      },
      {
        Header: "Manager",
        accessor: "manager",
        Cell: ({ row }) => {
          return <UserInfo user={row.manager} />;
        },
      },
      {
        Header: "Active Routes",
        accessor: "activeRoutes",
        Cell: ({ row }) => (
          <div className="text-center">{row?.activeRoutes || 0}</div>
        ),
      },
      {
        Header: "Total Bookings",
        accessor: "totalBookings",
        Cell: ({ row }) => (
          <div className="text-center">{row?.totalBookings || 0}</div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <StatusPill status={row.isActive ? "active" : "inactive"} />
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const menuItems = [
            {
              label: "View Details",
              icon: <Eye size={16} />,
              onClick: () => {
                setStation(row);
                setView();
              },
            },
            {
              label: "Add worker",
              icon: <UserPlus size={16} />,
              onClick: () => onAddWorker(row),
            },
            {
              label: "Edit",
              icon: <Edit size={16} />,
              onClick: () => navigate(`/agency/admin/stations`),
            },
            {
              label: "Invalidate",
              icon: <Trash2 size={16} />,
              isDestructive: true,
              onClick: () => {
                console.log(`Invalidating station ${row.id}`);
              },
            },
          ];
          return <DropdownMenu items={menuItems} />;
        },
      },
    ],
    []
  );

  return (
    <Table
      columns={columns}
      data={stations}
      emptyStateMessage="No stations found. Try adjusting your filters."
    />
  );
};

export default StationsListView;
