let dx = [0, 1, 0, -1];
let dy = [-1, 0, 1, 0];

function SnakeAI() {
  this.selectDirection = function(spaces, food) {
    let leftSpace = getNewSpace(spaces[0], (this.getCurrentDirection(spaces) + 3) % 4);
    let frontSpace = getNewSpace(spaces[0], this.getCurrentDirection(spaces));
    let rightSpace = getNewSpace(spaces[0], (this.getCurrentDirection(spaces) + 1) % 4);
    let bfs = this.bfs(spaces, food);
    
    if(bfs.length == 0) {
      let leftBlocked = this.leftBlocked(spaces);
      let frontBlocked = this.frontBlocked(spaces);
      let rightBlocked = this.rightBlocked(spaces);
      if(frontBlocked) {
        if(leftBlocked) {
          return 2;
        }
        return 0;
      }
      return 1;
    }

    if(this.equals(bfs[1], leftSpace)) {
      return 0;
    }
    if(this.equals(bfs[1], rightSpace)) {
      return 2;
    }
    return 1;
  }
  
  this.bfs = function(spaces, food) {
    let queue = [spaces[0]];
    let visited = [];
    let p = [];
    for(let i = 0;i < 20;i ++) {
      visited.push([]);
      p.push([]);
      for(let j = 0;j < 20;j ++) {
        visited[i].push(false);
        p[i].push({x: i, y: j});
      }
    }
    visited[spaces[0].x][spaces[0].y] = true;
    
    while(queue.length != 0) {
      let space = queue.shift();
      if(space.x == food.x && space.y == food.y) {
        let path = [space];
        while(!this.equals(p[space.x][space.y], space)) {
          space = p[space.x][space.y];
          path.push(space);
        }
        return path.reverse();
      }
      
      for(let i = 0;i < 4;i ++) {
        let newSpace = {x: space.x + dx[i], y: space.y + dy[i]};
        if(valid(newSpace, spaces) && !visited[newSpace.x][newSpace.y]) {
          p[newSpace.x][newSpace.y] = space;
          visited[newSpace.x][newSpace.y] = true;
          queue.push(newSpace);
        }
      }
    }
    return [];
  }
  
  this.leftBlocked = function(spaces) {
    let blocked = false;
    let leftSpace = getNewSpace(spaces[0], (this.getCurrentDirection(spaces) + 3) % 4);
    if(leftSpace.x < 0 || leftSpace.x >= 20 || leftSpace.y < 0 || leftSpace.y >= 20) return true;
    spaces.forEach((space) => {
      if(space.x == leftSpace.x && space.y == leftSpace.y) {
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
      if(space.x == frontSpace.x && space.y == frontSpace.y) {
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
      if(space.x == rightSpace.x && space.y == rightSpace.y) {
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
  
  this.equals = function(space1, space2) {
    return space1.x == space2.x && space1.y == space2.y;
  }
  
  this.drawShortestPath = function(spaces, food) {
    let bfs = this.bfs(spaces, food);
    ctx.fillStyle = "green";
    bfs.forEach((square) => {
      ctx.fillRect(squareSize * square.x, squareSize * square.y, squareSize, squareSize);
    });
  }
}