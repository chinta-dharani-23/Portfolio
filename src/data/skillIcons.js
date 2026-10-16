// Colours and short labels for the skill icons. A skill that is not listed here still works:
// it gets its first two letters on a violet tile. No levels or percentages are shown, only the skills themselves.
const ICONS = {
  Java: ['Jv', '#f89820', '#1b1206'],
  JavaScript: ['JS', '#f7df1e', '#1b1b1b'],
  SQL: ['SQL', '#7d8cc4', '#ffffff'],
  C: ['C', '#6d8bd9', '#ffffff'],
  'Python (basics)': ['Py', '#4b8bbe', '#ffffff'],
  'Spring Boot': ['SB', '#6db33f', '#10200a'],
  React: ['Re', '#61dafb', '#08202a'],
  'REST APIs': ['API', '#ff6c37', '#ffffff'],
  HTML5: ['H5', '#e34f26', '#ffffff'],
  CSS3: ['C3', '#1572b6', '#ffffff'],
  PostgreSQL: ['Pg', '#336791', '#ffffff'],
  MySQL: ['My', '#00758f', '#ffffff'],
  Docker: ['Dk', '#2496ed', '#ffffff'],
  Render: ['Rn', '#46e3b7', '#06231b'],
  Git: ['Git', '#f05032', '#ffffff'],
  GitHub: ['GH', '#e8e4f5', '#14101f'],
  'Gemini API': ['Gem', '#8e75ff', '#ffffff'],
  Gradio: ['Gr', '#ff9a2e', '#2a1700'],
  'Prompt engineering': ['PE', '#c084fc', '#ffffff'],
  'VS Code': ['VS', '#2f80ed', '#ffffff'],
  Eclipse: ['Ec', '#2c2255', '#ffffff'],
}

// returns [label, background colour, text colour]
export function skillStyle(name) {
  return ICONS[name] || [name.slice(0, 2), '#6b4fe0', '#ffffff']
}
