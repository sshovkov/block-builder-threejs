import { TrackballControls } from '../node_modules/three/examples/jsm/controls/TrackballControls.js';
import { DragControls } from '../node_modules/three/examples/jsm/controls/DragControls.js';

export function setupControls(camera, renderer, objects) {
    // Create trackball controls for rotating the scene
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;
    controls.dynamicDampingFactor = 0.15;

    // Create drag controls for moving objects around
    const dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.transformGroup = true;

    dragControls.addEventListener('dragstart', function (event) {
        controls.enabled = false;
    });

    dragControls.addEventListener('dragend', function (event) {
        controls.enabled = true;
    });

    return { controls, dragControls };
}