import pygame
from util import Color

class Button:
    def __init__(self, x, y, width, height, text):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.text = text
    
    def clicked(self, pos):
        return self.x <= pos[0] and pos[0] <= self.x + self.width and self.y <= pos[1] and pos[1] <= self.y + self.height

    def draw(self, screen):
        pygame.draw.rect(screen, Color.BLACK, (self.x, self.y, self.width, self.height), 1)
        text = pygame.font.Font("Lucida Grande.ttf", 15).render(self.text, True, Color.BLACK)
        rect = text.get_rect()
        rect.centerx = self.x + self.width / 2 
        rect.centery = self.y + self.height / 2 - 1
        screen.blit(text, rect)
        
