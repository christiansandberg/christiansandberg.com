import React from 'react';
import './AudioProgress.css';


class CircularAudioProgress extends React.Component {
    constructor(props) {
        super(props);
        this.parent = React.createRef();
        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const r = this.props.radius;
        const w = this.props.width;
        const h = this.props.width;
        const c = 2 * Math.PI * r;
        const cx = w / 2;
        const cy = h / 2;
        let progress = 0;
        if (this.props.duration) {
            progress = this.props.position / this.props.duration * c;
        }
        return (
            <svg
                className="audio-progress"
                width={w}
                height={h}
                ref={this.parent}
                onClick={this.handleClick}
                xmlns="http://www.w3.org/2000/svg">
                <circle
                    className="audio-progress-bg"
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="transparent" />
                <circle
                    className="audio-progress-pos"
                    cx={cx}
                    cy={cy}
                    r={r}
                    strokeDasharray={`${progress} ${c}`}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    fill="transparent" />
            </svg>
        );
    }

    handleClick(e) {
        const r = this.props.radius;
        // Get svg dimensions
        const rect = this.parent.current.getBoundingClientRect();
        // Calculate position of click relative to the center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Calculate distance of the click from the center
        const hypot = Math.hypot(y, x);
        // Only care about it if it is close enough to the progress bar
        if ((hypot > r * 0.7) && (hypot < r * 1.3)) {
            let angle = Math.atan2(y, x);
            // Need to rotate 90 degrees
            angle += Math.PI / 2;
            // One quadrant will be negative
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            const relPos = angle / (2 * Math.PI);
            this.props.onSeek(relPos);
        }
    }
}

export default CircularAudioProgress;
