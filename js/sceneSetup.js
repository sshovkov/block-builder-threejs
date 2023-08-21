import * as THREE from '../node_modules/three/build/three.module.js';

export function setupScene() {
    // Create Scene
    const scene = new THREE.Scene();
    // Create Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
    camera.position.z = 3;
    camera.position.y = 2;
    camera.position.x = 3;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#233143");
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Resize canvas on resize window
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    return { scene, camera, renderer };
}