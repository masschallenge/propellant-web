# Using Propellant on websites

You can bring the MassChallenge look to a site built with any website builder, such as WordPress,
Squarespace, Webflow, Wix or HubSpot, or with plain HTML. This guide shows how.

Start with your builder's own design settings. Every major builder lets you choose fonts, colors,
button styles and a logo without writing code, and those settings survive theme updates and are
easy for anyone on your team to change later. Only reach for the Propellant stylesheet when you
need something the settings cannot do, and keep custom code to a minimum: overrides written
against a theme's internals tend to break when the theme or builder updates.

## Step 1: Set up your theme

Open your builder's design or style settings and enter these values. For most sites, this step is
all you need.

| Setting | Value |
| --- | --- |
| Body font | Lato, which most builders offer in their font lists |
| Heading font | Lato for section headings. Oswald, in capitals, for one big headline per page |
| Text color | `#1E282B` |
| Link and button color | `#065E6F`, with white button text |
| Button shape | Fully rounded ends (a capsule), sometimes called a pill shape |
| Dark sections | `#044451` background, with white text and white buttons |
| Accent on dark sections | `#0FACBD` |
| Highlight | `#FFC801`, always with dark text |
| Page background | White |

Propellant Sans, the font in our products, is our name for Lato 2.0, so Lato from a builder's font
list is a close match. Write headings and buttons in sentence case, and see the
[brand guidelines](brand.md) for the full palette and voice.

## Step 2: Add the logo

Upload the official logo through your builder's logo or site identity setting, rather than placing
it as an image in a page. Use the full color file on light headers and the white file on dark ones:

- `assets/logos/masschallenge-logo-horizontal-color.png`
- `assets/logos/masschallenge-logo-horizontal-white.png`
- `assets/logos/masschallenge-logo-monogram-color.png` for small spaces, such as a site icon

The [brand guidelines](brand.md) cover clear space, minimum size and which version to use where.

## Step 3 (optional): Add the Propellant stylesheet

Your theme settings cover the basics. The stylesheet adds the exact Propellant fonts and a few
ready made classes for the moments the settings cannot reach, such as a brand headline in Oswald
or a deep teal section. It only styles the elements you add a class to, so it never changes the
rest of your site.

Add this line to the head of your pages, using your builder's setting for code in the page head
(see your builder below):

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/dist/website.css"
/>
```

The `@v1.0.0` part pins your site to one release, so it never changes under you. When a new
version comes out, update the number and check your pages.

Then add class names to the elements you want styled:

| Class | What it does |
| --- | --- |
| `propellant-headline` | The big brand headline, in Oswald capitals. Use it once or twice per page. |
| `propellant-title-1`, `propellant-title-2`, `propellant-title-3` | Section headings, from largest to smallest. |
| `propellant-body` | Paragraph text. |
| `propellant-caption` | Small print, such as dates and notes. |
| `propellant-text` | Body font and text color for a whole section. |
| `propellant-link` | A teal, underlined link. |
| `propellant-button` | The main button: a teal capsule. Works on links and buttons. |
| `propellant-button propellant-button-secondary` | A quieter, light teal button for the second choice. |
| `propellant-brand-band` | A deep teal section with white text. Buttons and links inside it switch to white. |

```html
<section class="propellant-brand-band">
  <h1 class="propellant-headline">Back the rare humans</h1>
  <a class="propellant-button" href="/apply">Apply now</a>
</section>
```

## Your builder

### WordPress

1. **Theme settings first.** In a block theme, open **Appearance**, then **Editor**, then
   **Styles**, and set the fonts, colors and button style from step 1. In a classic theme, use
   **Appearance**, then **Customize**. Upload the logo in the site identity or Site Logo setting.
2. **Optional stylesheet.** If your theme's settings do not reach far enough, a developer can load
   the stylesheet from a child theme so it survives theme updates:

   ```php
   add_action('wp_enqueue_scripts', function () {
       wp_enqueue_style(
           'propellant',
           'https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/dist/website.css',
           [],
           null
       );
   });
   ```

   Editors can then add a class to any block under **Advanced**, then **Additional CSS class(es)**.

### Squarespace

1. **Site Styles first.** Open the site's design or **Site Styles** panel and set the fonts,
   colors and button shape from step 1. Upload the logo in the header settings. This covers most
   sites completely.
2. **Optional stylesheet.** On plans that include **Code Injection**, you can add the link from
   step 3 to the header. Squarespace's built in blocks do not take class names, so use the classes
   only inside a **Code** block for the occasional special section.

### Webflow

1. **Variables and styles first.** Add the colors and fonts from step 1 as variables, then style
   the body, headings, links and a button class in the Style panel. Everything built afterwards
   inherits them.
2. **Optional stylesheet.** With a paid plan, you can add the link from step 3 under **Site
   settings**, then **Custom code**, then **Head code**, and type a Propellant class name into an
   element's selector field. Custom code only runs on the published site.

### Wix

1. **Theme settings first.** In the editor's site design or theme settings, set the fonts, colors
   and button design from step 1, and upload the logo.
2. **Optional stylesheet.** Wix's editor does not take class names on its elements, so the
   stylesheet only helps inside an **Embed HTML** element. Most Wix sites should not need it.

### HubSpot

1. **Theme settings first.** Edit your theme's settings to set the fonts, colors and button styles
   from step 1, and upload the logo in the brand or website settings.
2. **Optional stylesheet.** Add the link from step 3 to the site header HTML setting, then use the
   classes in custom modules or templates.

### Plain HTML

Add the link from step 3 to the `<head>` of each page and use the classes. A complete working page
is in [`examples/website.html`](../examples/website.html).

### Any other builder

Look for the builder's design, style or theme settings and enter the values from step 1. If it
also has a setting for code in the page head and lets you add class names to elements, you can use
the stylesheet for special sections. If it does not, the theme settings alone are enough.

## Keep it maintainable

- **Prefer settings to code.** Anything set in your builder's design settings is visible to the
  next person and survives updates. Custom CSS is easy to forget and easy to break.
- **Avoid overriding your theme.** If a theme's style fights a Propellant class, change the theme
  setting instead of writing a more specific CSS rule against the theme's internals.
- **Pin the version.** Keep the `@v1.0.0` in the stylesheet link, and update it on purpose.
- **Check the published site.** In most builders, code in the page head only runs on the published
  site, not in the editor preview.
