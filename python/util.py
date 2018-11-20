import pygame

class Space:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def equals(self, space):
        return self.x == space.x and self.y == space.y

    def __str__(self):
        return "(" + str(self.x) + ", " + str(self.y) + ")"

class Color:
    WHITE = (255, 255, 255)
    BLACK = (0, 0, 0)
    RED = (255, 0, 0)
    YELLOW = (255, 255, 0)
    BLUE = (0, 0, 255)

def getNewSpace(space, dir):
    offsets = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    return Space(offsets[dir][0] + space.x, offsets[dir][1] + space.y)

def printList(list):
    for elem in list:
        print(str(elem))

