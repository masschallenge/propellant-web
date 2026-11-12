# Webflow

Webflow gives you everything you need to build a MassChallenge-style site without writing code.
You store the brand colors, fonts and sizes once as variables, style every heading, paragraph and
link at once, and make a handful of classes for buttons and sections. By the end you will have a
site with the right fonts, colors, Oswald headlines, pill buttons, dark Navy, Black and Deep Teal
sections alternating with White and Warm White ones, the logo and a site icon, and it will look
right on phones too. Plan on about two hours the first time,
most of it in Part 1.

Keep the [website spec](../websites.md) open in another tab while you work. Every value in this
guide comes from it.

## Before you start

**Your plan.** You can do almost all of this guide on any Webflow plan, including the free one:

- Google Fonts, variables, tag styles and classes are part of the Designer (the Webflow editor).
  Webflow says you do not need a paid plan to use Google Fonts.
- Custom code (Part 4, optional) needs a paid Core, Growth, Agency or Freelancer Workspace, or an
  active Site plan on this site. You do not need custom code to follow the spec.
- Publishing to your own domain (such as yourdomain.org) needs a Site plan. Without one you can
  publish to a free `yoursite.webflow.io` address.

**Words you will meet.** Webflow uses a few terms from web design. Here is what they mean:

- **Variable**: a named, saved value, such as a color called Teal. Change it once and everything
  that uses it updates.
- **Tag style**: a style for every element of one kind, such as All H1 Headings. Webflow shows
  tags in pink.
- **Class**: a named style you give to chosen elements, such as a button. Webflow shows classes in
  blue.
- **Combo class**: a second class added after the first, which changes only a few things. A
  secondary button is the primary button class plus a combo class.
- **Breakpoint**: a screen width where your design can change, such as Mobile landscape.

**The logo files.** Download these from our public file store (right click each link, then save):

- Horizontal logo, full color, for White and Warm White backgrounds:
  [masschallenge-logo-horizontal-color.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/logos/masschallenge-logo-horizontal-color.png)
- Horizontal logo, white, for Navy, Black and Deep Teal backgrounds:
  [masschallenge-logo-horizontal-white.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/logos/masschallenge-logo-horizontal-white.png)
- Monogram, full color, for the site icon:
  [masschallenge-logo-monogram-color.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/assets/logos/masschallenge-logo-monogram-color.png)

There are also `-black` versions of both lockups, and a `-white` monogram, at the same address. Use
these files only, never a copy of the logo from somewhere else. The
[brand guidelines](../brand.md) explain when to use each one.

## Part 1: Set up site styles (no code)

This is the heart of the guide. You will do it once, and every page you build afterwards starts
on brand.

### How Webflow styling works

Webflow styles in layers. The **Body (All Pages)** tag sets the defaults for the whole site. Tags
such as **All H1 Headings** and **All Paragraphs** then refine one kind of element. **Classes** sit
on top and change chosen elements, such as buttons and sections. Each layer only overrides what you
set on it, and everything else is inherited from the layer below.

**Variables** sit alongside this. You save each brand value once in the Variables panel and link
styles to it. You can then give a variable a second value for phones (a mode), so the mobile sizes
take care of themselves.

You do all of this in the **Style panel**, the panel on the right of the Designer. At the top of it
is the **Style selector** field, which shows what you are styling: a pink tag, a blue class or a
green state such as Hover.

### Step 1: Add Oswald

Lato is already built into the Webflow Designer, so you only need to add Oswald.

1. Open **Site settings**, then the **Fonts** tab.
2. Under **Google fonts**, choose **Oswald**.
3. Tick the **400** (Regular), **600** (SemiBold) and **700** (Bold) variants. Eyebrows use 400,
   headlines, subheads and buttons 600, and the big stat 700.
4. Click **Add font**.
5. Go back to the Designer and refresh the page in your browser. Oswald now appears in **Style
   panel > Typography > Font**, under Google fonts.

You will not see Lato in the Site settings list. That is expected: Webflow leaves out the Google
fonts it already includes. Lato is in the Font dropdown under Google fonts.

> Webflow notes that its Google Fonts connection sends visitors' IP addresses to Google. If your
> privacy rules do not allow that, download Lato and Oswald from Google Fonts and upload them under
> **Site settings > Fonts > Custom fonts** instead. Everything else in this guide stays the same.

### Step 2: Make a Propellant variable collection

A collection keeps all the brand values together, so the next person can find them.

1. Open the **Variables** panel from the left toolbar of the Designer.
2. Click the **plus** icon next to **Site variables**.
3. Name the collection `Propellant` and click **Create**.

To add each variable below: click **New variable**, choose the type (Color, Size or Font Family),
then hover over the new variable's name and click the settings **cog** to rename it. Type the
name exactly as shown. The part before the slash puts it in a group, so `Colors/Teal` appears as
Teal inside a Colors group. Click the value to set it.

### Step 3: Add the color variables

Create one **Color** variable for each row. This is the spec palette.

| Variable name | Hex | Use it for |
| --- | --- | --- |
| `Colors/White` | `#FFFFFF` | Light section background, text on dark sections |
| `Colors/Warm White` | `#F8F8F5` | Alternate light section background |
| `Colors/Light tint` | `#F3FAFC` | The angled tint on a light section |
| `Colors/Navy` | `#10263F` | Dark section background |
| `Colors/Black` | `#222222` | Body text, and dark section background |
| `Colors/Deep Teal` | `#004F73` | Dark section background |
| `Colors/Teal` | `#00708E` | Headings, links and buttons on light |
| `Colors/Cyan` | `#54EEFF` | Text, links and outlines on dark sections only |
| `Colors/MC Blue` | `#0EABBC` | Graphic shapes only, never text |
| `Colors/Navy black` | `#051925` | The dark end of the hero overlay |
| `Colors/Ocean` | `#037AA6` | Gradient stop only, never a flat fill |
| `Colors/Slate` | `#4B575B` | Secondary text on light, such as captions |
| `Colors/Line` | `#DBE1E3` | Lines and dividers |
| `Colors/Yellow` | `#FFC801` | One warm accent: tags, rules and stats, with Black text |
| `Colors/Error` | `#BF0261` | Form errors only |

If your site already has swatches, Webflow has turned them into color variables. You can leave
them or delete the ones you no longer use.

### Step 4: Add the font variables

Create two **Font Family** variables:

| Variable name | Font |
| --- | --- |
| `Fonts/Body` | Lato |
| `Fonts/Headline` | Oswald |

### Step 5: Add the size variables

Create one **Size** variable for each row, using the **Desktop** value and the px unit. You will add
the Mobile values in the next step.

| Variable name | Desktop | Mobile |
| --- | --- | --- |
| `Type/Heading 1` | 64px | 40px |
| `Type/Heading 2` | 40px | 30px |
| `Type/Heading 3` | 30px | 24px |
| `Type/Heading 4` | 24px | 20px |
| `Type/Eyebrow` | 14px | 14px |
| `Type/Big stat` | 72px | 48px |
| `Type/Paragraph large` | 20px | 18px |
| `Type/Paragraph` | 17px | 16px |
| `Type/Paragraph small` | 14px | 14px |
| `Type/Button` | 16px | 16px |
| `Space/Section` | 96px | 64px |
| `Space/Button vertical` | 14px | 14px |
| `Space/Button horizontal` | 28px | 28px |
| `Layout/Text width` | 720px | 720px |
| `Radius/Pill` | 9999px | 9999px |

`Radius/Pill` is a very large corner radius, which is how a web page draws fully rounded pill
ends. Buttons are the only rounded thing on the site: cards and photos have square corners.
`Layout/Text width` keeps paragraphs to about 68 characters a line.

### Step 6: Add the mobile sizes with a mode

A mode is a second set of values for the same variables. A responsive mode switches on by itself at
a breakpoint, so you link each style once and it shrinks on phones automatically.

1. In the Variables panel, with the Propellant collection open, click the **New mode** dropdown
   arrow.
2. Name the mode `Mobile`.
3. In the **Responsive** dropdown, choose **Mobile landscape**. That covers screens 767px wide and
   below, which includes phones held either way.
4. Click **Create**. Every value starts as a copy of the Base (desktop) value.
5. In the Mobile column, click each value that changes and type the Mobile number from the table
   in Step 5: Heading 1 40px, Heading 2 30px, Heading 3 24px, Heading 4 20px, Big stat 48px,
   Paragraph large 18px, Paragraph 16px and Section 64px. Leave the others as they are.

You will check this on the Mobile portrait breakpoint in "Check your work".

### Step 7: Style the Body (All Pages) tag

These are the defaults every page inherits.

1. Open any page and click the **Body** element in the Navigator (the page structure list on the
   left).
2. In the Style panel, click the **Style selector** field. Under **HTML Tag**, choose **Body (All
   Pages)**.
3. Under **Typography**, set:
   - **Font**: hover over the field, click the purple dot in its top left corner and choose
     `Fonts/Body`. (This purple dot is how you link any field to a variable.)
   - **Weight**: 400 (Normal).
   - **Size**: link to `Type/Paragraph`.
   - **Height** (line height): type `1.5`, then choose the **-** unit so it has no unit. A unitless
     line height grows and shrinks with the text.
   - **Color**: link to `Colors/Black`.
4. Under **Backgrounds**, set **Color** to `Colors/White`.

Set the text color here, on the Body, and not on the paragraph tags. That way a dark section can
switch all its text to White in one place (Part 3).

### Step 8: Style All H1 to All H4 headings

Add a Heading to any page from **Add panel > Typography** so you have one to click. Select it, make
sure it has no class, then open the Style selector field and choose the tag. Set each tag as
below, and link the font and size to the variables shown.

| Tag | Font | Weight | Size | Height | Letter spacing | Letter case |
| --- | --- | --- | --- | --- | --- | --- |
| All H1 Headings | `Fonts/Headline` | 600 (SemiBold) | `Type/Heading 1` | `1` (no unit) | `0` | All capitals |
| All H2 Headings | `Fonts/Headline` | 600 (SemiBold) | `Type/Heading 2` | `1` (no unit) | `0` | All capitals |
| All H3 Headings | `Fonts/Headline` | 600 (SemiBold) | `Type/Heading 3` | `1.1` (no unit) | `0` | All capitals |
| All H4 Headings | `Fonts/Headline` | 600 (SemiBold) | `Type/Heading 4` | `1.15` (no unit) | `0` | All capitals |

To change which heading level you are styling, select the heading and change its level (H1, H2
and so on) in the Settings panel, or add one heading of each level and select each in turn.

For every heading:

- **Letter spacing** and **letter case** are under **More type options** at the bottom of the
  Typography section. Choose the all capitals option (shown as **AA**) for letter case.
- Type headings in sentence case, such as "Founders build here". Webflow turns them into capitals
  for you. Screen readers then read words, not letters.
- If you cannot find the letter case control, use **Style panel > Custom properties** instead:
  click **Add**, type `text-transform` as the name and `uppercase` as the value, and press Enter.

Leave the color empty on All H1 Headings, so the headline inherits Black from the Body (or White
in a dark section). Set **Color** on All H2, All H3 and All H4 Headings to `Colors/Teal`. The dark
section classes in Step 12 turn them White.

### Step 9: Style All Paragraphs and All Links

**All Paragraphs.** Select a paragraph with no class, open the Style selector field and choose
**All Paragraphs**. Set:

- **Size**: link to `Type/Paragraph`.
- **Height**: `1.5` (no unit).
- **Size section > Max W** (maximum width): link to `Layout/Text width`.

**All Links.** Select a text link, open the Style selector field and choose **All Links**. Set:

- **Color**: link to `Colors/Teal`.
- **Decoration**: underline.

Webflow treats buttons as links too, so buttons start out teal and underlined. The button classes
in Step 11 fix that.

**Eyebrow, big stat and headline accent.** Make three more classes the same way:

| Class | On this element | Settings |
| --- | --- | --- |
| `eyebrow` | Paragraph above a headline | Font `Fonts/Headline`, Weight 400, Size `Type/Eyebrow`, Height `1.2`, Letter spacing `0.3em`, All capitals |
| `big-stat` | Paragraph or Heading holding a number | Font `Fonts/Headline`, Weight 700, Size `Type/Big stat`, Height `1`, Color `Colors/Teal` |
| `headline-accent` | A Span around the payoff words of a headline | Color `Colors/Teal` |

To make a span, double click the headline, select the payoff words and click the **+** (wrap in
span) button in the text toolbar.

### Step 10: Make the paragraph size classes

The spec has two more text sizes, so make a class for each. Select a paragraph, click the Style
selector field, type the class name and press Enter. Then set:

| Class | Size | Height | Color |
| --- | --- | --- | --- |
| `paragraph-large` | `Type/Paragraph large` | `1.5` (no unit) | leave empty |
| `paragraph-small` | `Type/Paragraph small` | `1.5` (no unit) | `Colors/Slate` (for captions) |

### Step 11: Make the button classes

You will make one base class for the primary button, then two combo classes for the other button
styles. Webflow buttons come from **Add panel > Links > Button**.

**Primary button: `brand-button`.** Add a Button, click the Style selector field, type
`brand-button` and press Enter. Set:

- **Typography**: Font `Fonts/Headline`, Weight 600 (SemiBold), Size `Type/Button`, Height `1` (no
  unit), Letter spacing `0.05em`, All capitals, Color `Colors/White`, Decoration none (click the
  **X**).
- **Backgrounds**: Color `Colors/Teal`.
- **Spacing**: padding top and bottom `Space/Button vertical`, left and right
  `Space/Button horizontal`.
- **Borders**: Radius `Radius/Pill`, Border 2px solid `Colors/Teal`. No shadow.

Now the hover. Click the dropdown arrow in the Style selector field, choose **Hover** from the
**States** menu (a green Hover label appears), and set **Backgrounds > Color** to transparent and
**Typography > Color** to `Colors/Teal`, so the fill clears to a Teal outline. Choose **None** in
the same menu to go back to the normal state.

**Secondary button: `brand-button` plus `is-secondary`.** Add a second Button. Type
`brand-button`, press Enter, then type `is-secondary` and press Enter. The second class is a combo
class: it starts with everything from `brand-button` and only changes what you set here.

- **Backgrounds**: Color transparent.
- **Typography**: Color `Colors/Teal`.
- **Hover** state: Backgrounds Color `Colors/Teal`, Typography Color `Colors/White`.

**Button on a dark section: `brand-button` plus `is-on-dark`.** Add a third Button, apply
`brand-button`, then the combo class `is-on-dark`:

- **Backgrounds**: Color transparent.
- **Borders**: Color `Colors/Cyan`.
- **Typography**: Color `Colors/White`.
- **Hover** state: Backgrounds Color `Colors/Teal`, Borders Color `Colors/Teal`, Typography Color
  `Colors/White`.

Write button labels in sentence case with a verb, such as "Apply now" or "Meet the startups". The
capitals come from the class. For a "see all" link you can end the label with an arrow (→).

### Step 12: Make the section classes

Sections work the same way: one base class and combo classes for each color.

1. From **Add panel > Structure**, add a **Box**. (In older versions of Webflow, add a **Section**
   instead and skip the next step.)
2. In the **Settings** panel, set the **Tag** to **Section**.
3. Click the Style selector field, type `brand-section` and press Enter. Set:
   - **Spacing**: padding top and bottom `Space/Section`.
   - **Backgrounds**: Color `Colors/White`.
   - **Position**: Relative, so the notch below can sit on its edge.
4. Add sections with `brand-section` plus each combo class below:

| Combo class | Backgrounds | Typography color |
| --- | --- | --- |
| `is-warm-white` | Color `Colors/Warm White` | leave empty |
| `is-angled` | A **Linear gradient** at 174 degrees: `Colors/White` from 0% to 40%, then `Colors/Light tint` from 40% to 100% (two stops at the same place make a sharp edge) | leave empty |
| `is-navy` | Color `Colors/Navy` | `Colors/White` |
| `is-black` | Color `Colors/Black` | `Colors/White` |
| `is-deep-teal` | Color `Colors/Deep Teal` | `Colors/White` |

Headings H2 to H4 are Teal from Step 8, which is too dark for a dark section. Give any heading in a
dark section the class `heading-on-dark` with **Typography > Color** `Colors/White`. In the same
way, use `headline-accent` plus a combo class `is-on-dark`, and `big-stat` plus `is-on-dark`, with
**Typography > Color** `Colors/Cyan`.

**Links on dark sections.** Text links keep their Teal color, and Teal on Navy, Black or Deep Teal
is not allowed. Give any text link inside a dark section the class `link-on-dark` and set its
**Typography > Color** to `Colors/Cyan`.

**The notch.** Alternate dark and light sections down the page, and mark each change with a notch:
a small triangle that points down from one section into the next, in the color of the section
above it.

1. Inside a section, at the end, add a **Div Block** with the class `section-notch`.
2. Set **Position** to Absolute, **Top** 100%, **Left** 50%, **Size** 48px wide and 24px tall,
   **Z-index** 1, and **Transforms > Move** X to -50%.
3. Under **Custom properties**, add `clip-path` with the value `polygon(0 0, 100% 0, 50% 100%)`.
4. Set **Backgrounds > Color** to the section's color, with combo classes such as
   `section-notch is-navy`.

**White cards.** In a dark section, add a Div Block with the class `brand-card`: Backgrounds
`Colors/White`, Typography color `Colors/Black`, padding 24px, Radius 0. Inside it, an H3 for the
title and a paragraph. The title stays Teal from Step 8, so give it no extra class.

**Numbered blocks.** A Div Block with the class `numbered-block`: a 6px solid `Colors/Black` top
border and 16px of top padding. Inside it, a paragraph with the class `numbered-number` (Font
`Fonts/Headline`, Weight 600, Size `Type/Heading 2`, Color `Colors/Teal`), an H3 for the title and
a paragraph.

**Hero with a photo.** A `brand-section is-navy` with two background layers: under **Backgrounds**,
add an **Image** layer with your photo (chosen by the [images guide](../images.md#brand-photography))
set to Cover, then add a **Linear gradient** layer above it, at 90 degrees, from `Colors/Navy black`
at 30% opacity on the text side to `Colors/Ocean` at 15% opacity on the subject side. Warm light
should still glow through; if warm areas turn gray or blue, lower the opacity.

### Step 13: Square images and cards

Select an image, open the Style selector field and choose **All Images**. Set **Borders > Radius**
to 0. Keep the radius at 0 on any card class you make later. Only buttons are rounded.

### Step 14 (only if needed): Mobile without modes

The Mobile mode in Step 6 should handle phone sizes everywhere. If a size does not change on a
phone, set it directly: click the **Mobile landscape** icon in the canvas bar (above the canvas),
select the element, choose the same tag or class in the Style selector, and type the Mobile value
from the table in Step 5. Styles set on Mobile landscape also apply to Mobile portrait.

## Part 2: Add the logo and site icon

### The logo

In Webflow the logo is part of the page, in the navigation bar, rather than a site setting.

1. Open the **Assets** panel in the left toolbar, click the **cloud** icon and upload the
   horizontal color logo (and the white one, for dark sections and the footer).
2. From **Add panel > Other**, drag a **Navbar** to the top of your page.
3. Drag the color logo from the Assets panel into the Navbar's **Brand** link.
4. Select the logo image and set **Style panel > Size > Height** to `32px`, with width left on
   Auto so the proportions stay right. Never go below 24px tall (160px wide); on very small spaces
   use the monogram instead.
5. In the image's settings, set the alt text (the description screen readers announce) to
   `MassChallenge`.
6. Select the Brand link, open **Settings panel > Link settings**, choose **Page** and pick your
   home page.

Keep clear space around the logo equal to the height of the "M" in the MASSCHALLENGE wordmark, on
every side, and align it to a corner or the top edge of its area. Do not stretch, recolor or add
effects. On a Navy, Black or Deep Teal background, use the white logo.

To make the Navbar appear on every page, right click it and turn it into a component, then add that
component to each page.

### The site icon (favicon)

The site icon is the little picture in the browser tab. Webflow needs one square image and makes
every size from it.

1. Make the monogram square first. The monogram file is wider than it is tall, so open it in any
   image editor, put it in the middle of a square transparent canvas, and add empty space above
   and below. Do not stretch or crop it.
2. Open **Site settings > General > Icons** and click **Upload icon**.
3. Upload your square monogram and select which icons to update.
4. Click **Apply**, then publish your site and refresh it in your browser to see the new icon.

## Part 3: Build on brand pages

With Part 1 done, building a page is mostly a matter of choosing the right class. The quickest way
to apply a class is to select an element, click the Style selector field (or press Command + Enter
on a Mac, Control + Enter on Windows), start typing the name and press Enter.

| You want | Element | Classes |
| --- | --- | --- |
| A White section | Box with the Section tag | `brand-section` |
| A Warm White section | Box with the Section tag | `brand-section` `is-warm-white` |
| A light section with the angled tint | Box with the Section tag | `brand-section` `is-angled` |
| A Navy, Black or Deep Teal section | Box with the Section tag | `brand-section` `is-navy`, `is-black` or `is-deep-teal` |
| The notch below a section | Div Block | `section-notch` and the section's color |
| The eyebrow | Paragraph | `eyebrow` |
| The headline | Heading set to H1 | none (the tag does it) |
| The payoff of a two toned headline | Span | `headline-accent` |
| A big number | Paragraph | `big-stat` |
| A white card | Div Block | `brand-card` |
| A numbered block | Div Block | `numbered-block` |
| A primary button | Button | `brand-button` |
| A secondary button | Button | `brand-button` `is-secondary` |
| A button on a dark section | Button | `brand-button` `is-on-dark` |
| A heading on a dark section | Heading | `heading-on-dark` |
| A link on a dark section | Text link | `link-on-dark` |
| An intro paragraph | Paragraph | `paragraph-large` |
| A caption or note | Paragraph | `paragraph-small` |

To apply a combo class, apply the base class first, then type the combo class name. Typing a
comma after the first name adds it and lets you type the next one straight away.

A few rules from the spec to keep in mind:

- Use one H1 per page, for the headline. Use H2, H3 and H4 for everything below it.
- Never put Teal text or a solid primary button on a dark section. Use White text, Cyan accents and
  the `is-on-dark` button.
- Use one warm accent per page, such as a Yellow tag or rule, always with Black text on Yellow.
- Put text over a photo only on a calm, high contrast area. Otherwise move it, or set it on a solid
  Navy, Black or Deep Teal block.

### Build a sample home page

1. Add the Navbar component with the logo at the top.
2. **Hero, on Navy with a photo.** Add the hero section. Inside it, add an `eyebrow`, a Heading set
   to H1 (for example "Founders build here") with a `headline-accent` span on the payoff, a
   paragraph with `paragraph-large`, and a `brand-button` `is-on-dark` ("Apply now"). Add a
   `section-notch is-navy` at the end.
3. **How it works, on White with the angled tint.** Add a `brand-section` `is-angled` with an H2 and
   three `numbered-block` Div Blocks, then a `brand-button` ("Learn more").
4. **Highlights, on Navy.** Add a `brand-section` `is-navy` with an H2 and three `brand-card` Div
   Blocks, then a `section-notch is-navy`.
5. **Footer, on Black.** Add a `brand-section` `is-black` with the white logo and your links, each
   with `link-on-dark`.
6. Click **Preview** (the eye icon) to see the page as a visitor would, then switch to the Mobile
   landscape and Mobile portrait breakpoints in the canvas bar to check phones.

### Publish

1. Click **Publish** at the top right of the Designer (or press Shift + P).
2. Tick the domain(s) to publish to: your `webflow.io` address, your own domain, or both.
3. Click **Publish to selected domains**.

To try changes before they go public, tick only the `webflow.io` address.

## Part 4: Custom code (optional)

**You do not need custom code for Webflow.** Parts 1 to 3 cover the whole spec with Webflow's own
variables, tags and classes, and those are the better choice: the next person can see and change
them in the Style panel, and they show on the canvas while you edit. If you ever need a style that
the Style panel has no control for, add it under **Style panel > Custom properties** on the class
or tag. That is still no code to maintain.

### Alternative: the Propellant stylesheet

If you would rather use our ready made classes than build your own, you can load the Propellant
stylesheet and type its class names into Webflow. Use this instead of Steps 10 to 12 of Part 1, not
as well as them. You still need Step 1 (Oswald), and the tag styles from Steps 7 to 9 are still
worth doing.

This needs a paid Core, Growth, Agency or Freelancer Workspace, or an active Site plan.

1. Open **Site settings**, then the **Custom code** tab.
2. Paste this into the **Head code** box:

   ```html
   <!-- Propellant website styles: see github.com/masschallenge/propellant-web -->
   <link
     rel="stylesheet"
     href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v2.0.0/dist/website.css"
   />
   ```

   The first line is a label, so the next person knows where the code came from. Keep it.

3. Click **Save changes**, then publish.
4. In the Designer, select an element, click the Style selector field, type one of the class names
   below and press Enter. Do not add any styles to these classes in the Style panel; the
   stylesheet does that.

| On this element | Type this class | What you get |
| --- | --- | --- |
| Heading set to H1 | `propellant-headline` | The Oswald capitals headline |
| Paragraph | `propellant-eyebrow` | The tracked eyebrow |
| Button | `propellant-button` | The primary pill button |
| Button | `propellant-button`, then `propellant-button-secondary` | The secondary button |
| Box with the Section tag | `propellant-section-navy`, `propellant-section-black` or `propellant-section-deep-teal` | A dark section with White text, Cyan links and Cyan outline buttons |
| Box with the Section tag | `propellant-section-warm-white` or `propellant-section-angled` | A light section |
| Box with the Section tag | `propellant-notch`, as well as a section class | The notch below the section |
| Div Block | `propellant-card` | A white card with square corners |
| Text link | `propellant-link` | An underlined link: Teal on light, Cyan on dark |
| Paragraph | `propellant-body` | Paragraph text |
| Paragraph | `propellant-caption` | Small print, such as dates and notes |
| Section or Box | `propellant-text` | The body font and text color for a whole section |

Things to know:

- The stylesheet's styles appear in **Preview** and on the published site, but you may not see
  them on the canvas while you edit. That is why Webflow's own classes are easier to work with.
- The stylesheet uses the same values as the spec and loads Lato and Oswald itself. Keep Oswald
  in Site settings > Fonts anyway, so it also shows on the canvas while you edit.

**To remove it later:** take the `propellant-` classes off your elements (click the class in the
Style selector and press Delete), delete the lines from **Site settings > Custom code > Head
code**, click **Save changes** and publish again.

## Check your work

On desktop, in Preview and on the published site:

- [ ] The H1 headline is Oswald SemiBold, in capitals, 64px, and there is only one per page.
- [ ] All headings are Oswald capitals, and all body text is Lato, in sentence case, in Black.
- [ ] Links are Teal and underlined on light sections, and Cyan on dark ones.
- [ ] Primary buttons are Teal pills in Oswald capitals with White text, and clear to a Teal
      outline on hover.
- [ ] Secondary buttons are Teal outlines that fill with Teal on hover.
- [ ] Dark sections have White text, Cyan outline buttons and the white logo, and no Teal text.
- [ ] Dark and light sections alternate, with a notch where they meet.
- [ ] Cards and images have square corners.
- [ ] Sections have about 96px of space above and below, and paragraphs stop at about 720px wide.
- [ ] The logo is the official file, at least 24px tall, and links to the home page.
- [ ] The site icon shows the monogram in the browser tab.

On a phone (or the Mobile landscape and Mobile portrait breakpoints):

- [ ] The H1 is 40px, H2 30px, H3 24px, H4 20px and paragraphs 16px.
- [ ] Sections have about 64px of space above and below.
- [ ] Buttons stay pills and their labels fit on one line.

## If something looks off

- **Headings are still in Webflow's default font or size.** The heading probably has a class with
  its own font or size. Select it, look at the Style selector, and remove the class (or reset the
  font and size on it) so it falls back to the All H1 to All H4 tags.
- **Text in a dark section is dark.** The color was set on a paragraph tag or class rather than on
  the Body, or a heading has no nested White color for that section. Clear the color there (click the blue or pink label next to Color and
  choose Reset) so it inherits White from the section.
- **Buttons are underlined or turn a different color on hover.** Buttons inherit from All Links.
  Select the button, set **Decoration** to none on `brand-button`, and check that the Hover state
  is set on the button class, not only on All Links.
- **Sizes do not shrink on phones.** Check that the Mobile mode in the Variables panel has its
  Responsive setting on Mobile landscape, and that the style is linked to a variable (the value
  shows in purple). If it shows a plain number, link it to the variable, or use Step 14.
- **Oswald is missing from the Font list.** Refresh the Designer after adding it in Site settings.
  If it is still missing, check that it is listed under **Site settings > Fonts > Google fonts**.
- **The stylesheet classes do nothing.** Custom code only runs in Preview and on the published
  site, and only after you save it and publish. Check that the code is in Head code, not Footer
  code, and that your plan includes custom code.
