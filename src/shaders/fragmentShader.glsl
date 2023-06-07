varying vec3 vPosition;
uniform vec3 uColor1;
uniform vec3 uColor2;

void main() {
    vec3 color = vec3(1.0, 1.0, 1.0); 

    float depth = vPosition.z * 0.5 * 0.5;
    // color = vec3(vPosition.x,vPosition.y/0.5,vPosition.z);
    // color = vec3(1.0,1.0,0.0)

    // color = mix(uColor1, uColor2, 1.0);
    // color = uColor1 * (1.0 - depth) + uColor2 * depth;
    gl_FragColor = vec4(1.0,0.65,0.0, depth+0.25);
}
