import * as THREE from 'three/build/three.module.js';

export function setupLightingAndAxes(scene) {
    // Create light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(1, 5, 3);
    scene.add(directionalLight);
}