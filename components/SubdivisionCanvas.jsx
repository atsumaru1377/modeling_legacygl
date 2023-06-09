// react
import { useCallback, useEffect, useRef, useState } from "react";

// legacygl
import { mat2,mat2d,mat3,mat4,quat,quat2,vec2,vec3,vec4 } from "@/lib/legacygl/gl-matrix-util";
import { get_legacygl } from "@/lib/legacygl/legacygl";
import { get_drawutil } from "@/lib/legacygl/drawutil";
import { get_camera } from "@/lib/legacygl/camera";
import { get_mousepos, aspect_ratio, get_filename_extension, verify_filename_extension, applyCanvasExtensions } from "@/lib/legacygl/util";
import { make_halfedge_mesh } from "@/lib/legacygl/halfedge";
import { meshio } from "@/lib/legacygl/meshio";
import { make_boundingbox } from "@/lib/legacygl/boundingbox";

const buttonStyle = "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-4 rounded";
const inputFileStyle = "bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-4 h-8 w-full text-center rounded cursor-pointer inline-block"

const SubdivisionApp = () => {
    const [fileName, setFileName] = useState({});

    applyCanvasExtensions();
    const canvasRef = useRef(null);

    var gl;
    var canvas;
    var legacygl;
    var texture;
    var mesh_control;
    var mesh_subdiv;
    var bbox;
    var displist_control;
    var displist_subdiv_faces;
    var displist_subdiv_edges;
    var drawutil;
    var camera;

    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (!mesh_control) return;
        
        // projection and camera position
        var zmin = vec3.length(camera.eye_to_center()) * 0.01;
        var zmax = zmin * 10000;
        mat4.perspective(legacygl.uniforms.projectionMatrix.value, Math.PI / 6, canvas.aspect_ratio(), zmin, zmax);
        camera.lookAt(legacygl.uniforms.modelviewMatrix.value);
        mat3.fromMat4(legacygl.uniforms.normalMatrix.value, legacygl.uniforms.modelviewMatrix.value);
        mat3.invert_ip(legacygl.uniforms.normalMatrix.value);
        mat3.transpose_ip(legacygl.uniforms.normalMatrix.value);
        legacygl.uniforms.use_material.value = 0;
        
        // bounding box
        legacygl.uniforms.modelviewMatrix.push();
        mat4.translate_ip(legacygl.uniforms.modelviewMatrix.value, bbox.center());
        mat4.scale_ip(legacygl.uniforms.modelviewMatrix.value, bbox.diagonal());
        legacygl.color(0.5, 0.5, 0.5);
        drawutil.cube("line", 1);
        legacygl.uniforms.modelviewMatrix.pop();
        
        // control mesh
        if (document.getElementById("check_show_control").checked) {
            displist_control.draw(function(){
                legacygl.color(0, 0, 0.5);
                legacygl.begin(gl.LINES);
                mesh_control.edges_forEach(function(e){
                    e.vertices().forEach(function(v){
                        legacygl.vertex3(v.point);
                    });
                });
                legacygl.end();
            });
        }
        
        // subdiv mesh faces
        legacygl.uniforms.use_material.push();
        legacygl.uniforms.use_material.value = 1;
        displist_subdiv_faces.draw(function() {
            // NOTE: this code assumes all faces are triangles!
            // Quads can be drawn by using legacygl.QUADS which internally splits each quad into two triangles
            legacygl.begin(gl.TRIANGLES);
            mesh_subdiv.faces.forEach(function(f) {
                legacygl.normal3(f.normal);
                f.vertices().forEach(function(v){
                    legacygl.vertex3(v.point);
                });
            });
            legacygl.end();
        });
        legacygl.uniforms.use_material.pop();
        
        // subdiv mesh edges
        if (document.getElementById("check_show_edges").checked) {
            displist_subdiv_edges.draw(function() {
                legacygl.color(0, 0.5, 0.2);
                legacygl.begin(gl.LINES);
                mesh_subdiv.edges_forEach(function(e) {
                    e.vertices().forEach(function(v) {
                        legacygl.vertex3(v.point);
                    });
                });
                legacygl.end();
            });
        }
    };

    function subdivide() {
        // for each edge, compute subdivided point
        mesh_subdiv.edges_forEach(function(e){
            var v = e.vertices();
            var w = [e.halfedge.next.vertex, e.halfedge.opposite.next.vertex];
            if (e.is_boundary()) {
                e.subdiv_point = vec3.scale([], vec3.add([], v[0].point, v[1].point), 0.5);
            } else {
                e.subdiv_point = vec3.add([],
                    vec3.scale([], vec3.add([], v[0].point, v[1].point), 3 / 8),
                    vec3.scale([], vec3.add([], w[0].point, w[1].point), 1 / 8))
            }
        });
        // for each vertex, compute displaced point
        mesh_subdiv.vertices.forEach(function(v){
            if (v.is_boundary()) {
                var w0 = v.halfedge.prev.from_vertex();
                var w1 = v.halfedge.vertex;
                v.subdiv_point = vec3.add([],
                    vec3.scale([], v.point, 3 / 4),
                    vec3.scale([], vec3.add([], w0.point, w1.point), 1 / 8));
            } else {
                var w = v.vertices();
                var alpha = Math.pow(3 / 8 + 1 / 4 * Math.cos(2 * Math.PI / w.length), 2) + 3 / 8;
                v.subdiv_point = vec3.scale([], v.point, alpha);
                for (var i = 0; i < w.length; ++i)
                    v.subdiv_point = vec3.add([], v.subdiv_point, vec3.scale([], w[i].point, (1 - alpha) / w.length));
            }
        });
        // make next subdiv mesh topology
        var mesh_subdiv_next = make_halfedge_mesh();
        var offset = mesh_subdiv.num_vertices();
        mesh_subdiv.faces.forEach(function(f){
            f.halfedges().forEach(function(h){
                var fv_indices = [h.from_vertex().id];
                fv_indices.push(offset + h.edge.id);
                fv_indices.push(offset + h.prev.edge.id);
                mesh_subdiv_next.add_face(fv_indices);
            });
            var fv_indices = [];
            f.edges().forEach(function(e){
                fv_indices.push(offset + e.id);
            });
            mesh_subdiv_next.add_face(fv_indices);
        });
        // set geometry for the next subdiv mesh
        mesh_subdiv.vertices.forEach(function(v){
            mesh_subdiv_next.vertices[v.id].point = v.subdiv_point;
        });
        mesh_subdiv.edges_forEach(function(e){
            mesh_subdiv_next.vertices[offset + e.id].point = e.subdiv_point;
        });
        mesh_subdiv = mesh_subdiv_next;
        mesh_subdiv.init_ids();
        mesh_subdiv.init_boundaries();
        mesh_subdiv.compute_normals();
        displist_subdiv_faces.invalidate();
        displist_subdiv_edges.invalidate();
        draw();
        document.getElementById("label_mesh_nv").innerHTML = mesh_subdiv.num_vertices();
        document.getElementById("label_mesh_nf").innerHTML = mesh_subdiv.num_faces();
        document.getElementById("label_mesh_ne").innerHTML = mesh_subdiv.num_edges();
    }

    function write_mesh() {
        var filename = "mesh_subdiv.obj";
        var content = meshio.write(mesh_subdiv, filename);
        var myBlob = new Blob([content], { type: "octet/stream"});
        var a = document.createElement("a");
        a.href = URL.createObjectURL(myBlob);;
        a.download = filename;
        a.click();
    }

    function read_mesh(filename, content) {
        var mesh_temp = meshio.read(filename, content);
        var has_nontriangle = false;
        for (var i = 0; i < mesh_temp.faces.length; ++i) {
            if (mesh_temp.faces[i].halfedges().length != 3) {
                has_nontriangle = true;
                break;
            }
        }
        if (has_nontriangle) {
            alert("Non-triangle polygon found! Please triangulate the mesh first.");
            return;
        }
        mesh_control = mesh_subdiv = mesh_temp;
        mesh_subdiv.compute_normals();
        bbox = make_boundingbox();
        mesh_control.vertices.forEach(function(v) {
            bbox.extend(v.point);
        });
        camera.center = bbox.center();
        camera.eye = vec3.add([], camera.center, [0, 0, bbox.diagonal_norm() * 2]);
        camera.up = [0, 1, 0];
        displist_control.invalidate();
        displist_subdiv_faces.invalidate();
        displist_subdiv_edges.invalidate();
        draw();
        document.getElementById("label_mesh_nv").innerHTML = mesh_subdiv.num_vertices();
        document.getElementById("label_mesh_nf").innerHTML = mesh_subdiv.num_faces();
        document.getElementById("label_mesh_ne").innerHTML = mesh_subdiv.num_edges();
    };

    function read_default_mesh(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function() {
            if (this.status == 200)
                read_mesh(url, this.response);
        };
        xhr.send();
    };

    function read_texture(dataurl) {
        var img = document.getElementById("img_material");
        img.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            displist_subdiv_faces.invalidate();
            draw();
        };
        img.crossOrigin = "anonymous";
        img.src = dataurl;
    };

    function read_default_texture(url) {
        if (!verify_filename_extension(url, [".png", ".jpg", ".gif"])) return;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
            if (this.status == 200)
                read_texture(URL.createObjectURL(this.response));
        };
        xhr.send();
    };

    function init() {
        // OpenGL context
        canvas = document.getElementById("canvas");
        gl = canvas.getContext("experimental-webgl");
        if (!gl)
            alert("Could not initialize WebGL!");
        var vertex_shader_src = "\
            attribute vec3 a_vertex;\
            attribute vec3 a_color;\
            attribute vec3 a_normal;\
            varying vec3 v_normal;\
            varying vec3 v_color;\
            uniform mat4 u_modelviewMatrix;\
            uniform mat4 u_projectionMatrix;\
            uniform mat3 u_normalMatrix;\
            void main(void) {\
                gl_Position = u_projectionMatrix * u_modelviewMatrix * vec4(a_vertex, 1.0);\
                v_color = a_color;\
                v_normal = u_normalMatrix * a_normal;\
            }\
            ";
        var fragment_shader_src = "\
            precision mediump float;\
            uniform sampler2D u_texture;\
            uniform int u_use_material;\
            varying vec3 v_normal;\
            varying vec3 v_color;\
            void main(void) {\
                if (u_use_material == 1) {\
                    vec3 nnormal = normalize(v_normal);\
                    nnormal.y *= -1.0;\
                    vec2 texcoord = nnormal.xy * 0.45 + vec2(0.5, 0.5);\
                    gl_FragColor = texture2D(u_texture, texcoord);\
                } else {\
                    gl_FragColor = vec4(v_color, 1.0);\
                }\
            }\
            ";
        legacygl = get_legacygl(gl, vertex_shader_src, fragment_shader_src);
        legacygl.add_uniform("modelviewMatrix", "Matrix4f");
        legacygl.add_uniform("projectionMatrix", "Matrix4f");
        legacygl.add_uniform("normalMatrix", "Matrix3f");
        legacygl.add_uniform("texture", "1i");
        legacygl.add_uniform("use_material", "1i");
        legacygl.add_vertex_attribute("color", 3);
        legacygl.add_vertex_attribute("normal", 3);
        legacygl.vertex3 = function(p) {
            this.vertex(p[0], p[1], p[2]);
        };
        legacygl.normal3 = function(n) {
            this.normal(n[0], n[1], n[2]);
        };
        displist_control = legacygl.displist_wrapper("control");
        displist_subdiv_faces = legacygl.displist_wrapper("subdiv_faces");
        displist_subdiv_edges = legacygl.displist_wrapper("subdiv_edges");
        drawutil = get_drawutil(gl, legacygl);
        camera = get_camera(canvas.width);
        // init OpenGL settings
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1, 1);
        gl.clearColor(1, 1, 1, 1);
        // init texture
        texture = gl.createTexture();
        // event handlers
        canvas.onmousedown = function(evt) {
            camera.start_moving(this.get_mousepos(evt), evt.shiftKey ? "zoom" : evt.ctrlKey ? "pan" : "rotate");
        };
        canvas.onmousemove = function(evt) {
            if (camera.is_moving()) {
                camera.move(this.get_mousepos(evt));
                draw();
            }
        };
        document.onmouseup = function(evt) {
            if (camera.is_moving())
                camera.finish_moving();
        };
        read_default_mesh("https://cdn.glitch.com/e530aeed-ec07-4e9a-b2b2-e5dd9fc39322%2Floop-test.obj?1556153350921");
        read_default_texture("https://cdn.glitch.com/13696316-44e5-40d1-b312-830e260e4817%2Fmetal1.png?1555562471905");
    };

    useEffect(() => {
        if (canvasRef.current) {
            init(canvasRef.current);
            draw();
        }
    }, [canvasRef]);

    const handleFileChange = (e) => {
        if (e.target.files.length !== 1) return;
        const file = e.target.files[0];
        if (!verify_filename_extension(file.name, [".obj", ".off"])) return;
        const reader = new FileReader();
        reader.onload = function () {
            read_mesh(file.name, reader.result);
        };
        reader.readAsText(file);
    };

    const handleSubdivideClick = () => {
        subdivide();
        draw();
    };

    const handleWriteMeshClick = () => {
        write_mesh();
    };

    const handleCheckboxChange = () => {
        draw();
    };

    const handleTextureChange = useCallback((event) => {
        if (event.target.files.length !== 1) return;
        const file = event.target.files[0];
        if (!verify_filename_extension(file.name, ['.png', '.jpg', '.gif'])) return;
    
        const reader = new FileReader();
        reader.onload = function () {
          read_texture(this.result);
        };
        reader.readAsDataURL(file);
      }, []);

    return (   
        <div className='flex m-4 items-start'>
            <canvas ref={canvasRef} id="canvas" className="m-4 rounded-lg" width="640" height="480" style={{border: '1px solid #000000'}}></canvas>
            <div className="bg-white bg-opacity-30 backdrop-blur-md rounded-lg m-4 p-4 shadow-lg w-1/2">
                <div className="flex flex-col mb-4" key="input_file">
                    <div className="flex">
                        Read Control Mesh from Disk: 
                    </div>
                    <label className={inputFileStyle}>
                        <div className="flex">
                            <input
                                id="test_mesh_disk"
                                name="test_mesh_disk"
                                type="file"
                                accept=".off,.obj"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div> Choose File 
                    </label>
                </div>
                <div className="flex flex-col mb-4" key="data">
                    <div className="flex">
                        Subdivided Mesh Statistics: 
                    </div>
                    <div className="flex pl-4">
                        <span id="label_mesh_nv" className="pr-2">0</span>{" Vertices"}
                    </div>
                    <div className="flex pl-4">
                        <span id="label_mesh_nf" className="pr-2">0</span>{" Faces"}
                    </div>
                    <div className="flex pl-4">
                        <span id="label_mesh_ne" className="pr-2">0</span>{" Edges"}
                    </div>
                </div>
                <div className="flex flex-col mb-4" key="data">
                    <button 
                        onClick={handleSubdivideClick}
                        className={buttonStyle}
                    >Subdivide</button>
                </div>
                <div className="flex flex-col mb-4" key="data">
                    <button 
                        onClick={handleWriteMeshClick}
                        className={buttonStyle}
                    >Write Mesh</button>
                </div>
                <div className="flex flex-col mb-4" key="data">
                    <div className="flex">
                        Material: 
                    </div>
                    <div className="flex flex-col">
                        <img id="img_material" className="w-1/4"/>
                        <label className={`${inputFileStyle} my-2`}>
                            <input
                                id="test_material_disk"
                                name="test_material_disk"
                                type="file"
                                accept=".png,.jpg,.gif"
                                onChange={handleTextureChange}
                                className="hidden"
                            />Choose File
                        </label>
                    </div>
                </div>
                <div className="flex flex-col" key="data">
                    <div className="flex">
                        Draw Options: 
                    </div>
                    <div className="flex">
                        <input
                            id="check_show_edges"
                            name="check_show_edges"
                            type="checkbox"
                            defaultChecked
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-yellow-500 accent-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="check_show_edges" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Show Edge
                        </label>
                    </div>
                    <div className="flex">
                        <input
                            id="check_show_control"
                            name="check_show_control"
                            type="checkbox"
                            defaultChecked
                            onChange={handleCheckboxChange}
                            className="w-4 h-4 text-yellow-500 accent-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 dark:focus:ring-yellow-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor="check_show_control" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Show Control Mesh
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubdivisionApp;