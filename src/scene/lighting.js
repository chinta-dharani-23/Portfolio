// Lights, reflections and the purple glow under the desk.
import * as THREE from 'three'
import { glowTexture } from './helpers.js'

export function addLighting(scene, renderer) {
  // A small painted sky that metal and glossy parts reflect. Without it they look dull.
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 256
  const g = c.getContext('2d')
  const gr = g.createLinearGradient(0, 0, 0, 256)
  gr.addColorStop(0, '#7b66ff')
  gr.addColorStop(0.5, '#2b1f55')
  gr.addColorStop(1, '#ffb26b')
  g.fillStyle = gr
  g.fillRect(0, 0, 512, 256)
  g.fillStyle = '#fff'
  g.fillRect(70, 60, 110, 46)
  g.fillStyle = '#ffe0b0'
  g.fillRect(340, 50, 130, 36)
  g.fillStyle = '#9fe8ff'
  g.fillRect(250, 110, 60, 20)
  const sky = new THREE.CanvasTexture(c)
  sky.mapping = THREE.EquirectangularReflectionMapping
  sky.encoding = THREE.sRGBEncoding
  scene.environment = new THREE.PMREMGenerator(renderer).fromEquirectangular(sky).texture

  scene.add(new THREE.HemisphereLight(0x9b8cff, 0x160c2c, 0.5))

  const key = new THREE.DirectionalLight(0xfff0dc, 1.15)
  key.position.set(4, 7, 5)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 5, bottom: -5, near: 1, far: 20 })
  key.shadow.radius = 5
  key.shadow.bias = -0.0004
  scene.add(key)

  const violet = new THREE.PointLight(0x7d5cff, 1.8, 14)
  violet.position.set(-4, 2.2, 2)
  scene.add(violet)

  const cyan = new THREE.PointLight(0x37d6ff, 1.3, 12)
  cyan.position.set(4.5, 1.6, -3)
  scene.add(cyan)

  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture('rgba(125,92,255,A)', '.75'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  )
  halo.scale.set(15, 9, 1)
  halo.position.set(0, -1.2, 0)
  scene.add(halo)
}
