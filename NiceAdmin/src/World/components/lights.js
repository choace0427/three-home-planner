import * as THREE from "three";

function createLights() {
  const ambientLight = new THREE.HemisphereLight("white", "grey", 3);

  const mainLight = new THREE.DirectionalLight("white", 1);
  mainLight.position.set(10, 10, 10);

  const ligthGroup = new THREE.Group();

  ligthGroup.add(ambientLight);
  ligthGroup.add(mainLight);
  return ligthGroup;
}

export { createLights };
