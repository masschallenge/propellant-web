# Plain HTML

If you write your own HTML pages, Propellant takes one line to set up. You will end up with our
fonts, colors, headlines, buttons and dark and light sections on any page, in about ten minutes.

## Before you start

- A text editor and the HTML files for your site.
- The [website spec](../websites.md) open in another tab.
- Somewhere to host the pages. Any static host works.

## Part 1: Load the stylesheet

Add this line inside the `<head>` of every page, before your own stylesheets:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/dist/website.css"
/>
```

That one file loads Lato (as Propellant Sans) and Oswald, defines every Propellant color and size,
and adds the class names below. It does not restyle anything you have not given a class to.

## Part 2: Use the classes

The [website spec](../websites.md#the-propellant-stylesheet) lists every class. The ones you will
use most:

| Class | What it does |
| --- | --- |
| `propellant-text` | Body font, line height and text color. Put it on `<body>` so the whole page uses it. |
| `propellant-eyebrow` | The tracked Oswald label above a headline. |
| `propellant-headline` | Heading 1: Oswald SemiBold, in capitals. Use it once or twice per page. |
| `propellant-headline-accent` | The payoff of a two toned headline: Teal on light, Cyan on dark. |
| `propellant-title-1`, `propellant-subhead`, `propellant-title-3` | Heading 2, Heading 3 and Heading 4, in Oswald capitals. |
| `propellant-body` | Paragraph text. |
| `propellant-caption` | Small print, such as dates and notes. |
| `propellant-link` | An underlined link: Teal on light, Cyan on dark. |
| `propellant-button` | The primary pill button. Works on `<a>` and `<button>`. |
| `propellant-button propellant-button-secondary` | The secondary, outlined button. |
| `propellant-section-navy`, `propellant-section-black`, `propellant-section-deep-teal` | Dark sections. Text turns White, links Cyan and buttons Cyan outlines. |
| `propellant-section-white`, `propellant-section-warm-white`, `propellant-section-angled` | Light sections. The angled one has the pale tint rising on an angle. |
| `propellant-notch` | The downward notch below a section, in that section's color. |
| `propellant-card` | A white card with square corners and Teal titles. |
| `propellant-numbered` | A numbered block. Put the number in `propellant-numbered-number`. |
| `propellant-hero` | A dark hero with the hero overlay over a photo. |

## Part 3: Build a page

Copy this into a new file named `index.html`, open it in a browser, and change the words:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your page title</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/dist/website.css"
    />
    <style>
      body { margin: 0; }
      section { padding: 96px 24px; }
      .content { max-width: 720px; margin: 0 auto; display: grid; gap: 16px; }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; }
      .cards, .numbered { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 24px; }
      h1, h2, h3, p { margin: 0; }
      @media (max-width: 640px) { section { padding: 64px 24px; } }
    </style>
  </head>
  <body class="propellant-text">
    <section class="propellant-section-navy propellant-notch">
      <div class="content">
        <img
          src="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/logos/masschallenge-logo-horizontal-white.png"
          alt="MassChallenge"
          height="32"
        />
        <p class="propellant-eyebrow">Your eyebrow</p>
        <h1 class="propellant-headline">
          Your lead phrase <span class="propellant-headline-accent">your payoff</span>
        </h1>
        <p class="propellant-body">One or two sentences that say why this page matters.</p>
        <div class="cards">
          <div class="propellant-card">
            <h2 class="propellant-subhead">A card title</h2>
            <p class="propellant-body">A short card text.</p>
          </div>
          <div class="propellant-card">
            <h2 class="propellant-subhead">Another card</h2>
            <p class="propellant-body">A short card text.</p>
          </div>
        </div>
        <div class="actions">
          <a class="propellant-button" href="#">Your main action</a>
        </div>
      </div>
    </section>
    <section class="propellant-section-angled">
      <div class="content">
        <h2 class="propellant-headline">A section headline</h2>
        <p class="propellant-body">
          Body text with a <a class="propellant-link" href="#">link</a>.
        </p>
        <div class="numbered">
          <div class="propellant-numbered">
            <span class="propellant-numbered-number">01</span>
            <h3 class="propellant-subhead">First step</h3>
            <p class="propellant-body">What happens first.</p>
          </div>
          <div class="propellant-numbered">
            <span class="propellant-numbered-number">02</span>
            <h3 class="propellant-subhead">Second step</h3>
            <p class="propellant-body">What happens next.</p>
          </div>
        </div>
        <div class="actions">
          <a class="propellant-button" href="#">Primary action</a>
          <a class="propellant-button propellant-button-secondary" href="#">Second choice</a>
        </div>
      </div>
    </section>
  </body>
</html>
```

A similar finished page is in
[`examples/website.html`](../../examples/website.html).

## Part 4: Use the colors in your own CSS

Every color in the [website spec](../websites.md) is also available by name, so your own CSS stays
in step with Propellant:

| Spec color | Use in CSS |
| --- | --- |
| White | `var(--gray-0)` |
| Warm White | `var(--mc-warm-white)` |
| Light tint | `var(--mc-light-tint)` |
| Navy | `var(--mc-navy)` |
| Black | `var(--mc-black)` |
| Deep Teal | `var(--mc-deep-teal)` |
| Teal | `var(--mc-teal)` |
| Cyan | `var(--mc-cyan)` |
| MC Blue | `var(--mc-blue)` |
| Yellow | `var(--mc-yellow)` |
| Slate | `var(--gray-500)` |
| Line | `var(--gray-100)` |
| The MC Gradient | `var(--mc-gradient)` |

```css
.panel {
  background: var(--mc-warm-white);
  border-top: 6px solid var(--mc-black);
  padding: var(--space-6);
}
```

Keep corners square on anything that is not a button.

## Check your work

- Headlines, eyebrows, subheads and buttons are in Oswald capitals. Paragraphs are in Lato, in
  sentence case.
- On light sections, buttons are Teal pills with White text, and hovering clears the fill to a
  Teal outline.
- On dark sections, text is White, accents are Cyan, and buttons are Cyan outlines that fill with
  Teal on hover.
- Cards and photos have square corners.
- Dark and light sections alternate, with a notch where they meet.
- The page reads well on a phone.

## If something looks off

- **Fonts did not change.** Check that the link is inside `<head>` and the address ends in
  `dist/website.css`. Open the address in a browser: you should see CSS, not an error.
- **A button looks like a plain link.** Check the class is spelled `propellant-button`.
- **Your own CSS is ignored.** Load your stylesheet after the Propellant link, so yours comes last.
