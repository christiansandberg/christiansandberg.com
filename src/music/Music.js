import React, {useState, useEffect} from 'react';
import Visualizer from './Visualizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import mixInfo from './tracks.json';
import './Music.scss';
import { useAudioControls, useAudioElement, useSetSources, supportVisualizer } from './audio-context';

function Music() {
    return (
        <section className="music">
            <div className="scroll-container">
                <div className="background"></div>
                {supportVisualizer() && <Visualizer />}
                <div className="presentation">
                    This is a mix of some of my progressive house productions,
                    remixes and mash-ups that have just been collecting dust
                    on a hard drive for the last decade.
                </div>
                <Mix tracks={mixInfo.tracks} />
            </div>
        </section>
    );
}

function Mix(props) {
    const {tracks} = props;
    const audioEl = useAudioElement();
    const audioControls = useAudioControls();
    const setSources = useSetSources();
    const [time, setTime] = useState(audioEl.current ? audioEl.current.currentTime : null);
    const [paused, setPaused] = useState(audioEl.current ? audioEl.current.paused : true);

    useEffect(() => {
        const audio = audioEl.current;

        function handleTimeUpdate() {
            setTime(audio.currentTime + 2);
        }

        function handleDurationChange() {
            tracks[tracks.length - 1].end = audio.duration
        }

        function handlePausedUpdate() {
            setPaused(audio.paused);
        }

        function handleKeyPress(e) {
            if (e.code === "Space") {
                e.preventDefault();
                audioControls.playPause();
            }
        }

        if (audio) {
            audio.addEventListener("durationchange", handleDurationChange);
            audio.addEventListener("timeupdate", handleTimeUpdate);
            audio.addEventListener("play", handlePausedUpdate);
            audio.addEventListener("pause", handlePausedUpdate);
            audio.addEventListener("ended", handlePausedUpdate);
        }
        document.addEventListener("keydown", handleKeyPress);

        return function cleanup() {
            if (audio) {
                audio.removeEventListener("durationchange", handleDurationChange);
                audio.removeEventListener("timeupdate", handleTimeUpdate);
                audio.removeEventListener("play", handlePausedUpdate);
                audio.removeEventListener("pause", handlePausedUpdate);
                audio.removeEventListener("ended", handlePausedUpdate);
            }
            document.removeEventListener("keydown", handleKeyPress);
        }
    }, [audioEl, audioControls, tracks]);

    useEffect(() => {
        setSources(mixInfo.sources);
    }, [setSources]);

    function seekTo(newTime) {
        const audio = audioEl.current;
        audioControls.play();
        if (audio.readyState < 2) {
            // Can't seek yet, call us again when we can
            audio.addEventListener("loadeddata", () => seekTo(newTime));
        }

        audio.currentTime = newTime - 1.8;
    }

    const classes = ["tracks"];
    if (paused) {
        classes.push("paused");
    }

    return (
        <ol className={classes.join(" ")}>
            {tracks.map((track, index) => {
                const nextCue = tracks[index + 1] ? tracks[index + 1].cue : Infinity;
                const active = (time !== null && time >= track.cue && time < nextCue);

                return (
                    <Track key={track.title}
                        number={index + 1}
                        artist={track.artist}
                        title={track.title}
                        active={active}
                        paused={paused}
                        cue={track.cue}
                        time={time - track.start}
                        duration={track.end - track.start}
                        audioControls={audioControls}
                        seekTo={seekTo}
                        />
                    );
                }
            )}
        </ol>
    );
}

function Track(props) {
    const {
        artist,
        title,
        time,
        duration,
        cue,
        active,
        paused,
        seekTo,
        audioControls,
        number} = props;
    const progress = Math.min(Math.max(time / duration, 0), 1);

    let className;
    if ((time <= 0) || (time === null)) {
        className = "cued";
    } else if (time > duration) {
        className = "played";
    } else {
        className = "playing";
    }

    const progressStyle = {
        width: progress * 100 + "%"
    };
    const infoStyle = {
        // transitionDelay: (start * 0.001 + 0.5) + "s"
    }

    function clickHandler(e) {
        e.preventDefault();
        seekTo(cue);
    }

    let buttonHandler;
    if (!active) {
        buttonHandler = () => seekTo(cue);
    } else if (!paused) {
        buttonHandler = audioControls.pause;
    } else {
        buttonHandler = audioControls.play;
    }

    return (
        <li className={className + (active ? " active" : "")}>
            <div className="number">{number.toString().padStart(2, "0")}.</div>
            <div className="progress-bg"></div>
            <div className="progress" style={progressStyle}></div>
            <a href={"#t-" + cue} onClick={clickHandler}>
                <div className="info" style={infoStyle}>
                    <div className="artist">{artist}&nbsp;</div>
                    <div className="title">{title}</div>
                </div>
            </a>
            <button className="play-pause-button" onClick={buttonHandler}>
                <FontAwesomeIcon icon={(paused || !active) ? faPlay : faPause} />
            </button>
        </li>
    );
}

export default Music;
