import React from 'react';
import { Button, TextArea } from '../../../ui';
import { X, Send } from 'lucide-react';

const RejectDocumentModal = ({ isOpen, onClose, onSubmit, remark, setRemark }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-1 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white rounded-sm shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Add a Remark</h3>

                    <Button
                        additionalClasses='min-w-fit min-h-fit p-0'
                        onClickHandler={onClose}><X size={20} /></Button>
                </div>
                <TextArea
                    value={remark}
                    onChangeHandler={(e) => setRemark(e.target.value)}
                    placeholder="Add a remark about the document"
                    rows={5}
                />
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={remark.length === 0}
                        className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xs 
                        text-white disabled:text-placeholder font-semibold transition-colors disabled:bg-light_bg disabled:cursor-not-allowed bg-success hover:bg-success/80"
                    >
                        <Send size={20} />
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RejectDocumentModal;