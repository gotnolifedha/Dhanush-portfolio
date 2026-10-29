import Section from '../Section/Section'
import Reveal from '../Reveal/Reveal'
import GlowCard from '../GlowCard/GlowCard'
import { skills } from '../../data/skills'
import './Skills.css'

export default function Skills() {
  return (
    <Section id="skills" className="skills-section">
      <div className="skills-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Reveal>
        <h2>Skills I'm building.</h2>
      </Reveal>
      <div className="skills-grid">
        {skills.map((skill, i) => (
          // delay grows with the index, so the cards ripple in one after another
          <Reveal key={skill.name} delay={i * 0.08}>
            <GlowCard>
              <h3>{skill.name}</h3>
              <p>{skill.note}</p>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
