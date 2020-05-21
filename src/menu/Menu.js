import React from 'react';
import { NavLink } from "react-router-dom";
 import './Menu.css';


function Menu() {
    return (
        <nav>
            <ul>
                <li><NavLink to="/" exact>Home</NavLink></li>
                <li><NavLink to="/music">Music</NavLink></li>
                <li><NavLink to="/photos">Photos</NavLink></li>
            </ul>
        </nav>
    );
}

export default Menu;
