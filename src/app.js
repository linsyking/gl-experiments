import { Renderer, Camera, Transform, Geometry, Program, Mesh } from "ogl";
import * as fs from 'fs';

const vertex = fs.readFileSync('src/shader/vert.glsl', 'utf8');

const fragment = fs.readFileSync('src/shader/frag.glsl', 'utf8');

const renderer = new Renderer();
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

// 4 vertices, using 6 indices to designate 2 triangles using the default gl.TRIANGLES draw mode
const indexedGeometry = new Geometry(gl, {
    position: {
        size: 3,
        data: new Float32Array([
            -0.5,
            0.5,
            0, // vertex 0
            -0.5,
            -0.5,
            0, // vertex 1
            0.5,
            0.5,
            0, // vertex 2
            0.5,
            -0.5,
            0, // vertex 3
        ]),
    },
    uv: {
        size: 2,
        data: new Float32Array([
            0,
            1, // vertex 0
            1,
            1, // vertex 1
            0,
            0, // vertex 2
            1,
            0, // vertex 3
        ]),
    },

    // the indices attribute must use the name 'index' to be treated as an ELEMENT_ARRAY_BUFFER
    index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
});

const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
        uTime: { value: 0 },
    },
});

const indexedMesh = new Mesh(gl, { geometry: indexedGeometry, program });
indexedMesh.setParent(scene);
indexedMesh.position.y = 0;

requestAnimationFrame(update);
function update(t) {
    requestAnimationFrame(update);

    program.uniforms.uTime.value = t * 0.001;
    renderer.render({ scene, camera });
}
