import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
