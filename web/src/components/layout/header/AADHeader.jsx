import React, { useState } from "react";
import { useAAD } from "../../../stateManagement/contexts/dashboard";

const AADHeader = () => {
  const { getPageTitle, user, sidebarCollapsed } = useAAD();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  return (
    <header
      className={`bg-white border-b border-gray-200 fixed top-0 right-0 z-20 transition-all duration-300 ${
        sidebarCollapsed ? "left-16" : "left-64"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Page Title and Breadcrumb */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg">
            <div className="w-5 h-4 bg-red-500 rounded-sm flex items-center justify-center">
              <div className="w-3 h-2 bg-white rounded-sm"></div>
            </div>
            <span className="text-sm font-medium">Eng (US)</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <hr className="my-2" />
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AADHeader;
