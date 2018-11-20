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

function Snake(snakeGame, snakeNet, snakeAI, player) {
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
  this.step1 = function(state, features) {
    let ndir = this.selectDirectionNet(features);
    if(player == HUMAN) {
      dir = this.selectDirection();
    } else if(player == NEURAL) {
      dir = ndir;
    } else if(player == AI) {
      dir = this.selectDirectionAI(state);
    }
    this.currentDirection = dir;
    return [getNewSpace(this.currentSpaces[0], dir), getNewSpace(this.currentSpaces[0], ndir)];
  }

  this.step2 = function() {
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
  
  this.selectDirectionNet = function(features) {
    let dir = snakeNet.selectDirection(features);
    let ret = (this.currentDirection + dir + 3) % 4;
    return ret;
  }

  this.selectDirectionAI = function(state) {
    let spaces = expandSpaces(state.s);
    let dir = snakeAI.selectDirection(spaces, state.f);
    let ret = (this.currentDirection + dir + 3) % 4;
    return ret;
  }
}

let lastKeyCode = 0;
window.onkeydown = function(e) { lastKeyCode = e.keyCode; }