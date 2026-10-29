import Section from '../Section/Section'
import Reveal from '../Reveal/Reveal'
import './About.css'

export default function About() {
  return (
    <Section id="about" className="about">
      <Reveal>
        <h2>Curious mind.<br />Always learning.</h2>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="lede">
          I'm a BCA graduate building my skills in web development,
          programming and technology. I'm looking forward to working
          on meaningful projects and growing with a team.
        </p>
      </Reveal>
    </Section>
  )
}
