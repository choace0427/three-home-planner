import { TransformControls } from "three/addons/controls/TransformControls";
import * as THREE from "three";

function createTransControls(camera, canvas) {
  const control = new TransformControls(camera, canvas);
  control.setRotationSnap(Math.PI / 6);
  setModeTranslate();
  window.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
      case 81: // Q
        control.setSpace(control.space === "local" ? "world" : "local");
        break;

      case 16: // Shift
        control.setTranslationSnap(100);
        control.setRotationSnap(THREE.MathUtils.degToRad(15));
        control.setScaleSnap(0.25);
        break;

      case 87: // W
        setModeTranslate();
        control.setMode("translate");
        break;

      case 69: // E
        setModeRotate();
        control.setMode("rotate");
        break;

      case 82: // R
        setModeScale();
        control.setMode("scale");
        break;

      case 67: // C
        const position = currentCamera.position.clone();

        currentCamera = currentCamera.isPerspectiveCamera
          ? cameraOrtho
          : cameraPersp;
        currentCamera.position.copy(position);

        orbit.object = currentCamera;
        control.camera = currentCamera;

        currentCamera.lookAt(orbit.target.x, orbit.target.y, orbit.target.z);
        onWindowResize();
        break;

      case 86: // V
        const randomFoV = Math.random() + 0.1;
        const randomZoom = Math.random() + 0.1;

        cameraPersp.fov = randomFoV * 160;
        cameraOrtho.bottom = -randomFoV * 500;
        cameraOrtho.top = randomFoV * 500;

        cameraPersp.zoom = randomZoom * 5;
        cameraOrtho.zoom = randomZoom * 5;
        onWindowResize();
        break;

      case 187:
      case 107: // +, =, num+
        control.setSize(control.size + 0.1);
        break;

      case 189:
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

  document
    .getElementById("state_move")
    .addEventListener("click", setModeTranslate);
  document
    .getElementById("state_rotate")
    .addEventListener("click", setModeRotate);
  document
    .getElementById("state_scale")
    .addEventListener("click", setModeScale);

  function setModeTranslate() {
    document.getElementById("state_move").className = "btn btn-primary";
    document.getElementById("state_rotate").className =
      "btn btn-outline-primary";
    document.getElementById("state_scale").className =
      "btn btn-outline-primary";
    control.setMode("translate");
    // document.getElementById('state_move').
  }
  function setModeRotate() {
    document.getElementById("state_move").className = "btn btn-outline-primary";
    document.getElementById("state_rotate").className = "btn btn-primary";
    document.getElementById("state_scale").className =
      "btn btn-outline-primary";
    control.setMode("rotate");
  }

  function setModeScale() {
    document.getElementById("state_move").className = "btn btn-outline-primary";
    document.getElementById("state_rotate").className =
      "btn btn-outline-primary";
    document.getElementById("state_scale").className = "btn btn-primary";
    control.setMode("scale");
  }

  control.tick = () => control.update();

  return control;
}

export { createTransControls };
