function TransformationFinder(){



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
		},
		transformIdealCorners: function transformIdealCorners(matrix){
			//Returns the ideal corner positions, transformed into the
			//old device space given by matrix
		},
		matchCorners: function matchCorners(ideal,found){
			//Attempts to find the found corner corresponding to each
			//ideal corner.
			//Returns a list of a subset of found corners, in order
			//of ideal corners
		},
		updateMatrix: function updateMatrix(imageData,oldMatrix){
			//Use corner detection to update the transformation matrix
			//for the new frame
			//Returns the new transformation matrix, or false if the
			//transformation matrix couldn't be computed
		}
	}
	return finder;
}