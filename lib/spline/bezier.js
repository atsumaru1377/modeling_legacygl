import MyVec from "./myVec";
import MyMat from "./myMat";
import deepCopy from "../deepcopy";

const fact = (num) => {
    if (num == 0) {return 1;}
    else return num * fact(num - 1);
}

const combination = (n,k) => {
    var facts = Array(n);
    facts[0] = 1;
    for (let i = 1; i <= n; i++) {
    facts[i] = facts[i-1] * i;
    }
    return facts[n]/(facts[k]*facts[n-k]);
}


const bernstein_basis = (n, i, t) => {
    return combination(n,i) * (t**i) * ((1-t)**(n-i));
}

const evalQuadraticBezier = (points, t) => {
    const p0 = points[0];
    const p1 = points[1];
    const p2 = points[2];
    const p01 = MyVec.addmul(p0, 1 - t, p1, t);
    const p12 = MyVec.addmul(p1, 1 - t, p2, t);
    const p012 = MyVec.addmul(p01, 1 - t, p12, t);
    return p012;
}

const evalGeneralBezier = (points, t) => {
    const n = points.length - 1;
    var p_t = Array(points[0].length).fill(0);
    for (let i = 0; i <= n; i++) {
    p_t = MyVec.addmul(p_t, 1, points[i], bernstein_basis(n,i,t));
    }
    return p_t;
}

const deCasteljau = (points, t) => {
    const n = points.length - 1;
    var points_j = deepCopy(points);
    for (let j = 0; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
        points_j[i] = MyVec.addmul(points_j[i], 1 - t, points_j[i+1], t);
    }
    }
    return points_j[0];
}

const bezierAdjustSampling = (points, t_start, t_end, start_sample, end_sample) => {
    const num_points = points.length;
    const t_mid = (t_start + t_end)/2;
    const mid_sample = deCasteljau(points, t_mid);
    const len_line = MyVec.norm2(MyVec.sub(end_sample, start_sample));
    const dist_pt = MyVec.dist(mid_sample, start_sample, end_sample);
    if (Math.abs(dist_pt/len_line) < 0.01) {
    return [mid_sample];
    } else {
    const samples_formar = bezierAdjustSampling(points, t_start, t_mid, start_sample, mid_sample);
    const samples_latter = bezierAdjustSampling(points, t_mid, t_end, mid_sample, end_sample);
    return samples_formar.concat([mid_sample], samples_latter);
    }
}

const evalRationalBezierWeights = (n, weights, t) => {
    var rational_weights = Array(n).fill(0);
    var sum_weights = 0;
    for (let i = 0; i <= n; i++) {
    rational_weights[i] = bernstein_basis(n,i,t)*weights[i];
    sum_weights = sum_weights + rational_weights[i];
    }
    for (let i = 0; i <= n; i++) {
    rational_weights[i] = rational_weights[i]/sum_weights;
    }
    return rational_weights;
}

const rationalBezier = (points, t, weights) => {
    const n = points.length - 1;
    var p_t = Array(points[0].length).fill(0);
    const rational_weights = evalRationalBezierWeights(n, weights, t);
    for (let i = 0; i <= n; i++) {
    p_t = MyVec.addmul(p_t, 1, points[i], rational_weights[i]);
    }
    return p_t;
}

export {
    evalQuadraticBezier,
    evalGeneralBezier,
    bezierAdjustSampling,
    rationalBezier
}