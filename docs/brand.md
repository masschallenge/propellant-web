# MassChallenge brand guidelines

How MassChallenge shows up in our web products and websites: the name, the logo, color, type and
voice. Most of it is already built into Propellant, so when you use its components and tokens (the
named values for color, type and spacing), you follow these guidelines without extra work.

## The name

- Write MassChallenge as one word with a capital M and a capital C.
- Do not abbreviate it to MC in running text. The MC monogram is a logo, not a word.
- Do not add a trademark symbol in interfaces.

## Logo

The logo is the most recognizable part of the MassChallenge brand, so we treat it with care. Use
the files we supply or the `Logo` component, and never redraw, retype or recolor it.

### Lockups

A lockup is a fixed arrangement of the logo's parts. There are two.

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

A treatment is the color version of the logo you pick for a background. The one color treatments
are the same artwork in a single color, so the gap between the M and the C stays open. Each
treatment exists for both lockups.

### Clear space

Give the logo room to breathe. Keep the space around it free of text, images and edges. The clear
space on every side is half the height of the logo. A horizontal logo shown 32px tall needs 16px of clear space all around.

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
- Our grays carry a slight teal tint, so they sit comfortably next to the teals.
- Pair every status color with a word or a symbol, never color alone.
- Text stands out from its background by a contrast ratio of at least 4.5:1, and the edges of
  controls by at least 3:1, in light and dark themes. Propellant's semantic tokens (named for their
  job, not their color) are tuned for this, so in interfaces use the tokens rather than the hex
  values above.

## Typography

| Typeface | Use it for |
| --- | --- |
| Propellant Sans | All interface and body text. It is Lato 2.0 at 400, 500, 600 and 700, plus 400 italic, shipped with Propellant. |
| Oswald | Display headlines on public websites and pages, set in capitals. Never inside signed in applications. |

- Use sentence case for titles, labels and buttons. Capitals belong only to Oswald headlines and
  the wordmark.
- Use the eleven named text styles in Propellant rather than choosing sizes by eye.
- Use tabular figures (digits of equal width) wherever numbers line up in columns.
- Keep lines of running text to about 68 characters.

## Voice

MassChallenge sounds bold and human. On our website we say "We back the rare humans with the grit
to solve the toughest challenges" and "It takes a community to raise a startup." Our products
should sound like the same people: direct, plain spoken and on the side of the community we serve.
In a product the stakes are practical, so keep the confidence and drop the slogans.

- Get to the point. Use short sentences and everyday words, the way you would explain it to a
  colleague.
- Write as a person, not a system. Use "we" for MassChallenge and "you" for the person reading.
- Be confident without hype. Skip buzzwords such as leverage, seamless and robust, and skip
  exclamation marks.
- Write for the whole community. Use the words the people using the product use: programs,
  startups, applications, mentors, judges.
- Use sentence case for every title, label and button.
- Put a verb on every button that says what happens, such as Save changes or Submit application.
- When something goes wrong, say what happened and how to fix it. Do not apologize or blame.
- Use commas, colons and periods. Do not use em dashes or en dashes.

### Do and don't

| Don't write | Write |
| --- | --- |
| Leverage our seamless platform to unlock your startup's full potential! | Find mentors who know your market. |
| Users must complete all required fields prior to submission. | Add your company website to submit your application. |
| Oops! Something went wrong. | We could not save your changes. Check your connection and try again. |

## Iconography

- Icons sit beside text: their stroke follows the weight of the text and their size follows its
  text style.
- Use one icon per idea across a product.
- An icon that acts alone, without a visible label, needs an accessible name.

## The Propellant mark

Propellant has a mark of its own. It stands for the design system and nothing else: its
documentation, Storybook (our workshop for trying out components), this repository and the package.
It is drawn from the same parts as the rest of the brand. Like the MassChallenge logo, it pairs a
gray stem with a teal bowl and sets the name beside a thin divider. It is built from Propellant's
own capsule shapes, and the stem breaks into two fading capsules: the exhaust that gives the system
its name.

| File | Use it for |
| --- | --- |
| `assets/brand/propellant-lockup-color.svg` | The default, on white and light backgrounds. |
| `assets/brand/propellant-lockup-white.svg` | Deep teal, dark surfaces and dark mode. |
| `assets/brand/propellant-lockup-black.svg` | Single color print and light backgrounds the color version does not suit. |
| `assets/brand/propellant-mark-*.svg` | The mark alone, in the same three treatments, where the name is already clear. |
| `assets/brand/propellant-icon.svg` | Favicons and app icons: the mark on a deep teal tile with concentric corners. |

- Use the Propellant mark only to refer to the design system. Never use it in place of the
  MassChallenge logo in a product or website, and never place the two marks so they read as one.
- The clear space, minimum size and things to avoid for the MassChallenge logo apply to this mark
  too. Keep the mark and the icon at least 16px tall, and the lockup at least 24px tall.
