// import * as regl from "regl";
const regl = require('regl')()
import { readFileSync } from 'fs';

const renderRect = regl({
    frag: readFileSync('src/rect/frag.glsl', 'utf8'),
    vert: readFileSync('src/rect/vert.glsl', 'utf8'),
    attributes: {
        position: regl.buffer([
            [-1, -1], [+1, +1], [-1, +1],
            [-1, -1], [+1, -1], [+1, +1]
        ])
    },
    uniforms: {
        off: regl.prop('off'),
        scale: regl.prop('scale'),
        color: [1, 0, 0]
    },
    count: 6
})

const renderTriangle = regl({
    frag: readFileSync('src/triangle/frag.glsl', 'utf8'),
    vert: readFileSync('src/triangle/vert.glsl', 'utf8'),
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

const renderTexture = regl({
    frag: readFileSync('src/texture/frag.glsl', 'utf8'),
    vert: readFileSync('src/texture/vert.glsl', 'utf8'),
    attributes: {
        texc: [
            1, 1,
            1, 0,
            0, 0,
            0, 1,],
        position: [
            0.02, 0.02,
            0.02, -0.02,
            -0.02, -0.02,
            -0.02, 0.02,]
    },

    uniforms: {
        texture: regl.prop('texture'),
        offset: regl.prop('offset')
    },

    elements: [
        0, 1, 2,
        0, 2, 3
    ],

    count: 6
})

async function init() {
    const image = new Image();
    image.src = 'enemy.png';
    await image.decode();
    const texture = regl.texture(image);
    regl.frame(({ time }) => {
        regl.clear({
            color: [0, 0, 0, 0],
            depth: 1
        })

        // console.log(time)

        let num = 40;
        for (let i = 0; i < num * 2; i++) {
            for (let j = 0; j < num * 2; j++) {
                // drawTriangle(-1+i/num+0.02, 1 - j/num-0.03)({
                //     color: [
                //         Math.cos(time * 0.001),
                //         Math.sin(time * 0.0008),
                //         Math.cos(time * 0.003),
                //         1
                //     ],
                //     offset : [0,0]
                // })
                let modd = (time % 4) / 2;
                let xof = -1 + i / num + modd;
                let yof = 1 - j / num;
                // renderTriangle({
                //     x: [xof, yof],
                //     y: [0.02 + xof, yof],
                //     z: [0.01 + xof, 0.02 + yof],
                //     uTime: time + j / num
                // })
                renderTexture({
                    texture,
                    offset: [xof, yof]
                })
                // renderRect({
                //     off : [xof,yof],
                //     scale : [0.01, 0.01]
                // })
            }
        }
    })
}

init()
