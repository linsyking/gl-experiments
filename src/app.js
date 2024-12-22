import { Renderer, Camera, Transform } from "ogl";
import { genRect, updateRect } from "./rect/rect";
import { genPoly, updatePoly } from "./poly/poly";

const renderer = new Renderer({ antialias: true });
const gl = renderer.gl;
document.body.appendChild(gl.canvas);
gl.clearColor(1, 1, 1, 1);

const camera = new Camera(gl);
camera.position.z = 5;

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
}
window.addEventListener('resize', resize, false);
resize();

const scene = new Transform();

// genPoly(scene, gl);
const r1 = genRect(scene, gl, -4, 0);

for (let i = -10; i < 10; i++) {
    for (let j = -10; j < 10; j++) {
        genRect(scene, gl, i/3, j/3);
    }
}
requestAnimationFrame(update);
function update(t) {
    requestAnimationFrame(update);

    // updatePoly(t);
    updateRect(r1, t);

    renderer.render({ scene, camera });
    scene.remove
}
