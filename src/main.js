var w = Webcam();
window.onload = function onload() {
	w.setup().then(function() {
		console.log("webcam connected");
		compatibility.requestAnimationFrame(step);
	});
	var canvas = document.getElementById("display");
	ctx = canvas.getContext('2d');
		

	var tf = TransformationFinder();
	var initialMatrix = null;

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
			ctx.putImageData(idata,0,0);

			if(initialMatrix != null){
				ctx.fillStyle="green";
				cornerpts = tf.transformIdealCorners(initialMatrix);
				for (var i = 0; i < cornerpts.length; i+=2) {
					var x = cornerpts[i],
						y = cornerpts[i+1];
					ctx.fillRect(x-1,y-1,2,2);
				};
			}
		}

		compatibility.requestAnimationFrame(step);
	};
}
