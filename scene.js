import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('scene-container');

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

// --- Scene & Camera ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0f, 0.06);

const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 1, 5);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;

// --- Chargement du modèle GLTF ---

const loader = new GLTFLoader();
loader.load('./poulpe/poulpi.glb', (gltf) => {
    let octopus = gltf.scene;
    octopus.scale.setScalar(0.1); 
    octopus.rotation.set(0, -Math.PI/2, 0);
    octopus.position.set(octopus.position.x, octopus.position.y - 200, octopus.position.z)

    // Centrer le modèle automatiquement
    const box = new THREE.Box3().setFromObject(octopus);
    const center = box.getCenter(new THREE.Vector3());
    octopus.position.sub(center); 
    octopus.position.set(octopus.position.x, octopus.position.y + 0.21, octopus.position.z)

    scene.add(octopus);
}, undefined, (error) => {
    console.error("Erreur lors du chargement :", error);
});



// --- Icosahedron principal ---
// const geoSphere = new THREE.IcosahedronGeometry(1.4, 4);
// const matWire = new THREE.MeshStandardMaterial({
//   color: 0x4488ff,
//   emissive: 0x112244,
//   metalness: 0.8,
//   roughness: 0.2,
//   wireframe: false,
// });
// const meshSphere = new THREE.Mesh(geoSphere, matWire);
// scene.add(meshSphere);

// // Wireframe overlay
// const geoWire = new THREE.IcosahedronGeometry(1.42, 2);
// const matWireframe = new THREE.MeshBasicMaterial({
//   color: 0x88aaff,
//   wireframe: true,
//   transparent: true,
//   opacity: 0.18,
// });
// const meshWire = new THREE.Mesh(geoWire, matWireframe);
// scene.add(meshWire);

// // Anneau externe
// const geoRing = new THREE.TorusGeometry(2.1, 0.008, 8, 180);
// const matRing = new THREE.MeshBasicMaterial({ color: 0x3366cc, transparent: true, opacity: 0.5 });
// const ring1 = new THREE.Mesh(geoRing, matRing);
// ring1.rotation.x = Math.PI / 2.5;
// scene.add(ring1);

// const ring2 = ring1.clone();
// ring2.rotation.x = -Math.PI / 3;
// ring2.rotation.z = Math.PI / 6;
// scene.add(ring2);

// // --- Particules ---
// const COUNT = 1800;
// const positions = new Float32Array(COUNT * 3);
// const sizes = new Float32Array(COUNT);
// for (let i = 0; i < COUNT; i++) {
//   const r = 2.8 + Math.random() * 4.5;
//   const theta = Math.random() * Math.PI * 2;
//   const phi = Math.acos(2 * Math.random() - 1);
//   positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
//   positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
//   positions[i * 3 + 2] = r * Math.cos(phi);
//   sizes[i] = Math.random() * 2.5 + 0.5;
// }
// const geoParticles = new THREE.BufferGeometry();
// geoParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
// geoParticles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

// const matParticles = new THREE.PointsMaterial({
//   color: 0x7799ff,
//   size: 0.04,
//   sizeAttenuation: true,
//   transparent: true,
//   opacity: 0.7,
// });
// const particles = new THREE.Points(geoParticles, matParticles);
// scene.add(particles);

//grille
const gridHelper = new THREE.GridHelper( 100, 100 );
gridHelper.position.y = -1;
scene.add( gridHelper );

// --- Lumières ---
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 40);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xFFFFFF, 60, 2);
pointLight1.position.set(0, 1, 2);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xFFFFFF, 60, 2);
pointLight2.position.set(0, 1, -3);
scene.add(pointLight2);


// --- Resize ---
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// //--- Animation ---
const clock = new THREE.Clock();
function animate() {
   requestAnimationFrame(animate);
   const t = clock.getElapsedTime();

//   meshSphere.rotation.y = t * 0.12;
//   meshSphere.rotation.x = Math.sin(t * 0.18) * 0.25;
//   meshWire.rotation.y = -t * 0.08;

//   ring1.rotation.z = t * 0.15;
//   ring2.rotation.y = t * 0.20;

//   particles.rotation.y = t * 0.025;
//   particles.rotation.x = Math.sin(t * 0.05) * 0.08;

//   pulsation légère
//   const pulse = 1 + Math.sin(t * 1.8) * 0.015;
//   meshSphere.scale.setScalar(pulse);

//   
    controls.update();
    renderer.render(scene, camera);
}
 animate();
