// attribute vec3 position;
attribute vec3 aRandom;


varying vec3 vPosition;
uniform float uTime;
uniform float uScale;


void main() {
    vPosition = position;

    vec3 pos = position;
    float time = uTime*4.0;
    pos.x += sin(time* aRandom.x)* 0.01;
    pos.y += sin(time * aRandom.y)* 0.01;
    pos.z += sin(time * aRandom.z)* 0.01;

    pos *= uScale;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 8.0 / -mvPosition.z;
}