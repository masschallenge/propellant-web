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
npm install github:masschallenge/propellant-web#v1.0.0
```

```bash
yarn add github:masschallenge/propellant-web#v1.0.0
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
| Type | `--type-family`, `--type-family-brand`, and the `text-body`, `text-headline` utilities |
| Shape | `--corner-sm`, `--corner-md`, `--corner-lg`, `--corner-xl`, `--corner-capsule` |
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
