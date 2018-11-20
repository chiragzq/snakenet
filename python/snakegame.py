import pygame
from snake import Snake
from random import randint
from util import Space, Color

class Snakegame:
    def __init__(self, gridWidth, gridHeight):
        self.gridWidth = gridWidth
        self.gridHeight = gridHeight
        self.food = Space(randint(0, gridWidth - 1), randint(0, gridHeight - 1))
        self.traindata = []
        self.state = None
        self.alive = True
        self.snake = Snake(self)
    
    def step1(self):
        square = self.snake.step1()
    
    def step2(self, gridWidth, gridHeight):
        self.snake.step2()
        if self.snake.hitFood(self.food):
            self.food = Space(randint(0, self.gridWidth - 1), randint(0, self.gridHeight - 1))
            self.snake.fat(3)
        if self.snake.isDead(gridWidth, gridHeight):
            self.alive = False
    
    def draw(self, screen, squareSize):
        for space in self.snake.spaces:
            pygame.draw.rect(screen, Color.YELLOW, (space.x * squareSize, space.y * squareSize, squareSize, squareSize))
        pygame.draw.rect(screen, Color.RED, (self.food.x * squareSize, self.food.y * squareSize, squareSize, squareSize))
    
    