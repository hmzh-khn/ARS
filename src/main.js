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

	var canvas = document.getElementById("display");
	canvas.width = screen.width;
	canvas.height = screen.height;
	//ctx = canvas.getContext('2d');


	var MILLISECONDS_PER_FRAME = 20;
	var lastGameStep = performance.now();
	var nextTurn = null;

	canvas.addEventListener('click',function click1(){
		requestFullscreen(canvas);
		canvas.removeEventListener('click',click1);
		canvas.addEventListener('click',function click2(event){

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
	})
	

	w.setup(screen.width,screen.height).then(function() {
		console.log("webcam connected");
		gameRenderer.setup();
		compatibility.requestAnimationFrame(step);
	});
		

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
					
				}else if(nextTurn=='right'){
					
				}
				nextTurn=null;
				snake.move();
			}

			gameRenderer.draw(initialMatrix,idata);
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
