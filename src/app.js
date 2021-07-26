import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const apiOptions = {
  apiKey: 'Google API Key',
  version: "beta",
  map_ids: ["Map ID"]
};

const mapOptions = {
  "tilt": 0,
  "heading": 0,
  "zoom": 17,
  "center": { lat: 42.360850, lng: -71.058571 },
  "mapId": "Map ID"    
}

async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new google.maps.Map(mapDiv, mapOptions);
}


function initWebglOverlayView(map) {  
  let scene, renderer, camera, loader;
  const webglOverlayView = new google.maps.WebglOverlayView();
  
  webglOverlayView.onAdd = () => {   
    // set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
  
    // load the model    
    loader = new GLTFLoader();               
    const source = "pin.gltf";
    loader.load(
      source,
      gltf => {      
        gltf.scene.scale.set(25,25,25);
        gltf.scene.rotation.x = 180 * Math.PI/180; // rotations are in radians
        scene.add(gltf.scene);           
      }
    );
  }
  
  webglOverlayView.onContextRestored = (gl) => {        
    // create the three.js renderer, using the
    // maps's WebGL rendering context.
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    // wait to move the camera until the 3D model loads    
    loader.manager.onLoad = () => {        
      renderer.setAnimationLoop(() => {
        map.moveCamera({
          "tilt": mapOptions.tilt,
          "heading": mapOptions.heading,
          "zoom": mapOptions.zoom
        });            
        
        // rotate the map 360 degrees 
        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.5
        } else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.2;
        } else {
          renderer.setAnimationLoop(null)
        }
      });        
    }
  }

  webglOverlayView.onDraw = (gl, coordinateTransformer) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map     
    const matrix = coordinateTransformer.fromLatLngAltitude(mapOptions.center, 120);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
    
    webglOverlayView.requestRedraw();      
    renderer.render(scene, camera);                  

    // always reset the GL state
    renderer.resetState();
  }
  webglOverlayView.setMap(map);
}

(async () => {        
  const map = await initMap();
  initWebglOverlayView(map);    
})();