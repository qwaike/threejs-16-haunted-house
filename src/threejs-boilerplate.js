// Import necessary libraries
import * as THREE from "../node_modules/three/build/three.module.js"

// Define global variables
let camera, scene, renderer, object;

function init() {
  // Create a new scene
  scene = new THREE.Scene();

  // Create a new camera and set its position
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // Create a new renderer and set its size
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create a new object and add it to the scene
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  object = new THREE.Mesh(geometry, material);
  scene.add(object);

  // Add event listeners for keyboard and mouse controls
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('mousemove', onMouseMove);
}

function animate() {
  // Request animation frame
  requestAnimationFrame(animate);

  // Rotate the object
  object.rotation.x += 0.01;
  object.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}

function onKeyDown(event) {
  // Handle keydown events
  switch (event.keyCode) {
    case 87: // W
      object.position.z -= 0.1;
      break;
    case 83: // S
      object.position.z += 0.1;
      break;
    case 65: // A
      object.position.x -= 0.1;
      break;
    case 68: // D
      object.position.x += 0.1;
      break;
  }
}

function onKeyUp(event) {
  // Handle keyup events
  switch (event.keyCode) {
    case 87: // W
      object.position.z -= 0.1;
      break;
    case 83: // S
      object.position.z += 0.1;
      break;
    case 65: // A
      object.position.x -= 0.1;
      break;
    case 68: // D
      object.position.x += 0.1;
      break;
  }
}

function onMouseMove(event) {
  // Handle mousemove events
  const { movementX, movementY } = event;
  object.rotation.x += movementY * 0.01;
  object.rotation.y += movementX * 0.01;
}

// Call the init and animate functions
init();
animate();