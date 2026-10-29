import { useCallback } from 'react'

// Returns an onPointerMove handler. It writes the cursor position into the CSS
// variables --mx and --my on the element, so CSS can draw a glow at that spot.
export default function usePointerGlow() {
  return useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])
}
