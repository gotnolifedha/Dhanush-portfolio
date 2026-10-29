# Learning guide: how this portfolio is built

Run it: `npm install`, then `npm run dev`, then open the link it prints.
Edit any file below and the browser updates instantly.

## File structure

```
my-portfolio/
├── index.html                 The one real HTML page. Has <div id="root"> and loads main.jsx
├── package.json               Project name, scripts (dev, build) and the libraries used
├── vite.config.js             Vite settings (the tool that runs and builds the site)
├── public/                    Files served as-is (favicon)
└── src/
    ├── main.jsx               START HERE. Loads the CSS and mounts <App /> into #root
    ├── App.jsx                The order of the page: Navbar, Hero, About, Skills, ...
    │
    ├── styles/
    │   ├── variables.css      Colours, fonts, sizes (design tokens). Change the look here
    │   └── global.css         Page-wide resets and base styles
    │
    ├── data/                  Content as plain JavaScript lists, no layout code
    │   ├── skills.js          Add a skill here and a card appears
    │   └── projects.js        Add a project here and a card appears
    │
    ├── hooks/                 Reusable logic (functions that start with "use")
    │   ├── useReveal.js         "Has this element scrolled into view yet?"
    │   ├── useActiveSection.js  "Which section am I reading?" (highlights the nav link)
    │   └── usePointerGlow.js    Passes the mouse position to CSS for the glowing border
    │
    └── components/            One folder per piece of the page: JSX + its own CSS
        ├── Navbar/            Sticky top bar, highlights the current section
        ├── Hero/              Big chrome headline, buttons, status line
        ├── Starfield/         The animated star background (uses <canvas>)
        ├── About/  Skills/  Projects/  Contact/  Footer/
        │
        └── Shared building blocks used by the sections above:
            ├── Section/       Standard section wrapper (spacing, divider, heading style)
            ├── Reveal/        Wrap anything to make it slide in when scrolled to
            ├── GlowCard/      The dark card with the cursor-following border
            └── Button/        The primary and secondary buttons
```

## How the pieces connect

```
index.html -> main.jsx -> App.jsx -> Navbar, Hero, About, Skills, Projects, Contact, Footer
                                          |
   data/skills.js ----------------------> Skills --uses--> Section, Reveal, GlowCard
   data/projects.js --------------------> Projects --uses--> Section, Reveal, GlowCard
   hooks/useReveal.js ------------------> Reveal
   hooks/usePointerGlow.js -------------> GlowCard
   hooks/useActiveSection.js -----------> Navbar
```

## Where the transitions are

| Effect | Where | How it works |
| --- | --- | --- |
| Headline, intro and buttons rise on load | `Hero/Hero.css` | CSS `@keyframes rise` plays once when the page loads |
| Sections slide in as you scroll | `Reveal/Reveal.jsx` + `Reveal.css` | `useReveal` watches the element. When it enters the screen it gets the class `is-visible`, and CSS `transition` animates opacity and position |
| Cards appear one after another | `Skills/Skills.jsx` | `delay={i * 0.08}` gives each card a slightly later start |
| Nav underline slides in, stays on the current section | `Navbar/Navbar.css` | `transform: scaleX(0)` to `scaleX(1)` with a `transition` |
| Buttons lift on hover | `Button/Button.css` | `transform: translateY(-2px)` with a `transition` |
| Border glow follows the mouse | `GlowCard/GlowCard.css` | The hook writes `--mx` and `--my`, and a `radial-gradient` is drawn at that point |
| Headline shine follows the mouse | `Hero/Hero.css` | Same idea, applied to text with `background-clip: text` |
| Stars drift and shift with the mouse | `Starfield/Starfield.jsx` | Drawn every frame on a `<canvas>` with `requestAnimationFrame` |
| Smooth scrolling to a section | `styles/global.css` | `scroll-behavior: smooth` |

All motion switches off for people who turned on "reduce motion" in their system
(`@media (prefers-reduced-motion: reduce)` in each CSS file).

## Ideas to learn from

1. **Change the colour.** In `styles/variables.css`, change `--ice` to `#ff6bd6` and watch the whole site change.
2. **Add a skill.** Add `{ name: 'Git', note: 'Version control' }` to `data/skills.js`. No other file needs to change.
3. **Add a project.** Copy the SUMOS object in `data/projects.js` and edit it.
4. **Slow down a transition.** In `Reveal/Reveal.css`, change `0.8s` to `1.6s`.
5. **Make a new section.** Copy the `Footer` folder, rename it, then import and place it in `App.jsx`.
6. **Add a skill icon.** In `Skills.jsx`, add an emoji or icon above `<h3>` and style it in `Skills.css`.

## Concepts used (search these to learn more)

- **Component**: a function that returns JSX, such as `function Footer() { return ... }`
- **Props**: inputs to a component, such as `<Button href="#contact" variant="secondary">`
- **`children`**: whatever you put between a component's opening and closing tags (see `Reveal`)
- **`.map()`**: turns a list of data into a list of components (see `Skills.jsx`)
- **`key`**: a unique label React needs on each item in a list
- **Hooks**: `useState`, `useEffect`, `useRef`, `useCallback`, and your own like `useReveal`
- **Colocated CSS**: each component's CSS sits beside its JSX so you can find it fast
- **CSS variables**: `var(--ice)` reads a value defined in `variables.css`
- **IntersectionObserver**: a browser feature that tells you when an element enters the screen
