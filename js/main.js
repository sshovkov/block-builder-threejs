import { setupScene } from './sceneSetup.js';
import { setupControls } from './controlsSetup.js';
import { createLegoBrick } from './legoBrick.js';
import { createBase } from './base.js';
import { setupLightingAndAxes } from './lightingAndAxes.js';
import { startRendering } from './rendering.js';

const { scene, camera, renderer } = setupScene();

const base = createBase();
scene.add(base);

const legoBrick = createLegoBrick();
scene.add(legoBrick);

setupLightingAndAxes(scene);

const { controls } = setupControls(camera, renderer, [legoBrick]);

startRendering(scene, camera, renderer, controls);