
function Webcam(){
	var constraints = {
	  video: {
	    mandatory: {
	      maxWidth: 640,
	      maxHeight: 360
	    }
	  }
	};
	var stream, video, canvas, ctx;

	return {
		setup : function setup(){
			if(stream) return new Promise(function(resolve){
				resolve();
			}); //already set up. resolve

			video = document.getElementById('streamVideo');
			canvas = document.getElementById('processCanvas');
			ctx = canvas.getContext('2d');

			return new Promise(function(resolve, reject){
				compatibility.getUserMedia(constraints, function(localMediaStream) {
					stream = localMediaStream;
					video.src = window.URL.createObjectURL(localMediaStream);

					resolve();
					// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
					// See crbug.com/110938.
					//video.onloadedmetadata = resolve;
				}, reject);
			});
		},
		getImageData : function getImageData(){
			if(stream){
				ctx.drawImage(video, 0, 0);
				return ctx.getImageData(0,0,canvas.width, canvas.height);
			}
		},
		stream:stream,
		video:video,
		canvas:canvas,
		context:ctx
	}
}