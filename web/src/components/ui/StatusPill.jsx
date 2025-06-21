import React from 'react';

const StatusPill = ({ status }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    approved: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const text = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
      {text}
    </div>
  );
};

export default StatusPill;
