import React from "react";
import { Button } from "../../ui";
import { Save } from "lucide-react";

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
    <div className="border border-light_bg rounded-md overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
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
                <Button
                  onClickHandler={onSave}
                  isDisabled={!canSave}
                  text="Save"
                  additionalClasses={`flex items-center rounded-sm min-w-fit min-h-fit px-4 py-2 ${
                    canSave
                      ? "bg-success hover:bg-success/80 text-white shadow-sm"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodContainer;
