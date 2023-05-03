import MyVec from "./myVec";
import MyMat from "./myMat";
import deepCopy from "../deepcopy";
import { evalGeneralBezier } from "./bezier";

const illustrator = (curve_points, control_points, num_samples) => {
    const len = control_points[0].length;
    var samples = [];
    for (let i = 0; i < len - 1; i++) {
        const p0 = curve_points[i];
        const p1 = curve_points[i+1];
        const b0 = control_points[1][i];
        const b1 = control_points[0][i+1];
        console.log(p0,p1,b0,b1);
        for (let t_ = 0; t_ <= num_samples; t_++) {
            const t = t_ / num_samples;
            samples.push(evalGeneralBezier([p0,b0,b1,p1],t));
        }
    }
    return samples;
}

export default illustrator;