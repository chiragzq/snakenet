function SnakeAI() {
  this.selectDirection = function(spaces, food) {
    let leftBlocked = this.leftBlocked(spaces);
    let frontBlocked = this.frontBlocked(spaces);
    let rightBlocked = this.rightBlocked(spaces);
    if(!(frontBlocked || rightBlocked || leftBlocked)) {
      console.log("no blocked");
      let dx = food.x - spaces[0].x;
      let dy = food.y - spaces[0].y;
      console.log(food.y + " " + spaces[0].y)
      console.log(dy);
      /*switch(getNeckDirection(spaces)) {
        case DOWN:
          dy = -dy;
          break;
        case UP:
          dx = -dx;
          break;
        case RIGHT:
          dy = -dy;
          break;
      }*/
    }
    if(frontBlocked) {
      if(leftBlocked) {
        return 2;
      } else {
        return 0;
      }
    } else {
      return 1;
    }
  }
  
  this.leftBlocked = function(spaces) {
    let blocked = false;
    let leftSpace = getNewSpace(spaces[0], (this.getCurrentDirection(spaces) + 3) % 4);
    if(leftSpace.x < 0 || leftSpace.x >= 20 || leftSpace.y < 0 || leftSpace.y >= 20) return true;
    spaces.forEach((space) => {
      if(space.x == leftSpace) {
        blocked = true;
      }
    });
    
    return blocked;
  }
  
  this.frontBlocked = function(spaces) {
    let blocked = false;
    let frontSpace = getNewSpace(spaces[0], (this.getCurrentDirection(spaces)));
    if(frontSpace.x < 0 || frontSpace.x >= 20 || frontSpace.y < 0 || frontSpace.y >= 20) return true;
    spaces.forEach((space) => {
      if(space.x == frontSpace) {
        blocked = true;
      }
    });
    return blocked;
   
  }
  
  this.rightBlocked = function(spaces) {
    let blocked = false;
    let rightSpace = getNewSpace(spaces[0], (this.getCurrentDirection(spaces) + 1) % 4);
    if(rightSpace.x < 0 || rightSpace.x >= 20 || rightSpace.y < 0 || rightSpace.y >= 20) return true;
    spaces.forEach((space) => {
      if(space.x == rightSpace) {
        blocked = true;
      }
    });
    return blocked;
  }
  
  this.getCurrentDirection = function(spaces) {
    if(spaces[0].x > spaces[1].x) return RIGHT;
    if(spaces[0].y < spaces[1].y) return UP;
    if(spaces[0].y > spaces[1].y) return DOWN;
    if(spaces[0].x < spaces[1].x) return LEFT;
    throw "Bad neck " + spaces;
  }
}