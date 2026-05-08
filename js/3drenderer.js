// MARK: Imports
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

// MARK: Const and lets
const scene = new THREE.Scene();
const loader = new GLTFLoader();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const moonPivot = new THREE.Object3D();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
const sunLight = new THREE.DirectionalLight(0xffffff, 8);
const textureLoader = new THREE.TextureLoader();
const textureFlare0 = textureLoader.load('assets/img/lensflare0.png');
const textureFlare1 = textureLoader.load('assets/img/lensflare1.png');

const lensflare = new Lensflare();

const infoElement = document.getElementById('info');

const controls = new OrbitControls(camera, renderer.domElement);

const minDistance = 110;
const maxDistance = 450;
const zoomSensitivity = 0.5;

const satellitePivots = [];

let earthModel;
let moonModel;
let satelliteModel;
let targetDistance = 250;
let focusedSatellite = null;

// MARK: Loaders
loader.load('/assets/models/earth.glb', function (gltf) {
    earthModel = gltf.scene;
    
    sunLight.position.set(500, 100, 500);
    camera.position.set(0, 100, 250);

    scene.add(sunLight, ambientLight, moonPivot, earthModel);

    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, sunLight.color, THREE.AdditiveBlending));
    lensflare.addElement(new LensflareElement(textureFlare1, 60, 0.6, sunLight.color, THREE.AdditiveBlending));
    lensflare.addElement(new LensflareElement(textureFlare1, 70, 0.7, sunLight.color, THREE.AdditiveBlending));
    lensflare.addElement(new LensflareElement(textureFlare1, 120, 0.9, sunLight.color, THREE.AdditiveBlending));
    lensflare.addElement(new LensflareElement(textureFlare1, 70, 1, sunLight.color, THREE.AdditiveBlending));

    sunLight.add(lensflare);
});

loader.load('/assets/models/satellite.glb', 
    function (gltf) {
        satelliteModel = gltf.scene;
        satelliteModel.scale.set(0.15, 0.15, 0.15); 

        if (window.pendingSatellites > 0) {
            for (let i = 0; i < window.pendingSatellites; i++) {
                createSatelliteInstance();
            }
            window.pendingSatellites = 0;
        }
    }
);

loader.load('/assets/models/moon.glb', function (gltf) {
    moonModel = gltf.scene;
    moonModel.position.set(600, 0, 0); 
    moonModel.scale.set(15, 15, 15);
    
    moonPivot.add(moonModel);
});

// MARK: Function
export function createSatelliteInstance() {
    if (!satelliteModel) return;

    const pivot = new THREE.Object3D();
    const modelClone = satelliteModel.clone();
    const distance = 105; 
    modelClone.position.set(distance, 0, 0);

    pivot.rotation.z = (Math.random() - 0.5) * Math.PI;
    pivot.rotation.x = (Math.random() - 0.5) * Math.PI;
    pivot.rotation.y = Math.random() * Math.PI * 2; 
    
    pivot.add(modelClone);
    scene.add(pivot);
    satellitePivots.push(pivot); 
}

function animate() {
    requestAnimationFrame(animate);

    if (earthModel) earthModel.rotation.y += 0.0005;
    if (moonPivot) moonPivot.rotation.y += 0.001;
    if (moonModel) moonModel.rotation.y -= 0.001;

    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    satellitePivots.forEach((pivot, index) => {
        const direction = (index % 2 === 0) ? 1 : -1;
        const speed = 0.001 + (index * 0.0001);
        pivot.rotation.y += speed * direction;
    });

    if (focusedSatellite) {
        const satModel = focusedSatellite.children[0];
        const satPosition = new THREE.Vector3();
        satModel.getWorldPosition(satPosition);

        const cameraOffset = satPosition.clone().normalize().multiplyScalar(3); 
        const newCameraPos = satPosition.clone().add(cameraOffset);

        const sideOffset = new THREE.Vector3().crossVectors(cameraOffset, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(-1.5);
        newCameraPos.add(sideOffset);

        camera.position.lerp(newCameraPos, 0.1);
        camera.lookAt(0, 0, 0);

        controls.enabled = false; 
    } else {
        controls.enabled = true;
        controls.update(); 

        const currentDistance = camera.position.length();
        
        if (Math.abs(currentDistance - targetDistance) > 0.1) {
            const newDistance = THREE.MathUtils.lerp(currentDistance, targetDistance, 0.05);
            camera.position.setLength(newDistance);
        }
    }
    renderer.render(scene, camera);
}

animate(); 

window.createSatelliteInstance = createSatelliteInstance;

window.focusOnSatellite = (index) => {
    if (index === -1) {
        focusedSatellite = null;
        targetDistance = 250;
    } else if (satellitePivots[index]) {
        focusedSatellite = satellitePivots[index];
    }
};

// MARK: Event listeners
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(renderer.domElement);
});

window.addEventListener('wheel', (event) => {
    const delta = Math.sign(event.deltaY); 
    targetDistance += delta * 15;
    targetDistance = Math.max(minDistance, Math.min(maxDistance, targetDistance));
    
    console.log("Nieuwe afstand doel:", targetDistance); // Check je console (F12)
}, { passive: true });