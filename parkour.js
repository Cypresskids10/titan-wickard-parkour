import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
//let sphereGeometry;
//let torus1Geometry;
//let sphere;
//let torus1;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let camera, scene, renderer, controls;

init()
animate()
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 10;

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function () {
        controls.lock();
    });
    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });
    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    scene.add(controls.getObject());

    const onKeyDown = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = true;
                break;
            case 'KeyS':
                moveBackward = true;
                break;
            case 'KeyA':
                moveLeft = true;
                break;
            case 'KeyD':
                moveRight = true;
                break;
            case 'Space':
                if (canJump === true) velocity.y += 350;
                canJump = false;
                break;
        }
    }

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'KeyW':
                moveForward = false;
                break;
            case 'KeyS':
                moveBackward = false;
                break;
            case 'KeyA':
                moveLeft = false;
                break;
            case 'KeyD':
                moveRight = false;
                break;
        }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    const ambiantLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambiantLight)

    const light = new THREE.PointLight(0xfffff, 10000)
    light.position.set(0, 50, 0); //X,Y,Z
    scene.add(light);



    const PlaneGeometry = new THREE.PlaneGeometry(10, 10, 64, 64)
    const PlaneMaterial = new THREE.MeshLambertMaterial({ color: 0xBC7539 })
    const plane = new THREE.Mesh(PlaneGeometry, PlaneMaterial)
    plane.rotateX(-1.57)
    scene.add(plane)
    objects.push(plane)

    const sphereGeometry = new THREE.SphereGeometry(2, 10, 10)
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(sphere)

    const torusGeometry = new THREE.TorusGeometry(1, 0.3, 64, 64)
    const torusMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    scene.add(torus)
    objects.push(torus)

    const geometry2 = new THREE.BoxGeometry(1, 1, 1)
    const material2 = new THREE.MeshLambertMaterial({ color: 0xff0000 })
    const cube2 = new THREE.Mesh(geometry2, material2)
    scene.add(cube2)
    objects.push(cube2)

    const torus1Geometry = new THREE.TorusGeometry(3.2, 0.3, 64, 64)
    const torus1Material = new THREE.MeshLambertMaterial({ color: 0xffffff })
    const torus1 = new THREE.Mesh(torus1Geometry, torus1Material)
    scene.add(torus1)


    sphere.position.y = 50
    torus1.position.y = 50
    torus.position.x = 3
    torus.position.y = 3
    cube2.position.y = 5
    cube2.position.x = -2

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

// sphereGeometry.scale(1.001, 1.001, 1.001)
// torus1Geometry.scale(1.0001, 1.0001, 1.0001)
// sphere.rotation.x += 0.5
// torus1.rotation.y += 0.5
function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();

    if (controls.isLocked === true) {
        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        const intersections = raycaster.intersectObjects(objects, false);
        const onObject = intersections.length > 0;
        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= 9.8 * 100.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject === true) {
            velocity.y = Math.max(0, velocity.y);
            canJump = true;
        }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta);
        if (controls.getObject().position.y < 10) {
            velocity.y = 0;
            controls.getObject().position.y = 10;
            canJump = true
        }
    }
    prevTime = time;
    renderer.render(scene, camera);
}