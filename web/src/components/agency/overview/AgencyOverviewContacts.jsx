import React, { useState } from "react";
import { ContactModal } from "../../ui";

const ICONS = {
  url: <i className="fas fa-globe text-pending1 mr-2"></i>,
  tel: <i className="fas fa-phone text-pending1 mr-2"></i>,
  email: <i className="fas fa-envelope text-pending1 mr-2"></i>,
  whatsapp: <i className="fab fa-whatsapp text-pending1 mr-2"></i>,
};

const typeMap = {
  "Business Email": "email",
  "Phone Number": "tel",
  WhatsApp: "whatsapp",
  "Website URL": "url",
  email: "email",
  tel: "tel",
  url: "url",
  whatsapp: "whatsapp",
};

const AgencyOverviewContacts = ({ contactInfo, setAgencyCreationData, isEditable = true }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleRemoveContact = (idx) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== idx),
    }));
    if (editingIdx === idx) setEditingIdx(null);
  };
  const handleAddContact = (contactType) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      contactInfo: [
        ...(prev.contactInfo || []),
        { type: contactType.type, value: "" },
      ],
    }));
    setTimeout(() => {
      setEditingIdx(contactInfo.length); // focus the new contact
      setEditValue("");
    }, 0);
  };

  const handleEdit = (idx, value) => {
    setEditingIdx(idx);
    setEditValue(value);
  };

  const handleEditSave = (idx) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.map((c, i) =>
        i === idx ? { ...c, value: editValue } : c
      ),
    }));
    setEditingIdx(null);
    setEditValue("");
  };

  return (
    <div>
      <div className="flex items-center gap-2 font-semibold mb-2 text-gray-800">
        Contact Information
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {contactInfo.length > 0 ? (
          contactInfo.map((contact, idx) => (
            <div
              key={idx}
              className="flex items-center bg-purple-50 rounded px-3 py-2 w-fit gap-2"
            >
              {ICONS[typeMap[contact.type]] || (
                <i className="fas fa-info-circle text-pending1 mr-2"></i>
              )}
              {editingIdx === idx || !contact.value ? (
                <input
                  className="border-b border-blue-400 outline-none bg-transparent text-purple-700 min-w-[120px]"
                  value={editValue}
                  autoFocus
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleEditSave(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditSave(idx);
                    if (e.key === "Escape") setEditingIdx(null);
                  }}
                  placeholder={`Enter ${typeMap[contact.type] || "contact"}`}
                />
              ) : contact.type === "url" ? (
                <a
                  href={contact.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-700 underline"
                >
                  {contact.value}
                </a>
              ) : contact.type === "email" ? (
                <a
                  href={`mailto:${contact.value}`}
                  className="text-purple-700 underline"
                >
                  {contact.value}
                </a>
              ) : contact.type === "tel" ? (
                <a
                  href={`tel:${contact.value}`}
                  className="text-purple-700 underline"
                >
                  {contact.value}
                </a>
              ) : contact.type === "whatsapp" ? (
                <a
                  href={`https://wa.me/${contact.value.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline"
                >
                  {contact.value}
                </a>
              ) : (
                <span className="text-purple-700">{contact.value}</span>
              )}
              {isEditable && editingIdx !== idx && contact.value && (
                <button
                  className="ml-1 text-gray-400 hover:text-blue-500"
                  onClick={() => handleEdit(idx, contact.value)}
                  title="Edit contact"
                  type="button"
                >
                  <i className="fas fa-pen"></i>
                </button>
              )}
              {isEditable && (
                <button
                  className="ml-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveContact(idx)}
                  title="Remove contact"
                  type="button"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          ))
        ) : (
          <span className="text-gray-400">No contact information provided</span>
        )}
        {/* Add contact button */}
        {isEditable && (
          <button
            className="mt-2 text-purple-600 hover:text-purple-800 bg-purple-100 rounded-full p-2 flex items-center w-fit"
            onClick={() => setIsContactModalOpen(true)}
            title="Add contact"
            type="button"
          >
            <i className="fas fa-plus"></i>
          </button>
        )}
      </div>
      {isEditable && (
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          onAdd={handleAddContact}
        />
      )}
    </div>
  );
};

export default AgencyOverviewContacts;
