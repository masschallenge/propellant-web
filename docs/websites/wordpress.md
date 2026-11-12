# WordPress

This guide gives a WordPress site the MassChallenge look: Lato for text, Oswald headlines in
capitals, the brand palette, pill shaped Oswald buttons, dark and light sections and the logo in the
right places. Most of it is point and click.
Plan on about an hour the first time, and less if your theme is already close.

WordPress comes in a few shapes, and the steps depend on yours. Find your setup in the table, then
follow only the parts marked for it.

| Your setup | How to tell | Follow |
| --- | --- | --- |
| **A. Block theme** | Your dashboard has **Appearance > Editor**. Themes such as Twenty Twenty-Five work this way. | Setup A in every part |
| **B. Classic theme** | Your dashboard has **Appearance > Customize** but no **Editor**. | Setup B in every part |
| **C. Page builder** | You build pages with a plugin such as Elementor, and the plugin has its own site settings. | Setup C notes |

If you are starting a new site, pick a block theme (setup A). It gives you the most control without
code.

## Before you start

**Which WordPress you have matters for custom code.**

- **Self-hosted WordPress (WordPress.org):** every feature in this guide is free. You need to be an
  Administrator.
- **WordPress.com:** the style settings in Part 1 work on every plan. Custom CSS (Part 4) needs a
  paid plan: WordPress.com lists it for the Personal, Premium, Business and Commerce plans. Uploading
  a child theme or installing a plugin (the advanced route at the end of Part 4) also needs a paid
  plan. Plans change, so check your plan page if a menu is missing.

**Your WordPress version changes a few menu names.** We point these out as we go. You can see your
version at the bottom of any dashboard screen, or under **Dashboard > Updates**.

**Have these open:**

- The [website spec](../websites.md) in another tab. Every value in this guide comes from it.
- The logo files, downloaded to your computer. Open each link and save the image:
  - [Horizontal logo, color](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/logos/masschallenge-logo-horizontal-color.png)
    for white and light backgrounds.
  - [Horizontal logo, white](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/logos/masschallenge-logo-horizontal-white.png)
    for Navy, Black, Deep Teal and other dark backgrounds.
  - [Monogram, color](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/logos/masschallenge-logo-monogram-color.png)
    for the site icon (the small picture in the browser tab).
  - The same folder also has `-black` versions, and a `masschallenge-logo-monogram-white.png`.

Upload the logo files to WordPress yourself, through the steps in Part 2. Do not link to a copy of
the logo from another website.

## Part 1: Set up site styles (no code)

This is the heart of the job. Set fonts, colors and buttons once here, and every page follows.

### Setup A: block themes (Site Editor and Styles)

In a block theme, **Styles** is one panel that controls the whole site: fonts, colors, spacing and
the default look of each type of block. WordPress calls these "global styles". Whatever you set
here applies everywhere, unless someone has styled a single block by hand.

#### Step 1: Open Styles

1. In the dashboard, go to **Appearance > Editor**.
2. Click **Styles** in the left menu, or the half filled circle icon at the top right.
3. If a welcome guide appears, close it.

You will move between three main sections: **Typography**, **Colors** and **Blocks**. The **Save**
button is at the top right. Save after each step so nothing is lost.

If your theme offers **Browse styles** (ready made style variations), you can ignore them. You are
about to set your own.

#### Step 2: Add Lato and Oswald with the Font Library

The Font Library installs fonts on your own site, so visitors do not load them from Google.

1. Open the Font Library:
   - **WordPress 7.0 or later:** go to **Appearance > Fonts** in the dashboard.
   - **WordPress 6.5 to 6.9:** in **Styles**, click **Typography**, then the **Manage fonts** button
     (an icon next to the **Fonts** heading).
   - **WordPress.com:** use whichever of the two your dashboard shows.
2. Click the **Install Fonts** tab. The first time, click **Allow access to Google Fonts**.
3. Search for **Lato**. Click it, tick **400 (Regular)** and **700 (Bold)**, also tick **400 Italic**
   if you use italics, then click **Install**.
4. Search for **Oswald**. Click it, tick **400 (Regular)**, **600 (SemiBold)** and **700 (Bold)**,
   then click **Install**.
5. Click the **Library** tab and check both fonts are listed.

If you would rather not connect to Google, download Lato and Oswald from Google Fonts on your
computer and add the files on the **Upload** tab instead (it accepts .ttf, .otf, .woff and .woff2).

#### Step 3: Create a font size for each text style

WordPress has no separate phone sizes. Instead it uses "fluid" sizes: you give a smallest and a
largest size, and the text scales smoothly between them as the screen gets wider. That is how you
get both the desktop and mobile sizes from the spec.

1. In **Styles**, click **Typography**, then **Font sizes** (in some versions this sits under a
   **Presets** heading).
2. Add a size for each row below. Click **+** (Add font size) to create one, or click an existing
   size to change it.
3. Give it the name from the table, turn on **Custom fluid values**, and enter the minimum and
   maximum.

| Name | Minimum (phones) | Maximum (desktop) |
| --- | --- | --- |
| Heading 1 | 40px | 64px |
| Heading 2 | 30px | 40px |
| Heading 3 | 24px | 30px |
| Heading 4 | 20px | 24px |
| Eyebrow | 14px | 14px (turn **Custom fluid values** off and enter 14px) |
| Big stat | 48px | 72px |
| Paragraph large | 18px | 20px |
| Paragraph | 16px | 17px |
| Paragraph small | 14px | 14px (turn **Custom fluid values** off and enter 14px) |
| Button | 16px | 16px (turn **Custom fluid values** off and enter 16px) |

If you do not see **Custom fluid values**, your theme has fluid type switched off. Enter the desktop
size for each one, and add the "Phone sizes" snippet in Part 4.

#### Step 4: Set the typography for each element

An "element" is a kind of text WordPress styles across the whole site: text, links, headings,
captions and buttons.

1. In **Styles**, click **Typography**. Under **Elements**, click **Text** and set:

   | Setting | Value |
   | --- | --- |
   | Font | Lato |
   | Size | Paragraph |
   | Appearance (the weight) | Regular (400) |
   | Line height | 1.5 |
   | Letter spacing | 0 |
   | Letter case | None (no change) |

2. Go back and click **Headings**. Choose the **All** tab and set **Font** to Oswald, **Appearance**
   to SemiBold (600), **Letter spacing** to 0 and **Letter case** to Uppercase. Every heading level
   now starts from Oswald SemiBold capitals.
3. Set each heading level's size and line height on its own tab:

   | Tab | Size | Line height |
   | --- | --- | --- |
   | H1 (the headline) | Heading 1 | 1 |
   | H2 | Heading 2 | 1 |
   | H3 (subhead) | Heading 3 | 1.1 |
   | H4 | Heading 4 | 1.15 |

4. Go back and click **Captions**: Lato, size **Paragraph small**, Regular (400), line height 1.5.
5. Go back and click **Buttons**: Oswald, size **Button**, SemiBold (600), line height 1, letter
   spacing 0.05em (pick the **em** unit), letter case Uppercase.
6. Leave **Links** on the default, so links match the text around them.
7. Click **Save**.

Type headings and button labels in normal sentence case: the capitals come from the style, so the
words stay readable to screen readers and search engines. Paragraphs are never in capitals.

Paragraph large is for the odd standout paragraph, such as the line under a headline. Pick the
**Paragraph large** size on that paragraph when you write it.

#### Step 5: Add the color palette

The palette is the set of colors offered in every color picker on the site. You will add the spec
colors so nobody has to type a hex code again.

1. In **Styles**, click **Colors**, then **Palette**.
2. Under **Custom**, click **+** to add a color. Click the new color, type its name and enter the
   hex value. Repeat for every row:

   | Name | Hex | Use it for |
   | --- | --- | --- |
   | White | `#FFFFFF` | Light section background |
   | Warm White | `#F8F8F5` | Alternate light section background |
   | Light tint | `#F3FAFC` | The angled tint on a light section |
   | Navy | `#10263F` | Dark section background |
   | Black | `#222222` | Body text, and dark section background |
   | Deep Teal | `#004F73` | Dark section background |
   | Teal | `#00708E` | Headings, links and buttons on light |
   | Cyan | `#54EEFF` | Text, links and outlines on dark sections only |
   | MC Blue | `#0EABBC` | Graphic shapes only, never text |
   | Slate | `#4B575B` | Secondary text on light, such as captions |
   | Line | `#DBE1E3` | Lines and dividers |
   | Yellow | `#FFC801` | One warm accent: tags, rules and stats, with Black text |
   | Error | `#BF0261` | Form errors only |

3. Click **Done**.

The other warm accents (Orange, Raspberry and Lime) are for graphics, not for site text, so they
are not in the palette. Use one warm accent per page, in small doses.

Your theme also has its own **Theme** colors, and its header, footer and patterns use them. To keep
those parts on brand, open the three dots menu next to **Theme**, choose **Edit colors**, and
change each one to the closest spec color. Names vary by theme. If yours uses names such as Base,
Contrast and Accent, set **Base** to White `#FFFFFF` and **Contrast** to Black `#222222`, then look
at where each Accent appears on your site and give it the spec color for that job (for example, an
accent used for links becomes Teal `#00708E`, a light background accent becomes Warm White
`#F8F8F5`, and a dark background accent becomes Navy `#10263F`).

#### Step 6: Set the colors for each element

1. In **Styles > Colors**, under **Elements**, set:

   | Element | Setting | Color |
   | --- | --- | --- |
   | Background | | White `#FFFFFF` |
   | Text | | Black `#222222` |
   | Links | Default | Teal `#00708E` |
   | Headings | All | Teal `#00708E` |
   | Headings | H1 | Black `#222222` |
   | Captions | Text | Slate `#4B575B` |
   | Buttons | Text | White `#FFFFFF` |
   | Buttons | Background | Teal `#00708E` |

2. Click **Save**.

#### Step 7: Style the primary and secondary buttons

The Button block comes with two built in "block style variations": **Fill** and **Outline**. A block
style variation is a ready made look you can pick for a single block. Fill is the primary button
and Outline is the secondary button, so anyone editing a page can switch between them with one
click.

1. In **Styles**, click **Blocks**, then search for and click **Button**.
2. Set the default (Fill) look:
   - **Color:** Text White `#FFFFFF`, Background Teal `#00708E`.
   - **Typography:** Oswald, size Button, SemiBold (600), line height 1, letter spacing 0.05em,
     letter case Uppercase.
   - **Dimensions > Padding:** 14px top and bottom, 28px left and right. Click the link icon to set
     the sides separately.
   - **Border & Shadow:** border 2px, solid, Teal `#00708E`, no shadow, and **Radius** 9999px. A
     radius bigger than the button makes the ends fully round, which is the pill shape. Never use
     a smaller radius: square cornered buttons are retired.
3. If the panel shows a **Hover** state, choose it and set Background to none (transparent) and
   Text to Teal `#00708E`, so the fill clears to a Teal outline. Many versions do not offer hover
   for all buttons at once. In that case the button snippet in Part 4 adds it.
4. Find the style variations (shown as **Fill** and **Outline**, near the top of the Button panel)
   and click **Outline**. Set:
   - **Color:** Text Teal `#00708E`, Background none (transparent).
   - **Border:** 2px, solid, Teal `#00708E`. Keep the same radius, padding and typography as above.
   - **Hover**, if offered: Background Teal `#00708E`, Text White `#FFFFFF`.
5. Click **Save**.

The secondary button is still called "Outline" in the editor, which matches how it looks.

#### Step 8: Set the page width, images and sections

1. In **Styles**, click **Layout** and set **Content** width to 720px. This keeps paragraphs to
   about 68 characters a line. Leave **Wide** as it is.
2. In **Styles > Blocks**, click **Image**, open **Border & Shadow** and set **Radius** to 0. Photos
   and cards have square corners.
3. Click **Save**.

#### Step 9: Check on a phone

At the top of the Site Editor, open the **Preview** menu (a screen icon in some versions) and choose
**Mobile**. Check that the headline is smaller and still on one or two lines, and that buttons fit.
Switch back to **Desktop** when you are done.

### Setup B: classic themes (the Customizer)

Classic themes put their settings in the Customizer. Each theme builds its own Customizer, so the
panels differ from theme to theme. WordPress itself always gives you **Site Identity** and
**Additional CSS**. Fonts, colors and buttons depend on what your theme offers.

1. Go to **Appearance > Customize**.
2. Look for a **Colors** panel (it may be called **Colors & Dark Mode**, **Global** or **Design**).
   Match your theme's color slots to the spec:

   | Common theme label | Spec color |
   | --- | --- |
   | Background color | White `#FFFFFF` |
   | Text color, Body text | Black `#222222` |
   | Heading color | Teal `#00708E` |
   | Primary, Accent, Link color | Teal `#00708E` |
   | Link hover, Accent hover | Deep Teal `#004F73` |
   | Button background | Teal `#00708E` |
   | Button text | White `#FFFFFF` |
   | Button hover background | White `#FFFFFF`, with Teal text if the theme lets you set it |
   | Border, Divider | Line `#DBE1E3` |
   | Alternate background, Light background | Warm White `#F8F8F5` |
   | Dark background, Footer background | Navy `#10263F` |

   Turn off any dark mode switch, so the colors stay as set.

3. Look for a **Typography** or **Fonts** panel. If you find one, set body text to Lato, Regular
   (400), 17px, line height 1.5, and headings to Oswald, SemiBold (600), uppercase, letter spacing
   0. Then set H1 to 64px with line height 1, and use the H2 to H4 sizes and line heights from the
   spec. If your theme has separate mobile sizes, enter the sizes in brackets from the spec (H1
   40px, H2 30px, H3 24px, H4 20px, text 16px).
4. Look for a **Buttons** panel. If you find one, set the corner radius as high as it goes (or
   9999px), padding to 14px top and bottom and 28px left and right, a 2px Teal border, and font to
   Oswald SemiBold (600) at 16px, uppercase, letter spacing 0.05em.
5. Click **Publish**.

No Typography panel? That is common in classic themes. Use the "Classic theme fonts and text"
snippet in Part 4. On WordPress 7.0 or later you can also install Lato and Oswald in **Appearance >
Fonts** (Step 2 of setup A), but a classic theme still needs the snippet to use them.

Your pages and posts still use the block editor, so the Group, Cover and Buttons steps in Part 3
work for you too.

### Setup C: page builders such as Elementor

A page builder has its own global settings, and they win over the WordPress theme on the pages it
builds. Set them once and the builder's widgets follow. In Elementor:

1. Open any page with **Edit with Elementor**, click the Elementor menu at the top left, and choose
   **Site Settings**.
2. Under **Design System > Global Colors**, set the four system colors, then add the rest of the
   spec colors as custom colors with the same names and hex values as the palette table in Step 5
   above:

   | Elementor slot | Spec color |
   | --- | --- |
   | Primary (used by headings) | Teal `#00708E` |
   | Secondary | Navy `#10263F` |
   | Text | Black `#222222` |
   | Accent (used by buttons) | Teal `#00708E` |

3. Under **Design System > Global Fonts**, set:

   | Elementor slot | Font |
   | --- | --- |
   | Primary (headings) | Oswald, 600, uppercase, line height 1 |
   | Secondary (eyebrows) | Oswald, 400, 14px, uppercase, letter spacing 0.3em |
   | Text | Lato, 400, line height 1.5 |
   | Accent (buttons) | Oswald, 600, 16px, uppercase, letter spacing 0.05em |

   Add one more global font named **Big stat**: Oswald, 700, line height 1. Pick it on large
   numbers only.

4. Under **Theme Style**, set **Typography** for body text and H1 to H4 with the sizes from the
   spec (Elementor lets you switch to tablet and mobile sizes with the device icon next to each
   size). Set **Buttons** to Teal `#00708E` background, White text and a 2px Teal border, with a
   transparent background and Teal text on hover, a large border radius for pill ends, and 14px by
   28px padding.
5. Click **Update**.

Other page builders have the same ideas under different names, usually "global colors", "global
fonts" and "theme style". Use the same mapping.

## Part 2: Add the logo and site icon

The site icon is the small picture in the browser tab and on phone home screens. WordPress needs it
square, at least 512 by 512 pixels. The monogram file is wider than it is tall, so first place it in
the middle of a square, at least 512 by 512 pixel canvas, in any image editor. Leave space around
it and never stretch it. Save that as a PNG.

### Setup A: block themes

1. Go to **Appearance > Editor** and click **Identity** in the left menu (newer versions). Click the
   **Site Logo** area and upload `masschallenge-logo-horizontal-color.png`. Click the **Site Icon**
   area and upload your square monogram.
2. No **Identity** menu? Open **Patterns > Template Parts > Header** (in older versions,
   **Template Parts > Header**), click the **Site Logo** block and upload the logo there. Set the
   site icon in **Settings > General > Site Icon** (WordPress 6.5 or later) or in the Site Logo
   block's settings.
3. Select the Site Logo block in your header and set its **Image width** to about 240px. That shows
   the logo about 32px tall. Never go below 180px wide (24px tall): the brand minimum is 160px wide,
   and below 24px tall the name is hard to read, so use the monogram instead.
4. In the block's settings, turn on **Link image to home** if your theme offers it.
5. Click **Save**.

If your header has a Navy, Black or Deep Teal background, use
`masschallenge-logo-horizontal-white.png` there. The color logo is only for White and Warm White
backgrounds.

### Setup B: classic themes

1. Go to **Appearance > Customize > Site Identity**.
2. Click **Select logo**, upload `masschallenge-logo-horizontal-color.png` and click **Choose logo**.
   If WordPress offers to crop it, choose **Skip cropping**.
3. If your theme shows the site title next to the logo, untick **Display Site Title and Tagline**,
   since the logo already says MassChallenge.
4. Under **Site Icon**, click **Select site icon** (or **Select Image**) and upload your square
   monogram.
5. Click **Publish**.

### Setup C: Elementor

In **Site Settings > Site Identity**, upload the logo and the square monogram as the favicon (the
site icon).

### On every setup

Keep clear space around the logo equal to the height of the "M" in the MASSCHALLENGE wordmark, on
every side, and align it to a corner or the top edge of its area. Do not add a shadow, recolor it
or put it inside a box. The [brand guidelines](../brand.md) have the full rules.

## Part 3: Build on brand pages

These steps use the block editor, which all block themes and most classic themes use for pages.
Open a page with **Pages > Add New Page** (or edit an existing one).

### The section rhythm

Alternate dark sections (Navy, Black or Deep Teal) with light ones (White or Warm White) down the
page. Mark each change with the notch, a small triangle that points down from one section into the
next, in the color of the section above it. The notch and the angled tint need the section snippet
in Part 4.

### A White or Warm White section

1. Click **+** (the block inserter) and add a **Group** block.
2. In the block settings on the right, open the **Styles** tab (the half filled circle).
3. Under **Color**, leave **Background** empty for White, or choose **Warm White** `#F8F8F5`.
4. Under **Dimensions > Padding**, set top and bottom to 96px.
5. Add your heading, paragraphs and buttons inside the Group.

### A light section with an angled edge

Follow the same steps with **Background** empty, then open **Advanced** and type
`propellant-section-angled` in **Additional CSS class(es)**. With the section snippet from Part 4,
the pale tint `#F3FAFC` rises on a gentle angle from White behind the content. Use a Teal headline
and a Teal primary button in it.

### A Navy, Black or Deep Teal section

1. Add a **Group** block.
2. Set **Color > Background** to **Navy** `#10263F`, **Black** `#222222` or **Deep Teal**
   `#004F73`, **Text** to **White**, **Heading** to **White** and **Link** to **Cyan** `#54EEFF`.
3. Set top and bottom **Padding** to 96px.
4. For accents, such as the payoff of a two toned headline, use **Cyan** `#54EEFF`. Never put Teal
   text on a dark section.
5. Open **Advanced** and type `propellant-section-navy`, `propellant-section-black` or
   `propellant-section-deep-teal` in **Additional CSS class(es)**, to match the background. With
   the button snippet from Part 4, the buttons in the section turn into Cyan outlines. Add
   `propellant-notch` as well (separated by a space) to draw the notch below the section.

### A hero with a photo

1. Add a **Cover** block and choose a photo by the [images guide](../images.md#brand-photography).
2. Set the **Overlay** to a gradient: open the overlay color, choose **Gradient**, and make it a
   linear gradient from Navy black `#051925` on the side where the text sits to Ocean `#037AA6` on
   the side of the subject.
3. Set **Overlay opacity** between 15 and 30. Warm light should still glow through the photo; if
   warm areas turn gray or blue, the overlay is too heavy.
4. Place the text over a calm area of the photo. If it is hard to read, move it, or put it on a
   solid Navy, Black or Deep Teal Group inside the Cover instead.

### The eyebrow and the headline

1. Add a **Paragraph** block above the headline for the eyebrow. In its **Typography** settings,
   set the font to Oswald, size **Eyebrow**, Regular (400), letter spacing 0.3em and letter case
   Uppercase.
2. Add a **Heading** block and choose **H1** in its toolbar. It picks up Oswald capitals from
   Step 4. Type it in normal sentence case. Use one H1 per page.
3. For a two toned headline, select the payoff words, click the arrow in the toolbar, choose
   **Highlight**, and set the text color to Teal `#00708E` on light sections or Cyan `#54EEFF` on
   dark ones.

Save the eyebrow as a pattern (below), so nobody has to set it by hand again.

### Numbered blocks and white cards

- **Numbered block.** A Group with a 6px Black top border (**Border & Shadow**, top side only,
  Black `#222222`), then an H2 with the number (such as 01) in Teal, an H3 title and a paragraph.
- **White card.** Inside a dark section, a Group with a White background, Black text, Teal headings
  and no radius. Put an H3 title and a paragraph in it.

### Primary and secondary buttons

1. Add a **Buttons** block. It starts with one button. That is your primary button: a Teal pill
   with White text.
2. Click the **+** inside the Buttons block to add a second button.
3. Select the second button, open **Styles** in its settings (or **Change block style** in its
   toolbar) and choose **Outline**. That is your secondary button: a Teal outline with Teal text.
4. Write button labels in sentence case with a verb, such as "Apply now" or "Meet the startups".
   The capitals come from the style. For a "see all" link, you can end the label with an arrow (→).

### Buttons on dark sections

On a Navy, Black or Deep Teal section, buttons are a Cyan outline with White text and fill with
Teal on hover.

- **With the button snippet** (Part 4) and a section class such as `propellant-section-navy` on
  the section: just add a Buttons block. It turns into a Cyan outline on its own.
- **Without code:** select the button and choose the **Outline** style, then set **Color > Text**
  to **White** and **Border** color to **Cyan** `#54EEFF`. On WordPress 7.1 or later, choose the
  **Hover** state at the top of the button's settings and set **Background** to **Teal** `#00708E`.

### Save sections to reuse

Once a section looks right, select the Group, open the three dots menu in its toolbar and choose
**Create pattern**. Name it, for example "Navy section", and leave **Synced** off so each copy
can have its own words. It now appears in the inserter under **Patterns** for everyone.

### Build a sample home page

1. **Hero (Navy):** a Cover block with a photo and the hero overlay, an eyebrow, an H1 headline,
   one Paragraph large sentence and a Buttons block with one button. Add `propellant-notch` to it.
2. **About (Warm White):** a Warm White Group with an H2, two short paragraphs and a primary plus a
   secondary button.
3. **Highlights (Navy):** a Navy Group with a **Columns** block of three columns. In each column,
   add a white card with an Image (square cornered by Step 8), an H3 and a short paragraph. Add
   `propellant-notch` to the Group.
4. **How it works (White, angled):** a light section with the angled edge, an H2 and three numbered
   blocks.
5. **Call to action (Deep Teal):** reuse your dark section pattern with a short H2 and one button.
6. Click **Publish**, then view the page on a computer and a phone.

## Part 4: Custom CSS (only what settings cannot do)

**This part is optional.** Custom CSS is a short piece of code that changes how the site looks.
Use only the snippets you need. Each one starts with a comment line so the next person knows where
it came from.

What the settings cannot do, and these snippets fix:

- **Button hovers and outlines for all buttons at once.** Many WordPress versions only let you set
  button hover one button at a time, or not at all.
- **Buttons on dark sections without styling each one by hand.**
- **The notch and the angled tint** between sections.
- **Phone sizes** when your theme has fluid type switched off.
- **Fonts and text in classic themes** that have no Typography panel.

### Where to paste it

| Setup | Where | Who can use it |
| --- | --- | --- |
| A. Block theme | **Appearance > Editor > Styles**, open the three dots menu at the top of the Styles panel and choose **Additional CSS**. Paste, then click **Save**. | Self-hosted: everyone. WordPress.com: Personal plan and above. |
| B. Classic theme | **Appearance > Customize > Additional CSS**. Paste, then click **Publish**. | Self-hosted: everyone. WordPress.com: Personal plan and above. |
| C. Elementor | **Site Settings > Custom CSS**. | May need Elementor Pro. |

Paste each snippet below anything already in the box. CSS saved here stays when your theme
updates, but is cleared if you switch themes, so keep a copy.

### Snippet: buttons (setups A and B)

Adds the spec hovers to primary buttons and secondary (Outline) buttons, and turns buttons in any
section with a dark section class into Cyan outlines that fill with Teal on hover.

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.wp-block-button__link,
.wp-element-button {
  border: 2px solid #00708e;
}

.wp-block-button__link:hover,
.wp-element-button:hover {
  background-color: transparent;
  color: #00708e;
}

.is-style-outline .wp-block-button__link:hover {
  background-color: #00708e;
  color: #ffffff;
}

:is(.propellant-section-navy, .propellant-section-black, .propellant-section-deep-teal)
  .wp-block-button__link {
  background-color: transparent;
  border-color: #54eeff;
  color: #ffffff;
}

:is(.propellant-section-navy, .propellant-section-black, .propellant-section-deep-teal)
  .wp-block-button__link:hover {
  background-color: #00708e;
  border-color: #00708e;
  color: #ffffff;
}
```

### Snippet: sections (setups A and B)

Draws the notch below any section with the `propellant-notch` class, in that section's own
background color, and the angled tint on any section with the `propellant-section-angled` class.

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.propellant-notch {
  position: relative;
}

.propellant-notch::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 1;
  width: 48px;
  height: 24px;
  background-color: inherit;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform: translateX(-50%);
}

.propellant-section-angled {
  background-image: linear-gradient(174deg, #ffffff 40%, #f3fafc calc(40% + 1px));
}
```

### Snippet: phone sizes (setup A without fluid type)

Uses the spec's mobile sizes on screens narrower than a tablet, and trims section spacing to 64px
on any Group that has `propellant-section` in **Advanced > Additional CSS class(es)**. The
`!important` is needed because WordPress writes padding straight onto each block.

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
@media (max-width: 767px) {
  h1 { font-size: 40px; }
  h2 { font-size: 30px; }
  h3 { font-size: 24px; }
  h4 { font-size: 20px; }
  body { font-size: 16px; }
  .propellant-section {
    padding-top: 64px !important;
    padding-bottom: 64px !important;
  }
}
```

### Snippet: fonts, text and buttons (setup B without a Typography panel)

Loads Lato and Oswald from Google Fonts and sets every text style and the button shape from the
spec. Keep the `@import` line at the very top of the Additional CSS box, above anything else, or the
fonts will not load. Add the buttons and sections snippets above as well.

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Oswald:wght@400;600;700&display=swap");

body {
  font-family: "Lato", sans-serif;
  font-size: 17px;
  line-height: 1.5;
  color: #222222;
  background-color: #ffffff;
}

h1, h2, h3, h4 {
  font-family: "Oswald", sans-serif;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: uppercase;
  color: #00708e;
}

h1 { font-size: 64px; line-height: 1; color: #222222; }
h2 { font-size: 40px; line-height: 1; }
h3 { font-size: 30px; line-height: 1.1; }
h4 { font-size: 24px; line-height: 1.15; }

a { color: #00708e; }

img { border-radius: 0; }

.wp-block-button__link,
.wp-element-button {
  font-family: "Oswald", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 1;
  letter-spacing: 0.05em;
  padding: 14px 28px;
  border-radius: 9999px;
  box-shadow: none;
  text-transform: uppercase;
  background-color: #00708e;
  color: #ffffff;
}

.is-style-outline .wp-block-button__link {
  background-color: transparent;
  color: #00708e;
}

@media (max-width: 767px) {
  body { font-size: 16px; }
  h1 { font-size: 40px; }
  h2 { font-size: 30px; }
  h3 { font-size: 24px; }
  h4 { font-size: 20px; }
}
```

If you installed Lato and Oswald in **Appearance > Fonts** (WordPress 7.0 or later), you can delete
the `@import` line.

### Using the Propellant stylesheet instead (setup B)

The [Propellant stylesheet](../websites.md#the-propellant-stylesheet) loads the exact fonts and
adds ready made class names. In a classic theme, put this line at the very top of **Additional
CSS**:

```css
@import url("https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/dist/website.css");
```

Then type class names into a block's **Advanced > Additional CSS class(es)** box:

| Block | Class | What you get |
| --- | --- | --- |
| H1 Heading | `propellant-headline` | Heading 1 from the spec, in Oswald SemiBold capitals |
| Paragraph above a headline | `propellant-eyebrow` | The tracked Oswald eyebrow |
| H2, H3, H4 Heading | `propellant-title-1`, `propellant-subhead`, `propellant-title-3` | Heading 2, 3 and 4 from the spec |
| Paragraph | `propellant-body` | Paragraph from the spec |
| Paragraph (small print) | `propellant-caption` | Paragraph small, in Slate |
| Paragraph with a number | `propellant-stat` | The big stat, in Oswald Bold |
| Group | `propellant-section-navy`, `propellant-section-black`, `propellant-section-deep-teal` | A dark section with White text and Cyan links |
| Group | `propellant-section-warm-white`, `propellant-section-angled` | A light section, plain or with the angled tint |
| Group | `propellant-notch` | The notch below the section |
| Group | `propellant-card` | A white card with square corners and Teal titles |

 Skip `propellant-button` in WordPress: the class lands
on the wrapper around the button, not the button itself, so keep using the button settings above.

In a block theme, the Styles **Additional CSS** box does not reliably run `@import` lines, so use the
developer route below to load the stylesheet.

### How to remove it later

Open the same Additional CSS box, select everything from a `/* Propellant website styles` comment
line down to the end of that snippet, delete it and save. The class names left on blocks do nothing
once the CSS is gone, so they are safe to leave.

### Advanced: the developer route (child theme)

This is for people comfortable editing theme files. It puts the brand palette, fonts and the
Propellant stylesheet into a child theme, so they live in files you can keep in version control
rather than in settings. A child theme is a small theme that borrows everything from your main
(parent) theme and adds your changes, so theme updates do not wipe them out.

On self-hosted WordPress, upload the child theme in **Appearance > Themes > Add New Theme > Upload
Theme**, or by FTP. On WordPress.com, uploading themes needs a paid plan.

Create a folder named `propellant-child` with three files. Change `twentytwentyfive` to your parent
theme's folder name.

`style.css`:

```css
/*
Theme Name: Propellant child
Template: twentytwentyfive
*/
```

`functions.php` loads the Propellant stylesheet on the site and in the editor, and adds two section
styles (Warm White and Navy) that anyone can pick from a Group or Cover block's **Styles** panel:

```php
<?php
const PROPELLANT_STYLESHEET =
	'https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/dist/website.css';

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'propellant-website', PROPELLANT_STYLESHEET, array(), null );
} );

add_action( 'after_setup_theme', function () {
	add_editor_style( PROPELLANT_STYLESHEET );
} );

add_action( 'init', function () {
	register_block_style( array( 'core/group', 'core/cover' ), array(
		'name'       => 'propellant-warm-white',
		'label'      => 'Warm White section',
		'style_data' => array(
			'color' => array( 'background' => '#F8F8F5', 'text' => '#222222' ),
		),
	) );
	register_block_style( array( 'core/group', 'core/cover' ), array(
		'name'       => 'propellant-navy',
		'label'      => 'Navy section',
		'style_data' => array(
			'color'    => array( 'background' => '#10263F', 'text' => '#FFFFFF' ),
			'elements' => array(
				'link'    => array( 'color' => array( 'text' => '#54EEFF' ) ),
				'heading' => array( 'color' => array( 'text' => '#FFFFFF' ) ),
				'button'  => array(
					'color'  => array( 'background' => 'transparent', 'text' => '#FFFFFF' ),
					'border' => array( 'color' => '#54EEFF', 'width' => '2px', 'style' => 'solid' ),
					':hover' => array(
						'color'  => array( 'background' => '#00708E', 'text' => '#FFFFFF' ),
						'border' => array( 'color' => '#00708E' ),
					),
				),
			),
		),
	) );
} );
```

`theme.json` adds the spec palette and font families. The fonts load from the Propellant release
(Lato ships there under the name Propellant Sans, which is Lato 2.0). This palette replaces your
parent theme's palette, so White and Black keep the parent's `base` and `contrast` slugs (the internal
names its header and footer use). Check every page after switching, and remove any Lato or Oswald
you installed in the Font Library so there is only one copy.

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        { "slug": "base", "name": "White", "color": "#FFFFFF" },
        { "slug": "warm-white", "name": "Warm White", "color": "#F8F8F5" },
        { "slug": "light-tint", "name": "Light tint", "color": "#F3FAFC" },
        { "slug": "navy", "name": "Navy", "color": "#10263F" },
        { "slug": "contrast", "name": "Black", "color": "#222222" },
        { "slug": "deep-teal", "name": "Deep Teal", "color": "#004F73" },
        { "slug": "teal", "name": "Teal", "color": "#00708E" },
        { "slug": "cyan", "name": "Cyan", "color": "#54EEFF" },
        { "slug": "mc-blue", "name": "MC Blue", "color": "#0EABBC" },
        { "slug": "slate", "name": "Slate", "color": "#4B575B" },
        { "slug": "line", "name": "Line", "color": "#DBE1E3" },
        { "slug": "yellow", "name": "Yellow", "color": "#FFC801" },
        { "slug": "error", "name": "Error", "color": "#BF0261" }
      ]
    },
    "typography": {
      "fontFamilies": [
        {
          "slug": "lato",
          "name": "Lato",
          "fontFamily": "Lato, sans-serif",
          "fontFace": [
            {
              "fontFamily": "Lato",
              "fontWeight": "400",
              "fontStyle": "normal",
              "src": "https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/fonts/propellant-sans-400-latin.woff2"
            },
            {
              "fontFamily": "Lato",
              "fontWeight": "700",
              "fontStyle": "normal",
              "src": "https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/fonts/propellant-sans-700-latin.woff2"
            }
          ]
        },
        {
          "slug": "oswald",
          "name": "Oswald",
          "fontFamily": "Oswald, sans-serif",
          "fontFace": [
            {
              "fontFamily": "Oswald",
              "fontWeight": "400 700",
              "fontStyle": "normal",
              "src": "https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/fonts/oswald-latin-variable.woff2"
            }
          ]
        }
      ]
    }
  }
}
```

Activate the child theme in **Appearance > Themes**, then follow Part 1, Setup A, from Step 3. Your
choices in Styles are saved on top of `theme.json`, so if a color or font from the file does not
show, open **Styles**, then the three dots menu, and choose **Reset to defaults**. To undo the whole
route, switch back to the parent theme.

## Check your work

Check on a computer, then on a phone (or the Mobile preview).

- [ ] Every heading is Oswald SemiBold, in capitals. The H1 is about 64px on a computer and 40px
      on a phone.
- [ ] Paragraphs are Lato, in sentence case, with a line height of 1.5.
- [ ] Body text is Black `#222222` on White or Warm White, and paragraphs are no wider than about
      720px.
- [ ] Links and headings H2 to H4 are Teal `#00708E` on light sections.
- [ ] Primary buttons are Teal pills in Oswald capitals with White text, and clear to a Teal
      outline on hover.
- [ ] Secondary buttons are Teal outlines with Teal text, and fill with Teal on hover.
- [ ] Dark sections have White text, Cyan links and Cyan outline buttons, and no Teal text.
- [ ] Dark and light sections alternate, with a notch where they meet.
- [ ] The logo is the color version on White and Warm White and the white version on dark
      sections, at least 24px tall, with room around it.
- [ ] The site icon shows the monogram in the browser tab.
- [ ] Images and cards have square corners.
- [ ] On a phone, nothing runs off the side and buttons are easy to tap.

## If something looks off

- **A font change did not show up on the live site.** Make sure you clicked **Save** (Site Editor)
  or **Publish** (Customizer), then reload the page. If your site uses a caching plugin or host
  cache, clear it.
- **One button or heading ignores the global styles.** It was styled by hand on that page. Select
  it, and in its settings click the three dots next to **Color** or **Typography** and choose
  **Reset all**. Also, a button colored by hand from the palette will not pick up the hover
  snippet, so reset its colors and let the global styles do the work.
- **Lato or Oswald is not in the font list.** Open the Font Library **Library** tab. If the font is
  missing, install it again (Step 2). If it is listed, check the weights you need (Lato 400 and 700,
  Oswald 400, 600 and 700) are ticked, then click **Update**.
- **Additional CSS or Fonts is missing from the menu.** On WordPress.com, custom CSS needs a paid
  plan. On self-hosted WordPress, update to the latest version: Additional CSS moved into the
  Styles three dots menu in 6.9, and the Font Library moved to **Appearance > Fonts** in 7.0.
- **The logo looks squashed or blurry.** Use the original PNG from the links above, never a
  screenshot, and size it with the Site Logo block's width setting rather than by dragging.
- **The headline is in capitals in the editor's list view and in search results.** You typed it in
  capitals. Retype it in sentence case and let the heading style add the capitals.
