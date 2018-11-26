import os
import json

def saveTrainingData(data):
    if len(data) == 0:
        return
    writeTrainingData(data)

def loadTrainingData():
    datadir = "/data"
    if not os.path.exists(os.getcwd() + datadir):
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
    if not os.path.exists(os.getcwd() + datadir):
        os.makedirs(datadir)
    if not os.path.exists(os.getcwd() + datadir + "/" + filename):
        with open(os.getcwd() + datadir + "/" + filename, "w") as f:
            json.dump(data, f, separators=(",", ":"))
    else:
        with open(os.getcwd() + datadir + "/" + filename, "rb+") as f:
            f.seek(-1, os.SEEK_END)
            f.truncate()
        s = "," + json.dumps(data, separators=(",", ":"))[1 :]
        with open(os.getcwd() + datadir + "/" + filename, "a") as f:
            f.write(s)
    
