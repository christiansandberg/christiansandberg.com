import React, {useState, useEffect} from 'react';
import { Visualizer, getAudioContext, useVisualizer } from './Visualizer';
import mixInfo from './tracks.json';
import './Music.scss';

const tracks = mixInfo.tracks.map((track, i) => {
    const nextTrack = mixInfo.tracks[i + 1];
    track.end = nextTrack ? nextTrack.start : Infinity;
    return track;
});

function Music(props) {
    return (
        <section className="music">
            {useVisualizer() && <Visualizer audioRef={props.audioRef} />}
            <div className="vignette"></div>
            <Mix tracks={tracks} audioRef={props.audioRef} />
        </section>
    );
}

function Audio(props) {
    const sources = mixInfo.sources;

    return (
        <audio preload="none" crossOrigin="anonymous" ref={props.audioRef}>
            {sources.map(s =>
                <source key={s.src}
                        src={process.env.REACT_APP_MEDIA_URL + s.src}
                        type={s.type} />
            )}
        </audio>
    );
}

function Mix(props) {
    const {tracks, audioRef} = props;
    const [time, setTime] = useState(audioRef.current ? audioRef.current.currentTime : null);

    useEffect(() => {
        const audio = audioRef.current;

        function playPause() {
            const audio = audioRef.current;
            const ctx = getAudioContext();
            if (audio.paused) {
                audio.play();
                ctx.resume();
            } else {
                audio.pause();
                ctx.suspend();
            }
        }
    
        function handleTimeUpdate() {
            setTime(audio.currentTime + 2);
        }

        function handleKeyPress(e) {
            if (e.code === "Space") {
                e.preventDefault();
                playPause();
            }
        }

        audio.addEventListener("durationchange", () =>
            tracks[tracks.length - 1].end = audio.duration
        );
        audio.addEventListener("timeupdate", handleTimeUpdate);
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            document.removeEventListener("keydown", handleKeyPress);
        }
    }, [audioRef, tracks]);

    function seekTo(newTime) {
        const audio = audioRef.current;
        if (audio.paused) {
            audio.play();
            getAudioContext().resume();
            if (audio.readyState < 2) {
                // Can't seek yet, call us again when we can
                audio.addEventListener("loadeddata", () => seekTo(newTime));
            }
        }

        audio.currentTime = newTime - 1.8;
    }

    return (
        <div className="content">
            <ol className="tracks">
                {tracks.map(track =>
                    <Track key={track.title}
                           data={track}
                           seekTo={seekTo}
                           time={time} />
                )}
            </ol>
        </div>
    );
}

function Track(props) {
    const { start, end, artist, title } = props.data;
    const { time, seekTo } = props;

    let className = "";
    if ((time < start) || (time === null)) {
        className = "cued";
    } else if (time > end) {
        className = "played";
    } else {
        className = "playing";
    }

    const progress = (time - start) / (end - start);
    const satProgress = Math.max(Math.min(progress, 1), 0);
    const progressStyle = {
        height: satProgress * 100 + "%"
    };
    const infoStyle = {
        // transitionDelay: (start * 0.001 + 0.5) + "s"
    }

    const clickHandler = (e) => {
        e.preventDefault();
        seekTo(start);
    }

    return (
        <li className={className}>
            <div className="progress" style={progressStyle}></div>
            <a href="#play" onClick={clickHandler}>
                <div className="info" style={infoStyle}>
                    <div className="artist">{artist}&nbsp;</div>
                    <div className="title">{title}</div>
                </div>
            </a>
        </li>
    );
}

export {Music, Audio};
