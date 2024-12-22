const regl = require('regl')()
import * as fs from 'fs';
const vertex = fs.readFileSync('src/texture/vert.glsl', 'utf8');
const fragment = fs.readFileSync('src/texture/frag.glsl', 'utf8');

const renderTexture = regl({
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
    texture: regl.prop('texture'),
    offset: regl.prop('offset')
  },

  elements: [
    0, 1, 2,
    0, 2, 3
  ],

  count: 6
})


export { renderTexture };
