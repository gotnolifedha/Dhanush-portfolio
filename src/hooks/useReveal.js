import { useEffect, useRef, useState } from 'react'

// Tells you once an element has scrolled into view.
// Usage: const [ref, visible] = useReveal()  ->  <div ref={ref} className={visible ? 'on' : ''}>
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  // Old browsers without IntersectionObserver start as "visible" so content is never hidden.
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // animate once, then stop watching
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, visible])

  return [ref, visible]
}
