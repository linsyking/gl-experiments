
const regl = require('regl')()
import * as fs from 'fs';

const vertex = fs.readFileSync('src/rect/vert.glsl', 'utf8');
const fragment = fs.readFileSync('src/rect/frag.glsl', 'utf8');

const drawRect = regl({
    frag: fragment,

    vert: vertex,
    attributes: {
        position: regl.buffer([
            [-1, -1], [+1, +1], [-1, +1],
            [-1, -1], [+1, -1], [+1, +1]
        ])
    },
    uniforms: {
        off: regl.prop('off'),
        scale: regl.prop('scale'),
        color: [1, 1, 0]
    },
    count: 6
})

export {drawRect};
