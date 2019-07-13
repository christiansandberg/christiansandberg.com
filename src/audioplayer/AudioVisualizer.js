import React from 'react';


const createAnalyser = ctx => {
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyser.minDecibels = -75;
    analyser.maxDecibels = -1;
    analyser.smoothingTimeConstant = 0.75;
    return analyser;
}


class AudioVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.reqFrameId = null;
        this.scale = window.devicePixelRatio || 1;

        this.drawCircularVisualizer = this.drawCircularVisualizer.bind(this);
    }

    render() {
        const w = this.props.width;
        const h = this.props.width;
        const canvasStyle = {
            width: w,
            height: h
        };
        return (
            <canvas
                className="audio-visualizer"
                width={w * this.scale}
                height={h * this.scale}
                style={canvasStyle}
                ref={this.canvasRef}/>
        );
    }

    componentDidMount() {
        const {audioCtx, sourceNode} = this.props;

        // Create stereo split node
        const splitter = audioCtx.createChannelSplitter(2);
        // Create FFT analyzer
        this.analyserL = createAnalyser(audioCtx);
        this.analyserR = createAnalyser(audioCtx);
        // Connect source to splitter
        sourceNode.connect(splitter);
        // Connect channels to analyzers
        splitter.connect(this.analyserL, 0);
        splitter.connect(this.analyserR, 1);

        this.drawCircularVisualizer();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.reqFrameId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.paused && !this.props.paused) {
            this.drawCircularVisualizer();
        }
    }

    drawCircularVisualizer() {
        const canvas = this.canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        const binCount = this.analyserL.frequencyBinCount;
        const maxBin = Math.floor(binCount * 0.8);
        const angleIncr = Math.PI / maxBin;
        const cx = canvas.height / 2;
        const cy = canvas.width / 2;
        const r = this.props.radius * this.scale;
        const w = 2 * this.scale;// Math.PI * r / maxBin * 0.3;
        const x = -w / 2;
        const maxBarHeight = (Math.min(cx, cy) - r) * 1;
        const dataArray = new Uint8Array(binCount);
        let startTime = null;
        let colorAngle = 0;

        canvasCtx.fillStyle = '#cafdff';
        canvasCtx.shadowColor = 'rgba(255,255,255,0.75)';
        canvasCtx.shadowBlur = 20 * this.scale;

        const renderChannel = (analyser, direction) => {
            analyser.getByteFrequencyData(dataArray);

            for (let i = 0; i < maxBin; i++) {
                const amplitude = dataArray[i] / 256.0;
                const h = amplitude * maxBarHeight;
                const hue = i * 360 / maxBin + colorAngle;
                canvasCtx.fillStyle = `hsl(${hue % 360}, 60%, 80%)`;
                canvasCtx.rotate(angleIncr * direction);
                canvasCtx.fillRect(x, r, w, h);
            }
        }

        const renderCanvas = (now) => {
            if (!startTime) {
                startTime = now;
            }
            colorAngle = 128 / 60000 * -90 * (now - startTime);
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.translate(cx, cy);
            canvasCtx.rotate(-0.5 * angleIncr);
            renderChannel(this.analyserL, 1);
            canvasCtx.rotate(Math.PI + angleIncr);
            renderChannel(this.analyserR, -1);
            canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
            if (!this.props.paused) {
                this.reqFrameId = requestAnimationFrame(renderCanvas);
            }
        }

        renderCanvas();
    }
}

export default AudioVisualizer;
