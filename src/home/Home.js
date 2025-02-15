import React from 'react';
import ReactGA from 'react-ga';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faGithub, faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Rain from './Rain';
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
            <div className="scroll-container">
                <div className="background">
                    <Rain/>
                </div>
                <div className="title">
                    <h1>
                        <div className="christian">Christian</div>
                        <div className="sandberg">Sandberg</div>
                    </h1>
                </div>
                <div className="presentation">
                    Hi there! I'm an embedded software developer
                    who enjoys music, photography and web technologies.
                    This is just my small experimentation platform for trying
                    out modern web technologies like React, WebGL, WebAudio et.c.
                    As I had to come up with some sort of content to fill it with,
                    you'll find some really old stuff I did when I had a lot more time...
                </div>
                <ul className="links">{list}</ul>
            </div>
        </section>
    );
}

export default Home;
