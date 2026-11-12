# Wix

This guide gives a Wix site the MassChallenge look: Oswald headlines in capitals, Lato text, the
brand palette, pill shaped Oswald buttons, dark and light sections and the right logo in the
header. It covers both of Wix's editors, the Wix Editor
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
  for Navy, Black and Deep Teal sections and dark photos.
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
   | Base color, darkest (text) | Black | `#222222` |
   | Accent color 1 | Teal | `#00708E` |
   | Accent color 2 | Navy | `#10263F` |
   | Accent color 3 | Deep Teal | `#004F73` |
   | Accent color 4 | Cyan | `#54EEFF` |

   If your panel shows fewer accent slots, fill them in this order and stop when you run out.
   If it shows more, use Warm White `#F8F8F5` and Slate `#4B575B` next.

4. Open **Advanced Settings** (at the bottom of the color panel). Click the color box next to each
   item and set:

   | Group | Item | Spec color | Hex |
   | --- | --- | --- | --- |
   | General | Primary background | White | `#FFFFFF` |
   | General | Secondary background | Warm White | `#F8F8F5` |
   | General | Lines and dividers | Line | `#DBE1E3` |
   | Text | Titles | Teal | `#00708E` |
   | Text | Paragraphs | Black | `#222222` |
   | Text | Subtitles | Slate | `#4B575B` |
   | Text | Links | Teal | `#00708E` |
   | Buttons | Primary, regular | Teal | `#00708E` |
   | Buttons | Primary, hover | White | `#FFFFFF` |
   | Buttons | Secondary, regular | White | `#FFFFFF` |
   | Buttons | Secondary, hover | Teal | `#00708E` |
   | Buttons | Disabled | Line | `#DBE1E3` |

   The exact item names in this panel vary between sites. Match each item to the closest row.
   If the panel also asks for button text colors, use White `#FFFFFF` on primary buttons and Teal
   `#00708E` on their hover, and Teal on secondary buttons with White on their hover. Step 4 adds
   the Teal outline that holds both together.

5. Save the remaining spec colors so they are one click away later: Warm White `#F8F8F5`, Black
   `#222222`, Light tint `#F3FAFC`, Slate `#4B575B`, Line `#DBE1E3`, Yellow `#FFC801` and Error
   `#BF0261`. In any color picker, use **My colors** and the add option (a plus sign) to save each
   one.

Only use Cyan on Navy, Black and Deep Teal sections, and never put Teal text on them. Use one warm
accent per page, such as Yellow behind Black text on a tag. The error color is for form error
messages, never decoration. MC Blue `#0EABBC` is for the logo and graphic shapes, never text.

#### Step 2: Check that Lato and Oswald are in your font list

1. Select any text box on the page and click **Edit Text**.
2. Open the **Fonts** drop-down and look for **Lato** and **Oswald**. Wix lists font weights as
   separate entries in some cases, so you may see **Oswald SemiBold** or **Oswald Light** listed on
   their own. You want Oswald SemiBold for headings and buttons and Oswald Regular for eyebrows.
3. If either font is missing, upload it:
   1. Download the font from Google Fonts ([Lato](https://fonts.google.com/specimen/Lato) and
      [Oswald](https://fonts.google.com/specimen/Oswald)). You need Lato Regular, Lato Bold, Oswald
      Regular, Oswald SemiBold and Oswald Bold.
   2. In the same **Fonts** drop-down, click **Upload Fonts** and choose the file (TTF, OTF, WOFF
      or WOFF2 all work).
   3. Click **Done** when it finishes. Uploaded fonts appear under **My Fonts** in the drop-down.

Uploaded fonts do not work in the Wix Blog and some Wix apps, so prefer the built-in Lato and
Oswald when they are listed.

#### Step 3: Set the text theme

1. Click **Site Design**, then **Text theme**.
2. Set **Heading Font** to **Oswald** and **Paragraph Font** to **Lato**.
3. Click **Customize heading styles**. Hover over each style, click the edit (pencil) icon, and
   enter the values from the table below. Then do the same under **Customize paragraph styles**.

| Wix style | Spec style | Font | Bold | Size | Line spacing | Character spacing |
| --- | --- | --- | --- | --- | --- | --- |
| Heading 1 | Heading 1 (the headline) | Oswald SemiBold | Off | 64px | 1.0 | 0 |
| Heading 2 | Heading 2 | Oswald SemiBold | Off | 40px | 1.0 | 0 |
| Heading 3 | Heading 3 (subhead) | Oswald SemiBold | Off | 30px | 1.1 | 0 |
| Heading 4 | Heading 4 | Oswald SemiBold | Off | 24px | 1.15 | 0 |
| Heading 5 | Eyebrow | Oswald (Regular) | Off | 14px | 1.2 | 0.3em (30%) |
| Heading 6 | Big stat | Oswald | On | 72px | 1.0 | 0 |
| Paragraph 1 | Paragraph large | Lato | Off | 20px | 1.5 | 0 |
| Paragraph 2 | Paragraph | Lato | Off | 17px | 1.5 | 0 |
| Paragraph 3 | Paragraph small | Lato | Off | 14px | 1.5 | 0 |

Notes on the fields:

- **Line spacing.** Wix may show this as a number (enter the value above) or in pixels. For pixels,
  multiply the size by the line spacing: 64px for Heading 1, 40px for Heading 2, 33px for Heading
  3, 28px for Heading 4, 17px for Heading 5, 72px for Heading 6, 30px for Paragraph 1, 26px for
  Paragraph 2 and 21px for Paragraph 3.
- **Character spacing.** Only the eyebrow has any. If the field takes a small decimal, enter
  `0.3`. If it takes a percentage, enter `30`.
- **Color.** Set Heading 1 and the paragraphs to Black `#222222`, and Headings 2 to 4 and the big
  stat to Teal `#00708E`. In dark sections you change them to White (Part 3).
- **Heading 5 and 6** become the eyebrow and the big stat, because Wix has no other named styles
  for them. Use Heading 5 only for eyebrows and Heading 6 only for large numbers.
- **Capitals.** The Wix Editor has no setting that turns a style into capitals. Type headings,
  eyebrows and button labels in capitals, for example BUILT FOR THE WORLD. Type paragraphs in
  sentence case, never in capitals.

Any change to a style updates all the text on the site that already uses it.

#### Step 4: Design one primary button and one secondary button

The Wix Editor has no site-wide button shape setting, so you style one button and reuse it.

1. Click **Add Elements** on the left, then **Button**, and add a **Themed** button so it picks up
   your theme colors.
2. Select the button, click the **Design** icon, then **Customize Design**.
3. Set the **Regular** state:
   - **Fill:** Teal `#00708E`, opacity 100%.
   - **Borders:** width 2px, Teal `#00708E`.
   - **Corners:** click the lock so all four corners change together, then enter `100`. Any number
     at least half the button's height makes the fully rounded pill ends. Never use square
     corners: square cornered buttons are retired.
   - **Shadows:** off.
   - **Text:** Oswald SemiBold, 16px, White `#FFFFFF`, character spacing 0.05em (5%).
   - **Layout:** padding of about 14px above and below the text and 28px on each side. If your
     button only offers side padding, set 28px there and make the button about 44px tall.
4. Switch to the **Hover** state and set **Fill** to opacity 0% (or White on a White section) and
   the text to Teal `#00708E`, keeping the Teal border. The fill clears to a Teal outline.
5. Type a label in capitals with a verb, such as APPLY NOW.
6. For a **secondary** button, duplicate the primary button (copy and paste it) and swap the
   states: Regular fill opacity 0%, text Teal; Hover fill Teal, text White.
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
| Big stat (Heading 6) | 48px |
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
   | Color 2 | Secondary background | Warm White | `#F8F8F5` |
   | Color 3 | Disabled items | Line | `#DBE1E3` |
   | Color 4 | Secondary text | Slate | `#4B575B` |
   | Color 5 | Primary text | Black | `#222222` |
   | Color 6 | Links and actions | Teal | `#00708E` |

   Your template may give these colors names, such as Primary background. Go by the job, not the
   name.

3. Add the rest of the spec palette as extra site colors, and rename each one to its spec name
   (hover over a color, click the **More Actions** icon, then **Rename**):

   | Name | Hex |
   | --- | --- |
   | Navy | `#10263F` |
   | Deep Teal | `#004F73` |
   | Cyan | `#54EEFF` |
   | Light tint | `#F3FAFC` |
   | MC Blue | `#0EABBC` |
   | Yellow | `#FFC801` |
   | Error | `#BF0261` |

#### Step 2: Set the fonts

1. In **Site Styles**, open the **Typography** tab.
2. Under **Fonts**, set the heading font to **Oswald** and the paragraph font to **Lato**, and click
   **Update**.
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
| Heading 1 | Heading 1 (the headline) | Oswald, SemiBold (600) | 64px | 40px | 1.0 | 0 | Black |
| Heading 2 | Heading 2 | Oswald, SemiBold (600) | 40px | 30px | 1.0 | 0 | Teal |
| Heading 3 | Heading 3 (subhead) | Oswald, SemiBold (600) | 30px | 24px | 1.1 | 0 | Teal |
| Heading 4 | Heading 4 | Oswald, SemiBold (600) | 24px | 20px | 1.15 | 0 | Teal |
| Heading 5 | Eyebrow | Oswald, Regular (400) | 14px | 14px | 1.2 | 0.3em (30%) | Black |
| Heading 6 | Big stat | Oswald, Bold (700) | 72px | 48px | 1.0 | 0 | Teal |
| Paragraph 1 | Paragraph large | Lato, Regular (400) | 20px | 18px | 1.5 | 0 | Black |
| Paragraph 2 | Paragraph | Lato, Regular (400) | 17px | 16px | 1.5 | 0 | Black |
| Paragraph 3 | Paragraph small | Lato, Regular (400) | 14px | 14px | 1.5 | 0 | Black |

If the style panel only offers a **Bold** switch rather than a weight list, pick **Oswald
SemiBold** from the font list for the headings if it is there (uploaded or built in), and turn Bold
off. If line spacing is in pixels, use the pixel values from the Wix Editor notes above. Studio,
like the Wix Editor, has no capitals setting in Site Styles: type headings, eyebrows and button
labels in capitals, or add the short CSS in Part 4 so Wix does it for you.

#### Step 4: Style your buttons

Site Styles does not include buttons yet (Wix lists it as a feature request). You have two
options:

- **Recommended: use the button CSS in Part 4.** It styles every button on the site in one go and
  keeps them consistent.
- **Without code:** select a button, click **Open Inspector**, and under **Design** set the same
  values as the Wix Editor button in Step 4 above: Teal fill, a 2px Teal border, White Oswald
  SemiBold 16px text in capitals, no shadow, corners of `100`, padding of about 14px by 28px, and a
  hover that clears the fill to a Teal outline with Teal text. Then copy and paste that button
  wherever you need one.

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
4. Resize it by dragging a corner, never a side, so it keeps its shape. Keep it at least 24px tall
   (160px wide). About 32px tall is a good header size.
5. Leave clear space around it equal to the height of the "M" in the MASSCHALLENGE wordmark, on
   every side. No text, edge or other image inside that space. Align it to a corner or the top
   edge of the header.
6. Link it to the home page: select the logo, click the link icon, choose **Page**, then **Home**.
7. Give it alt text (the description screen readers read out) of `MassChallenge`. In the Wix
   Editor this is in the image **Settings**. In Studio it is in the **Inspector**.

If your header is Navy, Black, Deep Teal or a dark photo, use
`masschallenge-logo-horizontal-white.png` instead. Never place the full color logo on a dark color.

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

A MassChallenge page alternates dark sections (Navy, Black or Deep Teal) with light ones (White or
Warm White). Stack them so neighboring sections differ: dark, then light, then dark.

### Make the sections

**White section:**

- **Wix Editor:** right-click the section (or click a strip) and choose **Change Background**.
  Under **Color**, pick White `#FFFFFF`.
- **Wix Studio:** select the section, click **Open Inspector**, click the color box under
  **Design** and pick Color 1 (White).

**Warm White section:**

- The same steps, with Warm White `#F8F8F5`. In Studio it is Color 2.

**Light section with an angled edge** (Wix Studio):

- Set the background to a **Gradient** in the same color box: a linear gradient at 174 degrees,
  White `#FFFFFF` up to 40% and Light tint `#F3FAFC` from 40%. Put the two stops at the same point,
  so the edge is sharp. Use a Teal headline and a Teal primary button in it.

**Navy, Black or Deep Teal section:**

1. Set the background to Navy `#10263F`, Black `#222222` or Deep Teal `#004F73` the same way.
2. Set every heading and paragraph in it to White `#FFFFFF`: select the text and change its color.
3. Use Cyan `#54EEFF` for accents and links, such as the payoff of a two toned headline. Never put
   Teal `#00708E` text on a dark section.
4. Use the white logo if the logo appears here.
5. Style the buttons as described in "Buttons on dark sections" below.

**The notch.** Mark the change from one section to the next with a small triangle that points down
from the section above, centered on the edge, in that section's color. Add a **Shape** (a triangle
pointing down) from **Add Elements**, color it to match the section above, about 48px wide and
24px tall, and place it centered on the edge between the two sections. Attach it to the section
above so it moves with it.

**White cards.** On a dark section, add a **Container** (Wix Editor: a **Box**) with a White fill,
square corners (0) and a Teal Heading 3 title and a Black paragraph inside.

**Numbered blocks.** A Container with a 6px Black top border only, then a number such as 01 in
Heading 2 (Teal), a Heading 3 title and a Paragraph 2.

**Hero with a photo.** Set the section background to an image chosen by the
[images guide](../images.md#brand-photography), then add the overlay: in the background settings,
turn on **Overlay** (or **Color overlay**) and choose a gradient from Navy black `#051925` on the
text side to Ocean `#037AA6` on the subject side, at 15 to 30% opacity. Warm light should still
glow through. Put text only on a calm area of the photo; otherwise set it on a solid Navy, Black or
Deep Teal Container.

In Studio, a section's background can differ by breakpoint. Check the mobile view to make sure it
stayed the same.

### Section spacing and width

- Give each section about 96px of empty space above and below its content on desktop and 64px on
  mobile.
- Make paragraph text boxes about 720px wide, so lines run to roughly 68 characters. Drag the side
  of the text box, or set the width in Studio's Inspector.
- Keep images and cards square cornered: select the image, open its design settings, and set
  **Corners** to 0. Only buttons are rounded.
- Leave generous margins. When in doubt, add space.

### Add the eyebrow and the headline

1. Add a text box with the **Heading 5** style for the eyebrow, a few words in capitals above the
   headline.
2. Add a text box and choose the **Heading 1** style from the text style drop-down (in the Wix
   Editor, click **Edit Text**, then the **Styles** drop-down).
3. Type the headline in capitals, unless you added the CSS from Part 4 in Studio, in which case
   type it in sentence case.
4. For a two toned headline, select the payoff words and color them Teal `#00708E` on light
   sections or Cyan `#54EEFF` on dark ones.
5. Use one Heading 1 per page, at the top. Use Heading 2 and Heading 3 for everything below it,
   in order: it helps search engines and people using screen readers.

### Add primary and secondary buttons

- Copy and paste your saved primary button for the main action on a section, such as Apply now.
- Use the secondary button (a Teal outline) for the second action next to it, such as Learn more.
- Give each section one primary button at most.
- Write labels in capitals, starting with a verb (in sentence case if you added the Part 4 CSS).
  For a "see all" link you can end the label with an arrow (→).

### Buttons on dark sections

A solid Teal button is too dark for a dark section, so buttons there are outlines:

- **Regular:** fill opacity 0%, a 2px Cyan `#54EEFF` border, text White `#FFFFFF`.
- **Hover:** fill Teal `#00708E`, border Teal, text White.
- Same pill shape and padding as the other buttons.

Style one, then copy it for every dark section. In Studio, the Part 4 CSS does this for you.

### Build a sample home page

1. **Opening (Navy, with a photo and the hero overlay):** an eyebrow, a Heading 1 headline, one
   Paragraph 1 line under it, and a Cyan outline button. A Navy notch below it.
2. **What you offer (White, angled in Studio):** a Heading 2, a Paragraph 2 of two or three
   sentences, and three numbered blocks.
3. **Proof (Navy):** a Heading 2 and three white cards with an image (square corners), a Heading 3
   and a short Paragraph 2 each. A Navy notch below it.
4. **Call to action (Warm White):** a Heading 2, one line of Paragraph 1, a primary button and a
   secondary button side by side.
5. **Footer (Black):** the white logo, links in Cyan and small print in Paragraph 3, in White.

## Part 4: Custom CSS (optional, Wix Studio)

**Skip this part unless you need it.** The settings above get you nearly all the way. CSS (the
code language that styles web pages) fixes two things Studio's settings cannot:

1. **Capital letters on headings, eyebrows and buttons.** Site Styles has no capitals setting, so
   without CSS you have to type them in capitals.
2. **One button style for the whole site.** Site Styles has no button styles, so without CSS you
   style every button by hand.

**Which editors.** Wix's developer documentation describes this CSS feature for Wix Studio. Some of
Wix's pages also mention the Wix Editor, but in practice the CSS option does not appear for most
Wix Editor sites. If you use the Wix Editor and do not see **global.css** in the steps below, skip
to Part 5, or simply keep typing headings in capitals and copying your saved buttons.

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

### Snippet 1: headings in capitals

This works with a custom class, a label you attach to one element so the CSS can find it.

1. Paste this into `global.css`:

   ```css
   /* Propellant website styles: see github.com/masschallenge/propellant-web */
   .propellant-headline,
   .propellant-headline .rich-text__text {
     text-transform: uppercase;
   }

   .propellant-eyebrow,
   .propellant-eyebrow .rich-text__text {
     text-transform: uppercase;
     letter-spacing: 0.3em;
   }
   ```

2. Select a heading text box. Keep the code panel open, and under **CSS Classes**, type
   `propellant-headline` in the **Custom classes** field. Give eyebrows `propellant-eyebrow`.
3. Now type the text in normal sentence case. It shows in capitals on the page, and screen readers
   read it as normal words.

### Snippet 2: every button as a Propellant pill

This uses `.button`, the class Wix gives every button, so it styles all of them at once.

```css
/* Propellant website styles: see github.com/masschallenge/propellant-web */
.button {
  border: 2px solid #00708e;
  border-radius: 999px;
  box-shadow: none;
  padding: 14px 28px;
  background-color: #00708e;
}

.button:hover {
  background-color: transparent;
}

.button__label {
  font-family: "Oswald", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
}

.button:hover .button__label {
  color: #00708e;
}

.button.propellant-button-secondary {
  background-color: transparent;
}

.button.propellant-button-secondary:hover {
  background-color: #00708e;
}

.propellant-button-secondary .button__label {
  color: #00708e;
}

.propellant-button-secondary:hover .button__label {
  color: #ffffff;
}

.propellant-dark-section .button {
  background-color: transparent;
  border-color: #54eeff;
}

.propellant-dark-section .button:hover {
  background-color: #00708e;
  border-color: #00708e;
}

.propellant-dark-section .button__label,
.propellant-dark-section .button:hover .button__label {
  color: #ffffff;
}
```

Then add classes where you need the variations:

- **Secondary button:** select the button and type `propellant-button-secondary` under
  **Custom classes**.
- **Navy, Black or Deep Teal section:** select the section and type `propellant-dark-section`
  under **Custom classes**. Every button inside it turns into a Cyan outline that fills with Teal
  on hover. You still set the section's background and White text in the Inspector, as in Part 3.

The class names `.button`, `.button__label`, `.rich-text` and `.rich-text__text` come from Wix's own
documentation, which says only documented class names stay stable. Do not change them to other
names you find in the page.

### Check and remove

- Preview the site and check that buttons are pills in Oswald capitals and the headings are in
  capitals.
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
| `propellant-headline` | Heading 1 from the spec: the headline, in Oswald SemiBold capitals. |
| `propellant-eyebrow` | The tracked Oswald eyebrow above a headline. |
| `propellant-title-1`, `propellant-subhead`, `propellant-title-3` | Heading 2, Heading 3 and Heading 4 from the spec. |
| `propellant-body` | Paragraph from the spec. |
| `propellant-caption` | Paragraph small, in Slate, for dates and notes. |
| `propellant-text` | Body font and text color for a whole section. |
| `propellant-link` | An underlined link: Teal on light, Cyan on dark. |
| `propellant-section-navy`, `propellant-section-black`, `propellant-section-deep-teal` | A dark section with White text. |
| `propellant-section-warm-white`, `propellant-section-angled` | A light section, plain or with the angled tint. |
| `propellant-notch` | The notch below a section. |
| `propellant-card` | A white card with square corners. |

The stylesheet also loads Lato and Oswald for you. Wix adds a custom class to the outer edge of an
element, while Wix's own styling sits on the parts inside it (such as a button's label). If a
class does not seem to change something on the published site, use the Part 4 snippets instead,
which aim at Wix's own documented inner classes.

**To remove it later:** go back to **Settings**, **Custom Code**, find **Propellant stylesheet**,
open its menu and delete it, then publish.

## Check your work

On desktop:

- [ ] Headings, eyebrows and buttons are Oswald, in capitals. Paragraphs are Lato in Black
      `#222222`, in sentence case.
- [ ] Heading 1 is 64px, Heading 2 is 40px, paragraphs are 17px with a line height of 1.5.
- [ ] Primary buttons are Teal pills with White Oswald text, and clear to a Teal outline on hover.
- [ ] Secondary buttons are Teal outlines that fill with Teal on hover.
- [ ] Dark sections have White text, Cyan accents and Cyan outline buttons, and no Teal text.
- [ ] Dark and light sections alternate, with about 96px of space above and below and a notch where
      they meet.
- [ ] Images and cards have square corners.
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
- **A heading looks too heavy or too thin.** The wrong Oswald weight is selected. Pick **Oswald
  SemiBold** (weight 600), and make sure Bold is off for Headings 1 to 4.
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
