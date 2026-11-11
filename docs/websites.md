# Using Propellant on websites

You can give any website the MassChallenge look, whether it is built with WordPress, Squarespace,
Webflow, Wix, HubSpot or plain HTML. You do not need to be a developer.

The approach is the same everywhere:

1. **Set up the builder's own style settings first.** Every builder has a place to choose fonts,
   colors and button styles once for the whole site. Settings are easy for the next person to find
   and change, and they survive theme updates. For most sites, this is all you need.
2. **Add the logo** through the builder's logo setting.
3. **Use custom CSS only for what the settings cannot do**, such as the Oswald brand headline. Each
   guide gives you exact code to copy and paste, and keeps it as small as possible, because custom
   code is easy to forget and can break when a builder updates.

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

Every guide sets these same values. Keep this page open while you work: each value is ready to
copy.

### Colors

| Use it for | Name | Hex |
| --- | --- | --- |
| Page background | White | `#FFFFFF` |
| Alternate section background | Mist | `#F3FBFC` |
| Body text and headings | Ink | `#1E282B` |
| Secondary text, such as captions | Slate | `#4B575B` |
| Links and buttons | Teal | `#065E6F` |
| Button hover, and dark brand sections | Deep teal | `#044451` |
| Accents on dark sections only | Bright teal | `#0FACBD` |
| Secondary buttons and tinted sections | Pale teal | `#D9F6FA` |
| Lines and dividers | Line | `#DBE1E3` |
| Highlights, always with Ink text | Yellow | `#FFC801` |
| Errors | Magenta | `#BF0261` |

On Deep teal sections, use White text, White buttons with Deep teal text, and Bright teal for
accents. Never put Teal text on Deep teal.

### Fonts

| Font | Use it for | Where to get it |
| --- | --- | --- |
| Lato | Everything except the big headline | Built into most builders, and on Google Fonts |
| Oswald | The big headline only, in capitals | Built into most builders, and on Google Fonts |

Propellant Sans, the font in our products, is our name for Lato 2.0, so Lato is the right choice
on websites.

### Text styles

Sizes are for desktop, with the mobile size in brackets. Line height is a multiple of the font
size; if your builder asks for a percentage, multiply by 100 (1.5 is 150%).

| Style | Font | Weight | Size | Line height | Letter spacing | Case |
| --- | --- | --- | --- | --- | --- | --- |
| Heading 1 (the big headline) | Oswald | 500 (Medium) | 64px (40px) | 1.0 | 1% (0.01em) | ALL CAPS |
| Heading 2 | Lato | 700 (Bold) | 40px (30px) | 1.15 | 0 | Sentence case |
| Heading 3 | Lato | 700 (Bold) | 30px (24px) | 1.2 | 0 | Sentence case |
| Heading 4 | Lato | 700 (Bold) | 24px (20px) | 1.25 | 0 | Sentence case |
| Paragraph large | Lato | 400 (Regular) | 20px (18px) | 1.5 | 0 | Sentence case |
| Paragraph | Lato | 400 (Regular) | 17px (16px) | 1.6 | 0 | Sentence case |
| Paragraph small | Lato | 400 (Regular) | 14px | 1.5 | 0 | Sentence case |
| Button | Lato | 700 (Bold) | 16px | 1.0 | 0 | Sentence case |

Only Heading 1 is in capitals. Everything else, buttons included, is sentence case: capital first
letter, the rest lower case except names.

### Buttons

| Button | Background | Text | Hover background | Shape |
| --- | --- | --- | --- | --- |
| Primary | Teal `#065E6F` | White `#FFFFFF` | Deep teal `#044451` | Pill (fully rounded ends) |
| Secondary | Pale teal `#D9F6FA` | Teal `#065E6F` | `#C4EEF4` | Pill |
| On a Deep teal section | White `#FFFFFF` | Deep teal `#044451` | Pale teal `#D9F6FA` | Pill |

Padding: about 14px top and bottom, 28px left and right. No borders, no shadows, no capitals.

### Layout

- Keep paragraphs to about 720px wide, roughly 68 characters a line.
- Give sections about 96px of space above and below on desktop, 64px on mobile.
- Round images and cards by 12px. Buttons are pills.
- Use the logo files from the [brand guidelines](brand.md), never a copy from somewhere else.

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

| Class | What it does |
| --- | --- |
| `propellant-headline` | Heading 1 from the spec: the big brand headline, in Oswald capitals. |
| `propellant-title-1`, `propellant-title-2`, `propellant-title-3` | Heading 2, Heading 3 and Heading 4 from the spec. |
| `propellant-body` | Paragraph from the spec. |
| `propellant-caption` | Paragraph small, in Slate, for dates and notes. |
| `propellant-text` | Body font and text color for a whole section. |
| `propellant-link` | A teal, underlined link. |
| `propellant-button` | The primary pill button. |
| `propellant-button propellant-button-secondary` | The secondary button. |
| `propellant-brand-band` | A Deep teal section with White text and buttons. |

## Keep it maintainable

- **Settings before code.** If something can be set in the builder's style settings, set it there.
- **Keep custom CSS short and labeled.** Paste only the snippets from these guides, and keep the
  comment line at the top of each so the next person knows where it came from.
- **Do not fight the theme.** If a theme setting and a snippet disagree, change the setting.
- **Check the published site and a phone.** Some code only runs on the published site, and every
  builder has a mobile view worth checking.
