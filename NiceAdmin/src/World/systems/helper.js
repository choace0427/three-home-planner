import * as THREE from "three";

function createHelper() {
  const helper = new THREE.GridHelper(100, 200, 0xdddddd, 0xeeeeee);
  return helper;
}

export { createHelper };
