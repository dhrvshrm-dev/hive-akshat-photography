// GLSL shared by more than one surface. Kept as strings in one place so the
// noise the hero dissolves with is literally the same noise the field below it
// ripples with — two different functions would read as two different sites.

/** Ashima's simplex noise, 2D. Cheap, tileable enough, no texture lookup. */
export const SIMPLEX_2D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}
`;

/** Rec. 709 luminance — the grey a photograph drains to when it loses focus. */
export const LUMINANCE = /* glsl */ `
vec3 toLuminance(vec3 c) {
    return vec3(dot(vec3(0.2126, 0.7152, 0.0722), c));
}
`;

/** object-fit: cover, as a uv transform about the centre. */
export const COVER_UV = /* glsl */ `
vec2 coverUv(vec2 uv, vec2 cover) {
    return (uv - 0.5) * cover + 0.5;
}
`;

/**
 * The plane's own vertex bend, shared by every photographic surface.
 *
 * The centre of the plane lags behind its edges by an amount proportional to
 * scroll velocity, which reads as weight — the image is heavy and the page is
 * dragging it. Divided by the plane's pixel height so the bend is a fixed number
 * of screen pixels whatever the plane was scaled to.
 */
export const SCROLL_BEND = /* glsl */ `
vec3 bendByScroll(vec3 pos, vec2 uv, float velocity, vec2 sizePx, float amount) {
    float across = sin(uv.x * 3.141592653589793);
    pos.y -= across * velocity * amount / max(sizePx.y, 1.0);
    return pos;
}
`;
