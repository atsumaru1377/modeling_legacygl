function onMouseDown(evt) {
  mouse_down = true;
  var mouse_win = this.get_mousepos(evt);
  if (evt.altKey) {
    camera.start_moving(mouse_win, evt.shiftKey ? "zoom" : "pan");
    return;
  }
  switch (mode) {
    // direct select
    case 1 :
      lines.push(JSON.parse(JSON.stringify(new_line)));
      new_line = [];
      bezier_control_points = [[],[]];
      selected = pick_nearest_point(mouse_win, lines, -1);
      return;
    // line select
    case 2 :
      lines.push(JSON.parse(JSON.stringify(new_line)));
      new_line = [];
      bezier_control_points = [[],[]];
      refer_line_index = pick_nearest_line(mouse_win,lines);
      var nearest = pick_nearest_point(mouse_win,lines,refer_line_index);
      refer_point = (JSON.parse(JSON.stringify(nearest)));
      refer_line = (JSON.parse(JSON.stringify(lines[refer_line_index])));
      return;
    // pen tool
    case 3 :
      var new_point = make_point([],mouse_win);
      if (new_line.length == 0) {
        new_line.push(new_point);
        draw();
        break;
      }
      target = pick_nearest_point(mouse_win, [new_line],0);
      if (MyVec.norm2(MyVec.sub(new_line[0], new_point)) < 0.3) {
        new_line.push(target);
        draw();
        lines.push(JSON.parse(JSON.stringify(new_line)));
        mode = 2;
        new_line = [];
        break
      } else {
        new_line.push(new_point);
        draw();
        break;
      }
  }
  
  if (evt.ctrlKey && evt.shiftKey) {
    points.push(pick_nearest_point(mouse_win));
    draw();
    return;
  }
};

function onMouseMove(evt) {
  var mouse_win = this.get_mousepos(evt);
  if (camera.is_moving()) {
    camera.move(mouse_win);
    draw();
    return;
  }
  if (mouse_down) {
    switch (mode) {
      case 1 :
        if (selected != null) {
          selected = make_point(selected,mouse_win);
          draw();
        };
        break;
      case 2 :
        var mouse_point = make_point([], mouse_win);
        var len = refer_line.length;
        for (let i = 0; i < len; i++) {
          lines[refer_line_index][i] = MyVec.add(refer_line[i], MyVec.sub(mouse_point,refer_point));
        }
        draw();
        break;
      case 3 :
        break;
    }
  }
};

function onMouseUp(evt) {
  var mouse_win = this.get_mousepos(evt);
  if (camera.is_moving()) {
    camera.finish_moving();
    return;
  }
  switch (mode) {
    case 1 :
      refer_point = [];
      refer_line = [];
      break;
    case 2 :
      refer_point = [];
      refer_line = [];
      break;
    case 3 :
      if (evt.shiftKey) {
        var new_control_point = make_point([],mouse_win);
        var last_curve_point = new_line[-1];
        bezier_control_points[0].push(MyVec.addmul(last_curve_point,2,new_control_point,-1));
        bezier_control_points[1].push(new_control_point);
      } else {
        bezier_control_points[0].push(last_curve_point);
        bezier_control_points[1].push(last_curve_point);
      }
      console.log(bezier_control_points);
      break;
  }
  mouse_down = false;
  selected = null;
};

function onKeyDown(evt) {
  switch (evt.keyCode) {
    // A : direct select
    case 65:
      mode = 1;
      break;
    // V : select(line)
    case 86:
      mode = 2;
      break;
    // P : pen tool
    case 80:
      mode = 3;
      break;
    // escape
    case 27:
      mode = 2;
      break;
  }
};

export {
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onKeyDown
}