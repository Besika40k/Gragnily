import style from "./SideBar.module.css";
import SideBarIcon from "../SideBarIcon/SideBarIcon";
import pfp from "../../assets/pfp.png";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../Layout.css";
import "./dropdownStyle.css";
function SideBar() {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleMouseEnter = (iconName) => setHoveredIcon(iconName);
  const handleMouseLeave = () => setHoveredIcon(null);

  const icons = [
    { name: "likedSvg", label: "მოწონებული" },
    { name: "bookmarkedSvg", label: "ჩანიშნული" },
    { name: "booksSvg", label: "წიგნები" },
    { name: "homeSVG", label: "მთავარი" },
    { name: "articlesSVG", label: "არტიკლები" },
  ];

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(darkMode ? "light" : "dark");
    root.classList.add(darkMode ? "dark" : "light");
  }, [darkMode]);

  // Dropdown Menu
  const [open, setOpen] = useState(false);
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
        console.log(menuRef.current);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  // logout request
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://gragnily-backend.onrender.com/logout",
        {
          method: "POST",
          credentials: "include", // crucial! this tells the browser to send cookies
        }
      );

      if (response.ok) {
        // Logout success: update frontend state or redirect
        console.log("Logged out successfully");
        window.location.reload(); // or redirect to login
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className={style.sidebar}>
      <ul>
        <li ref={menuRef}>
          <img
            className={style.pfp}
            src={pfp}
            alt="Profile"
            onClick={() => {
              setOpen(!open);
            }}
          />
          <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
            <div className="personal-info-div">
              <div
                className="pfp-div"
                style={{
                  backgroundImage: `url("https://1000logos.net/wp-content/uploads/2020/09/Half-Life-logo.png")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                key={10000}
              ></div>
              <div className="name-email-div">
                <h2>Beso Meskhia</h2>
                <h3>eawdawdw@gmail.com</h3>
              </div>
            </div>
            <div className="dropdown-item dark-mode-div">
              <SideBarIcon name={"sunSVG"} />
              <h2>Dark Mode</h2>

              <label class="switch">
                <input
                  type="checkbox"
                  onClick={() => setDarkMode((prev) => !prev)}
                />
                <span class="slider round"></span>
              </label>
            </div>
            <Link className="profile-details-link" to="/login">
              <div className="dropdown-item profile-details-div">
                <SideBarIcon name={"pfpSVG"} />
                <h2 style={{ textDecoration: "none" }}>Log In</h2>
              </div>
            </Link>
            <div onClick={handleLogout} className="dropdown-item logout-div">
              <SideBarIcon name={"logOutSVG"} />
              <h2>Log Out</h2>
            </div>
          </div>
        </li>
        {icons.slice(0, 2).map(({ name, label }) => (
          <Link to={`/${name.slice(0, -3)}`} key={name}>
            <li
              onMouseEnter={() => handleMouseEnter(name)}
              onMouseLeave={handleMouseLeave}
            >
              <SideBarIcon name={name} />
              <div
                className={style.arrowDiv}
                style={{
                  opacity: hoveredIcon === name ? "100" : "0",
                  visibility: hoveredIcon === name ? "visible" : "hidden",
                }}
              >
                <SideBarIcon className={style.arrowSVG} name="arrowSVG" />
                <h2>{label}</h2>
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <ul>
        {icons.slice(2).map(({ name, label }) => (
          <Link
            to={`/${name.slice(0, -3) == "home" ? "" : name.slice(0, -3)}`}
            key={name}
          >
            <li
              onMouseEnter={() => handleMouseEnter(name)}
              onMouseLeave={handleMouseLeave}
            >
              <SideBarIcon name={name} />
              <div
                className={style.arrowDiv}
                style={{
                  opacity: hoveredIcon === name ? "100" : "0",
                  visibility: hoveredIcon === name ? "visible" : "hidden",
                }}
              >
                <SideBarIcon className={style.arrowSVG} name="arrowSVG" />
                <h2>{label}</h2>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </nav>
  );
}

export default SideBar;
