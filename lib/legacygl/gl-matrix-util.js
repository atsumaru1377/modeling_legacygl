// import glMatrix
import {
    mat2 as _mat2,
    mat2d as _mat2d,
    mat3 as _mat3,
    mat4 as _mat4,
    quat as _quat,
    quat2 as _quat2,
    vec2 as _vec2,
    vec3 as _vec3,
    vec4 as _vec4,
} from 'gl-matrix';

// mat2 in-place versions
const mat2 = Object.assign({},_mat2, {
    add_ip : ((a, b) => _mat2.add(a,a,b)),
    adjoint_ip : ((a) => _mat2.adjoint(a,a)),
    invert_ip : ((a) => _mat2.invert(a, a)),
    mul_ip : ((a, b) => _mat2.mul(a, a, b)),
    multiply_ip : ((a, b) => _mat2.multiply(a, a, b)),
    rotate_ip : ((a, rad) => _mat2.rotate(a, a, rad)),
    scale_ip : ((a, v) => _mat2.scale(a, a, v)),
    translate_ip : ((a, v) => _mat2.translate(a, a, v)),
    transpose_ip : ((a) => _mat2.transpose(a, a))
});

// mat2d in-place versions
const mat2d = Object.assign({},_mat2d,{
});

// mat3 in-place versions
const mat3 = Object.assign({}, _mat3, {
    add_ip : ((a, b) => _mat3.add(a, a, b)),
    adjoint_ip : ((a) => _mat3.adjoint(a, a)),
    invert_ip : ((a) => _mat3.invert(a, a)),
    mul_ip : ((a, b) => _mat3.mul(a, a, b)),
    multiply_ip : ((a, b) => _mat3.multiply(a, a, b)),
    rotate_ip : ((a, rad) => _mat3.rotate(a, a, rad)),
    scale_ip : ((a, v) => _mat3.scale(a, a, v)),
    translate_ip : ((a, v) => _mat3.translate(a, a, v)),
    transpose_ip : ((a) => _mat3.transpose(a, a))
});

// mat4 in-place versions
const mat4 = Object.assign({}, _mat4, {
    add_ip : ((a, b) => _mat4.add(a, a, b)),
    adjoint_ip : ((a) => _mat4.adjoint(a, a)),
    invert_ip : ((a) => _mat4.invert(a, a)),
    mul_ip : ((a, b) => _mat4.mul(a, a, b)),
    multiply_ip : ((a, b) => _mat4.multiply(a, a, b)),
    rotate_ip : ((a, rad, axis) => _mat4.rotate(a, a, rad, axis)),
    rotateX_ip : ((a, rad) => _mat4.rotateX(a, a, rad)),
    rotateY_ip : ((a, rad) => _mat4.rotateY(a, a, rad)),
    rotateZ_ip : ((a, rad) => _mat4.rotateZ(a, a, rad)),
    scale_ip : ((a, v) => _mat4.scale(a, a, v)),
    translate_ip : ((a, v) => _mat4.translate(a, a, v)),
    transpose_ip : ((a) => _mat4.transpose(a, a)),
    ortho2d : ((a, left, right, bottom, top) => _mat4.ortho(a, left, right, bottom, top, -1, 1))
});

// vec2 in-place versions
const vec2 = Object.assign({}, _vec2, {
    add_ip : ((a, b) => _vec2.add(a, a, b)),
    div_ip : ((a, b) => _vec2.div(a, a, b)),
    divide_ip : ((a, b) => _vec2.divide(a, a, b)),
    lerp_ip : ((a, b, t) => _vec2.lerp(a, a, b, t)),
    max_ip : ((a, b) => _vec2.max(a, a, b)),
    min_ip : ((a, b) => _vec2.min(a, a, b)),
    mul_ip : ((a, b) => _vec2.mul(a, a, b)),
    multiply_ip : ((a, b) => _vec2.multiply(a, a, b)),
    negate_ip : ((a) => _vec2.negate(a, a)),
    normalize_ip : ((a) => _vec2.normalize(a, a)),
    scale_ip : ((a, b) => _vec2.scale(a, a, b)),
    scaleAndAdd_ip : ((a, b, scale) => _vec2.scaleAndAdd(a, a, b, scale)),
    sub_ip : ((a, b) => _vec2.sub(a, a, b)),
    subtract_ip : ((a, b) => _vec2.subtract(a, a, b)),
    transformMat2_ip : ((a, m) => _vec2.transformMat2(a, a, m)),
    transformMat2d_ip : ((a, m) => _vec2.transformMat2d(a, a, m)),
    transformMat3_ip : ((a, m) => _vec2.transformMat3(a, a, m)),
    transformMat4_ip : ((a, m) => _vec2.transformMat4(a, a, m))
});

// vec3 in-place versions
const vec3 = Object.assign({}, _vec3, {
    add_ip : ((a, b) => _vec3.add(a, a, b)),
    cross_ip : ((a, b) => _vec3.cross(a, a, b)),
    div_ip : ((a, b) => _vec3.div(a, a, b)),
    divide_ip : ((a, b) => _vec3.divide(a, a, b)),
    lerp_ip : ((a, b, t) => _vec3.lerp(a, a, b, t)),
    max_ip : ((a, b) => _vec3.max(a, a, b)),
    min_ip : ((a, b) => _vec3.min(a, a, b)),
    mul_ip : ((a, b) => _vec3.mul(a, a, b)),
    multiply_ip : ((a, b) => _vec3.multiply(a, a, b)),
    negate_ip : ((a) => _vec3.negate(a, a)),
    normalize_ip : ((a) => _vec3.normalize(a, a)),
    scale_ip : ((a, b) => _vec3.scale(a, a, b)),
    scaleAndAdd_ip : ((a, b, scale) => _vec3.scaleAndAdd(a, a, b, scale)),
    sub_ip : ((a, b) => _vec3.sub(a, a, b)),
    subtract_ip : ((a, b) => _vec3.subtract(a, a, b)),
    transformMat3_ip : ((a, m) => _vec3.transformMat3(a, a, m)),
    transformMat4_ip : ((a, m) => _vec3.transformMat4(a, a, m)),
    transformQuat_ip : ((a, q) => _vec3.transformQuat(a, a, q))
});

// vec4 in-place versions
const vec4 = Object.assign({}, _vec4, {
    add_ip : ((a, b) => _vec4.add(a, a, b)),
    div_ip : ((a, b) => _vec4.div(a, a, b)),
    divide_ip : ((a, b) => _vec4.divide(a, a, b)),
    lerp_ip : ((a, b, t) => _vec4.lerp(a, a, b, t)),
    max_ip : ((a, b) => _vec4.max(a, a, b)),
    min_ip : ((a, b) => _vec4.min(a, a, b)),
    mul_ip : ((a, b) => _vec4.mul(a, a, b)),
    multiply_ip : ((a, b) => _vec4.multiply(a, a, b)),
    negate_ip : ((a) => _vec4.negate(a, a)),
    normalize_ip : ((a) => _vec4.normalize(a, a)),
    scale_ip : ((a, b) => _vec4.scale(a, a, b)),
    scaleAndAdd_ip : ((a, b, scale) => _vec4.scaleAndAdd(a, a, b, scale)),
    sub_ip : ((a, b) => _vec4.sub(a, a, b)),
    subtract_ip : ((a, b) => _vec4.subtract(a, a, b)),
    transformMat4_ip : ((a, m) => _vec4.transformMat4(a, a, m)),
    transformQuat_ip : ((a, q) => _vec4.transformQuat(a, a, q))
});

// quat in-place versions
const quat = Object.assign({}, _quat, {
    add_ip : ((a, b) => _quat.add(a, a, b)),
    calculateW_ip : ((a) => _quat.calculateW(a, a)),
    conjugate_ip : ((a) => _quat.conjugate(a, a)),
    invert_ip : ((a) => _quat.invert(a, a)),
    lerp_ip : ((a, b, t) => _quat.lerp(a, a, b, t)),
    mul_ip : ((a, b) => _quat.mul(a, a, b)),
    multiply_ip : ((a, b) => _quat.multiply(a, a, b)),
    normalize_ip : ((a) => _quat.normalize(a, a)),
    rotateX_ip : ((a, rad) => _quat.rotateX(a, a, rad)),
    rotateY_ip : ((a, rad) => _quat.rotateY(a, a, rad)),
    rotateZ_ip : ((a, rad) => _quat.rotateZ(a, a, rad)),
    scale_ip : ((a, b) => _quat.scale(a, a, b)),
    slerp_ip : ((a, b, t) => _quat.slerp(a, a, b, t))
});

// quat2 in-place versions
const quat2 = Object.assign({},_quat2,{
});


export {
    mat2,
    mat2d,
    mat3,
    mat4,
    quat,
    quat2,
    vec2,
    vec3,
    vec4
};