# MassChallenge brand guidelines

How MassChallenge shows up everywhere we make things: web products, websites, Office and Google
Workspace files, print, slides, video and social graphics. It covers the name, the logo, color,
type, voice, messaging, contact and legal details, the graphic devices, imagery and video.

The standard is the MassChallenge brand guidelines from MassChallenge Marketing. This page applies
them to the things Propellant builds, and adds the rules for the signed in products. If this page
and the brand guidelines ever disagree, the brand guidelines win; ask MassChallenge Marketing.
Most of the interface side is already built into Propellant, so when you use its components and
tokens (the named values for color, type and spacing), you follow these guidelines without extra
work.

## The name

- Write MassChallenge as one word with a capital M and a capital C.
- Do not abbreviate it to MC in running text. The MC monogram is a logo, not a word.
- Do not add a trademark symbol to the name or the logo.

## Logo

The logo is the most recognizable part of the MassChallenge brand, so we treat it with care. Use
the approved files or the `Logo` component, and never redraw, retype or recolor it.

### Versions

| Version | Use it for | Where to get it |
| --- | --- | --- |
| Vertical | The default for most layouts. | From MassChallenge Marketing. |
| Horizontal | Where width is plentiful and height is tight: headers, footers, sponsor slides and banners. It is the version Propellant uses in product headers and sign in pages. | `assets/logos/masschallenge-logo-horizontal-*.png`, `<Logo />` |
| MC mark (the monogram) | Where the audience already knows us. In Propellant: compact navigation, favicons, app icons and avatars. | `assets/logos/masschallenge-logo-monogram-*.png`, `<Logo lockup="monogram" />` |
| Local logos | Work tied to one site. US sites use the city and international sites use the country. | From MassChallenge Marketing. |

Propellant ships the horizontal logo and the MC mark only. The vertical logo and the local logos
come from MassChallenge Marketing; never draw or assemble them yourself.

The horizontal logo is the MC mark, a thin vertical divider and the MASSCHALLENGE wordmark. Keep the
parts together, at the proportions in the files. Use the MC mark on its own only where the
MassChallenge name is already clear from the context.

**Local logos.** Approved local files exist for Boston, Israel, the UK and Switzerland. Dallas is
not produced yet. Use only the approved local files, and never type a location next to the logo.

### Logo colors

| Part | Color | Hex | RGB | Print CMYK (approximate) |
| --- | --- | --- | --- | --- |
| M and wordmark | MC Gray | `#808285` | 128 130 133 | 4 2 0 48 |
| C and divider | MC Blue | `#0EABBC` | 14 171 188 | 93 9 0 26 |

These are the official logo colors. The PNG files Propellant ships today measure `#828486` and
`#17ACBC`, a shade off. Do not recolor them: official artwork from MassChallenge Marketing will
replace them. MC Gray is for the logo only. MC Blue is for the logo and graphic shapes, never text.

### Treatments

| Treatment | Use it on | Files and component |
| --- | --- | --- |
| Full color | White and Warm White only. | `*-color.png`, `<Logo />` |
| White | Navy, Black, Deep Teal, Teal, MC Blue, and photographs with enough contrast. | `*-white.png`, `<Logo treatment="white" />` |
| Black | One color print, and light backgrounds that the full color logo does not suit. | `*-black.png`, `<Logo treatment="black" />` |

A treatment is the color version of the logo you pick for a background. The one color treatments
are the same artwork in a single color, so the gap between the M and the C stays open. Each
treatment exists for both versions Propellant ships.

- Never put the white logo on light colors such as Cyan, Yellow or Lime.
- On a busy photograph, add the [hero overlay](#hero-overlay) or a solid color block behind the
  logo.

### Clear space

Keep a clear space around the logo equal to the height of the "M" in the MASSCHALLENGE wordmark, on
every side. Nothing enters it: no type, images, edges or other logos. In the horizontal files the M
is about 40% of the logo's height, so a horizontal logo shown 32px tall needs about 13px of clear
space all around. For the MC mark on its own, take the same measure from the M of the mark.

Align the horizontal logo to a corner or the top edge of its area.

### Minimum size

| Version | Smallest on screen | Smallest in print |
| --- | --- | --- |
| Vertical | 60px wide | 20mm wide |
| Horizontal | 160px wide. At Propellant's default height of 24px it is about 178px wide. Narrower than 160px, use the MC mark instead. | 30mm wide |
| MC mark | 16px tall (about 29px wide, above the guide's 24px wide) | 8mm |

The `Logo` component renders at 24px tall by default. Size it with a height class such as
`h-8`; the width follows.

### Placement

- Place the logo at the start of a header or sidebar, aligned with the content below it.
- In a product, link the logo to the product's home.
- Give the logo an accessible name of MassChallenge. When the name is written right beside it, mark
  the logo as decorative with `<Logo label="" />`.

### Things to avoid

- Do not recolor, stretch, rotate, outline, flip or crop the logo.
- Do not add shadows, glows, gradients or other effects.
- Do not rearrange, rebuild or retype the logo, resize its parts or remove the divider.
- Do not create new lockups or sub-logos outside the [sub-brand system](#sub-brands-and-partners).
- Do not place the full color logo on dark colors or busy photographs; use the white treatment.
- Do not place the white logo on light colors such as Cyan, Yellow or Lime.
- Do not place the logo inside a shape or container that crowds its clear space.
- Do not use the MC mark as a letter in a word or headline.

## Color

The palette comes from the MassChallenge brand guidelines. It applies everywhere the brand appears:
websites, Office and Google Workspace files, print, slides, video and social graphics. Propellant
holds each color as a token with an `--mc-` prefix, so the token column below is the name to use in
code.

### Core colors

These are locked.

| Name | Hex | RGB | Print CMYK (approximate) | Token | Use it for |
| --- | --- | --- | --- | --- | --- |
| MC Blue | `#0EABBC` | 14 171 188 | 93 9 0 26 | `--mc-blue` | The logo and graphic shapes. Never text. |
| MC Gray | `#808285` | 128 130 133 | 4 2 0 48 | `--mc-gray` | The logo only. |
| Navy | `#10263F` | 16 38 63 | 75 40 0 75 | `--mc-navy` | Dark sections and gradients. |
| Black | `#222222` | 34 34 34 | 0 0 0 87 | `--mc-black` | Dark sections and body text. |
| Warm White | `#F8F8F5` | 248 248 245 | 0 0 1 3 | `--mc-warm-white` | Light sections. |

### Supporting blues

| Name | Hex | RGB | Print CMYK (approximate) | Token | Use it for |
| --- | --- | --- | --- | --- | --- |
| Deep Teal | `#004F73` | 0 79 115 | 100 31 0 55 | `--mc-deep-teal` | Dark sections. |
| Teal | `#00708E` | 0 112 142 | 100 21 0 44 | `--mc-teal` | Headings and links on light backgrounds. Colored text on a light background is always Teal. |
| Cyan | `#54EEFF` | 84 238 255 | 100 11 0 9 | `--mc-cyan` | Text and accents on dark backgrounds only (Navy, Black, Deep Teal). In print, use `#00CFE8` (`--mc-cyan-print`). |
| Ocean | `#037AA6` | 3 122 166 | | `--mc-ocean` | A gradient stop only, never a flat fill. |

**The MC Gradient** runs from Navy `#10263F` to Ocean `#037AA6`, at any angle (`--mc-gradient`).

### Warm accents

Use one warm accent per piece, in small doses: a word, a tag, a rule or a stat. Never as a large
background.

| Name | Hex | Print substitute | Print CMYK (approximate) | Token | Use it for |
| --- | --- | --- | --- | --- | --- |
| Yellow | `#FFC801` | None | 0 22 100 0 | `--mc-yellow` | Tags, rules and stats. Dark text on it. |
| Orange | `#FF6B35` | `#F58242` | 0 47 73 4 | `--mc-orange` | Dark text only, never white. |
| Raspberry | `#D14170` | `#D83B80` | 0 73 41 15 | `--mc-raspberry` | Shapes and rules on dark backgrounds. |
| Lime | `#C6F135` | `#91D438` | 32 0 74 17 | `--mc-lime` | Accents on dark backgrounds. |

The print substitutes have tokens of their own: `--mc-orange-print`, `--mc-raspberry-print` and
`--mc-lime-print`. The supporting blues and the warm accents are reviewed with each version of the
brand guidelines.

### Print color

The CMYK values are approximate until they are confirmed with a printer's proof. For print, use the
listed substitute wherever one exists, and check a printed proof before a large run.

### Using color

- One warm accent per piece, and never as a large background.
- Cyan only on dark backgrounds: Navy, Black and Deep Teal.
- MC Blue is for the logo and shapes, not text. On light backgrounds, colored text is Teal.
- Orange takes dark text, never white.
- Pair every status color with a word or a symbol, never color alone.
- Text stands out from its background by a contrast ratio of at least 4.5:1, and large text and the
  edges of controls by at least 3:1.

### Approved pairings

These pairings are verified for contrast.

| Pairing | Contrast ratio |
| --- | --- |
| Cyan on Navy | 11.0:1 |
| White on Black | 15.9:1 |
| Teal on White | 5.7:1 |
| White on Deep Teal | 8.9:1 |
| Navy on Warm White | 14.4:1 |
| Lime on Navy | 11.7:1 |

Also verified: White on Teal 5.7:1, Black on Yellow 10.2:1, Black on Orange 5.6:1, White on Navy
15.3:1 and Cyan on Deep Teal 6.4:1.

Never use these for text, because they fail: White on MC Blue 2.8:1, MC Blue on White 2.8:1, Teal
on Navy 2.7:1 and White on Orange 2.8:1.

### Status colors are separate

Propellant's error, warning and success colors (the magenta, orange and green tokens, such as
`--critical`, `--warning` and `--success`) stay for interface status. Raspberry, Orange and Lime are
decorative brand accents: never use them to signal status, and never use a status color as
decoration.

### Charts

Use the chart colors in this order: Teal, Yellow, Navy, MC Blue, Deep Teal and Gray 300 (`#848F92`,
`--gray-300`). This order is Propellant's application of the palette. Label the data directly, on
or beside each line, bar or slice, rather than relying on a legend and color alone.

### In the signed in products

The products keep their interface colors for now. Their primary color is still the interface teal,
`--tint` (`#065E6F` in light mode), with the teal and gray scales and dark mode behind it, and
Propellant's semantic tokens are tuned for contrast in both themes. A later release moves the
products' primary color to the new Teal. In interfaces, keep using the semantic tokens (named for
their job, not their color) rather than the hex values above.

These older names belonged to Propellant's earlier palette. They are no longer brand colors. The
values stay as interface tokens, but brand material (graphics, documents, templates and websites)
uses the new color in their place:

| Old name | Hex | Interface token | In brand material, use |
| --- | --- | --- | --- |
| Deep teal | `#044451` | `--teal-900` | Deep Teal `#004F73`, or Navy `#10263F` for dark sections |
| Teal | `#065E6F` | `--teal-800` | Teal `#00708E` |
| Mid teal | `#068DA4` | `--teal-600` | Teal `#00708E` |
| Bright teal | `#0FACBD` | `--teal-400` | MC Blue `#0EABBC` for shapes, Cyan `#54EEFF` for text and accents on dark |
| Pale teal | `#D9F6FA` | `--teal-100` | Warm White `#F8F8F5` for light sections, `#F3FAFC` for the angled tint |
| Mist | `#F3FBFC` | `--teal-50` | Warm White `#F8F8F5` for light sections, `#F3FAFC` for the angled tint |
| Ink | `#1E282B` | `--gray-800` | Black `#222222` for text |
| Slate | `#4B575B` | `--gray-500` | Black at reduced emphasis, through size or weight. Slate stays a neutral for secondary text on websites and in interfaces. |
| Magenta | `#BF0261` | `--magenta-600` | Not a brand color. It stays the interface error color. In graphics, use Raspberry on dark backgrounds. |
| Logo teal | `#17ACBC` | | MC Blue `#0EABBC` |
| Logo gray | `#828486` | | MC Gray `#808285` |

## Typography

| Typeface | Use it for |
| --- | --- |
| Oswald | Headlines, always in capitals. Also eyebrows, subheads, big stats and website buttons. |
| Lato | Reading text. In Propellant it ships as Propellant Sans: Lato 2.0 at 400, 500, 600 and 700, plus 400 italic. |

Gotham, Bebas, Arial, Montserrat and Open Sans are retired.

### Text styles

| Style | Font | Case | Notes |
| --- | --- | --- | --- |
| Headline | Oswald SemiBold (600) | ALL CAPS | Line height 1.0. Two toned if you like: the lead phrase in Black or White, the payoff in Teal (on light) or Cyan (on dark). |
| Eyebrow or tag | Oswald Regular (400) | ALL CAPS | Tracked +300 (0.3em). Above headlines, and on tags, labels and footers. |
| Subhead | Oswald SemiBold (600) | ALL CAPS | Smaller than the headline. Card titles, numbered blocks and section labels. |
| Body | Lato Regular (400) | Sentence case | Line height 1.5. Lato Bold for emphasis. |
| Big stat (optional) | Oswald Bold (700) | Numbers | Display size only. The only use of Oswald Bold. |

Never set body copy in Oswald or in capitals.

### Where each font applies

| Where | Lato (Propellant Sans) | Oswald |
| --- | --- | --- |
| Web products | Shipped with Propellant as Propellant Sans. | Never inside signed in product screens. |
| Websites | Shipped with Propellant. Builders that do not use Propellant pick Lato. | Shipped with Propellant through `--type-family-brand`. The [websites guide](websites.md) has the full spec. |
| Microsoft Office | Install Lato. | Install Oswald. |
| Google Workspace | Lato, from Google Fonts. | Oswald, from Google Fonts. |
| Email | Lato, falling back to Aptos. | Aptos Narrow Bold in capitals for headers. |

**Office and email fallback.** When Oswald or Lato will not load, use Aptos Narrow Bold, in
capitals, for headers and Aptos for body text. Both ship with Microsoft 365. Never Arial. Install
Oswald and Lato on every staff computer, and embed the fonts in PowerPoint templates (**File >
Options > Save > Embed fonts in the file**).

### In the signed in products

The product text styles do not change, and Oswald is never used inside a signed in product.

- Use sentence case for titles, labels and buttons. Capitals belong only to Oswald, the wordmark
  and the labels of the graphic devices below.
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
redraw the logo.

### Hero overlay

A thin linear gradient over a hero photo, from Navy black `#051925` to Ocean `#037AA6`, at 15 to 30%
opacity. It runs toward the subject: the side with the text is darker, and the subject's side stays
clear, so warm light still glows through. Use it on heroes, social posts and event graphics. On the
web it is the `propellant-hero` class, or the `--mc-hero-overlay-text-side` and
`--mc-hero-overlay-subject-side` tokens.

The overlay alone does not make text readable: at 15 to 30% it barely darkens a bright area, so
white text over one stays near 2:1. Use it only where the text sits on an area that is already
dark and calm, and check that the text still reaches 4.5:1 (3:1 for large headlines). Otherwise
set the text on a solid Navy, Black or Deep Teal block.

The full frame teal duotone (`#C7F2EF` to `#003349`) is retired, because it reads as clinical. Use
the hero overlay instead.

### Hexagon network frame

A circular photo crop set inside a network of hexagons and lines. Draw the hexagon shapes in MC
Blue and the lines in the light tint `#F3FAFC`. Use it for a single photo beside text.

### Geometric pattern

The brand pattern: MC Blue triangles with the light tint `#F3FAFC` or Warm White, and an Oswald
label in capitals on top, such as "ACCELERATOR" or "CHALLENGE". Use it for covers and headers.

Set the label in Black on the light parts of the pattern, or in White on a solid Navy or Deep Teal
panel. Check the contrast of every label: never set White straight on the triangles, because White
on MC Blue is only 2.8:1.

### Stat callouts

A large number in Oswald Bold with a short label. Set the number in Teal on light backgrounds and
Cyan on dark ones, with the label in Black or White. A single Yellow rule is an optional warm
accent. Never use Raspberry for numbers. Use the [approved figures](#approved-figures), with their
as-of date.

### Program lockup

Use the [sub-brand lockup](#sub-brands-and-partners) structure. Only MassChallenge Marketing creates
real lockups; this page only describes the structure.

### Partner lockup

Use the [corporate partner lockup](#sub-brands-and-partners).

### Program timelines

Dots on a line, with each step above or below its dot. Color the dots in the
[chart order](#charts). The words beside each dot carry the meaning, so the colors never have to.

### Icons

Single color line icons, in Teal on light backgrounds and Cyan on dark ones, always beside a word.

### Event tags

Tags such as EVENTS or NEWS on graphics stay rectangular, in the eyebrow style, with dark text on
Yellow.

## Imagery

Every image carries some warmth, and shows real work and real people. Pick one of three treatments:

| Treatment | Use it for |
| --- | --- |
| 01 Overlay | Heroes, social posts and event graphics, with a thin [hero overlay](#hero-overlay) so warm light glows through. |
| 02 Full color | Content photos, spaces and people, with no overlay or duotone. |
| 03 Accent rescue | A cool photo with no warmth gets one warm accent (Yellow, Orange or Lime) on a tag, a rule or a subhead. |

The [images guide](images.md#brand-photography) has the full photography direction: what to shoot,
what to avoid, the rule on AI images and where photos come from.

## Video

- The photography rules apply: real people, balanced exposure and warmth in the frame.
- Every video uses the standard logo open and end slates and consistent lower thirds. MassChallenge
  Marketing approves final exports before they go live.
- Frame interviews on the rule of thirds, with the eyes near a top intersection and lead room in
  the direction the subject faces.
- Lower thirds: a Navy block with a Cyan rule. The name in Oswald SemiBold and the title in Lato,
  bottom left, inside the title safe area.
- Use only footage MassChallenge has licensed or shot itself.

## Sub-brands and partners

Only MassChallenge Marketing creates sub-brand lockups and endorsement marks. The structures below
describe what they look like, so you can recognize and place them; never build one yourself.

**Sub-brand lockup.** For programs MassChallenge runs under its own name, such as Breakthrough Bio:
the MC mark, an MC Blue rule (Cyan on dark), the program name in Oswald SemiBold and the location
in tracked Oswald Regular. Partner logos never join a lockup.

**Partner initiative endorsement.** For programs that partners own and run with MassChallenge
guidance: the initiative name above a 1pt rule, and an endorsement line below it ("WITH
MASSCHALLENGE" or "WITH PARTNER & MASSCHALLENGE"), aligned left.

**Corporate partner lockup.** For a challenge program a partner commissions:

- The partner's logo first, on the left, then a 1pt vertical rule a little taller than the logos,
  then the MassChallenge vertical logo on the right.
- Give both logos equal visual weight. The gap on each side of the rule equals the height of the M
  in the MC mark.
- The rule is MC Gray on light backgrounds, and white or light gray on dark ones.
- Both logos are full color on white, or both white on dark or on the partner's brand color.
- Do not put MassChallenge first, mix a full color logo with a white one, let one logo overpower
  the other, drop the rule or use a plus sign.

Whether a partner's logo appears alongside ours is set in the partnership agreement.

## Iconography

- In brand material, icons are single color line icons, in Teal on light backgrounds and Cyan on
  dark ones, always beside a word.
- In products, icons sit beside text: their stroke follows the weight of the text and their size
  follows its text style.
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
