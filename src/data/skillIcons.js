// Icons for the skills.
// 1. LOGOS: the real logos, stored in src/data/logos.js (from the free Devicon and Simple Icons sets).
//    To add one, add its picture to logos.js and a line below: 'Skill name': 'name-used-in-logos.js'.
// 2. ICONS: a short label on a coloured tile. It is the backup for skills that have no logo,
//    like "SQL" or "REST APIs", and a skill that is in neither list gets its first two letters.
// No levels or percentages are shown, only the skills themselves.
import { LOGO_FILES } from './logos.js'

const LOGOS = {
  Java: 'java',
  JavaScript: 'javascript',
  C: 'c',
  'Python (basics)': 'python',
  'Spring Boot': 'spring-boot',
  React: 'react',
  HTML5: 'html5',
  CSS3: 'css3',
  PostgreSQL: 'postgresql',
  MySQL: 'mysql',
  Docker: 'docker',
  Git: 'git',
  GitHub: 'github',
  'VS Code': 'vscode',
  Eclipse: 'eclipse',
  'Gemini API': 'gemini',
  Gradio: 'gradio',
  Render: 'render',
}

const ICONS = {
  SQL: ['SQL', '#7d8cc4', '#ffffff'],
  'REST APIs': ['API', '#ff6c37', '#ffffff'],
  'Prompt engineering': ['PE', '#c084fc', '#ffffff'],
}

// the address of a skill's logo file, or null when it has none
export function skillLogo(name) {
  const key = LOGOS[name]
  return (key && LOGO_FILES[key]) || null
}

// the same logo as a loaded picture, for drawing on the 3D screens. Null until it has finished loading.
const pictures = {}
export function skillLogoImage(name) {
  const url = skillLogo(name)
  if (!url || typeof Image === 'undefined') return null
  if (!pictures[name]) {
    pictures[name] = new Image()
    pictures[name].src = url
  }
  const img = pictures[name]
  return img.complete && img.naturalWidth > 0 ? img : null
}

// start loading every logo straight away so they are ready when the visitor reaches them
Object.keys(LOGOS).forEach((n) => skillLogoImage(n))

// returns [label, background colour, text colour]
export function skillStyle(name) {
  return ICONS[name] || [name.slice(0, 2), '#6b4fe0', '#ffffff']
}