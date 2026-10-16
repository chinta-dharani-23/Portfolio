// A tiny shared note: which section the visitor is on right now (0 = hero ... 5 = contact).
// The camera path sets it; the laptop screen, the glow and the side dots read it.
export const SECTION_IDS = ['hero', 'about', 'journey', 'projects', 'skills', 'contact']

export const state = { section: 0 }

export function setSection(index) {
  if (index === state.section) return
  state.section = index
  window.dispatchEvent(new CustomEvent('sectionchange', { detail: index }))
}
