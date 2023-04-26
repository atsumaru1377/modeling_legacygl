// react
import { useEffect, useRef } from "react";

// legacygl
import { mat2,mat2d,mat3,mat4,quat,quat2,vec2,vec3,vec4 } from "@/lib/legacygl/gl-matrix-util";
import { get_camera } from "@/lib/legacygl/camera";
import { get_drawutil } from "@/lib/legacygl/drawutil";
import { get_legacygl } from "@/lib/legacygl/legacygl";
import { get_mousepos, aspect_ratio, get_filename_extensio, verify_filename_extension, applyCanvasExtensions } from "@/lib/legacygl/util";
import glu from "@/lib/legacygl/glu";

// spline
import { evalQuadraticBezier, evalGeneralBezier, rationalBezier, bezierAdjustSampling } from "@/lib/spline/bezier";
import { cutmullRomSpline, bSpline } from "@/lib/spline/spline";
import { yukselCurve } from "@/lib/spline/yuksel";
import MyVec from "@/lib/spline/myVec";
import MyMat from "@/lib/spline/myMat";

const SplineApp = () => {
    applyCanvasExtensions();
    const canvasRef = useRef(null);
    var gl;
    var canvas;
    var legacygl;
    var drawutil;
    var camera;
    var p0, p1, p2, p3, p4;
    var points;
    var lines;
    var selected = null;
    var target = null;
    var num_steps;
    var mode = 2;
    var new_line = [];
    var bezier_control_points = [[],[]];
    var refer_point = [];
    var refer_line = [];
    var refer_line_index = 0;
    var mouse_down = false;

    const sampleDraw = (color, samples) => {
        const num_sample = samples.length;
        legacygl.color(color[0], color[1], color[2]);
    
        // draw line segments composing curve
        legacygl.begin(gl.LINE_STRIP);
        for (let i = 0; i < num_sample; ++i) {
            legacygl.vertex2(samples[i]);
        }
        legacygl.end();
    
        // draw sample points
        //if (document.getElementById("input_show_samplepoints").checked) {
            legacygl.begin(gl.POINTS);
            for (let i = 0; i < num_sample; ++i) {
                legacygl.vertex2(samples[i]);
            }
            legacygl.end();
        //}
    };

    const make_point = (refer_point, mouse_win) => {
        var viewport = [0, 0, canvas.width, canvas.height];
        mouse_win.push(1);
        var mouse_obj = glu.unproject(
          mouse_win,
          legacygl.uniforms.modelview.value,
          legacygl.uniforms.projection.value,
          viewport
        );
        // just reuse the same code as the 3D case
        var plane_origin = [0, 0, 0];
        var plane_normal = [0, 0, 1];
        var eye_to_mouse = vec3.sub([], mouse_obj, camera.eye);
        var eye_to_origin = vec3.sub([], plane_origin, camera.eye);
        var s1 = vec3.dot(eye_to_mouse, plane_normal);
        var s2 = vec3.dot(eye_to_origin, plane_normal);
        var eye_to_intersection = vec3.scale([], eye_to_mouse, s2 / s1);
        var p_new = vec3.add(refer_point, camera.eye, eye_to_intersection);
        return p_new;
    };

    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // projection & camera position
        mat4.perspective(
            legacygl.uniforms.projection.value,
            Math.PI / 6,
            canvas.aspect_ratio(),
            0.1,
            1000
        );
        var modelview = legacygl.uniforms.modelview;
        camera.lookAt(modelview.value);

        // xy grid
        gl.lineWidth(1);
        legacygl.color(0.5, 0.5, 0.5);
        drawutil.xygrid(100);

        sampleDraw([0,0,0],points)
    };

    function init() {
        // OpenGL context
        canvas = document.getElementById("canvas");
        gl = canvas.getContext("experimental-webgl");
        if (!gl) alert("Could not initialise WebGL, sorry :-(");
        var vertex_shader_src =
            "\
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
        var fragment_shader_src =
            "\
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
        legacygl.vertex2 = function (p) {
            this.vertex(p[0], p[1], 0);
        };
        drawutil = get_drawutil(gl, legacygl);
        camera = get_camera(canvas.width);
        camera.eye = [0, 0, 7];
        p0 = [1, -1, 0];
        p1 = [2, 0.5, 0];
        p2 = [0, 1.5, 0];
        p3 = [-1, 0, 0];
        p4 = [-2, 1, 0]
        points = [p0, p1, p2, p3, p4];
        lines = [points];

        // event handlers
        canvas.onmousedown = onMouseDown;
        canvas.onmousemove = onMouseMove;
        canvas.onmouseup = onMouseUp;
        document.onkeydown = onKeyDown;
        // init OpenGL settings
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1, 1, 1, 1);
    };

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

    useEffect(() => {
        if (canvasRef.current) {
            init(canvasRef.current);
            draw();
        }
    }, [canvasRef]);

    const handleFormChange = () => {
        draw();
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <canvas ref={canvasRef} id="canvas" width="640" height="480" style={{border: '1px solid #000000'}}></canvas>
                    </td>
                    <td>
                        
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default SplineApp