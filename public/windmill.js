
// The Windmill class initailizes a rotating windmill in the scene
class Windmill {
    /**
     * @param {Object} config - The configuration settings for the windmill.
     * @param {THREE.Scene} scene - The three.js scene where the windmill is added.
     * @param {CANNON.World} world - The physics world.
     */
    constructor(config, scene, world) {
        this.config = config;
        this.scene = scene;
        this.world = world;
        this.houseWidth = 5;
        this.houseHeight = 12;
        this.houseDepth = 2;
        this.gapWidth = 2;
        this.bladeWidth = 2;
        this.bladeLength = 17;
        this.bladeDepth = 0.5;
        this.numberOfBlades = 4;
        this.roofradius = 8;
        this.roofheight = 7;
        this.angleBetweenBlades = (2 * Math.PI) / this.numberOfBlades;

        this.windmillGroup = this.initializeWindmill();
        this.windmillBodies = [];
        this.initializePhysics();
    }
    /**
     * Initializes the graphical representation or mesh of the windmill.
     * @returns {THREE.Group} The windmill group containing all elements of the windmill.
     */
    initializeWindmill() {
        // Adds texture to windmill and the windmill's blades
        const windmillTexture = textureLoader.load('/assets/windmilltexture.jpg');
        const windmillBladeTexture = textureLoader.load('/assets/windmillbladetexture.jpg');

        // Repeats the texture so it doesn't look blurry
        windmillTexture.wrapS = THREE.RepeatWrapping;
        windmillTexture.wrapT = THREE.RepeatWrapping;

        windmillTexture.repeat.set(this.bladeLength * 3, 10);
        const windmillGroup = new THREE.Group();
        const bladesGroup = new THREE.Group();

        // Initializes the right and left houses of the windmill, leaves a gap for the ball to go through
        const leftHouseGeometry = new THREE.BoxGeometry((this.houseWidth - this.gapWidth) / 2, this.houseHeight * 2, this.houseDepth);
        const houseMaterial = new THREE.MeshStandardMaterial({ map: windmillTexture }); 
        const leftHouse = new THREE.Mesh(leftHouseGeometry, houseMaterial);
        leftHouse.position.set(-this.houseWidth / 4 - this.gapWidth / 2, 0, 0); 
        // Adds the left house of the windmill to the group allowing the full group to be placed based on the config.
        windmillGroup.add(leftHouse);
    
        const rightHouseGeometry = new THREE.BoxGeometry((this.houseWidth - this.gapWidth) / 2, this.houseHeight * 2, this.houseDepth);
        const rightHouse = new THREE.Mesh(rightHouseGeometry, houseMaterial);
        rightHouse.position.set(this.houseWidth / 4 + this.gapWidth / 2, 0, 0); 
        windmillGroup.add(rightHouse)

        // Cone Geometry for the roof of the windmill
        const roofGeometry = new THREE.ConeGeometry(this.roofradius, this.roofheight, this.roofradius);
        const roofMaterial = new THREE.MeshStandardMaterial({map: windmillTexture});
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = this.houseHeight + 1.5; 
        // Adds the right house to the group
        windmillGroup.add(roof);

        // Adds the blades
        const bladeGeometry = new THREE.BoxGeometry(this.bladeWidth, this.bladeLength, this.bladeDepth);
        const bladeMaterial = new THREE.MeshStandardMaterial({ map: windmillBladeTexture });
        const angleBetweenBlades = (2 * Math.PI) / this.numberOfBlades;

        // Created 4 blades here that rotate
        for (let i = 0; i < this.numberOfBlades; i++) {
            const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
            blade.position.z = 8; // Adjusted position so the blades' intersection is at the origin
            blade.position.y = 0;
            blade.rotation.z = angleBetweenBlades * i;
            bladesGroup.add(blade);
        }
        bladesGroup.position.y = this.houseHeight - 2;
        windmillGroup.add(bladesGroup);
        windmillGroup.blades = bladesGroup;

        // Positioned every windmill object based on the config info
        windmillGroup.position.x = this.config.position.x;
        windmillGroup.position.y = this.config.position.y;
        windmillGroup.position.z = this.config.position.z;

        this.scene.add(windmillGroup);
        return windmillGroup;
    }

    /*
      Initializes the physical properties and bodies for the windmill.
     */
    initializePhysics() {
        // Initialize the left and right house physics
        const leftHouseBody = new CANNON.Body({ mass: 0 }); // mass of 0 makes it static
        leftHouseBody.addShape(new CANNON.Box(new CANNON.Vec3((this.houseWidth - this.gapWidth) / 4, this.houseHeight, this.houseDepth / 2)));
        leftHouseBody.position.set(-this.houseWidth / 4 - this.gapWidth / 2 + this.config.position.x, this.config.position.y, this.config.position.z); 
    
        this.world.addBody(leftHouseBody);
        this.windmillBodies.push(leftHouseBody);

        const rightHouseShape = new CANNON.Box(new CANNON.Vec3((this.houseWidth - this.gapWidth) / 4, 5, this.houseDepth / 2));
        const rightHouseBody = new CANNON.Body({ mass: 0 }); 
        rightHouseBody.addShape(rightHouseShape);
        rightHouseBody.position.set(this.houseWidth / 4 + this.gapWidth / 2 + this.config.position.x, this.config.position.y, this.config.position.z);
        this.world.addBody(rightHouseBody);
        this.windmillBodies.push(rightHouseBody);
    
        // Initialize the roof physics
        const roofShape = new CANNON.Cylinder(8, 8, 7, 8); 
        const roofBody = new CANNON.Body({ mass: 0 }); 
        roofBody.addShape(roofShape);
        roofBody.position.y = this.houseHeight + 1.5;
        roofBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(roofBody);
        this.windmillBodies.push(roofBody);

        /* While the blades rotate, their physics bodies need to too, this syncs up the position 
           of the blades mesh and the physics body for each blade */
        this.bladeBodies = [];
        const bladeShape = new CANNON.Box(new CANNON.Vec3(this.bladeWidth / 2, this.bladeLength / 2, this.bladeDepth / 2));
        for (let i = 0; i < this.numberOfBlades; i++) {
            const bladeBody = new CANNON.Body({ mass: 1 }); 
            bladeBody.addShape(bladeShape);
            bladeBody.position.copy(this.windmillGroup.blades.children[i].position);
            bladeBody.quaternion.copy(this.windmillGroup.blades.children[i].quaternion);
            this.world.addBody(bladeBody);
            this.bladeBodies.push(bladeBody);
        }

    }
    
    // Allows the blades to rotate 
    animate() {
        if (this.windmillGroup.blades) {
            const rotationSpeed = 0.005; 
    
            for (let i = 0; i < this.numberOfBlades; i++) {
                const blade = this.windmillGroup.blades.children[i];
                const bladeBody = this.bladeBodies[i];
                blade.rotation.z -= rotationSpeed;
                bladeBody.quaternion.copy(blade.quaternion);
                }
            }
    
        }
    }
    
