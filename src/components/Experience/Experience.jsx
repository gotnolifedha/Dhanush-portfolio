import Section from '../Section/Section'
import Reveal from '../Reveal/Reveal'
import GlowCard from '../GlowCard/GlowCard'
import './Experience.css'

export default function Experience() {
  return (
    <Section id="experience" className="experience">
      <Reveal>
        <h2>Internship experience.</h2>
      </Reveal>
      <Reveal delay={0.1} className="experience-wrap">
        <GlowCard className="experience-card">
          <div className="experience-head">
            <div>
              <h3>Jyesta</h3>
              <p className="experience-role">Full-Stack Development Intern</p>
            </div>
            <span className="experience-duration">2 months</span>
          </div>
          <p>
            Gained exposure to full-stack development and web application workflows,
            with Python as the primary technology.
          </p>
          <ul className="chips" aria-label="Technologies used">
            <li>Python</li>
          </ul>
        </GlowCard>
      </Reveal>
    </Section>
  )
}
