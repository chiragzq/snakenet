import tensorflow as tf
import numpy as np
import datautil
from util import convertStateToFeatures, isUsefulSample

class SnakeNet:
    ITERATIONS = 500
    BATCH_SIZE = 303
    initialLearningRate = 0.06
    netShape = [32, 3] #input: 4, output: 3
    math = tf.math
    graph = tf.Graph()
    optimizer = tf.keras.optimizers.SGD(initialLearningRate)
    model = tf.keras.models.Sequential()
    model.add(tf.keras.layers.Dense(netShape[0], activation="relu", input_shape=(4,)))
    model.add(tf.keras.layers.Dense(netShape[1], activation="relu", input_shape=(netShape[0], )))
    for i in range(1, len(netShape) - 1):
        model.add(tf.keras.layers.Dense(netShape[i + 1]), activation="relu", input_shape=(netShape[i],))
    #model.add(tf.keras.layers.Dense(netShape[len(netShape) - 1], activation="relu", input_shape=(netShape[len(netShape) - 2],)))
    model.compile(optimizer=optimizer, loss="mean_squared_error", metrics=["accuracy"])

    def __init__(self):
        self.rawInputs = []
        self.rawTargets = []

    def train(self):
        print("Training model with %d samples, %d iterations and batch size %d" % (len(self.rawInputs), self.ITERATIONS, self.BATCH_SIZE))
        #input = tf.convert_to_tensor(self.rawInputs)
        #target = tf.convert_to_tensor(self.rawTargets)
        self.model.fit(np.array(self.rawInputs), np.array(self.rawTargets), batch_size=self.BATCH_SIZE, epochs=self.ITERATIONS, verbose=1)
        print("Done training")
    
    def selectDirection(self, data):
        x = np.zeros((1,4))
        x[0][0] = data[0]
        x[0][1] = data[1]
        x[0][2] = data[2]
        x[0][3] = data[3]
        result = self.model.predict(x)
        return self.bestDirection(result)
    
    def bestDirection(self, target):
        return np.argmax(target)

    def saveData(self, data):
        datautil.saveTrainingData(data)

    def loadData(self):
        data = datautil.loadTrainingData()
        count = 0
        for sample in data:
            if isUsefulSample(sample):
                count += 1
                self.rawInputs.append(convertStateToFeatures(sample[0]))
                self.rawTargets.append(sample[1])
        print("Loaded %d samples out of %d" % (count, len(data)))
        #self.rawInputs = [[0, 0, 1], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 1, 1], [0, 0, 0]]
        #self.rawTargets = [[0, 1, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1], [1, 0, 0], [0, 1, 0]]
