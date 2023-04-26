const vecAdd = (vec1, vec2) => {
  const len1 = vec1.length;
  var ret_vec = Array(len1);
  for (let i = 0; i < len1; i++) {
    ret_vec[i] = vec1[i] + vec2[i];
  }
  return ret_vec;
}

const vecSub = (vec1, vec2) => {
  const len1 = vec1.length;
  var ret_vec = Array(len1);
  for (let i = 0; i < len1; i++) {
    ret_vec[i] = vec1[i] - vec2[i];
  }
  return ret_vec;
}

const vecScale = (vec1, scalar) => {
  const len1 = vec1.length;
  var ret_vec = Array(len1);
  for (let i = 0; i < len1; i++) {
    ret_vec[i] = vec1[i] * scalar;
  }
  return ret_vec;
}

const vecDot2 = (vec1, vec2) => {
  return vec1[0]*vec2[0] + vec1[1]*vec2[1];
}

const vecCross2 = (vec1, vec2) => {
  return vec1[0]*vec2[1] - vec1[1]*vec2[0];
}

const vecNormal = (vec1) => {
  const norm = norm2(vec1);
  return [-vec1[1]/norm, vec1[0]/norm, 0];
}

const vecRotate = (vec1, theta) => {
  return [vec1[0]*Math.cos(theta)-vec1[1]*Math.sin(theta) , vec1[0]*Math.sin(theta)+vec1[1]*Math.cos(theta),0];
}

const vecAddmul = (vec1, scalar1, vec2, scalar2) => {
  const vec1_scaled = vecScale(vec1,scalar1);
  const vec2_scaled = vecScale(vec2,scalar2);
  return vecAdd(vec1_scaled, vec2_scaled);
}

const norm2 = (vec) => {
  const len = vec.length;
  var someSquare = 0;
  for (let i = 0; i < len; i++) {
    someSquare = someSquare + vec[i]*vec[i];
  }
  return Math.sqrt(someSquare);
}

const normalize = (vec) => {
  const norm = norm2(vec);
  return vecScale(vec,1/norm);
}

const distancePoint2Line = (point, line_start, line_end) => {
  return ((line_end[0] - line_start[0])*(line_start[1] - point[1]) -
          (line_end[1] - line_start[1])*(line_start[0] - point[0])) /
          norm2(vecSub(line_end, line_start));
}

const angle = (vec1, vec2) => {
  const dot = vecDot2(vec1, vec2);
  const cross = vecCross2(vec1, vec2);
  const tan = cross / dot;
  return Math.atan(tan);
}

const MyVec =  {
  add : vecAdd,
  sub : vecSub,
  scale : vecScale,
  dot : vecDot2,
  cross : vecDot2,
  normal : vecNormal,
  addmul : vecAddmul,
  rotate : vecRotate,
  norm2 : norm2,
  normalize :normalize,
  dist : distancePoint2Line,
  angle : angle
};

export default MyVec;