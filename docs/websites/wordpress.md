# WordPress

This guide gives a WordPress site the MassChallenge look: Lato for text, the Oswald headline, our
teal palette, pill shaped buttons and the logo in the right places. Most of it is point and click.
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
  - [Horizontal logo, color](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-color.png)
    for white and light backgrounds.
  - [Horizontal logo, white](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-white.png)
    for Deep teal and dark backgrounds.
  - [Monogram, color](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-monogram-color.png)
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
4. Search for **Oswald**. Click it, tick **500 (Medium)**, then click **Install**.
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
   | Line height | 1.6 |
   | Letter spacing | 0 |
   | Letter case | None (no change) |

2. Go back and click **Headings**. Choose the **All** tab and set **Font** to Lato, **Appearance** to
   Bold (700) and **Letter case** to none. Every heading level now starts from Lato Bold.
3. Choose the **H1** tab. This is the big brand headline:

   | Setting | Value |
   | --- | --- |
   | Font | Oswald |
   | Size | Heading 1 |
   | Appearance | Medium (500) |
   | Line height | 1 |
   | Letter spacing | 0.01em (pick the **em** unit) |
   | Letter case | Uppercase |

4. Set the other heading levels the same way. Each one is Lato, Bold (700), letter spacing 0 and no
   letter case change:

   | Tab | Size | Line height |
   | --- | --- | --- |
   | H2 | Heading 2 | 1.15 |
   | H3 | Heading 3 | 1.2 |
   | H4 | Heading 4 | 1.25 |

5. Go back and click **Captions**: Lato, size **Paragraph small**, Regular (400), line height 1.5.
6. Go back and click **Buttons**: Lato, size **Button**, Bold (700), line height 1, letter spacing 0,
   letter case none. Buttons are sentence case, never capitals.
7. Leave **Links** on the default, so links match the text around them.
8. Click **Save**.

Paragraph large is for the odd standout paragraph, such as the line under a headline. Pick the
**Paragraph large** size on that paragraph when you write it, and set its line height to 1.5.

#### Step 5: Add the color palette

The palette is the set of colors offered in every color picker on the site. You will add all eleven
spec colors so nobody has to type a hex code again.

1. In **Styles**, click **Colors**, then **Palette**.
2. Under **Custom**, click **+** to add a color. Click the new color, type its name and enter the
   hex value. Repeat for every row:

   | Name | Hex | Use it for |
   | --- | --- | --- |
   | White | `#FFFFFF` | Page background |
   | Mist | `#F3F6F7` | Alternate section background |
   | Ink | `#1E282B` | Body text and headings |
   | Slate | `#4B575B` | Secondary text, such as captions |
   | Teal | `#065E6F` | Links and buttons |
   | Deep teal | `#044451` | Button hover, and dark brand sections |
   | Bright teal | `#0FACBD` | Accents on Deep teal sections only |
   | Pale teal | `#D9F6FA` | Secondary buttons and tinted sections |
   | Line | `#DBE1E3` | Lines and dividers |
   | Yellow | `#FFC801` | Highlights, always with Ink text |
   | Magenta | `#A30253` | Errors |

3. Click **Done**.

Your theme also has its own **Theme** colors, and its header, footer and patterns use them. To keep
those parts on brand, open the three dots menu next to **Theme**, choose **Edit colors**, and
change each one to the closest spec color. Names vary by theme. If yours uses names such as Base,
Contrast and Accent, set **Base** to White `#FFFFFF` and **Contrast** to Ink `#1E282B`, then look at
where each Accent appears on your site and give it the spec color for that job (for example, an
accent used for links becomes Teal `#065E6F`, and a light background accent becomes Mist
`#F3F6F7`).

#### Step 6: Set the colors for each element

1. In **Styles > Colors**, under **Elements**, set:

   | Element | Setting | Color |
   | --- | --- | --- |
   | Background | | White `#FFFFFF` |
   | Text | | Ink `#1E282B` |
   | Links | Default | Teal `#065E6F` |
   | Headings | All | Ink `#1E282B` |
   | Captions | Text | Slate `#4B575B` |
   | Buttons | Text | White `#FFFFFF` |
   | Buttons | Background | Teal `#065E6F` |

2. Click **Save**.

#### Step 7: Style the primary and secondary buttons

The Button block comes with two built in "block style variations": **Fill** and **Outline**. A block
style variation is a ready made look you can pick for a single block. We set Fill as the primary
button and turn Outline into our secondary button, so anyone editing a page can switch between them
with one click.

1. In **Styles**, click **Blocks**, then search for and click **Button**.
2. Set the default (Fill) look:
   - **Color:** Text White `#FFFFFF`, Background Teal `#065E6F`.
   - **Typography:** Lato, size Button, Bold (700), line height 1, letter case none.
   - **Dimensions > Padding:** 14px top and bottom, 28px left and right. Click the link icon to set
     the sides separately.
   - **Border & Shadow:** border width 0, no shadow, and **Radius** 9999px. A radius bigger than the
     button makes the ends fully round, which is the pill shape.
3. If the panel shows a **Hover** state, choose it and set Background to Deep teal `#044451`. Many
   versions do not offer hover for all buttons at once. In that case the hover snippet in Part 4
   adds it.
4. Find the style variations (shown as **Fill** and **Outline**, near the top of the Button panel)
   and click **Outline**. Set:
   - **Color:** Text Teal `#065E6F`, Background Pale teal `#D9F6FA`.
   - **Border:** width 0. Keep the same radius, padding and typography as above.
5. Click **Save**.

The secondary button will still be called "Outline" in the editor. Tell your team that Outline means
the secondary button.

#### Step 8: Set the page width, images and sections

1. In **Styles**, click **Layout** and set **Content** width to 720px. This keeps paragraphs to
   about 68 characters a line. Leave **Wide** as it is.
2. In **Styles > Blocks**, click **Image**, open **Border & Shadow** and set **Radius** to 12px.
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
   | Text color, Body text | Ink `#1E282B` |
   | Heading color | Ink `#1E282B` |
   | Primary, Accent, Link color | Teal `#065E6F` |
   | Link hover, Accent hover | Deep teal `#044451` |
   | Button background | Teal `#065E6F` |
   | Button text | White `#FFFFFF` |
   | Button hover background | Deep teal `#044451` |
   | Border, Divider | Line `#DBE1E3` |
   | Alternate background, Light background | Mist `#F3F6F7` |

   Turn off any dark mode switch, so the colors stay as set.

3. Look for a **Typography** or **Fonts** panel. If you find one, set body text to Lato, Regular
   (400), 17px, line height 1.6, and headings to Lato, Bold (700). Then set H1 to Oswald, Medium
   (500), 64px, line height 1, letter spacing 0.01em, uppercase. Use the H2 to H4 sizes and line
   heights from the spec. If your theme has separate mobile sizes, enter the sizes in brackets from
   the spec (H1 40px, H2 30px, H3 24px, H4 20px, text 16px).
4. Look for a **Buttons** panel. If you find one, set the corner radius as high as it goes (or
   9999px), padding to 14px top and bottom and 28px left and right, and font to Lato Bold (700) at
   16px with no capitals.
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
   | Primary (used by headings) | Ink `#1E282B` |
   | Secondary | Slate `#4B575B` |
   | Text | Ink `#1E282B` |
   | Accent (used by buttons) | Teal `#065E6F` |

3. Under **Design System > Global Fonts**, set:

   | Elementor slot | Font |
   | --- | --- |
   | Primary (headings) | Lato, 700 |
   | Secondary | Lato, 700 |
   | Text | Lato, 400, line height 1.6 |
   | Accent (buttons) | Lato, 700, 16px, no text transform |

   Add one more global font named **Heading 1**: Oswald, 500, line height 1, letter spacing 0.01em,
   uppercase. Pick it on your big headline only.

4. Under **Theme Style**, set **Typography** for body text and H1 to H4 with the sizes from the
   spec (Elementor lets you switch to tablet and mobile sizes with the device icon next to each
   size). Set **Buttons** to Teal `#065E6F` background, White text, Deep teal `#044451` on hover, a
   large border radius for pill ends, and 14px by 28px padding.
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
   the logo about 32px tall. Never go below 180px wide (24px tall): below that the name is hard to
   read, so use the monogram instead.
4. In the block's settings, turn on **Link image to home** if your theme offers it.
5. Click **Save**.

If your header has a Deep teal background, use `masschallenge-logo-horizontal-white.png` there. The
color logo is only for white and light backgrounds.

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

Keep clear space around the logo of at least half its height. Do not add a shadow, recolor it or
put it inside a box. The [brand guidelines](../brand.md) have the full rules.

## Part 3: Build on brand pages

These steps use the block editor, which all block themes and most classic themes use for pages.
Open a page with **Pages > Add New Page** (or edit an existing one).

### A White section

1. Click **+** (the block inserter) and add a **Group** block.
2. In the block settings on the right, open the **Styles** tab (the half filled circle).
3. Under **Color**, leave **Background** empty. It shows the site background, White.
4. Under **Dimensions > Padding**, set top and bottom to 96px.
5. Add your heading, paragraphs and buttons inside the Group.

### A Mist section

Follow the same steps, then set **Color > Background** to **Mist** `#F3F6F7` from the palette. Use
Mist to separate sections that sit next to each other. Do not stack two Mist sections in a row.

### A Deep teal section

1. Add a **Group** block, or a **Cover** block if you want a photo behind the text.
2. Group: set **Color > Background** to **Deep teal** `#044451`, **Text** to **White**, and **Link**
   to **White**. Cover: add your image, then set the **Overlay** color to **Deep teal** and raise the
   overlay opacity until the text is easy to read.
3. Set top and bottom **Padding** to 96px.
4. For accents, such as a small line of text above the headline, use **Bright teal** `#0FACBD`.
   Never put Teal text on Deep teal.
5. If you added the hover snippet from Part 4, open **Advanced** and type `propellant-brand-band` in
   **Additional CSS class(es)**. The snippet then styles the buttons in this section for you.

### The Heading 1 headline

Add a **Heading** block and choose **H1** in its toolbar. It picks up Oswald capitals from Step 4.
Type it in normal sentence case: the capitals come from the style, so the words stay readable to
screen readers and search engines. Use one H1 per page.

### Primary and secondary buttons

1. Add a **Buttons** block. It starts with one button. That is your primary button: Teal with
   White text, as a pill.
2. Click the **+** inside the Buttons block to add a second button.
3. Select the second button, open **Styles** in its settings (or **Change block style** in its
   toolbar) and choose **Outline**. That is your secondary button: Pale teal with Teal text.
4. Write button labels in sentence case with a verb, such as "Apply now" or "Meet the startups".

### Buttons on Deep teal

On a Deep teal section, buttons are White with Deep teal text and turn Pale teal on hover.

- **With the hover snippet** (Part 4) and the `propellant-brand-band` class on the section: just
  add a Buttons block. It turns white on its own.
- **Without code:** select the button and set **Color > Text** to **Deep teal** and **Background**
  to **White**. On WordPress 7.1 or later, choose the **Hover** state at the top of the button's
  settings and set **Background** to **Pale teal** `#D9F6FA`.

### Save sections to reuse

Once a section looks right, select the Group, open the three dots menu in its toolbar and choose
**Create pattern**. Name it, for example "Deep teal section", and leave **Synced** off so each copy
can have its own words. It now appears in the inserter under **Patterns** for everyone.

### Build a sample home page

1. **Hero (Deep teal):** a Deep teal Group with the white horizontal logo or no logo (the header
   already has one), an H1 headline, one Paragraph large sentence and a Buttons block with one
   White button.
2. **About (White):** a White Group with an H2, two short paragraphs and a primary plus a
   secondary button.
3. **Highlights (Mist):** a Mist Group with a **Columns** block of three columns. In each column,
   add an Image (rounded to 12px by Step 8), an H3 and a short paragraph.
4. **Call to action (Deep teal):** reuse your Deep teal pattern with a short H2 and one button.
5. Click **Publish**, then view the page on a computer and a phone.

## Part 4: Custom CSS (only what settings cannot do)

**This part is optional.** Custom CSS is a short piece of code that changes how the site looks.
Use only the snippets you need. Each one starts with a comment line so the next person knows where
it came from.

What the settings cannot do, and these snippets fix:

- **Button hover colors for all buttons at once.** Many WordPress versions only let you set button
  hover one button at a time, or not at all.
- **Buttons on Deep teal without styling each one by hand.**
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

### Snippet: button hover (setups A and B)

Adds the spec hover colors to primary buttons, secondary (Outline) buttons, and buttons in any
section with the `propellant-brand-band` class. It also makes buttons on those sections White with
Deep teal text.

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.wp-block-button__link:hover,
.wp-element-button:hover {
  background-color: #044451;
  color: #ffffff;
}

.is-style-outline .wp-block-button__link:hover {
  background-color: #c4eef4;
  color: #065e6f;
}

.propellant-brand-band .wp-block-button__link {
  background-color: #ffffff;
  color: #044451;
}

.propellant-brand-band .wp-block-button__link:hover {
  background-color: #d9f6fa;
  color: #044451;
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
fonts will not load. Add the button hover snippet above as well.

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Oswald:wght@500&display=swap");

body {
  font-family: "Lato", sans-serif;
  font-size: 17px;
  line-height: 1.6;
  color: #1e282b;
  background-color: #ffffff;
}

h1 {
  font-family: "Oswald", sans-serif;
  font-weight: 500;
  font-size: 64px;
  line-height: 1;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

h2, h3, h4 {
  font-family: "Lato", sans-serif;
  font-weight: 700;
  color: #1e282b;
  letter-spacing: 0;
  text-transform: none;
}

h2 { font-size: 40px; line-height: 1.15; }
h3 { font-size: 30px; line-height: 1.2; }
h4 { font-size: 24px; line-height: 1.25; }

a { color: #065e6f; }

.wp-block-button__link,
.wp-element-button {
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  padding: 14px 28px;
  border: 0;
  border-radius: 9999px;
  box-shadow: none;
  text-transform: none;
  background-color: #065e6f;
  color: #ffffff;
}

.is-style-outline .wp-block-button__link {
  background-color: #d9f6fa;
  color: #065e6f;
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
@import url("https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css");
```

Then type class names into a block's **Advanced > Additional CSS class(es)** box:

| Block | Class | What you get |
| --- | --- | --- |
| H1 Heading | `propellant-headline` | Heading 1 from the spec, in Oswald capitals |
| H2, H3, H4 Heading | `propellant-title-1`, `propellant-title-2`, `propellant-title-3` | Heading 2, 3 and 4 from the spec |
| Paragraph | `propellant-body` | Paragraph from the spec |
| Paragraph (small print) | `propellant-caption` | Paragraph small, in Slate |
| Group | `propellant-brand-band` | A Deep teal section with White text |

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
styles (Mist and Deep teal) that anyone can pick from a Group or Cover block's **Styles** panel:

```php
<?php
const PROPELLANT_STYLESHEET =
	'https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css';

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style( 'propellant-website', PROPELLANT_STYLESHEET, array(), null );
} );

add_action( 'after_setup_theme', function () {
	add_editor_style( PROPELLANT_STYLESHEET );
} );

add_action( 'init', function () {
	register_block_style( array( 'core/group', 'core/cover' ), array(
		'name'       => 'propellant-mist',
		'label'      => 'Mist section',
		'style_data' => array(
			'color' => array( 'background' => '#F3F6F7', 'text' => '#1E282B' ),
		),
	) );
	register_block_style( array( 'core/group', 'core/cover' ), array(
		'name'       => 'propellant-deep-teal',
		'label'      => 'Deep teal section',
		'style_data' => array(
			'color'    => array( 'background' => '#044451', 'text' => '#FFFFFF' ),
			'elements' => array(
				'link'   => array( 'color' => array( 'text' => '#FFFFFF' ) ),
				'button' => array(
					'color'  => array( 'background' => '#FFFFFF', 'text' => '#044451' ),
					':hover' => array( 'color' => array( 'background' => '#D9F6FA' ) ),
				),
			),
		),
	) );
} );
```

`theme.json` adds the spec palette and font families. The fonts load from the Propellant release
(Lato ships there under the name Propellant Sans, which is Lato 2.0). This palette replaces your
parent theme's palette, so White and Ink keep the parent's `base` and `contrast` slugs (the internal
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
        { "slug": "mist", "name": "Mist", "color": "#F3F6F7" },
        { "slug": "contrast", "name": "Ink", "color": "#1E282B" },
        { "slug": "slate", "name": "Slate", "color": "#4B575B" },
        { "slug": "teal", "name": "Teal", "color": "#065E6F" },
        { "slug": "deep-teal", "name": "Deep teal", "color": "#044451" },
        { "slug": "bright-teal", "name": "Bright teal", "color": "#0FACBD" },
        { "slug": "pale-teal", "name": "Pale teal", "color": "#D9F6FA" },
        { "slug": "line", "name": "Line", "color": "#DBE1E3" },
        { "slug": "yellow", "name": "Yellow", "color": "#FFC801" },
        { "slug": "magenta", "name": "Magenta", "color": "#A30253" }
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
              "src": "https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/fonts/propellant-sans-400-latin.woff2"
            },
            {
              "fontFamily": "Lato",
              "fontWeight": "700",
              "fontStyle": "normal",
              "src": "https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/fonts/propellant-sans-700-latin.woff2"
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
              "src": "https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/fonts/oswald-latin-variable.woff2"
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

- [ ] The H1 headline is Oswald, in capitals, about 64px on a computer and 40px on a phone.
- [ ] All other text is Lato. Headings H2 to H4 are bold and in sentence case.
- [ ] Body text is Ink `#1E282B` on White, and paragraphs are no wider than about 720px.
- [ ] Links are Teal `#065E6F`.
- [ ] Primary buttons are Teal pills with White text and turn Deep teal on hover.
- [ ] Secondary buttons are Pale teal pills with Teal text.
- [ ] Deep teal sections have White text and White buttons with Deep teal text, and no Teal text.
- [ ] The logo is the color version on light backgrounds and the white version on Deep teal, at
      least 24px tall, with room around it.
- [ ] The site icon shows the monogram in the browser tab.
- [ ] Images have 12px rounded corners.
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
  Oswald 500) are ticked, then click **Update**.
- **Additional CSS or Fonts is missing from the menu.** On WordPress.com, custom CSS needs a paid
  plan. On self-hosted WordPress, update to the latest version: Additional CSS moved into the
  Styles three dots menu in 6.9, and the Font Library moved to **Appearance > Fonts** in 7.0.
- **The logo looks squashed or blurry.** Use the original PNG from the links above, never a
  screenshot, and size it with the Site Logo block's width setting rather than by dragging.
- **The headline is in capitals in the editor's list view and in search results.** You typed it in
  capitals. Retype it in sentence case and let the H1 style add the capitals.
