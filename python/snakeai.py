from util import getNewSpace, getCurrentDirection, Space
from collections import deque

class SnakeAI:
    def selectDirection(self, spaces, food):
        leftSpace =  getNewSpace(spaces[0], (getCurrentDirection(spaces) + 3) % 4)
        frontSpace =  getNewSpace(spaces[0], (getCurrentDirection(spaces)) % 4)
        rightSpace =  getNewSpace(spaces[0], (getCurrentDirection(spaces) + 1) % 4)
        bfs = self.bfs(spaces, food)

        if len(bfs) == 0:
            leftBlocked = not self.valid(leftSpace, spaces)
            frontBlocked = not self.valid(frontSpace, spaces)
            #rightBlocked = self.contains(rightSpace, spaces)
            if frontBlocked:
                if leftBlocked:
                    return 2
                return 0
            else:
                return 1
        else:
            if leftSpace.equals(bfs[1]):
                return 0
            elif rightSpace.equals(bfs[1]):
                return 2
            return 1

    
    def bfs(self, spaces, f):
        food = Space(f[0], f[1])
        dx = [0, 1, 0, -1]
        dy = [1, 0, -1, 0]
        queue = deque()
        queue.append(spaces[0])
        visited = []
        p = []
        for i in range(0, 20):
            visited.append([])
            p.append([])
            for j in range(0, 20):
                visited[i].append(False)
                p[i].append(Space(i, j))
        visited[spaces[0].x][spaces[0].y] = True
    
        while len(queue) != 0:
            space = queue.popleft()
            if space.x == food.x and space.y == food.y:
                path = [space]
                while not space.equals(p[space.x][space.y]):
                    space = p[space.x][space.y]
                    path.append(space)
                path.reverse()
                return path
            for i in range(0, 4):
                newSpace = Space(space.x + dx[i], space.y + dy[i])
                if self.valid(newSpace, spaces) and not visited[newSpace.x][newSpace.y]:
                    p[newSpace.x][newSpace.y] = space
                    visited[newSpace.x][newSpace.y] = True
                    queue.append(newSpace)
        return []
    
    def valid(self, space, spaces):
        if self.contains(space, spaces):
            return False
        if space.x < 0 or space.x >= 20 or space.y < 0 or space.y >= 20:
            return False
        return True

    def contains(self, space, spaces):
        for s in spaces:
            if s.equals(space):
                return True
        return False
        