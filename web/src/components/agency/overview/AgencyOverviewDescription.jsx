import React, { useState } from "react";

const AgencyOverviewDescription = ({ description, setAgencyCreationData }) => {
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [descDraft, setDescDraft] = useState(description || "");

  const handleDescSave = () => {
    setAgencyCreationData((prev) => ({ ...prev, description: descDraft }));
    setIsDescModalOpen(false);
  };

  return (
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
      <div className="text-secondary text-sm leading-relaxed">
        {description || "No description provided."}
      </div>
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
                className="text-gray-400 hover:text-secondary transition-colors"
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
    </div>
  );
};

export default AgencyOverviewDescription;
