let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let player = 0;
let DEBUG_NET = false;
let DRAW_SPATH = false;
const collectData = true;
const HUMAN = 0;
const NEURAL = 1;
const AI = 2;
let GAME_INTERVAL = 50;

function SnakeGame() {
  this.gridWidth = 20;
  this.gridHeight = 20;
  this.snake = new Snake(this, snakeNet, snakeAI, player);
  this.food = {x: randomInt(0, this.gridWidth), y: randomInt(0,this.gridHeight)};
  this.data = [];
  this.state;
  
  this.step1 = function() {
    this.state = generateState(this);
    let features = convertStateToFeatures(this.state);
    
    
    updateParamDisplay(features);
    let square = this.snake.step1(this.state, features);
    if(DEBUG_NET) {
      ctx.fillStyle = "blue";
      ctx.fillRect(squareSize * square[1].x, squareSize * square[1].y, squareSize, squareSize);
    }
    
    if(DRAW_SPATH) {
      snakeAI.drawShortestPath(this.state.s, this.food);
    }
    updateScore(this.snake.currentSpaces.length);
  }
  
  this.step2 = function() {
    calcDirs(this.snake);
    this.snake.step2();
    let target = generateTarget(this.snake.currentDirection);
    if((player == HUMAN || player == AI) && collectData) {
        this.data.push([this.state, target]);
      //snakeNet.rawInputs.push(features.i);
      //snakeNet.rawTargets.push(features.t);
    }
    
    if(this.snake.hitFood(this.food)) {
      if(this.snake.currentSpaces.length > 200) {
        let validSpaces = [];
        for(let i = 0;i < this.gridWidth;i ++) {
          for(let j = 0;j < this.gridHeight;j ++) {
            if(valid({x: i, y: j}, this.snake.currentSpaces)) {
              validSpaces.push({x: i, y: j});
            }
          }
        }
        this.food = validSpaces[randomInt(0, validSpaces.length)];
      } else {
        this.food = {x: randomInt(0, this.gridWidth),y: randomInt(0, this.gridHeight)};
        while(!valid(this.food, this.snake.currentSpaces)) {
         this.food = {x: randomInt(0, this.gridWidth),y: randomInt(0, this.gridHeight)};
        }
      }
      this.snake.grow(3);
    }
    
    if(this.snake.isDead()) {
      this.data.pop();
      saveData(this.data);
      console.log("added " + this.data.length + " moves");
      clearInterval(interval);
      interval = null;
      ge("playHuman").disabled = false;
      ge("playNeural").disabled = false;
      ge("trainNet").disabled = false;
      ge("playAI").disabled = false;
      this.data=[];
    }
    else {
      draw(this);
    }
  }
}

let snakeAI = new SnakeAI();
let snakeNet = new SnakeNet();
let snakeGame = new SnakeGame();
let interval;
let squareSize = canvas.width / snakeGame.gridWidth;
let lineThickness = 1;

function draw(snakeGame) {

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "yellow";
  snakeGame.snake.currentSpaces.forEach((square) => {
    ctx.fillRect(squareSize * square.x, squareSize * square.y, squareSize, squareSize);
  });
  
  ctx.fillStyle = "red";
  ctx.fillRect(squareSize * snakeGame.food.x, squareSize * snakeGame.food.y, squareSize, squareSize);
  
  ctx.fillStyle = "black";
  for(let i = 0; i < snakeGame.gridWidth;i ++) {
    ctx.fillRect(i * squareSize, 0, lineThickness, canvas.height);
  }
  for(let i = 0; i < snakeGame.gridHeight;i ++) {
    ctx.fillRect(0, i * squareSize, canvas.width, lineThickness);
  }
  
}

function startGame(player1) {
  ge("playHuman").disabled = true;
  ge("playNeural").disabled = true;
  ge("trainNet").disabled = true;
  ge("playNeural").disabled = true;
  ge("playAI").disabled = true;
  player = player1;
  snakeGame = new SnakeGame();
  interval = setInterval(function() {
    snakeGame.step1();
    setTimeout(function() {
      snakeGame.step2();
    }, GAME_INTERVAL/2);
  }, GAME_INTERVAL);
  console.log("Starting Game: " + player);
}

function trainNet() {
  ge("playHuman").disabled = true;
  ge("playNeural").disabled = true;
  ge("trainNet").disabled = true;
  ge("playNeural").disabled = true;
  console.log("Training Net");
  snakeNet.train();
}

function clearTrainingData() {
  console.log("Training Data Cleared");
  snakeNet.rawInputs = [];
  snakeNet.rawTargets = [];
}

function stop() {
  ge("playHuman").disabled = false;
  ge("playNeural").disabled = false;
  ge("trainNet").disabled = false;
  ge("playNeural").disabled = false;
  ge("playAI").disabled = false;
  clearInterval(interval);
}

function ge(id) {
  return document.getElementById(id);
}

const key = "traindata";

function loadData() {
  if(!localStorage[key]) {
    console.error("no data");
  } else {
    let data = JSON.parse(localStorage[key]);
    let totalLoaded = 0;
    for(let i = 0;i < data.length;i ++) {
      if(isUsefulSample(data[i])) {
        totalLoaded++;
        snakeNet.rawInputs.push(convertStateToFeatures(data[i][0]));
        snakeNet.rawTargets.push(data[i][1]);
      }
    }
    console.log("Loaded " + totalLoaded + " moves out of " + data.length + " total moves");
    // [[0, 0, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 1, 1]];
    // [[0, 1, 0], [0, 1, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1], [1, 0, 0]];
    //snakeNet.rawInputs = [[0, 0, 1], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 1, 1]];
    //snakeNet.rawTargets = [[0, 1, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1], [1, 0, 0]];
  }
}


function valid(space, spaces) {
  if(space.x < 0 || space.x >= 20 || space.y < 0 || space.y >= 20) {
    return false;
  }
  for(let i = 0;i < spaces.length;i ++) {
    if(space.x == spaces[i].x && space.y == spaces[i].y) {
      return false;
    }
  }
  return true;
}

function saveData(data) {
  if(!localStorage[key]) {
    localStorage[key] = "[]";
  }
  let oldData = JSON.parse(localStorage[key]);
  oldData = oldData.concat(data);
  
  localStorage[key] = JSON.stringify(oldData);
}

function importData() {
  let file = ge("import").files[0];
  let reader = new FileReader();
  
  reader.onload = function(event) {
    let content = event.target.result;
    saveData(JSON.parse(content));
  }
  
  reader.readAsText(file)
}

function exportData() {
  let filename = "data";
  let extension = "txt";
  let stringData = localStorage[key];
  
  let a = document.createElement("a");
  
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(stringData);
  a.download = filename + "." + extension;
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
            document.body.removeChild(a);
  }, 0);
}

function killSnake() {
  snakeGame.snake.currentSpaces[0].x = 4399;
}



snakeNet.loadData();

