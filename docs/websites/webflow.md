# Webflow

Webflow gives you everything you need to build a MassChallenge-style site without writing code.
You store the brand colors, fonts and sizes once as variables, style every heading, paragraph and
link at once, and make a handful of classes for buttons and sections. By the end you will have a
site with the right fonts, colors, headline, pill buttons, White, Mist and Deep teal sections, the
logo and a site icon, and it will look right on phones too. Plan on about two hours the first time,
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

- Horizontal logo, full color, for White and Mist backgrounds:
  [masschallenge-logo-horizontal-color.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-color.png)
- Horizontal logo, white, for Deep teal backgrounds:
  [masschallenge-logo-horizontal-white.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-horizontal-white.png)
- Monogram, full color, for the site icon:
  [masschallenge-logo-monogram-color.png](https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/assets/logos/masschallenge-logo-monogram-color.png)

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
3. Tick the **500** (Medium) variant. That is the only weight the headline uses.
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

Create one **Color** variable for each row. This is the full spec palette, plus the secondary
button hover color from the buttons table.

| Variable name | Hex | Use it for |
| --- | --- | --- |
| `Colors/White` | `#FFFFFF` | Page background, text on Deep teal |
| `Colors/Mist` | `#F3FBFC` | Alternate section background |
| `Colors/Ink` | `#1E282B` | Body text and headings |
| `Colors/Slate` | `#4B575B` | Secondary text, such as captions |
| `Colors/Teal` | `#065E6F` | Links and buttons |
| `Colors/Deep teal` | `#044451` | Button hover, and dark brand sections |
| `Colors/Bright teal` | `#0FACBD` | Accents on Deep teal sections only |
| `Colors/Pale teal` | `#D9F6FA` | Secondary buttons and tinted sections |
| `Colors/Pale teal hover` | `#C4EEF4` | Secondary button hover |
| `Colors/Line` | `#DBE1E3` | Lines and dividers |
| `Colors/Yellow` | `#FFC801` | Highlights, always with Ink text |
| `Colors/Magenta` | `#BF0261` | Errors |

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
| `Type/Paragraph large` | 20px | 18px |
| `Type/Paragraph` | 17px | 16px |
| `Type/Paragraph small` | 14px | 14px |
| `Type/Button` | 16px | 16px |
| `Space/Section` | 96px | 64px |
| `Space/Button vertical` | 14px | 14px |
| `Space/Button horizontal` | 28px | 28px |
| `Layout/Text width` | 720px | 720px |
| `Radius/Card` | 12px | 12px |
| `Radius/Pill` | 9999px | 9999px |

`Radius/Pill` is a very large corner radius, which is how a web page draws fully rounded pill
ends. `Layout/Text width` keeps paragraphs to about 68 characters a line.

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
   in Step 5: Heading 1 40px, Heading 2 30px, Heading 3 24px, Heading 4 20px, Paragraph large 18px,
   Paragraph 16px and Section 64px. Leave the others as they are.

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
   - **Height** (line height): type `1.6`, then choose the **-** unit so it has no unit. A unitless
     line height grows and shrinks with the text.
   - **Color**: link to `Colors/Ink`.
4. Under **Backgrounds**, set **Color** to `Colors/White`.

Set the text color here, on the Body, and not on the heading and paragraph tags. That way a Deep
teal section can switch all its text to White in one place (Part 3).

### Step 8: Style All H1 to All H4 headings

Add a Heading to any page from **Add panel > Typography** so you have one to click. Select it, make
sure it has no class, then open the Style selector field and choose the tag. Set each tag as
below, and link the font and size to the variables shown.

| Tag | Font | Weight | Size | Height | Letter spacing | Letter case |
| --- | --- | --- | --- | --- | --- | --- |
| All H1 Headings | `Fonts/Headline` | 500 (Medium) | `Type/Heading 1` | `1` (no unit) | `0.01em` | All capitals |
| All H2 Headings | `Fonts/Body` | 700 (Bold) | `Type/Heading 2` | `1.15` (no unit) | leave empty | leave empty |
| All H3 Headings | `Fonts/Body` | 700 (Bold) | `Type/Heading 3` | `1.2` (no unit) | leave empty | leave empty |
| All H4 Headings | `Fonts/Body` | 700 (Bold) | `Type/Heading 4` | `1.25` (no unit) | leave empty | leave empty |

To change which heading level you are styling, select the heading and change its level (H1, H2
and so on) in the Settings panel, or add one heading of each level and select each in turn.

For the H1 headline:

- **Letter spacing** and **letter case** are under **More type options** at the bottom of the
  Typography section. Type `0.01em` (that is the spec's 1%) for letter spacing, and choose the
  all capitals option (shown as **AA**) for letter case.
- Type your headline in sentence case, such as "Founders build here". Webflow turns it into
  capitals for you. Screen readers then read words, not letters.
- If you cannot find the letter case control, use **Style panel > Custom properties** instead:
  click **Add**, type `text-transform` as the name and `uppercase` as the value, and press Enter.

Leave the color empty on all four tags, so they inherit Ink from the Body.

### Step 9: Style All Paragraphs and All Links

**All Paragraphs.** Select a paragraph with no class, open the Style selector field and choose
**All Paragraphs**. Set:

- **Size**: link to `Type/Paragraph`.
- **Height**: `1.6` (no unit).
- **Size section > Max W** (maximum width): link to `Layout/Text width`.

**All Links.** Select a text link, open the Style selector field and choose **All Links**. Set:

- **Color**: link to `Colors/Teal`.
- **Decoration**: underline.

Webflow treats buttons as links too, so buttons start out teal and underlined. The button classes
in Step 11 fix that.

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

- **Typography**: Font `Fonts/Body`, Weight 700 (Bold), Size `Type/Button`, Height `1` (no unit),
  Color `Colors/White`, Decoration none (click the **X**).
- **Backgrounds**: Color `Colors/Teal`.
- **Spacing**: padding top and bottom `Space/Button vertical`, left and right
  `Space/Button horizontal`.
- **Borders**: Radius `Radius/Pill`. No border width and no shadow.

Now the hover color. Click the dropdown arrow in the Style selector field, choose **Hover** from
the **States** menu (a green Hover label appears), and set **Backgrounds > Color** to
`Colors/Deep teal`. Choose **None** in the same menu to go back to the normal state.

**Secondary button: `brand-button` plus `is-secondary`.** Add a second Button. Type
`brand-button`, press Enter, then type `is-secondary` and press Enter. The second class is a combo
class: it starts with everything from `brand-button` and only changes what you set here.

- **Backgrounds**: Color `Colors/Pale teal`.
- **Typography**: Color `Colors/Teal`.
- **Hover** state: Backgrounds Color `Colors/Pale teal hover`.

**Button on Deep teal: `brand-button` plus `is-on-dark`.** Add a third Button, apply
`brand-button`, then the combo class `is-on-dark`:

- **Backgrounds**: Color `Colors/White`.
- **Typography**: Color `Colors/Deep teal`.
- **Hover** state: Backgrounds Color `Colors/Pale teal`.

Write button labels in sentence case with a verb, such as "Apply now" or "Meet the startups".

### Step 12: Make the section classes

Sections work the same way: one base class and two combo classes.

1. From **Add panel > Structure**, add a **Box**. (In older versions of Webflow, add a **Section**
   instead and skip the next step.)
2. In the **Settings** panel, set the **Tag** to **Section**.
3. Click the Style selector field, type `brand-section` and press Enter. Set:
   - **Spacing**: padding top and bottom `Space/Section`.
   - **Backgrounds**: Color `Colors/White`.
4. Add a second section with `brand-section` plus the combo class `is-mist`, and set
   **Backgrounds > Color** to `Colors/Mist`.
5. Add a third section with `brand-section` plus the combo class `is-deep-teal`, and set
   **Backgrounds > Color** to `Colors/Deep teal` and **Typography > Color** to `Colors/White`.
   Headings and paragraphs inside it turn White, because they inherit their color.

**Links on Deep teal.** Text links keep their Teal color, and Teal on Deep teal is not allowed.
Give any text link inside a Deep teal section the class `link-on-dark` and set its
**Typography > Color** to `Colors/White`. For a small accent on Deep teal, such as an icon or a
short label, use `Colors/Bright teal`.

### Step 13: Round images and cards

Select an image, open the Style selector field and choose **All Images**. Set **Borders > Radius**
to `Radius/Card`. Do the same on any card class you make later.

### Step 14 (only if needed): Mobile without modes

The Mobile mode in Step 6 should handle phone sizes everywhere. If a size does not change on a
phone, set it directly: click the **Mobile landscape** icon in the canvas bar (above the canvas),
select the element, choose the same tag or class in the Style selector, and type the Mobile value
from the table in Step 5. Styles set on Mobile landscape also apply to Mobile portrait.

## Part 2: Add the logo and site icon

### The logo

In Webflow the logo is part of the page, in the navigation bar, rather than a site setting.

1. Open the **Assets** panel in the left toolbar, click the **cloud** icon and upload the
   horizontal color logo (and the white one, if you will use a Deep teal footer).
2. From **Add panel > Other**, drag a **Navbar** to the top of your page.
3. Drag the color logo from the Assets panel into the Navbar's **Brand** link.
4. Select the logo image and set **Style panel > Size > Height** to `32px`, with width left on
   Auto so the proportions stay right. Never go below 24px tall; on very small spaces use the
   monogram instead.
5. In the image's settings, set the alt text (the description screen readers announce) to
   `MassChallenge`.
6. Select the Brand link, open **Settings panel > Link settings**, choose **Page** and pick your
   home page.

Keep clear space around the logo of at least half its height (16px for a 32px logo). Do not
stretch, recolor or add effects. On a Deep teal background, use the white logo.

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
| A Mist section | Box with the Section tag | `brand-section` `is-mist` |
| A Deep teal section | Box with the Section tag | `brand-section` `is-deep-teal` |
| The big headline | Heading set to H1 | none (the tag does it) |
| A primary button | Button | `brand-button` |
| A secondary button | Button | `brand-button` `is-secondary` |
| A button on Deep teal | Button | `brand-button` `is-on-dark` |
| A link on Deep teal | Text link | `link-on-dark` |
| An intro paragraph | Paragraph | `paragraph-large` |
| A caption or note | Paragraph | `paragraph-small` |

To apply a combo class, apply the base class first, then type the combo class name. Typing a
comma after the first name adds it and lets you type the next one straight away.

A few rules from the spec to keep in mind:

- Use one H1 per page, for the big headline. Use H2, H3 and H4 for everything below it.
- Never put Teal text or a primary button on Deep teal. Use White text and the `is-on-dark` button.
- Yellow is for highlights only, and always with Ink text on it.

### Build a sample home page

1. Add the Navbar component with the logo at the top.
2. **Hero, on White.** Add a `brand-section`. Inside it, add a Heading set to H1 (for example
   "Founders build here"), a paragraph with `paragraph-large`, and two Buttons: one `brand-button`
   ("Apply now") and one `brand-button` `is-secondary` ("Learn more").
3. **Story, on Mist.** Add a `brand-section` `is-mist` with an H2, two paragraphs and an image.
4. **Call to action, on Deep teal.** Add a `brand-section` `is-deep-teal` with an H2, a paragraph and
   a `brand-button` `is-on-dark` button.
5. **Footer.** Add a `brand-section` `is-deep-teal` with the white logo and your links, each with
   `link-on-dark`.
6. Click **Preview** (the eye icon) to see the page as a visitor would, then switch to the Mobile
   landscape and Mobile portrait breakpoints in the canvas bar to check phones.

To keep content from running edge to edge on wide screens, put a Box inside each section and give
it a maximum width and Auto left and right margins. The spec does not set a page width, so choose
one that suits your layout and use it for every section.

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
     href="https://cdn.jsdelivr.net/gh/masschallenge/propellant-web@v1.1.1/dist/website.css"
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
| Button | `propellant-button` | The primary pill button |
| Button | `propellant-button`, then `propellant-button-secondary` | The secondary button |
| Box with the Section tag | `propellant-brand-band` | A Deep teal section with White text and White buttons |
| Text link | `propellant-link` | A teal, underlined link |
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

- [ ] The H1 headline is Oswald, in capitals, 64px, and there is only one per page.
- [ ] H2 to H4 and all body text are Lato, in sentence case, in Ink.
- [ ] Links are Teal and underlined, and none sit on Deep teal.
- [ ] Primary buttons are Teal pills with White text and turn Deep teal on hover.
- [ ] Secondary buttons are Pale teal pills with Teal text.
- [ ] Deep teal sections have White text, White buttons and the white logo.
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
- **Text in a Deep teal section is dark.** The color was set on a heading or paragraph tag or class
  rather than on the Body. Clear the color there (click the blue or pink label next to Color and
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
