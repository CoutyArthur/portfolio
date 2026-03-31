// import * as THREE from 'three';

// const container = document.getElementById('scene-container');
// const w = container.clientWidth;
// const h = container.clientHeight;

// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
// camera.position.set(2, 2, 2);
// camera.lookAt(0, 0, 0);

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(w, h);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// container.appendChild(renderer.domElement);

// const ambient = new THREE.AmbientLight(0xffffff, 1);
// const dirLight = new THREE.DirectionalLight(0xffffff, 2);
// dirLight.position.set(5, 5, 5);
// scene.add(ambient, dirLight);

// const geo = new THREE.BoxGeometry();
// const mat = new THREE.MeshStandardMaterial({ color: 0x4488ff });
// const mesh = new THREE.Mesh(geo, mat);
// scene.add(mesh);

// window.addEventListener('resize', () => {
//     const w = container.clientWidth;
//     const h = container.clientHeight;
//     camera.aspect = w / h;
//     camera.updateProjectionMatrix();
//     renderer.setSize(w, h);
// });

// function animate() {
//     requestAnimationFrame(animate);
//     mesh.rotation.x += 0.01;
//     mesh.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }
// animate();

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
camera.position.set(0, 0, 5);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2.5;
controls.maxDistance = 10;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// --- Icosahedron principal ---
const geoSphere = new THREE.IcosahedronGeometry(1.4, 4);
const matWire = new THREE.MeshStandardMaterial({
  color: 0x4488ff,
  emissive: 0x112244,
  metalness: 0.8,
  roughness: 0.2,
  wireframe: false,
});
const meshSphere = new THREE.Mesh(geoSphere, matWire);
scene.add(meshSphere);

// Wireframe overlay
const geoWire = new THREE.IcosahedronGeometry(1.42, 2);
const matWireframe = new THREE.MeshBasicMaterial({
  color: 0x88aaff,
  wireframe: true,
  transparent: true,
  opacity: 0.18,
});
const meshWire = new THREE.Mesh(geoWire, matWireframe);
scene.add(meshWire);

// Anneau externe
const geoRing = new THREE.TorusGeometry(2.1, 0.008, 8, 180);
const matRing = new THREE.MeshBasicMaterial({ color: 0x3366cc, transparent: true, opacity: 0.5 });
const ring1 = new THREE.Mesh(geoRing, matRing);
ring1.rotation.x = Math.PI / 2.5;
scene.add(ring1);

const ring2 = ring1.clone();
ring2.rotation.x = -Math.PI / 3;
ring2.rotation.z = Math.PI / 6;
scene.add(ring2);

// --- Particules ---
const COUNT = 1800;
const positions = new Float32Array(COUNT * 3);
const sizes = new Float32Array(COUNT);
for (let i = 0; i < COUNT; i++) {
  const r = 2.8 + Math.random() * 4.5;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
  positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  positions[i * 3 + 2] = r * Math.cos(phi);
  sizes[i] = Math.random() * 2.5 + 0.5;
}
const geoParticles = new THREE.BufferGeometry();
geoParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geoParticles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const matParticles = new THREE.PointsMaterial({
  color: 0x7799ff,
  size: 0.04,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.7,
});
const particles = new THREE.Points(geoParticles, matParticles);
scene.add(particles);

// --- Lumières ---
const ambientLight = new THREE.AmbientLight(0x111133, 2);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x4466ff, 60, 20);
pointLight1.position.set(4, 4, 4);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ddcc, 30, 15);
pointLight2.position.set(-4, -2, -3);
scene.add(pointLight2);

// --- Resize ---
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// --- Animation ---
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  meshSphere.rotation.y = t * 0.12;
  meshSphere.rotation.x = Math.sin(t * 0.18) * 0.25;
  meshWire.rotation.y = -t * 0.08;

  ring1.rotation.z = t * 0.15;
  ring2.rotation.y = t * 0.20;

  particles.rotation.y = t * 0.025;
  particles.rotation.x = Math.sin(t * 0.05) * 0.08;

  // pulsation légère
  const pulse = 1 + Math.sin(t * 1.8) * 0.015;
  meshSphere.scale.setScalar(pulse);

  controls.update();
  renderer.render(scene, camera);
}
animate();