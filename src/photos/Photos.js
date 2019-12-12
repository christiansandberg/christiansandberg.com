import React, {useRef, useState, useEffect} from 'react';
import throttle from 'lodash/throttle';
import ScrollReveal from 'scrollreveal';
import Earth from './Earth';
import photos from './photos.json';
import './Photos.scss';


function Photos() {
    const listRef = useRef();
    const [coords, setCoords] = useState({lat: 60, long: 18});

    useEffect(() => {
        ScrollReveal().reveal(".photo", {
            reset: true,
            viewFactor: 0.5,
            origin: "left",
            distance: "200px",
            easing: "cubic-bezier(0.425, 0.030, 0.285, 1.000)",
            beforeReveal: el => setCoords({lat: el.dataset.lat, long: el.dataset.long})
        });

        return function cleanup() {
            ScrollReveal().destroy();
        }
    }, []);

    return (
        <section className="photos">
            <div className="presentation">
                Here are a few photos from home and various trips around the world.
                Scroll down to start the journey!
            </div>
            <Earth lat={coords.lat} long={coords.long}/>
            <ul ref={listRef}>
                {photos.map(photo =>
                    <li><Photo key={photo.src} {...photo}/></li>
                )}
            </ul>
        </section>
    );
}

function Photo(props) {
    if (props.src.endsWith(".mp4")) {
        return <video
                className="photo"
                src={process.env.REACT_APP_MEDIA_URL + props.src}
                poster={"/photos/" + props.poster}
                preload="none"
                controls
                playsInline
                data-lat={props.lat}
                data-long={props.long}>
            </video>;
    } else {
        return <img
                className="photo"
                src={"/photos/" + props.src}
                alt=""
                data-lat={props.lat}
                data-long={props.long}/>;
    }
}

export default Photos;
