import React, {useRef, useState, useEffect} from 'react';
import ScrollReveal from 'scrollreveal';
import imagesLoaded from 'imagesloaded';
import Earth from './Earth';
import photos from './photos.json';
import './Photos.scss';


ScrollReveal.debug = process.env.NODE_ENV === "development";

function Photos() {
    const imagesRef = useRef();
    const [coords, setCoords] = useState({lat: 60, long: 18});

    useEffect(() => {
        ScrollReveal().reveal(".photo", {
            reset: true,
            // viewFactor: 0.5,
            duration: 400,
            origin: "left",
            scale: 0.5,
            distance: "200px",
            easing: "cubic-bezier(0.425, 0.030, 0.285, 1.000)",
            beforeReveal: el => setCoords({lat: el.dataset.lat, long: el.dataset.long})
        });

        const imgLoad = imagesLoaded(imagesRef.current);
        imgLoad.on("progress", () => ScrollReveal().sync());

        return function cleanup() {
            ScrollReveal().destroy();
        }
    }, []);

    return (
        <section className="photos">
            <div className="earth">
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
                poster={"/photos/" + props.poster}
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
                src={"/photos/" + props.src}
                width={props.width}
                height={props.height}
                alt=""
                data-lat={props.lat}
                data-long={props.long}/>;
    }
}

export default Photos;
