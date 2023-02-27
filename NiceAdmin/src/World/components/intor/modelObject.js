import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

async function loadModel(id) {
  const loaderGLTF = new GLTFLoader();

  const [object_model] = await Promise.all([
    loaderGLTF.loadAsync(
      "/assets_3d/models/" + id + ".glb",
      function (xhr) {
        if (xhr.loaded / xhr.total != 1) {
          console.log("asdasd");
          document.getElementById("loading").style.opacity = 1;
          document.getElementById("loading").style.visibility = "visible";
        } else {
          console.log("1111");
          document.getElementById("loading").style.opacity = 0;
          document.getElementById("loading").style.visibility = "hidden";
        }
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    ),
  ]);

  // object_model.scene.traverse(function (object) {
  //   if (object.type == "Mesh") {
  //     object.castShadow = true;
  //     object.receiveShadow = true;
  //   }
  // });

  object_model.scene.scale.set(0.01, 0.01, 0.01);
  object_model.scene.rotateY(-Math.PI / 2);
  object_model.scene.name = "modelObject_" + id;

  return object_model.scene;
}

export { loadModel };
