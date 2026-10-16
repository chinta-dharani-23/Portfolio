// Small building tools shared by the 3D objects: rounded boxes and soft glow textures.
import * as THREE from 'three'

export const std = (options) => new THREE.MeshStandardMaterial(options)

function roundedRect(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

function extrude(w, h, thickness, radius, bevel) {
  const geo = new THREE.ExtrudeGeometry(roundedRect(w, h, radius), {
    depth: Math.max(thickness - 2 * bevel, 0.001),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
    curveSegments: 10,
  })
  geo.center()
  return geo
}

// A flat rounded block lying on the desk (width x depth, with a height of `t`).
export function slab(w, d, t, radius, material, bevel = 0.03) {
  const geo = extrude(w - 2 * bevel, d - 2 * bevel, t, radius, bevel)
  geo.rotateX(-Math.PI / 2)
  const mesh = new THREE.Mesh(geo, material)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

// A rounded block standing upright (width x height, with a depth of `t`).
export function panel(w, h, t, radius, material, bevel = 0.02) {
  const mesh = new THREE.Mesh(extrude(w - 2 * bevel, h - 2 * bevel, t, radius, bevel), material)
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

// A soft round glow, used for steam and the light pool under the desk.
// `color` looks like 'rgba(255,255,255,A)': the letter A is replaced by the opacity.
export function glowTexture(color, alpha) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, color.replace('A', alpha))
  gr.addColorStop(1, color.replace('A', '0'))
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}
