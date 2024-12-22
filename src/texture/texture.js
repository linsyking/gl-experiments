const regl = require('regl')()

const drawTexture = async function () {
    const image = new Image();
    image.src = 'enemy.png';
    await image.decode();

    return regl({
        frag: `
        precision mediump float;
        uniform sampler2D texture;
        varying vec2 uv;
        void main () {
          gl_FragColor = texture2D(texture, uv);
        //   gl_FragColor = vec4(1,0,0,1);
        }`,
    
        vert: `
        precision mediump float;
        attribute vec2 position;
        varying vec2 uv;
        void main () {
          uv = position *0.5+0.5;
          gl_Position = vec4((position)*0.1, 0, 1);
        }`,
    
        attributes: {
            position: [
                -2, 0,
                0, -2,
                2, 2]
        },
    
        uniforms: {
            texture: regl.texture(image)
        },
    
        count: 3
    })
} 

export { drawTexture };
