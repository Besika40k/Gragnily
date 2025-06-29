import SideBar from "./modules/SideBar/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
const Layout = () => {
  const location = useLocation();
  // hidden in
  const hideSidebarPaths = [
    "/login",
    "/sign-up",
    "/forgot-password",
    "/admin-panel",
  ];

  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideSidebar && <SideBar />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
