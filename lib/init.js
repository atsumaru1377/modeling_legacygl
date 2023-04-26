import { get_legacygl } from "./legacygl/legacygl";
import { get_drawutil } from "./legacygl/drawutil";
import { get_camera } from "./legacygl/camera";

const init = (canvas,gl,legacygl,drawutil,camera,p0,p1,p2,selected) => {
  // OpenGL context
  canvas = document.getElementById("canvas");
  gl = canvas.getContext("experimental-webgl");
  if (!gl)
      alert("Could not initialise WebGL, sorry :-(");
  var vertex_shader_src = "\
      attribute vec3 a_vertex;\
      attribute vec3 a_color;\
      varying vec3 v_color;\
      uniform mat4 u_modelview;\
      uniform mat4 u_projection;\
      void main(void) {\
          gl_Position = u_projection * u_modelview * vec4(a_vertex, 1.0);\
          v_color = a_color;\
          gl_PointSize = 5.0;\
      }\
      ";
  var fragment_shader_src = "\
      precision mediump float;\
      varying vec3 v_color;\
      void main(void) {\
          gl_FragColor = vec4(v_color, 1.0);\
      }\
      ";
  legacygl = get_legacygl(gl, vertex_shader_src, fragment_shader_src);
  legacygl.add_uniform("modelview", "Matrix4f");
  legacygl.add_uniform("projection", "Matrix4f");
  legacygl.add_vertex_attribute("color", 3);
  legacygl.vertex2 = function(p) {
      this.vertex(p[0], p[1], 0);
  };
  drawutil = get_drawutil(gl, legacygl);
  camera = get_camera(canvas.width);
  camera.eye = [0, 0, 7];
  p0 = [-0.5, -0.6];
  p1 = [1.2, 0.5];
  p2 = [-0.4, 1.3];
  // event handlers
  canvas.onmousedown = function(evt) {
      var mouse_win = this.get_mousepos(evt);
      if (evt.altKey) {
          camera.start_moving(mouse_win, evt.shiftKey ? "zoom" : "pan");
          return;
      }
      // pick nearest object
      var points = [p0, p1, p2];
      var viewport = [0, 0, canvas.width, canvas.height];
      var dist_min = 10000000;
      for (var i = 0; i < 3; ++i) {
          var object_win = glu.project([points[i][0], points[i][1], 0], 
                                       legacygl.uniforms.modelview.value,
                                       legacygl.uniforms.projection.value,
                                       viewport);
          var dist = vec2.dist(mouse_win, object_win);
          if (dist < dist_min) {
              dist_min = dist;
              selected = points[i];
          }
      }
  };
  canvas.onmousemove = function(evt) {
      var mouse_win = this.get_mousepos(evt);
      if (camera.is_moving()) {
          camera.move(mouse_win);
          draw();
          return;
      }
      if (selected != null) {
          var viewport = [0, 0, canvas.width, canvas.height];
          mouse_win.push(1);
          var mouse_obj = glu.unproject(mouse_win, 
                                        legacygl.uniforms.modelview.value,
                                        legacygl.uniforms.projection.value,
                                        viewport);
          // just reuse the same code as the 3D case
          var plane_origin = [0, 0, 0];
          var plane_normal = [0, 0, 1];
          var eye_to_mouse = vec3.sub([], mouse_obj, camera.eye);
          var eye_to_origin = vec3.sub([], plane_origin, camera.eye);
          var s1 = vec3.dot(eye_to_mouse, plane_normal);
          var s2 = vec3.dot(eye_to_origin, plane_normal);
          var eye_to_intersection = vec3.scale([], eye_to_mouse, s2 / s1);
          vec3.add(selected, camera.eye, eye_to_intersection);
          draw();
      }
  }
  document.onmouseup = function (evt) {
      if (camera.is_moving()) {
          camera.finish_moving();
          return;
      }
      selected = null;
  };
  // init OpenGL settings
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
  return canvas,gl,legacygl,drawutil,camera,p0,p1,p2,selected;
};
export default init;