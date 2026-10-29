import usePointerGlow from '../../hooks/usePointerGlow'
import './GlowCard.css'

// A dark card whose border lights up where the cursor is. Used by Skills and Projects.
export default function GlowCard({ children, className = '' }) {
  const onPointerMove = usePointerGlow()
  return (
    <div className={`glow-card ${className}`} onPointerMove={onPointerMove}>
      {children}
    </div>
  )
}
