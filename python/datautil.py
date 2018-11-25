import os
import json

def saveTrainingData(data):
    fileData = loadTrainingData()
    fileData.extend(data)
    writeTrainingData(fileData)

def loadTrainingData():
    datadir = "/data"
    if not os.path.exists(datadir):
        os.makedirs(datadir)
    files = os.listdir(os.getcwd() + datadir)
    data = []
    if len(files) == 0:
        print("There is no data!")
    else:
        for filename in files:
            with open(os.getcwd() + datadir + "/" + filename, "r") as f:
                data.extend(json.load(f))
    return data

def writeTrainingData(data):
    datadir = "/data"
    filename = "data.txt"
    if not os.path.exists(datadir):
        os.makedirs(datadir)
    with open(os.getcwd() + datadir + "/" + filename, "w") as f:
        json.dump(data, f, separators=(",", ":"))
    
