import useReveal from '../../hooks/useReveal'
import './Reveal.css'

// Wrap anything in <Reveal> and it slides up and fades in when scrolled into view.
// `delay` (seconds) staggers neighbours so they don't all appear at once.
export default function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--delay': `${delay}s` }}
    >
      {children}
    </div>
  )
}
