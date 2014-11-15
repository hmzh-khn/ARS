function TransformationFinder(){

	var idealCorners=[
		//Top left finder
		0,0,
		1,1,
		2,2,
		5,5,
		6,6,
		7,7,
		7,0,
		6,1,
		5,2,
		2,5,
		1,6,
		0,7,
		//Top right finder
		18,0,
		19,1,
		20,2,
		23,5,
		24,6,
		25,7,
		25,0,
		24,1,
		23,2,
		20,5,
		19,6,
		18,7,
		//Bottom left finder
		0,18,
		1,19,
		2,20,
		5,23,
		6,24,
		7,25,
		7,18,
		6,19,
		5,20,
		2,23,
		1,24,
		0,25,
		//Alignment pattern
		18,18,
		17,17,
		16,16,
		19,19,
		20,20,
		21,21,

		21,16,
		20,17,
		19,18,
		18,19,
		17,20,
		16,21
	];
	var idealCorners_dict=[];
	for (var i = 0; i < idealCorners.length/2; i++) {
		idealCorners_dict[i]={
			'x':idealCorners[i*2],
			'y':idealCorners[i*2+1]
		}
	};
	var NUM_IDEAL_CORNERS = idealCorners_dict.length;
	var CORNER_THRESH = 20;

	img_u8 = new jsfeat.matrix_t(640, 480, jsfeat.U8_t | jsfeat.C1_t);
    corners = [];
    var i = 640*480;
    while(--i >= 0) {
        corners[i] = new jsfeat.keypoint_t(0,0,0,0);
    }

    // this class allows you to use above Motion Kernels
    // to estimate motion even with wrong correspondences
    var ransac = jsfeat.motion_estimator.ransac;
     
    // create homography kernel
    // you can reuse it for different point sets
    var homo_kernel = new jsfeat.motion_model.homography2d();
    var transform = new jsfeat.matrix_t(3, 3, jsfeat.F32_t | jsfeat.C1_t);
	var mask = new jsfeat.matrix_t(NUM_IDEAL_CORNERS, 1, jsfeat.U8_t | jsfeat.C1_t);

	var model_size = 4; // minimum points to estimate motion
	var thresh = 3; // max error to classify as inlier
	var eps = 0.5; // max outliers ratio
	var prob = 0.99; // probability of success
	var params = new jsfeat.ransac_params_t(model_size, thresh, eps, prob);
	var max_iters = 1000;



    function distsq(ax,ay,bx,by){
    	dx = bx-ax;
    	dy = by-ay;
    	return dx*dx + dy*dy;
    }
    function dist(ax,ay,bx,by){
    	return Math.sqrt(distsq(ax,ay,bx,by));
    }

	var finder={
		discoverMarker: function discoverMarker(imageData){
			//Discover a marker in the image
			//Return the new transformation matrix if it is found,
			//and false otherwise
			try{
				matrix = qrcode.find(imageData);
				return matrix;
			}catch(e){
				console.log(e);
				return false
			}
		},
		findCorners: function findCorners(imageData){
			//Finds corners in the image
			jsfeat.imgproc.grayscale(imageData.data, imageData.width, imageData.height, img_u8);
			jsfeat.fast_corners.set_threshold(CORNER_THRESH);
			var count = jsfeat.fast_corners.detect(img_u8, corners, 5);
			return count;
		},
		transformIdealCorners: function transformIdealCorners(matrix){
			//Returns the ideal corner positions, transformed into the
			//old device space given by matrix
			result = idealCorners.slice(0);
			matrix.transformPoints1(result);
			return result;
		},
		matchingCorners: function matchCorners(idealTransformed, imageData){
			//Finds the corners that match the ideal corners in a
			//given image.
			//Returns a list of a subset of found corners, in order
			//of ideal corners
			count = finder.findCorners(imageData);
			if(count==0) throw new Error("No corners detected");

			result = new Array(idealTransformed.length);
			for (var i = 0, cornernum=0; i < idealTransformed.length; i+=2, cornernum++) {
				//console.log("Checking ideal ",cornernum,idealTransformed[i],idealTransformed[i+1],idealCorners_dict[i]);
				var bestDistSq = Infinity;
				var bestCorner = null;
				for (var j = 0; j < count; j++) {
					var foundPt = corners[j];
					var dsq = dist(foundPt.x,foundPt.y,idealTransformed[i],idealTransformed[i+1]);
					if(dsq < bestDistSq){
						//console.log("Better corner is ",foundPt," at ",j);
						bestDistSq=dsq;
						bestCorner=foundPt;
					}
				};
				//console.log("Best corner is ",bestCorner);
				result[cornernum] = bestCorner;
			};
			return result;
		},
		updateMatrix: function updateMatrix(imageData,matrix){
			//Use corner detection to update the transformation matrix
			//for the new frame
			//Modifies the given transformation matrix and returns true,
			//or returns false if the
			//transformation matrix couldn't be computed
			
			idealTransformed = finder.transformIdealCorners(matrix);
			matches = finder.matchingCorners(idealTransformed, imageData);

			var ok = ransac(params, homo_kernel, idealCorners_dict, matches, NUM_IDEAL_CORNERS, transform, mask, max_iters);
			if(!ok) return false;
			var values = transform.buffer.f32;
			matrix.a11 = values[0];
			matrix.a21 = values[1];
			matrix.a31 = values[2];
			matrix.a12 = values[3];
			matrix.a22 = values[4];
			matrix.a32 = values[5];
			matrix.a13 = values[6];
			matrix.a23 = values[7];
			matrix.a33 = values[8];
		},
		idealCorners:idealCorners,
		corners:corners,
		img_u8:img_u8
	}
	return finder;
}