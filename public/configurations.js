var fairways, walls, rocks, hills, windmills, statues, waterhazards, bunkers = [];
const course1Config = {
    fairways: [
        {
            widthFairway: 20,
            lengthFairway: 50,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 0,
        },
    ],
    ballPosition: {x: 0, y: 1.5, z: 20},
    holePosition: { x: 0, y: 0.5, z: -20 },
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
    walls: [
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: 0, y: 1.5, z: -25.5 }
        },
        {
            width: 3,
            height: 1,
            length: 50,
            position: { x: -10.5, y: 1.5, z: 0 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 50,
            position: { x: 10.5, y: 1.5, z: 0 },
            rotation: { y: Math.PI / 2 }
        }
    ]
};
const course2Config = {
    fairways: [
        {
            widthFairway: 20,
            lengthFairway: 50,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 0,
        },
        {
            widthFairway: 30,
            lengthFairway: 20,
            fairwayOffsetX: -25, 
            fairwayOffsetY: 0,
            fairwayOffsetZ: -15, 
        },
    ],
    ballPosition: { x: 0, y: 1.5, z: 20 },
    holePosition: { x: -35, y: 0.5, z: -15 },
    flagtexturepath: '/assets/flag2.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20),
    arrowLength: 1,
    arrowVisible: false,
    walls: [
        {   width: 3,
            height: 1,
            length: 30,
            position: { x: -10.5, y: 1.5, z: 10 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 50,
            position: { x: 10.5, y: 1.5, z: 0 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 50,
            position: { x: -15, y: 1.5, z: -25 },
        },
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: -40, y: 1.5, z: -15 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 30,
            position: { x: -25, y: 1.5, z: -5 },
        },


    ],
    rocks: [
        {
            radius: 3,
            position: { x: 0, y: -0.5, z: 0 },
            scale: { x: 1.5, y: 1, z: 1 } 
        }
    ]
};
const course3Config = {
    fairways: [
        {
            widthFairway: 20,
            lengthFairway: 50,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 0,
        },
        {
            widthFairway: 50,
            lengthFairway: 20,
            fairwayOffsetX: 0, 
            fairwayOffsetY: 0,
            fairwayOffsetZ: -35, 
        },
    ],
    ballPosition: { x: 0, y: 1.5, z: 20 },
    holePosition: { x: 20, y: 0.5, z: -35 },
    flagtexturepath: '/assets/flag3.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
    walls: [
    
        {
            width: 3,
            height: 1,
            length: 50,
            position: { x: -10.5, y: 1.5, z: 0 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 50,
            position: { x: 10.5, y: 1.5, z: 0 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 50,
            position: { x: 0, y: 1.5, z: -45 },
        },
        {
            width: 3,
            height: 1,
            length: 15,
            position: { x: -17.5, y: 1.5, z: -25 },
        },
        {
            width: 3,
            height: 1,
            length: 15,
            position: { x: 17.5, y: 1.5, z: -25 },
        },
        {
            width: 3,
            height: 1,
            length: 20.5,
            position: { x: -25.5, y: 1.5, z: -35 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 20.5,
            position: { x: 25.5, y: 1.5, z: -35 },
            rotation: { y: Math.PI / 2 }
        }
    ],
    rocks: [
        {
            radius: 2,
            position: { x: -5, y: -0.5, z: -25 },
            scale: { x: 1.5, y: 1, z: 0 } 
        }
    ],
    windmills: [
        {
            position: { x: 0, y: 0, z: -20 }
        }
    ]
};
const course4Config = {
    fairways: [ 
        {
            widthFairway: 50,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 17,
            
        },
        {
            widthFairway: 10,
            lengthFairway: 40,
            fairwayOffsetX: -10.5,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -8,
            
        },
        {
            widthFairway: 10,
            lengthFairway: 40,
            fairwayOffsetX: 10.5,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -8,
            
        },
        {
            widthFairway: 60,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -60,
            
        },
        {
            widthFairway: 60,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -33,
            
        },
        {
            widthFairway: 10,
            lengthFairway: 20,
            fairwayOffsetX: -25,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -48,
            
        },
        {
            widthFairway: 10,
            lengthFairway: 20,
            fairwayOffsetX: 25,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -48,
            
        },
        {
            widthFairway: 20,
            lengthFairway: 20,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -48,
            
        },

    ],
    walls: [
        {
            width: 3,
            height: 1,
            length: 40,
            position: { x: -15.5, y: 1.5, z: -8 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 40,
            position: { x: -5.5, y: 1.5, z: -8 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 40,
            position: { x: 15.5, y: 1.5, z: -8 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 40,
            position: { x: 5.5, y: 1.5, z: -8 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 10,
            position: { x: -25, y: 1.5, z: 17 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 10,
            position: { x: 25, y: 1.5, z: 17 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 10,
            position: { x: -20, y: 1.5, z: 12.5 },
        },
        {
            width: 3,
            height: 1,
            length: 10,
            position: { x: 20, y: 1.5, z: 12.5 },
        },
        {
            width: 3,
            height: 1,
            length: 10,
            position: { x: 0, y: 1.5, z: 11.5 },
        },
        {
            width: 3,
            height: 1,
            length: 10,
            position: { x: 0, y: 1.5, z: -27.5 },
        },
        {
            width: 3,
            height: 1,
            length: 60,
            position: { x: 0, y: 1.5, z: -65 },
        },
        {
            width: 3,
            height: 1,
            length: 14,
            position: { x: -23, y: 1.5, z: -27.5 },
        },
        {
            width: 3,
            height: 1,
            length: 14,
            position: { x: 23, y: 1.5, z: -27.5 },
        },
        {
            width: 3,
            height: 1,
            length: 38.25,
            position: { x: -30.5, y: 1.5, z: -46 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 38.25,
            position: { x: 30.5, y: 1.5, z: -46 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 2,
            height: 1,
            length: 17.5,
            position: { x: 20, y: -1, z: -46.5 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 2,
            height: 1,
            length: 17.5,
            position: { x: 10.5, y: -1, z: -46.5 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 2,
            height: 1,
            length: 17.5,
            position: { x: -20, y: -1, z: -46.5 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 2,
            height: 1,
            length: 17.5,
            position: { x: -10.5, y: -1, z: -46.5 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 2,
            height: 1,
            length: 8.5,
            position: { x: 15.25, y: -1, z: -55.5 },
        },
        {
            width: 2,
            height: 1,
            length: 8.5,
            position: { x: -15.25, y: -1, z: -55.5 },
        },
        {
            width: 2,
            height: 1,
            length: 8.5,
            position: { x: -15.25, y: -1, z: -38.5 },
        },
        {
            width: 2,
            height: 1,
            length: 8.5,
            position: { x: 15.25, y: -1, z: -38.5 },
        },
        
        
    ],
    bunkers: [
        {
            radius: 4,
            position: { x: 9, y: 0.5, z: -20 },
            scale: { x: 1, y: 1, z: 1.5 }
        },
        {
            radius: 4,
            position: { x: -9, y: 0.5, z: -5 },
            scale: { x: 1, y: 1, z: 1.5 }
        },
    ],
    waterhazards: [
        {
            width: 30,       
            height: 50,       
            position: {  x: 0, y: -0.25, z: -15 }
        }, 
        {
            width: 40,       
            height: 40,       
            position: {  x: 0, y: -1, z: -50 }
        }, 

    ],
    ballPosition: { x: 0, y: 1.5, z: 20 },
    holePosition: { x: 0, y: 0.5, z: -60 },
    flagtexturepath: '/assets/flag4.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
};
const course5Config = {
    fairways: [ 
        {
            widthFairway: 15,
            lengthFairway: 60,
            fairwayOffsetX: -12.5,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 0,
            
        },
        {
            widthFairway: 15,
            lengthFairway: 30,
            fairwayOffsetX: 10,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -15,
            
        },
        {
            widthFairway: 37.5,
            lengthFairway: 15,
            fairwayOffsetX: -1.25,
            fairwayOffsetY: 2.5,
            fairwayOffsetZ: -37,
            fairwayTilt_x: Math.PI / 10,
        },
        {
            widthFairway: 7.5,
            lengthFairway: 5,
            fairwayOffsetX: -1.25,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -15.5,
            texturePath: '/assets/bridgetexture.jpg'
        },
        {
            widthFairway: 7.5,
            lengthFairway: 5,
            fairwayOffsetX: -1.25,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -2.5,
        },
    ],
    walls: [
        {
            width: 3,
            height: 1,
            length: 60,
            position: { x: -20.5, y: 1.5, z: 0 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 30,
            position: { x: -5, y: 1.5, z: 15 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 16.5,
            position: { x: -20.5, y: 3.5, z: -37 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: Math.PI / 10
        },
        {
            width: 3,
            height: 1,
            length: 38.5,
            position: { x: -1.5, y: 6, z: -45 },
        },
        {
            width: 3,
            height: 1,
            length: 16.5,
            position: { x: 17.5, y: 3.5, z: -37 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: Math.PI / 10
        },
        {
            width: 2.5,
            height: 1,
            length: 28.5,
            position: { x: 17.5, y: 1.5, z: -14.5 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 2.8,
            height: 1,
            length: 23,
            position: { x: 6.25, y: 1.5, z: 0 },
        },
        {
            width: 2,
            height: 1,
            length: 7.5,
            position: { x: -1.25, y: 0, z: -5.5 },
        },
        {
            width: 2,
            height: 1,
            length: 7.5,
            position: { x: -1.25, y: 0, z: -28.5 },
        },
        {
            width: 2,
            height: 1,
            length: 9,
            position: { x: -4.5, y: 0, z: -23.5 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 2,
            height: 1,
            length: 9,
            position: { x: 2, y: 0, z: -23.5 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 2,
            height: 1,
            length: 6,
            position: { x: 2, y: 0, z: -9 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 2,
            height: 1,
            length: 6,
            position: { x: -4.5, y: 0, z: -9 },
            rotation: { y: Math.PI / 2 },
        },

        
    ],
    waterhazards: [
        {
            width: 30,       
            height: 35,       
            position: {  x: 0, y: -0.2, z: -25 }
        }, 

    ], 
    
    ballPosition: { x: -12.5, y: 1.5, z: 20 },
    holePosition: { x: 10, y: 0.5, z: -15.5 },
    flagtexturepath: '/assets/flag5.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
};
const course6Config = {
    fairways: [
        {
            widthFairway: 30,
            lengthFairway: 20,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 20,
        },
        {
            widthFairway: 30,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: -1.5,
            fairwayOffsetZ: 5.5,
            fairwayTilt_x: -Math.PI / 10,
        },
        {
            widthFairway: 7.5,
            lengthFairway: 27.5,
            fairwayOffsetX: -6.5,
            fairwayOffsetY: -3,
            fairwayOffsetZ: -12,
        },
        {
            widthFairway: 7.5,
            lengthFairway: 27.5,
            fairwayOffsetX: 6.5,
            fairwayOffsetY: -3,
            fairwayOffsetZ: -13,
        },
        {
            widthFairway: 30,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: -1.5,
            fairwayOffsetZ: -30.5,
            fairwayTilt_x: Math.PI / 10,
        },
        {
            widthFairway: 60,
            lengthFairway: 20,
            fairwayOffsetX: -15,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -45,
            
        },
    ],
    walls: [
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: -15.5, y: 1.5, z: 20 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: 15.5, y: 1.5, z: 20 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 2,
            height: 1,
            length: 25,
            position: { x: -2.5, y: -2, z: -12.5 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 2,
            height: 1,
            length: 25,
            position: { x: 2.5, y: -2, z: -12.5 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 2,
            height: 1,
            length: 6,
            position: { x: 0, y: -2, z: -25 },
        },
        {
            width: 2,
            height: 1,
            length: 6,
            position: { x: 0, y: -2, z: 0 },
        },
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: 15, y: 1.5, z: -45 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: -45, y: 1.5, z: -45 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 60,
            position: { x: -15, y: 1.5, z: -55 },
        },
        {
            width: 3,
            height: 1,
            length: 30,
            position: { x: -30, y: 1.5, z: -35 },
        },
        {
            width: 2.5,
            height: 1,
            length: 11,
            position: { x: -15, y: 0, z: -30 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: Math.PI / 10,
        },
        {
            width: 2.5,
            height: 1,
            length: 11,
            position: { x: 15, y: 0, z: -30 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: Math.PI / 10,
        },
        {
            width: 2.5,
            height: 1,
            length: 12,
            position: { x: -15.5, y: 0, z: 5 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: -Math.PI / 10,
        },
        {
            width: 2.5,
            height: 1,
            length: 12,
            position: { x: 15.5, y: 0, z: 5 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: -Math.PI / 10,
        },
        {
            width: 2.3,
            height: 1,
            length: 5,
            position: { x: -12.5, y: -1.7, z: -25 },
        },
        {
            width: 2.3,
            height: 1,
            length: 5,
            position: { x: 12.5, y: -1.7, z: -25 },
        },
        {
            width: 2.3,
            height: 1,
            length: 5,
            position: { x: 12.5, y: -1.7, z: 0 },
        },
        {
            width: 2.3,
            height: 1,
            length: 5,
            position: { x: -12.5, y: -1.7, z: 0 },
        },
    ],
    rocks: [
        {
            radius: 2,
            position: { x: 0, y: 1.5, z: -35 },
            scale: { x: 1.5, y: 1, z: 0 }
        },
    ],
    ballPosition: { x: 0, y: 1.5, z: 20 },
    holePosition: { x: -40, y: 0.5, z: -45 },
    flagtexturepath: '/assets/flag6.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
};
const course7Config = {

    fairways: [
        {
            widthFairway: 20,
            lengthFairway: 40,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 5,
        },
        {
            widthFairway: 20,
            lengthFairway: 8,
            fairwayOffsetX: 0,
            fairwayOffsetY: -1.35,
            fairwayOffsetZ: -18.5,
            fairwayTilt_x: -Math.PI/8,
        },
        {
            widthFairway: 20,
            lengthFairway: 20,
            fairwayOffsetX: -18,
            fairwayOffsetY: 3,
            fairwayOffsetZ: -4,
            fairwayTilt_z: -Math.PI/10,
        },
        {
            widthFairway: 20,
            lengthFairway: 6,
            fairwayOffsetX: 0,
            fairwayOffsetY: -2.75,
            fairwayOffsetZ: -25,
        },
        {
            widthFairway: 15,
            lengthFairway: 30,
            fairwayOffsetX: -35,
            fairwayOffsetY: 6.1,
            fairwayOffsetZ: -9,
        },
    ],
    walls: [
        {
            width: 3,
            height: 1,
            length: 40,
            position: { x: 10.5, y: 1.5, z: 5 },
            rotation: { y: Math.PI / 2 }
        },
        {
            width: 3,
            height: 1,
            length: 9,
            position: { x: 10.5, y: 0, z: -18.5 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: -Math.PI/8
        },
        {
            width: 3,
            height: 1,
            length: 9,
            position: { x: -10.5, y: 0, z: -18.5 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: -Math.PI/8
        },
        {
            width: 2,
            height: 1,
            length: 7,
            position: { x: -10.5, y: -1.5, z: -25.5 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 2,
            height: 1,
            length: 7,
            position: { x: 10.5, y: -1.5, z: -25.5 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 2,
            height: 1,
            length: 20,
            position: { x: 0, y: -1.5, z: -28.5 },
        },
        {
            width: 2.5,
            height: 1,
            length: 18.5,
            position: { x: -18.9, y: 4.5, z: -14 },
            wallTilt_z: -Math.PI/10
        },
        {
            width: 2.5,
            height: 1,
            length: 17,
            position: { x: -18, y: 4.5, z: 6.5 },
            wallTilt_z: -Math.PI/10
        },
        {
            width: 3,
            height: 1,
            length: 19,
            position: { x: -10.5, y: 1.5, z: 15.5 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 2.5,
            height: 1,
            length: 16,
            position: { x: -34, y: 7, z: 6.5 },
           
        },
        {
            width: 2.5,
            height: 1,
            length: 31,
            position: { x: -42.5, y: 7, z: -8.5 },
            rotation: { y: Math.PI / 2 },
           
        },
        {
            width: 2.5,
            height: 1,
            length: 16,
            position: { x: -35, y: 7, z: -24 },
           
        },
        {
            width: 2.5,
            height: 1,
            length: 10.5,
            position: { x: -27.5, y: 7, z: -19 },
            rotation: { y: Math.PI / 2 },
           
        },
    
    ],
    statues: [
        {
            height: 10, 
            radius: 6, 
            position: { x: 0, y: 4.5, z: 0 }, 
            scale: { x: 1, y: 1, z: 1 }, 
        },
    ],

    ballPosition: { x: 0, y: 1.5, z: 20 },
    holePosition: { x: -35, y: 6.6, z: -18 },
    flagtexturepath: '/assets/flag7.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
};
const course8Config = {
    fairways: [
        {
            widthFairway: 12,
            lengthFairway: 10,
            fairwayOffsetX: -9,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 5,
        },
        {
            widthFairway: 12,
            lengthFairway: 10,
            fairwayOffsetX: 9,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 5,
        },
        {
            widthFairway: 30,
            lengthFairway: 20,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 20,
        },
        {
            widthFairway: 30,
            lengthFairway: 15,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -7,
        },
        {
            widthFairway: 12,
            lengthFairway: 10,
            fairwayOffsetX: -9,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -19,
        },
        {
            widthFairway: 12,
            lengthFairway: 10,
            fairwayOffsetX: 9,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -19,
        },
        {
            widthFairway: 30,
            lengthFairway: 5,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -26,
        },
        {
            widthFairway: 12,
            lengthFairway: 20,
            fairwayOffsetX: -20.5,
            fairwayOffsetY: 2,
            fairwayOffsetZ: -18,
            fairwayTilt_z: -Math.PI/10,
        },
        {
            widthFairway: 12,
            lengthFairway: 20,
            fairwayOffsetX: 20.5,
            fairwayOffsetY: 2,
            fairwayOffsetZ: -18,
            fairwayTilt_z: Math.PI/10,
        },
        {
            widthFairway: 8,
            lengthFairway: 35,
            fairwayOffsetX: 30,
            fairwayOffsetY: 3.9,
            fairwayOffsetZ: -25.5,

        },
        {
            widthFairway: 8,
            lengthFairway: 35,
            fairwayOffsetX: -30,
            fairwayOffsetY: 3.9,
            fairwayOffsetZ: -25.5,

        },
        {
            widthFairway: 52.5,
            lengthFairway: 15,
            fairwayOffsetX: 0,
            fairwayOffsetY: 3.9,
            fairwayOffsetZ: -35.5,
        }
        
    ],
    walls: [
        {
            width: 3,
            height: 1,
            length: 37.5,
            position: { x: -15.5, y: 1.5, z: 11.25 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 3,
            height: 1,
            length: 37.5,
            position: { x: 15.5, y: 1.5, z: 11.25 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 3,
            height: 1,
            length: 35,
            position: { x: -33.5, y: 5.5, z: -25.5 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 3,
            height: 1,
            length: 35,
            position: { x: 33.5, y: 5.5, z: -25.5 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 3.7,
            height: 1,
            length: 55,
            position: { x: 0, y: 2.5, z: -28 },
        },
        {
            width: 3,
            height: 1,
            length: 66,
            position: { x: 0, y: 5.5, z: -42.5 },
        },
        {
            width: 3,
            height: 1,
            length: 12.5,
            position: { x: 20.9, y: 3.5, z: -7.6 },
            wallTilt_z: Math.PI / 10,
        },
        {
            width: 3,
            height: 1,
            length: 12.5,
            position: { x: -20.9, y: 3.5, z: -7.6 },
            wallTilt_z: -Math.PI / 10,
        },
        {
            width: 3,
            height: 1,
            length: 8,
            position: { x: -30, y: 5.5, z: -7 },
        },
        {
            width: 3,
            height: 1,
            length: 8,
            position: { x: 30, y: 5.5, z: -7 },
        },
        {
            width: 2,
            height: 1,
            length: 6,
            position: { x: 0, y: -0.6, z: 0.2 },
        },
        {
            width: 2,
            height: 1,
            length: 6,
            position: { x: 0, y: -0.6, z: 10.5 },
        },
        {
            width: 2,
            height: 1,
            length: 6,
            position: { x: 0, y: -0.6, z: -23.8 },
        },
        {
            width: 2,
            height: 1,
            length: 6,
            position: { x: 0, y: -0.6, z: -15 },
        },
        {
            width: 2,
            height: 1,
            length: 40,
            position: { x: -3.4, y: -0.6, z: -10 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 2,
            height: 1,
            length: 40,
            position: { x: 3.4, y: -0.6, z: -10 },
            rotation: { y: Math.PI / 2 },
        },

    ],
    rocks: [
        {
            radius: 1.5,
            position: { x: 0, y: 1.5, z: -5 },
            scale: { x: 1.5, y: 1, z: 0 }
        },
    ],
    waterhazards: [
        {
            width: 20,       
            height: 50,       
            position: {  x: 0, y: -1, z: -15 }
        }, 

    ], 
    ballPosition: { x: 0, y: 1.5, z: 25 },
    holePosition: { x: 0, y: 4.5, z: -35 },
    flagtexturepath: '/assets/flag8.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
};
const course9Config = {

    fairways: [
        {
            widthFairway: 50,
            lengthFairway: 20,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 20,
        },
        {
            widthFairway: 50,
            lengthFairway: 20,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -28,
        },
        {
            widthFairway: 8,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: 1.5,
            fairwayOffsetZ: 5.5,
            fairwayTilt_x: Math.PI / 10,
            texturePath: '/assets/bridgetexture.jpg'
        },
        {
            widthFairway: 8,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: 1.5,
            fairwayOffsetZ: -13.5,
            fairwayTilt_x: -Math.PI / 10,
            texturePath: '/assets/bridgetexture.jpg'
        },
        {
            widthFairway: 8,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: 3,
            fairwayOffsetZ: -4,
            texturePath: '/assets/bridgetexture.jpg'
        },
        {
            widthFairway: 20,
            lengthFairway: 10,
            fairwayOffsetX: 0,
            fairwayOffsetY: 1.5,
            fairwayOffsetZ: -42.5,
            fairwayTilt_x: Math.PI / 10,
        },
        {
            widthFairway: 20,
            lengthFairway: 8,
            fairwayOffsetX: 0,
            fairwayOffsetY: 3,
            fairwayOffsetZ: -51.1,
        },
        {
            widthFairway: 8,
            lengthFairway: 68,
            fairwayOffsetX: -28.5,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -4,
        },
        {
            widthFairway: 8,
            lengthFairway: 68,
            fairwayOffsetX: 28.5,
            fairwayOffsetY: 0,
            fairwayOffsetZ: -4,
        },
    ],
    walls: [
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: 14, y: -1, z: -17.5 },
        },
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: -14, y: -1, z: -17.5 },
        },
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: -14, y: -1, z: 9.5 },
        },
        {
            width: 3,
            height: 1,
            length: 20,
            position: { x: 14, y: -1, z: 9.5 },
        },
        {
            width: 3,
            height: 1,
            length: 28,
            position: { x: 24, y: -1, z: -4 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 3,
            height: 1,
            length: 28,
            position: { x: -24, y: -1, z: -4 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 1.2,
            height: 1,
            length: 10,
            position: { x: -4.5, y: 2.4, z: 6 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: Math.PI / 10,
            texturePath: '/assets/bricktexture.jpg'
        },
        {
            width: 1.2,
            height: 1,
            length: 10,
            position: { x: 4.5, y: 2.4, z: 6 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: Math.PI / 10,
            texturePath: '/assets/bricktexture.jpg'
        },
        {
            width: 1.2,
            height: 1,
            length: 10,
            position: { x: -4.5, y: 2.4, z: -12.5 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: -Math.PI / 10,
            texturePath: '/assets/bricktexture.jpg'
        },
        {
            width: 1.2,
            height: 1,
            length: 10,
            position: { x: 4.5, y: 2.4, z: -12.5 },
            rotation: { y: Math.PI / 2 },
            wallTilt_x: -Math.PI / 10,
            texturePath: '/assets/bricktexture.jpg'
        },
        {
            width: 1,
            height: 1,
            length: 10,
            position: { x: 4.5, y: 4, z: -3 },
            rotation: { y: Math.PI / 2 },
            texturePath: '/assets/bricktexture.jpg'
        },
        {
            width: 1,
            height: 1,
            length: 10,
            position: { x: -4.5, y: 4, z: -3 },
            rotation: { y: Math.PI / 2 },
            texturePath: '/assets/bricktexture.jpg'
        },
        
        {
            width: 3,
            height: 1,
            length: 67.5,
            position: { x: 32.5, y: 1.5, z: -3.75 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 3,
            height: 1,
            length: 67.5,
            position: { x: -32.5, y: 1.5, z: -3.75 },
            rotation: { y: Math.PI / 2 },
        },
        {
            width: 3,
            height: 1,
            length: 23,
            position: { x: -21.5, y: 1.5, z: -38 },
        },
        {
            width: 3,
            height: 1,
            length: 23,
            position: { x: 21.5, y: 1.5, z: -38 },
        },

    ],
    waterhazards: [
        {
            width: 50,       
            height: 35,       
            position: {  x: 0, y: -1, z: -5 }
        }, 

    ], 

    ballPosition: { x: 0, y: 1.5, z: 25 },
    holePosition: { x: 0, y: 3.5, z: -50 },
    flagtexturepath: '/assets/flag9.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
};
const completedCourseConfig = {
    fairways: [
        {
            widthFairway: 30,
            lengthFairway: 30,
            fairwayOffsetX: 0,
            fairwayOffsetY: 0,
            fairwayOffsetZ: 15,
        },
    ],
    walls: [
    {
        width: 3,
        height: 1,
        length: 30,
        position: { x: -15.5, y: 1.5, z: 15 },
        rotation: { y: Math.PI / 2 },
    },
    {
        width: 3,
        height: 1,
        length: 30,
        position: { x: 15.5, y: 1.5, z: 15 },
        rotation: { y: Math.PI / 2 },
    },
    {
        width: 3,
        height: 1,
        length: 30,
        position: { x: 0, y: 1.5, z: 0 },
    },
    {
        width: 3,
        height: 1,
        length: 30,
        position: { x: 0, y: 1.5, z: 30 },
    },
    ],
    holePosition: { x: 0, y: -15, z: -20 },
    ballPosition: { x: 0, y: 1.5, z: 15 },
    flagtexturepath: '/assets/flag8.jpg',
    arrowDirection: new THREE.Vector3(1, 0, 0),
    arrowOrigin: new THREE.Vector3(0, 1, 20), 
    arrowLength: 1,
    arrowVisible: false,
}