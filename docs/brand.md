# MassChallenge brand guidelines

How MassChallenge shows up everywhere we make things: web products, websites, Office and Google
Workspace files, print, slides and social graphics. It covers the name, the logo, color, type,
voice, messaging, contact and legal details, and the graphic devices. Most of the interface side is
already built into Propellant, so when you use its components and tokens (the named values for
color, type and spacing), you follow these guidelines without extra work.

## The name

- Write MassChallenge as one word with a capital M and a capital C.
- Do not abbreviate it to MC in running text. The MC monogram is a logo, not a word.
- Do not add a trademark symbol to the name or the logo.

## Logo

The logo is the most recognizable part of the MassChallenge brand, so we treat it with care. Use
the files we supply or the `Logo` component, and never redraw, retype or recolor it.

### Files

The logo files are in `assets/logos`. Use them as supplied, and do not trace or redraw them.

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

| Part | Color | Hex | Print CMYK (C M Y K) |
| --- | --- | --- | --- |
| M and wordmark | Logo gray | `#828486` | 53 44 43 7 |
| C and divider | Logo teal | `#17ACBC` | 77 11 27 0 |

These are the colors of the logo files. They belong to the logo artwork only; everything else
takes its colors from the palette below. The CMYK values are calculated, as explained under
[Print color](#print-color).

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

The web palette is the standard everywhere: web, Office, Google Workspace, print, the studio and
the skill. The Propellant tokens hold the same values, so the token column below is the name to use
in code.

### Brand palette

| Name | Hex | Print CMYK (C M Y K) | Token | Role |
| --- | --- | --- | --- | --- |
| Deep teal | `#044451` | 100 64 53 50 | `--teal-900` | Brand surfaces, such as the panel of a sign in page |
| Teal | `#065E6F` | 100 55 45 24 | `--teal-800` | The primary interactive color in light mode |
| Mid teal | `#068DA4` | 87 31 31 2 | `--teal-600` | Supporting accents |
| Bright teal | `#0FACBD` | 78 11 26 0 | `--teal-400` | Accents on dark surfaces |
| Pale teal | `#D9F6FA` | 13 0 2 0 | `--teal-100` | Tinted backgrounds |
| Mist | `#F3FBFC` | 3 0 1 0 | `--teal-50` | The lightest tint |
| Magenta | `#BF0261` | 21 100 42 5 | `--magenta-600` | Destructive actions and errors |
| Yellow | `#FFC801` | 0 22 100 0 | `--yellow-400` | Highlights, such as search matches and new items |
| Ink | `#1E282B` | 81 66 63 83 | `--gray-800` | Body text and headings |
| Slate | `#4B575B` | 73 57 55 35 | `--gray-500` | Secondary text, such as captions |
| White | `#FFFFFF` | 0 0 0 0 | `--gray-0` | Page background |

Two names had different values in different places. They are now one value everywhere:

- Magenta is `#BF0261`. The darker `#A30253`, which Office files used, stays only as the web token
  `--magenta-700`, for critical text on light surfaces in interfaces. Do not call it Magenta or use
  it in documents, slides or print.
- Mist is `#F3FBFC`. The cooler `#F3F6F7`, which Office files used under the name Mist, is
  Propellant's `--gray-50`. It is not Mist.

### Supporting neutrals

Two more grays from the Propellant tokens, for lines and charts.

| Name | Hex | Print CMYK (C M Y K) | Token | Use it for |
| --- | --- | --- | --- | --- |
| Gray 100 | `#DBE1E3` | 13 7 8 0 | `--gray-100` | Rules and table lines |
| Gray 300 | `#848F92` | 53 38 39 4 | `--gray-300` | The sixth chart color |

### Print color

The CMYK values in this guide are calculated from the sRGB values with the Artifex CMYK SWOP profile
(US web coated), relative colorimetric intent, rounded to whole percent. They are a starting point,
not a measured match, so check a printed proof before a large run.

### Charts

Use the chart colors in this order, everywhere: Teal, Yellow, Slate, Bright teal, Deep teal, Gray
300. Label the data directly, on or beside each line, bar or slice, rather than relying on a legend
and color alone.

### How much of each

White and the neutrals cover most of the page. The teals are for brand surfaces and things you can
act on. Magenta and Yellow appear only a little. This is the standard mix, by share of a typical
page or screen:

| Color | Share | Why |
| --- | --- | --- |
| White | 50% | Most of the page is white. |
| Ink | 12% | Text on light backgrounds. |
| Slate | 6% | Secondary text. |
| Mist | 8% | The lightest tint, for quiet panels. |
| Pale teal | 6% | Tinted backgrounds. |
| Deep teal | 8% | Brand surfaces and big brand moments. |
| Teal | 5% | Things you can act on. |
| Mid teal | 2% | Supporting accents. |
| Bright teal | 1% | Accents on dark surfaces. |
| Yellow | 1% | Highlights only. |
| Magenta | 1% | Only when something is wrong. |

### Using color

These rules are written for products and interfaces, and the Magenta and Yellow rules hold
everywhere, including the graphic devices below.

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
| Propellant Sans | All text: interfaces, documents, slides, sheets and email. It is Lato 2.0 at 400, 500, 600 and 700, plus 400 italic, shipped with Propellant. |
| Oswald | Display headlines, set in capitals, on public pages, slides, social graphics and document titles. Never inside signed in product screens. |

### Where each font applies

| Where | Propellant Sans (Lato) | Oswald |
| --- | --- | --- |
| Web products and websites | Shipped with Propellant as Propellant Sans. Builders that do not use Propellant pick Lato. | Shipped with Propellant through `--type-family-brand`, for public pages only. |
| Microsoft Office | Install Lato. | Install Oswald. |
| Google Workspace | Lato, from Google Fonts. | Oswald, from Google Fonts. |
| Email | Lato, falling back to Arial, Helvetica, sans-serif. | Not part of the email standard. |

- Use sentence case for titles, labels and buttons. Capitals belong only to Oswald headlines, the
  wordmark and the labels of the graphic devices below.
- Use the eleven named text styles in Propellant rather than choosing sizes by eye.
- Use tabular figures (digits of equal width) wherever numbers line up in columns.
- Keep lines of running text to about 68 characters.

## Voice

MassChallenge sounds bold and ambitious. Our primary line is "We back the rare humans with the grit
to solve the toughest challenges," and we are "a global network turning bold ideas into outcomes
that matter." Our products should sound like the same
people: direct, plain spoken and on the side of the founders we serve. In a product the stakes are
practical, so keep the confidence and drop the slogans.

What that sounds like:

- **Bold and ambitious.** "Rare humans", "grit", "toughest challenges".
- **Founder first.** "We back the rare humans with the grit to solve the toughest challenges."
- **About outcomes and access.** "From proof to scale", "outcomes that matter", "access to the
  people and power that move markets".
- **Short declarative headlines in capitals.** On public pages, in Oswald.

"It takes a community to raise a startup." is not a MassChallenge line. It is a founder's testimonial. Never present it
as a tagline or as our words.

- Get to the point. Use short sentences and everyday words, the way you would explain it to a
  colleague.
- Write as a person, not a system. Use "we" for MassChallenge and "you" for the person reading.
- Be confident without hype. Skip buzzwords such as leverage, seamless and robust, and skip
  exclamation marks.
- Write for the whole community. Use the words the people using the product use: programs,
  startups, applications, mentors, judges.
- Use sentence case for every title, label and button in a product.
- Put a verb on every button that says what happens, such as Save changes or Submit application.
- When something goes wrong, say what happened and how to fix it. Do not apologize or blame.
- Use commas, colons and periods. Do not use em dashes or en dashes.

### Do and don't

| Don't write | Write |
| --- | --- |
| Leverage our seamless platform to unlock your startup's full potential! | Find mentors who know your market. |
| Users must complete all required fields prior to submission. | Add your company website to submit your application. |
| Oops! Something went wrong. | We could not save your changes. Check your connection and try again. |

## Messaging

Quote these lines as written.

### Primary line

"We back the rare humans with the grit to solve the toughest challenges."

### Positioning

- "Born in Massachusetts. Built for the world."
- "A global network turning bold ideas into outcomes that matter."

### Boilerplate

Each version adds to the one before. Use the shortest that fits.

**Short**

> Born in Massachusetts and built for the world, MassChallenge backs the rare humans with the grit
> to solve the world's hardest challenges.

**Medium**

> Born in Massachusetts and built for the world, MassChallenge backs the rare humans with the grit
> to solve the world's hardest challenges. What began in New England's innovation corridor is now a
> global network connecting startups, experts, and partners across industries and continents, all
> working to turn bold ideas into outcomes that matter.

**Long**

> Born in Massachusetts and built for the world, MassChallenge backs the rare humans with the grit
> to solve the world's hardest challenges. What began in New England's innovation corridor is now a
> global network connecting startups, experts, and partners across industries and continents, all
> working to turn bold ideas into outcomes that matter. We are the earliest believer in founders
> tackling complex, regulated, and high-stakes problems, providing the infrastructure, access, and
> catalytic capital to move from proof to scale. Since 2009, MassChallenge has supported more than
> 5,000 startups across five Challenge Areas, helping them raise $16B+ in funding, create 90K jobs,
> and collaborate with more than 500 partners worldwide.

### Approved figures

As of November 2026.

| Figure | Value |
| --- | --- |
| Founded | 2009 |
| Startups supported | More than 5,000 |
| Challenge Areas | Five |
| Funding raised by those startups | $16B+ |
| Jobs created | 90K |
| Partners | More than 500 |

Always show the as-of date with a figure, for example "more than 5,000 startups (as of November
2026)", or in a note under a chart or slide.

### Challenge Areas

- Healthcare and Life Sciences
- Security and Resiliency
- Sustainable Food Systems
- Climate
- Global Financial Systems

### Accelerators

Traction, Challenge and Breakthrough Bio.
Corporate Partners is the partnership offer, not an accelerator.

### Audiences

Our network has three audiences: Founders, Experts and Collaborators. In products, keep
the words people use there: startups, applications, mentors, judges and programs. A mentor or a
judge is one kind of expert.

### Leadership

Cait Brumme, CEO of MassChallenge.

### Naming rules

- Write the name as in [The name](#the-name): MassChallenge, one word, no trademark symbol.
- Write the Challenge Areas with "and" in running text. Use "&" only in tight labels.
- Write the Challenge Areas and the accelerator names exactly as listed above.
- Say founders, experts and collaborators when talking about the network, and the product words
  (startups, mentors, judges) inside a product.

## Contact, social and legal

### Contact

Email: [contact@masschallenge.org](mailto:contact@masschallenge.org)

### Social

| Channel | Link |
| --- | --- |
| LinkedIn | [linkedin.com/company/masschallenge](https://www.linkedin.com/company/masschallenge) |
| Instagram | [instagram.com/masschallenge](https://www.instagram.com/masschallenge/) |
| X | [x.com/MassChallenge](https://x.com/MassChallenge) |
| YouTube | The MassChallenge YouTube channel. |

### Footer links

| Link | Address |
| --- | --- |
| Careers | [masschallenge.org/careers](https://masschallenge.org/careers/) |
| Ways to Support | [masschallenge.org/give](https://masschallenge.org/give/) |
| Privacy Policy | [masschallenge.org/privacy-notice](https://masschallenge.org/privacy-notice/) |
| Terms of Use | [masschallenge.org/website-terms-of-use](https://masschallenge.org/website-terms-of-use/) |

### Copyright and trademarks

- Copyright line: "© MassChallenge 2026". Use the current year.
- Do not put a trademark symbol on the name or the logo.

### Offices

| Office | Address |
| --- | --- |
| Boston, MA | 10 Fan Pier Blvd, 3rd Floor, Boston, MA 02210 USA |
| Dallas, TX | 3060 Pegasus Park Dr, Building 6, Dallas, TX 75247 |
| Israel | 10 Jaffa Street, Jerusalem, 9434251, Israel |
| Switzerland | Chemin du Closel 5, 1020 Renens, Switzerland |
| United Kingdom | Royal Docks Centre for Sustainability, 4-6 University Way, London E16 2RD, United Kingdom |

## Graphic devices

These are the standard graphic devices. Build them from the palette and the logo files, and never
redraw the logo. The brand guide at
[propellant.masschallenge.org/brand](https://propellant.masschallenge.org/brand/#logo) shows each
one.

### Teal duotone

A photo washed in a gradient from Deep teal to Bright teal. Use it for backgrounds behind text and
for section headers.

### Hexagon network frame

A circular photo crop set inside a pale teal network of hexagons and lines. Use it for a single
photo beside text.

### Geometric pattern

The brand pattern: Bright teal and Pale teal triangles, with an Oswald label in capitals on top,
such as "ACCELERATOR" or "CHALLENGE". Use it for covers and headers.

Set the label in Ink (5.4:1 on Bright teal, 13.2:1 on Pale teal), or in White on a solid Deep teal
panel (10.7:1). Never set it in White straight on the triangles: White on Bright teal is only 2.7:1
and on Pale teal 1.1:1, below the 3:1 that even large text needs.

### Co-brand lockup

The MassChallenge logo, a plus sign and the partner's logo, on white with a thin teal border. The
other form is a teal panel with the white MassChallenge logo beside the partner's logo.

### Program lockup

The MC monogram, a thin vertical divider and the program name in capitals, such as "MC | RESOLVE
2026".

### Stat callouts

A large number with a short label in capitals. Set the number in Deep teal on light backgrounds and
Bright teal on dark ones, with the label in Ink or White. Never use Magenta, which is kept for
things that are wrong. Use the [approved figures](#approved-figures), with their as-of date.

### Program timelines

Dots on a line, with each step above or below its dot. Color the dots in the
[chart order](#charts). The words beside each dot carry the meaning, so the colors never have to.

### Icons

Single color line icons with rounded ends, in Teal on light backgrounds and Bright teal on dark
ones, always beside a word.

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
