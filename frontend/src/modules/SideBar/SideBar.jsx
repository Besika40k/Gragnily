import style from "./SideBar.module.css";
import SideBarIcon from "../SideBarIcon/SideBarIcon";
import pfp from "../../assets/pfp.png";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../Layout.css";
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

  return (
    <nav className={style.sidebar}>
      <ul>
        <li>
          <img src={pfp} alt="Profile" />
        </li>
        {/* TEMPORARY THEME CHANGE BUTTON */}
        <button onClick={() => setDarkMode((prev) => !prev)}>
          Switch to {darkMode ? "Light" : "Dark"} Mode
        </button>

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
