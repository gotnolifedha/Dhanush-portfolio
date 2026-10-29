import Section from '../Section/Section'
import Reveal from '../Reveal/Reveal'
import './Contact.css'
import emailjs from '@emailjs/browser'
import { useState } from 'react'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function Contact() {
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('from_name') || '').trim()
    const email = String(formData.get('from_email') || '').trim()
    const message = String(formData.get('message') || '').trim()

    if (!name || !email || !message) {
      setStatus({ type: 'error', message: 'Please complete your name, email, and message.' })
      return
    }

    if (!emailPattern.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    console.debug('[EmailJS] configuration', {
      serviceId: emailjsServiceId,
      templateId: emailjsTemplateId,
      publicKeyLoaded: Boolean(emailjsPublicKey),
      templateVariables: ['from_name', 'from_email', 'message'],
    })

    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      setStatus({ type: 'error', message: 'The contact form is not configured yet. Please try again later.' })
      return
    }

    setIsSending(true)
    setStatus({ type: '', message: '' })

    try {
      await emailjs.sendForm(
        emailjsServiceId,
        emailjsTemplateId,
        form,
        { publicKey: emailjsPublicKey },
      )
      form.reset()
      setStatus({ type: 'success', message: 'Your message was sent successfully.' })
    } catch (error) {
      console.error('[EmailJS] send failed', {
        status: error?.status,
        text: error?.text,
      })
      setStatus({ type: 'error', message: 'We could not send your message. Please try again.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Section id="contact" className="contact">
      <Reveal>
        <h2>Have an opportunity?<br />Let's connect<span>.</span></h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="lede">I'm ready to learn, contribute and grow.</p>
      </Reveal>
      <Reveal delay={0.2} className="contact-form-wrap">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-form-fields">
            <label>
              <span>Name</span>
              <input id="contact-name" name="from_name" type="text" placeholder="Your name" autoComplete="name" required />
            </label>
            <label>
              <span>Email</span>
              <input
                name="from_email"
                type="email"
                placeholder="you@gmail.com"
                autoComplete="email"
                required
              />
            </label>
          </div>
          <label>
            <span>Your Message</span>
            <textarea id="contact-message" name="message" placeholder="Tell me a little about your project..." rows="5" required />
          </label>
          {status.message && <p className={`form-status form-status-${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p>}
          <button className="btn btn-primary contact-submit" type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send Message'}</button>
        </form>
      </Reveal>
    </Section>
  )
}
