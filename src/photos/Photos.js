import React, {useState, useEffect} from 'react';
import {CSSTransition} from "react-transition-group";
import './Photos.css';


const photos = [
    "photo - 1.jpg",
    "photo - 2.jpg",
    "photo - 3.jpg",
    "photo - 4.jpg",
    "photo - 5.jpg",
    "photo - 6.jpg",
    "photo - 7.jpg",
    "photo - 8.jpg",
    "photo - 9.jpg",
    "photo - 10.jpg",
    "photo - 11.jpg",
    "photo - 12.jpg",
    "photo - 13.jpg",
    "photo - 14.jpg",
    "photo - 15.jpg"
];


function Photos() {
    const [active, setActive] = useState(0);

    function next() {
        setActive(active < photos.length - 1 ? active + 1 : 0);
    }

    function prev() {
        setActive(active > 0 ? active - 1 : photos.length - 1);
    }

    useEffect(() => {
        function handleKeyPress(e) {
            if (e.code === "ArrowRight") {
                e.preventDefault();
                next();
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                prev();
            } 
        }

        document.addEventListener("keydown", handleKeyPress);

        return function cleanup() {
            document.removeEventListener("keydown", handleKeyPress);
        }
    });

    return (
        <section id="photos">
            {photos.map((src, i) =>
                <CSSTransition key={i} in={i === active} appear classNames="photo" timeout={1000}>
                    <Photo src={"/photos/" + src}/>
                </CSSTransition>
            )}
        </section>
    );
}

function Photo(props) {
    return (
        <div className="photo" style={{backgroundImage: `url('${props.src}')`}}></div>
    );
}

export default Photos;
