function SnakeAI() {
  
  this.selectDirection = function(snake, food) {
    
  }
  
  this.leftBlocked = function(snake) {
    let blocked = false;
    let leftSpace = getNewSpace(snake.currentSpaces[0], (snake.getNeckDirection() + 3) % 4);
    let frontSpace = getNewSpace(snake.currentSpaces[0], (snake.getNeckDirection()));
    let rightSpace = getNewSpace(snake.currentSpaces[0], (snake.getNeckDirection() + 1) % 4);
    snake.currentSpaces.forEach((space) => {
      if(space.x == leftSpace) {
        blocked = true;
      }
    });
    return blocked;
  }
  
  this.frontBlocked = function(snake) {
    
  }
  
  this.rightBlocked = function(snake) {
    
  }
}