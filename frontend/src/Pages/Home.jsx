import React from 'react';
import style from './Home.module.css'
import AiSection from '../modules/AiSection/AiSection'
import SearchBar from '../modules/SearchBar/SearchBar'
import VisualGenres from '../modules/VisualGenres/VisualGenres'
const Home = () => {
  return (
    <div className={style.home}>
        <div className={style.homeContent}>
          <div className={style.topSection}>
            <h2>Gragnily</h2>
            <SearchBar />
          </div>
          <div className={style.genreSection}>
            <h2>ჟანრები</h2>
            <VisualGenres />
          </div>
        </div>
        <AiSection />
    </div>
  );
};

export default Home;
