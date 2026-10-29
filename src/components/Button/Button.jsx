import './Button.css'

export default function Button({ href, type = 'button', variant = 'primary', target, rel, children }) {
  if (!href) {
    return <button className={`btn btn-${variant}`} type={type}>{children}</button>
  }

  return (
    <a className={`btn btn-${variant}`} href={href} target={target} rel={rel}>
      {children}
    </a>
  )
}
