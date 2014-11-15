var UP = RIGHT = 1,
	DOWN = LEFT = -1,
	NONE = 0;

var gameOver = false;

// make board of height height and width width with (0,0) at bottom left
function Board(width, height) {
	// this.representation = [];
	// for(var i = 0; i < height; i++) {
	// 	this.representation.push([]);
	// }
	this.width = width || 25;
	this.height = height || 25;
	this.placeFood();
}

Board.prototype.placeFood = function placeFood() {
	var x = Math.floor(Math.random()*this.width);
	var y = Math.floor(Math.random()*this.height);

	while(this.hitsBlock(new Position(x,y))||snake.occupies(new Position(x,y))) {
		x = Math.floor(Math.random()*this.width);
		y = Math.floor(Math.random()*this.height);
	}

	this.foodPos = new Position(x,y);
};

Board.prototype.hitsBlock = function hitsBlock(pos){
	return (
		(pos.x<=6 && pos.y<=6) ||
		(pos.x<=6 && pos.y>=18) ||
		(pos.x>=18 && pos.y<=6) ||
		(pos.x>=16 && pos.x<=20 && pos.y>=16 && pos.y<=20)
	);
}



function Position(x, y) {
	this.x = x;
	this.y = y;
}

// equality for positions
Position.prototype.equals = function equals(pos2) {
	// chack for equality between two positions
	return this.x === pos2.x && this.y === pos2.y;
};

function Snake(headPos) {
	this.headPos = headPos || new Position(12,12);
	this.positions = [this.headPos,this.headPos,this.headPos,this.headPos,this.headPos];
		
	this.direction = {dx:NONE, dy:UP};
	this.digestions = [];

}

// return snake size
Snake.prototype.size = function size() {
	return this.positions.length;
};

Snake.prototype.turnLeft = function turnLeft() {
	// change the direction of snake movement to left
	// fails if the exact opposite movement
	var odx = this.direction.dx;
	var ody = this.direction.dy;

	this.direction = {dx:-ody, dy:odx};
};

Snake.prototype.turnRight = function turnRight() {
	// change the direction of snake movement to right
	// fails if the exact opposite movement
	
	var odx = this.direction.dx;
	var ody = this.direction.dy;

	this.direction = {dx:ody, dy:-odx};
};

Snake.prototype.move = function move() {
	// move the headPos in the direction, then shift all other pos's to right
	// if there is a collision, the player loses
	var newX = calcNewVar(this.headPos.x, this.direction.dx, board.width);
	var newY = calcNewVar(this.headPos.y, this.direction.dy, board.height);
	var newPos = new Position(newX, newY);

	if(board.hitsBlock(newPos) || snake.occupies(newPos)) {
		//gameOver = true;
		console.log('You lose!');
		this.headPos = new Position(12,12);
		this.direction = {dx:NONE, dy:UP};
		this.positions = [this.headPos,this.headPos,this.headPos,this.headPos,this.headPos];
		this.digestions=[];
		document.getElementById('score').innerHTML = "Score: 0";
	}
	else {
		this.positions.unshift(newPos); // remove oldestPos
		this.headPos = newPos;

		// /* Check that snake needs to grow */
		// var digestionEnd;
		// for(var i = 0; i < this.digestions.length; i++) {
		// 	digestionEnd = this.digestions.map(function(pos1) {return pos1.equals(this.digestions[i])}).indexOf(true) != -1;
		// }

		// if not grow, then pop last position
		
		if(board.foodPos.equals(newPos)) {
			board.placeFood();
			document.getElementById('score').innerHTML = "Score: "+(this.positions.length-5);
		}else{
			this.positions.pop();
		}

	}

};

/*Snake.prototype.eatFood = function eatFood(newPos) {
	this.digestions.push(newPos);
	board.placeFood(); // place new food
}*/

// return true if the snake is in a position
Snake.prototype.occupies = function occupies(pos2) {
	return this.positions.map(function(pos1) {return pos1.equals(pos2)}).indexOf(true) != -1;
};

// Calculate the new position of a moving snake, including wrap arounds.
var calcNewVar = function(i, delta, upperBound) {
	if(i == 0 && delta < 0) {
		return upperBound - 1;
	}
	else if(i == upperBound - 1 && delta > 0) {
		return 0;
	}
	else {
		return i + delta;
	}
};




var snake = new Snake();
var board = new Board();



/*
// EVENTS
document.body.addEventListener(function(e) {
	var key = e.key;
	var dir = null;
	switch(key) {
		case 37: // left
			dir = LEFT;
			break;
		case 38: // up
			dir = UP;
			break;
		case 39: // right
			dir = RIGHT;
			break;
		case 40: // down
			dir = DOWN;
			break;
	snake.turn(dir);
	}
});
*/
