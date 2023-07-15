import React from 'react';
import './navbar.css';

function Navbar() {
    // Take user back to home page when logo on navbar clicked
    const backHome = () => {
        window.location.href = "/";
    }

    return (
        <div className="navbar-container">
            <h1 onClick={backHome}>YTLoader</h1>
        </div>
    );
}

export default Navbar;