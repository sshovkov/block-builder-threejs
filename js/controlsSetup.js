import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from '../node_modules/three/examples/jsm/controls/DragControls.js';
import { TransformControls } from '../node_modules/three/examples/jsm/controls/TransformControls.js';

export function setupControls(camera, renderer, objects) {
    // Create orbit controls for rotating the scene
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2 - 0.4; // radians
    controls.maxPolarAngle = Math.PI / 2 - 0.4; // radians

    // Create drag controls for moving objects around
    const dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.transformGroup = true;

    let startY;

    dragControls.addEventListener('dragstart', function (event) {
        controls.enabled = false;
        startY = event.object.position.y;
    });

    dragControls.addEventListener('drag', function (event) {
        // Reset Y position back to its initial value
        event.object.position.y = startY;
    });

    dragControls.addEventListener('dragend', function (event) {
        controls.enabled = true;
    });

    return { controls, dragControls };
}