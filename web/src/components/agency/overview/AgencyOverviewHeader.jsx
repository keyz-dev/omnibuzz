import React, { useRef, useState } from "react";
import { AddressInput } from "../../ui";

const AgencyOverviewHeader = ({
  name,
  logo,
  headAddress,
  coordinates,
  setAgencyCreationData,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(name || "");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState(headAddress || "");
  const [addressCoords, setAddressCoords] = useState(coordinates || null);
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

  // Address modal save
  const handleAddressSave = () => {
    setAgencyCreationData((prev) => ({
      ...prev,
      headAddress: addressDraft,
      coordinates: addressCoords,
    }));
    setIsAddressModalOpen(false);
  };

  return (
    <div className="flex-col md:flex-row items-center gap-12 border-b border-line_clr pb-4 relative">
      <div className="w-30 h-30 rounded-full bg-gray-300 flex items-center justify-center text-3xl border border-error mb-4 font-bold text-white relative">
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
                className="text-gray-400 hover:text-secondary transition-colors"
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

export default AgencyOverviewHeader;
