import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../stateManagement/contexts/dashboard/AdminContext';
import { Card, Loader, Button } from '../../components/ui';

import { DocumentStats, DocumentFilters, DocumentsTable, RejectDocumentModal } from '../../components/dashboard/system_admin/documents';
import { toast } from 'react-toastify';

const Documents = () => {
    const {
        documents,
        documentStats,
        loading,
        fetchDocuments,
        fetchDocumentStats,
        approveDocument,
        rejectDocument,
        addRemark,
        successMessage,
        setSuccessMessage,
    } = useAdmin();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRemarkModalOpen, setIsRemarkModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [remark, setRemark] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        agency: '',
        dateRange: ''
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
        }
    }, [successMessage]);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const fetchFilteredDocuments = useCallback(() => {
        const activeFilters = { ...filters };
        if (debouncedSearchTerm) {
            activeFilters.query = debouncedSearchTerm;
        }
        for (const key in activeFilters) {
            if (activeFilters[key] === '') delete activeFilters[key];
        }
        fetchDocuments(activeFilters);
    }, [filters, debouncedSearchTerm, fetchDocuments]);

    useEffect(() => {
        fetchFilteredDocuments();
    }, []);

    useEffect(() => {
        fetchDocumentStats();
    }, []);

    const handleOpenRejectModal = (doc) => {
        setSelectedDoc(doc);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
        setRemark('');
    };

    const handleRejectSubmit = () => {
        if (selectedDoc) {
            rejectDocument(selectedDoc, remark);
        }
        handleCloseModal();
    };

    const handleOpenRemarkModal = (doc) => {
        setSelectedDoc(doc);
        setIsRemarkModalOpen(true);
    };

    const handleRemarkSubmit = () => {
        addRemark(selectedDoc, remark);
        handleCloseRemarkModal();
    };

    const handleCloseRemarkModal = () => {
        setIsRemarkModalOpen(false);
        setSelectedDoc(null);
        setRemark('');
    };

    if (loading && documents.length === 0) {
        return <div className="w-full h-full flex items-center justify-center"><Loader size={35} color='#000' /></div>;
    }
    if (documents.length === 0) {
        return <div className="w-full h-full flex items-center justify-center"><p>No documents found</p></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Documents</h1>
                <Button onClick={() => fetchDocuments()}>Refresh</Button>
            </div>
            <DocumentStats stats={documentStats} />

            <Card>
                <DocumentFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                />
                <DocumentsTable
                    documents={documents}
                    isLoading={loading}
                    onApprove={approveDocument}
                    onAddRemark={handleOpenRemarkModal}
                    onOpenRejectModal={handleOpenRejectModal}
                    totalDocuments={documentStats.all}
                />
            </Card>

            <RejectDocumentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleRejectSubmit}
                remark={remark}
                setRemark={setRemark}
            />

            <RejectDocumentModal
                isOpen={isRemarkModalOpen}
                onClose={handleCloseRemarkModal}
                onSubmit={handleRemarkSubmit}
                remark={remark}
                setRemark={setRemark}
            />
        </div>
    );
};
export default Documents;