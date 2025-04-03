import style from './SideBar.module.css'
import SideBarIcon from '../SideBarIcon/SideBarIcon';
import pfp from "../../assets/pfp.png";
import { useState } from 'react';


function SideBar() {
    const [hoveredIcon, setHoveredIcon] = useState(null);

    const handleMouseEnter = (iconName) => setHoveredIcon(iconName);
    console.log(hoveredIcon);
    const handleMouseLeave = () => setHoveredIcon(null);
    console.log(hoveredIcon);
    const icons = [
        { name: "likedSvg", label: "მოწონებული" },
        { name: "bookmarkedSvg", label: "ჩანიშნული" },
        { name: "booksSvg", label: "წიგნები" },
        { name: "homeSVG", label: "მთავარი" },
        { name: "articlesSVG", label: "არტიკლები" }
    ];

    return (
        <nav className={style.sidebar}>
            <ul>
                <li>
                    <img src={pfp} alt="Profile" />
                </li>
                {icons.slice(0, 2).map(({ name, label }) => (
                    <li onMouseEnter={() => handleMouseEnter(name)} 
                    onMouseLeave={handleMouseLeave} key={name}>
                        <SideBarIcon 
                            name={name} 
                            
                        />
                        <div 
                            className={style.arrowDiv} 
                            style={{ opacity: hoveredIcon === name ? "100" : "0", visibility: hoveredIcon === name ? "visible" : "hidden" }}
                        >
                            <SideBarIcon className={style.arrowSVG} name="arrowSVG" />
                            <h2>{label}</h2>
                        </div>
                    </li>
                ))}
            </ul>
            <ul>
                {icons.slice(2).map(({ name, label }) => (
                    <li onMouseEnter={() => handleMouseEnter(name)} 
                    onMouseLeave={handleMouseLeave} key={name}>
                        <SideBarIcon 
                            name={name}  
                        />
                        <div 
                            className={style.arrowDiv} 
                            style={{ opacity: hoveredIcon === name ? "100" : "0", visibility: hoveredIcon === name ? "visible" : "hidden" }}
                        >
                            <SideBarIcon className={style.arrowSVG} name="arrowSVG" />
                            <h2>{label}</h2>
                        </div>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default SideBar;