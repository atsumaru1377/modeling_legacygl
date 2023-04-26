import MyVec from "./myVec";
import MyMat from "./myMat";
import { evalQuadraticBezier } from "./spline/bezier";

const bisection = (a, b, c, d) => {
    var t_start = 0;
    var t_end = 1;
    const f = (t) => a*t**3 + b*t**2 + c*t + d;
    while (t_end - t_start > 0.001) {
    var t_mid = (t_start + t_end) / 2;
    var f_start = f(t_start);
    var f_mid = f(t_mid);
    if (f_start*f_mid < 0) {
        t_end = t_mid;
    } else {
        t_start = t_mid;
    }
    }
    return t_start;
}

const bezierInterpolation = (p0, p1, p2, num_sample) => {
    const b0 = p0;
    const b2 = p2;
    const a = MyVec.norm2(MyVec.sub(p2,p0))**2;
    const b = 3*MyVec.dot(MyVec.sub(p2,p0), MyVec.sub(p0,p1));
    const c = MyVec.dot(MyVec.sub(MyVec.addmul(p0,3,p1,-2),p2), MyVec.sub(p0,p1));
    const d = -(MyVec.norm2(MyVec.sub(p0,p1))**2);
    const ti = bisection(a,b,c,d);
    const b1 = MyVec.scale(MyVec.sub(p1, MyVec.addmul(b0,(1-ti)**2,b2,ti**2)),1/(2*ti*(1-ti)));
    var curve = MyMat.init(num_sample+1,3);
    for (let i = 0; i <= num_sample/2; i++) {
    var t =  ti * 2*i/num_sample;
    curve[i] = evalQuadraticBezier([b0,b1,b2],t);
    }
    for (let i = 0; i <= num_sample/2; i++) {
    var t =  (1 - ti) * 2*i/num_sample + ti;
    curve[i+num_sample/2] = evalQuadraticBezier([b0,b1,b2],t);
    }
    return curve;
}

const circularInterpolation = (p0, p1, p2, num_sample) => {
    // midpoint
    const m01 = MyVec.addmul(p0, 1, MyVec.sub(p1, p0), 1/2);
    const m12 = MyVec.addmul(p1, 1, MyVec.sub(p2, p1), 1/2);
    const m20 = MyVec.addmul(p2, 1, MyVec.sub(p0, p2), 1/2);

    // normal
    const n01 = (p0 != p1) ? MyVec.normal(MyVec.sub(p1, p0)) : MyVec.scale(p1, 1/MyVec.norm2(p1));
    const n12 = (p1 != p2) ? MyVec.normal(MyVec.sub(p2, p1)) : MyVec.scale(p1, 1/MyVec.norm2(p1));
    const n20 = (p2 != p0) ? MyVec.normal(MyVec.sub(p0, p2)) : MyVec.scale(p1, 1/MyVec.norm2(p1));
    
    // len
    const len01 = 2*MyVec.norm2(m01);
    const len12 = 2*MyVec.norm2(m12);
    const len20 = 2*MyVec.norm2(m20);
    
    // 
    var m_a, m_b, n_a, n_b;
    if (len01 > len12 && len01 > len20) {
    m_a = m12;
    m_b = m20;
    n_a = n12;
    n_b = n20;
    
    } else if (len12 > len01 && len12 > len20) {
    m_a = m20;
    m_b = m01;
    n_a = n20;
    n_b = n01;
    } else {
    m_a = m01;
    m_b = m12;
    n_a = n01;
    n_b = n12;
    };
    
    // find intersection (center of circle)
    const dist = MyVec.dist(m_b, m_a, MyVec.add(m_a, n_a));
    const center1 = MyVec.addmul(m_b, 1, n_b, dist);
    const center = (MyVec.dist(center1,m_a,MyVec.add(m_a, n_a)) > dist) ? MyVec.addmul(m_b, 1, n_b, -dist) : center1;
    const v = MyVec.sub(p1, center);
    const radius = MyVec.norm2(MyVec.sub(p1, center));
    const pos_u = MyVec.scale(MyVec.normal(v),-radius);
    

    var curve = MyMat.init(num_sample+1, 3);
    const angle_p0 = MyVec.angle(pos_u, MyVec.sub(p0, center));
    const angle_p2 = MyVec.angle(pos_u, MyVec.sub(p2, center));
    const quadrant = (x, y) => {
    const sign_x = (x > 0) ? 1 : -1;
    const sign_y = (y > 0) ? 1 : -1;
    return 5/2 - (sign_x/2 + 1)*sign_y;
    }
    
    const q_p0 = quadrant(MyVec.dot(MyVec.sub(p0,center),pos_u), MyVec.dot(MyVec.sub(p0,center),v));
    const q_p2 = quadrant(MyVec.dot(MyVec.sub(p2,center),pos_u), MyVec.dot(MyVec.sub(p2,center),v));
    // clock : -1, counter_clock : 1;
    const direction = 
    (q_p0 == q_p2) ? ((angle_p0 > angle_p2) ? 1 : -1) :
    (q_p0 == 1) ? 1 :
    (q_p2 == 1) ? -1 :
    (q_p0 == 2) ? -1 :
    (q_p2 == 2) ? 1 :
    (q_p0 == 3) ? -1 :
    (q_p2 == 3) ? 1 :
    1;
    const u = MyVec.scale(pos_u, direction);
    const theta_start = 
    (direction == 1) ? (
        (q_p0 == 2 || q_p0 == 3) ? angle_p0 + Math.PI : angle_p0
    ) : (
        (q_p0 == 2 || q_p0 == 3) ? -angle_p0 : Math.PI - angle_p0
    ) ;
    const theta_end = 
    (direction == 1) ? (
        (q_p2 == 2 || q_p2 == 3) ? angle_p2 + Math.PI : angle_p2
    ) : (
        (q_p2 == 2 || q_p2 == 3) ? -angle_p2 : Math.PI - angle_p2
    ) ;
    
    for (let t = 0; t <= num_sample/2; t++) {
    var theta_t = theta_start + (Math.PI/2 - theta_start)*(t/(num_sample/2)) ;
    curve[t] = MyVec.add(MyVec.addmul(u,Math.cos(theta_t),v,Math.sin(theta_t)),center);
    }
    for (let t = 0; t <= num_sample/2; t++) {
    var theta_t = Math.PI/2 + (theta_end - Math.PI/2)*(t/(num_sample/2));
    curve[t+num_sample/2] = MyVec.add(MyVec.addmul(u,Math.cos(theta_t),v,Math.sin(theta_t)),center);
    }
    return curve;
}

const ellipticalInterpolation = (p0, p1, p2, num_sample) => {
    const len_p01 = MyVec.norm2(MyVec.sub(p0,p1));
    const len_p12 = MyVec.norm2(MyVec.sub(p2,p1));
    const prim_axis_end = p1;
    const seco_axis_end = (len_p01 > len_p12) ? p0 : p2;
    const refer_point = (len_p01 > len_p12) ? p2 : p0;
    const len_longer = (len_p01 > len_p12) ? len_p01 : len_p12;
    
    const circle_radius = (len_p01 > len_p12) ? len_p01 / 2 : len_p12 / 2;
    const center2seco = MyVec.scale(MyVec.sub(seco_axis_end, prim_axis_end),1/2)
    const circle_center = MyVec.addmul(prim_axis_end, 1, center2seco, 1);
    
    var start = (p0 == seco_axis_end) ? Math.PI : 0;
    //var end = MyVec.angle(MyVec.sub(p1,p0),MyVec.sub(p1,p2));
    var end = (p0 == seco_axis_end) ? 2*Math.PI : Math.PI;
    end = (end < 0) ? end + Math.PI : end;
    
    var ellipse_center = Array(3).fill(0);
    console.log(start,end)

    // bisection
    while (end - start > 0.001) {
    const mid = (start + end)/2;
    ellipse_center = MyVec.addmul(circle_center, 1, MyVec.rotate(center2seco,mid), 1);
    const a = MyVec.norm2(MyVec.sub(seco_axis_end,ellipse_center));
    const b = MyVec.norm2(MyVec.sub(prim_axis_end,ellipse_center));
    const c = Math.sqrt(Math.abs(a**2-b**2));
    const focus1 = 
        (a < b) ? MyVec.addmul(MyVec.sub(prim_axis_end, ellipse_center),c,ellipse_center,1) 
                : MyVec.addmul(MyVec.sub(seco_axis_end, ellipse_center),c,ellipse_center,1);
    const focus2 = 
        (a < b) ? MyVec.addmul(MyVec.sub(prim_axis_end, ellipse_center),-c,ellipse_center,1) 
                : MyVec.addmul(MyVec.sub(seco_axis_end, ellipse_center),-c,ellipse_center,1);
    const R_ellipse = MyVec.norm2(MyVec.sub(prim_axis_end, focus1)) + MyVec.norm2(MyVec.sub(prim_axis_end, focus2));
    const R_estimate = MyVec.norm2(MyVec.sub(refer_point,focus1)) + MyVec.norm2(MyVec.sub(refer_point,focus2));
    const eu = MyVec.normalize(MyVec.sub(seco_axis_end, ellipse_center));
    const ev = MyVec.normalize(MyVec.sub(prim_axis_end, ellipse_center));
    const center2refer = MyVec.sub(refer_point, ellipse_center);
    const refer_point_pos = (MyVec.dot(eu,center2refer)/a)**2 + (MyVec.dot(ev,center2refer)/b)**2
    if (refer_point_pos > 1) {
        start = mid;
    } else {
        end = mid;
    }
    console.log(seco_axis_end,prim_axis_end,ellipse_center, MyVec.sub(seco_axis_end,ellipse_center), MyVec.sub(prim_axis_end,ellipse_center))
    }
    
    console.log(ellipse_center);
    const u = MyVec.sub(seco_axis_end, ellipse_center);
    const v = MyVec.sub(prim_axis_end, ellipse_center);
    const theta_start = 0;
    const theta_end = Math.PI - MyVec.angle(u, MyVec.sub(refer_point, ellipse_center));
    var curve = MyMat.init(num_sample+1,3);
    for (let t = 0; t <= num_sample/2; t++) {
    var theta_t = theta_start + (Math.PI/2 - theta_start)*(t/(num_sample/2)) ;
    curve[t] = MyVec.add(MyVec.addmul(u,Math.cos(theta_t),v,Math.sin(theta_t)),ellipse_center);
    }
    for (let t = 0; t <= num_sample/2; t++) {
    var theta_t = Math.PI/2 + (theta_end - Math.PI/2)*(t/(num_sample/2));
    curve[t+num_sample/2] = MyVec.add(MyVec.addmul(u,Math.cos(theta_t),v,Math.sin(theta_t)),ellipse_center);
    }
    /*for (let t = 0; t <= num_sample; t++) {
    var theta_t = Math.PI*2*(t/num_sample) ;
    curve[t] = MyVec.add(MyVec.addmul(u,Math.cos(theta_t),v,Math.sin(theta_t)),ellipse_center);
    }*/
    var test_curve = [];
    for (let i = 0; i < 20; i++) {
    const j = Math.PI*2*i/20;
    ellipse_center = MyVec.addmul(circle_center, 1, MyVec.rotate(center2seco,j), 1);
    var curve_n = []
    for (let t = 0; t <= num_sample; t++) {
        var theta_t = Math.PI*2*(t/num_sample) ;
        curve_n.push(MyVec.add(MyVec.addmul(MyVec.sub(seco_axis_end, ellipse_center),Math.cos(theta_t),MyVec.sub(prim_axis_end, ellipse_center),Math.sin(theta_t)),ellipse_center));
    }
    test_curve.push(curve_n);
    }
    console.log(test_curve);
    //return test_curve.flat();

    if (prim_axis_end == p0) {
    return curve;
    } else {
    return curve.reverse();
    }
}

const hybridInterpolation = (p0, p1, p2, num_sample) => {
    
}

const yukselCurve = (points, num_sample, type=0) => {
    const num_points = points.length;
    const fun = 
    (type == 0) ? bezierInterpolation :
    (type == 1) ? circularInterpolation :
    (type == 2) ? ellipticalInterpolation :
    hybridInterpolation;
    ;
    if (num_points < 3) {
    return points;
    } else if (num_points == 3) {
    return fun(points[0], points[1], points[2], num_sample);
    } else {
    var curve = [];
    if (points[0] != points[num_points-1]) {
        var local_curve = [];
        for (let i = 0; i < num_points - 2; i++) {
        local_curve.push(fun(points[i], points[i+1], points[i+2],num_sample));
        }
        curve.push(local_curve[0].slice(0,num_sample/2+1));
        for (let i = 0; i < num_points - 3; i++) {
        const curve1 = local_curve[i].slice(num_sample/2, num_sample+1);
        const curve2 = local_curve[i+1].slice(0, num_sample/2+1);
        var blend_curve = MyMat.init(num_sample/2+1,3);
        for (let j = 0; j <= num_sample/2; j++) {
            const theta = (j/(num_sample/2))*(Math.PI/2)
            blend_curve[j] = MyVec.addmul(curve1[j], Math.cos(theta)**2, curve2[j], Math.sin(theta)**2);
        }
        curve.push(blend_curve);
        }
        curve.push(local_curve[local_curve.length-1].slice(num_sample/2,num_sample+1));
        //return local_curve[0];
        //return local_curve.flat();
    } else {
        var local_curve = [];
        for (let i = 0; i < num_points - 1; i++) {
        local_curve.push(fun(points[i], points[(i+1)%(num_points-1)], points[(i+2)%(num_points-1)],num_sample));
        }
        for (let i = 0; i < num_points - 1; i++) {
        const curve1 = local_curve[i].slice(num_sample/2, num_sample+1);
        const curve2 = local_curve[(i+1)%local_curve.length].slice(0, num_sample/2+1);
        var blend_curve = MyMat.init(num_sample/2+1,3);
        for (let j = 0; j <= num_sample/2; j++) {
            const theta = (j/(num_sample/2))*(Math.PI/2)
            blend_curve[j] = MyVec.addmul(curve1[j], Math.cos(theta)**2, curve2[j], Math.sin(theta)**2);
        }
        curve.push(blend_curve);
        }
    }
    return curve.flat();
    }
}

export {
    yukselCurve
}