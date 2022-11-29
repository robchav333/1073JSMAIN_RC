// Art 109 Three.js Demo Site
// client7.js
// A three.js scene which uses planes and texture loading to generate a scene with images which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.

// Import required source code
// Import three.js core
import * as THREE from "../build/three.module.js";
// Import pointer lock controls
import {
  PointerLockControls
} from "../src/PointerLockControls.js";

import {
  GLTFLoader
} from "../src/GLTFLoader.js";

import {  FontLoader } from "../src/FontLoader.js"
//
// import {  Water2 } from "../src/Water2.js";



// Establish variables
let camera, scene, renderer, controls, material;

const objects = [];
let raycaster;
// let water2;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;


let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

// Initialization and animation function calls
init();
animate();

// Initialize the scene
function init() {
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Define basic scene parameters
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);
  scene.fog = new THREE.Fog(0xffffff, 100, 750);

  // Define scene lighting
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 1);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(30, 500, 1, 5);
  floorGeometry.rotateX(-Math.PI / 2);

  // Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.9 + 0.1, 0.95, Math.random() * 0.25 + 0.75);
    colorsFloor.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);





  // First Image (red and purple glitch map)
  // Load image as texture
  // const texture = new THREE.TextureLoader().load('../../assets/glitch_map.jpg');
  // // Immediately use the texture for material creation
  // const material = new THREE.MeshBasicMaterial({
  //   map: texture,
  //   side: THREE.DoubleSide
  // });
  // Create plane geometry
  // const geometry = new THREE.PlaneGeometry(32, 16);
  // // Apply image texture to plane geometry
  // const plane = new THREE.Mesh(geometry, material);
  // // Position plane geometry
  // plane.position.set(0, 15, -15);
  // // Place plane geometry
  // scene.add(plane);

  // Second Image (Text with image and white background)
  // Load image as texture
  const texture2 = new THREE.TextureLoader().load('/assets/colorfulidiom.jpg');

  // immediately use the texture for material creation
  const material2 = new THREE.MeshBasicMaterial({
    map: texture2,
    side: THREE.DoubleSide
  });
  // Create plane geometry
  const geometry2 = new THREE.PlaneGeometry(200, 100);
  // Apply image texture to plane geometry
  const plane2 = new THREE.Mesh(geometry2, material2);
  // Position plane geometry
  plane2.position.set(0, 50, -260);
  // Place plane geometry
  scene.add(plane2);

  const loader4 = new FontLoader();
  loader4.load('/assets/helvetiker_regular.typeface.json', function(font) {
    // Define font color
    const color = 0x2E5999;
    // Define font material
    const matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });
    // Generate and place left side text
    const message = "Static Model";
    const shapes = font.generateShapes(message, .5);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    const text = new THREE.Mesh(geometry, matDark);
    text.position.set(-4, -4, 0);
    scene.add(text);

    // Generate and place right side text
    const message2 = "Preanimated Model";
    const shapes2 = font.generateShapes(message2, .5);
    const geometry2 = new THREE.ShapeGeometry(shapes2);
    geometry2.computeBoundingBox();
    const xMid2 = -0.5 * (geometry2.boundingBox.max.x - geometry2.boundingBox.min.x);
    geometry2.translate(xMid2, 0, 0);
    const text2 = new THREE.Mesh(geometry2, matDark);
    text2.position.set(4, -4, 0);
    scene.add(text2);
  });

  // GLtf MODEL
  var mesh;
  var mesh2;
  var mesh3;
  // Load GLTF model, add material, and add it to the scene
  const loader = new GLTFLoader().load(
    // "../../assets/ship222.glb", // comment this line out and un comment the line below to swithc models
    "/assets/BIRDLINED.glb",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          //child.material = newMaterial;
        }
      });

      mesh = gltf.scene;
      mesh = gltf.scene;
      mesh.position.set(0, -10, -100);
      mesh.rotation.set(0, 0, 0);
      mesh.scale.set(5, 5, 5);

      // <-- change this to (1, 1, 1) for photogrammetery model
      // Add model to scene
      scene.add(mesh);


    }

    );

    const loader2 = new GLTFLoader().load(
      // "../../assets/ship222.glb", // comment this line out and un comment the line below to swithc models
      "/assets/FISHWEB.glb",
      function(gltf) {
        // Scan loaded model for mesh and apply defined material if mesh is present
        gltf.scene.traverse(function(child) {
          if (child.isMesh) {
            //child.material = newMaterial;
          }
        });

        mesh2 = gltf.scene;
        mesh2 = gltf.scene;
        mesh2.position.set(0, 5, -130);
        mesh2.rotation.set(0, 45, 0);
        mesh2.scale.set(5, 5, 5);

        // <-- change this to (1, 1, 1) for photogrammetery model
        // Add model to scene
        scene.add(mesh2);


      }

      );

      const loader3 = new GLTFLoader().load(
        // "../../assets/ship222.glb", // comment this line out and un comment the line below to swithc models
        "/assets/thearrowglb.glb",
        function(gltf) {
          // Scan loaded model for mesh and apply defined material if mesh is present
          gltf.scene.traverse(function(child) {
            if (child.isMesh) {
              //child.material = newMaterial;
            }
          });

          mesh3 = gltf.scene;
          mesh3 = gltf.scene;
          mesh3.position.set(-20, 35, -20);
          mesh3.rotation.set(-5, 0, 0);
          mesh3.scale.set(5, 5, 5);

          // <-- change this to (1, 1, 1) for photogrammetery model
          // Add model to scene
          scene.add(mesh3);


        }

        );


    //
    // const loader = new THREE.ImageLoader();
    //
    //
    // loader.load(
    //   // resource URL
    //   '../../assets/fig05.jpg',
    //
    //   // onLoad callback
    //   function(image) {
    //     // use the image, e.g. draw part of it on a canvas
    //     const canvas = document.createElement('canvas');
    //     const context = canvas.getContext('2d');
    //     context.drawImage(image, 100, 100);
    //   },
    //
    //   // onProgress callback currently not supported
    //   undefined,
    //
    //   // onError callback
    //   function() {
    //     console.error('An error happened.');
    //   }
    // );



    // Define Rendered and html document placement
    renderer = new THREE.WebGLRenderer({
      antialias: true
    }); renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(window.innerWidth, window.innerHeight); document.body.appendChild(renderer.domElement);

    // Listen for window resizing
    window.addEventListener("resize", onWindowResize);
  }

  // Window resizing function
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Animation function
  function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();

    // Check for controls being activated (locked) and animate scene according to controls
    if (controls.isLocked === true) {
      raycaster.ray.origin.copy(controls.getObject().position);
      raycaster.ray.origin.y -= 10;

      const intersections = raycaster.intersectObjects(objects, false);

      const onObject = intersections.length > 0;

      const delta = (time - prevTime) / 1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize(); // this ensures consistent movements in all directions

      if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

      if (onObject === true) {
        velocity.y = Math.max(0, velocity.y);
        canJump = true;
      }

      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);

      controls.getObject().position.y += velocity.y * delta; // new behavior

      if (controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;

        canJump = true;
      }
    }

    prevTime = time;

    renderer.render(scene, camera);
  }

  function render() {

      const time = performance.now() * 0.001;

      mesh.position.y = Math.sin( time ) * 20 + 5;
      mesh.rotation.x = time * 0.5;
      mesh.rotation.z = time * 0.51;

      water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

      renderer.render( scene, camera );

    }
