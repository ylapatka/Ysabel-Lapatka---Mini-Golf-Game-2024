// Creates a new rock

class Rock {
    /**
     * @param {Object} config - Config used to position the rock or scale it.
     * @param {THREE.Scene} scene - The Three.js scene.
     * @param {CANNON.World} world - The Cannon.js world.
     */
    constructor(config, scene, world) {
        this.scene = scene;
        this.config = config;
        this.world = world;
        this.initialize();    
        this.initializePhysics();       
    }

    /**
     * Initializes the visual representation of the rock.
     */
    initialize() {
        // Loads the rock texture and a displacement texture
        const rockTexture = textureLoader.load('/assets/rocktexture.jpg');
        const displacementTexture = textureLoader.load('/assets/displacementmap.jpg');

        // Creates the rock's geometry and material
        const rockGeometry = new THREE.SphereGeometry(this.config.radius, 32, 32);
        const rockMaterial = new THREE.MeshStandardMaterial({ 
            // Displacement is used here to give the rock a more rocky appearance
            map: rockTexture,
            displacementMap: displacementTexture,
            displacementScale: 0.5  
        });

        // Initializes the rock's mesh and sets its position based on the config
        this.rockMesh = new THREE.Mesh(rockGeometry, rockMaterial);
        this.rockMesh.position.set(this.config.position.x, this.config.position.y || this.config.radius, this.config.position.z);

        // Allows for scaling of the rock so it not a perfect sphere.
        if (this.config.scale) {
            this.rockMesh.scale.set(this.config.scale.x || 1, this.config.scale.y || 1, this.config.scale.z || 1);
        }

        // Adds the rock mesh to the scene
        this.scene.add(this.rockMesh);
    }

    /*
      Initializes the physical properties of the rock.
     */
    initializePhysics() {
        // Creates the rock's shape for physics calculations
        const rockShape = new CANNON.Sphere(this.config.radius);

        // Adjusts the shape's radius if the mesh is scaled
        if (this.rockMesh.scale) {
            rockShape.radius *= this.rockMesh.scale.x;
        }

        // Creates the rock's physics body
        this.rockBody = new CANNON.Body({ mass: 0 });
        this.rockBody.addShape(rockShape);
        this.rockBody.position.copy(this.rockMesh.position);

        // Sets physical properties of the rock
        const rockMaterial = new CANNON.Material();
        rockMaterial.friction = 0.5;
        this.rockBody.material = rockMaterial;
        
        // Adds the rock's body to the physics world
        this.world.addBody(this.rockBody);

    }
}
