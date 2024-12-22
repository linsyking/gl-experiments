precision mediump float;
attribute vec2 position;
uniform vec2 off;
uniform vec2 scale;
void main() {
    gl_Position = vec4(position.xy * scale + off, 0, 1);
}
