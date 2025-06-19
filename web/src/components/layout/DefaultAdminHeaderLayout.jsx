import React from "react";
import { Logo } from "../ui/Logo";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../stateManagement/contexts/AuthContext";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  if (names.length === 1) return names[0][0];
  return names[0][0] + names[names.length - 1][0];
};

const DefaultAdminHeaderLayout = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-50 via-white to-blue-100 shadow-md border-b border-line_clr">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[72px]">
          <div className="flex items-center group">
            <Logo
              size={160}
              destination={"/agency/admin"}
              className="transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="/agency-admin"
              className="px-4 py-2 rounded-full font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors text-base shadow-sm"
            >
              Home
            </a>
            {user && (
              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50 focus:bg-blue-100 border border-transparent focus:border-blue-200 transition-colors duration-200 shadow-sm"
                  onClick={() => setIsProfileOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                >
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-base uppercase">
                    {getInitials(user.name)}
                  </span>
                  <span className="font-medium text-gray-900 max-w-[120px] truncate text-left">
                    {user.name || "Profile"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 shadow-xl bg-white z-50 animate-fade-in-up">
                    <div className="py-2">
                      <a
                        href="/agency/admin/profile"
                        className="flex items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors rounded-lg"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-1 text-blue-500" />
                        Profile
                      </a>
                      <div className="my-1 border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-5 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors rounded-lg"
                      >
                        <LogOut className="w-4 h-4 mr-1 text-red-500" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <div className="mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultAdminHeaderLayout;
