import React from 'react';
import ReactGA from 'react-ga';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faGithub, faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Home.scss';


const links = [
    {
        url: "https://www.linkedin.com/in/christiansandberg/",
        icon: faLinkedinIn
    },
    {
        url: "https://github.com/christiansandberg",
        icon: faGithub
    },
    {
        url: "https://open.spotify.com/user/csandberg/playlist/08O6MPUZyfZyrUBNeB2QVS?si=CKbuwMbKTMW3kPAeZGh5yQ",
        icon: faSpotify
    },
    {
        url: "mailto:me@christiansandberg.com",
        icon: faEnvelope
    }
];

function registerClick(url) {
    ReactGA.event({
        category: "Links",
        action: "click",
        label: url
    });
}

function Home() {
    const list = links.map(l => (
        <li key={l.url}>
            <a href={l.url} onClick={() => registerClick(l.url)} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={l.icon} />
            </a>
        </li>
    ));

    return (
        <section className="home">
            <div className="background"></div>
            <div className="title">
                <h1>
                    <div className="christian">Christian</div>
                    <div className="sandberg">Sandberg</div>
                </h1>
            </div>
            <div className="presentation">
                Hi! I'm just an embedded software developer from Sweden
                who enjoys music, photography and web technologies.
                Welcome to my little experimentation platform which is
                still under construction!
            </div>
            <ul className="links">{list}</ul>
        </section>
    );
}

export default Home;
