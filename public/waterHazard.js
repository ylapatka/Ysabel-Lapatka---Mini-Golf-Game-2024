
// Creates some water graphics
class WaterHazard {
    /**
     * @param {Object} config - Configuration information for the water hazard.
     * @param {THREE.Scene} scene - The scene where the water hazard is added.
     */

    constructor(config, scene) {
        this.scene = scene;
        this.config = config;
        this.world = world;
        this.initialize();    
    }

    /*
      Initializes the water graphics.
     */
    initialize() {
        // Loads the water texture
        const waterTexture = textureLoader.load('/assets/watertexture.jpg');

        // Creates the water's geometry and material
        const waterGeometry = new THREE.PlaneGeometry(this.config.width, this.config.height, 32, 32);

        // Used the following below to make the water look more realisitc 
        const waterMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1e90ff, 
            transparent: true,
            opacity: 0.5,
            map: waterTexture
        });

        // Initializes the water's mesh and set its position based on config inforamtion
        this.waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
        this.waterMesh.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
        this.waterMesh.rotateX(-Math.PI / 2); // Rotated the water mesh to lay flat

        this.scene.add(this.waterMesh);
    }

    // No physics are added for this class because it isn't needed in this case, its for visuals only
}