import * as THREE from '../node_modules/three/build/three.module.js'

export function createLegoBrick() {
    // Create Group
    const group = new THREE.Group();

    // Create Box
    const boxWidth = 50
    const boxHeight = 31.25;
    const boxDepth = 50;

    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    group.add(boxMesh);

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
        group.add(cylinderMesh);
    }
    group.castShadow = true;
    group.receiveShadow = false;

    return { group };
}