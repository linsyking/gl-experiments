// import * as regl from "regl";
const regl = require('regl')()

// Calling regl() creates a new partially evaluated draw comman
const drawTriangle = regl({
    frag: `
      precision mediump float;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        gl_FragColor.rgb = 0.5 + 0.3 * sin(vUv.yxx + uTime) + vec3(0.2, 0.0, 0.1);
        gl_FragColor.a = 1.0;
      }`,

    vert: `
      precision mediump float;
      attribute vec3 position;
      uniform vec2 x;
      uniform vec2 y;
      uniform vec2 z;
      varying vec2 vUv;
      attribute vec2 uv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.x*x.x + position.y*y.x+ position.z*z.x, position.x*x.y + position.y*y.y + position.z*z.y, 0, 1);
      }`,
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

const drawRect = regl({
    frag: `
      precision mediump float;
      uniform vec3 color;
      void main() {
        gl_FragColor = vec4(color, 1);
      }`,

    vert: `
      precision mediump float;
      attribute vec2 position;
      uniform vec2 off;
      uniform vec2 scale;
      void main() {
        gl_Position = vec4(position.xy *scale +off, 0, 1);
      }`,
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

// regl.frame() wraps requestAnimationFrame and also handles viewport changes
regl.frame(({ time }) => {
    // clear contents of the drawing buffer
    regl.clear({
        color: [0, 0, 0, 0],
        depth: 1
    })
    console.log(time)
    // draw a triangle using the command defined above
    let num = 40;
    for (let i = 0; i < num*2; i++) {
        for (let j = 0; j < num*2; j++) {
            // drawTriangle(-1+i/num+0.02, 1 - j/num-0.03)({
            //     color: [
            //         Math.cos(time * 0.001),
            //         Math.sin(time * 0.0008),
            //         Math.cos(time * 0.003),
            //         1
            //     ],
            //     offset : [0,0]
            // })
            let modd = (time % 10)/20;
            let xof = -1+i/num + modd;
            let yof = 1 - j/num;
            drawTriangle({
                x : [xof, yof],
                y : [0.02+xof, yof],
                z : [0.01 + xof, 0.02+yof],
                uTime : time + j/num
            })
            // drawRect({
            //     off : [xof,yof],
            //     scale : [0.01, 0.01]
            // })
        }
    }

})
