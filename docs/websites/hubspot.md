# HubSpot

This guide takes a HubSpot website or landing page (Content Hub) from its default look to the
MassChallenge look: Oswald headlines and Lato text, the brand palette, pill shaped Oswald buttons,
and dark Navy sections alternating with White and Warm White ones. Almost all of it happens in
HubSpot's theme settings, with no code. Plan on about an
hour for the settings and logo, and a little longer if you also build a sample page.

We wrote the steps for Elevate, HubSpot's current default theme, because most new HubSpot sites
start on it. If your site uses another theme, the same ideas apply, but the setting names will
differ: a theme only shows the settings its developer built in.

## Before you start

**Your plan.** Theme settings, the brand kit, the drag and drop editor and the mobile view are
available on every HubSpot plan, including the free tools. Custom code is different:

| What | Where it lives | Which plans |
| --- | --- | --- |
| Theme settings, brand kit, section styles | The page editor and Marketing, then Brand | All plans |
| Site header HTML (code added to every page) | Settings, Content, Pages | Varies by plan. HubSpot says not every account can edit it. Check your account. |
| A child theme with its own CSS file | Design Manager | All plans. Free tools and Content Hub Starter allow one child theme, Professional five, Enterprise ten. |
| Attaching a stylesheet to a page or a whole domain | Page settings, or Settings, Content, Pages | Marketing Hub Professional or Enterprise, and not for most theme templates (see Part 4) |

**Your permissions.** To change the brand kit you need to be a Super Admin or have the Edit account
defaults permission. To change site wide code you need the Website settings permission.

**Keep the spec open.** Every value in this guide comes from the
[website spec](../websites.md). Keep it open in another tab so you can copy hex codes from it.

**Download the logo files.** Save these from our logo folder to your computer:

- https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-color.png
  (the main logo, for White and Warm White backgrounds)
- https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-white.png
  (for Navy, Black and Deep Teal backgrounds)
- https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-monogram-color.png
  (the MC monogram, for the site icon)

The monogram also comes in `-white` and `-black` versions. Read the
[logo rules](../brand.md#logo) before you place it: never stretch, recolor or redraw it.

## How HubSpot's style settings fit together

HubSpot has two places for your look, and it helps to know what each one does.

- **The brand kit** (Marketing, then Brand) holds your logo, site icon, brand colors and brand
  fonts. HubSpot uses these across its tools: the logo fills the header, and the colors show up as
  swatches in every color picker.
- **Theme settings** decide how your pages actually look: the fonts for each heading, the colors of
  each section type, and the shape and colors of each button. A change here updates every page that
  uses the theme.

**Which one wins.** Your theme settings decide what visitors see. A theme can use the brand kit
values as its starting point, but once you set a value in theme settings, that value is what the
page shows. Elevate's colors and fonts do not follow the brand kit at all, so set them in both
places: the brand kit for the swatches and the logo, theme settings for the pages. And if one page
looks different from the rest, check that page's own styles, because a style set on a single page
or module beats the theme.

**How Elevate handles color.** Elevate has six palette colors (three base colors and three accent
colors) and four section types: Light section 1, Light section 2, Light section 3 and Dark section 1.
Each section type has its own background, text, caption and link colors. Modules such as Heading
then have a Text color option that picks which section type's colors to use.

## Part 1: Set up site styles (no code)

### Step 1: Fill in the brand kit

1. Click **More** in the top bar, then go to **Marketing**, then **Brand**. (If you do not see
   More, go straight to Marketing, then Brand.)
2. Stay on the **Brand Kit** tab.
3. Under brand colors, click **Edit Colors** and enter these hex codes in each box:

   | Brand kit slot | Spec color | Hex |
   | --- | --- | --- |
   | Primary | Teal | `#00708E` |
   | Secondary | Navy | `#10263F` |
   | Accent 1 | Cyan | `#54EEFF` |
   | Accent 2 | Deep Teal | `#004F73` |
   | Accent 3 | Warm White | `#F8F8F5` |
   | Additional | Black | `#222222` |
   | Additional | Light tint | `#F3FAFC` |
   | Additional | MC Blue | `#0EABBC` |
   | Additional | Slate | `#4B575B` |
   | Additional | Line | `#DBE1E3` |
   | Additional | Yellow | `#FFC801` |
   | Additional | Error | `#BF0261` |

   Click **Add** to make each additional color. Click **Save**.

4. In the **Fonts** section, click **Edit** next to each font and pick **Lato** for the main or
   body font and **Oswald** for the heading or display font, then save. Your account may label
   these two fonts differently; the rule is Oswald for headlines, eyebrows, subheads and buttons,
   and Lato for reading text.
5. Leave this tab open. You will add the logo here in Part 2.

### Step 2: Open the theme settings

You can reach theme settings from any page that uses your theme.

1. Go to **Content**, then **Website Pages** (or **Landing Pages**), and click the name of any
   page to open the editor.
2. Open the theme settings in one of two ways:
   - Click the **Global theme styles** icon in the left sidebar (pages only), or
   - Click the **Edit** menu in the toolbar and choose **Theme**.
3. You will see groups you can expand. In Elevate they are under **Foundation** (Fonts and Colors)
   and **Elements** (Buttons, Links, Forms, Cards and Tags).

You can also get here from the brand kit: next to your active theme, click **Edit / Preview**.

Nothing goes live until you click **Publish theme** (or **Publish** in the universal editor), and
publishing updates every page that uses the theme.

### Step 3: Set the palette colors

Open **Foundation**, then **Colors**. Enter these:

| Elevate setting | Spec color | Hex | What Elevate uses it for |
| --- | --- | --- | --- |
| Base color 1 | White | `#FFFFFF` | Page background (Light section 1) |
| Base color 2 | Warm White | `#F8F8F5` | Alternate background (Light section 2) |
| Base color 3 | Black | `#222222` | Text |
| Accent color 1 | Light tint | `#F3FAFC` | Tinted background (Light section 3) |
| Accent color 2 | Cyan | `#54EEFF` | Accents on dark sections |
| Accent color 3 | Teal | `#00708E` | Headings, buttons and links on light |

### Step 4: Set the section colors

Still in **Colors**, open **More settings**, then **Sections**. Use **Choose section to edit** to
switch between the four section types, and enter these values for each:

| Setting | Light section 1 | Light section 2 | Light section 3 | Dark section 1 |
| --- | --- | --- | --- | --- |
| Section background color | White `#FFFFFF` | Warm White `#F8F8F5` | Light tint `#F3FAFC` | Navy `#10263F` |
| Default text color | Black `#222222` | Black `#222222` | Black `#222222` | White `#FFFFFF` |
| Accent text color | Teal `#00708E` | Teal `#00708E` | Teal `#00708E` | Cyan `#54EEFF` |
| Caption text color | Slate `#4B575B` | Slate `#4B575B` | Slate `#4B575B` | White `#FFFFFF` |
| Link colors | Primary | Primary | Primary | Secondary |

Elevate's Dark section 1 starts out using Base color 3 (now Black) as its background, so change its
background to Navy here. Navy is the main dark section. For a Black or Deep Teal section, use Dark
section 1 and change only that section's background (Part 3). Never put Teal text on a dark
section.

### Step 5: Set the fonts and text styles

Open **Foundation**, then **Fonts**.

1. Set **Base font** to **Lato**. Every paragraph starts from this font.
2. Open **Font elements**, then **Headings** and **Body**, and set each style:

   | Elevate setting | Spec style | Font | Weight | Size | Color |
   | --- | --- | --- | --- | --- | --- |
   | Heading 1 (H1) | Heading 1 (the headline) | Oswald | 600 (SemiBold) | 64px | Default text color |
   | Heading 2 (H2) | Heading 2 | Oswald | 600 (SemiBold) | 40px | Accent text color |
   | Heading 3 (H3) | Heading 3 (subhead) | Oswald | 600 (SemiBold) | 30px | Accent text color |
   | Heading 4 (H4) | Heading 4 | Oswald | 600 (SemiBold) | 24px | Accent text color |
   | Heading 5 (H5) | Eyebrow | Oswald | 400 (Regular) | 14px | Default text color |
   | Paragraph | Paragraph | Lato | 400 (Regular) | 17px | Default text color |

   If your theme has no color per heading, leave them on the default text color. Headings 2 to 4
   are Teal in the spec, but Black still reads well.

3. Under **Other elements**, open **Caption** and set it to Lato, 400 (Regular), 14px, and set
   **Case** to **None** (Elevate's captions start in capitals, and the spec keeps reading text in
   sentence case).
4. Leave Heading 6 and Block quote alone. The spec does not use them. Heading 5 becomes the eyebrow,
   the small label above a headline, once the Part 4 snippet adds its capitals and letter spacing.

Elevate's font settings have no line height, letter spacing or capitals option for headings.
Headings get a line height of 1.2 and paragraphs 1.55, which is close to the spec. The thing you
will notice is the capitals: every heading, eyebrow and button is in capitals in the spec. You can
either type them in capitals or add the small snippet in Part 4. We recommend the snippet: you keep
typing in sentence case, and the capitals come from the style, which is how the brand works
everywhere else and what screen readers expect.

### Step 6: Set the buttons

Open **Elements**, then **Buttons**. Elevate has four button styles. Use three of them:

| Setting | Primary button | Secondary button | Accent button (for dark sections) |
| --- | --- | --- | --- |
| Background | Filled | Outline, or Filled if there is no Outline | Outline, or Filled if there is no Outline |
| Shape | pill | pill | pill |
| Border | 2px | 2px | 2px |
| Default state: Fill color | Teal `#00708E` | White `#FFFFFF` (if Filled) | Navy `#10263F` (if Filled) |
| Default state: Border color | Teal `#00708E` | Teal `#00708E` | Cyan `#54EEFF` |
| Default state: Text color | White `#FFFFFF` | Teal `#00708E` | White `#FFFFFF` |
| Hover state: Fill color | White `#FFFFFF` | Teal `#00708E` | Teal `#00708E` |
| Hover state: Border color | Teal `#00708E` | Teal `#00708E` | Teal `#00708E` |
| Hover state: Text color | Teal `#00708E` | White `#FFFFFF` | White `#FFFFFF` |
| Text: Font | Oswald, 600 (SemiBold), 16px | Oswald, 600 (SemiBold), 16px | Oswald, 600 (SemiBold), 16px |

Notes:

- On light sections the primary button's fill clears to a Teal outline on hover, and the secondary
  button does the opposite. On dark sections the Accent button is a Cyan outline that fills with
  Teal on hover.
- Elevate's primary button text starts out using Base color 2, which is now Warm White, so set it
  to White explicitly.
- Leave the **Tertiary button** unused. If you want it tidy, give it the same values as the
  Secondary button.
- Elevate has no separate corner radius number: **pill** gives fully rounded ends, which is what
  the spec asks for. Other themes may show a **Corner radius** field instead; set it to a large
  number such as 100px for a pill. Never use square corners: square cornered buttons are retired.
- When you add a button to a page, pick **Medium** for **Button size**. Elevate does not show the
  exact padding, so compare it by eye with the spec (about 14px top and bottom, 28px left and
  right).

Type every button label in sentence case, such as Apply now, and add the Part 4 snippet for the
capitals. Without the snippet, type the label in capitals.

### Step 7: Set links, forms and cards

1. **Links, Primary links.** Default state: Text color Teal `#00708E`, turn on **Show underline**,
   Underline color Teal `#00708E`. Hover state: Text color Deep Teal `#004F73`, Show underline on,
   Underline color Deep Teal `#004F73`.
2. **Links, Secondary links** (used on dark sections). Default state: Text color Cyan `#54EEFF`,
   Show underline on, Underline color Cyan `#54EEFF`. Hover state: Text color White `#FFFFFF`, Show
   underline on, Underline color White `#FFFFFF`.
3. **Forms.** Set the field border color and the form border color to Line `#DBE1E3`, and the
   label text color and input text color to Black `#222222`.
4. **Cards.** For each card variant you use, set **Card shape** to **Square**, the background to
   White `#FFFFFF` and the border color to Line `#DBE1E3`. Cards and photos have square corners.
5. Click **Publish theme**.

### Step 8: Check the mobile sizes

HubSpot's editor has a desktop icon and a mobile icon at the top of the screen. Click the mobile
icon to see the phone layout.

Elevate does not have separate mobile font settings. On screens narrower than about 767px it
shrinks every heading to 80% of its desktop size automatically:

| Style | Desktop (you set) | Elevate on phones | Spec on phones |
| --- | --- | --- | --- |
| Heading 1 | 64px | about 51px | 40px |
| Heading 2 | 40px | 32px | 30px |
| Heading 3 | 30px | 24px | 24px |
| Heading 4 | 24px | about 19px | 20px |
| Paragraph | 17px | 17px | 16px |

Heading 3 is exact and the others are close. If you want the phone sizes to match the spec
exactly, the Part 4 snippet does it. The biggest gap is Heading 1, which can wrap awkwardly on a
phone at 51px.

## Part 2: Add the logo and site icon

### The logo

1. Go back to **Marketing**, then **Brand**, **Brand Kit** tab.
2. Click **Add logo +**, then **Upload**, and choose `masschallenge-logo-horizontal-color.png`.
3. Enter **MassChallenge** as the **Logo name** and **MassChallenge** as the **Logo alt text**
   (the words screen readers say and search engines read).
4. In **Link**, enter your home page address so the logo takes people home.
5. Choose **Yes** to make it the default logo, and click **Save**.

Elevate's site header uses the brand kit logo by default. To check, open any page, click the site
header, and look at its **Logo** field. If your header has a Navy, Black or Deep Teal
background, change that one header's logo to `masschallenge-logo-horizontal-white.png`.

Keep the logo at least 24px tall (160px wide), and leave clear space around it equal to the height
of the "M" in the MASSCHALLENGE wordmark, on every side. Align it to a corner or the top edge of the
header. If the header is so small that the horizontal logo would drop below 24px, use the monogram
instead.

### The site icon (favicon)

The favicon is the small icon in the browser tab.

1. In the same **Brand Kit** tab, click **Add Favicon +**.
2. Upload `masschallenge-logo-monogram-color.png`.
3. Name it **MassChallenge monogram**, choose **Yes** to make it the default, and click **Save**.

The favicon only applies to pages hosted on HubSpot.

## Part 3: Build on brand pages

Everything below uses the drag and drop editor. Each page is made of **sections**, which hold
**rows**, which hold **columns** of **modules** (Heading, Rich text, Button, Image and so on).

### Make a light or dark section

1. In the page editor, click the section you want to style. (Hover over the section and click its
   edge, or click its name in the **Contents** tab of the left sidebar.)
2. Open the **Styles** tab in the sidebar.
3. Under **Background**, choose **Color** and enter the hex code:
   - White section: `#FFFFFF`
   - Warm White section: `#F8F8F5`
   - Navy section: `#10263F`
   - Black section: `#222222`
   - Deep Teal section: `#004F73`
4. Under **Alignment and spacing**, set the top and bottom padding to **96px**.
5. Click the **mobile** icon at the top of the editor, select the same section, and set the top and
   bottom padding to **64px**. Changes you make in the mobile view only apply to phones.

Rows and columns have their own background settings too. Keep backgrounds on the section, so the
whole band changes color edge to edge.

**Text inside a dark section.** For each Heading or Rich text module in a Navy, Black or Deep Teal
section, open its **Styles** tab and set **Text color** to **Dark section text color**. That gives
you White text, Cyan accents and the Cyan secondary links you set in Part 1. On White and Warm
White sections, leave it on **Light section 1 text color** (or Light section 2).

Alternate dark and light sections down the page: a Navy opening, a White or Warm White section, a
Navy section with white cards, and so on. The notch between sections and the angled tint on light
sections need code: the Propellant stylesheet at the end of Part 4 has them.

**Hero with a photo.** Under **Background**, choose **Image** and pick a photo by the
[images guide](../images.md#brand-photography). If your theme offers a background overlay, use a
gradient from Navy black `#051925` on the text side to Ocean `#037AA6` on the subject side, at 15 to
30% opacity. Put text only on a calm area of the photo; otherwise set the section to a solid Navy,
Black or Deep Teal color instead.

**Photos and cards.** Keep image corners square. Use the Card variants you set in Step 7 for white
cards on dark sections.

### Add the eyebrow and the headline

1. Drag a **Heading** module into the top section for the eyebrow. Set **Semantic heading level**
   to **Paragraph** if it is offered (otherwise Heading 5) and **Heading style** to **Heading 5**.
2. Drag a second **Heading** module below it and type the headline in sentence case, for example:
   Build what comes next.
3. Set **Semantic heading level** to **Heading 1**. This tells search engines and screen readers it
   is the main headline.
4. In the **Styles** tab, set **Heading style** to **Heading 1**.
5. For a two toned headline, use a Rich text module instead, select the payoff words, and color
   them Teal `#00708E` on light sections or Cyan `#54EEFF` on dark ones.

Use one Heading 1 per page. Use Heading 2 for each section headline below it, and Heading 3 for card
titles and numbered blocks.

### Add buttons

1. Drag a **Button** module into a column.
2. Enter the **Button text** in sentence case and choose the **Link**.
3. In the **Styles** tab, set **Button style**:
   - **Primary** for the main action on a White or Warm White section.
   - **Secondary** for a second, quieter action next to it.
   - **Accent** for any button on a dark section (a Cyan outline with White text).
4. Set **Button size** to **Medium**.

### Build a sample home page

1. **Opening band.** A Navy section, with a photo if you have a good one. Add the eyebrow, a Heading
   module (Heading 1, Dark section text color) and a Rich text paragraph below it, also on Dark
   section text color. Add a Button module with the Accent style.
2. **What we do.** A Warm White section. A Heading 2, a paragraph of no more than about 720px wide
   (set the column narrower, or use a two column row and leave one empty), and a Primary button.
3. **Three cards.** A Navy section with a row of three columns, each a white card with an image, a
   Heading 3 and a short paragraph.
4. **Final call to action.** A White section with a Heading 2, a Primary button and a Secondary
   button side by side.
5. Click the mobile icon and check each section before you publish.

## Part 4: Custom CSS (optional, only what settings cannot do)

You can stop at Part 3. Add code only if you want these things, which Elevate's settings cannot
do:

- **Capitals** on every heading and button, with a line height of 1.0 on Heading 1 and Heading 2.
  Elevate has no case, letter spacing or line height setting for headings.
- **The eyebrow**: Heading 5 in Oswald Regular with letter spacing of 0.3em.
- **Exact phone sizes** for Heading 1, Heading 2, Heading 4 and paragraphs. Elevate only shrinks
  headings by a fixed 80%.
- **Exact line heights** for Heading 3 (1.1), Heading 4 (1.15) and paragraphs (1.5).

The snippet targets Elevate's own heading tags, its `hs-elevate-h1` style names and its buttons, so
it only touches headings, buttons and body text.

### Option A: Site header HTML (simplest)

This adds the code to the top of every page on a domain. Whether your plan includes it varies, so
look for the field in your account.

1. Click the **settings** icon (the gear) in the top bar.
2. In the left sidebar, go to **Content**, then **Pages**.
3. In **Choose a domain to edit its settings**, pick your website's domain, or **Default settings
   for all domains**.
4. Find **Site header HTML**. (In some accounts it sits on a tab called **Templates**.) If you
   picked one domain and the field is locked, click **Override default settings**.
5. Paste this at the end of whatever is already in the field:

   ```html
   <style>
     /* Propellant website styles: see github.com/masschallenge/propellant-web */
     body :is(h1, h2, h3, h4, h5),
     body :is(.hs-elevate-h1, .hs-elevate-h2, .hs-elevate-h3, .hs-elevate-h4, .hs-elevate-h5),
     body .hs-elevate-button {
       text-transform: uppercase;
     }
     body h1,
     body .hs-elevate-h1,
     body h2,
     body .hs-elevate-h2 {
       line-height: 1;
     }
     body h3,
     body .hs-elevate-h3 {
       line-height: 1.1;
     }
     body h4,
     body .hs-elevate-h4 {
       line-height: 1.15;
     }
     body h5,
     body .hs-elevate-h5 {
       letter-spacing: 0.3em;
     }
     body .hs-elevate-button {
       letter-spacing: 0.05em;
     }
     html body {
       line-height: 1.5;
     }
     @media (max-width: 766px) {
       body h1,
       body .hs-elevate-h1 {
         font-size: 40px;
       }
       body h2,
       body .hs-elevate-h2 {
         font-size: 30px;
       }
       body h4,
       body .hs-elevate-h4 {
         font-size: 20px;
       }
       html body {
         font-size: 16px;
       }
     }
   </style>
   ```

6. Click **Save** in the bottom left.

To see a single page with the code before you add it everywhere, open that page, go to the
**Settings** menu, then **Advanced**, and paste it into **Head HTML** under **Additional code
snippets** instead.

**To remove it later**, open the same field and delete everything from `<style>` to `</style>`,
then save. Leave any other code in the field alone (it is often tracking code someone else added).

### Option B: A child theme

A child theme is a copy of Elevate that keeps getting Elevate's updates, plus an empty CSS file of
its own. Use this if your plan does not include Site header HTML, or if you prefer to keep styles
with the theme.

1. Go to **Content**, then **Design Manager**.
2. Open the **@hubspot** folder, right click the **elevate** folder and choose **Create child
   theme**. (Elevate itself cannot be cloned, so a child theme is the way to change it.)
3. Give it a name, such as MassChallenge, and click **Create child theme**.
4. Open the new theme's CSS file (named `child.css` unless you renamed it) and paste the snippet
   from Option A **without** the `<style>` and `</style>` lines. Click **Publish changes**.
5. Build new pages with the child theme's templates. Existing pages keep their old theme until you
   swap each page's template to the matching child theme template.
6. Open theme settings on a child theme page and check your Part 1 values. The child theme starts
   from Elevate's settings, so you may need to enter them again there.

**To remove it later**, delete the snippet from the CSS file and click **Publish changes**.

### Option C: Attached stylesheets (usually not for Elevate)

HubSpot can also attach a CSS file from the Design Manager to one page (page **Settings**, then
**Advanced**, then **Stylesheets**) or to a whole domain (**Settings**, **Content**, **Pages**,
**CSS & Stylesheets**). Both need Marketing Hub Professional or Enterprise, and neither works on
Elevate's templates: page stylesheets are not available for theme templates, and domain stylesheets
only work on theme templates built to accept them. Use Option A or B instead.

### Using the Propellant stylesheet instead

The [Propellant stylesheet](../websites.md#the-propellant-stylesheet) loads Lato and Oswald and
adds ready made classes that match the spec: `propellant-headline` is Heading 1 (including the
capitals and the 40px phone size), `propellant-eyebrow` is the eyebrow, `propellant-title-1`,
`propellant-subhead` and `propellant-title-3` are Heading 2, 3 and 4, `propellant-body` is
Paragraph, and `propellant-caption` is Paragraph small in Slate. It also has the patterns that
sections cannot do on their own: `propellant-notch` for the notch below a section,
`propellant-section-angled` for the angled tint, and `propellant-hero` for the hero overlay. To load it, paste this line into Site header
HTML (Option A) on its own, outside any `<style>` tags:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css"
/>
```

It only styles elements you give a class to, so it changes nothing on its own. In HubSpot you add a
class by editing the HTML of a Rich text module (its source code view), for example:

```html
<h1 class="propellant-headline">Build what comes next</h1>
```

For most HubSpot sites the theme settings plus the Option A snippet are simpler, because you
keep editing in HubSpot's own modules. For buttons, keep using the Button module with the styles
from Part 1: Elevate styles every plain link on the page, and its link color rule can win over
a `propellant-button` class placed inside a Rich text module. To remove the stylesheet, delete the
`<link ... />` line.

## Check your work

On desktop:

- [ ] Headings, eyebrows and buttons are in Oswald, and paragraphs are in Lato.
- [ ] Headings and buttons show in capitals (with the snippet); paragraphs are in sentence case.
- [ ] Body text is Black, captions are Slate, and links are Teal and underlined on light sections
      and Cyan on dark ones.
- [ ] Primary buttons are Teal pills with White text that clear to a Teal outline on hover.
- [ ] Secondary buttons are Teal outlines with Teal text.
- [ ] Dark sections have White text, Cyan outline buttons, and no Teal text.
- [ ] Dark and light sections alternate down the page.
- [ ] Cards and images have square corners.
- [ ] The full color logo sits in the header and links home; the favicon shows the monogram.

On a phone (use the editor's mobile icon, then check the published page on a real phone):

- [ ] Heading 1 fits without awkward wrapping.
- [ ] Sections have about 64px of space above and below.
- [ ] Buttons are easy to tap and their labels fit on one line.

## If something looks off

- **One page ignores the theme.** That page or module has its own style set. Select the module or
  section, open its **Styles** tab, and clear the override (for example set Background back to
  **None**).
- **Headings are still in the old font.** You changed the brand kit but not the theme. Set the fonts
  in theme settings (Part 1, Step 5) and click **Publish theme**.
- **Text on a dark section is hard to read.** The module is still on a light text color. Set its
  **Text color** to **Dark section text color**.
- **Primary button text is pale gray instead of White.** Set **Primary button**, **Default state**,
  **Text color** to `#FFFFFF`; Elevate starts it on Base color 2.
- **The snippet does nothing.** Check that you saved the domain you are viewing (or Default
  settings for all domains), that the code sits between `<style>` and `</style>`, and look at the
  published page rather than the editor preview.
- **A theme update changed something.** Open theme settings and compare each value with the
  [spec](../websites.md). Settings are the source of truth; change them there rather than adding
  more code.
