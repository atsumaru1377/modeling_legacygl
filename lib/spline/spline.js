import MyVec from "./myVec";
import MyMat from "./myMat";

const generateKnots = (points, knotsKind, num, degree) => {
    var knots = Array(num).fill(0);
    knots[0] = 0;
    if (knotsKind == "uniform") {
        for (let i = 1; i < num; i++) {
            knots[i] = knots[i-1] + 1;
        }
    } else if (knotsKind == "chordal") {
        for (let i = 1; i < num; i++) {
            knots[i] = knots[i-1] + (MyVec.norm2(MyVec.sub(points[i], points[i-1])));
        }
    } else if (knotsKind == "centripetal") {
        for (let i = 1; i < num; i++) {
            knots[i] = knots[i-1] + Math.sqrt(MyVec.norm2(MyVec.sub(points[i], points[i-1])));
        }
    } else if (knotsKind == "openUniform") {
        for (let i = 0; i < degree; i++) {
            knots[i] = 0;
            knots[num-1 - i] = 1;
        } 
        for (let i = 0; i < num - 2*degree; i++) {
            knots[i+degree] = i / (num-1 - 2*degree);
        }
    }
    return knots;
} 

const cutmullRomSpline_sub = (points, knots, num_sample) => {
    var curve = MyMat.init(num_sample+1,3);
    var t = 0;
    for (let i = 0; i <= num_sample; i++) {
        t = knots[1] + (knots[2] - knots[1]) * i / num_sample;
        const l01 = MyVec.addmul(
            points[0], (knots[1] - t)/(knots[1] - knots[0]),
            points[1], (t - knots[0])/(knots[1] - knots[0]));
        const l12 = MyVec.addmul(
            points[1], (knots[2] - t)/(knots[2] - knots[1]),
            points[2], (t - knots[1])/(knots[2] - knots[1]));
        const l23 = MyVec.addmul(
            points[2], (knots[3] - t)/(knots[3] - knots[2]),
            points[3], (t - knots[2])/(knots[3] - knots[2]));
        const q02 = MyVec.addmul(
            l01, (knots[2] - t)/(knots[2] - knots[0]),
            l12, (t - knots[0])/(knots[2] - knots[0]));
        const q13 = MyVec.addmul(
            l12, (knots[3] - t)/(knots[3] - knots[1]),
            l23, (t - knots[1])/(knots[3] - knots[1]));
        const c03 = MyVec.addmul(
            q02, (knots[2] - t)/(knots[2] - knots[1]),
            q13, (t - knots[1])/(knots[2] - knots[1]));
        curve[i] = c03;    
    }
    return curve;
}

const cutmullRomSpline = (points, knotsKind, num_sample) => {
    const knots = 
        (knotsKind == "chordal") ? generateKnots(points, "chordal", 4, 1) :
        (knotsKind == "centripetal") ? generateKnots(points, "centripetal", 4, 1) :
        generateKnots(points, "uniform", 4, 1);
    const num_points = points.length;
    const virtual_points = [points[0]].concat(points).concat([points[num_points-1]]);
    var curve = MyMat.init(num_points - 1, num_sample);
    for (let i = 0; i < num_points - 1; i++) {
        curve[i] = cutmullRomSpline_sub(virtual_points.slice(i,i+4), knots, num_sample);
    }
    return curve.flat();
}

const bSpline_basis = (j, k, t, knots) => {
    if (k == 0) {
        if (knots[j] <= t && t <= knots[j+1]) {
            return 1;
        } else {
            return 0;
        }
    } else {
        const a = ((t - knots[j])/(knots[j+k] - knots[j]));
        const b = bSpline_basis(j, k-1, t, knots); 
        const c = ((knots[j+k+1] - t)/(knots[j+k+1] - knots[j+1]));
        const d = bSpline_basis(j+1, k-1, t, knots);
        if (a == 0 || b == 0) {
            if (c == 0 || d == 0) {
                return 0;
            } else {
                return c * d
            }
        } else {
            if (c == 0 || d == 0) {
                return a * b;
            } else {
                return a * b + c * d;
            }
        }
    }
}

const bSpline = (points, n, knotsKind, num_sample) => {
    const m = points.length + n + 1;
    const knots = generateKnots(points, knotsKind, m, n);
    var curve = MyMat.init(num_sample+1, 3);
    for (let l = 0; l <= num_sample; l++) {
        curve[l] = [0,0,0]
        const t = knots[n] + (knots[m-n-1] - knots[n]) * l/num_sample;
        for (let i = 0; i < m - n - 1; i++) {
            curve[l] = MyVec.addmul(curve[l], 1, points[i], bSpline_basis(i, n, t, knots));
        }
    }
    curve[0] = JSON.parse(JSON.stringify(points[0]));
    curve[num_sample] = JSON.parse(JSON.stringify(points[points.length-1]));
    return [points[0]].concat(curve).concat([points[points.length-1]]);
}

export {
    cutmullRomSpline,
    bSpline
}
