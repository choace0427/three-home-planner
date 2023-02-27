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

import { createRaycuster } from "./systems/raycaster.js";

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
let rect;
// let pointer;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    // renderer.domElement.style.borderRadius = "10px";

    // container.parentNode.style.borderRadius = "10px";
    //add light
    const light = createLights();
    scene.add(light);
    //add helper
    helper = createHelper();
    scene.add(helper);
    new Resizer(container, camera, renderer);
  }

  async init() {
    let object_id;
    let control_state;
    let model_object;
    let model_objects = new THREE.Group();
    let current_object;

    let rect = renderer.domElement.getBoundingClientRect();
    const resize_ob = new ResizeObserver(function (entries) {
      rect = renderer.domElement.getBoundingClientRect();
    });
    resize_ob.observe(document.querySelector("#scene-container"));

    controls = createControls(camera, renderer.domElement);
    loop.updatables.push(controls);

    setControlState("init");

    transcontrols = createTransControls(
      camera,
      renderer.domElement,
      control_state
    );
    const model = await loadWall();
    scene.add(model);

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
      if (control_state == "init" || control_state == "add") {
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
        setControlState("add");
      }
    }

    var old_control_state;

    var myModal = new bootstrap.Modal(document.getElementById("basicModal"));

    document
      .getElementById("openAddTextModal")
      .addEventListener("click", () => {
        if (control_state == "init") {
          openSetTextModal();
        }
      });
    document
      .getElementById("btn_setTextModalOk")
      .addEventListener("click", () => {
        if (document.getElementById("textContent").value) {
          myModal.hide();
          settext();
        }
      });

    $("#basicModal").on("hidden.bs.modal", function () {
      setControlState(old_control_state);
    });

    function openSetTextModal() {
      old_control_state = control_state;
      myModal.show();

      if (control_state == "init") {
        setControlState("addText");
        document.getElementById("txt_setTextModalTitle").innerHTML = "Add Text";
      } else if (control_state == "set") {
        setControlState("setText");
        document.getElementById("textContent").value =
          current_object.textProps.text;
        document.getElementById("textSize").value =
          current_object.textProps.size;
        document.getElementById("textFont").value =
          current_object.textProps.font;
        document.getElementById("textColor").value =
          current_object.textProps.color;
        document.getElementById("textBold").checked =
          current_object.textProps.bold;
        document.getElementById("txt_setTextModalTitle").innerHTML = "Set Text";
      }
    }

    async function settext() {
      if (control_state == "addText") {
        model_object = await loadTextModel(
          document.getElementById("textContent").value,
          document.getElementById("textSize").value,
          document.getElementById("textColor").value,
          document.getElementById("textFont").value,
          document.getElementById("textBold").checked
        );
        changeModel_object_state(model_object, false);
        model_object.position.set(0, 10000, 0);
        scene.add(model_object);
        setControlState("add");
      } else if (control_state == "setText") {
        let new_current = await loadTextModel(
          document.getElementById("textContent").value,
          document.getElementById("textSize").value,
          document.getElementById("textColor").value,
          document.getElementById("textFont").value,
          document.getElementById("textBold").checked
        );
        new_current.position.copy(current_object.position);
        new_current.rotation.copy(current_object.rotation);
        new_current.scale.copy(current_object.scale);
        scene.add(new_current);
        delete_current_object();
        current_object = new_current;
        transcontrols.attach(current_object);
        current_object.traverse(function (object) {
          if (object.type == "Mesh") {
            objects.push(object);
          }
        });
        model_objects.add(current_object);
        setControlState("set");
      }
      old_control_state = control_state;
    }

    function setControlState(state) {
      control_state = state;
      if (state == "init") {
        document.getElementById("tool-button").style.opacity = 0;
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
        document.getElementById("tool-button").style.opacity = 1;
        document.getElementById("tool-button").style.visibility = "visible";
      }
    }

    function changeModel_object_state(model_object, state) {
      if (!state) {
        model_object.traverse(function (object) {
          if (object.type == "Mesh") {
            object.material.transparent = true;
            object.material.opacity = 0.8;
          }
        });
      } else {
        model_object.traverse(function (object) {
          if (object.type == "Mesh") {
            object.material.transparent = false;
            object.material.opacity = 1;
          }
        });
      }
    }

    objects = [];
    objects.push(model.children[0]);

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerdown", onPointerDown);
    function onPointerMove(event) {
      {
        if (control_state == "add") {
          const intersects = createRaycuster(event, objects, renderer, camera);
          if (intersects.length > 0) {
            const intersect = intersects[intersects.length - 1];
            model_object.position.set(intersect.point.x, 0, intersect.point.z);
            renderer.render(scene, camera);
            // controls.detach();
          }
        }
      }
    }

    document.getElementById("btn_editText").addEventListener("click", () => {
      openSetTextModal();
    });

    function onPointerDown(event) {
      if (
        event.clientX > rect.left &&
        event.clientX < rect.right &&
        event.clientY > rect.top &&
        event.clientY < rect.bottom
      ) {
        if (control_state == "add") {
          const intersects = createRaycuster(event, objects, renderer, camera);
          if (intersects.length > 0) {
            setObject(model_object);
            if (model_object.name.includes("textObject")) {
              console.log(current_object.textProps);

              document.getElementById("btn_editText").style.display =
                "inline-block";

              // setControlState("setText");
            } else {
              document.getElementById("btn_editText").style.display = "none";
            }
          }
        }
        if (control_state == "init") {
          const intersects = createRaycuster(event, objects, renderer, camera);
          if (intersects.length > 1) {
            const intersect = intersects[0];
            setControlState("set");

            //get object from casted mesh
            let currentNode = intersect.object;
            while (
              !(
                currentNode.type == "Scene" ||
                currentNode.name.includes("modelObject_") ||
                currentNode.name.includes("textObject")
              )
            ) {
              currentNode = currentNode.parent;
            }

            current_object = currentNode;
            console.log(current_object);
            if (current_object.name.includes("textObject")) {
              console.log(current_object.textProps);

              document.getElementById("btn_editText").style.display =
                "inline-block";
            } else {
              document.getElementById("btn_editText").style.display = "none";
            }

            // current_object = intersect.object.parent.parent;
            changeModel_object_state(current_object, false);

            // intersect;
            transcontrols.attach(current_object);
          }
        }
      }
    }
    function setObject(selected_object) {
      if (control_state == "add") {
        model_objects.add(selected_object);
        selected_object.traverse(function (object) {
          if (object.type == "Mesh") {
            objects.push(object);
          }
        });
        current_object = selected_object;
        scene.remove(selected_object);
        scene.add(model_objects);
        transcontrols.attach(
          model_objects.children[model_objects.children.length - 1]
        );
        transcontrols.addEventListener("dragging-changed", function (event) {
          controls.enabled = !event.value;
        });
        scene.add(transcontrols);
      }
      setControlState("set");
    }
    document.getElementById("btn_ok").addEventListener("click", () => {
      check_current_object();
    });

    document.addEventListener("keydown", (event) => {
      if (control_state == "set") {
        switch (event.which || event.keyCode || event.charCode) {
          case 46:
            delete_current_object();
            break;
          case 13:
            check_current_object();
            break;
        }
      }
    });

    document.getElementById("btn_del").addEventListener("click", () => {
      delete_current_object();
      setControlState("init");
    });

    function delete_current_object() {
      transcontrols.detach();
      current_object.traverse(function (object) {
        if (object.type == "Mesh") {
          const isLargeNumber = (element) => element == object;
          objects.splice(objects.findIndex(isLargeNumber), 1);
        }
      });
      model_objects.remove(current_object);
    }

    function check_current_object() {
      transcontrols.detach();
      changeModel_object_state(current_object, true);
      setControlState("init");
    }

    // function save_
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
