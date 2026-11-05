# MassChallenge brand guidelines

These guidelines cover how the MassChallenge brand appears in web applications and websites
built with Propellant: the name, the logo, color, type and voice. Propellant puts most of them
into code, so a product that uses its components and tokens follows them by default.

## The name

- Write MassChallenge as one word with a capital M and a capital C.
- Do not abbreviate it to MC in running text. The MC monogram is a logo, not a word.
- Do not add a trademark symbol in interfaces.

## Logo

The logo is the most recognizable part of the brand. Use the supplied files or the `Logo`
component, and never redraw, retype or recolor it.

### Lockups

| Lockup | Use it for | Files |
| --- | --- | --- |
| Horizontal | The default. Headers, sign in pages, footers, documents and anywhere the full name should be read. | `assets/logos/masschallenge-logo-horizontal-*.png` |
| Monogram | Small spaces where the horizontal lockup would fall below its minimum size: favicons, app icons, avatars and compact navigation. | `assets/logos/masschallenge-logo-monogram-*.png` |

The horizontal lockup is the MC monogram, a thin vertical divider and the MASSCHALLENGE wordmark.
Keep the three parts together, at the proportions in the files. Use the monogram on its own only
where the MassChallenge name is already clear from the context.

### Logo colors

| Part | Color |
| --- | --- |
| M and wordmark | Gray `#828486` |
| C and divider | Teal `#17ACBC` |

These are the colors of the logo files. They belong to the logo only; interface colors come from
the palette below.

### Treatments

| Treatment | Use it on | Files and component |
| --- | --- | --- |
| Full color | White and light neutral backgrounds, such as the page and content surfaces. | `*-color.png`, `<Logo />` |
| White | The brand teal, dark surfaces, dark mode and photographs dark enough to keep the logo legible. | `*-white.png`, `<Logo treatment="white" />` |
| Black | Places where only one dark color is available, such as single color print, and light backgrounds that the full color logo does not suit. | `*-black.png`, `<Logo treatment="black" />` |

The one color treatments are the same artwork in a single color, so the gap between the M and
the C stays open.

### Clear space

Keep space around the logo free of text, images and edges. The clear space on every side is half
the height of the logo. A horizontal logo shown 32px tall needs 16px of clear space all around.

### Minimum size

| Lockup | Smallest height on screen |
| --- | --- |
| Horizontal | 24px. Below this the wordmark stops being readable; use the monogram instead. |
| Monogram | 16px. |

The `Logo` component renders at 24px tall by default. Size it with a height class such as
`h-8`; the width follows.

### Placement

- Place the logo at the start of a header or sidebar, aligned with the content below it.
- In a product, link the logo to the product's home.
- Give the logo an accessible name of MassChallenge. When the name is written right beside it, mark
  the logo as decorative with `<Logo label="" />`.

### Things to avoid

- Do not change the logo colors or color the monogram and wordmark differently from the files.
- Do not stretch, squash, rotate, skew or crop the logo.
- Do not add shadows, glows, outlines, gradients or other effects.
- Do not rearrange the lockup, resize its parts or remove the divider.
- Do not place the full color logo on the brand teal, dark backgrounds or busy photographs; use the
  white treatment.
- Do not recreate the wordmark in a font or type the name in its place.
- Do not place the logo inside a shape or container that crowds its clear space.
- Do not use the monogram as a letter in a word or headline.

## Color

### Brand palette

| Name | Hex | Role |
| --- | --- | --- |
| Deep teal | `#044451` | Brand surfaces, such as the panel of a sign in page |
| Teal | `#065E6F` | The primary interactive color in light mode |
| Mid teal | `#068DA4` | Supporting accents |
| Bright teal | `#0FACBD` | Accents on dark surfaces |
| Pale teal | `#D9F6FA` | Tinted backgrounds |
| Mist | `#F3FBFC` | The lightest tint |
| Magenta | `#BF0261` | Destructive actions and errors |
| Yellow | `#FFC801` | Highlights, such as search matches and new items |

### Using color

- Teal means you can act on something: buttons, links, selected controls and focus. Do not use it
  for headings, names or numbers.
- Magenta means something is wrong or cannot be undone. Never use it decoratively.
- Yellow highlights. Always set dark text on it.
- Neutrals carry a slight teal tint, so grays and teals sit together comfortably.
- Pair every status color with a word or a symbol, never color alone.
- Text meets a contrast of at least 4.5:1, and the edges of controls at least 3:1, in light and
  dark themes. Propellant's tokens are tuned for this, so use the tokens rather than the hex
  values above in interfaces.

## Typography

| Typeface | Use it for |
| --- | --- |
| Propellant Sans | All interface and body text. It is Lato 2.0 at 400, 500, 600 and 700, plus 400 italic, shipped with Propellant. |
| Oswald | Display headlines on public websites and pages, set in capitals. Never inside signed in applications. |

- Use sentence case for titles, labels and buttons. Capitals belong only to Oswald headlines and
  the wordmark.
- Use the eleven named text styles in Propellant rather than choosing sizes by eye.
- Use tabular figures wherever numbers line up in columns.
- Keep lines of running text to about 68 characters.

## Voice

- Write plainly, the way a knowledgeable person talks. Prefer short sentences.
- Use the words the people using the product use: programs, startups, applications, mentors,
  judges.
- Put a verb on every button that says what happens, such as Save changes or Submit application.
- When something goes wrong, say what happened and how to fix it. Do not apologize or blame.
- Use commas, colons and periods. Do not use em dashes or en dashes.

## Iconography

- Icons sit beside text: their stroke follows the weight of the text and their size follows its
  text style.
- Use one icon per idea across a product.
- An icon that acts alone, without a visible label, needs an accessible name.
