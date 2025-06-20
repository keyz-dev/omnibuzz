import React from "react";
import { CheckLine, AlertCircle, Clock4, ChevronRight } from "lucide-react";

const STATUS_COLORS = {
  required: "text-error",
  pending_processing: "text-pending1",
  rejected: "text-error",
  completed: "text-success",
};

const ProfileCompletionStep = ({
  icon,
  title,
  description,
  status,
  onClick,
}) => {
  const colorClass = STATUS_COLORS[status] || "text-gray-400";
  const showWarning = status === "required" || status === "rejected";
  const showCheck = status === "completed" || status === "approved";

  return (
    <div
      className={`flex items-center gap-4 p-4 ${!showCheck ? "cursor-pointer hover:bg-gray-50" : ""} rounded-lg`}
      onClick={onClick}
    >
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className={`pt-1 ${colorClass}`}>{icon}</div>
          <div
            className={`font-medium ${colorClass} hover:underline text-base flex items-center gap-2`}
          >
            {title}
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-1 font-handwriting">
          {description}
        </div>
        {showWarning && (
          <div className="flex items-center gap-1 text-error text-xs mt-2">
            <AlertCircle size={16} />{" "}
            {status === "rejected" ? "Rejected" : "Required"}
          </div>
        )}
        {status === "pending_processing" && (
          <div className="flex items-center gap-1 text-pending1 text-xs mt-2">
            <Clock4 size={16} /> Pending
          </div>
        )}
        {showCheck && (
          <div className="flex items-center gap-1 text-success text-xs mt-2">
            <CheckLine size={16} /> Completed
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ChevronRight className="text-gray-400" size={25} />
      </div>
    </div>
  );
};

export default ProfileCompletionStep;
