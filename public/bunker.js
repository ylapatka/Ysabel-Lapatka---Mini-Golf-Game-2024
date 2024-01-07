// The Bunker class creates a sand trap obstacle for the ball

class Bunker {
    /**
     * @param {Object} config - Configuration information to place/scale the bunker.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {CANNON.World} world - The CANNON physics world.
     */
    constructor(config, scene, world) {
        this.scene = scene;
        this.world = world;
        this.config = config;
        this.initializeBunker();          
        this.initializePhysics();    
    }

    /*
       Initializes the bunker graphics.
     */
    initializeBunker() {

        /* Creates the bunker's geometry and material using radius defined in config
         0.1 is height of cylinder and 32 is number of radial segments. */
        const bunkerGeometry = new THREE.CylinderGeometry(this.config.radius, this.config.radius, 0.1, 32);

        // Displacement texture used to make the bunker look more like sand by adding bumps.
        const displacementTexture = textureLoader.load('/assets/displacementmap.jpg');
        const bunkerTexture = textureLoader.load('/assets/bunkertexture.jpg')

        // Added the bunker texture, along with the displacement texture to the bunker material.
        const bunkerMaterial = new THREE.MeshStandardMaterial({ 
            map: bunkerTexture,
            displacementMap: displacementTexture,
            displacementScale: 0.3   
        });

        this.bunkerMesh = new THREE.Mesh(bunkerGeometry, bunkerMaterial);

        // Sets the position of the bunker and scales it based on the provided configuration information
        this.bunkerMesh.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
        this.bunkerMesh.scale.set(this.config.scale.x, this.config.scale.y, this.config.scale.z);

        // Adds the bunker mesh to the scene
        this.scene.add(this.bunkerMesh);
    }

    /*
      Initializes bunker physics.
     */
    initializePhysics() {
        /* Create the bunker's shape for physics calculations
         I approximated the bunker's radius after I scaled it. */
        const newRadius = this.config.radius * this.config.scale.z;
        const bunkerShape = new CANNON.Cylinder(newRadius, newRadius, 0.1, 32);

        // Creates the bunker's body with a mass of 0 indicating it is static
        this.bunkerBody = new CANNON.Body({ mass: 0 });
        this.bunkerBody.addShape(bunkerShape);
        this.bunkerBody.position.copy(this.bunkerMesh.position);

        // Aligns the bunker body with it's rotation in 3D space
        this.bunkerBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0)); 

        // Sets physical properties of the bunker to it's material
        const bunkerMaterial = new CANNON.Material();
        bunkerMaterial.friction = 0.2; 
        this.bunkerBody.material = bunkerMaterial;
        

        this.world.addBody(this.bunkerBody);
    }

    /**
     * Checks if a ball is over the bunker and reduces its velocity if so.
     * @param {CANNON.Body} ballBody - The physics body of the ball.
     */
    checkBallInBunker(ballBody) {
        const distance = this.bunkerMesh.position.distanceTo(ballBody.position);
        if (distance < this.config.radius) {
            // Slows down the ball once it is in the bunker.
            const reductionFactor = 0.95; 
            ballBody.velocity.scale(reductionFactor, ballBody.velocity);
        }
    }
}