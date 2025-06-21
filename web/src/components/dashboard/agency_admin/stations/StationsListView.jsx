import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, MapPin } from 'lucide-react';
import Table from '../../../ui/Table';
import StatusPill from '../../../ui/StatusPill';
import DropdownMenu from '../../../ui/DropdownMenu';

const StationsListView = ({ stations }) => {
  const navigate = useNavigate();

  const imagePlaceholder = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <MapPin size={20} className="text-gray-500" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.name}</div>
            <div className="text-sm text-gray-500">{row.baseTown}, {row.address?.region}</div>
          </div>
        </div>
      ),
    },
    {
      Header: 'Manager',
      accessor: 'manager',
      Cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <img className="h-8 w-8 rounded-full" src={row.manager?.avatar || imagePlaceholder} alt="Manager" />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{row.manager?.name || 'N/A'}</div>
              <div className="text-sm text-gray-500">{row.manager?.email || ''}</div>
            </div>
          </div>
        )
      },
    },
    {
      Header: 'Active Routes',
      accessor: 'activeRoutes',
      Cell: ({ row }) => <div className="text-center">{row?.activeRoutes || 0}</div>,
    },
    {
      Header: 'Total Bookings',
      accessor: 'totalBookings',
      Cell: ({ row }) => <div className="text-center">{row?.totalBookings || 0}</div>,
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }) => <StatusPill status={row.status || 'inactive'} />,
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => {
        const menuItems = [
          {
            label: 'View Details',
            icon: <Eye size={16} />,
            onClick: () => navigate(`/agency/admin/stations/${row.id}`),
          },
          {
            label: 'Edit',
            icon: <Edit size={16} />,
            onClick: () => navigate(`/agency/admin/stations/${row.id}/edit`),
          },
          {
            label: 'Invalidate',
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
  ];

  return <Table columns={columns} data={stations} />;
};

export default StationsListView;
