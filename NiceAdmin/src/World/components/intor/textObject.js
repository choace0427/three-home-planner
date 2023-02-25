import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import * as THREE from "three";

async function loadTextModel(text, size, color) {
  const loaderFont = new FontLoader();
  const [font] = await Promise.all([
    loaderFont.loadAsync("assets_3d/fonts/optimier_regular.typeface.json"),
  ]);

  const geometry = new TextGeometry(text, {
    font: font,
    size: size,
    height: 0.1,
    curveSegments: 12,
  });
  const material = new THREE.MeshLambertMaterial({ color: 0x000000 });

  // Create a cube
  const TextMesh = new THREE.Mesh(geometry, material);
  TextMesh.position.set(0, 0.01, 0);
  TextMesh.rotateX(-Math.PI / 2);

  const TextObject = new THREE.Object3D();
  const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
  // TextObject.add(cubeMesh);

  TextObject.add(TextMesh);

  const TextGroup = new THREE.Group();
  TextGroup.scale.set(0.01, 0.01, 0.01);

  TextGroup.add(TextObject);
  return TextGroup;
}

export { loadTextModel };
