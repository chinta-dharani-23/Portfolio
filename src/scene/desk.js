// The desk itself: a rounded top and a darker base underneath.
import { std, slab } from './helpers.js'

export function createDesk(rig) {
  const top = slab(7.2, 4.6, 0.34, 0.5, std({ color: 0x1e1745, roughness: 0.5, metalness: 0.05, envMapIntensity: 0.3 }), 0.06)
  top.position.y = -0.17
  rig.add(top)

  const base = slab(6.2, 3.6, 0.5, 0.45, std({ color: 0x120d26, roughness: 0.6, metalness: 0.2, envMapIntensity: 0.3 }), 0.05)
  base.position.y = -0.6
  rig.add(base)
}
