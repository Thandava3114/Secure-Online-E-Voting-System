import React from "react";
import "../assets/css/search.css"; 

const SearchBar = () => {
    return (
        <div className="search-page">
        <div className="search-container">
            <input 
                type="text" 
                id="search-input" 
                className="search-box" 
                placeholder="Search ID" 
            />
            <button id="search-button" className="search-button">Search</button>
        </div>
        </div>
    );
};

export default SearchBar; // Ensure default export
