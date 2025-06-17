import React from "react";
import { X } from "lucide-react";

const ContactModal = ({ isOpen, onClose, onAdd }) => {
  const contactTypes = [
    { id: "business-email", label: "Business Email", type: "email" },
    { id: "phone", label: "Phone Number", type: "tel" },
    { id: "whatsapp", label: "WhatsApp", type: "tel" },
    { id: "website", label: "Website URL", type: "url" },
  ];

  const handleContactTypeSelect = (contactType) => {
    onAdd(contactType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center p-4 z-10"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Contact Information
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {contactTypes.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleContactTypeSelect(contact)}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
            >
              {contact.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
