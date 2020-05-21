import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';


function Rain() {
    const canvasRef = useRef(null);

    useEffect(() => {
        let reqAnimId = null;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true
        });
    
        // renderer.setClearColor(0x111111);
    
        const scene = new THREE.Scene();
        // scene.autoUpdate = false;
        // scene.fog = new THREE.FogExp2(0x11111f, 0.002);

        const camera = new THREE.PerspectiveCamera(30, 3 / 2, 0.1, 1000);
        camera.autoUpdate = false;
        // Photo shot with Canon 350D
        camera.filmGauge = 22.2;
        // With a focal length of 10 mm
        camera.setFocalLength(10);
    
        camera.position.y = 20;
        camera.rotation.x = 0.025;
        // Camera will never move
        camera.matrixAutoUpdate = false;
        camera.updateMatrix();

        const vertices = new Float32Array(500 * 3);
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 0] = THREE.MathUtils.randFloat(-100, 100);
            vertices[i + 1] = THREE.MathUtils.randFloat(0, 100) + 100;
            vertices[i + 2] = THREE.MathUtils.randFloat(-60, -160);
        }
        const positions = new THREE.BufferAttribute(vertices, 3);
        positions.usage = THREE.DynamicDrawUsage;

        const rain = new THREE.Points();
        rain.geometry.setAttribute("position", positions);
        // rain.material.color = new THREE.Color(0xeeeeee);
        rain.material.size = 1.3;
        rain.material.sizeAttenuation = false;
        rain.matrixAutoUpdate = false;
        rain.updateMatrix();
        scene.add(rain);

        function onResize() {
            const width = window.innerWidth - 50;
            const height = window.innerHeight - 80;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(width, height);
        }

        onResize();
        window.addEventListener("resize", onResize);

        function render() {
            for (let i = 0; i < vertices.length; i += 3) {
                // Speed due to gravity
                vertices[i + 1] -= 3;
                // Speed due to wind
                vertices[i + 2] += 2;
                // When drop hits the ground, reset it
                if (vertices[i + 1] < 0) {
                    vertices[i + 0] = THREE.MathUtils.randFloat(-100, 100);
                    vertices[i + 1] = 100;
                    vertices[i + 2] = THREE.MathUtils.randFloat(-60, -100);
                }
            }
            positions.needsUpdate = true;
            renderer.render(scene, camera);
            reqAnimId = requestAnimationFrame(render);
        }

        render();

        return function cleanup() {
            cancelAnimationFrame(reqAnimId);
            window.removeEventListener("resize", onResize);
        }
    }, []);

    return <canvas className="rain" ref={canvasRef}></canvas>;
}

export default Rain;
