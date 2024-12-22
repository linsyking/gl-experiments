const regl = require('regl')()
import * as fs from 'fs';
const vertex = fs.readFileSync('src/texture/vert.glsl', 'utf8');
const fragment = fs.readFileSync('src/texture/frag.glsl', 'utf8');

const drawTexture = async function () {
  const image = new Image();
  image.src = 'enemy.png';
  await image.decode();

  return regl({
    frag: fragment,
    vert: vertex,
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
