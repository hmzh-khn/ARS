
function Webcam(){
	
	var stream, video, canvas, ctx;

	return {
		setup : function setup(width,height){
			if(stream) return new Promise(function(resolve){
				resolve();
			}); //already set up. resolve
			console.log(width,height);
			var a = width*height;
			var desiredA = 360*640;
			var factor = Math.sqrt(desiredA/a);
			width *= factor;
			height *= factor;
			width = Math.floor(width);
			height = Math.floor(height);
			console.log("Scaling", a, desiredA, factor, width, height);

			video = document.getElementById('streamVideo');
			video.width = width;
			video.height = height;
			canvas = document.getElementById('processCanvas');
			canvas.width = width;
			canvas.height = height;
			ctx = canvas.getContext('2d');

			var constraints = {
			  video: {
			    mandatory: {
			      maxWidth: width,
			      maxHeight: height
			    }
			  }
			};
			return new Promise(function(resolve, reject){
				compatibility.getUserMedia(constraints, function(localMediaStream) {
					stream = localMediaStream;
					video.src = window.URL.createObjectURL(localMediaStream);

					window.setTimeout(resolve,500);
					// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
					// See crbug.com/110938.
					//video.onloadedmetadata = resolve;
				}, reject);
			});
		},
		isReady : function isReady(){
			return stream && video.readyState == video.HAVE_ENOUGH_DATA;
		},

		getImageData : function getImageData(){
			if(stream){
				ctx.drawImage(video, 0, 0,canvas.width, canvas.height);
				return ctx.getImageData(0,0,canvas.width, canvas.height);
			}
		},
		stream:stream,
		video:video,
		canvas:canvas,
		context:ctx
	}
}