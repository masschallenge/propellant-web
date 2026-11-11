# Wix

This guide gives a Wix site the MassChallenge look: Lato and Oswald type, the teal palette, pill
shaped buttons and the right logo in the header. It covers both of Wix's editors, the Wix Editor
and Wix Studio, and says clearly where they differ. Setting up the styles takes about an hour. Plan
on another hour if you are building a home page from scratch.

Wix has more than one editor, and each puts the style settings in a different place. Check which
one you have before you start:

- **Wix Editor** (the classic editor): the left side of the screen has a **Site Design** button
  (called Theme Manager in some older versions).
- **Wix Studio**: the left side of the screen has a **Site Styles** button.
- If you see a **Brand** button at the top of the editor instead, your site uses Wix's newer
  editor (Wix Harmony). The values in this guide still apply: enter them under **Brand**, then
  **Colors**, **Text** and **Buttons**.

## Before you start

**Plans.** You can do almost everything in this guide on any Wix plan, free included. A few steps
need more:

| Step | Wix Editor | Wix Studio |
| --- | --- | --- |
| Site styles, logo, sections and buttons (Parts 1 to 3) | Any plan | Any plan |
| Site icon (favicon, the small picture in the browser tab) | Paid (Premium) plan, a connected domain and a published site | Same as Wix Editor |
| CSS editing in `global.css` (Part 4) | Usually not available (see Part 4) | Available in the editor's Code panel. Wix's help pages list no plan requirement |
| Custom code in the page head (Part 5) | Published site with a connected domain, which needs a paid plan | Same as Wix Editor |

A connected domain means your own web address, such as `yourname.org`, instead of a free
`wixsite.com` address. Wix only lets you connect one on a paid plan.

**Keep the spec open.** Every value in this guide comes from the
[website spec](../websites.md). Open it in a second browser tab so you can copy hex codes (the six
character color codes that start with `#`) straight from it.

**Download the logo files.** Use only the official files. Save these to your computer:

- [masschallenge-logo-horizontal-color.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-color.png),
  for white and light backgrounds.
- [masschallenge-logo-horizontal-white.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-white.png),
  for Deep teal sections and dark photos.
- [masschallenge-logo-monogram-color.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-monogram-color.png),
  for the site icon.

There are also `-black` versions of both lockups (for example
`masschallenge-logo-horizontal-black.png`) at the same address, for places where only one dark
color works. Read the [logo rules](../brand.md#logo) once before you place the logo: never
stretch, recolor or crop it.

## Part 1: Set up site styles (no code)

This is where most of the work happens. Set the styles once and every themed element on the site
picks them up. Follow the section for your editor.

### Wix Editor

The Wix Editor has three site-wide settings: a **color theme**, a **text theme** (named text
styles: Heading 1 to Heading 6 and Paragraph 1 to Paragraph 3) and the colors for **primary and
secondary buttons**. Button shape and padding are set on a button itself, then copied.

#### Step 1: Set the theme colors

The color theme has two kinds of color. **Base colors** run from light to dark: Wix uses the
lightest for backgrounds and the darkest for text, and builds a range of shades between them.
**Accent colors** are used for links, buttons and menus.

1. In the editor, click **Site Design** on the left.
2. Click **Color theme**. In some versions you hover over **Color & Text Theme** and click
   **Customize** instead.
3. Click a color in the panel, type its hex code into the HEX field, and click **Apply**. Set them
   from this table:

   | Wix slot | Spec color | Hex |
   | --- | --- | --- |
   | Base color, lightest (backgrounds) | White | `#FFFFFF` |
   | Base color, darkest (text) | Ink | `#1E282B` |
   | Accent color 1 | Teal | `#065E6F` |
   | Accent color 2 | Deep teal | `#044451` |
   | Accent color 3 | Pale teal | `#D9F6FA` |
   | Accent color 4 | Bright teal | `#0FACBD` |

   If your panel shows fewer accent slots, fill them in this order and stop when you run out.
   If it shows more, use Mist `#F3FBFC` and Slate `#4B575B` next.

4. Open **Advanced Settings** (at the bottom of the color panel). Click the color box next to each
   item and set:

   | Group | Item | Spec color | Hex |
   | --- | --- | --- | --- |
   | General | Primary background | White | `#FFFFFF` |
   | General | Secondary background | Mist | `#F3FBFC` |
   | General | Lines and dividers | Line | `#DBE1E3` |
   | Text | Titles and paragraphs | Ink | `#1E282B` |
   | Text | Subtitles | Slate | `#4B575B` |
   | Text | Links | Teal | `#065E6F` |
   | Buttons | Primary, regular | Teal | `#065E6F` |
   | Buttons | Primary, hover | Deep teal | `#044451` |
   | Buttons | Secondary, regular | Pale teal | `#D9F6FA` |
   | Buttons | Secondary, hover | (secondary hover) | `#C4EEF4` |
   | Buttons | Disabled | Line | `#DBE1E3` |

   The exact item names in this panel vary between sites. Match each item to the closest row.
   If the panel also asks for button text colors, use White `#FFFFFF` on primary buttons and Teal
   `#065E6F` on secondary buttons.

5. Save the remaining spec colors so they are one click away later: Mist `#F3FBFC`, Slate
   `#4B575B`, Line `#DBE1E3`, Yellow `#FFC801` and Magenta `#BF0261`. In any color picker, use
   **My colors** and the add option (a plus sign) to save each one.

Only use Bright teal on Deep teal sections, and only use Yellow behind Ink text. Magenta is for
error messages, never decoration.

#### Step 2: Check that Lato and Oswald are in your font list

1. Select any text box on the page and click **Edit Text**.
2. Open the **Fonts** drop-down and look for **Lato** and **Oswald**. Wix lists font weights as
   separate entries in some cases, so you may see **Oswald Medium** listed on its own. That is the
   one you want for Heading 1.
3. If either font is missing, upload it:
   1. Download the font from Google Fonts ([Lato](https://fonts.google.com/specimen/Lato) and
      [Oswald](https://fonts.google.com/specimen/Oswald)). You need Lato Regular, Lato Bold and
      Oswald Medium.
   2. In the same **Fonts** drop-down, click **Upload Fonts** and choose the file (TTF, OTF, WOFF
      or WOFF2 all work).
   3. Click **Done** when it finishes. Uploaded fonts appear under **My Fonts** in the drop-down.

Uploaded fonts do not work in the Wix Blog and some Wix apps, so prefer the built-in Lato and
Oswald when they are listed.

#### Step 3: Set the text theme

1. Click **Site Design**, then **Text theme**.
2. Set **Heading Font** to **Lato** and **Paragraph Font** to **Lato**. Heading 1 gets Oswald in
   the next step.
3. Click **Customize heading styles**. Hover over each style, click the edit (pencil) icon, and
   enter the values from the table below. Then do the same under **Customize paragraph styles**.

| Wix style | Spec style | Font | Bold | Size | Line spacing | Character spacing |
| --- | --- | --- | --- | --- | --- | --- |
| Heading 1 | Heading 1 | Oswald Medium (or Oswald, not bold) | Off | 64px | 1.0 | 0.01em (1%) |
| Heading 2 | Heading 2 | Lato | On | 40px | 1.15 | 0 |
| Heading 3 | Heading 3 | Lato | On | 30px | 1.2 | 0 |
| Heading 4 | Heading 4 | Lato | On | 24px | 1.25 | 0 |
| Heading 5 | Heading 4 | Lato | On | 24px | 1.25 | 0 |
| Heading 6 | Heading 4 | Lato | On | 24px | 1.25 | 0 |
| Paragraph 1 | Paragraph large | Lato | Off | 20px | 1.5 | 0 |
| Paragraph 2 | Paragraph | Lato | Off | 17px | 1.6 | 0 |
| Paragraph 3 | Paragraph small | Lato | Off | 14px | 1.5 | 0 |

Notes on the fields:

- **Line spacing.** Wix may show this as a number (enter the value above) or in pixels. For pixels,
  multiply the size by the line spacing: 64px for Heading 1, 46px for Heading 2, 36px for Heading
  3, 30px for Heading 4 and Paragraph 1, 27px for Paragraph 2 and 21px for Paragraph 3.
- **Character spacing.** Only Heading 1 has any. If the field takes a small decimal, enter
  `0.01`. If it takes a percentage, enter `1`.
- **Color.** Leave every style on Ink `#1E282B` (the darkest base color). Do not make headings teal:
  teal means something you can click.
- **Heading 5 and 6** have no style of their own in the spec, so they copy Heading 4. Keep them out
  of your pages if you can.
- **Capitals.** The Wix Editor has no setting that turns a style into capitals. Type your Heading 1
  text in capitals, for example BUILT FOR THE WORLD. Type every other heading and button in
  sentence case (capital first letter, the rest lower case except names).

Any change to a style updates all the text on the site that already uses it.

#### Step 4: Design one primary button and one secondary button

The Wix Editor has no site-wide button shape setting, so you style one button and reuse it.

1. Click **Add Elements** on the left, then **Button**, and add a **Themed** button so it picks up
   your theme colors.
2. Select the button, click the **Design** icon, then **Customize Design**.
3. Set the **Regular** state:
   - **Fill:** Teal `#065E6F`, opacity 100%.
   - **Borders:** width 0.
   - **Corners:** click the lock so all four corners change together, then enter `100`. Any number
     at least half the button's height makes the fully rounded pill ends.
   - **Shadows:** off.
   - **Text:** Lato, 16px, bold, White `#FFFFFF`, character spacing 0.
   - **Layout:** padding of about 14px above and below the text and 28px on each side. If your
     button only offers side padding, set 28px there and make the button about 44px tall.
4. Switch to the **Hover** state and set **Fill** to Deep teal `#044451`. Keep the text White.
5. Type a label in sentence case with a verb, such as Apply now.
6. For a **secondary** button, duplicate the primary button (copy and paste it) and change only the
   colors: Regular fill Pale teal `#D9F6FA`, text Teal `#065E6F`. Hover fill `#C4EEF4`, text Teal.
7. Keep these two buttons on a spare page or in a hidden spot. Copy and paste them whenever you
   need a new button, so every button stays the same.

#### Step 5: Set the mobile sizes

The Wix Editor has a separate mobile editor. Changes you make there only affect phones. Text you
added on desktop keeps its wording, but you can change its size on mobile.

1. Click the phone icon at the top of the editor to switch to the mobile view.
2. Select each heading and paragraph and set its size to the mobile value:

| Style | Mobile size |
| --- | --- |
| Heading 1 | 40px |
| Heading 2 | 30px |
| Heading 3 | 24px |
| Heading 4 | 20px |
| Paragraph large (Paragraph 1) | 18px |
| Paragraph (Paragraph 2) | 16px |
| Paragraph small (Paragraph 3) | 14px |
| Button text | 16px |

3. Check that buttons stay pill shaped and that sections have about 64px of space above and below
   their content.

### Wix Studio

Wix Studio keeps colors and text styles in one panel called **Site Styles**. It has no site-wide
button style yet, so buttons are styled one at a time or, better, with the short CSS in Part 4.

#### Step 1: Set the site colors

Every Studio site has at least six numbered colors, each tied to a job across the site and its
apps. You can add more, up to 25.

1. Click **Site Styles** on the left side of the editor, then the **Colors** tab.
2. Click a color, type the hex code into the HEX field, and click **Apply**. Set them from this
   table:

   | Studio color | What Wix uses it for | Spec color | Hex |
   | --- | --- | --- | --- |
   | Color 1 | Primary background | White | `#FFFFFF` |
   | Color 2 | Secondary background | Mist | `#F3FBFC` |
   | Color 3 | Disabled items | Line | `#DBE1E3` |
   | Color 4 | Secondary text | Slate | `#4B575B` |
   | Color 5 | Primary text | Ink | `#1E282B` |
   | Color 6 | Links and actions | Teal | `#065E6F` |

   Your template may give these colors names, such as Primary background. Go by the job, not the
   name.

3. Add the rest of the spec palette as extra site colors, and rename each one to its spec name
   (hover over a color, click the **More Actions** icon, then **Rename**):

   | Name | Hex |
   | --- | --- |
   | Deep teal | `#044451` |
   | Bright teal | `#0FACBD` |
   | Pale teal | `#D9F6FA` |
   | Secondary hover | `#C4EEF4` |
   | Yellow | `#FFC801` |
   | Magenta | `#BF0261` |

#### Step 2: Set the fonts

1. In **Site Styles**, open the **Typography** tab.
2. Under **Fonts**, click each font, choose **Lato** from the drop-down, and click **Update**.
   Heading 1 gets Oswald in the next step.
3. If Lato or Oswald is missing from the list, upload it:
   1. Download it from Google Fonts ([Lato](https://fonts.google.com/specimen/Lato) and
      [Oswald](https://fonts.google.com/specimen/Oswald)).
   2. Select any text element, click the **Open Inspector** icon at the top right, scroll to
      **Design** and open the **Font** drop-down.
   3. Click **Upload fonts** at the bottom, then **Upload Fonts**, and choose the file (TTF, OTF,
      WOFF or WOFF2). Click **Close** when it is done. It now appears under **Uploaded fonts**.

#### Step 3: Set the text styles

Studio has nine text styles: Heading 1 to Heading 6 (H1 to H6) and Paragraph 1 to Paragraph 3.
Each one has a **scale** option that sets a largest and smallest size, so the text shrinks
smoothly on small screens. That is how you set the mobile sizes.

1. In **Site Styles**, **Typography**, under **Text styles**, click a style.
2. Set the font, weight, size, line spacing, character spacing and color from the table below.
3. Turn on **scale** and enter the largest size as the maximum and the mobile size as the minimum.
4. Click the arrow at the top left to go back, and do the next style.

| Studio style | Spec style | Font and weight | Max size | Min size | Line spacing | Character spacing | Color |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Heading 1 | Heading 1 | Oswald, Medium (500) | 64px | 40px | 1.0 | 0.01em (1%) | Ink |
| Heading 2 | Heading 2 | Lato, Bold (700) | 40px | 30px | 1.15 | 0 | Ink |
| Heading 3 | Heading 3 | Lato, Bold (700) | 30px | 24px | 1.2 | 0 | Ink |
| Heading 4 | Heading 4 | Lato, Bold (700) | 24px | 20px | 1.25 | 0 | Ink |
| Heading 5 | Heading 4 | Lato, Bold (700) | 24px | 20px | 1.25 | 0 | Ink |
| Heading 6 | Heading 4 | Lato, Bold (700) | 24px | 20px | 1.25 | 0 | Ink |
| Paragraph 1 | Paragraph large | Lato, Regular (400) | 20px | 18px | 1.5 | 0 | Ink |
| Paragraph 2 | Paragraph | Lato, Regular (400) | 17px | 16px | 1.6 | 0 | Ink |
| Paragraph 3 | Paragraph small | Lato, Regular (400) | 14px | 14px | 1.5 | 0 | Ink |

If the style panel only offers a **Bold** switch rather than a weight list, turn Bold on for the
Lato headings and off for paragraphs, and for Heading 1 pick **Oswald Medium** from the font list
if it is there (uploaded or built in). If line spacing is in pixels, use the pixel values from the
Wix Editor notes above. Studio, like the Wix Editor, has no capitals setting in Site Styles: type
the Heading 1 text in capitals, or add the short CSS in Part 4 so Wix does it for you.

#### Step 4: Style your buttons

Site Styles does not include buttons yet (Wix lists it as a feature request). You have two
options:

- **Recommended: use the button CSS in Part 4.** It styles every button on the site in one go and
  keeps them consistent.
- **Without code:** select a button, click **Open Inspector**, and under **Design** set the same
  values as the Wix Editor button in Step 4 above: Teal fill, White Lato 16px bold text, no
  border, no shadow, corners of `100`, padding of about 14px by 28px, and a Deep teal hover. Then
  copy and paste that button wherever you need one.

#### Step 5: Check the mobile breakpoint

Studio shows a desktop, tablet and mobile view at the top of the editor. These are breakpoints:
the screen widths where the layout can change.

1. Click the mobile view.
2. Check that the text has shrunk to the minimum sizes you set.
3. Select each section and set about 64px of space above and below its content (96px on
   desktop).

## Part 2: Add the logo and site icon

### The logo in the header

The steps are close to identical in both editors.

1. Click the header at the top of any page, so you edit the header shared by every page.
2. Add an image: in the Wix Editor, click **Add Elements**, then **Image**. In Wix Studio, use the
   add panel on the left. Upload `masschallenge-logo-horizontal-color.png`.
3. Place it at the left of the header, lined up with the content below it.
4. Resize it by dragging a corner, never a side, so it keeps its shape. Keep it at least 24px tall.
   About 32px tall is a good header size.
5. Leave clear space around it equal to half its height (16px for a 32px logo). No text, edge or
   other image inside that space.
6. Link it to the home page: select the logo, click the link icon, choose **Page**, then **Home**.
7. Give it alt text (the description screen readers read out) of `MassChallenge`. In the Wix
   Editor this is in the image **Settings**. In Studio it is in the **Inspector**.

If your header is Deep teal or a dark photo, use `masschallenge-logo-horizontal-white.png`
instead. Never place the full color logo on Deep teal.

### The site icon (favicon)

The site icon needs a paid plan, a connected domain and a published site. Wix needs a square image
whose sides are a multiple of 48px. The monogram file is wider than it is tall, so make a square
version first:

1. In any image editor, make a new square canvas of 192 by 192 pixels with a transparent
   background.
2. Place `masschallenge-logo-monogram-color.png` in the middle, scaled down so it does not touch
   the edges. Do not stretch it.
3. Export it as a PNG.

Then upload it:

1. Go to your site's dashboard and click **Settings**.
2. Click **Website settings**.
3. Under **Favicon**, click **Upload Image**, choose your PNG, and save.

Search engines decide whether and when to show the new icon in results, so it may take a while to
appear there.

## Part 3: Build on brand pages

A MassChallenge page alternates between three kinds of section. Stack them so neighboring sections
differ, and keep the Deep teal section for the moments that matter most, such as the opening or the
final call to action.

### Make the three kinds of section

**White section** (the default):

- **Wix Editor:** right-click the section (or click a strip) and choose **Change Background**.
  Under **Color**, pick White `#FFFFFF`.
- **Wix Studio:** select the section, click **Open Inspector**, click the color box under
  **Design** and pick Color 1 (White).

**Mist section** (for alternating sections):

- The same steps, with Mist `#F3FBFC`. In Studio it is Color 2.

**Deep teal section** (the brand band):

1. Set the background to Deep teal `#044451` the same way.
2. Set every heading and paragraph in it to White `#FFFFFF`: select the text and change its color.
3. Use Bright teal `#0FACBD` for any small accent, such as a short line or an icon. Never put Teal
   `#065E6F` text on Deep teal.
4. Use the white logo if the logo appears here.
5. Style the buttons as described in "Buttons on Deep teal" below.

In Studio, a section's background can differ by breakpoint. Check the mobile view to make sure it
stayed the same.

### Section spacing and width

- Give each section about 96px of empty space above and below its content on desktop and 64px on
  mobile.
- Make paragraph text boxes about 720px wide, so lines run to roughly 68 characters. Drag the side
  of the text box, or set the width in Studio's Inspector.
- Round images and cards by 12px: select the image, open its design settings, and set **Corners**
  to 12.

### Add the Heading 1 headline

1. Add a text box and choose the **Heading 1** style from the text style drop-down (in the Wix
   Editor, click **Edit Text**, then the **Styles** drop-down).
2. Type the headline. In the Wix Editor, type it in capitals. In Studio, type it in capitals too,
   unless you added the headline CSS from Part 4.
3. Use one Heading 1 per page, at the top. Use Heading 2 and Heading 3 for everything below it,
   in order: it helps search engines and people using screen readers.

### Add primary and secondary buttons

- Copy and paste your saved primary button for the main action on a section, such as Apply now.
- Use the secondary button (Pale teal) for the second action next to it, such as Learn more.
- Give each section one primary button at most.
- Write labels in sentence case, starting with a verb.

### Buttons on Deep teal

A Teal button disappears on Deep teal, so buttons there turn White:

- **Regular:** fill White `#FFFFFF`, text Deep teal `#044451`.
- **Hover:** fill Pale teal `#D9F6FA`, text Deep teal.
- Same pill shape and padding as the other buttons.

Style one, then copy it for every Deep teal section. In Studio, the Part 4 CSS does this for you.

### Build a sample home page

1. **Opening (Deep teal):** a Heading 1 headline in capitals, one Paragraph 1 line under it, and a
   white primary button.
2. **What you offer (White):** a Heading 2, a Paragraph 2 of two or three sentences, and three
   cards with an image (12px corners), a Heading 4 and a short Paragraph 2 each.
3. **Proof (Mist):** a Heading 2 and a few short points or quotes in Paragraph 2, with captions in
   Paragraph 3 and Slate `#4B575B`.
4. **Call to action (White):** a Heading 2, one line of Paragraph 1, a primary button and a
   secondary button side by side.
5. **Footer (Mist or White):** the logo, links in Teal and small print in Paragraph 3.

## Part 4: Custom CSS (optional, Wix Studio)

**Skip this part unless you need it.** The settings above get you nearly all the way. CSS (the
code language that styles web pages) fixes two things Studio's settings cannot:

1. **Capital letters on Heading 1.** Site Styles has no capitals setting, so without CSS you have
   to type the headline in capitals.
2. **One button style for the whole site.** Site Styles has no button styles, so without CSS you
   style every button by hand.

**Which editors.** Wix's developer documentation describes this CSS feature for Wix Studio. Some of
Wix's pages also mention the Wix Editor, but in practice the CSS option does not appear for most
Wix Editor sites. If you use the Wix Editor and do not see **global.css** in the steps below, skip
to Part 5, or simply keep typing headlines in capitals and copying your saved buttons.

**Plans.** Wix's help pages list no plan requirement for CSS editing in Studio. Users in the Wix
Studio community report that it works on free plans too.

### Where to paste it

1. Click the **Code** icon on the left side of the editor. If it is your first time, click
   **Start Coding**.
2. Click **Page Code**.
3. Under **CSS**, click **+ Add global.css** (or click **global.css** if it is already there).
4. Paste the snippets below into `global.css`. CSS here applies to every page.

CSS in `global.css` overrides what you set in the Inspector, so after you paste it, change those
elements here rather than in the panels.

### Snippet 1: the headline in capitals

This works with a custom class, a label you attach to one element so the CSS can find it.

1. Paste this into `global.css`:

   ```css
   /* Propellant website styles: see github.com/masschallenge/propellant-web */
   .propellant-headline,
   .propellant-headline .rich-text__text {
     text-transform: uppercase;
     letter-spacing: 0.01em;
   }
   ```

2. Select your Heading 1 text box. Keep the code panel open, and under **CSS Classes**, type
   `propellant-headline` in the **Custom classes** field.
3. Now type the headline in normal sentence case. It shows in capitals on the page, and screen
   readers read it as normal words.

### Snippet 2: every button as a Propellant pill

This uses `.button`, the class Wix gives every button, so it styles all of them at once.

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.button {
  border: 0;
  border-radius: 999px;
  box-shadow: none;
  padding: 14px 28px;
  background-color: #065e6f;
}

.button:hover {
  background-color: #044451;
}

.button__label {
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  text-transform: none;
  color: #ffffff;
}

.button.propellant-button-secondary {
  background-color: #d9f6fa;
}

.button.propellant-button-secondary:hover {
  background-color: #c4eef4;
}

.propellant-button-secondary .button__label {
  color: #065e6f;
}

.propellant-brand-band .button {
  background-color: #ffffff;
}

.propellant-brand-band .button:hover {
  background-color: #d9f6fa;
}

.propellant-brand-band .button__label {
  color: #044451;
}
```

Then add classes where you need the variations:

- **Secondary button:** select the button and type `propellant-button-secondary` under
  **Custom classes**.
- **Deep teal section:** select the section and type `propellant-brand-band` under **Custom
  classes**. Every button inside it turns White with Deep teal text. You still set the section's
  Deep teal background and White text in the Inspector, as in Part 3.

The class names `.button`, `.button__label`, `.rich-text` and `.rich-text__text` come from Wix's own
documentation, which says only documented class names stay stable. Do not change them to other
names you find in the page.

### Check and remove

- Preview the site and check that buttons are pills and the headline is in capitals.
- **To remove the CSS later:** open **global.css** again, delete the snippet (from its comment line
  to its last `}`), and publish. Then remove the custom classes from the elements, or leave them:
  they do nothing without the CSS.

## Part 5: Custom code in the page head (optional, last step)

**Most sites do not need this.** It loads the Propellant stylesheet, the small file of ready-made
styles from the [website spec](../websites.md#the-propellant-stylesheet). The head is a hidden part
of every page where browsers look for things like stylesheets.

**Requirements:** a published site with a connected domain, which needs a paid plan. Custom code
does not run on the free `wixsite.com` address, and you will only see its effect on the published
site, not in the editor.

**When it helps:** in Wix Studio, if you want to use the Propellant class names directly instead of
the snippets in Part 4. The stylesheet only styles elements you give one of its class names, using
the **Custom classes** field from Part 4, so it never changes the rest of your site. In the Wix
Editor there is usually no way to attach class names, so this step does little there.

1. Go to your site's dashboard and click **Settings**.
2. Under **Development & integrations**, click **Custom Code**.
3. Click **+ Add Custom Code** at the top right.
4. Paste this:

   ```html
   <!-- Propellant website styles: see github.com/masschallenge/propellant-web -->
   <link
     rel="stylesheet"
     href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css"
   />
   ```

5. Name it `Propellant stylesheet`.
6. Under **Add Code to Pages**, choose **All pages**, and load it on each new page.
7. Under **Place Code in**, choose **Head**.
8. Click **Apply**, then publish the site.

The classes you can then use:

| Custom class | What it does |
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

The stylesheet also loads Lato and Oswald for you. Wix adds a custom class to the outer edge of an
element, while Wix's own styling sits on the parts inside it (such as a button's label). If a
class does not seem to change something on the published site, use the Part 4 snippets instead,
which aim at Wix's own documented inner classes.

**To remove it later:** go back to **Settings**, **Custom Code**, find **Propellant stylesheet**,
open its menu and delete it, then publish.

## Check your work

On desktop:

- [ ] Body text and headings are Lato in Ink `#1E282B`. Only Heading 1 is Oswald, and only Heading 1
      is in capitals.
- [ ] Heading 1 is 64px, Heading 2 is 40px, paragraphs are 17px.
- [ ] Buttons are Teal pills with White bold text, turn Deep teal on hover, and have sentence case
      labels.
- [ ] Secondary buttons are Pale teal with Teal text.
- [ ] Deep teal sections have White text and White buttons, and no Teal text.
- [ ] Sections alternate between White and Mist, with about 96px of space above and below.
- [ ] The logo is the official file, at least 24px tall, with clear space, linked to the home page.

On a phone (use the editor's mobile view, then check the published site on a real phone):

- [ ] Heading 1 is about 40px and paragraphs about 16px.
- [ ] Sections have about 64px of space above and below.
- [ ] Buttons are still pills and easy to tap.
- [ ] The site icon shows in the browser tab (paid plans only, and it can take a while).

## If something looks off

- **A text element ignores the theme.** It was styled by hand. Select it and choose the right style
  from the text style drop-down again (in the Wix Editor, **Edit Text**, then **Styles**). Text
  added from **Add Elements** under the themed options follows the theme by default.
- **Heading 1 looks too heavy or too thin.** The wrong Oswald weight is selected. Pick **Oswald
  Medium** (weight 500), and make sure Bold is off for Heading 1.
- **Buttons are square or rounded only a little.** The corner value is too small. Set corners to
  `100` in the button's design settings, or add Snippet 2 in Studio.
- **The mobile site looks different from desktop.** The Wix Editor's mobile view and Studio's
  breakpoints can each have their own sizes and backgrounds. Switch to the mobile view and fix the
  element there.
- **The CSS or stylesheet does nothing.** In Studio, check that the class is typed exactly, with no
  dot and no spaces, in **Custom classes**. Head code only runs on the published site with a
  connected domain, so check there, not in the editor.
- **Colors look slightly off.** Retype the hex codes from the spec. Wix's base color shades are
  generated automatically, so pick the exact color you saved rather than a nearby shade.
