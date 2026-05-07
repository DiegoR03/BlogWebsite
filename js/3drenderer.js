import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const satellitePivot = new THREE.Object3D();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const sunLight = new THREE.DirectionalLight(0xffffff, 2);

const loader = new GLTFLoader();

const infoElement = document.getElementById('info');

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let earthModel;
let satelliteModel;

loader.load('/assets/models/earth.glb', function (gltf) {
    earthModel = gltf.scene;
    
    if (infoElement) infoElement.innerHTML = 'Gebruik je muis om de aarde te draaien';

    sunLight.position.set(5, 1, 5);
    camera.position.set(0, 100, 250);

    scene.add(sunLight, ambientLight, satellitePivot, earthModel);

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

loader.load('/assets/models/satellite.glb', function (gltf) {
    satelliteModel = gltf.scene;
    satelliteModel.position.set(105, 0, 0); 
    satelliteModel.scale.set(0.15, 0.15, 0.15); 
    
    satellitePivot.add(satelliteModel);
});

function animate() {
    requestAnimationFrame(animate);

    if (earthModel) {
        earthModel.rotation.y += 0.001;
    }

    if (satellitePivot) {
        satellitePivot.rotation.y += 0.0025;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

animate(); 

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(renderer.domElement);
});