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
        }`,

    vert: `
        precision mediump float;
        attribute vec2 position;
        attribute vec2 texc;
        uniform vec2 offset;
        varying vec2 uv;
        void main () {
          uv = texc;
          gl_Position = vec4(-position+offset, 0, 1);
        }`,

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
      texture: regl.texture(image),
      offset: regl.prop('offset')
    },

    elements: [
      0, 1, 2,
      0, 2, 3
    ],

    count: 6
  })
}

export { drawTexture };
