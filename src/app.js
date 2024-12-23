let regl = null;
const readFileSync = require('fs').readFileSync;

const renderRect = () => regl({
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

const renderTriangle = () => regl({
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

const renderTexture = () => regl({
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

const programs = {
    renderRect,
    renderTriangle,
    renderTexture
}

const loadedPrograms = {};

const loadedTextures = {};

let gview = [];

async function initTest() {
    const image = new Image();
    image.src = 'test/enemy.png';
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

function loadTexture(app, texture_url, texture_name) {
    // Initialize textures
    const image = new Image();
    image.src = texture_url;
    image.onload = () => {
        loadedTextures[texture_name] = regl.texture(image);
        // Response to Elm
    }
    image.onerror = () => {
        console.error("Error loading texture: " + texture_url)
        // Response to Elm
    }
}

function loadGLProgram(app, prog_name) {
    // Initialize program
    loadedPrograms[prog_name] = programs[prog_name]()
    // Response to Elm
}

function setView(view) {
    gview = view;
}

async function start(app) {
    let lastTime = 0;
    regl.frame(({ time }) => {
        let delta = time - lastTime;
        lastTime = time;
        // regl.clear({
        //     color: [0, 0, 0, 0],
        //     depth: 1
        // })
        // console.log(time)
        // Call Elm Update
        app.ports.reglupdate.send(delta);

        // Render view
        for (let i = 0; i < gview.length; i++) {
            let v = gview[i];
            if (v.cmd == 0) { // Render commands
                loadedPrograms[v.program](v.args);
            } else if (v.cmd == 1) { // REGL commands
                regl[v.name](v.args);
            } else {
                console.error("Unknown command: " + v.cmd);
            }
        }
    })
}

function init(canvas) {
    regl = require('regl')(canvas);
}

globalThis.elmregl = {}
globalThis.elmregl.loadTexture = loadTexture
globalThis.elmregl.loadGLProgram = loadGLProgram
globalThis.elmregl.setView = setView
globalThis.elmregl.start = start
globalThis.elmregl.init = init
