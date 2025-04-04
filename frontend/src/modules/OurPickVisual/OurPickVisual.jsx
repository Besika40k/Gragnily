import React from 'react';
import style from './OurPickVisual.module.css';
import bookcover1 from '../../assets/bookcover1.png';
const OurPickVisual = () => {
    const favs = [
        {
            id: 12,
            name: 'J. K. Rowling',
            svg: <svg width="141" height="169" viewBox="0 0 141 169" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.3232 150.176V18.7852C16.3232 8.92381 22.9923 0.928589 31.2214 0.928589H114.15C119.88 0.928589 124.524 6.49556 124.524 13.3629V136.636C123.354 143.854 62.6459 146.319 16.3232 150.176Z" fill="#565656"/>
                <path d="M31.096 0.928589V145.85L16.3232 150.176V18.7852C16.3232 8.92381 22.9923 0.928589 31.2214 0.928589" fill="#A51018"/>
                <path d="M117.237 140.804H121.043C122.964 140.804 124.521 138.938 124.521 136.636C124.521 134.334 122.964 132.468 121.043 132.468H31.0921C22.9327 132.468 16.3193 140.394 16.3193 150.174C16.3193 159.954 22.9327 167.88 31.0921 167.88H121.043C122.964 167.88 124.521 166.014 124.521 163.712C124.521 161.41 122.964 159.544 121.043 159.544H117.237V140.804Z" fill="#A51018"/>
                <path d="M32.0143 159.547H120.402V140.804H32.0143C27.6962 140.804 24.1953 145 24.1953 150.176C24.1953 155.351 27.6962 159.547 32.0143 159.547Z" fill="#F5CD94"/>
            </svg>
            ,
            img: bookcover1
        }
    ]
    for (let i = 1; i < 18; i++) {
        const newFav = {
            ...favs[0],
            id: i + 12
        }
        favs.push(newFav)
    }


    return (
        <div className={style.ourPickVisual}>
            <div className={style.pickTopDiv}>
                <h2>რჩეულები</h2>
                <div className={style.buttonsDiv}>
                    <button className={style.fullButton}>სრულად</button>
                    <button className={style.scrollLeftButton}><i className="material-icons">keyboard_arrow_left</i></button>
                    <button className={style.scrollRightButton}><i className="material-icons">keyboard_arrow_right</i></button>
                </div>
            </div>
            <div className={style.pickBottomDiv}>
                {favs.map((item) => (
                    <div key={item.id} className={style.item}>
                        {item.svg}
                        <img src={item.img} alt={item.name} />
                        <h3>{item.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OurPickVisual;