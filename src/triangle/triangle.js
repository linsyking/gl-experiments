
const regl = require('regl')()
import * as fs from 'fs';
const vertex = fs.readFileSync('src/triangle/vert.glsl', 'utf8');
const fragment = fs.readFileSync('src/triangle/frag.glsl', 'utf8');

const drawTriangle = regl({
    frag: fragment,
    vert: vertex,
    attributes: {
        position: regl.buffer([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]),
        uv: [
            [0, 0],
            [1, 0],
            [0, 1]
        ]
    },
    uniforms: {
        x: regl.prop('x'),
        y: regl.prop('y'),
        z: regl.prop('z'),
        uTime: regl.prop('uTime')
    },
    count: 3
})

export {drawTriangle};
