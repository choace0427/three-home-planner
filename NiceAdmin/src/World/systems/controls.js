import { OrbitControls } from "three/addons/controls/OrbitControls";
import * as THREE from "three";

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;
  controls.enablePan = true;
  controls.panSpeed = 1.2;

  controls.minDistance = 2;
  controls.maxDistance = 100;

  controls.target.clamp(
    new THREE.Vector3(-2, -2, -2),
    new THREE.Vector3(2, 2, 2)
  );

  controls.maxPolarAngle = Math.PI / 2.1;
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
