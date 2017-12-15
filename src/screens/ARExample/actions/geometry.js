import * as THREE from 'three';

import { addObjectAtHeading, selectObject } from './ar';

export const OPEN = 'geometry/OPEN';
export const CLOSE = 'geometry/CLOSE';
export const SELECT = 'geometry/SELECT';

export const creators = {
    box() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    circle() {
        const geometry = new THREE.CircleGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    cone() {
        const geometry = new THREE.ConeGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    cylinder() {
        const geometry = new THREE.CylinderGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    dodecahedron() {
        const geometry = new THREE.DodecahedronGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    icosahedron() {
        const geometry = new THREE.IcosahedronGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    octahedron() {
        const geometry = new THREE.OctahedronGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    plane() {
        const geometry = new THREE.PlaneGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        });
        return new THREE.Mesh(geometry, material);
    },
    ring() {
        const geometry = new THREE.RingGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff,
            side: THREE.DoubleSide
        });
        return new THREE.Mesh(geometry, material);
    },
    sphere() {
        const geometry = new THREE.SphereGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    tetrahedron() {
        const geometry = new THREE.TetrahedronGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    text(text = 'text') {
        const geometry = new THREE.TextGeometry(text);
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    torus() {
        const geometry = new THREE.TorusGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    },
    torusknot() {
        const geometry = new THREE.TorusKnotGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });
        return new THREE.Mesh(geometry, material);
    }
};

export const select = geometry => dispatch => {
    const object = {
        type: 'geometry',
        geometryName: geometry.name,
        object3D: creators[geometry.name]()
    };
    dispatch(addObjectAtHeading(object));
    dispatch(selectObject(object));
    dispatch(close());
};

export const open = () => ({ type: OPEN });
export const close = () => ({ type: CLOSE });
