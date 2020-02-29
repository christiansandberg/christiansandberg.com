import React, { useContext, useState, useEffect, useRef } from 'react';



const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
// let currentAudioSrc = null;
let gainNode = null;

try {
    audioCtx = new AudioContext({latencyHint: "playback", sampleRate: 44100});
} catch(e) {
    audioCtx = null;
}

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const Edge = /Edge/.test(navigator.userAgent);
const useAudioCtx = (audioCtx !== null) && !iOS && !Edge;

function supportVisualizer() {
    return useAudioCtx;
}

if (useAudioCtx) {
    gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
}

// function getAudioElement() {
//     return currentAudioSrc.mediaElement;
// }

// function pauseAudio() {
//     currentAudioSrc.pause();
//     audioCtx.suspend();
// }

// function playAudio() {
//     audioCtx.resume();
//     currentAudioSrc.play();
// }

// function playPause() {
//     if (currentAudioSrc.mediaElement.paused) {
//         playAudio();
//     } else {
//         pauseAudio();
//     }
// }

// function createAnalyser() {
//     const analyser = audioCtx.createAnalyser();
//     gainNode.connect(analyser);
//     return analyser;
// }

// function deleteAnalyser(analyser) {
//     gainNode.disconnect(analyser);
// }

// const initialState = {
//     audioRef: null,
//     sources: [],
//     ctx: null
// }

const GlobalAudioContext = React.createContext();

function Audio(props) {
    // const {sources} = useContext(GlobalAudioContext);
    const [sources, setSources] = useState([]);
    const audioRef = useRef(null);
    // const audioCtxRef = useRef(null);

    // useEffect(() => {
    //     if (currentAudioSrc !== null) {
    //         currentAudioSrc.disconnect(gainNode);
    //     }
    //     if (supportVisualizer()) {
    //         currentAudioSrc = audioCtx.createMediaElementSource(audioRef.current);
    //         currentAudioSrc.connect(gainNode).connect(audioCtx.destination);
    //     }
    // }, [audioRef, sources]);

    useEffect(() => {
        // const ctx = new AudioContext({
        //     latencyHint: "playback",
        //     sampleRate: 44100
        // });
        // audioCtxRef.current = ctx;
        if (useAudioCtx) {
            audioCtx
                .createMediaElementSource(audioRef.current)
                .connect(gainNode)
        // gainNode
                .connect(audioCtx.destination);
        }
    }, []);

    const context = {
        audio: audioRef,
        setSources,
        controls: {
            play: () => {
                audioCtx.resume();
                audioRef.current.play();
            },
            pause: () => {
                audioRef.current.pause();
                audioCtx.suspend();
            },
            playPause: () => {
                if (audioRef.current.paused) {
                    audioCtx.resume();
                    audioRef.current.play();
                } else {
                    audioRef.current.pause();
                    audioCtx.suspend();
                }
            }
        }
    }

    return (
        <GlobalAudioContext.Provider value={context}>
            <audio preload="none" crossOrigin="anonymous" ref={audioRef}>
                {sources.map(s =>
                    <source key={s.src}
                            src={process.env.REACT_APP_MEDIA_URL + s.src}
                            type={s.type} />
                )}
            </audio>
            {props.children}
        </GlobalAudioContext.Provider>
    );
}

function useAudioElement() {
    return useContext(GlobalAudioContext).audio;
}

function useAudioControls() {
    return useContext(GlobalAudioContext).controls;
}

function useSetSources() {
    return useContext(GlobalAudioContext).setSources;
}

function useAnalyser() {
    // const ctx = useContext(GlobalAudioContext);
    const analyserRef = useRef(null);

    useEffect(() => {
        console.log("Connecting analyser");
        const analyser = audioCtx.createAnalyser();
        analyserRef.current = analyser;
        gainNode.connect(analyser);
        gainNode.connect(audioCtx.destination);

        return function cleanup() {
            console.log("Disconnecting analyser");
            gainNode.disconnect(analyser);
            gainNode.connect(audioCtx.destination);
            analyserRef.current = null;
        }
    }, []);

    return analyserRef;
}


export {
    Audio,
    useAudioElement,
    useAudioControls,
    useSetSources,
    useAnalyser,
    supportVisualizer
}
