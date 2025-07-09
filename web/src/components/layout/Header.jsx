import { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "../ui/";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronDown, LogOut, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef(null);
  const imagePlaceholder =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact Us", path: "/contact-us" },
  ];

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
    <header className="sticky top-0 z-50 w-full border-b border-line_clr min-h-[70px] bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo size={160} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <RouterLink
                key={item.label}
                to={item.path}
                className="text-secondary hover:text-accent"
              >
                {item.label}
              </RouterLink>
            ))}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-secondary hover:text-accent"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar || imagePlaceholder}
                          alt={user.fullName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-accent font-medium">
                          {user.firstName?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white">
                      <div className="py-1">
                        <RouterLink
                          to={`/${user.role}/profile`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </RouterLink>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <RouterLink
                    to="/login"
                    className="rounded-xs border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-blue-50"
                  >
                    Login
                  </RouterLink>
                  <RouterLink
                    to="/register"
                    className="rounded-xs border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-blue-50"
                  >
                    Get Started
                  </RouterLink>
                </>
              )}
              <RouterLink
                to="/agency-registration"
                className="rounded-xs bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent"
              >
                Register an Agency
              </RouterLink>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="rounded-xs p-2 text-secondary hover:bg-gray-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navItems.map((item) => (
                <RouterLink
                  key={item.label}
                  to={item.path}
                  className="block rounded-xs px-3 py-2 text-base font-medium text-secondary hover:bg-gray-50 hover:text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </RouterLink>
              ))}
              <div className="mt-4 space-y-2">
                {user ? (
                  <>
                    <RouterLink
                      to={`/${user.role}/profile`}
                      className="block rounded-xs border border-accent px-3 py-2 text-center text-sm font-medium text-accent hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </RouterLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full rounded-xs border border-accent px-3 py-2 text-center text-sm font-medium text-accent hover:bg-blue-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <RouterLink
                      to="/register"
                      className="block rounded-xs border border-accent px-3 py-2 text-center text-sm font-medium text-accent hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </RouterLink>
                    <RouterLink
                      to="/login"
                      className="block rounded-xs border border-accent px-3 py-2 text-center text-sm font-medium text-accent hover:bg-blue-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </RouterLink>
                  </>
                )}

                <RouterLink
                  to="/agency-registration"
                  className="block rounded-xs bg-accent px-3 py-2 text-center text-sm font-medium text-white hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register an Agency
                </RouterLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
