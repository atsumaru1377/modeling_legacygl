const pick_nearest_point = (mouse_win, lines, line_index) => {
  if (line_index == -1) {
    var num_lines = lines.length;
    var viewport = [0, 0, canvas.width, canvas.height];
    var dist_min = 10000000;
    var picked_point = [];
    for (let j = 0; j < num_lines; j++) {
      var line = lines[j];
      var num_points = line.length;
      for (var i = 0; i < num_points; ++i) {
        var object_win = glu.project(
          [line[i][0], line[i][1], 0],
          legacygl.uniforms.modelview.value,
          legacygl.uniforms.projection.value,
          viewport
        );
        var dist = vec2.dist(mouse_win, object_win);
        if (dist < dist_min) {
          dist_min = dist;
          picked_point = line[i];
        }
      }
    }
    return picked_point;         
  } else {
    var line = lines[line_index];
    var num_points = line.length;
    var viewport = [0, 0, canvas.width, canvas.height];
    var dist_min = 10000000;
    var picked_point = [];
    for (let i = 0; i < num_points; ++i) {
      var object_win = glu.project(
        [line[i][0], line[i][1], 0],
        legacygl.uniforms.modelview.value,
        legacygl.uniforms.projection.value,
        viewport
      );
      var dist = vec2.dist(mouse_win, object_win);
      if (dist < dist_min) {
        dist_min = dist;
        picked_point = line[i];
      }
    }
    return picked_point;
  }
};

const pick_nearest_line = (mouse_win, lines) => {
  var num_lines = lines.length;
  var viewport = [0, 0, canvas.width, canvas.height];
  var dist_min = 10000000;
  var picked_point = 0;
  var picked_line = 0;
  for (var j = 0; j < num_lines; j++) {
    var num_points = lines[j].length;
    var line = lines[j];
    for (var i = 0; i < num_points - 1; ++i) {
      for (var k = 0; k < 20; ++k) {
        var t = k / 20;
        var sample_point = MyVec.addmul(line[i],1-t,line[i+1],t);
        var object_win = glu.project(
          sample_point,
          legacygl.uniforms.modelview.value,
          legacygl.uniforms.projection.value,
          viewport
        );
        var dist = vec2.dist(mouse_win, object_win);
        if (dist < dist_min) {
          dist_min = dist;
          picked_line = j;
        }
      }
    }
  }
  return picked_line;
};

export {
  pick_nearest_point,
  pick_nearest_line
}