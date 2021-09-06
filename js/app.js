import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertex from '../js/vertex.glsl';
import fragment from '../js/fragment.glsl';

export default class Sketch {

    constructor(options) {
        this.container = options.domElement;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 100, 2000);
        this.camera.position.z = 600;

        this.scene = new THREE.Scene();


        //calcolo per la distanza
        this.camera.fov = 2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        // this.renderer.setSize(this.width, this.height);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);


        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.images = [...document.querySelectorAll('.image')];


        this.addImages();
        this.setPosion();
        this.time = 0;
        this.resize();
        this.addObjects();
        this.render();
        this.setupResize()
    }

    setPosion()
    {
        this.imageStore.forEach(o=>{
            o.mesh.position.y=-o.top + this.height/2 - o.height/2;
            o.mesh.position.x= o.left - this.width/2 + o.width/2;
        })
    }
    addImages() {
        this.imageStore = this.images.map(image => {

            let bounds = image.getBoundingClientRect();
            console.log(bounds);

            let geometry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 1, 1);

            let texture =  new THREE.Texture(image);
            texture.needsUpdate = true;


            let material = new THREE.MeshBasicMaterial({ 
            map: texture });

            let mesh = new THREE.Mesh(geometry, material);

            this.scene.add(mesh);

            return {
                img: image,
                mesh: mesh,
                top: bounds.top,
                left: bounds.left,
                width: bounds.width,
                height: bounds.height
            }
        })
console.log(this.imageStore);

    }
    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    addObjects() {
        this.geometry = new THREE.PlaneBufferGeometry(100, 100, 10, 10);
        // this.material = new THREE.MeshNormalMaterial();

        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
        })

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
    }
    render() {
        this.time += 0.05;

        this.mesh.rotation.x = this.time / 2000;
        this.mesh.rotation.y = this.time / 1000;

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this))
    }
}

new Sketch({
    domElement: document.getElementById('container')
});
