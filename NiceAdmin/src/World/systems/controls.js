import { OrbitControls } from "three/addons/controls/OrbitControls";

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;
  controls.enablePan = false;

  controls.minDistance = 2;
  controls.maxDistance = 10;

  controls.maxPolarAngle = Math.PI / 2.1;
  // controls.enabled = false;

  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
