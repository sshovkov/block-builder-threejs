export function startRendering(scene, camera, renderer, controls) {
    const rendering = function () {
        requestAnimationFrame(rendering);
        renderer.render(scene, camera);
        controls.update();
    }
    rendering();
}