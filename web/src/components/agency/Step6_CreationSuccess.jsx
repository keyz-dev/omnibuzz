import React from "react";
import { Link } from "react-router-dom";
import { House, LaptopMinimalCheck } from "lucide-react";

const Step6_CreationSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      {/* Animated Checkmark */}
      <div className="mb-8">
        <span className="relative flex h-32 w-32">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-60 animate-ping"></span>
          <span className="absolute inline-flex h-28 w-28 rounded-full bg-green-200 opacity-70 animate-ping delay-150"></span>
          <span className="absolute inline-flex h-24 w-24 rounded-full bg-green-300 opacity-80 animate-ping delay-300"></span>
          <span className="relative inline-flex h-20 w-20 rounded-full bg-success items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        </span>
      </div>
      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-12 text-primary">
        Agency Created Successfully
      </h1>
      {/* Subtext */}
      <p className="text-center text-sm max-w-xl mb-8 text-placeholder">
        You're all set. The new agency has been added to your system.
        <br />
        You can now start managing stations, staff, and reservations for this
        agency.
      </p>
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-[20%] justify-center">
        <Link
          to="/agency/admin"
          className="btn flex items-center justify-center gap-2 border border-accent text-accent font-normal min-w-fit min-h-fit bg-white hover:bg-blue-50 transition shadow-none"
        >
          <House size={20} />
          Continue to Dashboard
        </Link>
        <Link
          to="/agency/profile"
          className="btn flex items-center justify-center gap-2 text-white font-normal min-w-fit min-h-fit bg-accent hover:bg-accent/80 shadow-md"
        >
          <LaptopMinimalCheck size={20} />
          Complete Profile
        </Link>
      </div>
    </div>
  );
};

export default Step6_CreationSuccess;
