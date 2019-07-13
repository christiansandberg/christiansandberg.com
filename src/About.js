import React from 'react';
import Lines from './Lines';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faGithub, faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './About.css';


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


class About extends React.Component {

    render() {
        const list = links.map(l => {
            return (
                <li><a href={l.url}><FontAwesomeIcon icon={l.icon} /></a></li>
            );
        });

        const points = [
            {x: 0.50, y: 10},
            {x: 0.50, y: 50},
            [
                {x: 0.45, y: 100},
                {x: 0.30, y: 120},
                {x: 0.20, y: 200}
            ],
            [
                {x: 0.75, y: 80},
                {x: 0.80, y: 200}
            ],
            [
                {x: 0.5, y: 300}
            ]
        ];

        return (
            <section id="about">
                <Lines points={points}/>
                <h2>About</h2>
                <p>
                    Software developer, husband and father of two.
                    Also enjoys music, photography and web design.
                    This place is just a playground for those random stuff.
                </p>
                <ul className="links">{list}</ul>
            </section>
        );
    }
}

export default About;
