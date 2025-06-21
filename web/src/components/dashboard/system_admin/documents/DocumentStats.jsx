import React from 'react';
import { Card } from '../../../ui';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

const DocumentStats = ({ stats }) => {
    const statItems = [
        {
            label: 'All Documents',
            value: stats.all,
            icon: <FileText size={24} className="text-blue-600" />,
            bgColor: 'bg-blue-100',
        },
        {
            label: 'Pending Review',
            value: stats.pending,
            icon: <Clock size={24} className="text-yellow-600" />,
            bgColor: 'bg-yellow-100',
        },
        {
            label: 'Approved',
            value: stats.approved,
            icon: <CheckCircle size={24} className="text-green-600" />,
            bgColor: 'bg-green-100',
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            icon: <XCircle size={24} className="text-red-600" />,
            bgColor: 'bg-red-100',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((item, index) => (
                <Card key={index} className="p-6 flex items-center gap-4">
                    <div className={`p-3 ${item.bgColor} rounded-full`}>{item.icon}</div>
                    <div>
                        <p className="text-2xl font-bold">{item.value}</p>
                        <p className="text-sm text-gray-500">{item.label}</p>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default DocumentStats;