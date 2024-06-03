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

genRect(scene, gl);
genPoly(scene, gl);

requestAnimationFrame(update);
function update(t) {
    requestAnimationFrame(update);

    updateRect(t);
    updatePoly(t);
    renderer.render({ scene, camera });
}
