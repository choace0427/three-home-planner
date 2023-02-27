const setSize = (container, camera, renderer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  let rect = container.getBoundingClientRect();
  container.style.height =
    document.documentElement.clientHeight -
    rect.top -
    document.getElementById("footer").clientHeight -
    60 +
    "px";
};

class Resizer {
  constructor(container, camera, renderer) {
    // set initial size
    setSize(container, camera, renderer);

    const resize_ob = new ResizeObserver(function (entries) {
      setSize(container, camera, renderer);
    });

    // start observing for resize
    resize_ob.observe(document.querySelector("#scene-container"));

    window.addEventListener("resize", () => {
      // set the size again if a resize occurs
      setSize(container, camera, renderer);
      // perform any custom actions
      this.onResize();
    });
  }

  onResize() {}
}

export { Resizer };
