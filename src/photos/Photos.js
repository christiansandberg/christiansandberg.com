import React, {useRef, useState, useEffect} from 'react';
import throttle from 'lodash/throttle';
import ScrollReveal from 'scrollreveal';
import Earth from './Earth';
import photos from './photos.json';
import './Photos.scss';


function Photos() {
    const listRef = useRef();
    const imagesRef = useRef([]);
    const [coords, setCoords] = useState({lat: 0, long: 0});

    useEffect(() => {
        // ScrollReveal()
        //     .reveal('.photo', {
        //         reset: false,
        //         viewFactor: 0.5,
        //         distance: "200px",
        //         origin: "bottom"
        //     });
        ScrollReveal().reveal('.photo', {
            reset: true,
            viewFactor: 0.5,
            origin: "left",
            distance: "300px",
            easing: "cubic-bezier(0.425, 0.030, 0.285, 1.000)",
            beforeReveal: (el) => setCoords({lat: el.dataset.lat, long: el.dataset.long})
        });
        // ScrollReveal()
        //     .reveal('.photo:nth-child(even)', {origin: "right", ...options});

        // Get all image nodes
        // imagesRef.current = [...listRef.current.querySelectorAll(".photo")];
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
            {/* <LocationDisplay imagesRef={imagesRef}/> */}
            <Earth lat={coords.lat} long={coords.long}/>
            <ul ref={listRef}>
                {photos.map(photo =>
                    <Photo key={photo.src} {...photo}/>
                )}
            </ul>
        </section>
    );
}

function LocationDisplay(props) {
    const [scrollPos, setScrollPos] = useState(0);

    useEffect(() => {
        function onScroll() {
            setScrollPos(window.scrollY);
        }
        const throttledScroll = throttle(onScroll, 500);

        document.addEventListener("scroll", throttledScroll);

        return function cleanup() {
            document.removeEventListener("scroll", throttledScroll);
        }
    });

    const images = props.imagesRef.current;
    let lat = 0;
    let long = 0;
    for (let i = images.length - 1; i >= 0; i--) {
        const img = images[i];
        const top = img.getBoundingClientRect().top;
        lat = img.dataset.lat || 0;
        long = img.dataset.long || 0;
        if (top < window.innerHeight / 2) {
            break;
        }
    }

    return <Earth lat={lat} long={long}/>;
}

function Photo(props) {
    let el;
    if (props.src.endsWith(".mp4")) {
        el = <video
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
        el = <img
                className="photo"
                src={"/photos/" + props.src}
                alt=""
                data-lat={props.lat}
                data-long={props.long}/>;
    }

    return <li>{el}</li>;
}

export default Photos;
