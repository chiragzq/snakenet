const numFeatures = 3;
/**
 * Converts a list of spaces into a list of vertices
 * @param spaces this list of spaces to compress
 * @return a list of spaces where the snake turns
 */
function compressSpaces(spaces) {
  let vertices = [];
  let vertX = -1;
  let vertY = -1;
  let xy = true;
  let previousSpace;
  spaces.forEach((space, index) => {
    if(index == 0) {
      vertices.push(space);
      vertX = space.x;
      vertY = space.y;
      previousSpace = space;
    } else if(index == 1) {
      if(space.y == vertY) xy = false;
      previousSpace = space;
    } else {
      if(xy) {
        if(space.x != vertX) {
          vertices.push(previousSpace);
          xy = false;
          vertX = space.x;
          vertY = space.y;
        }
      } else {
        if(space.y != vertY) {
          vertices.push(previousSpace);
          xy = true;
          vertX = space.x;
          vertY = space.y;
        }
      }
    }
    previousSpace = space;
  });
  
  vertices.push(previousSpace);
  return vertices;
}

/**
 * expands a compressed list of vertices into a full list of spaces
 * @param state a compressed list of vertices
 * @return a full list of spaces
 */
function expandSpaces(state) {
  let spaces = [];
  
  for(let i = 0;i < state.length - 1;i ++) {
    let ax = state[i].x;
    let ay = state[i].y;
    let deltax = state[i+1].x - ax;
    let deltay = state[i+1].y - ay;
    deltax = (deltax > 0) - (deltax < 0);
    deltay = (deltay > 0) - (deltay < 0);
    while((ax != state[i+1].x) != (ay != state[i+1].y)) {
      spaces.push({x: ax, y: ay});
      ax += deltax;
      ay += deltay;
    }
  }
  spaces.push(state[state.length - 1]);
  return spaces;
}


/**
 * Generates features (snake spaces and food) from a snakeGame
 * @param snakeGame to snakeGame to generate features from
 * @return an object with spaces and food
 */
function generateState(snakeGame) {
  let spaces = compressSpaces(snakeGame.snake.currentSpaces);
  let food = snakeGame.food;
  
  return {
    s: spaces,
    f: food
  };
}

function generateTarget(snake, dir) {
  let target = [0, 0, 0];
  let frontDirection = (snake.getNeckDirection() + 2) % 4;
  let leftDirection = (frontDirection + 3) % 4;
  let rightDirection = (frontDirection + 1) % 4;
  let leftSpace = getNewSpace(snake.currentSpaces[0], leftDirection);
  let frontSpace = getNewSpace(snake.currentSpaces[0], frontDirection);
  let rightSpace = getNewSpace(snake.currentSpaces[0], rightDirection);
  
  target[0] = dir == leftDirection ? 1 : 0;
  target[1] = dir == frontDirection ? 1 : 0;
  target[2] = dir == rightDirection ? 1 : 0;
  return target;
}

function getNewSpace(square, direction) {
  let offsets = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  return {
    x: square.x + offsets[direction][0],
    y: square.y + offsets[direction][1]
  };
}

//leftblocked, frontblocked, rightblocked, dx, dy
function convertStateToFeatures(state) {
  let data = [];
  for(let i = 0; i < numFeatures; i ++) {
    data.push(0);
  }
  
  let spaces = expandSpaces(state.s);
  
  let frontDirection = (getNeckDirection(spaces) + 2) % 4;
  let leftDirection = (frontDirection + 3) % 4;
  let rightDirection = (frontDirection + 1) % 4;
  let leftSpace = getNewSpace(spaces[0], leftDirection);
  let frontSpace = getNewSpace(spaces[0], frontDirection);
  let rightSpace = getNewSpace(spaces[0], rightDirection);
  
  spaces.forEach((space) => {
    if(space.x == leftSpace.x && space.y == leftSpace.y) data[0] = 1;
    if(space.x == frontSpace.x && space.y == frontSpace.y) data[1] = 1;
    if(space.x == rightSpace.x && space.y == rightSpace.y) data[2] = 1;
  });
  
  if(frontSpace.x < 0 || frontSpace.y < 0 || frontSpace.y >= snakeGame.gridHeight || frontSpace.x >= snakeGame.gridWidth) data[1] = 1;
  if(leftSpace.x < 0 || leftSpace.y < 0 || leftSpace.y >= snakeGame.gridHeight || leftSpace.x >= snakeGame.gridWidth) data[0] = 1;
  if(rightSpace.x < 0 || rightSpace.y < 0 || rightSpace.y >= snakeGame.gridHeight || rightSpace.x >= snakeGame.gridWidth) data[2] = 1;
  
  /*let dx = state.f.x - spaces[0].x;
  let dy = state.f.y - spaces[0].y;
  switch(getNeckDirection(spaces)) {
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
  }*/
  
  return data;
}

function getNeckDirection(spaces) {
  if(spaces[0].x < spaces[1].x) return RIGHT;
  if(spaces[0].y > spaces[1].y) return UP;
  if(spaces[0].y < spaces[1].y) return DOWN;
  if(spaces[0].x > spaces[1].x) return LEFT;
  throw "Bad Neck " + spaces;
}