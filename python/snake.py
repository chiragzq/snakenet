from util import Space
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
        
        for i in range(0, self.size):
            if i == 0:
                self.spaces.append(Space(
                        randint(0, snakeGame.gridWidth - 1),
                        randint(0, snakeGame.gridHeight - self.size - 3)
                    ))
            else:
                self.spaces.append(self.adjacentSquare(self.spaces[i - 1]))
    
    def adjacentSquare(self, space):
        return Space(space.x, space.y - 1)
    