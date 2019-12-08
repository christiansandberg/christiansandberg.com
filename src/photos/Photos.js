import React, {useState, useEffect} from 'react';
import {CSSTransition} from "react-transition-group";
import ScrollReveal from 'scrollreveal';
import photos from './photos.json';
import './Photos.scss';


function Photos() {
    const [active, setActive] = useState(0);

    function next() {
        setActive(active < photos.length - 1 ? active + 1 : 0);
    }

    function prev() {
        setActive(active > 0 ? active - 1 : photos.length - 1);
    }

    useEffect(() => {
        ScrollReveal()
            .reveal('#photos li:nth-child(odd)', {
                reset: false,
                viewFactor: 0.5,
                distance: "100px",
                origin: "left"
            });
        ScrollReveal()
            .reveal('#photos li:nth-child(even)', {
                reset: false,
                viewFactor: 0.5,
                distance: "100px",
                origin: "right"
            });

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

//     <CSSTransition key={i} in={i === active} appear classNames="photo" timeout={1000}>
//          <Photo src={"/photos/" + src}/>
//      </CSSTransition>

    return (
        <section id="photos">
            <ul>
                {photos.map((photo, i) =>
                    <Photo {...photo}/>
                )}
            </ul>
        </section>
    );
}

function Photo(props) {
    return (
         <li>
             <img src={"/photos/" + props.src} alt=""/>
         </li>
    );
}

export default Photos;
