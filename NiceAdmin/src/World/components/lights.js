import * as THREE from "three";

function createLights() {
  const ambientLight = new THREE.HemisphereLight("white", "grey", 3);

  const mainLight = new THREE.DirectionalLight("white", 1);
  mainLight.position.set(2, 10, 2);
  // mainLight.shadow.camera.left = -5000;
  // mainLight.shadow.camera.right = 5000;
  // mainLight.shadow.camera.top = 5000;
  // mainLight.shadow.camera.bottom = -5000;
  // mainLight.shadow.mapSize.width = 1000;
  // mainLight.shadow.mapSize.height = 1000;
  // mainLight.shadow.camera.near = 0.5; // default
  // mainLight.shadow.camera.far = 20; // default
  // mainLight.shadow.radius = 2;
  // mainLight.shadow.blurSamples = 3;
  // mainLight.castShadow = true;

  // const cameraHelper = new THREE.CameraHelper(mainLight.shadow.camera);

  const ligthGroup = new THREE.Group();

  // ligthGroup.add(cameraHelper);

  ligthGroup.add(ambientLight);
  ligthGroup.add(mainLight);
  return ligthGroup;
}

export { createLights };
