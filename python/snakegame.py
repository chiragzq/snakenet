import pygame
from snake import Snake
from random import randint
from util import Space, Color, Player, generateState, convertStateToFeatures, generateTarget

COLLECTDATA = True
class Snakegame:
    def __init__(self, gridWidth, gridHeight, player, snakeNet, snakeAI):
        self.gridWidth = gridWidth
        self.gridHeight = gridHeight
        self.food = Space(randint(0, gridWidth - 1), randint(0, gridHeight - 1))
        self.traindata = []
        self.state = None
        self.alive = True
        self.snake = Snake(self, snakeNet, snakeAI, player)
        self.player = player
    
    def step1(self):
        self.state = generateState(self.snake.spaces, self.food)
        features = convertStateToFeatures(self.state)
        square = self.snake.step1(self.state, features)
    
    def step2(self, gridWidth, gridHeight):
        oldDir = self.snake.direction
        self.snake.step2()
        target = generateTarget(oldDir, self.snake.direction)
        if self.player == Player.HUMAN or self.player == Player.AI:
            if COLLECTDATA:
                self.traindata.append((self.state, target))

        if self.snake.hitFood(self.food):
            self.food = Space(randint(0, self.gridWidth - 1), randint(0, self.gridHeight - 1))
            while not self.snake.snakeAI.valid(self.food, self.snake.spaces):
                self.food = Space(randint(0, self.gridWidth - 1), randint(0, self.gridHeight - 1))
            self.snake.fat(3)

        if self.snake.isDead(gridWidth, gridHeight):
            self.alive = False
            if len(self.traindata) > 0:
                self.traindata.pop()
            print("Recorded %d samples" % len(self.traindata))
            self.snake.saveData(self.traindata)
            self.traindata = []

    
    def draw(self, screen, squareSize):
        for space in self.snake.spaces:
            pygame.draw.rect(screen, Color.YELLOW, (space.x * squareSize, space.y * squareSize, squareSize, squareSize))
        pygame.draw.rect(screen, Color.RED, (self.food.x * squareSize, self.food.y * squareSize, squareSize, squareSize))
    
    