import * as THREE from 'three';

const container = document.getElementById('scene-container');
const w = container.clientWidth;
const h = container.clientHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
camera.position.set(2, 2, 2);
camera.lookAt(0, 0, 0); // ✅ pointe vers le cube

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// ✅ Lumières
const ambient = new THREE.AmbientLight(0xffffff, 1);
const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
scene.add(ambient, dirLight);

const geo = new THREE.BoxGeometry();
const mat = new THREE.MeshStandardMaterial({ color: 0x4488ff });
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

// ✅ Resize
window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});

function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01; // ✅ animation
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();