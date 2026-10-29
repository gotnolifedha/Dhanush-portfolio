import useActiveSection from '../../hooks/useActiveSection'
import './Navbar.css'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]
const IDS = LINKS.map((l) => l.id)

export default function Navbar() {
  const active = useActiveSection(IDS)

  return (
    <nav className="navbar" aria-label="Main">
      <a className="logo" href="/#home">D<span>.</span></a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={`/#${l.id}`}
            className={active === l.id ? 'active' : ''}
            aria-current={active === l.id ? 'true' : undefined}
          >
            {l.label}
          </a>
        ))}
        <a href="/dhanush.pdf" target="_blank" rel="noreferrer">Resume</a>
      </div>
    </nav>
  )
}
