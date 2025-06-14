import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "../ui/";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line_clr min-h-[70px] bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <RouterLink
                key={item.label}
                to={item.path}
                className="text-gray-600 hover:text-blue-600"
              >
                {item.label}
              </RouterLink>
            ))}
            <div className="flex items-center space-x-4">
              <RouterLink
                to="/agency-registration"
                className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Create Agency
              </RouterLink>
              <RouterLink
                to="/login"
                className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Register
              </RouterLink>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
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
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </RouterLink>
              ))}
              <div className="mt-4 space-y-2">
                <RouterLink
                  to="/agency-registration"
                  className="block rounded-md border border-blue-600 px-3 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Agency
                </RouterLink>
                <RouterLink
                  to="/login"
                  className="block rounded-md border border-blue-600 px-3 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </RouterLink>
                <RouterLink
                  to="/register"
                  className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
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
