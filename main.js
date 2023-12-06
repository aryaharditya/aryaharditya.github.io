import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControl';
import { ARButton } from 'ARButton';

/* Declaration */
let container;
let camera, scene, renderer;
let controller1, controller2;
let raycaster;
let mixer;
let clock;
const intersected = [];
const tempMatrix = new THREE.Matrix4();

init();
animate();

function init() {
    /* Initialize */
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    clock = new THREE.Clock();
    const loader = new GLTFLoader();

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    /* camera control */
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.set(0, 0, -2);
    scene.add(camera);

    const controls = new OrbitControls(camera, container);
    controls.minDistance = 0;
    controls.maxDistance = 8;

    /* light */
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 6, 0);
    scene.add(light);

    /* load model */
    loader.load('Flamingo.glb', function (gltf) {
        const flamingo = gltf.scene;

        for(let i = 0; i < 5; i++) {
        flamingo.scale.set(0.005, 0.005, 0.005);
        flamingo.rotation.y = Math.random() * 2 * Math.PI;
        flamingo.position.x = Math.random() * i * 100;

        scene.add(flamingo);

        mixer = new THREE.AnimationMixer(flamingo);
        mixer.clipAction(gltf.animations[i]).play();
        }
        


    });

    /* render objects */
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(sizes.width, sizes.height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    document.body.appendChild(ARButton.createButton(renderer));

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);

}

/* draw objects */
function animate() {

    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixer.update(delta);
    renderer.setAnimationLoop(render);

}

function render() {

    renderer.render(scene, camera);

}

