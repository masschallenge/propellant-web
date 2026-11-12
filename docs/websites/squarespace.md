# Squarespace

This guide takes a Squarespace 7.1 site, new or existing, and gives it the MassChallenge look:
Lato text, Oswald headlines in capitals, the brand palette, pill shaped Oswald buttons, and dark
Navy and Deep Teal sections alternating with White and Warm White ones. Most of it is point and
click in Squarespace's own style settings. One optional step adds a few lines of code for the
eyebrow and the button hovers. Plan on about an hour the first time, and less once you know where
things live.

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
  https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-color.png
- White horizontal logo, for Navy, Black and Deep Teal backgrounds:
  https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-white.png
- Full color monogram (the MC mark on its own), for the browser icon:
  https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-monogram-color.png
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

That one font per group suits the spec: every heading is Oswald SemiBold in capitals, and every
paragraph is Lato. The one style Squarespace cannot set on its own is the eyebrow, the small
tracked label above a headline, because it needs a lighter weight and wide letter spacing. Part 4
adds a few lines of code that turn Heading 4 into the eyebrow. If you skip Part 4, use Heading 4 as
a small subhead instead.

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
| Font | **Oswald** (type "Oswald" in the font search) |
| Style or weight | **600** (SemiBold) |
| Line height | **1.0em** (see the note below) |
| Letter spacing | **0em** |
| Text transform | **Uppercase** |

Then set each size:

| Squarespace size | Spec style | Desktop size in the spec | Enter |
| --- | --- | --- | --- |
| Heading 1 | Heading 1 (the headline) | 64px | **4rem** |
| Heading 2 | Heading 2 | 40px | **2.5rem** |
| Heading 3 | Heading 3 (subhead) | 30px | **1.875rem** |
| Heading 4 | Eyebrow (with Part 4), or Heading 4 | 14px, or 24px without Part 4 | **0.875rem**, or **1.5rem** without Part 4 |

A note on line height: the spec gives the headlines a line height of 1.0 and the subheads 1.1. If
your panel shows a line height for each heading size, enter 1.0em for Headings 1 and 2 and 1.1em
for Headings 3 and 4. If it shows one line height for all headings, use 1.0em.

If you type a heading in normal sentence case, the capitals come from the Uppercase setting. Keep
typing it that way, so screen readers and search engines read it correctly.

If a slider will not land on an exact value, click the number and type it.

**Paragraphs**

Click **Paragraphs** and set:

| Setting | Value |
| --- | --- |
| Font | **Lato** |
| Style or weight | **400** (Regular) |
| Line height | **1.5em** |
| Letter spacing | **0em** |
| Text transform | **None** |

Then set each size:

| Squarespace size | Spec style | Desktop size in the spec | Enter |
| --- | --- | --- | --- |
| Paragraph 1 | Paragraph large | 20px | **1.25rem** |
| Paragraph 2 | Paragraph | 17px | **1.0625rem** |
| Paragraph 3 | Paragraph small | 14px | **0.875rem** |

Every paragraph size uses a line height of 1.5em.

**Buttons**

Click **Buttons** (inside Fonts) and set:

| Setting | Value |
| --- | --- |
| Font | **Oswald** |
| Style or weight | **600** (SemiBold) |
| Size | **1rem** (16px) |
| Letter spacing | **0.05em** |
| Text transform | **Uppercase** |

Buttons are in Oswald capitals. Type the label in sentence case; the capitals come from the
Uppercase setting. If your panel shows separate font settings for Primary, Secondary and Tertiary
buttons, set all three the same way.

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

Oswald is in the library too. If your search does not find it, upload it the same way, with the
Regular (400), SemiBold (600) and Bold (700) files.

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
**Custom** color you type in. That is how you get colors such as Deep Teal and Cyan, which do not
fit in a five color palette.

We use five themes, one for each kind of section in the spec:

| Section in the spec | Squarespace theme |
| --- | --- |
| White (the normal page background) | **Lightest 1** |
| Warm White (the alternate light section) | **Light 1** |
| Navy (the main dark section) | **Darkest 1** |
| Black (a dark section) | **Darkest 2** |
| Deep Teal (a dark section) | **Dark 1** |

**Edit the palette**

1. In Site styles, click **>** next to **Colors**.
2. Click **Edit palette**.
3. Click each of the five colors in turn and type its hex code into the value field, so the palette
   matches this table from lightest to darkest:

| Palette position | Spec color | Hex |
| --- | --- | --- |
| 1 (lightest) | White | `#FFFFFF` |
| 2 | Warm White | `#F8F8F5` |
| 3 | Teal | `#00708E` |
| 4 | Navy | `#10263F` |
| 5 (darkest) | Black | `#222222` |

4. Click **Save**.

Changing the palette can change your color themes too, so always edit the palette first and the
themes second. If you edit the palette again later, check your five themes afterwards.

**Edit the five color themes**

For each of the five themes below:

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

Start with the two light themes:

| Part | Lightest 1 (White) | Light 1 (Warm White) |
| --- | --- | --- |
| Background | White `#FFFFFF` | Warm White `#F8F8F5` |
| Heading (Extra Large) | Black `#222222` | Black `#222222` |
| Heading (Large), (Medium) and (Small) | Teal `#00708E` | Teal `#00708E` |
| Paragraph (Large) and (Medium) | Black `#222222` | Black `#222222` |
| Paragraph (Small) | Slate `#4B575B` | Slate `#4B575B` |
| Links (paragraph and heading links) | Teal `#00708E` | Teal `#00708E` |
| Primary button background | Teal `#00708E` | Teal `#00708E` |
| Primary button text | White `#FFFFFF` | White `#FFFFFF` |
| Secondary button background | White `#FFFFFF` | Warm White `#F8F8F5` |
| Secondary button text | Teal `#00708E` | Teal `#00708E` |
| Tertiary button background | White `#FFFFFF` | Warm White `#F8F8F5` |
| Tertiary button text | Teal `#00708E` | Teal `#00708E` |
| Lines and dividers | Line `#DBE1E3` | Line `#DBE1E3` |
| Site title and navigation links (if listed) | Black `#222222` | Black `#222222` |

Then the three dark themes. They differ only in their background:

| Part | Darkest 1 (Navy) | Darkest 2 (Black) | Dark 1 (Deep Teal) |
| --- | --- | --- | --- |
| Background | Navy `#10263F` | Black `#222222` | Deep Teal `#004F73` |
| All four headings | White `#FFFFFF` | White `#FFFFFF` | White `#FFFFFF` |
| All paragraphs | White `#FFFFFF` | White `#FFFFFF` | White `#FFFFFF` |
| Links (paragraph and heading links) | Cyan `#54EEFF` | Cyan `#54EEFF` | Cyan `#54EEFF` |
| Primary, Secondary and Tertiary button background | Teal `#00708E` | Teal `#00708E` | Teal `#00708E` |
| Primary, Secondary and Tertiary button text | White `#FFFFFF` | White `#FFFFFF` | White `#FFFFFF` |
| Lines and dividers | Cyan `#54EEFF` | Cyan `#54EEFF` | Cyan `#54EEFF` |
| Site title and navigation links (if listed) | White `#FFFFFF` | White `#FFFFFF` | White `#FFFFFF` |

Why the buttons look like this: on light sections the primary button is a solid Teal pill and the
secondary is Teal text on the section's own color. On dark sections the spec asks for a Cyan
outline that fills with Teal on hover. Squarespace has no outline color setting, so the dark themes
show the Teal fill, which is the hover look and is always readable. Snippet B in Part 4 adds the
outlines and the hover behaviors. Squarespace only uses Tertiary buttons in a few places, such as
the cookie banner, so we make them match Secondary.

Never put Teal text on Navy, Black or Deep Teal: it is too dark to read. If you see Teal text in a
dark theme on your screen, change it to White, or to Cyan for links. Cyan is only ever used on the
dark themes.

You can leave the other five themes alone. Just use only these five for your sections. MC Blue is
not set here: it is for the logo and graphic shapes, never text. The warm accents (Yellow, Orange,
Raspberry and Lime) are not set here either: use one per page, in small doses, such as a tag or a
stat in an image.

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
| Outline | Slide to **0** (snippet B draws the outline) |
| Padding | Click **...** and set **Top & Bottom** to **14px** and **Left & Right** to **28px** |

3. Click **Font** if you did not set button fonts in Step 1: Oswald, 600, 1rem, letter spacing
   0.05em, text transform Uppercase.
4. Click **Apply to all Button Types**, so Secondary and Tertiary get the same shape and padding.
5. Click **Save**.

If the padding field does not accept pixels, choose **M** and compare the button with the spec:
it should be a little under three times as wide as it is tall for a short label such as "Apply".

If you see shadow or raised options, turn them off. The spec has no shadows. Never choose a square
or rounded rectangle shape: square cornered buttons are retired.

Hover: Squarespace has no setting for what a button does when you point at it. It fades the button
slightly instead. The spec asks for more: on light sections the primary button's fill clears to a
Teal outline, and on dark sections a Cyan outline fills with Teal. Part 4 has a small snippet for
that. It is optional: a faded hover still works.

### Step 4: Spacing

The spec asks for generous space: about 96px above and below each section on desktop and 64px on
phones, and paragraphs about 720px wide. When in doubt, add space.

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
5. Use the slider to set the logo height. Keep it at **24px or taller**, so the logo stays at
   least 160px wide and the wordmark stays readable. A height around 32px works well in most
   headers.
6. In **Mobile Logo Image**, upload the same file and use **Mobile Logo Max Height** to keep it at
   least 24px tall.
7. Click **Save**.

Keep the header on a White or Warm White background so the full color logo fits. In **Edit Site
Header**, click **Colors** and choose **Lightest 1** or **Light 1**. If you give the header a Navy,
Black or Deep Teal background, upload `masschallenge-logo-horizontal-white.png` instead: never put
the full color logo on a dark color.

Logo rules from the [brand guidelines](../brand.md):

- Keep clear space around the logo equal to the height of the "M" in the MASSCHALLENGE wordmark,
  on every side. Nothing, not even the edge of the header, goes inside it.
- Align the logo to a corner or the top edge of its area.
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
   - **Light 1** for a Warm White section,
   - **Darkest 1** for a Navy section,
   - **Darkest 2** for a Black section,
   - **Dark 1** for a Deep Teal section.
4. Click **Save**.

Alternate dark and light sections down the page: the brand's rhythm is a dark section, then a light
one, then a dark one. Navy is the main dark section; use Black and Deep Teal for variety.

A theme changes every color in the section, including any color you picked with the text toolbar.
Remember too that editing a theme changes every section on the site that uses it. That is what you
want: change Darkest 1 once and every Navy section follows.

The notch (the small triangle that points down from one section into the next) and the angled tint
on light sections need code that Squarespace sections cannot take. On a Core plan or above you can
build them inside a Code block with the Propellant stylesheet, as shown at the end of Part 4.
Without them, the alternating colors still carry the rhythm.

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
2. If you added snippet A, start with the eyebrow: type a few words and choose **Heading 4** from
   the format menu in the text toolbar.
3. Type your headline, select it, and choose **Heading 1**. Type it in normal sentence case: the
   capitals come from Site styles, not from your keyboard.
4. For a two toned headline, select the payoff words and click the link color or the text color in
   the toolbar, then choose Teal on light sections or Cyan on dark ones. This is the one place to
   use the toolbar color.
5. Use **Heading 1** once per page, for the headline. Use **Heading 2** for section headlines and
   **Heading 3** for subheads, such as card titles and the titles of numbered blocks.
6. Use **Paragraph 2** for normal text, **Paragraph 1** for a short introduction under the
   headline, and **Paragraph 3** for small print such as dates. Never set paragraphs in capitals.
7. Do not change fonts or sizes with the toolbar. Let Site styles do it.

**Numbered blocks.** For steps or a short list of points, add a **Line** block, then a Text block
with the number (such as 01) as Heading 2, the title as Heading 3 and the text as Paragraph 2. The
number takes the Teal heading color on light sections.

**Photos.** Leave image corners square. In an **Image** block, keep the **Design** option with no
rounded corners. Pick photos by the [images guide](../images.md#brand-photography).

### Add buttons

1. Add a **Button** block.
2. In the **Content** tab, type the label. Type it in sentence case with a verb, such as "Apply
   now" or "Meet the startups": the capitals come from Site styles.
3. In the **Design** tab, open the **Primary Button** dropdown:
   - Keep **Primary Button** for the main action (a solid Teal pill on light sections).
   - Choose **Secondary Button** for a second, quieter action (Teal text, with a Teal outline if
     you added snippet B).
4. Under **Size**, choose **M**, the size that matches the padding you set in Part 1.
5. In a Fluid Engine section, set the button to **Fit** rather than **Fill**, so it keeps its pill
   shape and padding.

On a dark section, buttons turn Teal with White text on their own, because of the dark themes, and
snippet B turns them into Cyan outlines. Use one primary button there.

### Sample home page

A simple page you can build in about fifteen minutes. Replace the bracketed text with your own.

1. **Hero, Navy (Darkest 1).** A full width Image block or a section background photo, chosen by
   the [images guide](../images.md#brand-photography). Over a calm area of the photo, a Text block
   with an eyebrow (Heading 4), your headline as Heading 1 and one or two sentences as Paragraph 1.
   Below it, a primary Button block ("[Main action]"). If the text is hard to read over the photo,
   move it to a calm area or set the section without a photo.
2. **What we do, Warm White (Light 1).** A Heading 2 headline. Under it, three short numbered
   blocks, each a Line block, a number, a Heading 3 and a Paragraph 2.
3. **Proof, Navy (Darkest 1).** A Heading 2 headline, then three white cards: in each column, a
   Text block with a Heading 3 title and a Paragraph 2, on a White background (in Fluid Engine,
   click the block, then **Design**, and give it a White background).
4. **Call to action, White (Lightest 1).** A Heading 2 and one sentence in Paragraph 1, with one
   primary Button block.
5. **Footer, Black (Darkest 2).** Edit the footer section and give it **Darkest 2**. Use the white
   logo file there.

## Part 4: Custom CSS (only what settings cannot do)

This part is optional. Your site is already on brand after Parts 1 to 3. Custom CSS is a few lines
of style code that you paste into one box; it adds three things that Squarespace settings cannot
do:

| Snippet | What it fixes | Why settings cannot do it |
| --- | --- | --- |
| A: the eyebrow | Heading 4 in Text blocks becomes the eyebrow: Oswald Regular, 14px, capitals, letter spacing 0.3em | All heading sizes share one weight and one letter spacing |
| B: button outlines and hovers | On light sections, the primary fill clears to a Teal outline on hover and the secondary button gets a Teal outline that fills on hover. On dark sections, buttons are Cyan outlines that fill with Teal on hover | There is no outline color or hover setting |
| C: exact headline sizes (optional) | Heading 1 at exactly 64px on desktop and 40px on phones | Squarespace scales headings with the screen, so sizes are close but not exact |

### Where to paste it

1. Open the **Pages** panel.
2. At the bottom, click **Custom Code**, then **Custom CSS**. (On some sites this is under
   **Design**, then **Custom CSS**, or **Website Tools**, then **Custom CSS**.)
3. Paste the snippets into the box. If the box already has code, paste them at the end.
4. Click **Save**.

The Custom CSS panel is available on every plan.

### Snippet A: the eyebrow

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.sqs-block-html h4 {
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.3em;
}
```

What it does: it styles Heading 4, but only inside Text blocks (that is what `.sqs-block-html`
means), as the eyebrow. The font and the capitals already come from Site styles. Use Heading 4 only
for eyebrows once this snippet is in place.

### Snippet B: button outlines and hovers

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.sqs-button-element--primary,
.sqs-button-element--secondary {
  box-shadow: inset 0 0 0 2px #00708e;
}

.sqs-button-element--primary:hover {
  background-color: transparent !important;
  color: #00708e !important;
  opacity: 1 !important;
}

.sqs-button-element--secondary:hover {
  background-color: #00708e !important;
  color: #ffffff !important;
  opacity: 1 !important;
}

[data-section-theme="black"] .sqs-button-element--primary,
[data-section-theme="black"] .sqs-button-element--secondary,
[data-section-theme="black-bold"] .sqs-button-element--primary,
[data-section-theme="black-bold"] .sqs-button-element--secondary,
[data-section-theme="dark"] .sqs-button-element--primary,
[data-section-theme="dark"] .sqs-button-element--secondary {
  background-color: transparent !important;
  color: #ffffff !important;
  box-shadow: inset 0 0 0 2px #54eeff;
}

[data-section-theme="black"] .sqs-button-element--primary:hover,
[data-section-theme="black"] .sqs-button-element--secondary:hover,
[data-section-theme="black-bold"] .sqs-button-element--primary:hover,
[data-section-theme="black-bold"] .sqs-button-element--secondary:hover,
[data-section-theme="dark"] .sqs-button-element--primary:hover,
[data-section-theme="dark"] .sqs-button-element--secondary:hover {
  background-color: #00708e !important;
  color: #ffffff !important;
  box-shadow: inset 0 0 0 2px #00708e;
}
```

`.sqs-button-element--primary` and `--secondary` are the names Squarespace gives primary and
secondary buttons. The outline is drawn with `box-shadow`, so the button keeps its size.
`!important` makes sure our hover wins over Squarespace's fade. `black`, `black-bold` and `dark`
are the names Squarespace uses behind the scenes for the **Darkest 1**, **Darkest 2** and **Dark
1** themes, so those rules only touch buttons on Navy, Black and Deep Teal sections. If you chose
different themes for your dark sections, these rules will not apply; switch those sections to the
themes in Step 2.

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

If your plan includes code injection, you can also load the Propellant stylesheet. It loads the
exact Oswald and Lato files we use, and adds ready made classes for the patterns that sections
cannot do on their own, such as the notch, the angled tint and the hero overlay.

1. Open the **Pages** panel, click **Custom Code**, then **Code Injection**.
2. In the **Header** box, paste:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css"
/>
```

3. Click **Save**.

The stylesheet only styles elements that carry one of its class names, so it never changes the
rest of your site. Squarespace's own blocks do not let you add class names, so you use the classes
inside a **Code** block, where you write a little HTML. For example:

```html
<div class="propellant-section-angled">
  <p class="propellant-eyebrow">Your eyebrow</p>
  <h2 class="propellant-headline">Your headline here</h2>
  <a class="propellant-button" href="/apply">Apply now</a>
  <a class="propellant-button propellant-button-secondary" href="/about">Learn more</a>
</div>
```

`propellant-section-angled` is a light section with the pale tint rising on an angle, and
`propellant-section-navy propellant-notch` is a Navy section with the notch below it. The full list
is in the [website spec](../websites.md#the-propellant-stylesheet). For most content, the snippets
above are simpler: they work with normal Text and Button blocks, so anyone can edit the page later.

### Removing the code later

Open **Custom Code**, then **Custom CSS** (or **Code Injection**), select the lines from the
`/* Propellant website styles` comment down to the end of that snippet, delete them and click
**Save**. Your site goes back to the plain Site styles from Part 1. Keep the comment line on
anything you leave in place, so the next person knows where it came from.

## Check your work

On a computer:

- [ ] Every heading is in Oswald capitals. Paragraphs are in Lato, in sentence case.
- [ ] The eyebrow above the headline is small, light and widely spaced (if you added snippet A).
- [ ] Buttons are pills in Oswald capitals. On light sections the primary is solid Teal with White
      text; on dark sections buttons are Teal, or Cyan outlines if you added snippet B.
- [ ] Hovering a primary button on a light section clears it to a Teal outline (if you added
      snippet B).
- [ ] White, Warm White, Navy, Black and Deep Teal sections use Lightest 1, Light 1, Darkest 1,
      Darkest 2 and Dark 1, and dark and light sections alternate.
- [ ] Nothing on a dark section is Teal text. Text there is White, and links are Cyan.
- [ ] Photos and image blocks have square corners.
- [ ] The full color logo sits on a White or Warm White header, at least 24px tall, with room
      around it.
- [ ] The monogram shows in the browser tab.

On a phone (use the mobile view in the editor, then check the published site on a real phone):

- [ ] Heading 1 is about 40px and fits without breaking words awkwardly.
- [ ] The mobile logo is at least 24px tall.
- [ ] Buttons stay pill shaped and easy to tap.
- [ ] Sections have clear space above and below, about 64px.

Code can behave differently in the editor than on the live site. Open your published site in a
private window to see it the way visitors do.

## If something looks off

- **A heading is not in Oswald capitals.** Check the text is set to a heading in the format menu,
  not just made bigger, and that Site styles, **Fonts**, **Headings** is set to Oswald and
  Uppercase.
- **The eyebrow looks like a heavy heading.** Check snippet A is in the Custom CSS box and that
  you clicked Save. Then reload the page.
- **One block ignores the site colors or fonts.** Someone styled it with the text toolbar. Select
  the text and clear the formatting, or pick the format again from the format menu, so it follows
  Site styles.
- **A whole section changed color after you edited the palette.** Palette changes flow into the
  color themes. Open your five themes again and re-enter the values from the tables in Step 2.
- **Your fonts or buttons suddenly changed.** A theme or pack was clicked in Site styles. Use the
  undo arrow at the top of the panel, or set Step 1 or Step 3 again.
- **A button is square or stretched.** In a Fluid Engine section, set the Button block to **Fit**,
  not **Fill**. If all buttons are square, check **Shape** is **Pill** in Site styles, **Buttons**,
  for each button type.
- **The old browser icon still shows.** Browsers keep icons for a long time. Clear the cache or
  open the site in a private window.
