import React from "react";

const PaymentMethodContainer = ({
  icon,
  title,
  description,
  isEnabled,
  onToggle,
  children,
  onSave,
  canSave = false,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-500">{description}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={onToggle}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              isEnabled ? "bg-yellow-400" : "bg-gray-200"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isEnabled ? "translate-x-7" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isEnabled ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-6 space-y-4">
            {children}
            {isEnabled && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={onSave}
                  disabled={!canSave}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    canSave
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">Save</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodContainer;
