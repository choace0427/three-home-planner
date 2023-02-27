import * as THREE from "three";

function createRaycuster(event, objects, renderer, camera) {
  let rect = renderer.domElement.getBoundingClientRect();
  const resize_ob = new ResizeObserver(function (entries) {
    rect = renderer.domElement.getBoundingClientRect();
  });
  resize_ob.observe(document.querySelector("#scene-container"));

  let raycaster = new THREE.Raycaster();
  let pointer = new THREE.Vector2();
  pointer.set(
    ((event.clientX - rect.left) / renderer.domElement.offsetWidth) * 2 - 1,
    -((event.clientY - rect.top) / renderer.domElement.offsetHeight) * 2 + 1
  );
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(objects, false);
  return intersects;
}

export { createRaycuster };
