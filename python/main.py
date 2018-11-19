import pygame
from snakegame import Snakegame
from util import Color
    
WIDTH = 500
HEIGHT = 500
GAMEWIDTH = 20
GAMEHEIGHT = 20
SQUARESIZE = WIDTH / GAMEWIDTH
LINETHICKNESS = 1
snakeGame = Snakegame(GAMEWIDTH, GAMEHEIGHT)

def main():
    pygame.init();
    pygame.display.set_caption("Snake game")
    screen = pygame.display.set_mode((WIDTH, HEIGHT))

    running = True
    while running:
        mainLoop()
        draw(screen, snakeGame)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                runing = False
        time.sleep(50.0 / 1000.0)
                
                
def mainLoop():
    x = 1
    

def draw(screen, snakeGame):
    screen.fill(Color.WHITE)
    
    snakeGame.draw(screen, snakeGame)
    
    for i in range(0, GAMEWIDTH):
        pygame.draw.rect(screen, Color.BLACK, (i * SQUARESIZE, 0, LINETHICKNESS, HEIGHT))
    for i in range(0, GAMEHEIGHT):
        pygame.draw.rect(screen, Color.BLACK, (0, i * SQUAREIZE, WIDTH, LINETHICKNESS))
    pygame.display.flip()
    
    


main()