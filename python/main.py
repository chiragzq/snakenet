import pygame
import time
from button import Button
from snakegame import Snakegame
from snakenet import SnakeNet
from snakeai import SnakeAI
from util import Color, Player
    
WIDTH = 500
HEIGHT = 500
LOWER_MENU_HEIGHT = 100
GAMEWIDTH = 20
GAMEHEIGHT = 20
SQUARESIZE = WIDTH / GAMEWIDTH
LINETHICKNESS = 1
GAME_INTERVAL = 50
snakeNet = SnakeNet()
snakeAI = SnakeAI()
snakeGame = Snakegame(GAMEWIDTH, GAMEHEIGHT, Player.HUMAN, snakeNet, snakeAI)
start = Button(5, 510, 100, 30, "Play Human")
playNet = Button(110, 510, 75, 30, "Play Net")
playAI = Button(190, 510, 75, 30, "Play AI")
stop = Button(270, 510, 75, 30, "Stop")
trainNet = Button(350, 510, 75, 30, "Train Net")
debugNet = Button(5, 550, 100, 30, "Debug Net")
drawShortest = Button(110, 550, 150, 30, "Draw Shortest Path")
active = False

def main():
    global active
    running = True
    pygame.init()
    pygame.display.set_caption("Snake game")
    screen = pygame.display.set_mode((WIDTH, HEIGHT + LOWER_MENU_HEIGHT))
    startGame(Player.HUMAN)
    snakeNet.loadData()
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.MOUSEBUTTONUP:
                if start.clicked(pygame.mouse.get_pos()):
                    startGame(Player.HUMAN)
                elif playNet.clicked(pygame.mouse.get_pos()):
                    startGame(Player.NEURAL)
                elif playAI.clicked(pygame.mouse.get_pos()):
                    startGame(Player.AI)
                elif trainNet.clicked(pygame.mouse.get_pos()):
                    snakeGame.snake.snakeNet.train()
                elif stop.clicked(pygame.mouse.get_pos()):
                    stopGame()
        if active:
            clearDraw(screen)
            mainLoop(snakeGame)
            drawGame(screen, snakeGame)
            if not snakeGame.alive:
                stopGame()
            drawUI(screen)
        pygame.display.flip()
        time.sleep(GAME_INTERVAL / 2 / 1000.0)

def startGame(player):
    global active, snakeGame
    if player == Player.HUMAN:
        print("Starting game: Human")
    elif player == Player.NEURAL:
        print("Starting game: Neural")
    else:
        print("Starting game: AI")
    snakeGame = Snakegame(GAMEWIDTH, GAMEHEIGHT, player, snakeNet, snakeAI)
    active = True

def stopGame():
    global active
    print("Stopping game")
    active = False
                
def mainLoop(snakeGame):
    snakeGame.step1()
    time.sleep(GAME_INTERVAL / 2 / 1000.0)
    snakeGame.step2(GAMEWIDTH, GAMEHEIGHT)

def clearDraw(screen):
    screen.fill(Color.WHITE)

def drawUI(screen):
    start.draw(screen)
    playNet.draw(screen)
    playAI.draw(screen)
    trainNet.draw(screen)
    debugNet.draw(screen)
    drawShortest.draw(screen)
    stop.draw(screen)
    for i in range(0, GAMEWIDTH + 1):
        pygame.draw.rect(screen, Color.BLACK, (i * SQUARESIZE, 0, LINETHICKNESS, HEIGHT))
    for i in range(0, GAMEHEIGHT + 1):
        pygame.draw.rect(screen, Color.BLACK, (0, i * SQUARESIZE, WIDTH, LINETHICKNESS))
    
def drawGame(screen, snakeGame):
    snakeGame.draw(screen, SQUARESIZE)

main()