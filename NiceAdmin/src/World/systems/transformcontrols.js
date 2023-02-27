import { TransformControls } from "three/addons/controls/TransformControls";
import * as THREE from "three";

function createTransControls(camera, canvas, state) {
  const control = new TransformControls(camera, canvas);
  control.setRotationSnap(Math.PI / 12);
  setModeTranslate();
  if (state == "set") {
    window.addEventListener("keydown", function (event) {
      switch (event.keyCode) {
        case 81: // Q
          control.setSpace(control.space === "local" ? "world" : "local");
          break;

        case 16: // Shift
          control.setTranslationSnap(1);
          control.setRotationSnap(Math.PI / 12);
          control.setScaleSnap(0.25);
          break;

        case 87: // W
          setModeTranslate();
          break;

        case 69: // E
          setModeRotate();
          break;

        case 82: // R
          setModeScale();
          break;

        case 187:
        case 107: // +, =, num+
          control.setSize(control.size + 0.1);
          break;

        case 109: // -, _, num-
          control.setSize(Math.max(control.size - 0.1, 0.1));
          break;

        case 88: // X
          control.showX = !control.showX;
          break;

        case 89: // Y
          control.showY = !control.showY;
          break;

        case 90: // Z
          control.showZ = !control.showZ;
          break;

        case 32: // Spacebar
          control.enabled = !control.enabled;
          break;

        case 27: // Esc
          control.reset();
          break;
      }
    });
    window.addEventListener("keyup", function (event) {
      switch (event.keyCode) {
        case 16: // Shift
          control.setTranslationSnap(null);
          control.setRotationSnap(null);
          control.setScaleSnap(null);
          break;
      }
    });
  }

  document
    .getElementById("btn_stateMove")
    .addEventListener("click", setModeTranslate);
  document
    .getElementById("btn_stateRotate")
    .addEventListener("click", setModeRotate);
  document
    .getElementById("btn_stateScale")
    .addEventListener("click", setModeScale);

  function setModeTranslate() {
    document.getElementById("btn_stateMove").className = "btn btn-primary";
    document.getElementById("btn_stateRotate").className =
      "btn btn-outline-primary";
    document.getElementById("btn_stateScale").className =
      "btn btn-outline-primary";
    control.setMode("translate");
    control.showX = true;
    control.showY = true;
    control.showZ = true;
    // document.getElementById('state_move').
  }
  function setModeRotate() {
    document.getElementById("btn_stateMove").className =
      "btn btn-outline-primary";
    document.getElementById("btn_stateRotate").className = "btn btn-primary";
    document.getElementById("btn_stateScale").className =
      "btn btn-outline-primary";
    control.setMode("rotate");
    control.showX = true;
    control.showY = true;
    control.showZ = true;
  }

  function setModeScale() {
    document.getElementById("btn_stateMove").className =
      "btn btn-outline-primary";
    document.getElementById("btn_stateRotate").className =
      "btn btn-outline-primary";
    document.getElementById("btn_stateScale").className = "btn btn-primary";
    control.setMode("scale");
    control.showX = true;
    control.showY = true;
    control.showZ = true;
  }

  control.tick = () => control.update();

  return control;
}

export { createTransControls };
