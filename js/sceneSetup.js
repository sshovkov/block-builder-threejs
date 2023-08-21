import * as THREE from '../node_modules/three/build/three.module.js';

export function setupScene() {

    // Create Scene
    const scene = new THREE.Scene();

    // Create Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500, 800, 1300)
    camera.lookAt(0, 0, 0)

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#233143");
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Resize canvas on resize window
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    })

    const gridHelper = new THREE.GridHelper(1000, 20);
    scene.add(gridHelper);

    return { scene, camera, renderer };
}