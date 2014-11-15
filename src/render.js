function TwoDimensionalCamera(pixelwidth,pixelheight){
	THREE.Camera.call( this );
	this.orthographicProjection = new THREE.Matrix4();
	this.orthographicProjection.makeOrthographic(0,pixelwidth,0,pixelheight,1,-1);
}
TwoDimensionalCamera.prototype = Object.create(THREE.Camera.prototype);
TwoDimensionalCamera.prototype.fromMatrix = function fromMatrix(twoDMatrix){
	var t = twoDMatrix;

	/*this.projectionMatrix.set(t.a11, t.a12, 0    , t.a13,
							  t.a21, t.a22, 0    , t.a23,
							  0    , 0    , 1    , 0    ,
							  t.a31, t.a32, 0    , t.a33);
	this.projectionMatrix.transpose();
	console.log(this.projectionMatrix.elements);*/
	this.projectionMatrix.set(t.a11, t.a21, 0    , t.a31,
							  t.a12, t.a22, 0    , t.a32,
							  0    , 0    , 1    , 0    ,
							  t.a13, t.a23, 0    , t.a33);
	/*this.projectionMatrix.set(t.a11, t.a21, 0    , t.a31,
							  t.a12, t.a22, 10    , t.a32,
							  0    , 0    , 1    , 0    ,
							  t.a13, t.a23, 0    , t.a33);*/
	this.projectionMatrix.multiplyMatrices(this.orthographicProjection,this.projectionMatrix);
	//console.log(this.projectionMatrix.elements);
}

function GameRenderer(){
	var backgroundScene,
		backgroundCamera,
		backgroundTexture,
		bg,
		objectScene,
		objectCamera,
		renderer;
	gameRenderer = {
		setup: function setup(){
			var videoStream = document.getElementById('streamVideo');
			var renderCanvas = document.getElementById('display');
			//Sets up the renderer
			backgroundScene = new THREE.Scene();
			backgroundCamera = new THREE.Camera();

			backgroundTexture = new THREE.Texture(videoStream);
			backgroundTexture.needsUpdate = true;

			bg = new THREE.Mesh(
			  new THREE.PlaneGeometry(2, 2, 0),
			  new THREE.MeshBasicMaterial({map: backgroundTexture})
			);
			// The bg plane shouldn't care about the z-buffer.
			bg.material.depthTest = false;
			bg.material.depthWrite = false;
			backgroundScene.add(backgroundCamera);
			backgroundScene.add(bg);

			objectScene = new THREE.Scene();
			objectCamera = new TwoDimensionalCamera(videoStream.width,videoStream.height);
			objectScene.add(objectCamera);

			var gridTexture = THREE.ImageUtils.loadTexture('../grid.png');
			var gridObject = new THREE.Mesh(
				new THREE.BoxGeometry(25,25,0),
				new THREE.MeshBasicMaterial({map: gridTexture})
			);
			gridObject.position.set(12.5,12.5,0);
			gridObject.material.transparent = true
			gridObject.material.blending = THREE.MultiplyBlending;
			objectScene.add(gridObject);

			/*var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			material.transparent = true
			material.blending = THREE.MultiplyBlending;
			var cube1 = new THREE.Mesh( geometry, material );
			objectScene.add(cube1);
			cube1.position.set(0,0,0);
			var cube2 = new THREE.Mesh( geometry, material );
			cube2.position.set(25,0,0);
			objectScene.add(cube2);
			var cube3 = new THREE.Mesh( geometry, material );
			cube3.position.set(0,25,0);
			objectScene.add(cube3);
			var cube4 = new THREE.Mesh( geometry, material );
			cube4.position.set(25,25,0);
			objectScene.add(cube4);*/

			function addBox(x,y,color){
				var geometry = new THREE.BoxGeometry( 1, 1, 1 );
				var material = new THREE.MeshBasicMaterial( { color: color } );
				material.transparent = true;
				material.blending = THREE.MultiplyBlending;
				var cube = new THREE.Mesh( geometry, material );
				cube.position.set(x+0.5, y+0.5, 0);
				objectScene.add(cube);
			}
			addBox(8,0,0xff00ff);
			addBox(9,0,0xff00ff);
			addBox(10,0,0xff00ff);
			addBox(10,1,0xff00ff);
			addBox(14,14,0x0000ff);

			renderer = new THREE.WebGLRenderer({canvas:renderCanvas});
			renderer.setSize( window.innerWidth, window.innerHeight );
		},
		draw: function draw(matrix, imgdata){
			
			backgroundTexture.needsUpdate = true;
			renderer.autoClear = false;
			renderer.clear();
			renderer.render(backgroundScene, backgroundCamera);
			if(matrix){
				objectCamera.fromMatrix(matrix);
				renderer.render(objectScene, objectCamera);
			}
		},
	}
	return gameRenderer;
}