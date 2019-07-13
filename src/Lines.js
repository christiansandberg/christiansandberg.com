import React from 'react';
import './Lines.css';

const MAX_WIDTH = 1000;

function processPoint(point) {
    if (Array.isArray(point)) {
        return point.map(processPoint);
    }
    const width = Math.min(window.innerWidth, MAX_WIDTH);
    return {x: point.x * width, y: point.y};
}

function generateElements(points, prev, t, speed) {
    const nodes = [];

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (Array.isArray(p)) {
            nodes.push(generateElements(p, prev, t, speed));
            continue;
        }
        if (prev) {
            const d = Math.hypot(p.x - prev.x, p.y - prev.y);
            const duration = d / speed;
            const style = {
                transitionDuration: duration + 's'
            }
            nodes.push(<line data-time={t} style={style} x1={prev.x} y1={prev.y} x2={p.x} y2={p.y} strokeDasharray={d} strokeDashoffset={d}/>);
            t += duration;
        }
        nodes.push(<circle data-time={t} cx={p.x} cy={p.y} r="6"/>);
        prev = p;
    }

    return nodes;
}

class Lines extends React.Component {

    static defaultProps = {
        speed: 300
    }

    constructor(props) {
        super(props);

        this.svgRef = React.createRef();
        this.state = {
            width: window.innerWidth
        }

        this.animate = this.animate.bind(this);
    }

    render() {
        const points = this.props.points.map(processPoint);
        const allPoints = points.flat();
        const maxY = allPoints.reduce((max, p) => p.y > max ? p.y : max, points[0].y) + 20;
        const minX = allPoints.reduce((min, p) => p.x < min ? p.x : min, points[0].x) - 20;
        const maxX = allPoints.reduce((max, p) => p.x > max ? p.x : max, points[0].x) + 20;
        const width = maxX - minX;
        const height = maxY;
        const posX = Math.max((window.innerWidth - MAX_WIDTH) / 2, 0) + minX;

        const nodes = generateElements(points, null, 0, this.props.speed);

        return (
            <div className="lines rellax" data-rellax-speed="-2" style={{height: height}}>
                <svg
                    ref={this.svgRef}
                    width={width}
                    height={height}
                    viewBox={`${minX} 0 ${width} ${height}`}
                    style={{marginLeft: posX}}
                    xmlns="http://www.w3.org/2000/svg">
                    {nodes}
                </svg>
            </div>
        );
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({width: window.innerWidth});
        });
        this.animate();
    }

    animate() {
        const nodes = this.svgRef.current.querySelectorAll("line, circle");
        nodes.forEach(el => {
            const t = parseFloat(el.dataset.time);
            setTimeout(() => {
                el.classList.add("visible");
            }, t * 1000);
        });
    }
}

export default Lines;
