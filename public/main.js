
let textureLoader = new THREE.TextureLoader();
let scene, camera, world;
const isMultiplayer = localStorage.getItem('isMultiplayer') === 'true';
console.log(isMultiplayer);
let socket;
let ballInstances = [];
let courseHitCounter = [];
let assignedBallId;
let dragController;

/* Initializes a 3D scene uses THREE.js
  Sets up the scene with lighting and a background picture. */

function initializeScene() {
    // Creates a new 3D scene
    scene = new THREE.Scene(); 

    const lightIntensity = 3;
    const ambientLight = new THREE.AmbientLight(0xAAAAAAA, lightIntensity);
    // Adds light to scene
    scene.add(ambientLight); 

    // Background texture set for scene
    textureLoader.load('/assets/golf-background.jpg', function(texture) {
        scene.background = texture;
    });
}

/* Initializes a 3D camera uses Three.js.
   Sets up a perspective camera with a field of view, aspect ratio, and clipping planes. */

function initializeCamera() {
    const fov = 60; // Field of view (in degrees)
    const clippingPlaneNear = 0.1; 
    const clippingPlaneFar = 1000; 

    // Create a new perspective camera
    camera = new THREE.PerspectiveCamera(
        fov, 
        window.innerWidth / window.innerHeight, 
        clippingPlaneNear, 
        clippingPlaneFar 
    );

    // Inital camera position is defined here, changes later
    camera.position.set(0, 13, 48);
}

/* Creates a new physics world using CANNON
   Sets gravity as well */

function initializeWorld() {
    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
}

/* Initializes a renderer, with WEBGL and antialiasing 
   Antialising is used to create more smoothed out graphics */

function initializeRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.name = 'gameCanvas';
    document.body.appendChild(renderer.domElement);
}

/**
 * initializeArrowHelper creates an arrow helper to help a user visualize direction 
 * when dragging the ball.
 * @param {Object} config - Config object passed to the arrow helper.
 **/
function initializeArrowHelper(config) {
    const direction = config.arrowDirection;
    const origin = config.arrowOrigin;

    /* Sets a default length for the arrow
       can be easily changed using the config defined later
    */
    const length = config.arrowLength || 1; 
    const hex = 0xffffff; 

    arrowHelper = new THREE.ArrowHelper(direction, origin, length, hex);
    scene.add(arrowHelper);
    // Makes it so the arrow is not visible at first
    arrowHelper.visible = config.arrowVisible || false; 
}


/**
 * isBallInHole is a utility function to check if ball is inside the hole.
 * used in single player mode.
 * @param {THREE.Vector3} ballPos - The current ball position.
 * @param {THREE.Vector3} holePos - The hole position.
 * @param {number} holeRadius - Hole radius.
 * @returns {boolean} - Returns true if the ball is inside the hole, false otherwise.
 */
function isBallInHole(ballPos, holePos, holeRadius) {
    // distanceTo is a Three.js function to calculate the distance between two vectors
    const distance = ballPos.distanceTo(holePos);
    return distance <= holeRadius;
}

/**
 * Resets the ball's position to its starting point. This is used if the ball goes out of bounds.
 * @param {Object} ballInstance - The ball object.
 */
function resetBallPosition(ballInstance) {
    let newPositionX = currentCourseConfig.ballPosition.x;

    /* Below adds a offset for the balls on multiplayer mode
       so they do not spawn on top of one another
    */
    
    if (isMultiplayer) {
        if (ballInstance.ballId === 1) {
            // Offset for the first ball
            newPositionX -= 2;
        } else if (ballInstance.ballId === 2) {
            // Offset for the second ball
            newPositionX += 2;
        }
    }

    //console.log("Resetting ball position for:", ballInstance);

    // Resets the ball mesh and physics body to it's starting position
    ballInstance.ballMesh.position.set(
        newPositionX, 
        currentCourseConfig.ballPosition.y, 
        currentCourseConfig.ballPosition.z
    );
    
    ballInstance.ballBody.position.set(
        newPositionX, 
        currentCourseConfig.ballPosition.y, 
        currentCourseConfig.ballPosition.z
    );
    
    ballInstance.ballBody.velocity.set(0, 0, 0); 
}


/*
  Removes all physics bodies and clears contact materials from the physics world.
  This is used so there is not an invisible "wall" on each course where the physics
  body used to be.
 */
function clearPhysics() {
    // Removes all bodies from the physics world
    while(world.bodies.length) {
        world.removeBody(world.bodies[0]);
    }
    
    // Clears contact materials
    world.contactmaterials.length = 0;
    world.contactMaterialDict = {};
}

/*
    Clears all objects associated with the current golf course from the scene.
 */
function clearCurrentCourse() {
    // Remove all the walls from the scene
    walls.forEach(wall => {
        scene.remove(wall);
    });
    walls = []; // Empty wall array 

    fairways.forEach(fairway => {
        scene.remove(fairway);
    });
    fairways = [];

    // Remove all physics bodies from the world if any are remaining
    world.bodies.forEach(body => {
        world.removeBody(body);
    });

    ballInstances.forEach(ballInstance => { 
        scene.remove(ballInstance);
    });
    ballInstances = [];

    // Removes event listeners from the dragController so they do not build up
    if (dragController) {
        dragController.completeCourse();
    }
    scene.remove(arrowHelper);
    scene.remove(holeInstance.hole);
    clearPhysics(); 
}
// List of all configs 
const allCourses = [course1Config, course2Config, course3Config, course4Config, course5Config, 
                    course6Config, course7Config, course8Config, course9Config, completedCourseConfig];

// Index of the currently active course
let currentCourseIndex = 0;

/*
  Sets up the initial scene with lighting and removing any remaining objects
 */
function setupInitialScene() {
    // Clears any existing objects from the scene
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // Re-adds ambient light to the scene after all objects have been cleared
    const ambientLight = new THREE.AmbientLight(0xAAAAAAA, 3);
    scene.add(ambientLight);
}

/*
  Progresses the the next golf course, clearing the current course and initializing the next one.
 */
function moveToNextCourse() {
    ballInstances.forEach(ball => ball.isInHole = false);
    if (currentCourseIndex < allCourses.length - 1) {
        currentCourseIndex++;
        clearCurrentCourse();
        setupInitialScene();
        currentCourseConfig = allCourses[currentCourseIndex];

        initializeCourse(currentCourseConfig, assignedBallId);

    } 
    else {
        console.log("all courses completed")
    }
}

let moveDirection = { forward: false, backward: false, left: false, right: false };
let cameraOffset = new THREE.Vector3(0, 15, 30)

// Event listeners to move the camera to the right and the left in the scene
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'a': moveDirection.left = true; break;
        case 'd': moveDirection.right = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'a': moveDirection.left = false; break;
        case 'd': moveDirection.right = false; break;
    }
});

function updateSinglePlayerCameraPosition() {

    // Calculates a camera position based on the ball's position and the camera offset
    ballInstances.forEach(ballInstance => { 
        let desiredCameraPosition = ballInstance.ballMesh.position.clone().add(cameraOffset);

        // Lerp is used for smoothing out the camera as it is moving, removing jitters
        camera.position.lerp(desiredCameraPosition, 0.02); 

        // Allows user to move camera left and right using a and d keys 
        if (moveDirection.left) camera.position.x -= 0.3;
        if (moveDirection.right) camera.position.x += 0.3;
        let focusPoint = ballInstance.ballMesh.position.clone().add(new THREE.Vector3(0, 10, 0));

        camera.lookAt(focusPoint);
    });

} 


let activeBall;
let previousBallPosition = new THREE.Vector3(); 

function updateMultiplayerCameraPosition() {

    // Finds the active ball so the camera can follow the player's assigned ball
    activeBall = ballInstances.find(ball => ball.ballId === assignedBallId);

    if (!activeBall) {
        return;
    }

    let positionSource;
    // Checks if the ball has recieved a position from the server
    if (activeBall.receivedPosition && !isPositionZero(activeBall.receivedPosition)) {
        // If it has, sets the positionSource to the recieved position
        positionSource = activeBall.receivedPosition;
    } 
    else {
        // Set positionSource to the current ball mesh position otherwise
        positionSource = activeBall.ballMesh.position;
    }


    // Smooths out camera movement
    let desiredCameraPosition = positionSource.clone().add(cameraOffset);
    camera.position.lerp(desiredCameraPosition, 0.02); 

    if (moveDirection.left) camera.position.x -= 0.3;
    if (moveDirection.right) camera.position.x += 0.3;

    let focusPoint = positionSource.clone().add(new THREE.Vector3(0, 10, 0));
    camera.lookAt(focusPoint);

    previousBallPosition.copy(positionSource);
}


function isPositionZero(position) {
    return position.x === 0 && position.y === 0 && position.z === 0;
}

/*
  Main animation loop of the application. 
 */
function animate() {

    requestAnimationFrame(animate);

    if (!isMultiplayer) {
        updateSinglePlayerCameraPosition();
    }
    else {
        updateMultiplayerCameraPosition();
    }

    // Update the physics world 60 frames per second
    world.step(1/60);

    // Animates the statue obstacle rotation if it exists in the current config
    if (statues) {
        statues.forEach(statue => {
            statue.update(); // Rotates the obstacle
        });
    }

    activeBall = ballInstances.find(ball => ball.ballId === assignedBallId);

    ballInstances.forEach(ballInstance => {
    // Continuously syncs the ball's mesh position and rotation with its physics body
        ballInstance.ballMesh.quaternion.copy(ballInstance.ballBody.quaternion);

        if (isMultiplayer && !ballInstance.resyncing) {
            ballInstance.ballMesh.position.copy(ballInstance.ballBody.position);
            arrowHelper.position.copy(activeBall.ballMesh.position);
            if (ballInstance.ballId === assignedBallId) {
                // Sends the ball's position and velocity to the server
                ballInstance.emitBallMovement();
            }
        }
    
        // Logic for the game in the single player scenario.
        if (!isMultiplayer) {
            if (activeBall) {
                // Sets the arrow helper to the position of the ball
                arrowHelper.position.set(
                    activeBall.ballMesh.position.x, 
                    activeBall.ballMesh.position.y, 
                    activeBall.ballMesh.position.z
                );
            }
            ballInstance.ballMesh.position.copy(ballInstance.ballBody.position);
            if (currentCourseConfig.holePosition) {
                const holePosition = new THREE.Vector3(
                    currentCourseConfig.holePosition.x,
                    currentCourseConfig.holePosition.y,
                    currentCourseConfig.holePosition.z
                );
                const holeRadius = 0.8;

            // Checks if the ball has landed in the hole and is below a certain velocity threshold
            if (isBallInHole(ballInstance.ballMesh.position, holePosition, holeRadius)) {
                const velocityThreshold = 8;
                if (ballInstance.ballBody.velocity.length() < velocityThreshold) {
                    ballInstance.ballBody.velocity.set(0, 0, 0);
                    ballInstance.ballMesh.position.set(holePosition.x, holePosition.y - 0.5, holePosition.z);
                    dragController.hasBallBeenHit = false;
                    moveToNextCourse(); // Progress to the next course
                }
            }
        }
    }

        // Checks if the ball went out of bounds
        const ballOutOfBoundaries = ballInstance.ballMesh.position.x < -currentCourseConfig.widthFairway/2 || 
                ballInstance.ballMesh.position.x > currentCourseConfig.widthFairway/2 || 
                ballInstance.ballMesh.position.y < -10;

        // Resets the ball's position if it went out of bounds
        if (ballOutOfBoundaries) {
            dragController.hasBallBeenHit = false;
        resetBallPosition(ballInstance); 
        }

        // Checks if the ball is in the bunker at a rate of 60 frames per sec
        if (bunkers) {
            bunkers.forEach(bunker => {
                bunker.checkBallInBunker(ballInstance.ballBody);
            });
        }
    });
    
    // Animates windmill blades if they are present in the scene
    if (windmills) {
        windmills.forEach(windmill => {
            windmill.animate();
        });
    }

    // Renders the scene with objects and camera
    renderer.render(scene, camera);
}

/*
  onWindowResize Ensures the rendered 3D scene scales and fits correctly within the browser window.
 */
function onWindowResize() {
    // Updates the camera's aspect ratio based on the windows dimensions
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    // Resizes the renderer to fit the new window dimensions
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

/* updateSinglePlayerTable updates the score card for single player mode */
function updateSinglePlayerTable() {
    // Accesses where the course information is displayed
    const tableRow = document.getElementById('courseData');
    tableRow.innerHTML = ''; 

    // Creates one cell to display the current player's name.
    const playerCell = document.createElement('td');
    playerCell.textContent = 'Player 1'; 
    tableRow.appendChild(playerCell);

    // 9 cells for 9 courses
    const MIN_CELLS = 9; 
    let cellCount = courseHitCounter.length > MIN_CELLS ? courseHitCounter.length : MIN_CELLS;

    let totalScore = 0; 

    // Populates each cell with the hit count from the courseHitCounter array
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('td');
        cell.textContent = courseHitCounter[i] || ''; 
        tableRow.appendChild(cell);

        if (courseHitCounter[i] !== undefined) {
            totalScore += courseHitCounter[i];
        }
    }

    // Created an additional cell to store total score
    const totalScoreCell = document.createElement('td');
    totalScoreCell.textContent = totalScore;
    tableRow.appendChild(totalScoreCell);
}

/**
 * updateMultiplayerTable updates the score card for multiplayer mode
 * @param {Array} allPlayersData - The score data for all players.
 */
function updateMultiplayerTable(allPlayersData) {
    const courseTable = document.getElementById('courseTable');
    
    // Clears all rows in the course table except the header
    while (courseTable.rows.length > 1) {
        courseTable.deleteRow(1);
    }

    const MIN_CELLS = 9; 

    // Goes through each player's data and updates the table
    Object.entries(allPlayersData).forEach(([ballId, hitCounters], index) => {
        // Starts a new row for each player connected to one game
        const row = courseTable.insertRow(-1);
        const playerCell = row.insertCell(0);
        playerCell.textContent = `Player ${index + 1}`;

        let totalScore = 0; 
        let cellCount = Math.max(hitCounters.length, MIN_CELLS);

        // Fills in the scores for each course
        for (let i = 0; i < cellCount; i++) {
            const scoreCell = row.insertCell(i + 1);
            let hitCounter = hitCounters[i];
            scoreCell.textContent = hitCounter || '';

            if (hitCounter !== undefined) {
                totalScore += hitCounter;
            }
        }
        const totalScoreCell = row.insertCell(cellCount + 1);
        totalScoreCell.textContent = totalScore;
    });
}

// Toggles the display of the score card on and off
function toggleTableVisibility() {
    const table = document.getElementById('courseTable');
    table.style.display = table.style.display === 'none' ? '' : 'none';
}

document.getElementById('toggleButton').addEventListener('click', toggleTableVisibility);

// Set the currentCourseConfig to the course1Config to start from course 1
let currentCourseConfig = course1Config;

/*
  Initializes all elements of the game like scene, camera, physics world, renderer, and the current course.
 */
function initializeEverything() {
    initializeScene();
    initializeCamera();
    initializeWorld();
    initializeRenderer();
    if (isMultiplayer) {
        socket = io.connect();
        socket.on('assignedBall', (newAssignedBallId) => {
            // Update the assignedBallId
            assignedBallId = newAssignedBallId;
            // Initialize course with the new assignedBallId
            initializeCourse(currentCourseConfig, assignedBallId);
            document.getElementById('playerNumber').innerText = `You are player ${newAssignedBallId}`;
        });
        // Listener which sees if a user tabbed out
        window.addEventListener('focus', () => {
            socket.emit('requestResync');
        });
        socket.on('resyncBallState', (ballsData) => {
            ballsData.forEach(ballData => {
        
                const ballInstance = ballInstances.find(b => b.ballId === ballData.ballId);
                if (ballInstance) {
                    ballInstance.resyncing = true;
                    ballInstance.ballMesh.position.set(ballData.position.x, ballData.position.y, ballData.position.z);
                    ballInstance.ballBody.position.set(ballData.position.x, ballData.position.y, ballData.position.z);
                    ballInstance.ballBody.velocity.set(ballData.velocity.x, ballData.velocity.y, ballData.velocity.z);
        
                    setTimeout(() => { ballInstance.resyncing = false; }, 100);
                }
            });
        });
        socket.on('waitingForPlayer', () => {
            document.getElementById('waitingMessage').innerText = "Waiting for player...";
        });
        socket.on('gameStarting', () => {
            document.getElementById('waitingMessage').innerText = "";
        });
        socket.on('courseHitCounterUpdated', (allPlayersData) => {
            // Updates the table with new scores
            updateMultiplayerTable(allPlayersData);
        });
        socket.on('moveToNextCourse', () => {
            moveToNextCourse(); 
        });
        socket.on('ballInHole', (data) => {
            const { ballId } = data;
        
            // This finds the correct ball instance to set it as inactive
            const ball = ballInstances.find(b => b.ballId === ballId);
            if (ball) {
                ball.setInactive();
            }
        });
        socket.on('opponentDisconnected', (data) => {
            document.getElementById('disconnectText').innerText = data.message;
            document.getElementById('disconnectMessage').style.display = 'block';
        });
    }
    else {
        assignedBallId = 1;
        initializeCourse(currentCourseConfig, assignedBallId);
    }
}


const clientColor = localStorage.getItem('selectedColor') || 'default';
/**
 * Sets up the course entities like the ball, hole, fairways, walls, rocks, and windmills using the provided configuration.
 * @param {Object} courseConfig - Configuration object for the current course.
 */
function initializeCourse(courseConfig, assignedBallId) {

    // Shows a completion message popup when the game is completed
    if (courseConfig === completedCourseConfig){
        console.log("all courses completed")
        document.getElementById('completionMessage').style.display = 'block';
    }
    
    console.log(assignedBallId)
    console.log(courseHitCounter);
    if (!isMultiplayer) {
        updateSinglePlayerTable();
    }
    ballInstances = []; 

    if (isMultiplayer) {
        // Array of possible colors to choose from 
        const defaultColors = ['red', 'blue', 'purple', 'yellow', 'white']; 

        // Creates two balls for multiplayer mode
        for (let i = 0; i < 2; i++) { 
            
            let ballConfig = {
                ...courseConfig,
                /* Sets both balls to be slightly offset from one another so they don't
                 spawn in same position. */
                ballPosition: {
                    ...courseConfig.ballPosition, 
                    x: courseConfig.ballPosition.x + (i * 4 - 2) 
                }
            };
            
            let color;
            if (i + 1 === assignedBallId) {
                // Sets the color of the client's ball stored in local storage
                color = clientColor;
            } 
            else {
                color = defaultColors[i % defaultColors.length];
            }

            ballInstances.push(new Ball(ballConfig, isMultiplayer, socket, i + 1, color)); 
        }

        // Initializes the dragController class, the user controls
        dragController = new DragController(ballInstances, assignedBallId, isMultiplayer, socket);

        socket.emit('colorChosen', { ballId: assignedBallId, color: clientColor });

        socket.on('updateBallColor', (data) => {
            // Finds the ball that should be updated based on its id
            const ballToUpdate = ballInstances.find(ball => ball.ballId === data.ballId);
            // If the ball is found this updates the color accordingly
            if (ballToUpdate) {
              ballToUpdate.updateColor(data.color);
            }
          });
        
        // Used to sync ball color after all players choose their preferred color
        socket.on('syncBallsState', (data) => {
            data.forEach(ball => {
                // Updates ball color, using the correct ballId
                let ballInstance = ballInstances.find(b => b.ballId === ball.id);
                if (ballInstance && ball.color) {
                    ballInstance.updateColor(ball.color);
                }
            });
        });  
        
    } 
    else {
        // One ball is created for single player mode
        ballInstances.push(new Ball(courseConfig, isMultiplayer, null, 1, clientColor));

        // Sets the assignedBallId to 1 because there is only one ball
        dragController = new DragController(ballInstances, 1, isMultiplayer, null); 
    }

    // Initialize the hole using the Hole class
    if (courseConfig.holePosition) {
        holeInstance = new Hole(courseConfig, scene);
    }
    
    initializeArrowHelper(courseConfig);

    // Initialize fairways based course config info
    fairways = [];
    if (courseConfig.fairways) {
        courseConfig.fairways.forEach(fairwayConfig => {
            const fairwayInstance = new Fairway(fairwayConfig, world, scene);  
            fairways.push(fairwayInstance);
        });
    }

    // Initialize walls based course config info
    walls = [];
    if (courseConfig.walls) {
        courseConfig.walls.forEach(wallConfig => {
            const wallInstance = new Wall(wallConfig, scene, world);
            walls.push(wallInstance);
        });
    }

    rocks = [];
    if (courseConfig.rocks) {
        courseConfig.rocks.forEach(rockConfig => {
            const rockInstance = new Rock(rockConfig, scene, world);
            rocks.push(rockInstance);
        });
    }

    bunkers = [];
    if (courseConfig.bunkers) {
        courseConfig.bunkers.forEach(bunkerConfig => {
            const bunkerInstance = new Bunker(bunkerConfig, scene, world);
            bunkers.push(bunkerInstance);
        });
    }

    windmills = [];
    if (courseConfig.windmills) {
        courseConfig.windmills.forEach(windmillConfig => {
            const windmillInstance = new Windmill(windmillConfig, scene, world);
            windmills.push(windmillInstance);
        });
    }
    statues = [];
    if (courseConfig.statues) {
        courseConfig.statues.forEach(statueConfig => {
            const statueInstance = new StatueObstacle(statueConfig, scene, world);
            statues.push(statueInstance);
        });
    }
    waterhazards = [];
    if (courseConfig.waterhazards) {
        courseConfig.waterhazards.forEach(waterhazardconfig => {
            const waterhazardInstance = new WaterHazard(waterhazardconfig, scene, world);
            waterhazards.push(waterhazardInstance);
        });
    }
}

initializeEverything();

// Starts main animation loop
animate();
