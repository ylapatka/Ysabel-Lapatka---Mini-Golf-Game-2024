const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const path = require('path');
const CANNON = require('cannon');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// The balls object array, the owner and color are not defined yet.
const balls = [{ id: 1, owner: null, color: null }, { id: 2, owner: null, color: null }];
let playerHitCounters = {};
let ballsInHole = {};
let ballInHoleCooldown = {};

// Pairs of players stored here
const pairs = {};

// Players that are waiting to be paired are stored here
const waitingPlayers = []; 

// Function to clone the balls array, this ensures independent game states per pair 
function cloneBalls(balls) {
  return balls.map(ball => ({ ...ball }));
}

// Initial socket connection, listens from the client to start
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  waitingPlayers.push(socket.id);

  if (waitingPlayers.length == 1) {
    // Sends a message to the waiting player that the game is waiting for an opponent 
    io.to(socket.id).emit('waitingForPlayer');
  }

  // If there are at least two players waiting pair them together
  if (waitingPlayers.length >= 2) {
    const pairId = `${waitingPlayers[0]}-${waitingPlayers[1]}`; 

    pairs[pairId] = {
      // Takes first two elements from waiting players and assigns it to the players key
      players: waitingPlayers.splice(0, 2),
      // cloneBalls is used here to make sure that each pair has its own set of balls
      balls: cloneBalls(balls),
      playerHitCounters: {},
      ballsInHole: {},
      ballInHoleCooldown: {}
    };

    // Both players in a pair get sent to their own "room"
    io.sockets.sockets.get(pairs[pairId].players[0]).join(pairId);
    io.sockets.sockets.get(pairs[pairId].players[1]).join(pairId);

    // Assigns each player in the pair to own one ball
    pairs[pairId].balls[0].owner = pairs[pairId].players[0];
    pairs[pairId].balls[1].owner = pairs[pairId].players[1];

    // Sends the ball assignment back to the client
    io.to(pairs[pairId].players[0]).emit('assignedBall', pairs[pairId].balls[0].id);
    io.to(pairs[pairId].players[1]).emit('assignedBall', pairs[pairId].balls[1].id);
    io.to(pairId).emit('gameStarting');
  }


  // Handles ball hit event
  socket.on('ballHit', (data) => {
    // Finds the pair of players associated with this event
    const pairId = findPairIdOfPlayer(socket.id);
    if (pairId && isBallOwnedByPlayer(data.ballId, socket.id, pairId)) {
      console.log('Ball hit in pair:', pairId, data);
      // Sends ball hit event to the correct pair of players
      socket.to(pairId).emit('ballHit', data);
    }
  });

// Calculates force and sends the force calculated back to client
  socket.on('calculateForce', (data) => {
    const pairId = findPairIdOfPlayer(socket.id);
    if (pairId && isBallOwnedByPlayer(data.ballId, socket.id, pairId)) {
      const force = calculateForce(data.dragVector);
      if (force) {
        console.log('Force calculated:', force);
        io.to(pairId).emit('ballHit', { ballId: data.ballId, force });
      }
    }
  });

  // Recieves ball information from the client to sync the ball state across all clients
  socket.on('syncBallState', (data) => {
    const { ballId, position, velocity, holePosition, holeRadius } = data;
    const currentTime = Date.now();
    const pairId = findPairIdOfPlayer(socket.id);

    if (pairId && isBallOwnedByPlayer(ballId, socket.id, pairId)) {
        const pairState = pairs[pairId];

        if (pairState.ballsInHole[ballId]) {
            return; 
        }
        // Saves the current ball position and velocity to be used in "request resync"
        const ball = pairState.balls.find(b => b.id === ballId);
            if (ball) {
                ball.position = position;
                ball.velocity = velocity;
            }

        // Performs a check to see if the ball is in the hole
        if (isBallInHole(position, holePosition, holeRadius)) {
            // Checks if the ball is within the cooldown period
            if (!pairState.ballInHoleCooldown[ballId] || currentTime - pairState.ballInHoleCooldown[ballId] > 2000) {
                pairState.ballsInHole[ballId] = true;
                pairState.ballInHoleCooldown[ballId] = currentTime;
                console.log("Ball is in hole: ", ballId);

                // 'ballInHole' event sent only to only the pair of players it is assigned to 
                io.to(pairId).emit('ballInHole', { ballId, position });

                // Checks if all balls in this pair are in the hole to move to the next course
                if (Object.values(pairState.ballsInHole).filter(val => val).length === 2) {
                    
                    resetGameStatesForNextCourse(pairId);

                    // 'moveToNextCourse' event is sent to the client when both balls are in the hole 
                    io.to(pairId).emit('moveToNextCourse');
                    console.log("Moving to next hole in pair:", pairId);  
                }
            }
        } else {
            /*Continues with the usual ball position update if the ball is not in the hole
              Broadcasts the updated state to the other player in the same pair */
            socket.to(pairId).emit('updateBallState', { ballId, position, velocity });
        }
    }
});

// Used when a player tabs out, resyncs the ball state to ensure synchronized game state
socket.on('requestResync', () => {
  const pairId = findPairIdOfPlayer(socket.id);

  if (pairId) {
      const ballsData = pairs[pairId].balls.map(ball => {
          return {
              ballId: ball.id,
              position: ball.position,
              velocity: ball.velocity
          };
      });

      io.to(socket.id).emit('resyncBallState', ballsData);
  }
});

socket.on('colorChosen', (data) => {
  const pairId = findPairIdOfPlayer(socket.id);
  if (pairId) {
    const ballToUpdate = pairs[pairId].balls.find(b => b.id === data.ballId);
    if (ballToUpdate) {
      ballToUpdate.color = data.color;
      io.to(pairId).emit('updateBallColor', data);
    }
  }
});

socket.on('updateCourseHitCounter', (data) => {
  const pairId = findPairIdOfPlayer(socket.id);
  if (pairId) {
    playerHitCounters[data.ballId] = data.courseHitCounter;
    io.to(pairId).emit('courseHitCounterUpdated', playerHitCounters);
  }
});

  socket.emit('syncBallsState', balls);
  // Disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);

    const pairId = findPairIdOfPlayer(socket.id);
    if (pairId) {
        // Disconnected player then removed from pair
        pairs[pairId].players = pairs[pairId].players.filter(player => player !== socket.id);

        // Disconnected players ball owner set to null
        pairs[pairId].balls.forEach(ball => {
            if (ball.owner === socket.id) {
                ball.owner = null;
            }
        });

        // If the other player is still connected, this notifies them their opponent disconnected
        if (pairs[pairId].players.length > 0) {
            const remainingPlayerId = pairs[pairId].players[0];
            io.to(remainingPlayerId).emit('opponentDisconnected', { message: "Your opponent has disconnected." });
        } else {
            delete pairs[pairId];
        }
    }
    // Removes the player from the waiting list if they are still there
    const waitingPlayerIndex = waitingPlayers.indexOf(socket.id);
    if (waitingPlayerIndex !== -1) {
        waitingPlayers.splice(waitingPlayerIndex, 1);
    }  
  });

});

// Utility function to calculate force based on the drag vector
function calculateForce(dragVector) {
  const forceMultiplier = 10;
  const threshold = 500;
  if (Math.sqrt(dragVector.x ** 2 + dragVector.y ** 2) > threshold) return null;
  return new CANNON.Vec3(-dragVector.x * forceMultiplier, 0, -dragVector.y * forceMultiplier);
}

function resetGameStatesForNextCourse(pairId) {
  // Checks if the pair exists
  if (pairs[pairId]) {
    // Resets the specific game states per pair of players
    pairs[pairId].ballsInHole = {};
    pairs[pairId].ballInHoleCooldown = {};
  }
}

function isBallInHole(ballPos, holePos, holeRadius) {
  // Distance formula to see if ball is in the hole
  const dx = ballPos.x - holePos.x;
  const dy = ballPos.y - holePos.y;
  const dz = ballPos.z - holePos.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  return distance <= holeRadius;
}

function findPairIdOfPlayer(playerId) {
  return Object.keys(pairs).find(pairId => pairs[pairId].players.includes(playerId));
}

function isBallOwnedByPlayer(ballId, playerId, pairId) {
  return pairs[pairId].balls.find(ball => ball.id === ballId && ball.owner === playerId);
}


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/game', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

app.get('/color-selection', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'color-selection.html'));
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
