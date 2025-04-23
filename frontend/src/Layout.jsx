import SideBar from "./modules/SideBar/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
const Layout = () => {
  const location = useLocation();
  // hidden in
  const hideSidebarPaths = ["/login", "/sign-up", "/forgot-password"];

  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideSidebar && <SideBar />}
      <main>
        <Outlet />
      </main>
      {/* TODO Ai icon */}
    </>
  );
};

export default Layout;
