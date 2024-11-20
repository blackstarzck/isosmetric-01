import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

// ----- 주제: glb 파일 불러오기

export default function example() {
	// Renderer
	const canvas = document.querySelector('#three-canvas');
	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

	// Scene
	const scene = new THREE.Scene();

	// Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	camera.position.y = 1.5;
	camera.position.z = 4;
	scene.add(camera);

	// Light
	const ambientLight = new THREE.AmbientLight('white', 0.5);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight('white', 1);
	directionalLight.position.x = 1;
	directionalLight.position.z = 2;
	scene.add(directionalLight);

	// Controls
	const controls = new OrbitControls(camera, renderer.domElement);

	// Animation
	let mixer;

	// gltf loader
	const dracoLoader = new DRACOLoader()
		.setDecoderPath( '/examples/jsm/libs/draco/' );
	const ktx2Loader = new KTX2Loader();
	const gltfLoader = new GLTFLoader()
		.setCrossOrigin('anonymous')
		.setDRACOLoader(dracoLoader)
		.setKTX2Loader(ktx2Loader.detectSupport(renderer))
		.setMeshoptDecoder(MeshoptDecoder);
	
	gltfLoader.load(
		'./models/isometric-room-01.glb',
		gltf => {
			console.log(gltf)
			const model = gltf.scene;

			scene.add(model);
			mixer = new THREE.AnimationMixer(model);
			const action = mixer.clipAction(gltf.animations[0]);

			action.play();
			action.clampWhenFinished = true;
			action.loop = THREE.LoopOnce;
		}
	)



	// 그리기
	const clock = new THREE.Clock();

	function draw() {
		const delta = clock.getDelta();

		if (mixer) mixer.update(delta);

		renderer.render(scene, camera);
		renderer.setAnimationLoop(draw);
	}

	function setSize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.render(scene, camera);
	}

	// 이벤트
	window.addEventListener('resize', setSize);

	draw();
}
