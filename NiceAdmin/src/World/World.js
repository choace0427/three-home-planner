import { loadWall } from "./components/intor/modelBase.js";
import { loadModel } from "./components/intor/modelObject.js";
import { loadTextModel } from "./components/intor/textObject.js";
import { createCamera } from "./components/camera.js";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene.js";

import { createControls } from "./systems/controls.js";
import { createTransControls } from "./systems/transformcontrols.js";
import { createHelper } from "./systems/helper.js";
import { createRenderer } from "./systems/renderer.js";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/Loop.js";

import * as THREE from "three";

let camera;
let controls;
let transcontrols;
let renderer;
let scene;
let loop;
let helper;
let objects;

// let pointer;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();

    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    //add light
    const light = createLights();
    scene.add(light);
    //add helper
    helper = createHelper();
    scene.add(helper);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    let object_id;
    let control_state;
    let model_object;
    let model_objects = new THREE.Group();
    let current_object;

    // test
    let text_object;

    let rect = renderer.domElement.getBoundingClientRect();

    controls = createControls(camera, renderer.domElement);
    loop.updatables.push(controls);

    setControlState("init");

    transcontrols = createTransControls(camera, renderer.domElement);
    const model = await loadWall();

    for (
      var i = 0;
      i < document.getElementsByClassName("img-item").length;
      i++
    ) {
      document
        .getElementsByClassName("img-item")
        [i].addEventListener("click", add_model, false);
    }

    async function add_model() {
      if (control_state == "init") {
        setControlState("add");
        // control_state = "add";
        object_id = this.getAttribute("id");
        this.getElementsByTagName("img")[0].style.border = "2px solid #f9f6ff";
        model_object = await loadModel(object_id);

        changeModel_object_state(model_object, false);
        model_object.position.set(100, 1000, 1000);

        scene.add(model_object);
        for (
          var i = 0;
          i < document.getElementsByClassName("img-item").length;
          i++
        ) {
          if (
            this.getAttribute("id") !=
            document.getElementsByClassName("img-item")[i].getAttribute("id")
          )
            document
              .getElementsByClassName("img-item")
              [i].getElementsByTagName("img")[0].style.border =
              "2px solid #ffffff";
        }
        // get_model_object(object_id);
      }
    }

    document
      .getElementById("textAddBtn")
      .addEventListener("click", () => add_text());

    async function add_text() {
      if (control_state == "init") {
        setControlState("add");
        // control_state = "add";
        model_object = await loadTextModel(
          document.getElementById("textContent").value,
          document.getElementById("textSize").value,
          document.getElementById("textColor").value
        );

        changeModel_object_state(model_object, false);
        model_object.position.set(0, 0, 0);

        scene.add(model_object);
        // get_model_object(object_id);
      }
    }

    function setControlState(state) {
      control_state = state;
      if (state == "init") {
        document.getElementById("tool-button").style.visibility = "hidden";
        for (
          var i = 0;
          i < document.getElementsByClassName("img-item").length;
          i++
        ) {
          document
            .getElementsByClassName("img-item")
            [i].getElementsByTagName("img")[0].style.border =
            "2px solid #ffffff";
        }
      } else if (state == "set") {
        document.getElementById("tool-button").style.visibility = "visible";
      }
    }

    function changeModel_object_state(model_object, state) {
      if (!state) {
        model_object.traverse(function (object) {
          if (object.type == "Mesh") {
            console.log(object);
            object.material.emissive.setHex(0x222222);
            // object.material.opacity = 0.7;
          }
        });
      } else {
        model_object.traverse(function (object) {
          if (object.type == "Mesh") {
            object.material.emissive.setHex(0x000000);
            // object.material.transparent = false;
            // object.material.opacity = 1;
          }
        });
      }
    }

    objects = [];
    objects.push(model.children[0]);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerdown", onPointerDown);
    function onPointerMove(event) {
      if (control_state == "add") {
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2();
        pointer.set(
          ((event.clientX - rect.left) / renderer.domElement.offsetWidth) * 2 -
            1,
          -((event.clientY - rect.top) / renderer.domElement.offsetHeight) * 2 +
            1
        );
        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(objects, false);
        if (intersects.length > 0) {
          const intersect = intersects[intersects.length - 1];
          model_object.position.set(intersect.point.x, 0, intersect.point.z);
          renderer.render(scene, camera);
          // controls.detach();
        }
      }
      if (control_state == "init") {
        // changeModel_object_state(objects, true);
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2();
        pointer.set(
          ((event.clientX - rect.left) / renderer.domElement.offsetWidth) * 2 -
            1,
          -((event.clientY - rect.top) / renderer.domElement.offsetHeight) * 2 +
            1
        );

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 1) {
          const intersect = intersects[0];

          // intersect;
          // changeModel_object_state(intersect.object, false);
        }
      }
    }

    function onPointerDown(event) {
      if (control_state == "add") {
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2(
          ((event.clientX - rect.left) / renderer.domElement.offsetWidth) * 2 -
            1,
          -((event.clientY - rect.top) / renderer.domElement.offsetHeight) * 2 +
            1
        );

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(objects, false);

        if (intersects.length > 0) {
          const intersect = intersects[intersects.length - 1];

          setControlState("set");
          model_objects.add(model_object);
          objects.push(
            model_objects.children[model_objects.children.length - 1]
              .children[0].children[0]
          );
          current_object = model_object;

          scene.add(model_objects);
          setTransform();

          renderer.render(scene, camera);
        }
      }
      if (control_state == "init") {
        let raycaster = new THREE.Raycaster();
        let pointer = new THREE.Vector2();
        pointer.set(
          ((event.clientX - rect.left) / renderer.domElement.offsetWidth) * 2 -
            1,
          -((event.clientY - rect.top) / renderer.domElement.offsetHeight) * 2 +
            1
        );
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(objects, false);
        if (intersects.length > 1) {
          const intersect = intersects[0];
          setControlState("set");
          current_object = intersect.object.parent.parent;
          changeModel_object_state(intersect.object.parent.parent, false);

          // intersect;
          transcontrols.attach(intersect.object);
        }
      }
    }
    function setTransform() {
      if (control_state == "set") {
        transcontrols.attach(
          model_objects.children[model_objects.children.length - 1]
        );
        transcontrols.addEventListener("dragging-changed", function (event) {
          controls.enabled = !event.value;
        });
        scene.add(transcontrols);
      }
    }
    document.getElementById("btn_ok").addEventListener("click", () => {
      check_current_object();
    });
    document.addEventListener("keydown", (event) => {
      switch (event.which || event.keyCode || event.charCode) {
        case 46:
          delete_current_object();
          break;
        case 13:
          check_current_object();
          break;
      }
    });

    document.getElementById("btn_del").addEventListener("click", () => {
      delete_current_object();
    });
    function delete_current_object() {
      transcontrols.detach();

      const isLargeNumber = (element) =>
        element == current_object.children[0].children[0];

      objects.splice(objects.findIndex(isLargeNumber), 1);

      model_objects.remove(current_object);

      setControlState("init");
    }

    function check_current_object() {
      transcontrols.detach();
      changeModel_object_state(current_object, true);
      setControlState("init");
    }

    // let raycaster = new THREE.Raycaster();
    // let pointer = new THREE.Vector2();
    // function

    // move the target to the center of the front bird
    // controls.target.copy(parrot.position);

    scene.add(model);
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
