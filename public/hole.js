
// The Hole class represents the golf hole.

class Hole {
    /**
     * @param {object} config - Config passed defining hole position.
     * @param {THREE.Scene} scene - The Three.js scene.
     */
    constructor(config, scene) {
        this.scene = scene;  
        this.config = config;
        this.initializeHole(config);
        this.createFlagpole(config.holePosition);
    }

    /**
     * Initializes the hole graphics.
     * The hole is represented as a very thin black cylinder.
     * @param {object} config - Configuration object specifying the hole's position.
     */
    initializeHole(config) {
        // Cylinder geometry to represent the hole
        const holeGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
        const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        this.hole = new THREE.Mesh(holeGeometry, holeMaterial);

        // Hole is positioned based on default values here, or provided configuration elements
        this.hole.position.x = config.holePosition.x || 0;
        this.hole.position.y = config.holePosition.y || 0.1; 
        this.hole.position.z = config.holePosition.z || -30;
        this.scene.add(this.hole);

        /* Adds light above the hole to highlight it
         First paramater is color (white), 2 is light intensity and 10 is distance above hole */
        const holeLight = new THREE.PointLight(0xFFFFFF, 2, 10);
        holeLight.position.set(this.hole.position.x, 10, this.hole.position.z);
        this.scene.add(holeLight);
    }

    /**
     * Creates a flagpole indicating where the hole is if not visible. 
     * @param {THREE.Vector3} holePosition - The position of the hole in the scene.
     */
    createFlagpole(holePosition) {
        const poleHeight = 7;  
        const poleRadius = 0.05;
    
        // Creates pole geometry / material.
        const poleGeometry = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 16);
        const poleMaterial = new THREE.MeshBasicMaterial({ color: 0x555555 });
        this.pole = new THREE.Mesh(poleGeometry, poleMaterial);
        
        // Sets the pole position to be in the middle of the hole
        this.pole.position.set(holePosition.x, holePosition.y + poleHeight / 2, holePosition.z);
    
        // Defines dimensions for the flag
        const flagWidth = 3.5;
        const flagHeight = 2;
    
        // Plane Geometry to represent the flag
        const flagGeometry = new THREE.PlaneGeometry(flagWidth, flagHeight);
        // Default flag texture, changes every hole
        const flagTexturePath = this.config.flagtexturepath || 'assets/flag1.jpg';
        const flagTexture = textureLoader.load(flagTexturePath);
        const flagMaterial = new THREE.MeshBasicMaterial({ map: flagTexture, side: THREE.DoubleSide });
    
        this.flag = new THREE.Mesh(flagGeometry, flagMaterial);
    
        // Positions the flag on the pole
        const flagOffset = flagHeight / 3; // Offset is here to position the flag in the correct location
        this.flag.position.set(
            holePosition.x + 1, 
            holePosition.y + poleHeight - flagOffset, 
            holePosition.z - 0.5
        );
        this.flag.rotation.y = Math.PI / 4.5; // Rotated the flag a bit to make it look more realistic
    
        // Adds the flagpole and flag to the scene
        this.scene.add(this.pole);
        this.scene.add(this.flag);
    }   
}
