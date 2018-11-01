function makeConnectedLayer(graph, inputLayer, index, nodes) {
  return graph.layers.dense(
    "fully_connected_" + index,
    inputLayer,
    nodes,
    (x) => graph.relu(x)
  );
}

function doTraining(fun, times) {
  let count = 1;
  let fun2 = () => {
    fun();
    if(count++ < times) {
      ge("trainProg").value = count;
      setTimeout(fun2, 5);
    } else {
      console.log("done");
      ge("playHuman").disabled = false;
      ge("playNeural").disabled = false;
      ge("trainNet").disabled = false;
      ge("playNeural").disabled = false;
    }
  }
  fun2();
}

function SnakeNet() {
  const iterations = 500;
  const batchSize = 300;
  this.rawInputs = [];
  this.rawTargets = []
  
  this.loadData = function() {
    loadData();
  }
  
  this.train = function() {
    console.log("Training with " + this.rawInputs.length + " samples with " + iterations + " iterations");
    const inputArray= this.rawInputs.map(c => dl.tensor1d(c));
    const targetArray = this.rawTargets.map(o => dl.tensor1d(o));
  
    const shuffledInputProviderBuilder = new dl.InCPUMemoryShuffledInputProviderBuilder([inputArray, targetArray]);
    const [inputProvider, targetProvider] = shuffledInputProviderBuilder.getInputProviders();
    const feedEntries = [
      {tensor: inputTensor, data: inputProvider},
      {tensor: targetTensor, data: targetProvider}
    ];
    doTraining(function() {
      session.train(
      costTensor,
      feedEntries,
      batchSize,
      optimizer,
      dl.CostReduction.NONE);
    }, iterations);
  }

  
  this.selectDirection = function(input) {
    const mapping = [{
      tensor: inputTensor,
      data: dl.tensor1d(input)
    }];
    let classifier = session.eval(outputTensor, mapping).getValues();
    const move = this.bestDirection(classifier);
    return move;
  }
  
  this.bestDirection = function(targets) {
    let max = -1000000;
    let index = -1;
    for(let i = 0;i < targets.length;i ++) {
      if(targets[i] > max) {
        max = targets[i];
        index = i;
      }
    }
   return index;
  }
  
  let initialLearningRate = 0.06;
  let netShape = /* 3 */ [32]; //3
  const math = dl.ENV.math;
  const graph = new dl.Graph();
  const optimizer = new dl.train.sgd(initialLearningRate);
  
  let inputTensor = graph.placeholder('input pair value', [numFeatures]);
  let hiddenLayer = makeConnectedLayer(graph, inputTensor, 0, netShape[0]);
  for(let i = 1;i < netShape.length;i ++) {
    hiddenLayer = makeConnectedLayer(graph, hiddenLayer, i, netShape[i])
  }
  let outputTensor = makeConnectedLayer(graph, hiddenLayer, netShape.length + 1, 3);
  let targetTensor = graph.placeholder('target classifier', [3]);

  let costTensor = graph.meanSquaredCost(targetTensor, outputTensor);
  let session = new dl.Session(graph, math);
}