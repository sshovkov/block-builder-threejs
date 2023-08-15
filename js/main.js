import * as THREE from '../node_modules/three/build/three.module.js';
import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
camera.position.z = 3
camera.position.y = 2
camera.position.x = 3;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Responsive canvas
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

// Trackball Controls for Camera 
const controls = new TrackballControls(camera, renderer.domElement);
controls.rotateSpeed = 4;
controls.dynamicDampingFactor = 0.15;

// Axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper); // X == red, Y == green, Z == blue

// Lighting
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(1, 5, 3);
scene.add(directionalLight);


// Create Box
const boxWidth = 2;
const boxHeight = 1.25;
const boxDepth = 2;

const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

// Create Cylinders
const cylinderX = 0.5
const cylinderZ = 0.4
const cylinderParams = [
    { x: cylinderX, z: cylinderZ },
    { x: cylinderX, z: -cylinderZ },
    { x: -cylinderX, z: cylinderZ },
    { x: -cylinderX, z: -cylinderZ }
];

const cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });

for (const param of cylinderParams) {
    const cylinderGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.5, 32);
    const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinderMesh.position.y = boxHeight / 2;
    cylinderMesh.position.x = param.x;
    cylinderMesh.position.z = param.z;
    scene.add(cylinderMesh);
}

// Rendering
const rendering = function () {
    requestAnimationFrame(rendering);
    // Rotate box
    // scene.rotation.z -= 0.005;
    // scene.rotation.x -= 0.01;
    renderer.render(scene, camera);

    // Update trackball controls
    controls.update();
}
rendering();