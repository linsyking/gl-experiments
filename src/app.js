let regl = null;
const readFileSync = require('fs').readFileSync;

const renderRect = () => [
    (x) => x
    , regl({
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
    })]

const renderTriangle = () => [
    (x) => x,
    regl({
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
            z: regl.prop('z')
        },
        count: 3
    })]

const renderTexture = () => [
    (x) => { x["texture"] = loadedTextures[x["texture"]]; return x },
    regl({
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
    })]

const programs = {
    renderRect,
    renderTriangle,
    renderTexture
}

const loadedPrograms = {};

const loadedTextures = {};

let ElmApp = null;

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

function loadTexture(texture_name, texture_url) {
    // Initialize textures
    const image = new Image();
    image.src = texture_url;
    image.onload = () => {
        loadedTextures[texture_name] = regl.texture(image);
        // Response to Elm
        console.log("Texture loaded: " + texture_url)
        app.ports.textureLoaded.send({
            success: true,
            texture: texture_name,
            width: image.width,
            height: image.height
        });
    }
    image.onerror = () => {
        console.error("Error loading texture: " + texture_url)
        alert("Error loading texture: " + texture_url)
    }
}

function loadGLProgram(prog_name) {
    // Initialize program
    loadedPrograms[prog_name] = programs[prog_name]()
    // Response to Elm
}

let resolver = null;

async function setView(view) {
    gview = view;
    resolver();
}

function updateElm(delta) {
    return new Promise((resolve, _) => {
        resolver = resolve;
        ElmApp.ports.reglupdate.send(delta);
    });
}

async function step(t) {
    // regl.poll();
    // const t1 = performance.now();
    await updateElm(t / 1000);
    // const t2 = performance.now();
    // console.log("Time to update Elm: " + (t2 - t1) + "ms");

    // Render view
    if (gview) {
        for (let i = 0; i < gview.length; i++) {
            let v = gview[i];
            if (v.cmd == 0) { // Render commands
                const p = loadedPrograms[v.program];
                p[1](p[0](v.args));
            } else if (v.cmd == 1) { // REGL commands
                regl[v.name](v.args);
            } else {
                console.error("Unknown command: " + v.cmd);
            }
        }
    }

    // const t3 = performance.now();
    // console.log("Time to render view: " + (t3 - t2) + "ms");
    regl._gl.flush();
    requestAnimationFrame(step);
}

function start() {
    requestAnimationFrame(step);
}

function init(canvas, app) {
    ElmApp = app;
    regl = require('regl')(canvas);
    loadGLProgram('renderTexture');
    loadGLProgram('renderTriangle');
    loadGLProgram('renderRect');
}

globalThis.elmregl = {}
globalThis.elmregl.loadTexture = loadTexture
globalThis.elmregl.loadGLProgram = loadGLProgram
globalThis.elmregl.setView = setView
globalThis.elmregl.start = start
globalThis.elmregl.init = init
