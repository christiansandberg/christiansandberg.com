import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import anime from 'animejs/lib/anime.es.js';
import earthTexture from './8081_earthlights4k.jpg';
// import earthAlpha from './earth-alpha.jpg';


const EARTH_TEXTURE = new THREE.TextureLoader().load(earthTexture);
const EARTH_RADIUS = 200;


function Earth(props) {
    const canvasRef = useRef();
    const globeRef = useRef();
    const renderRef = useRef();
    const pointerRef = useRef();

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            // alpha: true,
            antialias: false
        });

        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 10000);
        // camera.autoUpdate = false;
        camera.position.set(0, 0, 600);

        const scene = new THREE.Scene();
        // scene.autoUpdate = false;
        scene.background = new THREE.Color(0x070707);

        renderRef.current = () => renderer.render(scene, camera);

        scene.add(camera);

        const globe = globeRef.current = new THREE.Group();
        scene.add(globe);

        function createEarth() {
            // const alpha = new THREE.TextureLoader().load(earthAlpha);
            // Create the sphere
            const sphere = new THREE.SphereBufferGeometry(EARTH_RADIUS, 40, 40);
            // Map the texture to the material. 
            const material = new THREE.MeshBasicMaterial({
                map: EARTH_TEXTURE
            });
            // Create a new mesh with sphere geometry.
            const mesh = new THREE.Mesh(sphere, material);
            mesh.matrixAutoUpdate = false;

            mesh.rotation.y = -Math.PI / 2;
            mesh.updateMatrix();

            return mesh;
        }

        function createRings() {
            const SEGMENTS = 64;
            const RADIUS = EARTH_RADIUS + 2;
            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array(3 * 2 * SEGMENTS);
            for (let i = 0; i < SEGMENTS; i++) {
                const a = i * 2 * Math.PI / SEGMENTS;
                vertices[3 * i + 1] = RADIUS * Math.sin(a);
                vertices[3 * i + 2] = RADIUS * Math.cos(a);
            }
            for (let i = SEGMENTS; i < 2 * SEGMENTS; i++) {
                const a = i * 2 * Math.PI / SEGMENTS;
                vertices[3 * i + 0] = RADIUS * Math.sin(a);
                vertices[3 * i + 2] = RADIUS * Math.cos(a);
            }
            geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
            const material = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            });
            const lines = new THREE.LineLoop(geometry, material);

            const group = new THREE.Group();
            group.add(lines);
            return group;
        }

        globe.add(createEarth());
        const pointer = pointerRef.current = createRings();
        globe.add(pointer);

        function updateSize() {
            const height = window.innerHeight;
            const width = window.innerWidth;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            camera.position.x = (camera.aspect - 1) * -130;
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);
            renderer.render(scene, camera);
        }

        updateSize();
        window.addEventListener("resize", updateSize);

        return function cleanup() {
            window.removeEventListener("resize", updateSize);
        }
    }, []);

    useEffect(() => {
        let animId;

        const globeAnimation = anime({
            targets: globeRef.current.rotation,
            x: props.lat * Math.PI / 180,
            y: (props.long - 15) * -Math.PI / 180,
            duration: 1500,
            easing: "cubicBezier(0.425, 0.030, 0.285, 1.000)",
            complete: () => cancelAnimationFrame(animId),
            autoplay: false
        });

        const pointerLatAnimation = anime({
            targets: pointerRef.current.children[0].rotation,
            x: props.lat * -Math.PI / 180,
            duration: 800,
            easing: "cubicBezier(0.425, 0.030, 0.285, 1.000)",
            autoplay: false
        });

        const pointerLongAnimation = anime({
            targets: pointerRef.current.rotation,
            y: props.long * Math.PI / 180,
            duration: 600,
            easing: "cubicBezier(0.425, 0.030, 0.285, 1.000)",
            autoplay: false
        });

        requestAnimationFrame(render);

        function render(now) {
            animId = requestAnimationFrame(render);
            globeAnimation.tick(now);
            pointerLatAnimation.tick(now);
            pointerLongAnimation.tick(now);
            // globeRef.current.rotation.y += 0.0002;
            renderRef.current();
        }

        return function cleanup() {
            cancelAnimationFrame(animId);
        }
    }, [props.lat, props.long]);

    return <canvas ref={canvasRef}></canvas>;
}

export default Earth;
