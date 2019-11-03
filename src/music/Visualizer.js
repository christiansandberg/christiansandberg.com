import React, {useRef, useEffect} from 'react';
// import { AudioContext } from 'standardized-audio-context';
import * as THREE from 'three';

const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioCtx = null;
let currentAudioSrc = null;

try {
    audioCtx = new AudioContext({latencyHint: "playback", sampleRate: 44100});
} catch(e) {
    audioCtx = null;
}

function useVisualizer() {
    return audioCtx !== null;
}

function THREEVisualizer(canvas) {
    let geometry, material;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    const scene = new THREE.Scene();
    // scene.autoUpdate = false;
    const camera = new THREE.PerspectiveCamera(30, 3 / 2, 0.1, 1000);
    camera.autoUpdate = false;
    // Photo shot with Canon 350D
    camera.filmGauge = 22.2;
    // With a focal length of 28 mm
    camera.setFocalLength(28);

    // Save image's original FOV so we can crop it to current window height
    const tanFOV = Math.tan((Math.PI / 180) * camera.fov / 2);

    // Move sideways
    camera.position.x = -16.1;
    // Standing on the ground
    camera.position.y = 0;
    // Move away from the building
    camera.position.z = 11.4;
    // Look up to the sky
    camera.rotation.x = 1.445;
    // Tilt a little to the right
    camera.rotation.y = -0.235;
    // Rotate to the right
    camera.rotation.z = 0.85;
    // Camera will never move
    camera.matrixAutoUpdate = false;
    camera.updateMatrix();

    const WALL_HEIGHT = 101;
    const WALL_WIDTH = 35.5;
    const NOF_BOXES_H = 20;
    const NOF_BOXES_V = 36;
    const BOX_WIDTH = WALL_WIDTH / NOF_BOXES_H;
    const BOX_HEIGHT = WALL_HEIGHT / NOF_BOXES_V;

    const wall = new THREE.Group();
    wall.position.set(-WALL_WIDTH / 2, 20.3, 0);
    wall.matrixAutoUpdate = false;
    wall.updateMatrix();
    scene.add(wall);

    // geometry = new THREE.PlaneGeometry(WALL_WIDTH, WALL_HEIGHT, 20, 20);
    // material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
    // const test = new THREE.Mesh(geometry, material);
    // test.translateX(WALL_WIDTH / 2);
    // test.translateY(WALL_HEIGHT / 2);
    // wall.add(test);

    const bars = [];
    geometry = new THREE.PlaneBufferGeometry(BOX_WIDTH * 0.8, BOX_HEIGHT * 0.8);
    material = new THREE.MeshBasicMaterial({color: 0xdddddd});
    for (let i = 0; i < NOF_BOXES_H; i++) {
        const boxes = [];
        for (let j = 0; j < NOF_BOXES_V; j++) {
            const box = new THREE.Mesh(geometry, material);
            box.position.x = (i + 0.5) * BOX_WIDTH;
            box.position.y = j * BOX_HEIGHT;
            box.visible = false;
            box.matrixAutoUpdate = false;
            box.updateMatrix();
            wall.add(box);
            boxes.push(box);
        }
        bars.push(boxes);
    }

    this.setSize = (width, height) => {
        const relHeight = height / (width * 2 / 3);
        camera.aspect = width / height;
        // Update FOV with new crop
        camera.fov = (360 / Math.PI) * Math.atan(tanFOV * Math.min(relHeight, 1));
        camera.updateProjectionMatrix();
        // renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        renderer.render(scene, camera);
    }

    this.render = (frequencyData) => {
        const boxesPerAmp = NOF_BOXES_V / 256;
        bars.forEach((bar, i) => {
            const maxIndex = frequencyData[i + 2] * boxesPerAmp;
            bar.forEach((box, j) => {
                box.visible = j < maxIndex;
            });
        });
        renderer.render(scene, camera);
    }
}

function Visualizer(props) {
    const canvasRef = useRef(null);
    const { audioRef } = props;

    useEffect(() => {
        const audio = audioRef.current;
        if (!currentAudioSrc) {
            currentAudioSrc = audioCtx.createMediaElementSource(audio);
        }
        const source = currentAudioSrc;
        const analyser = audioCtx.createAnalyser();
        source.connect(analyser);
        source.connect(audioCtx.destination);

        let reqAnimId = null;

        const visualizer = new THREEVisualizer(canvasRef.current);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        // Tune the analyser a little
        analyser.fftSize = 64;
        analyser.minDecibels = -75;
        analyser.maxDecibels = -2;
        analyser.smoothingTimeConstant = 0.85;

        function updateSize() {
            visualizer.setSize(window.innerWidth, window.innerHeight);
        }

        function render() {
            analyser.getByteFrequencyData(dataArray);
            visualizer.render(dataArray);
            reqAnimId = requestAnimationFrame(render);
        }

        function startRender() {
            if (reqAnimId === null) {
                render();
            }
        }

        function stopRender() {
            cancelAnimationFrame(reqAnimId);
            reqAnimId = null;
        }

        updateSize();
        if (!audio.paused) {
            startRender();
        }

        // Register event listeners
        window.addEventListener("resize", updateSize);
        audio.addEventListener("play", startRender);
        audio.addEventListener("pause", stopRender);
        audio.addEventListener("ended", stopRender);

        return function cleanup() {
            stopRender();
            audio.removeEventListener("play", startRender);
            audio.removeEventListener("pause", stopRender);
            audio.removeEventListener("ended", stopRender);
            window.removeEventListener("resize", updateSize);
            source.disconnect(analyser);
        };
    }, [audioRef]);

    return <canvas className="visualizer" ref={canvasRef}></canvas>;
}

function getAudioContext() {
    return audioCtx;
}

export { Visualizer, getAudioContext, useVisualizer };
