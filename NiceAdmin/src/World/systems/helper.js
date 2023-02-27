import * as THREE from "three";

function createHelper() {
  const helper = new THREE.GridHelper(100, 200, 0xdddddd, 0xeeeeee);
  helper.position.y = 0.0001;

  // const axisHelper = new THREE.AxesHelper(5);
  // axisHelper.y = 0.005;
  // helper.add(axisHelper);
  return helper;
}

export { createHelper };
