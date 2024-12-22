import { Geometry, Program, Mesh } from "ogl";
import * as fs from 'fs';

const vertex = fs.readFileSync('src/rect/vert.glsl', 'utf8');
const fragment = fs.readFileSync('src/rect/frag.glsl', 'utf8');


export function genRect(scene, gl, x, y) {
    // 4 vertices, using 6 indices to designate 2 triangles using the default gl.TRIANGLES draw mode
    const indexedGeometry = new Geometry(gl, {
        position: {
            size: 3,
            data: new Float32Array([
                -0.1,
                0.1,
                0, // vertex 0
                -0.1,
                -0.1,
                0, // vertex 0.1
                0.1,
                0.1,
                0, // vertex 2
                0.1,
                -0.1,
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

    program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
            uTime: { value: 0 },
        },
    });

    const indexedMesh = new Mesh(gl, { geometry: indexedGeometry, program });
    indexedMesh.setParent(scene);
    indexedMesh.position.x = x;
    indexedMesh.position.y = y;
    return indexedMesh;
}

export function updateRect(mesh, t) {
    mesh.program.uniforms.uTime.value = t * 0.001;
}
