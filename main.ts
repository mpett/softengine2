///<reference path="softengine.ts"/>

var canvas: HTMLCanvasElement;
var device: SoftEngine.Device;
var mesh: SoftEngine.Mesh;
var meshes: SoftEngine.Mesh[] = [];
var mera: SoftEngine.Camera;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = <HTMLCanvasElement> document.getElementById("frontBuffer");
    mesh = new SoftEngine.Mesh("Cube", 8, 12);
    meshes.push(mesh);
    mera = new SoftEngine.Camera();
    device = new SoftEngine.Device(canvas);
    meshes.push(mesh);
    
    mesh.Vertices[0] = new BABYLON.Vector3(-1, 1, 1);
    mesh.Vertices[1] = new BABYLON.Vector3(1, 1, 1);
    mesh.Vertices[2] = new BABYLON.Vector3(-1, -1, 1);
    mesh.Vertices[3] = new BABYLON.Vector3(1, -1, 1);
    mesh.Vertices[4] = new BABYLON.Vector3(-1, 1, -1);
    mesh.Vertices[5] = new BABYLON.Vector3(1, 1, -1);
    mesh.Vertices[6] = new BABYLON.Vector3(1, -1, -1);
    mesh.Vertices[7] = new BABYLON.Vector3(-1, -1, -1);
    
    mesh.Faces[0] = { A:0, B:1, C:2 };
    mesh.Faces[1] = { A:1, B:2, C:3 };
    mesh.Faces[2] = { A:1, B:3, C:6 };
    mesh.Faces[3] = { A:1, B:5, C:6 };
    mesh.Faces[4] = { A:0, B:1, C:4 };
    mesh.Faces[5] = { A:1, B:4, C:5 };
    
    mesh.Faces[6] = { A:2, B:3, C:7 };
    mesh.Faces[7] = { A:3, B:6, C:7 };
    mesh.Faces[8] = { A:0, B:2, C:7 };
    mesh.Faces[9] = { A:0, B:4, C:7 };
    mesh.Faces[10] = { A:4, B:5, C:6 };
    mesh.Faces[11] = { A:4, B:6, C:7 };

    mera.Position = new BABYLON.Vector3(0, 0, 10);
    mera.Target = new BABYLON.Vector3(0, 0, 0);

    // Call the HTML5 rendering loop.
    requestAnimationFrame(drawingLoop);
}

// Rendering loop handler
function drawingLoop() {
    device.clear();
    // Rotate the cube slightly during each rendered frame.
    mesh.Rotation.x += 0.01;
    mesh.Rotation.y += 0.01;
    // Various matrix operations
    device.render(mera, meshes);
    // Flushing the backbuffer into the frontbuffer.
    device.present();
    // Call the HTML5 rendering loop recursively.
    requestAnimationFrame(drawingLoop);
}
