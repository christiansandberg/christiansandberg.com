import React, {useState, useEffect} from 'react';
import Visualizer from './Visualizer';
import mixInfo from './tracks.json';
import './Music.scss';
import { useAudioControls, useAudioElement, useSetSources, supportVisualizer } from './audio-context';

function Music(props) {
    return (
        <section className="music">
            {supportVisualizer() && <Visualizer />}
            {/* <div className="vignette"></div> */}
            <div className="music-intro">
                This is a mix of some of my progressive house productions,
                remixes and mash-ups that have just been collecting dust
                on a hard drive for the last decade.
            </div>
            <Mix tracks={mixInfo.tracks} />
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
                audioControls.play();
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
            {tracks.map((track, index) =>
                <Track key={track.title}
                        number={index + 1}
                        currentTrack={track}
                        nextTrack={tracks[index + 1]}
                        seekTo={seekTo}
                        time={time} />
            )}
        </ol>
    );
}

function Track(props) {
    const { start, cue, end, artist, title } = props.currentTrack;
    const nextCue = props.nextTrack ? props.nextTrack.cue : Infinity;
    const { time, seekTo, number } = props;

    let className = (time !== null && time >= cue && time < nextCue) ? "active " : "";

    if ((time <= start) || (time === null)) {
        className += "cued";
    } else if (time > end) {
        className += "played";
    } else {
        className += "playing";
    }

    const progress = (time - start) / (end - start);
    const satProgress = Math.max(Math.min(progress, 1), 0);
    const progressStyle = {
        width: satProgress * 100 + "%"
    };
    const infoStyle = {
        // transitionDelay: (start * 0.001 + 0.5) + "s"
    }

    const clickHandler = (e) => {
        e.preventDefault();
        seekTo(cue);
    }

    return (
        <li className={className}>
            <div className="number">{number.toString().padStart(2, "0")}.</div>
            <div className="progress" style={progressStyle}></div>
            <a href={"#t-" + start} onClick={clickHandler}>
                <div className="info" style={infoStyle}>
                    <div className="artist">{artist}&nbsp;</div>
                    <div className="title">{title}</div>
                </div>
            </a>
        </li>
    );
}

export default Music;
