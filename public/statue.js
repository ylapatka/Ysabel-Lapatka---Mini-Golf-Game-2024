
// Creates a new statue obstacle, looks like a rotating pyramid.

class StatueObstacle {
    /**
     * @param {Object} config - Config info to position the obstacle.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {CANNON.World} world - Physics world.
     */
    constructor(config, scene, world) {
        this.scene = scene;
        this.world = world;
        this.config = config;
        this.rotationSpeed = config.rotationSpeed || { x: 0, y: 0.009, z: 0 };
        this.initialize();           
        this.initializePhysics();          
    }

    /**
     * Initializes the statue graphics
     */
    initialize() {
        // Loads the statue texture
        const statueTexture = textureLoader.load('/assets/statuetexture.jpg');

        // Create the statue's geometry and material
        // 4 is radial segments, 4 faces so looks like a pyramid
        const statueGeometry = new THREE.ConeGeometry(this.config.radius, this.config.height, 4, 1, false, 0, Math.PI * 2);
        const statueMaterial = new THREE.MeshStandardMaterial({map: statueTexture});

        // Creates the mesh based on the geometry and material
        this.statueMesh = new THREE.Mesh(statueGeometry, statueMaterial);
        this.statueMesh.position.set(this.config.position.x, this.config.position.y || this.config.height / 2, this.config.position.z);

        // Allows for scaling of the statue.
        if (this.config.scale) {
            this.statueMesh.scale.set(this.config.scale.x || 1, this.config.scale.y || 1, this.config.scale.z || 1);
        }

        this.scene.add(this.statueMesh);
    }

    /*
       Initializes the physical properties of the statue.
     */
    initializePhysics() {
        // Creates the statues shape
        const statueShape = new CANNON.Box(new CANNON.Vec3(this.config.radius, this.config.height / 2, this.config.radius));

        // This adjusts the shape's radius if the mesh is scaled
        if (this.statueMesh.scale) {
            statueShape.radius *= this.statueMesh.scale.x;
        }

        // Creates a static physics object
        this.statueBody = new CANNON.Body({ mass: 0 });
        this.statueBody.addShape(statueShape);
        this.statueBody.position.copy(this.statueMesh.position);

        // Sets the properites of the statue
        const statueMaterial = new CANNON.Material();
        statueMaterial.friction = 0.5;
        this.statueBody.material = statueMaterial;
        
        // Adds the statue's body to the physics world
        this.world.addBody(this.statueBody);
    }
    update() {
        this.statueMesh.rotation.x += this.rotationSpeed.x;
        this.statueMesh.rotation.y += this.rotationSpeed.y;
        this.statueMesh.rotation.z += this.rotationSpeed.z;
    }
}
