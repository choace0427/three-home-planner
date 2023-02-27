// import { Color, Scene } from 'three';
import * as THREE from "three";

function createScene() {
  const scene = new THREE.Scene();

  scene.background = new THREE.Color(0xdddddd);
  scene.fog = new THREE.Fog(0xdddddd, 22, 30);

  return scene;
}

export { createScene };
