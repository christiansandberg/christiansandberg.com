import React, {useRef, useState, useEffect} from 'react';
import ScrollReveal from 'scrollreveal';
import imagesLoaded from 'imagesloaded';
import Earth from './Earth';
import photos from './photos.json';
import './Photos.scss';


ScrollReveal.debug = process.env.NODE_ENV === "development";

function Photos() {
    const imagesRef = useRef();
    const [coords, setCoords] = useState({lat: photos[0].lat, long: photos[0].long});

    useEffect(() => {
        window.scrollTo(0, 0);

        ScrollReveal().reveal(".photo", {
            reset: true,
            // viewFactor: 0.5,
            duration: 500,
            origin: "right",
            scale: 0.2,
            distance: "200px",
            easing: "cubic-bezier(0.425, 0.030, 0.285, 1.000)",
            beforeReveal: el => setCoords({lat: el.dataset.lat, long: el.dataset.long})
        });

        const imgLoad = imagesLoaded(imagesRef.current);
        imgLoad.on("progress", ScrollReveal().sync);

        return function cleanup() {
            setTimeout(() => window.scrollTo(0, 0), 2000);
            ScrollReveal().destroy();
        }
    }, []);

    return (
        <section className="photos">
            <div className="background">
                <Earth lat={coords.lat} long={coords.long}/>
            </div>
            <div className="presentation">
                Here are a few photos from home and various trips around the world.
                Scroll down to start the journey!
            </div>
            <ul ref={imagesRef}>
                {photos.map(photo =>
                    <li key={photo.src}><Photo {...photo}/></li>
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
                poster={process.env.PUBLIC_URL + "/photos/" + props.poster}
                width={props.width}
                height={props.height}
                preload="none"
                controls
                playsInline
                data-lat={props.lat}
                data-long={props.long}>
            </video>;
    } else {
        return <img
                className="photo"
                src={process.env.PUBLIC_URL + "/photos/" + props.src}
                width={props.width}
                height={props.height}
                alt=""
                data-lat={props.lat}
                data-long={props.long}/>;
    }
}

export default Photos;
