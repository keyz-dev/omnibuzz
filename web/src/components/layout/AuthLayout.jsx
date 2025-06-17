import { Outlet } from "react-router-dom";
import { Logo } from "../ui/";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-line_clr min-h-[70px] bg-white">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Logo size={160} />
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
