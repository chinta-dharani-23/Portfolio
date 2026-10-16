// The laptop. Its screen changes with the section the visitor is on:
// code at the top, then your profile, internship timeline, projects, skills and contact.
// Everything drawn on the screen comes from src/data/portfolio.js.
import * as THREE from 'three'
import { std, slab, panel } from './helpers.js'
import { skillStyle } from '../data/skillIcons.js'

const VIOLET = '#b39dff'
const GOLD = '#ffcf7a'
const CYAN = '#7fe3ff'
const GREY = '#8c84a8'
const WHITE = '#efeafc'
const FILES = ['portfolio.js', 'about.md', 'journey.log', 'projects/', 'skills.json', 'contact.me']

// ---------- small drawing helpers ----------
function rrect(g, x, y, w, h, r, fill) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
  g.fillStyle = fill
  g.fill()
}
function fit(g, text, maxWidth) {
  if (g.measureText(text).width <= maxWidth) return text
  while (text.length > 1 && g.measureText(text + '…').width > maxWidth) text = text.slice(0, -1)
  return text + '…'
}
const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
const isTodo = (s) => !s || /^TODO/i.test(String(s).trim())

// ---------- the code shown at the top of the page ----------
function codeLines(d) {
  const list = (arr) => '[' + arr.map((s) => `'${s}'`).join(', ') + ']'
  return [
    [['const ', VIOLET], ['developer', WHITE], [' = {', GREY]],
    [['  name: ', CYAN], [`'${d.name}'`, GOLD], [',', GREY]],
    [['  degree: ', CYAN], [`'${d.screen.degree}'`, GOLD], [',', GREY]],
    [['  stack: ', CYAN], [list(d.screen.stack), GOLD], [',', GREY]],
    [['  ai: ', CYAN], [list(d.screen.ai), GOLD], [',', GREY]],
    [['  status: ', CYAN], [`'${d.screen.status}'`, GOLD], [',', GREY]],
    [['};', GREY]],
    [],
    [['developer', WHITE], ['.', GREY], ['build', CYAN], ['();', GREY]],
  ]
}

// ---------- one drawing function per section ----------
function makeScreens(d) {
  const lines = codeLines(d)
  const totalChars = lines.reduce((n, l) => n + l.reduce((m, s) => m + s[0].length, 0), 0)
  const cgpa = (d.about.facts.find((f) => f[0] === 'CGPA') || [])[1]

  const code = (g, t, still) => {
    const typed = still ? totalChars : Math.floor(t * 26) % (totalChars + 70)
    g.font = '500 21px "JetBrains Mono", monospace'
    let used = 0
    let y = 76
    let cx = 22
    let cy = y
    outer: for (const line of lines) {
      let x = 22
      for (const [text, colour] of line) {
        const shown = Math.max(0, Math.min(text.length, typed - used))
        g.fillStyle = colour
        g.fillText(text.slice(0, shown), x, y)
        x += g.measureText(text.slice(0, shown)).width
        cx = x
        cy = y
        used += text.length
        if (shown < text.length) break outer
      }
      y += 38
    }
    if (Math.floor(t * 2) % 2 === 0) {
      g.fillStyle = GOLD
      g.fillRect(cx + 2, cy - 19, 11, 25)
    }
  }

  const aboutScreen = (g) => {
    const grad = g.createLinearGradient(40, 90, 160, 210)
    grad.addColorStop(0, '#ffd27a')
    grad.addColorStop(1, '#ff9a2e')
    g.fillStyle = grad
    g.beginPath()
    g.arc(110, 160, 58, 0, 7)
    g.fill()
    g.fillStyle = '#2a1700'
    g.font = '800 40px sans-serif'
    g.textAlign = 'center'
    g.fillText(initials(d.name), 110, 175)
    g.textAlign = 'left'
    g.fillStyle = WHITE
    g.font = '800 34px sans-serif'
    g.fillText(d.name, 190, 130)
    g.fillStyle = GOLD
    g.font = '500 16px "JetBrains Mono", monospace'
    g.fillText(fit(g, d.role, 420), 190, 158)
    g.fillStyle = GREY
    g.font = '500 15px sans-serif'
    g.fillText('B.Tech CSBS · Final year', 190, 186)
    g.fillText(fit(g, 'G. Pulla Reddy Engineering College', 420), 190, 208)
    let x = 40
    ;[cgpa && !isTodo(cgpa) ? 'CGPA ' + cgpa.replace(' / 10.0', '') : '', 'Kurnool, AP', 'Seeking entry-level role'].filter(Boolean).forEach((txt) => {
      g.font = '600 15px sans-serif'
      const w = g.measureText(txt).width + 28
      rrect(g, x, 262, w, 34, 17, 'rgba(125,92,255,.28)')
      g.fillStyle = '#d9ceff'
      g.fillText(txt, x + 14, 284)
      x += w + 10
    })
  }

  const journeyScreen = (g) => {
    g.fillStyle = 'rgba(255,255,255,.14)'
    g.fillRect(63, 80, 3, 270)
    d.journey.forEach((j, i) => {
      const y = 92 + i * 128
      g.fillStyle = '#120d24'
      g.beginPath()
      g.arc(64.5, y + 8, 10, 0, 7)
      g.fill()
      g.strokeStyle = GOLD
      g.lineWidth = 4
      g.stroke()
      g.fillStyle = GOLD
      g.font = '500 15px "JetBrains Mono", monospace'
      g.fillText(isTodo(j.period) ? '' : j.period, 92, y + 14)
      g.fillStyle = WHITE
      g.font = '700 22px sans-serif'
      g.fillText(fit(g, j.org.split(' Virtual')[0].split(',')[0], 500), 92, y + 46)
      g.fillStyle = GREY
      g.font = '500 16px sans-serif'
      g.fillText(fit(g, j.role, 500), 92, y + 72)
    })
  }

  const projectsScreen = (g) => {
    d.projects.slice(0, 2).forEach((p, i) => {
      const x = 28 + i * 300
      rrect(g, x, 66, 284, 290, 14, 'rgba(255,255,255,.06)')
      rrect(g, x, 66, 284, 30, 14, 'rgba(255,255,255,.07)')
      ;['#ff6b6b', '#ffcf4a', '#4ade80'].forEach((c, k) => {
        g.fillStyle = c
        g.beginPath()
        g.arc(x + 16 + k * 16, 81, 5, 0, 7)
        g.fill()
      })
      if (!isTodo(p.demo)) {
        rrect(g, x + 218, 72, 54, 18, 9, '#4ade80')
        g.fillStyle = '#06230f'
        g.font = '700 11px "JetBrains Mono", monospace'
        g.fillText('LIVE', x + 232, 85)
      }
      const grad = g.createLinearGradient(x, 100, x + 284, 220)
      grad.addColorStop(0, '#4a37a0')
      grad.addColorStop(1, '#1a1236')
      g.fillStyle = grad
      g.fillRect(x + 10, 104, 264, 110)
      g.fillStyle = WHITE
      g.font = '800 38px sans-serif'
      g.textAlign = 'center'
      g.fillText(initials(p.title), x + 142, 168)
      g.textAlign = 'left'
      g.font = '700 17px sans-serif'
      g.fillText(fit(g, p.title, 262), x + 12, 244)
      g.font = '500 13px "JetBrains Mono", monospace'
      g.fillStyle = GOLD
      g.fillText(fit(g, p.tech.slice(0, 3).join(' · '), 262), x + 12, 270)
      g.fillStyle = GREY
      g.font = '500 13px sans-serif'
      g.fillText(fit(g, p.text, 262), x + 12, 296)
      g.fillText(fit(g, p.text.slice(60), 262), x + 12, 316)
    })
  }

  const skillsScreen = (g) => {
    const names = d.skills.filter((s) => !/^certifications/i.test(s[0])).flatMap((s) => s[1]).slice(0, 18)
    names.forEach((n, i) => {
      const col = i % 6
      const row = Math.floor(i / 6)
      const x = 22 + col * 100
      const y = 64 + row * 108
      rrect(g, x, y, 90, 96, 14, 'rgba(255,255,255,.06)')
      const [glyph, bg, fg] = skillStyle(n)
      rrect(g, x + 22, y + 10, 46, 46, 12, bg)
      g.fillStyle = fg
      g.font = '800 17px sans-serif'
      g.textAlign = 'center'
      g.fillText(glyph, x + 45, y + 40)
      g.fillStyle = WHITE
      g.font = '600 12px sans-serif'
      g.fillText(fit(g, n, 82), x + 45, y + 78)
      g.textAlign = 'left'
    })
  }

  const contactScreen = (g) => {
    g.fillStyle = WHITE
    g.font = '800 38px sans-serif'
    g.fillText("Let's build something.", 36, 120)
    g.font = '500 17px sans-serif'
    g.fillStyle = GREY
    g.fillText(fit(g, d.contact.message, 570), 36, 156)
    const rows = [
      ['Email', d.contact.email],
      ['GitHub', d.contact.github],
      ['LinkedIn', d.contact.linkedin],
      ['LeetCode', d.contact.leetcode],
    ].filter((r) => !isTodo(r[1]))
    rows.forEach((r, i) => {
      const y = 186 + i * 46
      rrect(g, 36, y, 568, 38, 12, 'rgba(255,255,255,.07)')
      g.fillStyle = GOLD
      g.font = '500 13px "JetBrains Mono", monospace'
      g.fillText(r[0].toUpperCase(), 52, y + 24)
      g.fillStyle = WHITE
      g.font = '600 16px sans-serif'
      g.fillText(fit(g, r[1], 400), 150, y + 25)
    })
  }

  return [code, aboutScreen, journeyScreen, projectsScreen, skillsScreen, contactScreen]
}

// ---------- the laptop itself ----------
export function createLaptop(rig, data, reduceMotion) {
  const laptop = new THREE.Group()
  laptop.position.set(0.1, 0, -0.45)
  rig.add(laptop)

  const alu = std({ color: 0x8d86a6, roughness: 0.28, metalness: 0.9 })
  const body = slab(2.3, 1.55, 0.09, 0.08, alu, 0.02)
  body.position.y = 0.05
  laptop.add(body)

  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.03, 0.12), std({ color: 0x14111f, roughness: 0.5 }), 13 * 5)
  const dummy = new THREE.Object3D()
  let i = 0
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 13; col++) {
      dummy.position.set(-0.78 + col * 0.13, 0.105, -0.5 + row * 0.14)
      dummy.updateMatrix()
      keys.setMatrixAt(i++, dummy.matrix)
    }
  }
  keys.castShadow = true
  laptop.add(keys)

  const trackpad = slab(0.7, 0.4, 0.012, 0.05, std({ color: 0x6f6890, roughness: 0.3, metalness: 0.7 }), 0.004)
  trackpad.position.set(0, 0.1, 0.55)
  laptop.add(trackpad)

  const hinge = new THREE.Group()
  hinge.position.set(0, 0.09, -0.76)
  hinge.rotation.x = -0.3
  laptop.add(hinge)
  const lid = panel(2.3, 1.5, 0.07, 0.08, alu, 0.02)
  lid.position.y = 0.75
  hinge.add(lid)

  // The screen: `view` is what the visitor sees, `buffer` is where the next picture is drawn,
  // `old` holds the previous picture so we can fade between them.
  const view = document.createElement('canvas')
  const buffer = document.createElement('canvas')
  const old = document.createElement('canvas')
  ;[view, buffer, old].forEach((c) => {
    c.width = 640
    c.height = 400
  })
  const g = view.getContext('2d')
  const b = buffer.getContext('2d')
  const texture = new THREE.CanvasTexture(view)
  texture.encoding = THREE.sRGBEncoding
  texture.anisotropy = 8
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.14, 1.34), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }))
  screen.position.set(0, 0.75, 0.037)
  hinge.add(screen)

  const screens = makeScreens(data)
  let shown = 0
  let fade = 1
  let lastDraw = -1
  let lastTime = 0
  let dirty = true

  function drawFrame(index, t) {
    b.textBaseline = 'alphabetic'
    b.textAlign = 'left'
    b.fillStyle = '#120d24'
    b.fillRect(0, 0, 640, 400)
    b.fillStyle = '#1d1638'
    b.fillRect(0, 0, 640, 34)
    ;['#ff6b6b', '#ffcf4a', '#4ade80'].forEach((c, k) => {
      b.fillStyle = c
      b.beginPath()
      b.arc(20 + k * 20, 17, 6, 0, 7)
      b.fill()
    })
    b.fillStyle = GREY
    b.font = '500 13px monospace'
    b.fillText(FILES[index], 250, 22)
    screens[index](b, t, reduceMotion)
  }

  return {
    update(t, section) {
      const dt = Math.min(0.1, t - lastTime)
      lastTime = t
      if (section !== shown) {
        old.getContext('2d').drawImage(view, 0, 0)
        shown = section
        fade = reduceMotion ? 1 : 0
        dirty = true
      }
      const typing = shown === 0 && !reduceMotion
      const fading = fade < 1
      if (!(typing || fading || dirty)) return
      if (t - lastDraw < 0.06) return
      lastDraw = t
      fade = Math.min(1, fade + dt / 0.4)
      drawFrame(shown, t)
      g.globalAlpha = 1
      if (fade < 1) g.drawImage(old, 0, 0)
      g.globalAlpha = fade
      g.drawImage(buffer, 0, 0)
      g.globalAlpha = 1
      texture.needsUpdate = true
      if (fade >= 1) dirty = typing
    },
  }
}
