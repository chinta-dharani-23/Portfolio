// Soft glowing dust that drifts upwards through the whole scene. One draw call, so it stays smooth on phones.
// Change COUNT for more or fewer specks, and `palette` for their colours.
import * as THREE from 'three'
import { glowTexture } from './helpers.js'

export function createParticles(scene, reduceMotion) {
  const COUNT = window.innerWidth < 700 ? 80 : 200
  const TOP = 7.5
  const BOTTOM = -1.5
  const palette = [new THREE.Color(0x8b7bff), new THREE.Color(0x37d6ff), new THREE.Color(0xffc15e)]

  const pos = new Float32Array(COUNT * 3)
  const col = new Float32Array(COUNT * 3)
  const speed = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 20
    pos[i * 3 + 1] = BOTTOM + Math.random() * (TOP - BOTTOM)
    pos[i * 3 + 2] = -9 + Math.random() * 12
    speed[i] = 0.06 + Math.random() * 0.14
    const r = Math.random()
    const c = palette[r < 0.15 ? 2 : r < 0.58 ? 0 : 1]
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      map: glowTexture('rgba(255,255,255,A)', '1'),
      size: 0.17,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  )
  points.frustumCulled = false
  scene.add(points)

  let last = 0
  return {
    update(t) {
      const dt = Math.min(0.05, t - last)
      last = t
      if (reduceMotion) return
      for (let i = 0; i < COUNT; i++) {
        const k = i * 3
        pos[k + 1] += speed[i] * dt
        pos[k] += Math.sin(t * 0.5 + i) * dt * 0.06
        if (pos[k + 1] > TOP) pos[k + 1] = BOTTOM
      }
      geo.attributes.position.needsUpdate = true
    },
  }
}