# Plain HTML

If you write your own HTML pages, Propellant takes one line to set up. You will end up with our
fonts, colors, headings, buttons and brand sections on any page, in about ten minutes.

## Before you start

- A text editor and the HTML files for your site.
- The [website spec](../websites.md) open in another tab.
- Somewhere to host the pages. Any static host works.

## Part 1: Load the stylesheet

Add this line inside the `<head>` of every page, before your own stylesheets:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css"
/>
```

That one file loads Lato (as Propellant Sans) and Oswald, defines every Propellant color and size,
and adds the class names below. It does not restyle anything you have not given a class to.

## Part 2: Use the classes

| Class | What it does |
| --- | --- |
| `propellant-text` | Body font and text color. Put it on `<body>` so the whole page uses it. |
| `propellant-headline` | Heading 1: Oswald, in capitals. Use it once or twice per page. |
| `propellant-title-1`, `propellant-title-2`, `propellant-title-3` | Heading 2, Heading 3 and Heading 4. |
| `propellant-body` | Paragraph text. |
| `propellant-caption` | Small print, such as dates and notes. |
| `propellant-link` | A teal, underlined link. |
| `propellant-button` | The primary pill button. Works on `<a>` and `<button>`. |
| `propellant-button propellant-button-secondary` | The secondary button. |
| `propellant-brand-band` | A Deep teal section. Buttons and links inside it turn white. |

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
      href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css"
    />
    <style>
      body { margin: 0; }
      section { padding: 96px 24px; }
      .content { max-width: 720px; margin: 0 auto; display: grid; gap: 16px; }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; }
      @media (max-width: 640px) { section { padding: 64px 24px; } }
    </style>
  </head>
  <body class="propellant-text">
    <section class="propellant-brand-band">
      <div class="content">
        <img
          src="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-white.png"
          alt="MassChallenge"
          height="32"
        />
        <h1 class="propellant-headline">Your big headline</h1>
        <p class="propellant-body">One or two sentences that say why this page matters.</p>
        <div class="actions">
          <a class="propellant-button" href="#">Your main action</a>
        </div>
      </div>
    </section>
    <section>
      <div class="content">
        <h2 class="propellant-title-1">A section heading</h2>
        <p class="propellant-body">
          Body text with a <a class="propellant-link" href="#">link</a>.
        </p>
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

Every color and size in the [website spec](../websites.md) is also available by name, so your own
CSS stays in step with Propellant:

| Spec color | Use in CSS |
| --- | --- |
| Ink | `var(--label)` |
| Slate | `var(--label-secondary)` |
| Teal | `var(--tint)` |
| Deep teal | `var(--brand-surface)` |
| Mist | `var(--teal-50)` |
| White | `var(--bg)` |
| Line | `var(--separator)` |
| Yellow | `var(--highlight)` |

```css
.card {
  background: var(--bg);
  border: 1px solid var(--separator);
  border-radius: var(--corner-lg);
  padding: var(--space-6);
}
```

## Check your work

- The big headline is in Oswald capitals, and everything else is in Lato.
- Buttons are teal pills with white text and turn Deep teal on hover.
- Text on the Deep teal section is white, and its button is white with Deep teal text.
- The page reads well on a phone.

## If something looks off

- **Fonts did not change.** Check that the link is inside `<head>` and the address ends in
  `dist/website.css`. Open the address in a browser: you should see CSS, not an error.
- **A button looks like a plain link.** Check the class is spelled `propellant-button`.
- **Your own CSS is ignored.** Load your stylesheet after the Propellant link, so yours comes last.
