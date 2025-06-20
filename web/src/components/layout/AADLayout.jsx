import React from "react";
import AADSideBar from "./Sidebar/AADSideBar";
import AADHeader from "./header/AADHeader";

const AADLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AADSideBar />
      <AADHeader />
      <AADMainContent />
    </div>
  );
};

export default AADLayout;
