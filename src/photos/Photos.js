import React, {useRef, useState, useEffect} from 'react';
import throttle from 'lodash/throttle';
import ScrollReveal from 'scrollreveal';
import Earth from './Earth';
import photos from './photos.json';
import './Photos.scss';


function Photos() {
    const listRef = useRef();
    const imagesRef = useRef([]);

    useEffect(() => {
        ScrollReveal()
            .reveal('.photo', {
                reset: false,
                viewFactor: 0.5,
                distance: "200px",
                origin: "bottom"
            });
        // ScrollReveal()
        //     .reveal('.photo:nth-child(odd)', {
        //         reset: false,
        //         viewFactor: 0.5,
        //         distance: "300px",
        //         origin: "left"
        //     });
        // ScrollReveal()
        //     .reveal('.photo:nth-child(even)', {
        //         reset: false,
        //         viewFactor: 0.5,
        //         distance: "300px",
        //         origin: "right"
        //     });
        
        // Get all image nodes
        imagesRef.current = [...listRef.current.querySelectorAll(".photo")];
    }, []);

    return (
        <section id="photos">
            <LocationDisplay imagesRef={imagesRef}/>
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
    console.log(images);
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
