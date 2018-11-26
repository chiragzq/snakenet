import pygame
import threading
from pygame.locals import K_UP, K_RIGHT, K_DOWN, K_LEFT
from math import atan2, pi
from random import randint

UP = 0
RIGHT = 1
DOWN = 2
LEFT = 3

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

class Player:
    HUMAN = 0
    NEURAL = 1
    AI = 2
    DATA = 3

def getNewSpace(space, dir):
    offsets = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    return Space(offsets[dir][0] + space.x, offsets[dir][1] + space.y)

def printList(list):
    for elem in list:
        print(str(elem))


def generateState(spaces, food):
    return (compressSpaces(spaces), (food.x, food.y))


def convertStateToFeatures(state, gridWidth = 20, gridHeight = 20):
    data = [0, 0, 0, 0]
    spaces = expandSpaces(state[0])

    frontDirection = getCurrentDirection(spaces)
    leftDirection = (frontDirection + 3) % 4
    rightDirection = (frontDirection + 1) % 4

    leftSpace = getNewSpace(spaces[0], leftDirection)
    frontSpace = getNewSpace(spaces[0], frontDirection)
    rightSpace = getNewSpace(spaces[0], rightDirection)

    for space in spaces:
        if space.equals(leftSpace): data[0] = 1
        if space.equals(frontSpace): data[1] = 1
        if space.equals(rightSpace): data[2] = 1

    if frontSpace.x < 0 or frontSpace.y < 0 or frontSpace.y >= gridHeight or frontSpace.x >= gridWidth: data[1] = 1
    if leftSpace.x < 0 or leftSpace.y < 0 or leftSpace.y >= gridHeight or leftSpace.x >= gridWidth: data[0] = 1
    if rightSpace.x < 0 or rightSpace.y < 0 or rightSpace.y >= gridHeight or rightSpace.x >= gridWidth: data[2] = 1
    
    dx = state[1][0] - spaces[0].x
    dy = state[1][1] - spaces[0].x
    angle = 180 * atan2(dy, dx) / pi
    frontAngle = (-90, 0, 90, 180)[frontDirection]
    turnAngle = (frontAngle - angle) / 180
    if turnAngle <= -1: turnAngle += 2
    if turnAngle > 1: turnAngle -= 2
    data[3] = turnAngle

    return data

def compressSpaces(spaces):
    vertices = []
    vertX = -1
    vertY = -1
    xy = True
    previousSpace = None
    for index, space in enumerate(spaces):
        if index == 0:
            vertices.append((space.x, space.y))
            vertX = space.x
            vertY = space.y
            previousSpace = space
        elif index == 1:
            if space.y == vertY: xy = False
            previousSpace = space
        else:
            if xy:
                if space.x != vertX:
                    vertices.append((previousSpace.x, previousSpace.y))
                    xy = False
                    vertX = space.x
                    vertY = space.y
            else:
                if space.y != vertY:
                    vertices.append((previousSpace.x, previousSpace.y))
                    xy = True
                    vertX = space.x
                    vertY = space.y
        previousSpace = space
    vertices.append((previousSpace.x, previousSpace.y))
    return vertices

def expandSpaces(state):
    spaces = []
    for i in range(0, len(state) - 1):
        ax = state[i][0]
        ay = state[i][1]
        deltax = state[i+1][0] - ax
        deltay = state[i+1][1] - ay
        deltax = (deltax > 0) - (deltax < 0)
        deltay = (deltay > 0) - (deltay < 0)
        while (ax != state[i+1][0]) !=  (ay != state[i+1][1]):
            spaces.append(Space(ax, ay))
            ax += deltax
            ay += deltay
    spaces.append(Space(state[len(state) - 1][0], state[len(state) - 1][1]))
    return spaces

def generateTarget(oldDir, newDir):
    leftDir = (oldDir + 3) % 4
    rightDir = (oldDir + 1) % 4
    target = [0, 0, 0]
    target[0] = 1 if newDir == leftDir else 0
    target[1] = 1 if newDir == oldDir else 0
    target[2] = 1 if newDir == rightDir else 0
    return target

def getNeckDirection(spaces):
    if spaces[0].x < spaces[1].x: return RIGHT
    if spaces[0].x > spaces[1].x: return LEFT
    if spaces[0].y > spaces[1].y: return UP
    if spaces[0].y < spaces[1].y: return DOWN
    raise ValueError("bad neck: " + str(spaces))

def getCurrentDirection(spaces):
    return (getNeckDirection(spaces) + 2) % 4

def isUsefulSample(sample):
    if sample[1][0] > 0 or sample[1][2] > 0:
        return True
    return randint(0, 100) < 25