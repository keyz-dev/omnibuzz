import React from "react";
import { useAAD } from "../../../stateManagement/contexts/dashboard";
import { Menu, X, Bus } from "lucide-react";

// Sidebar Component
const AADSideBar = () => {
  const {
    navigationItems,
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useAAD();

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-64"
      } h-screen fixed left-0 top-0 z-30`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div
          className={`flex items-center space-x-2 ${
            sidebarCollapsed ? "hidden" : "flex"
          }`}
        >
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">OmniBuzz</span>
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1 rounded-lg hover:bg-gray-100"
        >
          {sidebarCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="p-4">
        <div
          className={`text-xs font-medium text-gray-500 mb-4 ${
            sidebarCollapsed ? "hidden" : "block"
          }`}
        >
          MENU
        </div>
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${sidebarCollapsed ? "mx-auto" : "mr-3"}`}
                />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
export default AADSideBar;
