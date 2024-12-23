precision mediump float;
attribute vec3 position;
uniform vec2 x;
uniform vec2 y;
uniform vec2 z;
void main() {
    gl_Position = vec4(position.x * x.x + position.y * y.x + position.z * z.x, position.x * x.y + position.y * y.y + position.z * z.y, 0, 1);
}
