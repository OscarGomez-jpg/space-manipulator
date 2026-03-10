import * as THREE from "three";
import { scene } from "./scene.js";

const SNAP_THRESHOLD = 0.8;
const POINT_COLOR = 0xff8800;
const HIGHLIGHT_COLOR = 0xffff00;
const SELECTED_COLOR = 0x00ffff;
const CYLINDER_RADIUS = 0.05;

const _yAxis = new THREE.Vector3(0, 1, 0);

const group = new THREE.Group();
scene.add(group);

const points = [];
const lines = [];

function createPointMesh(position) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.3),
    new THREE.MeshStandardMaterial({ color: POINT_COLOR }),
  );
  mesh.position.copy(position);
  return mesh;
}

function updateCylinderTransform(mesh, posA, posB) {
  const direction = new THREE.Vector3().subVectors(posB, posA);
  const length = direction.length();
  if (length === 0) return;
  mesh.position.copy(posA).addScaledVector(direction, 0.5);
  mesh.scale.y = length;
  mesh.quaternion.setFromUnitVectors(_yAxis, direction.normalize());
}

function createLineMesh(posA, posB) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(CYLINDER_RADIUS, CYLINDER_RADIUS, 1, 8),
    new THREE.MeshStandardMaterial({ color: 0xffffff }),
  );
  updateCylinderTransform(mesh, posA, posB);
  return mesh;
}

export const model = {
  get group() {
    return group;
  },

  get points() {
    return points;
  },

  addPoint(localPos) {
    const mesh = createPointMesh(localPos);
    group.add(mesh);
    const point = { mesh, connections: [] };
    points.push(point);
    return point;
  },

  connectPoints(a, b) {
    const lineMesh = createLineMesh(a.mesh.position, b.mesh.position);
    group.add(lineMesh);

    const lineObj = { line: lineMesh, pointA: a, pointB: b };
    lines.push(lineObj);
    a.connections.push(lineObj);
    b.connections.push(lineObj);
    return lineObj;
  },

  updateLineGeometry(lineObj) {
    updateCylinderTransform(
      lineObj.line,
      lineObj.pointA.mesh.position,
      lineObj.pointB.mesh.position,
    );
  },

  getNearestPoint(worldPos) {
    let nearest = null;
    let minDist = SNAP_THRESHOLD;
    for (const p of points) {
      const dist = worldPos.distanceTo(p.mesh.position);
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }
    return nearest;
  },

  worldToLocal(worldPos) {
    return group.worldToLocal(worldPos.clone());
  },

  setPointColor(point, color) {
    point.mesh.material.color.set(color);
  },

  resetAllPointColors() {
    for (const p of points) {
      p.mesh.material.color.set(POINT_COLOR);
    }
  },

  highlightPoint(point) {
    point.mesh.material.color.set(HIGHLIGHT_COLOR);
  },

  selectPoint(point) {
    point.mesh.material.color.set(SELECTED_COLOR);
  },

  removePoint(point) {
    for (const lineObj of point.connections) {
      group.remove(lineObj.line);
      lineObj.line.geometry.dispose();
      lineObj.line.material.dispose();
      const other = lineObj.pointA === point ? lineObj.pointB : lineObj.pointA;
      other.connections = other.connections.filter((c) => c !== lineObj);
      const li = lines.indexOf(lineObj);
      if (li !== -1) lines.splice(li, 1);
    }
    group.remove(point.mesh);
    point.mesh.geometry.dispose();
    point.mesh.material.dispose();
    const pi = points.indexOf(point);
    if (pi !== -1) points.splice(pi, 1);
  },

  POINT_COLOR,
};
