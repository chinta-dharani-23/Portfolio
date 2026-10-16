// The small things on the desk: mug with steam, phone, glowing button, purple device, headphones.
import * as THREE from 'three'
import { std, slab, panel, glowTexture } from './helpers.js'

function addMug(rig) {
  const mug = new THREE.Group()
  mug.position.set(-2.05, 0, 0.95)
  rig.add(mug)

  const profile = [[0, 0], [0.34, 0], [0.37, 0.05], [0.37, 0.56], [0.34, 0.56], [0.33, 0.07], [0, 0.07]].map((p) => new THREE.Vector2(p[0], p[1]))
  const cup = new THREE.Mesh(new THREE.LatheGeometry(profile, 56), std({ color: 0xf4eee6, roughness: 0.2, metalness: 0.05, side: THREE.DoubleSide }))
  cup.castShadow = true
  mug.add(cup)

  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.05, 14, 28, Math.PI), cup.material)
  handle.rotation.z = -Math.PI / 2
  handle.position.set(0.37, 0.3, 0)
  handle.castShadow = true
  mug.add(handle)

  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.325, 40), std({ color: 0x3a1d0d, roughness: 0.15, metalness: 0.1 }))
  coffee.rotation.x = -Math.PI / 2
  coffee.position.y = 0.49
  mug.add(coffee)

  const steamTexture = glowTexture('rgba(255,255,255,A)', '.55')
  const steam = []
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTexture, transparent: true, opacity: 0, depthWrite: false }))
    s.scale.set(0.45, 0.45, 1)
    mug.add(s)
    steam.push(s)
  }
  return (t) => {
    steam.forEach((s, k) => {
      const q = (t * 0.25 + k / 4) % 1
      s.position.set(Math.sin(q * 6 + k) * 0.07, 0.55 + q * 0.9, 0)
      s.material.opacity = Math.sin(q * Math.PI) * 0.22
      s.scale.setScalar(0.3 + q * 0.5)
    })
  }
}

function addPhone(rig) {
  const phone = new THREE.Group()
  phone.position.set(1.85, 0, 1.0)
  phone.rotation.y = -0.4
  rig.add(phone)

  const body = slab(0.62, 1.2, 0.06, 0.09, std({ color: 0x15121f, roughness: 0.3, metalness: 0.6 }), 0.012)
  body.position.y = 0.03
  phone.add(body)

  const c = document.createElement('canvas')
  c.width = 124
  c.height = 240
  const g = c.getContext('2d')
  const gr = g.createLinearGradient(0, 0, 124, 240)
  gr.addColorStop(0, '#6c4bff')
  gr.addColorStop(1, '#1b8bff')
  g.fillStyle = gr
  g.fillRect(0, 0, 124, 240)
  g.fillStyle = 'rgba(255,255,255,.9)'
  g.font = '700 30px sans-serif'
  g.fillText('10:42', 22, 70)
  g.fillStyle = 'rgba(255,255,255,.22)'
  ;[100, 140, 180].forEach((y) => g.fillRect(14, y, 96, 28))
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 1.12), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), toneMapped: false }))
  screen.rotation.x = -Math.PI / 2
  screen.position.y = 0.066
  phone.add(screen)
}

function addButton(rig) {
  const puck = new THREE.Group()
  puck.position.set(2.65, 0, -0.1)
  rig.add(puck)

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.33, 0.2, 48), std({ color: 0x16131f, roughness: 0.35, metalness: 0.6 }))
  body.position.y = 0.1
  body.castShadow = true
  puck.add(body)

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 12, 48), new THREE.MeshBasicMaterial({ color: 0x37b6ff, toneMapped: false }))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.205
  puck.add(ring)

  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.14, 32), new THREE.MeshBasicMaterial({ color: 0x1d4fff, toneMapped: false }))
  dot.rotation.x = -Math.PI / 2
  dot.position.y = 0.202
  puck.add(dot)

  const light = new THREE.PointLight(0x37b6ff, 0.9, 3)
  light.position.set(2.65, 0.5, -0.1)
  rig.add(light)

  return (t) => ring.material.color.setHSL(0.57, 1, 0.55 + Math.sin(t * 2) * 0.08)
}

function addDevice(rig) {
  const cube = panel(0.95, 1.05, 0.95, 0.16, std({ color: 0x4a2fd6, roughness: 0.4, metalness: 0.1, envMapIntensity: 0.4, emissive: 0x1d0f6a, emissiveIntensity: 0.5 }), 0.03)
  cube.position.set(-2.65, 0.52, -1.15)
  cube.rotation.y = 0.35
  rig.add(cube)

  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: 0xc8a2ff, toneMapped: false }))
  dot.position.set(-2.65 + 0.18, 0.62, -1.15 + 0.46)
  rig.add(dot)
}

function addHeadphones(rig) {
  const group = new THREE.Group()
  group.position.set(2.5, 0.62, -1.25)
  group.rotation.y = -0.5
  rig.add(group)

  const band = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 14, 48, Math.PI), std({ color: 0x1a1626, roughness: 0.4, metalness: 0.5 }))
  band.position.y = 0.12
  band.castShadow = true
  group.add(band)

  const gold = std({ color: 0xe0a93e, roughness: 0.28, metalness: 0.95 })
  ;[-1, 1].forEach((side) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 40), gold)
    cup.rotation.z = Math.PI / 2
    cup.position.set(side * 0.62, 0, 0)
    cup.castShadow = true
    group.add(cup)

    const pad = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.07, 12, 32), std({ color: 0x241d36, roughness: 0.7 }))
    pad.rotation.y = Math.PI / 2
    pad.position.set(side * 0.5, 0, 0)
    group.add(pad)
  })
}

// Adds everything and returns one function that animates the steam and the button glow.
export function createProps(rig, reduceMotion) {
  const steamStep = addMug(rig)
  addPhone(rig)
  const buttonStep = addButton(rig)
  addDevice(rig)
  addHeadphones(rig)
  return {
    update(t) {
      if (reduceMotion) return
      steamStep(t)
      buttonStep(t)
    },
  }
}
