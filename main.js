import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { OrbitControls } from 'OrbitControl';
import { ARButton } from 'ARButton';

/* Declaration */

import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
let camera, scene, renderer;
let controller;

function init() {

		const container = document.createElement( 'div' );
		document.body.appendChild( container );

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 3 );
		light.position.set( 0.5, 1, 0.25 );
		scene.add( light );

		renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.xr.enabled = true;
		container.appendChild( renderer.domElement );


		document.body.appendChild( ARButton.createButton( renderer ) );

		const loader = new GLTFLoader();

		loader.load( 'Flamingo.glb', function ( gltf ) {

			const mesh = gltf.scene.children[ 0 ];

			const s = 0.005;
			mesh.scale.set( s, s, s );
        		mesh.rotation.y = Math.random() * 2 * Math.PI;
       			mesh.position.x = Math.random() * 100;

			mesh.castShadow = true;
			mesh.receiveShadow = true;

			scene.add( mesh );

			const mixer = new THREE.AnimationMixer( mesh );
			mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
		} );

	function onSelect() {

		mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
		mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
		scene.add( mesh );
	}

	controller = renderer.xr.getController( 0 );
	controller.addEventListener( 'select', onSelect );
	scene.add( controller );

	window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

			//

function animate() {
	renderer.setAnimationLoop( render );
}

function render() {
	renderer.render( scene, camera );
}
