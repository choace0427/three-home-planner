import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { setupModel } from './setupModel.js';

async function loadModel(id) {
  const loaderGLTF = new GLTFLoader();

  const [object_model] = await Promise.all([
    loaderGLTF.loadAsync("/assets_3d/models/" + id + ".glb"),
  ]);

  object_model.scene.scale.set(0.01, 0.01, 0.01);
  object_model.scene.rotateY(-Math.PI / 2);

  return object_model.scene;
}

export { loadModel };
