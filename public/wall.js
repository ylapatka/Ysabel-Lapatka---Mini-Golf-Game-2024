
//Creates a wall object
class Wall {
    /**
     * @param {Object} config - Configuration info for the dimensions/placement of the wall.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {CANNON.World} world - The physics world.
     */
    constructor(config, scene, world) {
        this.scene = scene;
        this.world = world;
        this.config = config;
        
        this.initialize();
        this.initializePhysics();
    }

    /*
      Initializes the wall graphics.
     */
    initialize() {
        // Loads a brick texture onto the wall
        const wallTexturePath = this.config.texturePath || '/assets/walltexture-try.jpg';
        const brickTexture = textureLoader.load(wallTexturePath);
        brickTexture.wrapS = THREE.RepeatWrapping;
        brickTexture.wrapT = THREE.RepeatWrapping;

        // Repeats the texture based on the wall dimensions so it doesnt look blurry.
        if (this.config.width <= this.config.length) {
            brickTexture.repeat.set(this.config.width, 1);
        }
        // Repeated the texture by config.length * 3 here because I thought it looked the best visually
        else {
            brickTexture.repeat.set(this.config.length * 3, 1);
        }

        const wallGeometry = new THREE.BoxGeometry(this.config.length, this.config.width, this.config.height);
        const wallTexture = new THREE.MeshStandardMaterial({ map: brickTexture });

        this.wallMesh = new THREE.Mesh(wallGeometry, wallTexture);
        // Sets position of wall based on config info
        this.wallMesh.position.set(this.config.position.x, this.config.position.y, this.config.position.z);

        // Rotates the wall based on config info
        if (this.config.rotation) {
            this.wallMesh.rotation.y = this.config.rotation.y;
        }
        // Allows for the walls to tilt used for ramps
        const tilt_x = this.config.wallTilt_x || 0;
        this.wallMesh.rotation.x = tilt_x;

        const tilt_z = this.config.wallTilt_z || 0;
        this.wallMesh.rotation.z = tilt_z;

        // Adds the wall mesh to the scene.
        this.scene.add(this.wallMesh);
    }

    /*
      Initializes the physical properties of the wall.
     */
    initializePhysics() {
        // Creates the wall's shape for physics calculations. Used half extents again.
        const wallShape = new CANNON.Box(new CANNON.Vec3(this.wallMesh.geometry.parameters.width / 2, 
                                                         this.wallMesh.geometry.parameters.height / 2, 
                                                         this.wallMesh.geometry.parameters.depth / 2));

        // Sets the ball's physics body to be static
        this.wallBody = new CANNON.Body({ mass: 0 });
        this.wallBody.addShape(wallShape);
        this.wallBody.position.set(this.wallMesh.position.x, this.wallMesh.position.y, this.wallMesh.position.z);

        let rotationQuaternion = new CANNON.Quaternion();

        /* Since the physics body has to align with the graphical representation, quaternion aligns the physics body
         based on the rotation of the mesh. */
        if (this.wallMesh.rotation.y) {
            let yRotation = new CANNON.Quaternion();
            yRotation.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this.wallMesh.rotation.y);
            rotationQuaternion = rotationQuaternion.mult(yRotation);
        }

        // The following do the same for x and z rotations
        if (this.wallMesh.rotation.x) {
            let xRotation = new CANNON.Quaternion();
            xRotation.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), this.wallMesh.rotation.x);
            rotationQuaternion = rotationQuaternion.mult(xRotation);
        }

        if (this.wallMesh.rotation.z) {
            let zRotation = new CANNON.Quaternion();
            zRotation.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), this.wallMesh.rotation.z);
            rotationQuaternion = rotationQuaternion.mult(zRotation);
        }

        this.wallBody.quaternion = rotationQuaternion;

        const wallMaterial = new CANNON.Material();
        wallMaterial.restitution = 0.5;
        wallMaterial.friction = 0;

        this.wallBody.material = wallMaterial;

        // Adds the wall's body to the physics world.
        this.world.addBody(this.wallBody);
    }
}