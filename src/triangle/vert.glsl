precision mediump float;
attribute vec3 position;
uniform vec2 x;
uniform vec2 y;
uniform vec2 z;
varying vec2 vUv;
attribute vec2 uv;
void main() {
    vUv = uv;
    gl_Position = vec4(position.x * x.x + position.y * y.x + position.z * z.x, position.x * x.y + position.y * y.y + position.z * z.y, 0, 1);
}
