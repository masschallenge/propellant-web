# Using Propellant

Propellant gives your product the MassChallenge look, ready to build with: our colors, type and
spacing, plus the buttons, forms and app frame that screens are made of. Install it once and every
page starts on brand, with keyboard support and contrast already handled, so your team spends its
time on the product instead of rebuilding the same pieces.

## What you get

Propellant comes in two layers. Tokens are our design decisions given names, such as `--tint` for
the color of links and actions or `--corner-lg` for a rounded corner. Any website can use them.
Components are ready made React pieces, such as `Button` and `AppShell`, built from those tokens.

Because every product draws from the same source, MassChallenge looks and works the same
everywhere, and a change we make here reaches every team that installs the next version. You can
start small, too: Propellant only styles the parts of a page you hand to it.

## Pick your setup

Find the row that matches what you are building. The rest of this guide follows it.

| You are building | Use |
| --- | --- |
| A site in WordPress, Squarespace, Webflow, Wix, HubSpot or plain HTML | One stylesheet and a few class names, no install. Follow the [websites guide](websites.md). |
| A React application | Components, tokens and the text style utilities. |
| A website styled with Tailwind CSS | Tokens and utilities, plus components where the site uses React. |
| A website with its own CSS | Tokens only, through CSS custom properties. |

Propellant needs Node 22 or later and, for components, React 19.

## Install

Install the package from GitHub at a released version:

```bash
npm install github:masschallenge/propellant-web#v2.3.0
```

```bash
yarn add github:masschallenge/propellant-web#v2.3.0
```

The package is published as `@masschallenge/propellant-web`.

## React applications

### 1. Load the styles

Our components are styled with Tailwind CSS 4. In your global stylesheet, import Tailwind, the
scoped tokens and the utilities. Then point Tailwind at the package source with `@source`, so it
generates the classes the components use:

```css
@import 'tailwindcss';
@import '@masschallenge/propellant-web/styles.scoped.css';
@import '@masschallenge/propellant-web/utilities.css';
@source '../node_modules/@masschallenge/propellant-web/src';
```

Adjust the `@source` path so it is relative to the stylesheet.

The stylesheet brings the Propellant Sans and Oswald fonts with it, so there is nothing else to
load.

### 2. Compile the package

Propellant ships as TypeScript source, which your build tool turns into JavaScript. Vite does this
with no setup. In Next.js, add the package to `transpilePackages`:

```js
const nextConfig = {
  transpilePackages: ['@masschallenge/propellant-web'],
};

export default nextConfig;
```

### 3. Render inside the boundary

Tokens apply only inside an element with the `data-propellant` attribute. Put it near the root of
the part of the page Propellant should style:

```tsx
import { Button } from '@masschallenge/propellant-web';

export const Example = () => (
  <div data-propellant>
    <Button>Save changes</Button>
  </div>
);
```

Everything outside the boundary keeps its existing styles, so a product can move to Propellant one
page at a time.

### 4. Frame the application

Signed in applications use `AppShell`: a `Sidebar` for places, a `Toolbar` for context and one main
area for the page. On windows narrower than 1024px, the sidebar becomes an overlay that opens from
a toolbar button.

```tsx
import {
  AppShell,
  Logo,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Toolbar,
} from '@masschallenge/propellant-web';

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div data-propellant>
    <AppShell
      appearance="system"
      sidebar={
        <Sidebar label="Main" header={<Logo />}>
          <SidebarSection title="Program">
            <SidebarItem href="/overview" current>
              Overview
            </SidebarItem>
            <SidebarItem href="/startups">Startups</SidebarItem>
          </SidebarSection>
        </Sidebar>
      }
      toolbar={<Toolbar title="Overview" />}
    >
      {children}
    </AppShell>
  </div>
);
```

`SidebarItem` and `Button` render plain links by default. Pass your router's link component to
`linkAs` to keep client side navigation, where pages change without a full reload.

#### Nest destinations in a tree

A `SidebarItem` takes `subitems`, more `SidebarItem`s shown in a nested list below it. Top level
rows and rows with an icon are the largest, and a parent with `collapsible={false}` is the program
row. Below them, a row that holds more items or carries a `marker` keeps the label color, and a
row with nothing below it is a leaf, smaller and in the secondary label color. The children of a
row with an icon line up with its label. Labels wrap to two lines and the row grows with them.

A top level item with nothing nested keeps the height its `size` gives it, `sm` by default, so a
flat sidebar looks as it did. With `sidebarCollapse="rail"` every top level row takes the tree
size. An explicit `size` sets the height of any row in the list.

- A parent is a button that only opens and closes its list, with `aria-expanded` and
  `aria-controls`; Enter and Space toggle it. It never navigates and never closes the compact
  overlay, so only leaves are destinations. Any `href` on a parent is ignored. Leave it
  uncontrolled with `defaultExpanded`, or control it with `expanded` and `onExpandedChange`,
  usually open for the branch that holds the current page.
- Set `collapsible={false}` on a parent that always shows its list, such as a program whose
  stages are always in view. It has no chevron and no `aria-expanded`. With an `href` it stays a
  link; without one it is a plain row that takes no focus and no clicks. At any depth, with or
  without `media`, it starts at the top level icon column and its children take the stage indent,
  so a program nested under a persona lines up the same way with or without a logo.
- Put a `SidebarSeparator` between groups for a hairline. Inside a branch it lines up with the
  rows of that branch. The rail leaves it out.
- Set `current` on the current page only. Set `inTrail` on the top level item whose branch holds
  it, so the rail can show where people are.
- `marker` shows a stage as `done`, `now` or `next` with its number, and its `label` is read by
  assistive technology. `media` fills a 60 by 36 thumbnail with 5px corners,
  `--corner-thumbnail`, cropping the logo to cover it, beside a name of up to two lines. The
  program row and its rows sit 6px in from the sidebar edge, as one inset block.
- Pass a `RoleTag` to `accessory` to name the role a destination belongs to. Assistive technology
  reads it once, after the label, and not at all when it repeats the label.
- Role tags and marker numbers use the Caption 2 text style, `text-caption2`: 10px with 0.06em
  tracking. The component sets the weight.

```tsx
<SidebarItem
  marker={{ state: 'now', label: 'in progress' }}
  defaultExpanded
  subitems={
    <>
      <SidebarItem href="/program/review/judges" current>
        Judges
      </SidebarItem>
      <SidebarItem href="/program/review/progress">Progress</SidebarItem>
    </>
  }
>
  Online review
</SidebarItem>
```

#### Collapse to a rail

By default the toolbar button hides the sidebar. Set `sidebarCollapse="rail"` to collapse it to a
column of icons instead:

```tsx
<AppShell sidebarCollapse="rail" sidebarStorageKey="console-sidebar" defaultSidebarCollapsed>
```

- The sidebar header carries the Collapse menu and Expand menu button, with `aria-expanded` and
  `aria-controls`, and the toolbar drops its toggle on wide windows.
- The rail shows top level items as their icon, logo or marker, so give each one of them. Each is
  a 32px button with an 18px icon, 38px apart, and a logo is a 34 by 20 thumbnail. Their names
  stay available to assistive technology.
- The rail opens and closes only by click. Expand menu pins the full tree in its column again,
  and clicking a parent's icon pins it with that parent expanded. A leaf's icon is a link and
  keeps the rail. Only Collapse menu returns to the rail: choosing a destination, Escape and a
  press outside leave the pinned tree open.
- In the rail, the `inTrail` row carries `aria-current="true"`, since the current page itself is
  not shown.
- `sidebarStorageKey` remembers the choice in local storage, across tabs.
  `defaultSidebarCollapsed` sets the state when nothing is stored. Both work in the default hide
  mode too, where collapsed means hidden.
- Below 1024px the toolbar button opens the full tree as an overlay, as in hide mode.
- `useAppShell()` reports `collapseMode`, `isCollapsed` and `isRail`, so content you put in the
  sidebar footer can fit the rail, and `toggleCollapsed` to switch between the rail and the
  pinned tree.

### 5. Choose light or dark

`AppShell` takes an `appearance` value:

| Value | Effect |
| --- | --- |
| `system` | Follows the light or dark setting of the operating system. |
| `light` | Always light. Use it while a product still has pages designed only for light. |
| `dark` | Always dark. |

Outside `AppShell`, set `data-theme="light"` or `data-theme="dark"` on the boundary or any
element inside it.

## Websites

### With Tailwind CSS

Load the styles as in step 1. Then use tokens in arbitrary values (Tailwind classes with a value in
square brackets) and the text style utilities:

```html
<section data-propellant class="bg-[var(--bg-grouped)] px-[var(--page-margin)] py-12">
  <h1 class="text-large-title text-[var(--label)]">Programs</h1>
  <p class="text-body text-[var(--label-secondary)]">Find the program that fits your startup.</p>
</section>
```

Public pages may set their main headline in the brand display face:

```html
<h1 class="font-[family-name:var(--type-family-brand)] uppercase text-display">Apply now</h1>
```

### With your own CSS

Import the token stylesheet and use the CSS custom properties (the `var(--name)` values) directly:

```css
@import '@masschallenge/propellant-web/styles.scoped.css';

.card {
  background: var(--bg);
  border-radius: var(--corner-lg);
  padding: var(--space-6);
  color: var(--label);
  font-family: var(--type-family);
}
```

To apply the tokens to a whole site without a boundary element, import
`@masschallenge/propellant-web/styles.css` instead. It defines the same tokens on `:root`.

## Tokens

Use tokens by their role, never the raw values behind them:

| Kind | Examples |
| --- | --- |
| Color | `--label`, `--label-secondary`, `--bg`, `--bg-grouped`, `--tint`, `--critical`, `--separator` |
| Type | `--type-family`, `--type-family-brand`, and the `text-body`, `text-headline`, `text-caption2` utilities |
| Shape | `--corner-sm`, `--corner-thumbnail`, `--corner-md`, `--corner-lg`, `--corner-xl`, `--corner-capsule` |
| Depth | `--shadow-float`, `--shadow-sheet`, `--material-bar` |
| Motion | `--spring-snappy`, `--spring-smooth`, `--ease-standard` |
| Layout | `--control-md`, `--row`, `--page-margin`, `--width-form`, `--space-4` |

The token reference on the documentation site lists every token with its light, dark, touch and
reduced motion values.

## What stays with you

Our components handle focus, keyboard support, contrast and announcements for screen readers. A
few things only your product can do:

- give every page one `h1` and a sensible heading order,
- write labels and button text that say what happens,
- give icon only buttons an accessible name,
- keep personal data out of analytics; fields mark their values private by default.

## Versioning

Propellant follows semantic versioning: the first number of a version changes only when an update
can break your code. Install a tagged version and read the changelog before moving to a new major
version.
