import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const cubeLoader = new THREE.CubeTextureLoader();
  const skybox = cubeLoader.load([
    'cube_right.png', // +X
    'cube_left.png',  // -X
    'cube_up.png',    // +Y
    'cube_down.png',  // -Y
    'cube_back.png',  // +Z
    'cube_front.png'  // -Z
  ]);
  scene.background = skybox;

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);
  scene.add(new THREE.AmbientLight(0x404040));

  const loader = new OBJLoader();
  loader.load(
    'Tower.obj', 
    (obj) => {
      obj.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            metalness: 0.3,
            roughness: 0.7,
          });
        }
      });

      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());
      obj.position.sub(center);
      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 5 / size;
      obj.scale.setScalar(scale);

      scene.add(obj);
    },
    (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% carregado'),
    (err) => console.error('Erro ao carregar Tower.obj:', err)
  );

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

main();
