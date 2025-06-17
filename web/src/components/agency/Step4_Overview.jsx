import React, { useRef, useState } from "react";
import { useAgencyCreation } from "../../stateManagement/contexts";
import { AddressInput, Button, ContactModal, TownSelectorModal } from "../ui";

const ICONS = {
  url: <i className="fas fa-globe text-pending1 mr-2"></i>,
  tel: <i className="fas fa-phone text-pending1 mr-2"></i>,
  email: <i className="fas fa-envelope text-pending1 mr-2"></i>,
  whatsapp: <i className="fab fa-whatsapp text-pending1 mr-2"></i>,
};

// Map possible contact labels to their type
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

const Step4_Overview = () => {
  const { agencyCreationData, setAgencyCreationData } = useAgencyCreation();
  const {
    name,
    headAddress,
    description,
    towns = [],
    contactInfo = [],
    logo,
    coordinates,
  } = agencyCreationData;

  // State for modals and editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(name || "");
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [descDraft, setDescDraft] = useState(description || "");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState(headAddress || "");
  const [addressCoords, setAddressCoords] = useState(coordinates || null);
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const fileInputRef = useRef();

  // Logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAgencyCreationData((prev) => ({ ...prev, logo: file }));
    }
  };

  // Name inline edit
  const handleNameSave = () => {
    setAgencyCreationData((prev) => ({ ...prev, name: editedName }));
    setIsEditingName(false);
  };

  // Description modal save
  const handleDescSave = () => {
    setAgencyCreationData((prev) => ({ ...prev, description: descDraft }));
    setIsDescModalOpen(false);
  };

  // Address modal save
  const handleAddressSave = () => {
    setAgencyCreationData((prev) => ({
      ...prev,
      headAddress: addressDraft,
      coordinates: addressCoords,
    }));
    setIsAddressModalOpen(false);
  };

  // Towns
  const handleRemoveTown = (town) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      towns: prev.towns.filter((t) => t !== town),
    }));
  };
  const handleAddTown = (town) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      towns: [...(prev.towns || []), town],
    }));
  };

  // Contact Info
  const handleRemoveContact = (idx) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== idx),
    }));
  };
  const handleAddContact = (contactType) => {
    setAgencyCreationData((prev) => ({
      ...prev,
      contactInfo: [
        ...(prev.contactInfo || []),
        { type: contactType.type, value: "" },
      ],
    }));
  };

  const handleSubmit = () => {
    console.log("submit");
    console.log(agencyCreationData);
  };

  return (
    <div className="w-full max-w-3xl bg-gray-50 rounded-xl shadow p-8 flex flex-col gap-6">
      {/* Agency Header */}
      <div className="flex items-center gap-4 border-b border-line_clr pb-4 relative">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white relative">
          {/* Logo or fallback */}
          {logo ? (
            <img
              src={typeof logo === "string" ? logo : URL.createObjectURL(logo)}
              alt="Agency Logo"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{name ? name[0] : "A"}</span>
          )}
          {/* Camera icon */}
          <button
            className="absolute bottom-[-10px] right-[-10px] bg-white h-[40px] w-[40px] rounded-full hover:bg-light_bg "
            onClick={() => fileInputRef.current.click()}
            type="button"
            title="Change logo"
          >
            <i className="fas fa-camera text-secondary"></i>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>
        <div>
          {/* Inline editable name */}
          {isEditingName ? (
            <input
              className="font-semibold text-lg text-gray-900 border-b border-blue-400 outline-none bg-transparent"
              value={editedName}
              autoFocus
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSave();
                if (e.key === "Escape") setIsEditingName(false);
              }}
              maxLength={50}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-gray-900">
                {name || "Agency Name"}
              </span>
              <button
                className="ml-1 text-gray-400 hover:text-blue-500"
                onClick={() => setIsEditingName(true)}
                title="Edit name"
                type="button"
              >
                <i className="fas fa-pen"></i>
              </button>
            </div>
          )}
          <div className="text-gray-500 text-sm flex items-center gap-2">
            {headAddress || "Head Quarter Name, Country"}
            <button
              className="ml-1 text-gray-400 hover:text-blue-500"
              onClick={() => {
                setAddressDraft(headAddress || "");
                setAddressCoords(coordinates || null);
                setIsAddressModalOpen(true);
              }}
              title="Edit address"
              type="button"
            >
              <i className="fas fa-pen"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center gap-2 font-semibold mb-1 text-gray-800">
          Description
          <button
            className="text-gray-400 hover:text-blue-500"
            onClick={() => {
              setDescDraft(description || "");
              setIsDescModalOpen(true);
            }}
            title="Edit description"
            type="button"
          >
            <i className="fas fa-pen"></i>
          </button>
        </div>
        <div className="text-gray-600 text-sm leading-relaxed">
          {description || "No description provided."}
        </div>
      </div>

      {/* Occupancy Towns */}
      <div>
        <div className="flex items-center gap-2 font-semibold mb-2 text-gray-800">
          Occupancy Towns ({towns.length.toString().padStart(2, "0")})
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {towns.length > 0 ? (
            towns.map((town, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1"
              >
                {town}
                <button
                  className="ml-1 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveTown(town)}
                  title="Remove town"
                  type="button"
                >
                  <i className="fas fa-times"></i>
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400">No towns selected</span>
          )}
          {/* Add town button */}
          <button
            className="ml-2 text-green-600 hover:text-green-800 bg-green-100 rounded-full p-2 flex items-center justify-center"
            onClick={() => setIsTownModalOpen(true)}
            title="Add town"
            type="button"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {/* Contact Information */}
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
                {contact.type === "url" ? (
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
                ) : (
                  <span className="text-purple-700">{contact.value}</span>
                )}
                <button
                  className="ml-2 text-gray-400 hover:text-red-500"
                  onClick={() => handleRemoveContact(idx)}
                  title="Remove contact"
                  type="button"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-400">
              No contact information provided
            </span>
          )}
          {/* Add contact button */}
          <button
            className="mt-2 text-purple-600 hover:text-purple-800 bg-purple-100 rounded-full p-2 flex items-center w-fit"
            onClick={() => setIsContactModalOpen(true)}
            title="Add contact"
            type="button"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      {/* Finish Button */}
      <div className="flex justify-center mt-6">
        <Button
          additionalClasses="bg-accent hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors text-lg"
          onClickHandler={handleSubmit}
        >
          Finish
        </Button>
      </div>

      {/* Modals */}
      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onAdd={handleAddTown}
        selectedTowns={towns}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onAdd={handleAddContact}
      />
      {/* Description Modal */}
      {isDescModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <div className="bg-white rounded-xs p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Description
              </h3>
              <button
                onClick={() => setIsDescModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <textarea
              className="w-full border rounded p-2 min-h-[100px]"
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 rounded bg-light_bg text-secondary"
                onClick={() => setIsDescModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-accent text-white"
                onClick={handleDescSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Address Modal */}
      {isAddressModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <div className="bg-white rounded-xs p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Address
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <AddressInput
              value={addressDraft}
              onChange={(value) => setAddressDraft(value)}
              error={null}
              onCoordinatesChange={setAddressCoords}
              placeholder="Enter your headquarters address"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 rounded bg-light_bg text-secondary"
                onClick={() => setIsAddressModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-accent text-white"
                onClick={handleAddressSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4_Overview;
