import React from 'react';
import { AudioContext } from 'standardized-audio-context';
import CircularAudioProgress from './CircularAudioProgress';
import AudioVisualizer from './AudioVisualizer';
import './AudioPlayer.css';


class AudioPlayer extends React.Component {

    state = {
        active: false,
        position: 0.0,
        duration: null,
        paused: true
    }

    constructor(props) {
        super(props);

        this.audioRef = React.createRef();

        // Create audio context
        this.audioCtx = new AudioContext({
            latencyHint: "playback",
            sampleRate: 44100
        });
        // Create Gain block
        this.gain = this.audioCtx.createGain();

        this.playPause = this.playPause.bind(this);
        this.handleSeek = this.handleSeek.bind(this);
        this.setUpAudio = this.setUpAudio.bind(this);
    }

    render() {
        const w = this.props.width;
        const r = this.props.radius || 75;
        const style = {
            width: w,
            height: w
        };
        let controlButton;
        if (this.state.paused) {
            controlButton = <img src="/img/play.svg" alt="Play"/>;
        } else {
            controlButton = <img src="/img/pause.svg" alt="Pause"/>;
        }

        return (
            <div style={style} className="audio-player">
                <audio preload="none" ref={this.audioRef}>
                    <source src={this.props.src} type="audio/mp4"/>
                </audio>
                {true &&
                <AudioVisualizer
                    width={w}
                    radius={r + 6}
                    paused={this.state.paused}
                    audioCtx={this.audioCtx}
                    sourceNode={this.gain}/>
                }
                <CircularAudioProgress
                    width={w}
                    radius={r}
                    position={this.state.position}
                    duration={this.state.duration}
                    onSeek={this.handleSeek}/>
                <div className="audio-title">
                    Paper Plane
                </div>
                <button onClick={this.playPause}>
                    {controlButton}
                </button>
            </div>
        );
    }

    componentDidMount() {
        this.setUpAudio();
    }

    componentWillUnmount() {
        this.audioCtx.close();
    }

    setUpAudio() {
        //this.audio = this.audioRef.current;
        this.audio = new Audio(this.props.src);
        // Create audio source from element
        this.source = this.audioCtx.createMediaElementSource(this.audio);
        // Connect source to gain
        this.source.connect(this.gain);
        // Connect gain to destination
        this.gain.connect(this.audioCtx.destination);

        this.audio.addEventListener('canplay', () => {
            //this.audio.currentTime = 100;
        });
        this.audio.addEventListener('durationchange', () => {
            this.setState({duration: this.audio.duration});
        });
        this.audio.addEventListener('timeupdate', () => {
            this.setState({position: this.audio.currentTime});
        });
        this.audio.addEventListener('play', () => {
            this.setState({paused: false});
        });
        this.audio.addEventListener('pause', () => {
            this.setState({paused: true});
        });
        this.audio.addEventListener('ended', () => {
            this.audioCtx.suspend();
        });
    }

    playPause() {
        if (this.state.paused) {
            this.setState({active: true});
            this.audioCtx.resume();
            this.audio.play();
        } else {
            this.audio.pause();
            this.audioCtx.suspend();
        }
    }

    handleSeek(relPos) {
        this.audio.currentTime = relPos * this.audio.duration;
    }
}

export default AudioPlayer;
