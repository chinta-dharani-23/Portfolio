// Floating tech icons around the laptop on the first screen: Java, Spring Boot, React and PostgreSQL.
// They bob gently, lean towards the mouse, and shrink away when the visitor scrolls past the top.
// To change which icons float, edit the ICONS list. The logos come from src/data/skillIcons.js.
import * as THREE from 'three'
import { panel, std } from './helpers.js'
import { skillStyle, skillLogo } from '../data/skillIcons.js'
import { state } from '../state.js'

const ICONS = [
  { name: 'Java', at: [-1.9, 2.5, 0.6] },
  { name: 'Spring Boot', at: [0.2, 3.2, -0.8] },
  { name: 'React', at: [2.1, 2.5, 0.2] },
  { name: 'PostgreSQL', at: [-2.5, 1.6, 1.4] },
]

// The picture on the front of a chip: the real logo, with the name underneath.
// The logo loads a moment later, so the texture is refreshed when it arrives.
function labelTexture(name) {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const tex = new THREE.CanvasTexture(c)
  tex.encoding = THREE.sRGBEncoding
  tex.anisotropy = 4

  const drawName = () => {
    g.fillStyle = '#2b2350'
    g.textAlign = 'center'
    g.font = '700 34px system-ui, "Segoe UI", sans-serif'
    g.fillText(name, 128, 222)
  }

  const url = skillLogo(name)
  if (url) {
    drawName()
    const img = new Image()
    img.onload = () => {
      g.drawImage(img, 56, 24, 144, 144)
      tex.needsUpdate = true
    }
    img.src = url
  } else {
    const [glyph] = skillStyle(name)
    g.fillStyle = '#2b2350'
    g.textAlign = 'center'
    g.font = '800 112px system-ui, "Segoe UI", sans-serif'
    g.fillText(glyph, 128, 150)
    drawName()
  }
  return tex
}

export function createTechIcons(rig, reduceMotion) {
  const group = new THREE.Group()
  rig.add(group)
  const SIZE = 0.66
  const DEPTH = 0.16

  const items = ICONS.map((icon, i) => {
    const chip = new THREE.Group()
    const body = panel(SIZE, SIZE, DEPTH, 0.14, std({ color: 0xf4f1ff, roughness: 0.35, metalness: 0.05, emissive: 0xf4f1ff, emissiveIntensity: 0.12, toneMapped: false }), 0.03)
    body.castShadow = false
    chip.add(body)
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(SIZE * 0.92, SIZE * 0.92),
      new THREE.MeshBasicMaterial({ map: labelTexture(icon.name), transparent: true, toneMapped: false })
    )
    face.position.z = DEPTH / 2 + 0.005
    chip.add(face)
    chip.position.set(icon.at[0], icon.at[1], icon.at[2])
    group.add(chip)
    return { chip, base: icon.at, phase: i * 1.7 }
  })

  let shown = 1
  let last = 0

  return {
    update(t, pointer) {
      const goal = state.section === 0 ? 1 : 0
      const dt = Math.min(0.1, t - last)
      last = t
      shown += (goal - shown) * (1 - Math.exp(-dt * 6))
      group.visible = shown > 0.02
      if (!group.visible) return
      group.scale.setScalar(Math.max(0.001, shown))

      items.forEach((it) => {
        const bob = reduceMotion ? 0 : Math.sin(t * 0.9 + it.phase) * 0.1
        it.chip.position.y = it.base[1] + bob
        const sway = reduceMotion ? 0 : Math.sin(t * 0.6 + it.phase) * 0.25
        it.chip.rotation.y += (sway + pointer.x * 0.5 - it.chip.rotation.y) * 0.06
        it.chip.rotation.x += (-pointer.y * 0.3 - it.chip.rotation.x) * 0.06
      })
    },
  }
}