
// The Fairway Class initializes the fairway object or grass in my game.

class Fairway {
    /**
     * @param {Object} config : Configuration options for the fairway.
     * @param {Object} world : The physics world.
     * @param {Object} scene : The Three.js scene.
     */

    constructor(config, world, scene) {
        this.config = config;
        this.world = world;           
        this.scene = scene;

        // Sets values of width, length and height of the fairway based on configuration info or default values
        this.widthFairway = this.config.widthFairway || 20;
        this.lengthFairway = this.config.lengthFairway || 50;
        this.heightFairway = this.config.heightFairway || 0.5;
        
        // Initializes the the graphical representation (mesh) of the fairway
        this.fairwayMesh = this.initializeFairway();

        // Sets up physics for the fairway
        this.initializePhysics();     
    }

    /**
     * Initializes fairway graphics
     * @returns {THREE.Mesh} The fairway mesh that has been created.
     */

    initializeFairway() {
        // Default texture of the fairway
        const grassTexturePath = this.config.texturePath || '/assets/grasstexture-try.jpg';
        const grassTexture = textureLoader.load(grassTexturePath);
    
        // Allows the texture to repeat and to not look stretched out or blurry
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(this.widthFairway * 0.15, this.lengthFairway * 0.15);
        
        // Creates fairway geometry and material
        const fairwayGeometry = new THREE.BoxGeometry(this.widthFairway, this.heightFairway, this.lengthFairway);
        const fairwayMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });
    
        // Constructs the fairway graphical representation
        const fairway = new THREE.Mesh(fairwayGeometry, fairwayMaterial);
    
        /* Allows for fairway tilting in the config section
           Using this to simulate hills.
        */
        const tilt_x = this.config.fairwayTilt_x || 0;
        fairway.rotation.x = tilt_x;

        const tilt_z = this.config.fairwayTilt_z || 0;
        fairway.rotation.z = tilt_z; 
    
        // Sets default position of the fairway can be changed in config
        fairway.position.x = this.config.fairwayOffsetX || 0;
        fairway.position.y = (this.config.fairwayOffsetY || 0) + this.heightFairway / 2; 
        fairway.position.z = this.config.fairwayOffsetZ || 0;

        // Adds fairway to scene
        scene.add(fairway);
        return fairway;
    }

    /*
      Sets up physics of the fairway in the game world
    */
    initializePhysics() {
        /* Half extents define the size from the center of the object to each side. 
           Helpful for alinging boxes. */
        const halfExtents = new CANNON.Vec3(this.widthFairway / 2, this.heightFairway / 2, this.lengthFairway / 2);
        const fairwayShape = new CANNON.Box(halfExtents);

        /* Defines a physics body for the fairway for collision detection.
         mass 0 means static  */
        const fairwayBody = new CANNON.Body({ mass: 0 });
        fairwayBody.addShape(fairwayShape);
    
        // Syncs the fairway position and rotation with the graphical representation
        fairwayBody.position.copy(this.fairwayMesh.position);
        fairwayBody.quaternion.copy(this.fairwayMesh.quaternion);
    
        // Sets up fairway material properties
        fairwayBody.material = new CANNON.Material();
        fairwayBody.material.friction = 0.1;
    
        // Adds fairway physics body to world
        this.world.addBody(fairwayBody);
    
    }
}
