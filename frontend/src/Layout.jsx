import SideBar from "./modules/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import "./Layout.css";
const Layout = () => {
  return (
    <>
      <SideBar />
      <main>
        <Outlet />
      </main>
      {/* TODO Ai icon */}
    </>
  );
};

export default Layout;
