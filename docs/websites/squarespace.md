# Squarespace

This guide takes a Squarespace 7.1 site, new or existing, and gives it the MassChallenge look:
Lato text, the Oswald headline in capitals, the teal palette, pill shaped buttons and sections in
White, Mist and Deep teal. Most of it is point and click in Squarespace's own style settings. One
optional step adds a few lines of code for the headline. Plan on about an hour the first time,
and less once you know where things live.

All of the steps are for Squarespace version 7.1, the current version. If your site is on version
7.0, the menus are different and this guide will not match. To check, open the **Pages** panel
and look at the bottom: Squarespace shows your site's version there.

## Before you start

**Your plan.** Most of this guide works on every Squarespace plan. The code steps depend on your
plan:

| What | Where it lives | Plans that allow it |
| --- | --- | --- |
| Custom CSS (small pieces of style code) | Pages panel, **Custom Code**, **Custom CSS** | All plans |
| Code injection (code added to the head of every page) | Pages panel, **Custom Code**, **Code Injection** | Core, Plus, Advanced and some older (legacy) plans |

You only need Custom CSS for this guide, so any plan will do. Code injection is an alternative for
one step, and it is only on Core and above.

**Keep the spec open.** Every value you will type comes from the [website spec](../websites.md).
Keep it open in another tab so you can copy hex codes from it.

**Download the logo files.** Use these files only, never a copy from somewhere else. Open each link
and save the image to your computer:

- Full color horizontal logo, for the header on White:
  https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/assets/logos/masschallenge-logo-horizontal-color.png
- White horizontal logo, for Deep teal backgrounds:
  https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/assets/logos/masschallenge-logo-horizontal-white.png
- Full color monogram (the MC mark on its own), for the browser icon:
  https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/assets/logos/masschallenge-logo-monogram-color.png
- There are also `-white` and `-black` versions of the monogram, and a `-black` horizontal logo,
  at the same address with the color word changed. The [brand guidelines](../brand.md) say when to
  use each one.

**One habit that saves trouble.** In Squarespace, style settings apply to the whole site. If you
change a font size or color with the text toolbar inside a single block, that block stops
following the site settings. Set things once in Site styles and leave the toolbar for choosing a
format such as Heading 2.

## Part 1: Set up site styles (no code)

This is the main part of the guide. You will set fonts, colors and buttons once, and every page
picks them up.

### Open Site styles

1. Open the **Pages** panel and click any page.
2. Click the **paintbrush** icon in the top right corner. The **Site styles** panel opens.
3. You will see sections such as **Fonts**, **Colors**, **Buttons** and **Spacing**. Click the
   **>** arrow next to a section to open its settings.

Two warnings before you start:

- Site styles has a **Themes** option, and Fonts and Buttons each offer ready made **packs**.
  Picking a theme or a pack replaces your fonts, colors or buttons in one go. Once you have set
  things up, do not click a different theme or pack. If you do by accident, use the **undo** arrow
  at the top of the panel.
- Click **Save** at the top of the editor when you finish each section, so nothing is lost.

### Step 1: Fonts

How Squarespace fonts work, in plain words: text comes in four groups, **Headings**,
**Paragraphs**, **Buttons** and **Miscellaneous** (small extras such as dates and captions). Each
group has one font for the whole group. Inside Headings there are four sizes, Heading 1 to Heading
4. Inside Paragraphs there are three sizes, Paragraph 1 (large), Paragraph 2 (normal) and
Paragraph 3 (small). Sizes are set in **rem**, which means "times the base size". With a base size
of 16, 2rem is 32 pixels.

That one font per group is the only real limit. All four heading sizes share one font and one
capitals setting, so Squarespace cannot set Heading 1 in Oswald capitals and Headings 2 to 4 in
Lato on its own. You will set every heading to Lato here, and Part 4 adds a few lines of code that
turn Heading 1 into the Oswald headline. If you skip Part 4, Heading 1 stays a large, bold Lato
heading, which still looks tidy and on brand.

**Choose a starting font pack**

1. In Site styles, click **Fonts**.
2. If you want, click **>** next to Fonts, then **All Font Packs**, then **Sans-serif**, and pick
   any pack. It does not matter which: you are about to change every font in it. If your site
   already has a pack, skip this.

**Set the base size**

1. Click **>** next to **Fonts**.
2. Use the **+** and **-** buttons to set the **Base size** to **16**. Every size below assumes a
   base of 16.

**Headings**

Click **Headings** and set:

| Setting | Value |
| --- | --- |
| Font | **Lato** (type "Lato" in the font search) |
| Style or weight | **700** (Bold) |
| Line height | **1.2em** (see the note below) |
| Letter spacing | **0em** |
| Text transform | **None** |

Then set each size:

| Squarespace size | Spec style | Desktop size in the spec | Enter |
| --- | --- | --- | --- |
| Heading 1 | Heading 1 (the big headline) | 64px | **4rem** |
| Heading 2 | Heading 2 | 40px | **2.5rem** |
| Heading 3 | Heading 3 | 30px | **1.875rem** |
| Heading 4 | Heading 4 | 24px | **1.5rem** |

A note on line height: the spec gives each heading its own line height (1.0, 1.15, 1.2 and 1.25).
If your panel shows a line height for each heading size, enter those values in em (1.0em, 1.15em,
1.2em, 1.25em). If it shows one line height for all headings, use 1.2em, which sits in the middle
and looks right for Headings 2 to 4. Part 4 sets Heading 1 to 1.0.

If a slider will not land on an exact value, click the number and type it.

**Paragraphs**

Click **Paragraphs** and set:

| Setting | Value |
| --- | --- |
| Font | **Lato** |
| Style or weight | **400** (Regular) |
| Line height | **1.6em** (see the note below) |
| Letter spacing | **0em** |
| Text transform | **None** |

Then set each size:

| Squarespace size | Spec style | Desktop size in the spec | Enter |
| --- | --- | --- | --- |
| Paragraph 1 | Paragraph large | 20px | **1.25rem** |
| Paragraph 2 | Paragraph | 17px | **1.0625rem** |
| Paragraph 3 | Paragraph small | 14px | **0.875rem** |

If your panel offers a line height for each paragraph size, use 1.5em for Paragraph 1, 1.6em for
Paragraph 2 and 1.5em for Paragraph 3. If there is one value for all, use 1.6em.

**Buttons**

Click **Buttons** (inside Fonts) and set:

| Setting | Value |
| --- | --- |
| Font | **Lato** |
| Style or weight | **700** (Bold) |
| Size | **1rem** (16px) |
| Letter spacing | **0em** |
| Text transform | **None** |

Buttons are in sentence case, never capitals, so make sure Text transform is **None**. If your
panel shows separate font settings for Primary, Secondary and Tertiary buttons, set all three the
same way.

**Miscellaneous**

Click **Miscellaneous** and set the font to **Lato**, weight **400**, letter spacing **0em** and
text transform **None**. This covers small text such as dates, so it should match your paragraphs.

**If Lato is not in the list**

Squarespace's library holds hundreds of Google Fonts but not every one. Lato should be there; if
your search finds nothing, you can upload it:

1. Download Lato from Google Fonts (fonts.google.com, search "Lato"). You need the Regular (400)
   and Bold (700) files.
2. In Site styles, click **>** next to Fonts, then click **Headings** (or Paragraphs).
3. Click the font dropdown, then click the **upload** icon.
4. Drag in one font file, or click **+** and choose it. Upload each weight as its own file.
   Squarespace accepts .otf, .ttf, .woff and .woff2 files.
5. Your fonts appear under **Uploaded** in every font dropdown. Choose Lato there.

You do not need to do this for Oswald. Part 4 loads Oswald for you.

### Step 2: Colors

How Squarespace colors work, in plain words: there are two layers.

1. **The palette.** Every site has a palette of exactly five colors. They are the starting point
   for everything else.
2. **Color themes.** Squarespace builds ten color themes from the palette. A color theme is a full
   set of colors for one section: its background, headings, paragraphs, links and buttons. You
   give each section of a page one theme. The ten themes are named from lightest to darkest:
   **Lightest 1**, **Lightest 2**, **Light 1**, **Light 2**, **Bright 1**, **Bright 2**,
   **Dark 1**, **Dark 2**, **Darkest 1** and **Darkest 2**.

Inside a theme you can pick any color for any part, either one of the five palette colors or a
**Custom** color you type in. That is how you get colors such as Pale teal, which do not fit in a
five color palette.

We use three themes, one for each kind of section in the spec:

| Section in the spec | Squarespace theme |
| --- | --- |
| White (the normal page background) | **Lightest 1** |
| Mist (the alternate section background) | **Light 1** |
| Deep teal (the dark brand section) | **Darkest 1** |

**Edit the palette**

1. In Site styles, click **>** next to **Colors**.
2. Click **Edit palette**.
3. Click each of the five colors in turn and type its hex code into the value field, so the palette
   matches this table from lightest to darkest:

| Palette position | Spec color | Hex |
| --- | --- | --- |
| 1 (lightest) | White | `#FFFFFF` |
| 2 | Mist | `#F3F6F7` |
| 3 | Teal | `#065E6F` |
| 4 | Deep teal | `#044451` |
| 5 (darkest) | Ink | `#1E282B` |

4. Click **Save**.

Changing the palette can change your color themes too, so always edit the palette first and the
themes second. If you edit the palette again later, check your three themes afterwards.

**Edit the three color themes**

For each of the three themes below:

1. In the Colors panel, click the theme (for example **Lightest 1**).
2. Click a part, such as **Background**. Pick from the **Palette** tab, or click **Custom** and type
   the hex code.
3. Work through every part in the table.
4. Click **Save**.

The exact names of the parts can differ slightly from site to site. Squarespace calls the four
heading sizes Heading (Extra Large), Heading (Large), Heading (Medium) and Heading (Small): they
are Heading 1 to Heading 4. Paragraphs are Paragraph (Large), Paragraph (Medium) and Paragraph
(Small). If you see a part that is not in this table, such as a block's own colors, match it to the
closest row.

| Part | Lightest 1 (White) | Light 1 (Mist) | Darkest 1 (Deep teal) |
| --- | --- | --- | --- |
| Background | White `#FFFFFF` | Mist `#F3F6F7` | Deep teal `#044451` |
| All four headings | Ink `#1E282B` | Ink `#1E282B` | White `#FFFFFF` |
| Paragraph (Large) and (Medium) | Ink `#1E282B` | Ink `#1E282B` | White `#FFFFFF` |
| Paragraph (Small) | Slate `#4B575B` | Slate `#4B575B` | White `#FFFFFF` |
| Links (paragraph and heading links) | Teal `#065E6F` | Teal `#065E6F` | White `#FFFFFF` |
| Primary button background | Teal `#065E6F` | Teal `#065E6F` | White `#FFFFFF` |
| Primary button text | White `#FFFFFF` | White `#FFFFFF` | Deep teal `#044451` |
| Secondary button background | Pale teal `#D9F6FA` | Pale teal `#D9F6FA` | White `#FFFFFF` |
| Secondary button text | Teal `#065E6F` | Teal `#065E6F` | Deep teal `#044451` |
| Tertiary button background | Pale teal `#D9F6FA` | Pale teal `#D9F6FA` | White `#FFFFFF` |
| Tertiary button text | Teal `#065E6F` | Teal `#065E6F` | Deep teal `#044451` |
| Lines and dividers | Line `#DBE1E3` | Line `#DBE1E3` | Bright teal `#0FACBD` |
| Site title and navigation links (if listed) | Ink `#1E282B` | Ink `#1E282B` | White `#FFFFFF` |

Why the buttons look like this: on Deep teal the spec allows only White buttons with Deep teal
text, so every button type in that theme is set the same way. Squarespace only uses Tertiary
buttons in a few places, such as the cookie banner, so we make them match Secondary.

Never put Teal text on Deep teal. If you see Teal anywhere in the Darkest 1 column on your screen,
change it to White.

You can leave the other seven themes alone. Just use only these three for your sections. Yellow and
Magenta from the spec are not set here: Yellow is for occasional highlights (always with Ink text)
and Magenta is for errors.

### Step 3: Buttons

How Squarespace buttons work, in plain words: there are three button types, **Primary**,
**Secondary** and **Tertiary**. Each has its own shape, outline and padding (the space between the
text and the edge of the button). Colors do not live here: they come from the color theme of the
section, which you set in Step 2.

Most buttons on a Squarespace site are Primary. Button blocks, header buttons and form submit
buttons can be switched to Secondary or Tertiary.

1. In Site styles, click **>** next to **Buttons**.
2. Click **Primary** and set:

| Setting | Value |
| --- | --- |
| Fill | **Fill** (a solid background, sometimes called Solid). Not No Fill. |
| Shape | **Pill** (fully rounded ends) |
| Outline | Slide to **0** (no border) |
| Padding | Click **...** and set **Top & Bottom** to **14px** and **Left & Right** to **28px** |

3. Click **Font** if you did not set button fonts in Step 1: Lato, 700, 1rem, letter spacing 0em,
   text transform None.
4. Click **Apply to all Button Types**, so Secondary and Tertiary get the same shape and padding.
5. Click **Save**.

If the padding field does not accept pixels, choose **M** and compare the button with the spec:
it should be a little under three times as wide as it is tall for a short label such as "Apply".

If you see shadow or raised options, turn them off. The spec has no borders and no shadows.

Hover color: Squarespace has no setting for the color a button turns when you point at it. It
fades the button slightly instead. The spec asks for a set hover color (Deep teal for primary).
Part 4 has a small snippet for that. It is optional: a faded hover still works.

### Step 4: Spacing

The spec asks for about 96px of space above and below each section on desktop and 64px on phones,
and for paragraphs about 720px wide.

1. In Site styles, click **Spacing**. You can leave **Site Margin** (the space between your content
   and the edge of the screen) at its default.
2. Section spacing is set on each section, not here. See "Section spacing" in Part 3.

### Step 5: Mobile

Squarespace 7.1 always rearranges and resizes your site for phones, and you cannot turn that off.
There is no separate set of mobile font sizes in Site styles: headings shrink on their own as the
screen gets narrower. The spec's mobile sizes (for example 40px for Heading 1) are close to what
Squarespace does by itself. If your Heading 1 is too big or too small on a phone, Part 4 has a
snippet that sets it to exactly 40px.

To see your phone layout, switch the editor to its mobile view (the phone icon at the top of the
page editor). In Fluid Engine sections (Squarespace's drag and drop grid), you can move and resize
blocks for mobile separately from desktop. Always check every page there before you publish.

## Part 2: Add the logo and site icon

### The logo

1. Click **Edit** in the top left corner of the page.
2. Hover over the header (the strip at the top with your site name) and click **Edit Site Header**.
3. Click the site title or logo, then click the **pencil** icon.
4. In **Logo Image**, click **+**, then **Upload File**, and choose
   `masschallenge-logo-horizontal-color.png`.
5. Use the slider to set the logo height. Keep it at **24px or taller**, because below 24px the
   wordmark stops being readable. A height around 32px works well in most headers.
6. In **Mobile Logo Image**, upload the same file and use **Mobile Logo Max Height** to keep it at
   least 24px tall.
7. Click **Save**.

Keep the header on a White background so the full color logo fits. In **Edit Site Header**, click
**Colors** and choose **Lightest 1**. If you ever give the header a Deep teal background, upload
`masschallenge-logo-horizontal-white.png` instead: never put the full color logo on Deep teal.

Logo rules from the [brand guidelines](../brand.md):

- Keep clear space around the logo equal to half its height. A 32px logo needs 16px of space on
  every side.
- Do not stretch, crop, recolor or add effects to it.
- Do not use Squarespace's image editor on the logo. It saves images as .jpg, which turns the
  transparent background white. Upload the .png file as it is.

### The site icon (favicon)

The site icon, or favicon, is the small picture in the browser tab. Use the monogram.

1. Open **Settings**, then **Website**, then **Favicon**. (The help center links straight to this
   panel; on some accounts it is called **Browser icon**.)
2. Drag `masschallenge-logo-monogram-color.png` into the uploader, or click it and choose the file.
3. Optional: add a dark mode version with `masschallenge-logo-monogram-white.png`. You must add the
   normal icon first.
4. Click **Save**.

Squarespace's limits: the file must be .png (recommended), under 100 KB, and works best between
100 and 300 pixels. The monogram file is 321 by 177 pixels and about 6 KB, so it uploads fine.
Because it is wider than it is tall, it shows small in the tab. If it looks squashed, place it in
the middle of a transparent square image (321 by 321 pixels) in any image editor and upload that.

Browsers hold on to old icons. If you still see the old one, clear your browser's cache or open the
site in a private window.

## Part 3: Build on brand pages

### Give each section its color

Every page is made of sections. Give each one a theme:

1. Open the **Pages** panel, click the page, and click **Edit**.
2. Hover over a section and click **Edit Section**.
3. Click **Colors** and choose:
   - **Lightest 1** for a White section,
   - **Light 1** for a Mist section,
   - **Darkest 1** for a Deep teal section.
4. Click **Save**.

Alternate White and Mist to separate sections, and use Deep teal sparingly for the moments that
matter, such as a call to apply.

A theme changes every color in the section, including any color you picked with the text toolbar.
Remember too that editing a theme changes every section on the site that uses it. That is what you
want: change Darkest 1 once and every Deep teal section follows.

### Section spacing

1. In **Edit Section**, click **Design** (it may be called **Format**).
2. Leave **Fill Screen** off unless you want a full height section.
3. In a Fluid Engine section, leave about one empty grid row above and below your content, and
   adjust **Row Count** until the space looks like about 96px on desktop. In a classic section, use
   **Section Height** and pick a small or medium height.
4. Keep text blocks to about 720px wide (roughly 68 characters a line). On a normal width page,
   that is a little over half the width of the grid. Long full width paragraphs are hard to read.
5. Check the mobile view: aim for about 64px of space above and below.

Squarespace does not let you type an exact pixel value for section spacing, so judge it by eye.

### Add the headline and text

1. Add a **Text** block.
2. Type your headline, select it, and choose **Heading 1** from the format menu in the text
   toolbar. Type it in normal sentence case: the capitals come from the Oswald style in Part 4, not
   from your keyboard.
3. Use **Heading 1** once per page, for the big headline only. Use **Heading 2** for section
   titles, **Heading 3** and **Heading 4** below that.
4. Use **Paragraph 2** for normal text, **Paragraph 1** for a short introduction under the
   headline, and **Paragraph 3** for small print such as dates.
5. Do not change fonts, sizes or colors with the toolbar. Let Site styles do it.

### Add buttons

1. Add a **Button** block.
2. In the **Content** tab, type the label. Use sentence case and a verb, such as "Apply now" or
   "Meet the startups".
3. In the **Design** tab, open the **Primary Button** dropdown:
   - Keep **Primary Button** for the main action (Teal).
   - Choose **Secondary Button** for a second, quieter action (Pale teal).
4. Under **Size**, choose **M**, the size that matches the padding you set in Part 1.
5. In a Fluid Engine section, set the button to **Fit** rather than **Fill**, so it keeps its pill
   shape and padding.

On a Deep teal section, buttons turn White with Deep teal text on their own, because of the
Darkest 1 theme. Use one primary button there.

### Sample home page

A simple page you can build in about fifteen minutes. Replace the bracketed text with your own.

1. **Hero, White (Lightest 1).** A Text block with your headline as Heading 1, then one or two
   sentences as Paragraph 1. Below it, a primary Button block ("[Main action]") and a secondary
   Button block ("[Second action]") side by side.
2. **What we do, Mist (Light 1).** A Heading 2 title. Under it, three short columns, each a Heading
   4 and a Paragraph 2. Add an image block above each column if you have photos.
3. **Proof, White (Lightest 1).** A Heading 2 and a short Paragraph 2, then a line of logos or a
   quote.
4. **Call to action, Deep teal (Darkest 1).** A Heading 2 and one sentence in Paragraph 1, with one
   primary Button block. It shows as a White button with Deep teal text.
5. **Footer.** Edit the footer section and give it **Lightest 1** or **Light 1**. If you add a logo
   to a Deep teal footer, use the white logo file.

## Part 4: Custom CSS (only what settings cannot do)

This part is optional. Your site is already on brand after Parts 1 to 3. Custom CSS is a few lines
of style code that you paste into one box; it adds three things that Squarespace settings cannot
do:

| Snippet | What it fixes | Why settings cannot do it |
| --- | --- | --- |
| A: the headline | Heading 1 in Oswald, medium weight, capitals, line height 1.0, letter spacing 1% | All heading sizes share one font and one capitals setting |
| B: button hovers | Primary hover turns Deep teal, secondary hover turns `#C4EEF4`, White buttons on Deep teal turn Pale teal | There is no hover color setting |
| C: exact headline sizes (optional) | Heading 1 at exactly 64px on desktop and 40px on phones | Squarespace scales headings with the screen, so sizes are close but not exact |

### Where to paste it

1. Open the **Pages** panel.
2. At the bottom, click **Custom Code**, then **Custom CSS**. (On some sites this is under
   **Design**, then **Custom CSS**, or **Website Tools**, then **Custom CSS**.)
3. Paste the snippets into the box. If the box already has code, paste snippet A at the very top,
   above everything else, and the others at the end.
4. Click **Save**.

The Custom CSS panel is available on every plan.

### Snippet A: the Oswald headline

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap");

.sqs-block-html h1 {
  font-family: "Oswald", sans-serif;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}
```

What it does, line by line: the `@import` line loads Oswald from Google Fonts, the same place
Squarespace gets its fonts. The rest styles Heading 1, but only inside Text blocks (that is what
`.sqs-block-html` means). We target Text blocks on purpose: some built in pages, such as blog
posts and product pages, also use Heading 1 for their titles, and this keeps them in Lato.

The `@import` line must be the first rule in the box (the comment line above it is fine). If it is
lower down, browsers ignore it and the headline stays in Lato.

### Snippet B: button hover colors

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.sqs-button-element--primary:hover {
  background-color: #044451 !important;
  opacity: 1 !important;
}

.sqs-button-element--secondary:hover {
  background-color: #c4eef4 !important;
  opacity: 1 !important;
}

[data-section-theme="black"] .sqs-button-element--primary:hover,
[data-section-theme="black"] .sqs-button-element--secondary:hover {
  background-color: #d9f6fa !important;
  color: #044451 !important;
}
```

`.sqs-button-element--primary` and `--secondary` are the names Squarespace gives primary and
secondary buttons. `!important` makes sure our hover wins over Squarespace's fade.
`[data-section-theme="black"]` is the name Squarespace uses behind the scenes for the **Darkest 1**
theme, so the last rule only touches buttons on Deep teal sections. If you chose a different theme
for Deep teal, this last rule will not apply; switch those sections to Darkest 1.

### Snippet C: exact headline sizes (optional)

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.sqs-block-html h1 {
  font-size: 64px;
}

@media (max-width: 767px) {
  .sqs-block-html h1 {
    font-size: 40px;
  }
}
```

The second part applies only on screens 767px wide or narrower, which is where Squarespace switches
to its phone layout.

### Alternative: load the Propellant stylesheet (Core plan and above)

If your plan includes code injection, you can load the Propellant stylesheet instead of using
`@import`. It loads the exact Oswald and Lato files we use, and adds ready made classes.

1. Open the **Pages** panel, click **Custom Code**, then **Code Injection**.
2. In the **Header** box, paste:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/dist/website.css"
/>
```

3. Click **Save**.

The stylesheet only styles elements that carry one of its class names, so it never changes the
rest of your site. Squarespace's own blocks do not let you add class names, so you use the classes
inside a **Code** block, where you write a little HTML. For example:

```html
<h1 class="propellant-headline">Your headline here</h1>
<a class="propellant-button" href="/apply">Apply now</a>
<a class="propellant-button propellant-button-secondary" href="/about">Learn more</a>
```

`propellant-headline` is Heading 1 from the spec, `propellant-title-1`, `propellant-title-2` and
`propellant-title-3` are Headings 2 to 4, `propellant-body` is Paragraph and `propellant-caption`
is Paragraph small. A `<div class="propellant-brand-band">` wrapped around your HTML gives a Deep
teal band with White text and White buttons. The full list is in the
[website spec](../websites.md#the-propellant-stylesheet). For most sites, snippets A and B are
simpler: they work with normal Text and Button blocks, so anyone can edit the page later.

### Removing the code later

Open **Custom Code**, then **Custom CSS** (or **Code Injection**), select the lines from the
`/* Propellant website styles` comment down to the end of that snippet, delete them and click
**Save**. Your site goes back to the plain Site styles from Part 1. Keep the comment line on
anything you leave in place, so the next person knows where it came from.

## Check your work

On a computer:

- [ ] Normal text and Headings 2 to 4 are in Lato. Heading 2 to 4 are bold.
- [ ] Heading 1 is in tall Oswald capitals (if you added snippet A), and it is the only text in
      capitals.
- [ ] Buttons are pills in sentence case: primary Teal with White text, secondary Pale teal with
      Teal text.
- [ ] Hovering a primary button turns it Deep teal (if you added snippet B).
- [ ] White, Mist and Deep teal sections each use Lightest 1, Light 1 and Darkest 1.
- [ ] Nothing on a Deep teal section is Teal. Text and buttons there are White.
- [ ] The full color logo sits on a White header, at least 24px tall, with room around it.
- [ ] The monogram shows in the browser tab.

On a phone (use the mobile view in the editor, then check the published site on a real phone):

- [ ] Heading 1 is about 40px and fits without breaking words awkwardly.
- [ ] The mobile logo is at least 24px tall.
- [ ] Buttons stay pill shaped and easy to tap.
- [ ] Sections have clear space above and below, about 64px.

Code can behave differently in the editor than on the live site. Open your published site in a
private window to see it the way visitors do.

## If something looks off

- **Heading 1 is still in Lato.** Check the text is set to Heading 1 in the format menu, not just
  made bigger. Check the `@import` line is the first rule in the Custom CSS box and that you clicked
  Save. Then reload the page.
- **One block ignores the site colors or fonts.** Someone styled it with the text toolbar. Select
  the text and clear the formatting, or pick the format again from the format menu, so it follows
  Site styles.
- **A whole section changed color after you edited the palette.** Palette changes flow into the
  color themes. Open Lightest 1, Light 1 and Darkest 1 again and re-enter the values from the table
  in Step 2.
- **Your fonts or buttons suddenly changed.** A theme or pack was clicked in Site styles. Use the
  undo arrow at the top of the panel, or set Step 1 or Step 3 again.
- **A button is square or stretched.** In a Fluid Engine section, set the Button block to **Fit**,
  not **Fill**. If all buttons are square, check **Shape** is **Pill** in Site styles, **Buttons**,
  for each button type.
- **The old browser icon still shows.** Browsers keep icons for a long time. Clear the cache or
  open the site in a private window.
