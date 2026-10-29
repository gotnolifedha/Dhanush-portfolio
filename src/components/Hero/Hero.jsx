import { useCallback, useEffect, useState } from 'react'
import Button from '../Button/Button'
import './Hero.css'

const TYPEWRITER_PHRASES = [
  'Building digital experiences',
  'Crafting modern websites',
  'Creating digital solutions',
]

function useTypewriter() {
  const [text, setText] = useState(TYPEWRITER_PHRASES[0])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (motionQuery.matches) {
      setText(TYPEWRITER_PHRASES[0])
      return undefined
    }

    let phraseIndex = 0
    let characterIndex = 0
    let deleting = false
    let timeoutId

    const tick = () => {
      const phrase = TYPEWRITER_PHRASES[phraseIndex]
      characterIndex += deleting ? -1 : 1
      setText(phrase.slice(0, characterIndex))

      let delay = deleting ? 45 : 85
      if (!deleting && characterIndex === phrase.length) {
        deleting = true
        delay = 1400
      } else if (deleting && characterIndex === 0) {
        deleting = false
        phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length
        delay = 350
      }

      timeoutId = window.setTimeout(tick, delay)
    }

    timeoutId = window.setTimeout(tick, 500)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return text
}

export default function Hero() {
  const typewriterText = useTypewriter()

  // The headline's chrome sheen needs the pointer position relative to the headline itself.
  const trackHeadline = useCallback((e) => {
    const h = e.currentTarget.querySelector('.chrome')
    if (!h) return
    const r = h.getBoundingClientRect()
    h.style.setProperty('--mx', `${e.clientX - r.left}px`)
    h.style.setProperty('--my', `${e.clientY - r.top}px`)
  }, [])

  return (
    <header className="hero" id="home" onPointerMove={trackHeadline}>
      <div className="hero-inner">
        <p className="role">BCA graduate and aspiring developer</p>
        <h1 className="chrome">
          <span className="line typewriter-line" aria-label={typewriterText}>
            <span>{typewriterText}</span><span className="typewriter-cursor" aria-hidden="true" />
          </span>
        </h1>
        <p className="intro">
          Hey, I'm Dhanush. I enjoy exploring technology,
          creating web experiences and learning new things.
        </p>
        <div className="actions">
          <Button href="#contact">Let's talk</Button>
          <Button href="#projects" variant="secondary">See my work</Button>
        </div>
      </div>
      <div className="hero-footer">
        <span>Based in Bengaluru, India</span>
        <span className="status"><b aria-hidden="true" />Open to opportunities</span>
      </div>
    </header>
  )
}
