import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import * as THREE from "three";

async function loadTextModel(
  textContent,
  textSize,
  textColor,
  textFont,
  textBold
) {
  const loaderFont = new FontLoader();
  const textBoldState = textBold ? "bold" : "regular";
  const [font] = await Promise.all([
    loaderFont.loadAsync(
      "assets_3d/fonts/" + textFont + "_" + textBoldState + ".typeface.json",
      function (xhr) {
        if (xhr.loaded / xhr.total != 1) {
          document.getElementById("loading").style.opacity = 1;
          document.getElementById("loading").style.visibility = "visible";
        } else {
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

  const geometry = new TextGeometry(textContent, {
    font: font,
    size: textSize,
    height: 0.2,
    curveSegments: 12,
  });

  const material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(textColor),
  });

  // Create a cube
  const TextMesh = new THREE.Mesh(geometry, material);
  TextMesh.position.set(0, 0.01, 0);
  TextMesh.rotateX(-Math.PI / 2);
  // TextMesh.castShadow = true;
  // TextMesh.receiveShadow = true;
  TextMesh.scale.set(0.01, 0.01, 0.01);
  TextMesh.name = "textObject";
  TextMesh.textProps = {
    text: textContent,
    size: textSize,
    color: textColor,
    font: textFont,
    bold: textBold,
  };
  // const TextObject = new THREE.Object3D();

  // TextObject.add(TextMesh);

  // const TextGroup = new THREE.Group();
  // TextGroup.scale.set(0.01, 0.01, 0.01);

  // TextGroup.add(TextObject);
  return TextMesh;
}

export { loadTextModel };
