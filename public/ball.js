// The Ball class constructs a ball object for the golf game.

class Ball {
    /**
     * @param {Object} config - Config passed which defines ball starting position.
     * @param {boolean} isMultiplayer - Boolean value determines if in multiplayer mode.
     * @param {socket} socket - Socket used for client-server communication.
     * @param {number} assignedBallId - Identifier for each ball object.
     * @param {string} color - Color of the ball.
     */
    constructor(config, isMultiplayer, socket, assignedBallId, color) {
        this.config = config;
        this.color = color;
        this.ballMesh = this.initializeBall();
        this.ballBody = null;
        this.isMultiplayer = isMultiplayer;
        
        // Flag that determines if the ball is in the hole or not.
        this.isInHole = false;
        
        //Flag used in the resyncing process when a user tabs out.
        this.resyncing = false;

        this.socket = socket;
        this.ballId = assignedBallId;
        this.world = world;
        this.initializePhysics();

        // Socket event listener, that updates the ball properites based on data from server.
        if (this.isMultiplayer) {
            this.socket.on('updateBallState', this.onUpdateBallState.bind(this));
        }
    }

    /**
     * initializeBall initializes the Three.js graphical representation of the ball.
     * @returns {THREE.Mesh} The created golf ball mesh.
     */

    initializeBall() {

        // Gets the correct texture path to add onto the ball based on the color property
        let texturePath = this.getTexturePath(this.color);
        const golfballTexture = textureLoader.load(texturePath);
        
        /* Creating a Three.js mesh consists of setting it's geometry and material
           0.5 represents the ball's radius, 32 is the ball's width segments, 16 is height segments.
        */
        const ballGeometry = new THREE.SphereGeometry(0.5, 32, 16);

        // The material (texture) added is mapped based on the color property recieved when creating the ball
        const ballMaterial = new THREE.MeshStandardMaterial({ map: golfballTexture }); 

        // Adds the ball geometry and material to the mesh
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    
        /* Sets the ball's position based on configuration data or default values
         Depending on the course, the ball has different starting positions. */
        ball.position.x = this.config.ballPosition && this.config.ballPosition.x || 0;

        // Sets the y position to 2 times it's radius to ensure the ball is not clipping through the fairway.
        ball.position.y = this.config.ballPosition && this.config.ballPosition.y || (0.5 * 2);
        ball.position.z = this.config.ballPosition && this.config.ballPosition.z || 20;

        // Adds the ball object to the Three.js scene
        scene.add(ball);
        return ball;
    }

    /**
     * initializePhysics sets up the physics for the golf ball.
     * @returns {CANNON.Body} The ball's physics body.
     */

    initializePhysics() {

        // Creates a physics body based on the dimensions of the ball (radius 0.5)
        const ballShape = new CANNON.Sphere(0.5);

        // Mass:1 defines a dynamic physics body
        const ballBody = new CANNON.Body({ mass: 1 });
        ballBody.addShape(ballShape);

        // Sets the physics body to the ball's graphical location
        ballBody.position.set(this.ballMesh.position.x, this.ballMesh.position.y, this.ballMesh.position.z);

        // Allows for the ball to have different properties added to it
        ballBody.material = new CANNON.Material();

        // Restituion is ball bounciness
        ballBody.material.restitution = 0.5;
        // Friction is how slippery the ball is
        ballBody.material.friction = 0;
        // Linear Damping is the resistance the ball has to velocity changes
        ballBody.linearDamping = 0.2;

        this.world.addBody(ballBody);
        this.ballBody = ballBody;  

        return ballBody;
    }

    /**
    * getTexturePath returns the file path for the golf ball texture based on the specified color.
    * @param {string} color - The color of the ball.
    * @returns {string} - The file path which will be loaded onto the ball.
    */
    getTexturePath(color) {
        const colorTextureMap = {
            'red': '/assets/red-golfball.jpg',
            'blue': '/assets/blue-golfball.jpg',
            'purple' : '/assets/purple-golfball.jpg',
            'yellow' : '/assets/yellow-golfball.jpg',
            'default': '/assets/golfballtexture.jpg'
        };
        return colorTextureMap[color] || colorTextureMap['default'];
    }

    /* emitBallMovement gives the current state of the ball over to the server in multiplayer mode.
       Includes position, velocity, hole position and radius to check if the ball
       is in the hole on the server side. */

    emitBallMovement() {
        // Checks if the game is multiplayer and the ball is not in the hole
        if (this.isMultiplayer && !this.isInHole) {
            const position = this.ballMesh.position;
            const velocity = this.ballBody.velocity;
            const holePosition = this.config.holePosition; 
            const holeRadius = 0.8; // Hole always has this radius

            // Sends the current ball state to the server
            this.socket.emit('syncBallState', { 
                ballId: this.ballId, 
                position, 
                velocity,
                holePosition,
                holeRadius
            });
        }
    }

    /**
     * onUpdateBallState Updates the ball's position and velocity based on server data.
     * @param {Object} data - Data recieved from server.
     */
    onUpdateBallState(data) {
        // Update the ball's state only if the data corresponds to the client's ball
        if (data.ballId === this.ballId) {
            const { position, velocity } = data;
            this.ballMesh.position.set(position.x, position.y, position.z);
            this.ballBody.velocity.set(velocity.x, velocity.y, velocity.z);
        }
    }

    /**
     * updateColor updates the color of the ball and reloads the texture accordingly.
     * @param {string} newColor - The new color for the ball.
     */
    updateColor(newColor) {
        this.color = newColor;
        let texturePath = this.getTexturePath(newColor);
        const newTexture = textureLoader.load(texturePath);
        this.ballMesh.material.map = newTexture;
        this.ballMesh.material.needsUpdate = true;
    }

    /*
      setInactive sets the ball to an inactive state. Used when the ball falls into a hole.
      The ball becomes invisible and its physics body is deactivated.
     */
    setInactive() {
        // Makes the ball invisible
        this.isInHole = true;
        this.ballMesh.visible = false;
    
        // Prevents the body from reacting to collisions
        this.ballBody.collisionResponse = false; 
        // Sets the body to static
        this.ballBody.mass = 0; 
        // Applies the mass change to the ball
        this.ballBody.updateMassProperties(); 
        // Resets the ball velocity
        this.ballBody.velocity.set(0, 0, 0); 
    }
}
