// The camera's journey. There is one stop per section, in the same order as the page:
// hero, about, journey, projects, skills, contact.
//   p = where the camera sits, l = what it looks at,
//   s = how far the desk is pushed sideways so the text card has room (+1 right, -1 left).
// Change these numbers to change the angles.
import * as THREE from 'three'
import { setSection, SECTION_IDS } from '../state.js'

const STOPS = [
  { p: [4.6, 3.3, 7.2], l: [0.2, 0.6, -0.2], s: 1 },
  { p: [-0.4, 2.1, 4.6], l: [-1.7, 0.4, 0.6], s: -1 },
  { p: [0.5, 1.7, 3.7], l: [0.1, 0.95, -0.6], s: 1 },
  { p: [3.8, 2.7, 4.0], l: [2.1, 0.2, 0.4], s: -1 },
  { p: [0.2, 5.6, 5.6], l: [0, 1.1, -0.1], s: 1 },
  { p: [-3.6, 2.8, 6.2], l: [0.2, 0.5, -0.1], s: -1 },
]

const lerp = (a, b, t) => a + (b - a) * t
const ease = (t) => t * t * (3 - 2 * t)

export function createCameraPath(camera, reduceMotion) {
  let width = 1
  let height = 1
  let wide = true
  let progress = 0
  let previousTime = 0
  const look = new THREE.Vector3()
  const mouse = { x: 0, y: 0 }

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX / width - 0.5
    mouse.y = e.clientY / height - 0.5
  })

  return {
    resize(w, h) {
      width = w
      height = h
      wide = w >= 900
      camera.aspect = w / h
      camera.fov = wide ? 32 : 44
      camera.updateProjectionMatrix()
    },

    update(t) {
      // where the visitor is on the page, as a number from 0 to 5: the camera holds still while a
      // section is on screen and only travels to the next stop as that section scrolls away
      const sections = SECTION_IDS.map((id) => document.getElementById(id))
      const y = window.scrollY + height * 0.5
      let k = 0
      sections.forEach((el, n) => {
        if (el && el.offsetTop <= y) k = n
      })
      const top = sections[k].offsetTop
      const next = sections[k + 1] ? sections[k + 1].offsetTop : top + sections[k].offsetHeight
      const part = Math.min(1, Math.max(0, (y - top) / Math.max(1, next - top)))
      const target = k + (sections[k + 1] ? Math.min(1, Math.max(0, (part - 0.55) / 0.45)) : 0)

      setSection(Math.round(target)) // tells the screen, glow and side dots which section we are on

      // glide towards the target instead of jumping
      const dt = Math.min(0.25, t - previousTime)
      previousTime = t
      progress = reduceMotion ? target : progress + (target - progress) * (1 - Math.exp(-dt * 4))

      const i = Math.min(STOPS.length - 2, Math.floor(progress))
      const f = ease(Math.min(1, progress - i))
      const a = STOPS[i]
      const b = STOPS[i + 1]

      look.set(lerp(a.l[0], b.l[0], f), lerp(a.l[1], b.l[1], f), lerp(a.l[2], b.l[2], f))
      const back = wide ? 1.7 : 1.9 // how far the camera is pulled back from the desk
      camera.position.set(
        look.x + (lerp(a.p[0], b.p[0], f) - look.x) * back + mouse.x * 0.5,
        look.y + (lerp(a.p[1], b.p[1], f) - look.y) * back - mouse.y * 0.35,
        look.z + (lerp(a.p[2], b.p[2], f) - look.z) * back
      )
      camera.lookAt(look)

      // slide the picture sideways (wide screens) or upwards (phones) to clear the text card
      const side = lerp(a.s, b.s, f)
      if (wide) camera.setViewOffset(width, height, -side * width * 0.3, 0, width, height)
      else camera.setViewOffset(width, height, 0, height * 0.2, width, height)
    },
  }
}
