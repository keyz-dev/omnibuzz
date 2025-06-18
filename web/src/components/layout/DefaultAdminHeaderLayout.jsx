import React from "react";
import { Logo } from "../ui/Logo";
import { Outlet } from "react-router-dom";

const DefaultAdminHeaderLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky flex justify-between items-center top-0 z-50 w-full border-b border-line_clr min-h-[70px] bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo size={160} destination={"/agency-admin"} />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <ul>
            <li>
              <a href="/agency-admin">
                <span>Home</span>
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="/agency-admin">
                <span>Profile</span>
              </a>
            </li>
          </ul>
        </nav>
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
