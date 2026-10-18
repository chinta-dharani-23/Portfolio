// Turns the content in src/data/portfolio.js into the page: navigation, sections and footer.
// Text that still starts with TODO is skipped, so visitors never see placeholders.
import { skillStyle } from '../data/skillIcons.js'
import { SECTION_IDS, state } from '../state.js'

const isTodo = (s) => !s || /^TODO/i.test(String(s).trim())
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const url = (u) => (/^https?:/.test(u) ? u : 'https://' + u)
const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
const hostOf = (u) => {
  try {
    return new URL(url(u)).host
  } catch (e) {
    return 'project'
  }
}

const heading = (title, tag) => `<h2>${title}</h2><div class="tag tag-sub">${tag}</div>`
const linkBtn = (u, label, cls = '') =>
  isTodo(u) ? '' : `<a class="btn ${cls}" href="${esc(url(u))}" target="_blank" rel="noopener">${label}</a>`

// A project video can be a file in the `public` folder (for example 'lab-demo.mp4') a YouTube link or a Google Drive link.
function videoHtml(p) {
  const yt = String(p.video).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  if (yt) {
    return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="${esc(p.title)} demo video" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
  }
  const drive = String(p.video).match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (drive) {
    return `<iframe src="https://drive.google.com/file/d/${drive[1]}/preview" title="${esc(p.title)} demo video" loading="lazy" allow="autoplay" allowfullscreen></iframe>`
  }
  const poster = p.image ? ` poster="${esc(p.image)}"` : ''
  return `<video src="${esc(p.video)}"${poster} controls muted loop playsinline preload="metadata" aria-label="${esc(p.title)} demo video"></video>`
}

// ---------- one builder per section ----------

function hero(d) {
  const stats = (d.stats || [])
    .map((s) => `<div class="stat"><b class="stat-num" data-to="${esc(s[0])}">${esc(s[0])}</b><span>${esc(s[1])}</span></div>`)
    .join('')
  return `<div class="tag">${esc(d.college.toUpperCase())}</div>
    <h1><span>${esc(d.name)}</span></h1>
    <div class="role">${esc(d.role)}</div>
    <p class="lead">${esc(d.intro)}</p>
    <div class="btns"><a class="btn primary" href="#projects">See my projects</a><a class="btn" href="#contact">Get in touch</a></div>
    ${stats ? `<div class="stats">${stats}</div>` : ''}`
}

function about(d) {
  return `<div class="about-head"><div class="avatar">${esc(initials(d.name))}</div><div>${heading('About me', 'WHO IS AT THE DESK')}</div></div>` +
    d.about.paragraphs.filter((p) => !isTodo(p)).map((p) => `<p>${esc(p)}</p>`).join('') +
    `<div class="facts">${d.about.facts
      .filter((f) => !isTodo(f[1]))
      .map((f) => `<div class="fact"><span>${esc(f[0])}</span><span>${esc(f[1])}</span></div>`)
      .join('')}</div>`
}

function journey(d) {
  return heading('Journey', 'INTERNSHIPS') +
    `<div class="timeline">${d.journey
      .map((j) => {
        const when = isTodo(j.period) ? '' : `<div class="tl-period">${esc(j.period)}</div>`
        const bullets = j.highlights && j.highlights.length ? `<ul>${j.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : ''
        return `<div class="tl"><i class="tl-dot"></i>${when}<h3>${esc(j.org)}</h3>
          <div class="meta">${isTodo(j.role) ? '' : esc(j.role)}</div><p>${esc(j.text)}</p>${bullets}</div>`
      })
      .join('')}</div>`
}

function projects(d) {
  return heading('Projects', 'THINGS I BUILT AND DEPLOYED') +
    d.projects
      .map((p) => {
        const shot = !isTodo(p.video) ? videoHtml(p) : p.image
          ? `<img src="${esc(p.image)}" alt="Screenshot of ${esc(p.title)}" loading="lazy">`
          : `<div class="shot-art"><b>${esc(initials(p.title))}</b><span>${esc(p.title)}</span></div>`
        const live = isTodo(p.demo) ? '' : '<em class="live">LIVE</em>'
        const buttons = linkBtn(p.demo, 'Open live demo', 'primary') + linkBtn(p.github, 'GitHub')
        return `<article class="project">
          <div class="browser"><i></i><i></i><i></i><span>${esc(isTodo(p.demo) ? 'project' : hostOf(p.demo))}</span>${live}</div>
          <div class="shot">${shot}</div>
          <div class="p-body"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p>
          <div class="chips">${p.tech.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
          ${buttons ? `<div class="btns card-btns">${buttons}</div>` : ''}</div></article>`
      })
      .join('')
}

function skills(d) {
  return heading('Skills', 'THE TOOLKIT') +
    d.skills
      .map((g) => {
        const isCert = /^certifications/i.test(g[0])
        const items = isCert
          ? `<div class="chips">${g[1].map((i) => `<span>${esc(i)}</span>`).join('')}</div>`
          : `<div class="tiles">${g[1]
              .map((name) => {
                const [glyph, bg, fg] = skillStyle(name)
                return `<div class="tile"><span class="ico" style="background:${bg};color:${fg}">${esc(glyph)}</span><b>${esc(name)}</b></div>`
              })
              .join('')}</div>`
        return `<div class="group"><h3>${esc(g[0])}</h3>${items}</div>`
      })
      .join('')
}

function contact(d) {
  const c = d.contact
  const tiles = [
    isTodo(c.email) ? '' : `<a class="link-tile" href="mailto:${esc(c.email)}"><span>Email</span><b>${esc(c.email)}</b></a>`,
    isTodo(c.github) ? '' : `<a class="link-tile" href="${esc(url(c.github))}" target="_blank" rel="noopener"><span>GitHub</span><b>${esc(c.github)}</b></a>`,
    isTodo(c.linkedin) ? '' : `<a class="link-tile" href="${esc(url(c.linkedin))}" target="_blank" rel="noopener"><span>LinkedIn</span><b>${esc(c.linkedin)}</b></a>`,
    isTodo(c.leetcode) ? '' : `<a class="link-tile" href="${esc(url(c.leetcode))}" target="_blank" rel="noopener"><span>LeetCode</span><b>${esc(c.leetcode)}</b></a>`,
  ].join('')
  return heading('Contact', 'SAY HELLO') + `<p>${esc(c.message)}</p>` +
    (tiles ? `<div class="link-tiles">${tiles}</div>` : '<p class="soft">Email, GitHub and LinkedIn links are being added.</p>')
}

const BUILDERS = { hero, about, journey, projects, skills, contact }
const SIDE = { hero: 'l', about: 'r', journey: 'l', projects: 'r', skills: 'l', contact: 'r' }
const LABEL = { hero: 'Top', about: 'About', journey: 'Journey', projects: 'Projects', skills: 'Skills', contact: 'Contact' }

// ---------- small behaviours ----------

function countUp() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.querySelectorAll('.stat-num').forEach((el) => {
    const final = el.dataset.to
    const target = parseFloat(final)
    if (reduce || Number.isNaN(target)) return
    const decimals = (final.split('.')[1] || '').length
    const start = performance.now()
    const step = (now) => {
      const k = Math.min(1, (now - start) / 1400)
      el.textContent = (target * (1 - Math.pow(1 - k, 3))).toFixed(decimals)
      if (k < 1) requestAnimationFrame(step)
      else el.textContent = final
    }
    requestAnimationFrame(step)
  })
}

function highlightActive(index) {
  const id = SECTION_IDS[index]
  document.querySelectorAll('.nav a.l').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + id))
  document.querySelectorAll('.dots button').forEach((b) => b.classList.toggle('on', b.dataset.id === id))
}

// Scroll and mouse effects. Everything here is optional polish: if it fails, the page still reads fine.
function setupEffects() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const canHover = window.matchMedia('(hover: hover)').matches

  // 1. Fade and slide in when something scrolls into view
  const items = document.querySelectorAll(
    '.panel > *:not(.timeline):not(.facts):not(.tiles):not(.link-tiles), .tl, .fact, .project, .tile, .link-tile'
  )
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'))
  } else {
    items.forEach((el) => {
      const pos = Array.prototype.indexOf.call(el.parentElement.children, el)
      el.classList.add('rv')
      el.style.setProperty('--d', Math.min(pos, 6) * 70 + 'ms')
    })
    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target
          el.classList.add('in')
          seen.unobserve(el)
          // after it has arrived, hover effects should react at once, so drop the entrance delay
          setTimeout(() => el.style.setProperty('--d', '0ms'), 1200)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
    items.forEach((el) => seen.observe(el))
  }

  // 2. Cards tilt towards the mouse and a soft light follows the pointer
  if (canHover && !reduce) {
    document.querySelectorAll('.project, .tile, .link-tile').forEach((card) => {
      const max = card.classList.contains('project') ? 7 : 12
      card.classList.add('spot', 'lift')
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return
        const r = card.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        card.classList.add('hot')
        card.style.setProperty('--ry', ((x - 0.5) * max).toFixed(2) + 'deg')
        card.style.setProperty('--rx', ((0.5 - y) * max * 0.8).toFixed(2) + 'deg')
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%')
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%')
      })
      card.addEventListener('pointerleave', () => {
        card.classList.remove('hot')
        card.style.setProperty('--rx', '0deg')
        card.style.setProperty('--ry', '0deg')
      })
    })
  }

  // 3. Progress bar at the top of the page
  const bar = document.getElementById('progress')
  if (bar) {
    let queued = false
    const draw = () => {
      queued = false
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    window.addEventListener('scroll', () => {
      if (!queued) {
        queued = true
        requestAnimationFrame(draw)
      }
    }, { passive: true })
    draw()
  }
}

export function renderPage(d) {
  const [first, ...rest] = d.name.split(' ')
  document.getElementById('nav').innerHTML =
    `<a class="brand" href="#hero">${esc(first)} <i>${esc(rest.join(' '))}</i></a>` +
    SECTION_IDS.slice(1).map((id) => `<a class="l" href="#${id}">${LABEL[id]}</a>`).join('')

  document.getElementById('main').innerHTML = SECTION_IDS.map(
    (id) => `<section class="sec ${SIDE[id] === 'r' ? 'r' : ''} ${id === 'hero' ? 'hero' : ''}" id="${id}">
      <div class="wrap"><div class="panel">${BUILDERS[id](d)}</div></div></section>`
  ).join('')

  // dots on the right edge: click to jump, and they show where you are
  const dots = document.createElement('nav')
  dots.className = 'dots'
  dots.setAttribute('aria-label', 'Sections')
  dots.innerHTML = SECTION_IDS.map((id) => `<button data-id="${id}" aria-label="${LABEL[id]}"><span>${LABEL[id]}</span></button>`).join('')
  dots.addEventListener('click', (e) => {
    const b = e.target.closest('button')
    if (b) document.getElementById(b.dataset.id).scrollIntoView({ behavior: 'smooth' })
  })
  document.body.appendChild(dots)

  document.getElementById('footer').textContent = `${d.name}, ${new Date().getFullYear()}.`
  window.addEventListener('sectionchange', (e) => highlightActive(e.detail))
  highlightActive(state.section)
  countUp()
  setupEffects()
}