# Using Propellant on websites

You can give any website the MassChallenge look, whether it is built with WordPress, Squarespace,
Webflow, Wix, HubSpot or plain HTML. You do not need to be a developer.

The approach is the same everywhere:

1. **Set up the builder's own style settings first.** Every builder has a place to choose fonts,
   colors and button styles once for the whole site. Settings are easy for the next person to find
   and change, and they survive theme updates. For most sites, this is all you need.
2. **Add the logo** through the builder's logo setting.
3. **Use custom CSS only for what the settings cannot do**, such as Oswald capitals or button
   hovers. Each guide gives you exact code to copy and paste, and keeps it as small as possible,
   because custom code is easy to forget and can break when a builder updates.

## Pick your builder

- [Squarespace](websites/squarespace.md)
- [WordPress](websites/wordpress.md)
- [Webflow](websites/webflow.md)
- [Wix](websites/wix.md)
- [HubSpot](websites/hubspot.md)
- [Plain HTML](websites/html.md)

Using something else? Read the [Squarespace guide](websites/squarespace.md) for the idea, then find
the same settings in your builder: almost every builder has a place for site fonts, site colors,
button styles and the logo.

## The website spec

Every guide sets these same values. They apply the MassChallenge brand guidelines from
MassChallenge Marketing to websites, so if a value here and the brand guidelines ever disagree, the
brand guidelines win. Keep this page open while you work: each value is ready to copy.

These rules are for websites and public pages only. The signed in products keep their own
interface style.

### Colors

| Use it for | Name | Hex |
| --- | --- | --- |
| Light section background | White | `#FFFFFF` |
| Alternate light section background | Warm White | `#F8F8F5` |
| The angled tint on a light section | Light tint | `#F3FAFC` |
| Dark section background | Navy | `#10263F` |
| Dark section background, and body text on light | Black | `#222222` |
| Dark section background | Deep Teal | `#004F73` |
| Headings, links and buttons on light | Teal | `#00708E` |
| Text, links, outlines and accents on dark only | Cyan | `#54EEFF` |
| The logo and graphic shapes, never text | MC Blue | `#0EABBC` |
| Gradient stop only, never a flat fill | Ocean | `#037AA6` |
| Secondary text on light, such as captions | Slate | `#4B575B` |
| Lines and dividers | Line | `#DBE1E3` |

The MC Gradient runs from Navy `#10263F` to Ocean `#037AA6`, at any angle.

**Warm accents.** Use one per page, in small doses: a word, a tag, a rule or a stat. Never as a
large background.

| Name | Hex | Rule |
| --- | --- | --- |
| Yellow | `#FFC801` | Tags, rules and stats. Black text on it. |
| Orange | `#FF6B35` | Black text on it, never White. |
| Raspberry | `#D14170` | Shapes and rules on dark sections. |
| Lime | `#C6F135` | Accents on dark sections. |

The rules that keep text readable:

- On light sections, colored text is always Teal. MC Blue is never text: it is 2.8:1 on White.
- Cyan only on dark sections (Navy, Black, Deep Teal). Teal is never text on Navy (2.7:1).
- On dark sections, text is White and accents are Cyan.
- Orange takes Black text, never White.
- Error messages in forms keep the error red `#BF0261`, with a word that says what is wrong. The
  warm accents are decoration and never signal an error, a warning or success.

These pairings are checked for contrast: Cyan on Navy 11.0:1, White on Black 15.9:1, Teal on White
5.7:1, White on Deep Teal 8.9:1, Navy on Warm White 14.4:1, Lime on Navy 11.7:1, White on Teal
5.7:1, Black on Yellow 10.2:1, Black on Orange 5.6:1, White on Navy 15.3:1 and Cyan on Deep Teal
6.4:1.

### Fonts

| Font | Use it for | Where to get it |
| --- | --- | --- |
| Oswald | Headlines, eyebrows, subheads, big stats and buttons, always in capitals | Built into most builders, and on Google Fonts |
| Lato | Reading text: paragraphs, captions and form text | Built into most builders, and on Google Fonts |

Propellant Sans, the font in our products, is our name for Lato 2.0, so Lato is the right choice
on websites. Never set paragraphs in Oswald or in capitals.

### Text styles

Sizes are for desktop, with the mobile size in brackets. Line height is a multiple of the font
size; if your builder asks for a percentage, multiply by 100 (1.5 is 150%). Letter spacing of 0.3em
is the same as 300 tracking in design tools, or 30% in builders that ask for a percentage.

| Style | Font | Weight | Size | Line height | Letter spacing | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Heading 1 (the headline) | Oswald | 600 (SemiBold) | 64px (40px) | 1.0 | 0 | ALL CAPS |
| Heading 2 | Oswald | 600 (SemiBold) | 40px (30px) | 1.0 | 0 | ALL CAPS |
| Heading 3 (subhead) | Oswald | 600 (SemiBold) | 30px (24px) | 1.1 | 0 | ALL CAPS |
| Heading 4 (small subhead) | Oswald | 600 (SemiBold) | 24px (20px) | 1.15 | 0 | ALL CAPS |
| Eyebrow | Oswald | 400 (Regular) | 14px | 1.2 | 0.3em (300) | ALL CAPS |
| Big stat | Oswald | 700 (Bold) | 72px (48px) | 1.0 | 0 | Numbers only |
| Paragraph large | Lato | 400 (Regular) | 20px (18px) | 1.5 | 0 | Sentence case |
| Paragraph | Lato | 400 (Regular) | 17px (16px) | 1.5 | 0 | Sentence case |
| Paragraph small | Lato | 400 (Regular) | 14px | 1.5 | 0 | Sentence case |
| Button | Oswald | 600 (SemiBold) | 16px | 1.0 | 0.05em | ALL CAPS |

- **Headline.** Heading 1 is the headline. It can be two toned: the lead phrase in Black (White on
  dark) and the payoff in Teal (Cyan on dark).
- **Eyebrow.** A short tracked label above a headline. Use the same style for tags, labels and
  footers.
- **Heading color.** Heading 1 is Black on light and White on dark. Headings 2 to 4 are Teal on
  light and White on dark, except on white cards, where they stay Teal.
- **Subhead.** Headings 3 and 4: card titles, numbered blocks and section labels.
- **Big stat.** Optional, for a number at display size only. It is the only place Oswald Bold is
  used. Teal on light, Cyan on dark, with a label in Black or White.
- Use Lato Bold for emphasis inside a paragraph.

Type the words in normal sentence case. The capitals come from the style, so the text still reads
correctly to screen readers and search engines.

### Buttons

Every button is a fully rounded pill, in Oswald capitals. Square cornered buttons are retired.

| Button | Where | Background | Text | Border | On hover |
| --- | --- | --- | --- | --- | --- |
| Primary | Light sections | Teal `#00708E` | White `#FFFFFF` | Teal | The fill clears to a Teal outline with Teal text. |
| Secondary | Light sections | None | Teal `#00708E` | Teal | Fills with Teal, with White text. |
| Any button | Dark sections | None | White `#FFFFFF` | Cyan `#54EEFF` | Fills with Teal `#00708E`, White text. |

Padding: about 14px top and bottom, 28px left and right. Border: 2px. No shadows. An arrow (→)
after the label is optional for "see all" links.

Event tags on graphics, such as EVENTS or NEWS, are labels, not buttons. They stay rectangular:
Yellow with Black text, in the eyebrow style.

### Layout

- **Section rhythm.** Alternate dark sections (Navy, Black, Deep Teal) with light ones (White, Warm
  White).
- **The notch.** Mark the change from one section to the next with a small downward pointing
  triangle, centered on the edge, in the color of the section above it.
- **Dark section with white cards.** The core pattern of the site: a dark section, white cards with
  square corners and Teal card titles, and a notch below.
- **Light section with an angled edge.** The pale tint `#F3FAFC` rising on a gentle angle from
  White, with a Teal headline and a Teal pill button.
- **Eyebrow and two toned headline.** On dark: a tracked eyebrow above, the lead phrase in White
  and the payoff in Cyan.
- **Numbered blocks.** A heavy Black rule on top, a Teal number, an Oswald title and Lato body text.
- **Square corners.** Cards and photos have square corners. Only buttons are rounded.
- **White space.** Generous margins. When in doubt, add space. Give sections about 96px of space
  above and below on desktop, 64px on mobile.
- Keep paragraphs to about 720px wide, roughly 68 characters a line.
- Use the logo files from the [brand guidelines](brand.md), never a copy from somewhere else.

### Photos and text over photos

- **Hero overlay.** A thin gradient over hero photos, from Navy black `#051925` on the text side to
  Ocean `#037AA6` on the subject side, at 15 to 30% opacity, so warm light still glows through. The
  text side is darker; the subject side stays clear.
- Put text over a photo only on a calm, high contrast area. The hero overlay is too thin to fix
  contrast on its own: white text over a bright area under it is about 2:1. Use the overlay only
  where the text side of the photo is already dark and calm, and check the text reaches 4.5:1 (3:1
  for large headlines). Otherwise move the text, or set it on a solid Navy, Black or Deep Teal
  block. `propellant-hero` always sets white text, so choose its photo with this in mind.
- The [images guide](images.md#brand-photography) covers which photos to use.

## The Propellant stylesheet

Some guides use a small stylesheet that loads the exact fonts and adds a few ready made classes,
such as `propellant-headline` and `propellant-button`. It only styles elements you add a class to,
so it never changes the rest of your site. Load it with this line, wherever a guide tells you to:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css"
/>
```

The `@v1.1.1` part pins your site to one release, so it never changes under you. A complete
example page is in [`examples/website.html`](../examples/website.html).

**Type**

| Class | What it does |
| --- | --- |
| `propellant-text` | Body font, line height and Black text for a whole page or section. |
| `propellant-headline` | Heading 1: the headline, in Oswald SemiBold capitals. |
| `propellant-headline-accent` | Wrap the payoff of a headline in it: Teal on light, Cyan on dark. |
| `propellant-eyebrow` | The tracked Oswald label above a headline. |
| `propellant-title-1` | Heading 2. |
| `propellant-title-2` or `propellant-subhead` | Heading 3, the subhead: card titles and section labels. |
| `propellant-title-3` | Heading 4. |
| `propellant-body` | Paragraph. |
| `propellant-caption` | Paragraph small, in Slate (White on dark), for dates and notes. |
| `propellant-stat` | The big stat, in Oswald Bold. Pair it with an eyebrow label. |
| `propellant-link` | An underlined link: Teal on light, Cyan on dark. |

**Buttons and accents**

| Class | What it does |
| --- | --- |
| `propellant-button` | The primary pill button. Works on `<a>` and `<button>`. |
| `propellant-button propellant-button-secondary` | The secondary, outlined button. |
| `propellant-tag` | A rectangular Yellow event tag, such as EVENTS or NEWS. |
| `propellant-accent-rule` | A short Yellow rule, the one warm accent on a page. |

**Sections and blocks**

| Class | What it does |
| --- | --- |
| `propellant-section-white`, `propellant-section-warm-white` | Light sections. |
| `propellant-section-angled` | A light section with the pale tint rising on an angle. |
| `propellant-section-navy`, `propellant-section-black`, `propellant-section-deep-teal` | Dark sections. Text turns White, links Cyan and buttons Cyan outlines. |
| `propellant-brand-band` | The same as `propellant-section-navy`. Kept so existing pages keep working. |
| `propellant-notch` | Add it to any section to draw the notch below it, in that section's color. |
| `propellant-card` | A white card with square corners and Teal titles, even inside a dark section. |
| `propellant-numbered`, `propellant-numbered-number` | A numbered block: heavy rule, Teal number. |
| `propellant-photo` | A photo with square corners that fits its column. |
| `propellant-hero` | A dark hero with the hero overlay. Put the photo inside it as an image with `propellant-hero-image`, or set it as the section's background image. |
| `propellant-hero-subject-left` | Add it to a hero whose subject is on the left, so the overlay darkens the right. |

A dark section with an eyebrow, a two toned headline, white cards and a notch:

```html
<section class="propellant-section-navy propellant-notch">
  <p class="propellant-eyebrow">Your eyebrow</p>
  <h2 class="propellant-headline">
    Your lead phrase <span class="propellant-headline-accent">your payoff</span>
  </h2>
  <div class="propellant-card">
    <h3 class="propellant-subhead">Card title</h3>
    <p class="propellant-body">Card text.</p>
  </div>
  <a class="propellant-button" href="/apply">Apply now</a>
</section>
```

## Keep it maintainable

- **Settings before code.** If something can be set in the builder's style settings, set it there.
- **Keep custom CSS short and labeled.** Paste only the snippets from these guides, and keep the
  comment line at the top of each so the next person knows where it came from.
- **Do not fight the theme.** If a theme setting and a snippet disagree, change the setting.
- **Check the published site and a phone.** Some code only runs on the published site, and every
  builder has a mobile view worth checking.
