function adjacentValidSquare(square) {
  return {
    x: square.x,
    y: square.y - 1,
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const UP = 0, RIGHT = 1, DOWN = 2, LEFT = 3;
const SCALE = 20;

function Snake(snakeGame, snakeNet, humanPlayer) {
  this.size = 5;
  this.currentSpaces = [];
  this.currentDirection = 2;
  this.growAmount = 0;
  lastKeyCode = 0; //down
  
  for(let i = 0;i < this.size;i ++) {
    if(i == 0) {
      this.currentSpaces.push({
        x: randomInt(0, snakeGame.gridWidth),
        y: randomInt(0, snakeGame.gridHeight - this.size)
      });
    } else {
      this.currentSpaces.push(adjacentValidSquare(this.currentSpaces[i - 1]));
    }
  }
  
  this.getNeckDirection = function() {
    if(this.currentSpaces[0].x < this.currentSpaces[1].x) return RIGHT;
    if(this.currentSpaces[0].y > this.currentSpaces[1].y) return UP;
    if(this.currentSpaces[0].y < this.currentSpaces[1].y) return DOWN;
    if(this.currentSpaces[0].x > this.currentSpaces[1].x) return LEFT;
    throw "Bad neck " + this.currentSpaces;
  }
  
  this.selectDirection = function() {
    /*let dirs = [0, 1, 2, 3];
    dirs.splice(dirs.indexOf(this.getNeckDirection()), 1);
    return dirs[randomInt(0,3)];*/
    let ret = this.currentDirection;
    if(lastKeyCode == 38) ret = UP;
    if(lastKeyCode == 39) ret = RIGHT;
    if(lastKeyCode == 40) ret = DOWN;
    if(lastKeyCode == 37) ret = LEFT;
    return ret;
  }
  
  let dir;
  this.step1 = function(state) {
    dir = humanPlayer ? this.selectDirection() : this.selectDirectionNet(state);
    let ndir = this.selectDirectionNet(state);
    this.currentDirection = dir;
    return [getNewSpace(this.currentSpaces[0], dir), getNewSpace(this.currentSpaces[0], ndir)];
  }

  this.step2 = function(food) {
    if(!this.growAmount) {
      let temp = getNewSpace(this.currentSpaces[0], dir);
      for(let i = this.currentSpaces.length - 2;i >= 0;i --) {
        this.currentSpaces[i + 1] = this.currentSpaces[i];
      }
      this.currentSpaces[0] = temp;
    } else {
      this.growAmount--;
      this.size++;
      for(let i = this.currentSpaces.length - 1;i >= 0;i --) {
        this.currentSpaces[i + 1] = this.currentSpaces[i];
      }
      this.currentSpaces[0] = getNewSpace(this.currentSpaces[0], dir);
    }
  }
  
  this.isDead = function() {
    let dead = false;
    let x = this.currentSpaces[0].x;
    let y = this.currentSpaces[0].y;
    if(x < 0 || x >= snakeGame.gridWidth || y < 0 || y >= snakeGame.gridHeight) return true;
    this.currentSpaces.forEach((square, index) => {
      if(!index || dead) return;
      if(x == square.x && y == square.y) dead = true;
    });
    return dead;
  }
  
  this.hitFood = function(food) {
    return food.x == this.currentSpaces[0].x && food.y == this.currentSpaces[0].y;
  }
  
  this.grow = function(amount) {
    this.growAmount += amount;
  }
  
  //leftblocked, frontblocked, rightblocked, dh(norm), dv(norm);
  this.generateFeatures = function(food) {
    let data = [0, 0, 0, 0, 0];
    let frontDirection = (this.getNeckDirection() + 2) % 4;
    let leftDirection = (frontDirection + 3) % 4;
    let rightDirection = (frontDirection + 1) % 4;
    let leftSpace = getNewSpace(this.currentSpaces[0], leftDirection);
    let frontSpace = getNewSpace(this.currentSpaces[0], frontDirection);
    let rightSpace = getNewSpace(this.currentSpaces[0], rightDirection);
    
    this.currentSpaces.forEach((space) => {
      if(space.x == leftSpace.x && space.y == leftSpace.y) data[0] = 1;
      if(space.x == frontSpace.x && space.y == frontSpace.y) data[1] = 1;
      if(space.x == rightSpace.x && space.y == rightSpace.y) data[2] = 1;
    });

    
    if(frontSpace.x < 0 || frontSpace.y < 0 || frontSpace.y >= snakeGame.gridHeight || frontSpace.x >= snakeGame.gridWidth) data[1] = 1;
    if(leftSpace.x < 0 || leftSpace.y < 0 || leftSpace.y >= snakeGame.gridHeight || leftSpace.x >= snakeGame.gridWidth) data[0] = 1;
    if(rightSpace.x < 0 || rightSpace.y < 0 || rightSpace.y >= snakeGame.gridHeight || rightSpace.x >= snakeGame.gridWidth) data[2] = 1;
    
    let dx = food.x - this.currentSpaces[0].x;
    let dy = food.y - this.currentSpaces[0].y;
    switch(this.currentDirection) {
      case UP:
        data[3] = dx / SCALE;
        data[4] = -dy / SCALE;
        break;
      case DOWN:
        data[3] = -dx / SCALE;
        data[4] = dy / SCALE;
        break;
      case LEFT:
        data[3] = -dy / SCALE;
        data[4] = dx / SCALE;
        break;
      case RIGHT:
        data[3] =  dy / SCALE;
        data[4] =  dx / SCALE;
        break;
    }
    
    return data;
  }
  
  //leftblocked, frontblocked, rightblocked, facingleft, facingRight, facingUp, facingDown, dx(norm), dy(norm);
  
  this.selectDirectionNet = function(state) {
    let dir = snakeNet.selectDirection(convertStateToFeatures(state));
    let ret = (this.currentDirection + dir + 3) % 4;
    return ret;
  }
  
  this.generateFullTrainingData = function(dir, food) {
    
  }
  
  this.compressState = function() {
    let vertices = [];
    this.currentSpaces.forEach((node) => {
      
    });
  }
  
  this.expandState = function(state) {
    
  }
}

let lastKeyCode = 0;
window.onkeydown = function(e) { lastKeyCode = e.keyCode; }