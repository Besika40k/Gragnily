import style from "./SideBar.module.css";
import SideBarIcon from "../SideBarIcon/SideBarIcon";
import pfp from "../../assets/pfp.png";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../Layout.css";
import "./dropdownStyle.css";

// user data

import { useUser } from "../../contexts/UserContext";

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

  const defaultUser = {
    username: "Guest",
    email: "",
    profile_picture_url:
      "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-19.jpg",
  };
  const { user, updateUser } = useUser();

  // IMPORTANT: depricated, don't need this call anymore, user data is in context

  // const [user, setUser] = useState(defaultUser);

  // on load get user data
  useEffect(() => {
    fetch("https://gragnily.onrender.com/api/users/getuser", {
      method: "GET",
      credentials: "include", // this allows cookies to be sent
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Not logged in");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.profile_picture_url);
        updateUser(data); // Store user data
      })
      .catch((err) => {
        console.log(
          "User not logged in or error fetching user info:",
          err.message
        );
      });
  }, []);

  // Dropdown Menu
  const pfpRef = useRef(null);
  const iconDisplayNone = () => {
    if (pfpRef.current && pfpRef.current.style.opacity !== "0.5") {
      pfpRef.current.style.opacity = "0.5";
      pfpRef.current.style.visibility = "visible";
    } else {
      pfpRef.current.style.opacity = "1";
      pfpRef.current.style.visibility = "visible";
    }
  };
  const [open, setOpen] = useState(false);
  let menuRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
        if (pfpRef.current) {
          pfpRef.current.style.opacity = "1";
          pfpRef.current.style.visibility = "visible";
        }

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
        "https://gragnily.onrender.com/api/auth/logout",
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
          <div
            className="outerpfp pfp-div"
            style={{
              backgroundImage: `url("${user.profile_picture_url}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "50%",
            }}
            key={10201}
            onClick={() => {
              setOpen(!open);
              iconDisplayNone();
            }}
            ref={pfpRef}
          />
          <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
            <div className="personal-info-div">
              <div
                className="pfp-div"
                style={{
                  backgroundImage: `url(${user.profile_picture_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "50%",
                }}
                key={10000}
              ></div>
              <div className="name-email-div">
                <h2>{user.username}</h2>
                <h3>{user.email}</h3>
              </div>
            </div>
            <div className="dropdown-item dark-mode-div">
              <SideBarIcon name={"sunSVG"} />
              <h2>Dark Mode</h2>

              <label className="switch">
                <input
                  type="checkbox"
                  onClick={() => setDarkMode((prev) => !prev)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            {user.email === "" ? (
              <div className="dropdown-link no-click dropdown-item profile-details-div">
                <SideBarIcon name="pfpSVG" />
                <h2>Profile Info</h2>
              </div>
            ) : (
              <Link
                to="/user-page"
                className="dropdown-link dropdown-item profile-details-div"
              >
                <SideBarIcon name="pfpSVG" />
                <h2>Profile Info</h2>
              </Link>
            )}
            {user.email === "" ? (
              <Link className="dropdown-link" to="/login">
                <div className="dropdown-item logout-div">
                  <SideBarIcon name={"pfpSVG"} />
                  <h2 style={{ textDecoration: "none" }}>Log In</h2>
                </div>
              </Link>
            ) : (
              <div onClick={handleLogout} className="dropdown-item logout-div">
                <SideBarIcon name={"logOutSVG"} />
                <h2>Log Out</h2>
              </div>
            )}
          </div>
        </li>
        {icons.slice(0, 2).map(({ name, label }) => (
          <Link
            to={user.email === "" ? "/" : `/${name.slice(0, -3)}`}
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
