///<reference path="babylon.math.ts"/>

module SoftEngine {
    export class Camera {
        Position: BABYLON.Vector3;
        Target: BABYLON.Vector3;

        constructor() {
            this.Position = BABYLON.Vector3.Zero();
            this.Target = BABYLON.Vector3.Zero();
        }
    }

    export class Mesh {
        Position: BABYLON.Vector3;
        Rotation: BABYLON.Vector3;
        Vertices: BABYLON.Vector3[];

        constructor(public name: string, verticesCount: number) {
            this.Vertices = new Array(verticesCount);
            this.Rotation = BABYLON.Vector3.Zero();
            this.Position = BABYLON.Vector3.Zero();
        }
    }

    export class Device {
        // The backbuffer is equal to the number of pixels to draw on the screen.
        private backbuffer: ImageData;
        private workingCanvas: HTMLCanvasElement;
        private workingContext: CanvasRenderingContext2D;
        private workingWidth: number;
        private workingHeight: number;
        private backbufferdata;

        constructor(canvas: HTMLCanvasElement) {
            this.workingCanvas = canvas;
            this.workingWidth = canvas.width;
            this.workingHeight = canvas.height;
            this.workingContext = this.workingCanvas.getContext("2d");
        }

        // Clear the backbuffer with a specific color.
        public clear(): void {
            // Clear with black color by default.
            this.workingContext.clearRect(0, 0, this.workingWidth, this.workingHeight);
            // Once cleared, clear back buffer data
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workingWidth, this.workingHeight);
        }

        // Once ready, we can flush the back buffer into the front buffer.
        public present(): void {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        }

        // Called to put a pixel on the screen with specific x,y - coordinates
        public putPixel(x: number, y: number, color: BABYLON.Color4): void {
            this.backbufferdata = this.backbuffer.data;
            var index:number = ((x >> 0) + (y >> 0) * this.workingWidth) * 4;
            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        }

        // Takes some 3D coordinates and transforms them into 2D coordinates using the 
        // transformation matrix.
        public project(coord: BABYLON.Vector3, transMat: BABYLON.Matrix): BABYLON.Vector2 {
            // Transforming the coordinates.
            var point = BABYLON.Vector3.TransformCoordinates(coord, transMat);
            // Transformed coordinates will be based in the center of the screen.
            // We need to transform them to have the origin in the top left.
            var x = point.x * this.workingWidth + this.workingWidth / 2.0 >> 0;
            var y = point.y = this.workingHeight + this.workingHeight / 2.0 >> 0;
            return (new BABYLON.Vector2(x,y));
        }

        // Calls putPixel but does the clipping operation before.
        public drawPoint(point: BABYLON.Vector2): void {
            // Clipping what is visible on the screen.
            if (point.x > 0 && point.y > 0 && point.x < this.workingWidth && point.y < this.workingHeight) {
                // Draw a yellow point.
                this.putPixel(point.x, point.y, new BABYLON.Color4(1,1,0,1));
            }
        }

        // The main method of the engine that re-computes each vertex projection during each frame.
        public render(camera: Camera, meshes: Mesh[]): void {
            var viewMatrix = BABYLON.Matrix.LookAtLH(camera.Position, camera.Target, BABYLON.Vector3.Up());
            var projectionMatrix = BABYLON.Matrix.PerspectiveFovLH(0.78, this.workingWidth / this.workingHeight, 0.01, 1.0);

            for (var index = 0; index < meshes.length; index++) {
                // Current mesh to work on.
                var cMesh = meshes[index];
                // Apply rotation before translation.
                var worldMatrix = BABYLON.Matrix.RotationYawPitchRoll(cMesh.Rotation.y, cMesh.Rotation.x, cMesh.Rotation.z)
                                    .multiply(BABYLON.Matrix.Translation(cMesh.Position.x, cMesh.Position.y, cMesh.Position.z));
                var transformMatrix = worldMatrix.multiply(viewMatrix).multiply(projectionMatrix);

                for (var indexVertices = 0; indexVertices < cMesh.Vertices.length; indexVertices++) {
                    // First, we project a 3D coordinate into 2D space
                    var projectedPoint = this.project(cMesh.Vertices[indexVertices], transformMatrix);
                    // Then draw it on the screen.
                    this.drawPoint(projectedPoint);
                }
            }
        }
    }
}
