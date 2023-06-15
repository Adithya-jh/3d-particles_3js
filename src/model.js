import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as THREE from 'three';

import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

import vertex from './shaders/vertexShader.glsl';
import fragment from './shaders/fragmentShader.glsl';
import gsap from 'gsap';

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
    this.isActive = false;
    this.background = obj.background;

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

      this.geometry = this.mesh.geometry;

      // create a particles Materials
      // this.particlesMaterial = new THREE.PointsMaterial({
      //   color: 'red',
      //   size: 0.02
      // });

      this.particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color('blue') },
          uColor2: { value: new THREE.Color('yellow') },
          uTime: { value: 0 },
          uScale: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });

      // this.mesh.material = this.particlesMaterial;

      // create particles geometry
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      const numParticles = 20000;

      this.particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3);

      const particlesRandomness = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();
        sampler.sample(newPosition);
        particlesPosition.set(
          [newPosition.x, newPosition.y, newPosition.z],
          i * 3
        );

        particlesRandomness.set(
          [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
          i * 3
        );
      }

      this.particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(particlesPosition, 3)
      );

      this.particlesGeometry.setAttribute(
        'aRandom',
        new THREE.BufferAttribute(particlesRandomness, 3)
      );

      // create the particle
      this.particles = new THREE.Points(
        this.particlesGeometry,
        this.particlesMaterial
      );

      if (this.placeOnLoad) {
        this.add();
      }
    });
  }

  add() {
    this.scene.add(this.particles);
    this.isActive = true;

    gsap.to(this.particlesMaterial.uniforms.uScale, {
      duration: 0.8,
      value: 1,
      ease: 'power3.out',
      delay: 0.3,
    });

    if (!this.isActive) {
      gsap.fromTo(
        this.particles.rotation,
        {
          y: Math.PI,
        },
        {
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );

      gsap.to('body', {
        background: 'red',
        duration: 0.8,
      });
    }

    this.isActive = true;
  }

  remove() {
    gsap.to(this.particlesMaterial.uniforms.uScale, {
      duration: 0.8,
      value: 0,
      ease: 'power3.out',
      onComplete: () => {
        this.scene.remove(this.particles);
        this.isActive = false;
      },
    });

    gsap.to(this.particles.rotation, {
      y: Math.PI,
      duration: 0.8,
      ease: 'power3.out',
    });
  }
}

export default Model;
