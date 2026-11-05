# Using Propellant

Propellant can be used three ways:

| You are building | Use |
| --- | --- |
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

Propellant's components are styled with Tailwind CSS 4. Import Tailwind, the scoped tokens and the
utilities in your global stylesheet, and point Tailwind at the package source so it generates the
classes the components use:

```css
@import 'tailwindcss';
@import '@masschallenge/propellant-web/styles.scoped.css';
@import '@masschallenge/propellant-web/utilities.css';
@source '../node_modules/@masschallenge/propellant-web/src';
```

Adjust the `@source` path so it is relative to the stylesheet.

The stylesheet includes the Propellant Sans and Oswald fonts, so there is nothing else to load.

### 2. Compile the package

The package ships TypeScript source. Vite compiles it with no extra setup. In Next.js, add it to
`transpilePackages`:

```js
const nextConfig = {
  transpilePackages: ['@masschallenge/propellant-web'],
};

export default nextConfig;
```

### 3. Render inside the boundary

Tokens apply inside an element with the `data-propellant` attribute. Put it near the root of the
part of the page Propellant should style:

```tsx
import { Button } from '@masschallenge/propellant-web';

export const Example = () => (
  <div data-propellant>
    <Button>Save changes</Button>
  </div>
);
```

Everything outside the boundary keeps its existing styles, so a product can adopt Propellant one
page at a time.

### 4. Frame the application

Signed in applications use `AppShell`: a sidebar for places, a toolbar for context and one main
landmark. On windows narrower than 1024px the sidebar becomes an overlay behind the toolbar button.

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

`SidebarItem` and `Button` render plain links by default. Pass your router's link component with
`linkAs` to keep client side navigation.

### 5. Choose the appearance

`AppShell` takes `appearance`:

| Value | Effect |
| --- | --- |
| `system` | Follows the light or dark setting of the operating system. |
| `light` | Always light. Use it while a product still has pages designed only for light. |
| `dark` | Always dark. |

Outside `AppShell`, set `data-theme="light"` or `data-theme="dark"` on the boundary or any
element inside it.

## Websites

### With Tailwind CSS

Load the styles as in step 1, then use tokens in arbitrary values and the text style utilities:

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

Import the token stylesheet and use the custom properties directly:

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

Use tokens by role, never the raw values behind them:

| Kind | Examples |
| --- | --- |
| Color | `--label`, `--label-secondary`, `--bg`, `--bg-grouped`, `--tint`, `--critical`, `--separator` |
| Type | `--type-family`, `--type-family-brand`, and the `text-body`, `text-headline` utilities |
| Shape | `--corner-sm`, `--corner-md`, `--corner-lg`, `--corner-xl`, `--corner-capsule` |
| Depth | `--shadow-float`, `--shadow-sheet`, `--material-bar` |
| Motion | `--spring-snappy`, `--spring-smooth`, `--ease-standard` |
| Layout | `--control-md`, `--row`, `--page-margin`, `--width-form`, `--space-4` |

The documentation site lists every token with its light, dark, touch and reduced motion values.

## Responsibilities that stay with you

Propellant's components handle focus, keyboard support, contrast and announcements. A product
still needs to:

- give every page one `h1` and a sensible heading order,
- write labels and button text that say what happens,
- give icon only buttons an accessible name,
- keep personal data out of analytics; fields mark their values private by default.

## Versioning

Propellant follows semantic versioning. Install a tagged version and read the changelog before
moving to a new major version.
