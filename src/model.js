import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';

class Model {
  constructor(obj) {
    console.log(obj);
    this.name = obj.name;
    this.file = obj.file;
    this.scene = obj.scene;
    this.placeOnLoad = obj.placeOnLoad;

    this.loader = new GLTFLoader();
    this.dracoloader = new DRACOLoader();
    this.dracoloader.setDecoderPath('./draco/');

    this.loader.setDRACOLoader(this.dracoloader);

    this.init();
  }

  init() {
    this.loader.load(this.file, (response) => {
      this.mesh = response.scene.children[0];
      this.material = new THREE.MeshBasicMaterial({
        color: 'yellow',
        wireframe: true,
      });

      this.mesh.material = this.material;

      if (this.placeOnLoad) {
        this.add();
      }
    });
  }

  add() {
    this.scene.add(this.mesh);
  }

  remove() {
    this.scene.remove(this.mesh);
  }
}

export default Model;
