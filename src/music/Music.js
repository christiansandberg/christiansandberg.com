import React, {useState, useEffect} from 'react';
import ReactGA from 'react-ga';
import findLast from 'lodash/findLast';
import Visualizer from './Visualizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import {
    useAudioControls,
    useAudioElement,
    useSetSources,
    supportVisualizer
} from './audio-context';
import mixInfo from './tracks.json';
import './Music.scss';

function Music() {
    return (
        <section className="music">
            <div className="scroll-container">
                <div className="background">
                    {supportVisualizer() && <Visualizer />}
                </div>
                <div className="presentation">
                    Here's a mix of some of my house productions,
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
    const [activeTrack, setActiveTrack] = useState(null);

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

        function handleEnded() {
            setPaused(true);
            setTime(null);
            setActiveTrack(null);
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
            audio.addEventListener("ended", handleEnded);
        }
        document.addEventListener("keydown", handleKeyPress);

        return function cleanup() {
            if (audio) {
                audio.removeEventListener("durationchange", handleDurationChange);
                audio.removeEventListener("timeupdate", handleTimeUpdate);
                audio.removeEventListener("play", handlePausedUpdate);
                audio.removeEventListener("pause", handlePausedUpdate);
                audio.removeEventListener("ended", handleEnded);
            }
            document.removeEventListener("keydown", handleKeyPress);
        }
    }, [audioEl, audioControls, tracks]);

    // Update active track
    useEffect(() => {
        if (!paused) {
            setActiveTrack(findLast(tracks, t => time >= t.cue));
        }
    }, [tracks, time, paused]);

    // Report track statistics
    useEffect(() => {
        if (activeTrack) {
            ReactGA.event({
                category: "Music",
                action: "start",
                label: activeTrack.title
            });

            return function played() {
                ReactGA.event({
                    category: "Music",
                    action: "played",
                    label: activeTrack.title
                });
            }
        }
    }, [activeTrack]);

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
            {tracks.map((track, index) => (
                <Track key={track.title}
                    number={index + 1}
                    artist={track.artist}
                    title={track.title}
                    active={track === activeTrack}
                    paused={paused}
                    cue={track.cue}
                    time={time - track.start}
                    duration={track.end - track.start}
                    audioControls={audioControls}
                    seekTo={seekTo}
                    />
                )
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
            <button className="click-area" onClick={buttonHandler}>
                <div className="play-pause">
                    <FontAwesomeIcon icon={(paused || !active) ? faPlay : faPause} />
                </div>
                <div className="info">
                    <div className="artist">{artist}&nbsp;</div>
                    <div className="title">{title}</div>
                </div>
            </button>
        </li>
    );
}

export default Music;
