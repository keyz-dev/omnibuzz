import React from "react";
import { Table, StatusPill, DropdownMenu, UserInfo } from "../../../ui";
import { Edit, Trash2, Send } from "lucide-react";
import { format } from "date-fns";

const WorkerListView = ({
  workers,
  onEdit,
  onDelete,
  onResendInvite,
  loading,
}) => {
  const getStatusText = (row) => {
    if (row.isActive) return "Active";
    if (row.invitationToken) return "Invited";
    return "Inactive";
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "user.fullName",
        Cell: ({ row }) => <UserInfo user={row.user} />,
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ row }) => (
          <span className="capitalize">{row.role?.replace("_", " ")}</span>
        ),
      },
      {
        Header: "Assigned Station",
        accessor: "station.name",
        Cell: ({ row }) => row.station?.name || "N/A",
      },
      {
        Header: "Date Added",
        accessor: "joinedAt",
        Cell: ({ row }) => format(new Date(row.joinedAt), "PP"),
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ row }) => {
          const statusText = getStatusText(row);
          return <StatusPill status={statusText} />;
        },
      },
      {
        id: "actions",
        Cell: ({ row }) => {
          const menuItems = [
            {
              label: "Edit Worker",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
            },
          ];

          if (!row.isActive && row.invitationToken) {
            menuItems.push({
              label: "Resend Invite",
              icon: <Send size={16} />,
              onClick: () => onResendInvite(row.id),
            });
          }

          menuItems.push({
            label: "Delete",
            icon: <Trash2 size={16} />,
            onClick: () => onDelete(row),
            isdestructive: "true",
          });

          return <DropdownMenu items={menuItems} />;
        },
      },
    ],
    [onEdit, onDelete, onResendInvite]
  );

  return (
    <Table
      columns={columns}
      data={workers}
      loading={loading}
      emptyStateMessage="No staff members found. Try adjusting your filters or adding a new worker."
    />
  );
};

export default WorkerListView;
