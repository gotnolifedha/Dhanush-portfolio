import Section from '../Section/Section'
import Reveal from '../Reveal/Reveal'
import GlowCard from '../GlowCard/GlowCard'
import { projects } from '../../data/projects'
import './Projects.css'

export default function Projects() {
  return (
    <Section id="projects">
      <Reveal>
        <h2>Selected work.</h2>
      </Reveal>
      {projects.map((project) => (
        <Reveal key={project.name} delay={0.1} className="project-wrap">
          <GlowCard className="project">
            <div className="project-head">
              <h3>{project.name}</h3>
              <span>{project.type}</span>
            </div>
            <p>{project.description}</p>
            <ul className="chips" aria-label="Technologies used">
              {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
            </ul>
          </GlowCard>
        </Reveal>
      ))}
    </Section>
  )
}
