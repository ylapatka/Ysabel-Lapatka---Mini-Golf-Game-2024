
// The DragController class is responsible for user controls in my game.
class DragController {
    /**
     * @param {Array} ballInstances - Array of all ball objects created.
     * @param {number} assignedBallId - Identifier for each ball object.
     * @param {boolean} isMultiplayer - Boolean value determines if in multiplayer mode.
     * @param {socket} socket - Socket used for client-server communication.
     */
     constructor(ballInstances, assignedBallId, isMultiplayer, socket) {
    
         this.ballInstances = ballInstances;
         this.assignedBallId = assignedBallId; 
         this.isMultiplayer = isMultiplayer;
         this.socket = socket;
         this.isDragging = false;
         this.dragStartPosition = new THREE.Vector2(); 
         this.dragEndPosition = new THREE.Vector2(); 
         this.hitCounter = 0;
        
         // Binding different events
         this.boundMouseDown = this.onMouseDown.bind(this);
         this.boundMouseMove = this.onMouseMove.bind(this);
         this.boundMouseUp = this.onMouseUp.bind(this);
         this.boundBallHit = this.onBallHit.bind(this); 
    
         // Sets up different event listeners to set up mouse controls
         this.addEventListeners();
    }
    
        // Adds event listeners for different types of mouse actions
        addEventListeners() {
            document.addEventListener('mousedown', this.boundMouseDown);
            document.addEventListener('mousemove', this.boundMouseMove);
            document.addEventListener('mouseup', this.boundMouseUp);
    
            if (this.isMultiplayer) {
                this.socket.on('ballHit', this.boundBallHit);
            }
        }
    
        // Removing event listeners here is important when changing courses so event listeners don't add up
        removeEventListeners() {
            document.removeEventListener('mousedown', this.boundMouseDown);
            document.removeEventListener('mousemove', this.boundMouseMove);
            document.removeEventListener('mouseup', this.boundMouseUp);
    
            if (this.isMultiplayer) {
                this.socket.off('ballHit', this.boundBallHit);
            }
        }
    
        /**
         * onMouseDown starts the drag vector.
         * @param {MouseEvent} event - The mouse down event.
         */
        onMouseDown(event) {

            var gameCanvas = renderer.domElement;

            /* Checks if the user is clicking on an element on the canvas
             important so if a user clicks off the tab or clicks on the tutorial it isn't counting as a hit */
            if (gameCanvas.contains(event.target)) {
                this.isDragging = true;
                this.dragStartPosition.set(event.clientX, event.clientY);
                arrowHelper.visible = true;
            }
        }
    
        /**
         * onMouseMove updates the ending position of the drag vector
         * @param {MouseEvent} event - The mouse move event.
         */
        onMouseMove(event) {
            if (this.isDragging) {
                this.dragEndPosition.set(event.clientX, event.clientY);
                let dragVector = new THREE.Vector2().subVectors(this.dragEndPosition, this.dragStartPosition);
                arrowHelper.setDirection(new THREE.Vector3(-dragVector.x, 0, -dragVector.y).normalize());
                arrowHelper.setLength(dragVector.length() / 10);
            }
        }
    
        /**
         * onMouseUp applies force to the ball and completes the drag action
         * @param {MouseEvent} event - The mouse up event
         */
        onMouseUp(event) {
            if (this.isDragging) {
                let dragVector = new THREE.Vector2().subVectors(this.dragEndPosition, this.dragStartPosition);
                this.isDragging = false;
        
                // ActiveBall is the current ball associated with the client
                let activeBall = this.ballInstances.find(ball => ball.ballId === this.assignedBallId);
        
                // Error checking if active ball is not found
                // console.log('Active Ball:', activeBall);
                if (!activeBall) {
                    console.log('No active ball found for ID:', this.assignedBallId);
                    return;
                }
    
                // Makes sure that the arrow helper is no longer visible after dragging
                arrowHelper.visible = false;
                this.hasBallBeenHit = true;
        
                /* Sends the assignedball and the dragvector to the server 
                to calculate the force applied */
                if (this.isMultiplayer) {
                    this.socket.emit('calculateForce', { ballId: this.assignedBallId, dragVector: { x: dragVector.x, y: dragVector.y } });
                    this.hitCounter++;
                    this.updateHitCounterDisplay();
                }           
                else {
                    this.applyForceSinglePlayerMode(dragVector);
                    this.hitCounter++;
                    this.updateHitCounterDisplay();
                }
            }
        }
    
        /**
         * applyForceSinglePlayerMode applies force to the ball based on the drag vector.
         * @param {THREE.Vector2} dragVector - The drag vector indicating the drag direction and magnitude.
         */
        applyForceSinglePlayerMode(dragVector) {
            const force = this.calculateForceSinglePlayer(dragVector);
            if (!force) {
                return;
            }
            let activeBall = this.ballInstances.find(ball => ball.ballId === this.assignedBallId);
    
            // CANNON function to apply force on a physics body 
            activeBall.ballBody.applyForce(force, activeBall.ballBody.position);
        }
    
        /**
         * Calculates the force that should be applied based on the drag vector.
         * @param {THREE.Vector2} dragVector - The drag vector indicating the drag direction and magnitude.
         * @returns {CANNON.Vec3|null} The calculated force vector or null if the force calculated is above the threshold.
         */
        calculateForceSinglePlayer(dragVector) {
            const forceMultiplier = 10;
            /* This threshold is added so if a user clicks on the ball or the drag vector is too high
            it returns null */
            const threshold = 500;
            if (Math.sqrt(dragVector.x ** 2 + dragVector.y ** 2) > threshold) {
                return null;
            }
            return new CANNON.Vec3(-dragVector.x * forceMultiplier, 0, -dragVector.y * forceMultiplier);
        }
    
        /**
         * onBallHit handles the 'ballHit' event in multiplayer mode.
         * @param {Object} data - The data received from the 'ballHit' event.
         */
        onBallHit(data) {
            if (data.ballId === this.assignedBallId) {
                const { force } = data;
                console.log('Force received:', force);
        
                let activeBall = this.ballInstances.find(ball => ball.ballId === this.assignedBallId);
                if (!activeBall) {
                    console.log('No active ball found for ID:', this.assignedBallId);
                    return;
                }
                // Applies force to the active ball and uses the force vector recieved from the server
                 activeBall.ballBody.applyForce(new CANNON.Vec3(force.x, force.y, force.z), activeBall.ballBody.position);
            }
        }
    
        updateHitCounterDisplay() {
            const hitCounterElement = document.getElementById('hitCounter');
            if(hitCounterElement) {
                hitCounterElement.textContent = `Hits: ${this.hitCounter}`;
            }
        }
    
        resetHitCounter() {
            // Called at the end of the course so hitCounter goes back to 0
            this.hitCounter = 0; 
            // Updates display on user's screen
            this.updateHitCounterDisplay(); 
        }
    
        completeCourse() {
            // Saves the current score of a user
            courseHitCounter.push(this.hitCounter);
    
            this.resetHitCounter();
    
            // Removes event listeners after each course so they do not add up for each course
            this.removeEventListeners();
    
            if (this.isMultiplayer && this.socket) {
                // Sends the updated hit counter to the server
                this.socket.emit('updateCourseHitCounter', {
                    ballId: this.assignedBallId,
                    courseHitCounter: courseHitCounter
                });
            }
        }
        /**
         * Getter function 
         * @returns {boolean} Whether the ball has been hit.
         */
        get hasBallBeenHit() {
            return this._hasBallBeenHit;
        }
        /**
         * Setter function
         * @param {boolean} value - Sets the value to the hasBallBeenHit variable
         */
        set hasBallBeenHit(value) {
            this._hasBallBeenHit = value;  
        }
    }