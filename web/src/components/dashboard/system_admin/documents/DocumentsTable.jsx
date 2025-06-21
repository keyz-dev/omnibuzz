import React from 'react';
import { Table, Button, StatusPill, DropdownMenu } from '../../../ui';
import { FileText, Eye, Download, Check, X, Reply } from 'lucide-react';

const DocumentsTable = ({ documents, isLoading, onApprove, onAddRemark, onOpenRejectModal, totalDocuments }) => {
    const imagePlaceholder = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'

    const matchedDocumentTypes = {
        "business_registration": "Business Registration",
        "tax_clearance": "Tax Clearance",
        "operating_license": "Operating License",
        "insurance_certificate": "Insurance Certificate",
        "safety_certificate": "Safety Certificate",
        "vehicle_registration": "Vehicle Registration",
        "driver_license": "Driver License",
        "other": "Other"
    }

    const columns = [
        {
            Header: 'Document',
            accessor: 'document',
            Cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-3 min-w-[250px]">
                        <div className="w-10 h-10 bg-gray-100 rounded-md grid place-items-center flex-shrink-0">
                            {/* TODO: Implement dynamic icons based on fileType */}
                            <FileText size={20} className="text-gray-500" />
                        </div>
                        <div>
                            <p className="font-medium text-secondary truncate">{row.fileName}</p>
                            <p className="text-sm text-gray-500">{row.fileType}</p>
                        </div>
                    </div>
                )
            }
        },
        {
            Header: 'Type',
            accessor: 'type',
            Cell: ({ row }) => {
                return (
                    <p className="font-semibold text-secondary  truncate">{matchedDocumentTypes[row.type]}</p>
                )
            }
        },
        {
            Header: 'Agency / Admin',
            accessor: 'agency.name',
            Cell: ({ row }) => {
                return (
                    <div className="flex items-center">
                        <img className="h-8 w-8 rounded-full" src={row.agency?.avatar || imagePlaceholder} alt="Manager" />
                        <div className="ml-3 flex flex-col gap-2">
                            <div className="text-sm font-medium text-primary">{row.agency?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{row.agency ? row.agency?.owner?.email || '' : ''}</div>
                        </div>
                    </div>
                )
            },
        },

        { Header: 'Upload Date', accessor: 'createdAt' },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => {
                return <StatusPill status={row.status || "pending"} />
            }
        },
        {
            accessor: 'actions',
            Cell: ({ row }) => {
                const items = [
                    { label: 'Preview', icon: <Eye size={16} />, onClick: () => window.open(row.url, '_blank') },
                    { label: 'Download', icon: <Download size={16} />, onClick: () => window.open(row.url, '_blank') },

                    { label: 'Approve', icon: <Check size={16} />, onClick: () => onApprove(row.id) },
                    { label: 'Add Remark', icon: <Reply size={16} />, onClick: () => onAddRemark(row.id) },

                    { label: 'Reject', icon: <X size={16} />, onClick: () => onOpenRejectModal(row.id), isDestructive: true },
                ];
                return <DropdownMenu items={items} />;
            }
        },
    ];

    return (
        <>
            <div className="">
                <Table columns={columns} data={documents} isLoading={isLoading} />
            </div>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">Showing 1 - {documents.length} of {totalDocuments} Documents</p>
                <div className="flex gap-2">
                    <Button variant="outline">Previous</Button>
                    <Button>Next</Button>
                </div>
            </div>
        </>
    );
};

export default DocumentsTable;