let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let humanPlayer = true;
const collectData = true;

function SnakeGame() {
  this.gridWidth = 20;
  this.gridHeight = 20;
  this.snake = new Snake(this, snakeNet, humanPlayer);
  this.food = {x: randomInt(0, this.gridWidth), y: randomInt(0,this.gridHeight)};
  this.data = [];
  this.state;
  
  this.step1 = function() {
    this.state = generateState(this);
    let square = this.snake.step1(this.state);
    //ctx.fillStyle = "blue";
    //ctx.fillRect(squareSize * square[1].x, squareSize * square[1].y, squareSize, squareSize);
  }
  
  this.step2 = function() {
    calcDirs(this.snake);
    this.snake.step2(this.food);
    let target = generateTarget(this.snake.currentDirection);
    if(humanPlayer && collectData) {
        this.data.push([this.state, target]);
      //snakeNet.rawInputs.push(features.i);
      //snakeNet.rawTargets.push(features.t);
    }
    
    if(this.snake.hitFood(this.food)) {
      this.food = {x: randomInt(0, this.gridWidth), y: randomInt(0, this.gridHeight)};
      this.snake.grow(3);
    }
    
    if(this.snake.isDead()) {
      this.data.pop();
      saveData(this.data);
      console.log("added " + this.data.length + " moves");
      clearInterval(interval);
      ge("playHuman").disabled = false;
      ge("playNeural").disabled = false;
      ge("trainNet").disabled = false;
      this.data=[];
    }
    else {
      draw(this);
    }
    
  }
}
//leftblocked, frontblocked, rightblocked, facingleft, facingRight, facingUp, facingDown, dx(norm), dy(norm);
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

function startGame(human) {
  ge("playHuman").disabled = true;
  ge("playNeural").disabled = true;
  ge("trainNet").disabled = true;
  humanPlayer = human;
  snakeGame = new SnakeGame();
  interval = setInterval(function() {
    snakeGame.step1();
    setTimeout(function() {
      snakeGame.step2();
    }, 50);
  }, 100);
  console.log("Starting Game: " + human);
}

function trainNet() {
  ge("playHuman").disabled = true;
  ge("playNeural").disabled = true;
  ge("trainNet").disabled = true;
  console.log("Training Net");
  snakeNet.train();
  ge("playHuman").disabled = false;
  ge("playNeural").disabled = false;
  ge("trainNet").disabled = false;
  console.log("done");
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
    let useful = 0;
    console.log("Loaded " + data.length + " moves");
    for(let i = 0;i < data.length;i ++) {
      if (isUsefulSample(data[i])) {
        snakeNet.rawInputs.push(convertStateToFeatures(data[i][0]));
        snakeNet.rawTargets.push(data[i][1]);  
        useful++;
      }
    }
    console.log("Kept " + useful + " moves");
  }
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

snakeNet.loadData();

