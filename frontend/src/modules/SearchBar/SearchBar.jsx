import React from 'react'
import style from './SearchBar.module.css'
    const SearchBar = () => {
    return (
        <div className={style.searchBar}>
            <input type="text" placeholder="სახელი" />
        </div>
    )
}
export default SearchBar;