import SideBar from "./modules/SideBar/SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <SideBar />
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout;