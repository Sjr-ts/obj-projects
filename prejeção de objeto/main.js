import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  // --- Skybox com CubeTextureLoader ---
  const cubeLoader = new THREE.CubeTextureLoader();
  const skybox = cubeLoader.load([
    'pos-x.jpg', // direita
    'neg-x.jpg', // esquerda
    'pos-y.jpg', // cima
    'neg-y.jpg', // baixo
    'pos-z.jpg', // frente
    'neg-z.jpg'  // trás
  ]);
  scene.background = skybox;

  // --- Câmera ---
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // --- Controles Orbitais ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // --- Faca do CS:GO (simplificada) ---
  const bladeGeometry = new THREE.BoxGeometry(2, 0.1, 0.3); // Lâmina
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Cor da lâmina (prata)
  const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
  blade.position.set(0, 0.5, 0);
  scene.add(blade);

  // --- Cabo da faca ---
  const handleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 12); // Cabo
  const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x4b2c20 }); // Cor do cabo (marrom)
  const handle = new THREE.Mesh(handleGeometry, handleMaterial);
  handle.position.set(0, -0.25, 0);
  scene.add(handle);

  // --- Luz ---
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // --- Loop de renderização ---
  function render() {
    blade.rotation.y += 0.01;
    handle.rotation.y += 0.01; // Fazendo o cabo girar para adicionar movimento
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
