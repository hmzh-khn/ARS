function debugDraw(imageData,matrix){


	debugCanvas = document.getElementById("display");
	ctx = debugCanvas.getContext('2d');
	ctx.putImageData(imageData,0,0);
	points = [0,0,  0,25, 25,25,  25,0];
	matrix.transformPoints1(points);

	ctx.strokeStyle="green";
	ctx.beginPath();
	ctx.moveTo(points[0], points[1]);
	ctx.lineTo(points[2], points[3]);
	ctx.lineTo(points[4], points[5]);
	ctx.lineTo(points[6], points[7]);
	ctx.stroke();
}