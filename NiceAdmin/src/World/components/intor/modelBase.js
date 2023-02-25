import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import * as THREE from "three";
// import { setupModel } from './setupModel.js';

async function loadWall() {
  const model_group = new THREE.Group();

  var planeGeometry = new THREE.PlaneGeometry(60, 60);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xdddddd,
    // map: texture,
  });
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotateX(-Math.PI / 2);
  plane.position.set(0, 0, 0);
  var asd = new THREE.Object3D();
  asd.add(plane);
  model_group.add(plane);

  var planeGeometry1 = new THREE.PlaneGeometry(60, 60);
  var planeMaterial1 = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
  var plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
  plane1.rotateX(-Math.PI / 2);
  plane1.position.set(0, -0.1, 0);

  model_group.add(plane1);

  return model_group;
}

export { loadWall };
