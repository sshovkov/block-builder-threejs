import * as THREE from '../node_modules/three/build/three.module.js';

export function setupLightingAndAxes(scene) {
    // Create axes
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Create light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(1, 5, 3);
    scene.add(directionalLight);
}