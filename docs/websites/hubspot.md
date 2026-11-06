# HubSpot

This guide takes a HubSpot website or landing page (Content Hub) from its default look to the
MassChallenge look: Lato and Oswald type, the teal palette, pill buttons, and White, Mist and Deep
teal sections. Almost all of it happens in HubSpot's theme settings, with no code. Plan on about an
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

- https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/assets/logos/masschallenge-logo-horizontal-color.png
  (the main logo, for White and Mist backgrounds)
- https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/assets/logos/masschallenge-logo-horizontal-white.png
  (for Deep teal backgrounds)
- https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/assets/logos/masschallenge-logo-monogram-color.png
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
   | Primary | Teal | `#065E6F` |
   | Secondary | Deep teal | `#044451` |
   | Accent 1 | Bright teal | `#0FACBD` |
   | Accent 2 | Pale teal | `#D9F6FA` |
   | Accent 3 | Mist | `#F3F6F7` |
   | Additional | Ink | `#1E282B` |
   | Additional | Slate | `#4B575B` |
   | Additional | Line | `#DBE1E3` |
   | Additional | Yellow | `#FFC801` |
   | Additional | Magenta | `#A30253` |

   Click **Add** to make each additional color. Click **Save**.

4. In the **Fonts** section, click **Edit** next to each font and pick **Lato** for the main or
   body font and **Oswald** for the heading or display font, then save. Your account may label
   these two fonts differently; the rule is Lato for everything, Oswald for the big headline only.
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
| Base color 2 | Mist | `#F3F6F7` | Alternate background (Light section 2) |
| Base color 3 | Ink | `#1E282B` | Text and headings |
| Accent color 1 | Pale teal | `#D9F6FA` | Tinted background (Light section 3) |
| Accent color 2 | Bright teal | `#0FACBD` | Accents on dark sections |
| Accent color 3 | Teal | `#065E6F` | Buttons and links |

### Step 4: Set the section colors

Still in **Colors**, open **More settings**, then **Sections**. Use **Choose section to edit** to
switch between the four section types, and enter these values for each:

| Setting | Light section 1 | Light section 2 | Light section 3 | Dark section 1 |
| --- | --- | --- | --- | --- |
| Section background color | White `#FFFFFF` | Mist `#F3F6F7` | Pale teal `#D9F6FA` | Deep teal `#044451` |
| Default text color | Ink `#1E282B` | Ink `#1E282B` | Ink `#1E282B` | White `#FFFFFF` |
| Accent text color | Teal `#065E6F` | Teal `#065E6F` | Teal `#065E6F` | Bright teal `#0FACBD` |
| Caption text color | Slate `#4B575B` | Slate `#4B575B` | Slate `#4B575B` | White `#FFFFFF` |
| Link colors | Primary | Primary | Primary | Secondary |

Elevate's Dark section 1 starts out using Base color 3 (now Ink) as its background, so change its
background to Deep teal here. Never put Teal text on Deep teal.

### Step 5: Set the fonts and text styles

Open **Foundation**, then **Fonts**.

1. Set **Base font** to **Lato**. Every heading and paragraph starts from this font.
2. Open **Font elements**, then **Headings** and **Body**, and set each style:

   | Elevate setting | Spec style | Font | Weight | Size |
   | --- | --- | --- | --- | --- |
   | Heading 1 (H1) | Heading 1 | Oswald | 500 (Medium) | 64px |
   | Heading 2 (H2) | Heading 2 | Lato | 700 (Bold) | 40px |
   | Heading 3 (H3) | Heading 3 | Lato | 700 (Bold) | 30px |
   | Heading 4 (H4) | Heading 4 | Lato | 700 (Bold) | 24px |
   | Paragraph | Paragraph | Lato | 400 (Regular) | 17px |

3. Under **Other elements**, open **Caption** and set it to Lato, 400 (Regular), 14px, and set
   **Case** to **None** (Elevate's captions start in capitals, and the spec keeps them in sentence
   case).
4. Leave Heading 5, Heading 6 and Block quote alone. The spec does not use them.

Elevate's font settings have no line height, letter spacing or capitals option for headings.
Headings get a line height of 1.2 and paragraphs 1.55, which is close to the spec. The one thing
you will notice is Heading 1: to show it in capitals, you can either type the headline in capitals
or add the small snippet in Part 4. We recommend the snippet: you keep typing headlines in
sentence case, and the capitals come from the style, which is how the brand works everywhere else.

### Step 6: Set the buttons

Open **Elements**, then **Buttons**. Elevate has four button styles. Use three of them:

| Setting | Primary button | Secondary button | Accent button (for Deep teal sections) |
| --- | --- | --- | --- |
| Background | Filled | Filled | Filled |
| Shape | pill | pill | pill |
| Border | 0px | 0px | 0px |
| Default state: Fill color | Teal `#065E6F` | Pale teal `#D9F6FA` | White `#FFFFFF` |
| Default state: Border color | Teal `#065E6F` | Pale teal `#D9F6FA` | White `#FFFFFF` |
| Default state: Text color | White `#FFFFFF` | Teal `#065E6F` | Deep teal `#044451` |
| Hover state: Fill color | Deep teal `#044451` | `#C4EEF4` | Pale teal `#D9F6FA` |
| Hover state: Border color | Deep teal `#044451` | `#C4EEF4` | Pale teal `#D9F6FA` |
| Hover state: Text color | White `#FFFFFF` | Teal `#065E6F` | Deep teal `#044451` |
| Text: Font | Lato, 700 (Bold), 16px | Lato, 700 (Bold), 16px | Lato, 700 (Bold), 16px |

Notes:

- The border color matches the fill so the button looks borderless even if someone later adds a
  border width.
- Elevate's primary button text starts out using Base color 2, which is now Mist, so set it to
  White explicitly.
- Leave the **Tertiary button** unused. If you want it tidy, give it the same values as the
  Secondary button.
- Elevate has no separate corner radius number: **pill** gives fully rounded ends, which is what
  the spec asks for. Other themes may show a **Corner radius** field instead; set it to a large
  number such as 100px for a pill.
- When you add a button to a page, pick **Medium** for **Button size**. Elevate does not show the
  exact padding, so compare it by eye with the spec (about 14px top and bottom, 28px left and
  right).

Type every button label in sentence case, such as Apply now. The spec has no capitals on buttons.

### Step 7: Set links, forms and cards

1. **Links, Primary links.** Default state: Text color Teal `#065E6F`, turn on **Show underline**,
   Underline color Teal `#065E6F`. Hover state: Text color Deep teal `#044451`, Show underline on,
   Underline color Deep teal `#044451`.
2. **Links, Secondary links** (used on Deep teal sections). Default state: Text color White
   `#FFFFFF`, Show underline on, Underline color Bright teal `#0FACBD`. Hover state: Text color
   White `#FFFFFF`, Show underline on, Underline color White `#FFFFFF`.
3. **Forms.** Set the field border color and the form border color to Line `#DBE1E3`, and the
   label text color and input text color to Ink `#1E282B`.
4. **Cards.** For each card variant you use, set **Card shape** to **Rounded** and the border
   color to Line `#DBE1E3`. Elevate's rounded corners are not a number you can type, so they may
   not be exactly the spec's 12px. That is fine.
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
header, and look at its **Logo** field. If your header has a Deep teal background, change that one
header's logo to `masschallenge-logo-horizontal-white.png`.

Keep the logo at least 24px tall, and leave clear space around it of half its height. If the header
is so small that the horizontal logo would drop below 24px, use the monogram instead.

### The site icon (favicon)

The favicon is the small icon in the browser tab.

1. In the same **Brand Kit** tab, click **Add Favicon +**.
2. Upload `masschallenge-logo-monogram-color.png`.
3. Name it **MassChallenge monogram**, choose **Yes** to make it the default, and click **Save**.

The favicon only applies to pages hosted on HubSpot.

## Part 3: Build on brand pages

Everything below uses the drag and drop editor. Each page is made of **sections**, which hold
**rows**, which hold **columns** of **modules** (Heading, Rich text, Button, Image and so on).

### Make a White, Mist or Deep teal section

1. In the page editor, click the section you want to style. (Hover over the section and click its
   edge, or click its name in the **Contents** tab of the left sidebar.)
2. Open the **Styles** tab in the sidebar.
3. Under **Background**, choose **Color** and enter the hex code:
   - White section: `#FFFFFF`
   - Mist section: `#F3F6F7`
   - Deep teal section: `#044451`
4. Under **Alignment and spacing**, set the top and bottom padding to **96px**.
5. Click the **mobile** icon at the top of the editor, select the same section, and set the top and
   bottom padding to **64px**. Changes you make in the mobile view only apply to phones.

Rows and columns have their own background settings too. Keep backgrounds on the section, so the
whole band changes color edge to edge.

**Text inside a Deep teal section.** For each Heading or Rich text module in the section, open its
**Styles** tab and set **Text color** to **Dark section text color**. That gives you White text,
Bright teal accents and the White secondary links you set in Part 1. On White and Mist sections,
leave it on **Light section 1 text color** (or Light section 2).

Alternate White and Mist sections down the page, and save Deep teal for one or two strong moments,
such as the opening band or a final call to action.

### Add the Heading 1 headline

1. Drag a **Heading** module into the top section.
2. Type the headline in sentence case, for example: Build what comes next.
3. Set **Semantic heading level** to **Heading 1**. This tells search engines and screen readers it
   is the main headline.
4. In the **Styles** tab, set **Heading style** to **Heading 1**.

Use one Heading 1 per page. Use Heading 2 for each section title below it.

### Add buttons

1. Drag a **Button** module into a column.
2. Enter the **Button text** in sentence case and choose the **Link**.
3. In the **Styles** tab, set **Button style**:
   - **Primary** for the main action on a White or Mist section.
   - **Secondary** for a second, quieter action next to it.
   - **Accent** for any button on a Deep teal section (White with Deep teal text).
4. Set **Button size** to **Medium**.

### Build a sample home page

1. **Opening band.** A Deep teal section. Add a Heading module (Heading 1, Dark section text color)
   and a Rich text paragraph below it, also on Dark section text color. Add a Button module with
   the Accent style.
2. **What we do.** A White section. A Heading 2, a paragraph of no more than about 720px wide (set
   the column narrower, or use a two column row and leave one empty), and a Primary button.
3. **Three cards.** A Mist section with a row of three columns, each with an image, a Heading 3 and
   a short paragraph.
4. **Final call to action.** A White section with a Heading 2, a Primary button and a Secondary
   button side by side.
5. Click the mobile icon and check each section before you publish.

## Part 4: Custom CSS (optional, only what settings cannot do)

You can stop at Part 3. Add code only if you want these four things, which Elevate's settings
cannot do:

- **Heading 1 in capitals** with 1% letter spacing and a line height of 1.0. Elevate has no case,
  letter spacing or line height setting for headings.
- **Exact phone sizes** for Heading 1, Heading 2, Heading 4 and paragraphs. Elevate only shrinks
  headings by a fixed 80%.
- **Exact line heights** for Heading 2 (1.15), Heading 4 (1.25) and paragraphs (1.6).

The snippet targets Elevate's own heading tags and its `hs-elevate-h1` style names, so it only
touches headings and body text.

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
     body h1,
     body .hs-elevate-h1 {
       text-transform: uppercase;
       letter-spacing: 0.01em;
       line-height: 1;
     }
     body h2,
     body .hs-elevate-h2 {
       line-height: 1.15;
     }
     body h4,
     body .hs-elevate-h4 {
       line-height: 1.25;
     }
     html body {
       line-height: 1.6;
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
capitals and the 40px phone size), `propellant-title-1`, `propellant-title-2` and
`propellant-title-3` are Heading 2, 3 and 4, `propellant-body` is Paragraph, and
`propellant-caption` is Paragraph small in Slate. To load it, paste this line into Site header
HTML (Option A) on its own, outside any `<style>` tags:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.0.0/dist/website.css"
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

- [ ] Headings and paragraphs are in Lato; only the big Heading 1 is in Oswald.
- [ ] Heading 1 shows in capitals (with the snippet) and every other heading is in sentence case.
- [ ] Body text is Ink, captions are Slate, and links are Teal and underlined.
- [ ] Primary buttons are Teal pills with White text that turn Deep teal on hover.
- [ ] Secondary buttons are Pale teal pills with Teal text.
- [ ] Deep teal sections have White text, White buttons with Deep teal text, and no Teal text.
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
- **Text on a Deep teal section is hard to read.** The module is still on a light text color. Set
  its **Text color** to **Dark section text color**.
- **Primary button text is pale gray instead of White.** Set **Primary button**, **Default state**,
  **Text color** to `#FFFFFF`; Elevate starts it on Base color 2.
- **The snippet does nothing.** Check that you saved the domain you are viewing (or Default
  settings for all domains), that the code sits between `<style>` and `</style>`, and look at the
  published page rather than the editor preview.
- **A theme update changed something.** Open theme settings and compare each value with the
  [spec](../websites.md). Settings are the source of truth; change them there rather than adding
  more code.
