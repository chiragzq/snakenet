import pygame
from pygame.locals import K_UP, K_RIGHT, K_DOWN, K_LEFT
from util import Space, getNewSpace, printList
from random import randint

UP = 0
RIGHT = 1
DOWN = 2
LEFT = 3

class Snake:
    def __init__(self, snakeGame):
        self.size = 5
        self.direction = DOWN
        self.spaces = []
        self.grow = 0
        self.snakeGame = snakeGame
        self.stepDir = 0
        
        for i in range(0, self.size):
            if i == 0:
                self.spaces.append(Space(
                        randint(0, snakeGame.gridWidth - 1),
                        randint(3, snakeGame.gridHeight - self.size - 3)
                    ))
            else:
                self.spaces.append(self.adjacentSquare(self.spaces[i - 1]))
    
    def step1(self):
        self.stepDir = self.selectDirection()
        self.direction = self.stepDir
        return getNewSpace(self.spaces[0], self.direction)

    def step2(self):
        if self.grow > 0:
            self.grow -= 1
            self.size += 1
            self.spaces.append(None)
            for i in range(len(self.spaces) - 2, -1, -1):
                self.spaces[i + 1] = self.spaces[i]
            self.spaces[0] = getNewSpace(self.spaces[0], self.direction)
        else:
            newSpace = getNewSpace(self.spaces[0], self.direction)
            for i in range(len(self.spaces) - 2, -1, -1):
                self.spaces[i + 1] = self.spaces[i]
            self.spaces[0] = newSpace

    def adjacentSquare(self, space):
        return Space(space.x, space.y - 1)

    def selectDirection(self):
        dir = self.direction
        pygame.event.pump()
        keys = pygame.key.get_pressed()
        if keys[K_RIGHT]:dir = RIGHT
        if keys[K_LEFT]: dir = LEFT
        if keys[K_UP]: dir = UP
        if keys[K_DOWN]: dir = DOWN
        return dir

    def isDead(self, gridWidth, gridHeight):
        head = self.spaces[0]
        if head.x < 0 or head.x >= gridWidth or head.y < 0 or head.y >= gridHeight:
            return True
        for space in self.spaces[1:]:
            if(space.equals(head)):
                return True
        return False
    
    def hitFood(self, food):
        return food.equals(self.spaces[0])
    
    def fat(self, amt):
        self.grow += amt