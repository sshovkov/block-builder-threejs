import * as THREE from 'three';
import { Colors, LegoColors, LegoDimensions } from './constants.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// Global variables
let camera, scene, renderer;
let pointer, raycaster, isShiftKeyDown = false;
let hoverLegoMesh, hoverLegoMaterial;
let legoGeometry, legoMaterial;
let plane;
let orbitControls;
const objects = []; // Objects that raycaster should consider when performing intersection checks
let orbitControlsEnabled = false; // Global variable to track OrbitControls state

init();
render();
animate();

function init() {

    // Camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(400, 800, 1200); // x, y, z
    camera.lookAt(0, 0, 0);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(Colors.Blue2);

    // Transparent Lego guide
    const hoverLegoGeometry = new THREE.BoxGeometry(LegoDimensions.Width, LegoDimensions.Height, LegoDimensions.Depth);
    hoverLegoMaterial = new THREE.MeshBasicMaterial({ color: LegoColors.Green, opacity: 0.5, transparent: true });
    hoverLegoMesh = new THREE.Mesh(hoverLegoGeometry, hoverLegoMaterial);
    scene.add(hoverLegoMesh);

    // Lego brick
    legoGeometry = new THREE.BoxGeometry(LegoDimensions.Width, LegoDimensions.Height, LegoDimensions.Depth);

    // Grid
    const gridHelper = new THREE.GridHelper(1000, 20, Colors.White, Colors.Blue1);
    scene.add(gridHelper);

    // Raycaster
    raycaster = new THREE.Raycaster(); // what objects in the 3D space the mouse is over
    pointer = new THREE.Vector2(); // mouse position in 2D space

    // Invisible plane of coordinates to track mouse position
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000); // same as grid size
    // default orientation of the plane is XY, but we want it to be XZ, parallel to the grid
    planeGeometry.rotateX(- Math.PI / 2); // rotate plane 90 degrees counterclockwise around the x-axis
    const planeMaterial = new THREE.MeshBasicMaterial({ visible: false })
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(plane);

    // Add plane to objects array so that raycaster can consider it when performing intersection checks
    objects.push(plane);

    // Lighting
    // Ambient light - lights up all objects in the scene
    const ambientLight = new THREE.AmbientLight(Colors.Gray, 2);
    scene.add(ambientLight);

    // Directional light - light source at an angle
    const directionalLight = new THREE.DirectionalLight(Colors.White, 3);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); // adjust for resolution of device
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Event listeners
    document.addEventListener('pointermove', onPointerMove); // user moves the mouse pointer
    document.addEventListener('pointerdown', onPointerDown); // user presses a mouse button
    document.addEventListener('keydown', onKeyDown); // user presses a key
    document.addEventListener('keyup', onKeyUp); // user releases a key
    window.addEventListener('resize', onWindowResize);

    // Orbit controls
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = orbitControlsEnabled; // Set the initial state
    orbitControls.update()
}

/**
 * 
 * @param {*} event 
 * The pointermove event is fired when the mouse is moved.
 * When the mouse moves, snap the position of the hoverLegoMesh to the nearest grid intersection.
 */
function onPointerMove(event) {
    // Hide hover guide if orbit controls are enabled
    if (orbitControlsEnabled) {
        hoverLegoMesh.visible = false;
        return
    }
    if (!isShiftKeyDown) hoverLegoMesh.visible = true;

    // Calculate normalized coordinates of the pointer within the window
    const pointerNormalizedXCoord = (event.clientX / window.innerWidth) * 2 - 1
    const pointerNormalizedYCoord = - (event.clientY / window.innerHeight) * 2 + 1
    // Set the pointer vector with the normalized coordinates
    pointer.set(pointerNormalizedXCoord, pointerNormalizedYCoord);

    // Cast a ray from the camera to the pointer
    raycaster.setFromCamera(pointer, camera);
    // Check for intersections between the ray projected from the pointer and the objects
    const intersections = raycaster.intersectObjects(objects, false);

    if (intersections.length > 0) {
        // Get the first intersection
        const intersect = intersections[0];

        // Set the position of the 'hoverLegoMesh' to snap to the nearest grid intersection
        hoverLegoMesh.position.copy(intersect.point).add(intersect.face.normal); // Sets the position of hoverLegoMesh to the intersection point, add() creates slight hovering effect
        hoverLegoMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

        // Render to visualize the changes
        render();
    }
}

/**
 * 
 * @param {*} event 
 * The pointerdown event is fired when the mouse is clicked.
 * When the mouse is clicked, create new Lego brick at the position of the hoverLegoMesh.
 */
function onPointerDown(event) {
    // Ignore right clicks and if orbit controls are enabled
    if (event.button !== 0 || orbitControlsEnabled) return;

    // // Calculate normalized coordinates of the mouse pointer within the window
    const pointerNormalizedXCoord = (event.clientX / window.innerWidth) * 2 - 1
    const pointerNormalizedYCoord = - (event.clientY / window.innerHeight) * 2 + 1
    // Set the pointer vector with the normalized coordinates
    pointer.set(pointerNormalizedXCoord, pointerNormalizedYCoord);

    // Cast a ray from the camera to the pointer
    raycaster.setFromCamera(pointer, camera);
    // Check for intersections between the ray projected from the pointer and the objects
    const intersections = raycaster.intersectObjects(objects, false);


    if (intersections.length > 0) {
        // Get the first intersection
        const intersect = intersections[0];

        // Check if shift key is pressed
        if (isShiftKeyDown) {
            // Remove lego brick at intersection point
            if (intersect.object !== plane) {
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object), 1);
            }
        } else {
            // Create a lego brick
            const randomColorValue = LegoColors[getRandomKey(LegoColors)];
            legoMaterial = new THREE.MeshLambertMaterial({ color: randomColorValue });
            const legoBrick = new THREE.Mesh(legoGeometry, legoMaterial);
            // Set the position of the new Lego brick at the nearest grid intersection
            legoBrick.position.copy(intersect.point).add(intersect.face.normal);
            legoBrick.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            scene.add(legoBrick);

            // Add the new Lego brick to the objects array for raycaster to consider it when performing intersection checks
            objects.push(legoBrick);
        }
        // Render to visualize the changes
        render();
    }

}
/**
 * 
 * @param {*} obj 
 * @returns random key from obj
 */
function getRandomKey(obj) {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * 
 * @param {*} event 
 * The keydown event is fired when a key is pressed.
 * When the shift key (code 16) is pressed, set isShiftKeyDown to true.
 */
function onKeyDown(event) {
    if (event.keyCode === 16) {
        isShiftKeyDown = true;
        hoverLegoMesh.visible = false;
    }
    if (event.keyCode === 27) { // Esc key
        orbitControlsEnabled = !orbitControlsEnabled;
        orbitControls.enabled = orbitControlsEnabled;
        updateStatusMessage()
    }
}

/**
 * 
 * @param {*} event 
 * The keyup event is fired when a key is not pressed.
 * When the shift key (code 16) is not pressed, set isShiftKeyDown to false.
 */
function onKeyUp(event) {
    if (event.keyCode === 16) {
        isShiftKeyDown = false;
        hoverLegoMesh.visible = true;
    }
}

/**
 * Update the status message to indicate whether orbit controls are enabled or disabled.
 */
function updateStatusMessage() {
    const statusDiv = document.getElementById('status');
    if (orbitControlsEnabled) {
        statusDiv.textContent = "Orbit control enabled.";
    } else {
        statusDiv.textContent = "Orbit control disabled.";
    }
}

/**
 * Resize the camera and renderer when the window is resized.
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

/**
 * Render the scene
 */
function render() {
    renderer.render(scene, camera)
}

/**
 * Animate function for continuous rendering and updates.
 */
function animate() {
    requestAnimationFrame(animate);

    if (orbitControlsEnabled) {
        orbitControls.update();
    }
    render();
}