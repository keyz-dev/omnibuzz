import React from "react";
import { useAAD } from "../../../stateManagement/contexts/dashboard";
import { Loader, ProfileCompletionStep } from "../../../components/ui";
import {
  CheckCircle,
  AlertCircle,
  IdCard,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui";

const ProfileCompletion = () => {
  const { agencyProfile, isLoading } = useAAD();
  const navigate = useNavigate();
  if (isLoading || !agencyProfile) {
    return (
      <div className="flex items-center justify-center h-full m-auto">
        <Loader size={30} color="#5E63FF" />
      </div>
    );
  }

  const { agency, completionSteps } = agencyProfile;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 justify-center items-start w-full min-h-[70vh] px-4 py-12">
      {/* Left: Steps */}
      <div className="flex-1 max-w-xl">
        <h2 className="text-xl font-semibold mb-8 text-primary">
          Key details to take care of
        </h2>
        <div className="space-y-8">
          {/* Step 1: Verification */}
          <ProfileCompletionStep
            icon={<IdCard size={22} />}
            title="Verify Your Agency's Identity"
            description="Help us recognize your agency and connect it to your stations and staff. This keeps a secured profile for you and your passengers"
            status={completionSteps.verification.status}
            onClick={() => {
              completionSteps.verification.status !== "approved" &&
                navigate("/agency/admin/upload-documents");
            }}
          />

          {/* Step 2: Station */}
          <ProfileCompletionStep
            icon={<MapPin size={22} />}
            title="Set Up Your First Station"
            description="Add the first station where your buses operate. This helps you manage routes and reservations right away."
            status={completionSteps.stations.status}
            onClick={() => {
              completionSteps.stations.status !== "completed" &&
                navigate("/agency/admin/station-setup");
            }}
          />
        </div>
      </div>
      {/* Right: Agency Card */}
      <div className="w-full max-w-xs mx-auto md:mx-0 bg-white border border-line_clr rounded-lg shadow-xs p-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-white mb-4">
          {agency.logo ? (
            <img
              src={
                typeof agency.logo === "string"
                  ? agency.logo
                  : URL.createObjectURL(agency.logo)
              }
              alt="Agency Logo"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{agency.name ? agency.name[0] : "A"}</span>
          )}
        </div>
        <div className="text-center">
          <div className="font-semibold text-base text-primary mb-1">
            {agency.name || "Agency Name"}
          </div>
          <div className="text-gray-500 text-sm mb-4">
            {agency.headAddress || "Head Quater Name, Cameroon"}
          </div>
        </div>
        <Button
          additionalClasses="bg-light_bg text-secondary font-placeholder px-4"
          text="Publish Agency"
          isDisabled={agencyProfile.isPublishable}
        />
      </div>
    </div>
  );
};

export default ProfileCompletion;
