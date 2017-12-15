import * as THREE from 'three';

export const POLY_API_KEY = 'AIzaSyDVowQMZQfFz7XsURJciLIQXZpgBDLfqIc';
export const GOOGLE_MAPS_GEOCODING_API_KEY =
    'AIzaSyBzaFQvsdY9Cx5aB6tXMxrYm3jNchcvFhk';
export const GOOGLE_PLACES_API_KEY = 'AIzaSyBUu7bIlrA-3YvwwLZQpKMKmuMcTZtBByw';
export const GOOGLE_ELEVATION_API_KEY = 'AIzaSyBla1qvxgQfV4DOK8lllUkFhvsgki1kX-Q';
export const PREDICTHQ_ACCESS_TOKEN = '2tOvVru3zpLQ5wa5qsuolUDzYqc5gC';
export const GEOMETRIES = [new THREE.BoxGeometry(1, 2, 1)];
export const MATERIALS = [
    //red
    new THREE.MeshBasicMaterial({
        color: 0xff0000
    }),
    //blue
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    }),
    //lime
    new THREE.MeshBasicMaterial({
        color: 0x0000ff
    }),
    //yellow
    new THREE.MeshBasicMaterial({
        color: 0xffff00
    }),
    //aqua
    new THREE.MeshBasicMaterial({
        color: 0x00ffff
    }),
    //fuchsia
    new THREE.MeshBasicMaterial({
        color: 0xff00ff
    }),
    //white
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    })
];
