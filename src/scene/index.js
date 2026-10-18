// Sets up the 3D world: renderer, camera, lights and all the objects, then runs the animation loop.
import * as THREE from 'three'
import { addLighting } from './lighting.js'
import { createDesk } from './desk.js'
import { createLaptop } from './laptop.js'
import { createProps } from './props.js'
import { createTechIcons } from './techIcons.js'
import { createParticles } from './particles.js'
import { createCameraPath } from './cameraPath.js'
import { glowTexture } from './helpers.js'
import { state } from '../state.js'

export function startScene(canvas, data) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  addLighting(scene, renderer)

  const rig = new THREE.Group() // everything on and around the desk
  scene.add(rig)
  createDesk(rig)
  const laptop = createLaptop(rig, data, reduceMotion)
  const props = createProps(rig, reduceMotion)
  const icons = createTechIcons(rig, reduceMotion)
  const dust = createParticles(scene, reduceMotion)
  const path = createCameraPath(camera, reduceMotion)

  // Where the mouse is, from -1 to 1 on each side. Touch screens are ignored on purpose.
  const pointer = { x: 0, y: 0 }
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2
  })

  // A warm glow that moves to whatever object matches the current section:
  // none at the top, then the mug (about), laptop (journey and projects), purple device (skills), phone (contact).
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture('rgba(255,190,90,A)', '.9'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })
  )
  glow.scale.set(2.2, 2.2, 1)
  rig.add(glow)
  const GLOW_AT = [null, [-2.05, 0.6, 0.95], [0.1, 1.0, -0.2], [0.1, 1.0, -0.2], [-2.65, 0.75, -1.1], [1.85, 0.3, 1.0]]
  const goal = new THREE.Vector3()

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false)
    path.resize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', resize)
  resize()

  const clock = new THREE.Clock()
  function frame() {
    const t = clock.getElapsedTime()
    if (!reduceMotion) {
      // the whole desk leans a little towards the mouse, on top of its slow sway
      const turn = pointer.x * 0.05 + Math.sin(t * 0.25) * 0.03
      const tilt = -pointer.y * 0.025
      rig.rotation.y += (turn - rig.rotation.y) * 0.05
      rig.rotation.x += (tilt - rig.rotation.x) * 0.05
    }
    laptop.update(t, state.section)
    const at = GLOW_AT[state.section]
    if (at) goal.set(at[0], at[1], at[2])
    glow.position.lerp(goal, 0.08)
    glow.material.opacity += ((at ? 0.55 + (reduceMotion ? 0 : Math.sin(t * 2) * 0.12) : 0) - glow.material.opacity) * 0.1
    props.update(t)
    icons.update(t, pointer)
    dust.update(t)
    path.update(t)
    renderer.render(scene, camera)
    requestAnimationFrame(frame)
  }
  frame()
}