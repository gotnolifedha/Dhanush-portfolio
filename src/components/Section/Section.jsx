import './Section.css'

// Shared page section: centred column, top divider, and the heading style.
export default function Section({ id, className = '', children }) {
  return (
    <section className={`content-section ${className}`} id={id}>
      {children}
    </section>
  )
}
