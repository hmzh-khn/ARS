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

	canvas.addEventListener('click',function(){
		requestFullscreen(canvas);
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
