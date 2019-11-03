import React from 'react';
import { Link } from "react-router-dom";
import './Menu.css';


class Menu extends React.Component {

    render() {
        return (
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/music">Music</Link></li>
                    <li><Link to="/photos">Photography</Link></li>
                </ul>
            </nav>
        );
    }
}

export default Menu;
