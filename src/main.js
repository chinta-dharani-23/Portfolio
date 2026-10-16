// Entry point: fills the page with your content, then starts the 3D desk behind it.
import './styles.css'
import { PORTFOLIO } from './data/portfolio.js'
import { renderPage } from './ui/sections.js'
import { startScene } from './scene/index.js'

renderPage(PORTFOLIO)

try {
  startScene(document.getElementById('gl'), PORTFOLIO)
} catch (err) {
  // If a device cannot draw 3D, the page still works as a normal portfolio.
  console.warn('3D scene could not start:', err)
  document.body.classList.add('no-3d')
}
