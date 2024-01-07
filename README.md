This is a browser based Miniature Golf game. The game is built on JavaScript and uses libraries like Three.js and Cannon.js 
to help create realistic and lifelike objects and physics. These libraries all help to create a 3D environment that a user can 
experience on the browser. 

I created a browser based game because I wanted the game to be easily accessible. To additionally help accessibility, I  created a user interface so players could remain engaged and informed throughout their game. I added a tutorial section on the upper left hand part of the screen so new players know how to play the game. The tutorial section includes directions on how to hit the ball and how the drag mechanism works. The longer the drag applied to the golf ball the more force will be applied to the ball. I also introduced an arrow helper so a player knows which direction that the ball will go based on the direction they are dragging 
to avoid confusion. 

The game features 9 courses in total. Each course gets progressively harder as the game progresses and has a unique set of challenges 
and obstacles for each course. I created walls, windmills, water hazards and bunkers to create different challenges for players. 
For example, when a player hits their ball and hits a bunker, the ball’s velocity changes making it harder for the player to hit the ball
out of the sand trap. 

The game has single player and multiplayer modes. I know many players prefer to play alone, so I wanted to give the option 
to play both in single player and multiplayer mode. In multiplayer mode, each player that connects to the server is split off into pairs, 
and each pair of players can play against each other. Additionally, there is a scorecard at the top of the screen where players 
can track their own scores and their opponents in real time, adding a bit of competitiveness to the game if the user wants it. 

The core of the multiplayer functionality uses WebSockets. Websockets allows for server-client communication. WebSockets are 
important to synchronize game elements like color selection, ball movement and different velocity changes based on how a user hits the ball. 
Synchronization is important to ensure that both players have a fair and fun multiplayer experience by making sure all players 
see the same game state.

In conclusion, this game will allow players to play minigolf online with 3D realistic graphics, they can play single player or 
multiplayer and it is good for casual gamers who want to play a quick game of minigolf by themselves to beat their high score or 
against another player for some competition.
