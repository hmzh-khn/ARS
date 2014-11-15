function DeviceOrientationDetector(){
    var enabled = false;
    var acceleration = {x:0,y:0,z:0};
    function deviceMotionHandler(eventData){
    	acceleration = eventData.accelerationIncludingGravity;
    }
	return {
		setup:function setup(){
			if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
			  window.addEventListener('devicemotion', deviceMotionHandler, false);
			  enabled=true;
			}
		},
		detect: function detect(){
			return acceleration;
		}
	}
}