import * as THREE from 'three/build/three.module.js';

export function createBase() {
    const baseGeometry = new THREE.BoxGeometry(10, 1 / 3, 10);
    const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.9583333333
    base.castShadow = false;
    base.receiveShadow = true;

    return base;
}