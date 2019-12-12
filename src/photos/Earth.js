import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import anime from 'animejs/lib/anime.es.js';
import earthTexture from './8081_earthlights4k.jpg';
// import earthAlpha from './earth-alpha.jpg';


const LONGITUDE_OFFSET = -Math.PI / 2;


function Earth(props) {
    const canvasRef = useRef();
    const globeRef = useRef();
    const renderRef = useRef();
    const pointerContainerRef = useRef();

    useEffect(() => {
        const HEIGHT = window.innerHeight;
        const WIDTH = HEIGHT;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: false,
            antialias: false
        });

        const camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 0.1, 10000);
        // camera.autoUpdate = false;
        camera.position.set(-50, 0, 600);

        const scene = new THREE.Scene();
        // scene.autoUpdate = false;
        scene.background = new THREE.Color(0x070707);

        renderRef.current = () => renderer.render(scene, camera);

        scene.add(camera);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);

        const globe = new THREE.Group();
        scene.add(globe);
        globeRef.current = globe;

        function createEarth() {
            const texture = new THREE.TextureLoader().load(earthTexture);
            // const alpha = new THREE.TextureLoader().load(earthAlpha);
            // Create the sphere
            const sphere = new THREE.SphereBufferGeometry(200, 50, 50);
            // Map the texture to the material. 
            const material = new THREE.MeshBasicMaterial({
                map: texture
                // alphaMap: alpha,
                // side: THREE.DoubleSide,
                // transparent: false,
            });
            // Create a new mesh with sphere geometry.
            const mesh = new THREE.Mesh(sphere, material);

            mesh.rotation.y = LONGITUDE_OFFSET;

            return mesh;
        }

        function createPointer() {
            const geometry = new THREE.OctahedronBufferGeometry(5);
            const material = new THREE.MeshBasicMaterial({color: 0xffff00});
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = 205;
            return mesh;
        }

        const pointerContainer = new THREE.Group();
        pointerContainer.add(createPointer());
        pointerContainerRef.current = pointerContainer;

        // globe.add(pointerContainer);
        globe.add(createEarth());
    }, []);

    useEffect(() => {
        let animId;

        const animation = anime({
            targets: globeRef.current.rotation,
            x: props.lat * Math.PI / 180,
            y: props.long * -Math.PI / 180,
            duration: 2000,
            easing: "cubicBezier(0.425, 0.030, 0.285, 1.000)",
            // complete: () => cancelAnimationFrame(animId),
            autoplay: false
        });

        pointerContainerRef.current.rotation.x = -props.lat * Math.PI / 180;
        pointerContainerRef.current.rotation.y = -props.long * -Math.PI / 180;

        requestAnimationFrame(render);

        function render(now) {
            animId = requestAnimationFrame(render);
            animation.tick(now);
            globeRef.current.rotation.y += 0.0002;
            renderRef.current();
        }

        return function cleanup() {
            cancelAnimationFrame(animId);
        }
    }, [props.lat, props.long]);

    return <canvas className="earth" ref={canvasRef}></canvas>;
}

export default Earth;
