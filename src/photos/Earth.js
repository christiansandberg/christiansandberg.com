import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import earthTexture from './8081_earthlights4k.jpg';
// import earthAlpha from './earth-alpha.jpg';


const LONGITUDE_OFFSET = -Math.PI / 2;


function Earth(props) {
    const canvasRef = useRef();
    const globeRef = useRef();
    const curveRef = useRef();
    const startAnimationRef = useRef(0);

    useEffect(() => {
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            // alpha: true,
            antialias: true
        });

        const camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 0.1, 10000);
        // camera.autoUpdate = false;
        camera.position.set(0, 0, 450);

        const scene = new THREE.Scene();
        // scene.autoUpdate = false;
        scene.background = new THREE.Color(0x111111);

        scene.add(camera);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);

        const globe = new THREE.Object3D();
        scene.add(globe);
        globeRef.current = globe;

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

        // Add mesh to globe
        globe.add(mesh);

        function render(now) {
            if (curveRef.current) {
                const t = (now - startAnimationRef.current) / 2000;
                const v = curveRef.current.getPoint(Math.min(t, 1));
                globe.rotation.x = v.x;
                globe.rotation.y = v.y;
            }

            renderer.render(scene, camera);

            requestAnimationFrame(render);
        }

        render(0);
    }, []);

    useEffect(() => {
        curveRef.current = new THREE.LineCurve(
            new THREE.Vector2(globeRef.current.rotation.x, globeRef.current.rotation.y),
            new THREE.Vector2(props.lat * Math.PI / 180, props.long * -Math.PI / 180 + LONGITUDE_OFFSET)
        );
        startAnimationRef.current = performance.now();
    }, [props.lat, props.long]);

    return <canvas className="earth" ref={canvasRef}></canvas>;
}

export default Earth;
