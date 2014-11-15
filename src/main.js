var requestFullscreen = function (ele) {
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    } else {
        // Fallback
        console.log('Fullscreen API is not supported.');
    }
};

var w = Webcam();
window.onload = function onload() {

console.log(screen.width,screen.height);

	var canvas = document.getElementById("displayCanvas");
	//canvas.width = screen.width;
	//canvas.height = screen.height;
	//ctx = canvas.getContext('2d');


	var MILLISECONDS_PER_FRAME = 100;
	var lastGameStep = performance.now();
	var nextTurn = null;

	canvas.addEventListener('mousedown',function click1(){
		requestFullscreen(document.getElementById("fullscreenContainer"));
		canvas.removeEventListener('mousedown',click1);
		canvas.addEventListener('mousedown',function click2(event){

			if(event.clientX < screen.width/2){
				//Left turn
				nextTurn='left';
				console.log("Left",event.clientX);
			}else{
				//Right turn
				nextTurn='right';
				console.log("Right",event.clientX);
			}
		})
	});
	window.addEventListener('keydown',function(e) {
		var key = e.keyCode;
		var dir = null;
		console.log(e);
		switch(key) {
			case 65: // left
				nextTurn='left';
				console.log("Left");
				break;
			case 68: // right
				nextTurn='right';
				console.log("Right");
				break;
		}
	});

	w.setup(screen.width,screen.height).then(function() {
		console.log("webcam connected");
		gameRenderer.setup();
		compatibility.requestAnimationFrame(step);
	});
		
	var orient = DeviceOrientationDetector();
	orient.setup();

	var tf = TransformationFinder();
	var initialMatrix = null;


	var gameRenderer = GameRenderer();

	var step = function step() {
		if(w.isReady()) {
			var nowStep = performance.now();
			var idata = w.getImageData();

			if(initialMatrix) {
				var isUpdated = tf.updateMatrix(idata, initialMatrix);

				if(isUpdated == false) {
					initialMatrix = null;
				}
			}
			else {
				initialMatrix = tf.discoverMarker(idata);
			}

			// draw
			//ctx.putImageData(idata,0,0);
			//
			if(nowStep>lastGameStep+MILLISECONDS_PER_FRAME){
				if(nextTurn=='left'){
					snake.turnRight();
				}else if(nextTurn=='right'){
					snake.turnLeft();
				}
				nextTurn=null;
				snake.move();

				lastGameStep=nowStep;
			}

			gameRenderer.draw(initialMatrix, orient.detect());
			/*if(initialMatrix != null){
				ctx.fillStyle="green";
				cornerpts = tf.transformIdealCorners(initialMatrix);
				for (var i = 0; i < cornerpts.length; i+=2) {
					var x = cornerpts[i],
						y = cornerpts[i+1];
					ctx.fillRect(x-1,y-1,2,2);
				};
			}*/

		}

		compatibility.requestAnimationFrame(step);
	};
}
