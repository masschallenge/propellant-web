<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/propellant-lockup-white.svg" />
  <img src="assets/brand/propellant-lockup-color.svg" alt="Propellant" height="64" />
</picture>

# Propellant for the web

Propellant is how MassChallenge looks, sounds and works on the web. It is the shared kit our teams
use to build every MassChallenge website and product: our colors and fonts, ready made pieces like
buttons and forms, and the guidance for putting them together. When everyone builds from the same
parts, people get the same clear, accessible experience wherever they meet us.

This repository holds the web version: design tokens (the named colors, sizes and spacing),
React components, an application layout, and the brand and usage guidelines behind them.

Propellant was inspired by Apple's Human Interface Guidelines and Google's Material Design.
Apple and Human Interface Guidelines are trademarks of Apple Inc. Google and Material Design are
trademarks of Google LLC. Propellant is not affiliated with, sponsored by or endorsed by Apple or
Google.

## What is inside

- **Design tokens** for color, type, shape, depth, motion and layout, in light and dark mode. Controls
  grow for touch screens, and motion calms down for people who ask their device to reduce it.
- **Components** for buttons, forms, navigation, menus, messages and tables. Each one works with a
  keyboard, makes sense to screen readers and comes with tests.
- **An application layout** with a sidebar and a toolbar that adapts to narrow windows.
- **The MassChallenge logo** as a component and as image files in three versions.
- **Guidelines** for using Propellant and for the MassChallenge brand.

## Install

```bash
npm install github:masschallenge/propellant-web#v1.1.1
```

```css
@import 'tailwindcss';
@import '@masschallenge/propellant-web/styles.scoped.css';
@import '@masschallenge/propellant-web/utilities.css';
@source '../node_modules/@masschallenge/propellant-web/src';
```

```tsx
import { Button } from '@masschallenge/propellant-web';

export const Example = () => (
  <div data-propellant>
    <Button>Save changes</Button>
  </div>
);
```

The [usage guide](docs/usage.md) walks through apps and sites with a build step. Building in
WordPress, Squarespace or another site builder? The [websites guide](docs/websites.md) needs no
install: one stylesheet and a few class names.

## Documentation

- [Usage guide](docs/usage.md)
- [Websites and site builders](docs/websites.md): WordPress, Squarespace, Webflow, Wix, HubSpot and plain HTML
- [Brand guidelines](docs/brand.md), including logo usage
- [Images and uploads](docs/images.md): how to handle photos and logos people upload
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

The documentation site and Storybook run locally:

```bash
yarn site         # documentation site with live examples
yarn storybook    # component workshop on http://localhost:6006
yarn site:build   # the documentation site as one HTML file in site/dist
```

## Getting help

- **Bugs, questions and ideas:** open an issue on GitHub. The [contributing guide](CONTRIBUTING.md)
  explains how we handle them.
- **Security problems:** report them privately, as described in [SECURITY.md](SECURITY.md).
- **Using the MassChallenge name or logo:** read the [brand guidelines](docs/brand.md). For
  anything they do not cover, contact MassChallenge through
  [masschallenge.org](https://masschallenge.org).

## Development

```bash
yarn install
yarn build              # token stylesheets in dist
yarn lint
yarn typecheck
yarn test               # unit tests
yarn test:stories       # interaction tests for every story in Chromium
yarn test:vr            # visual regression against vr/__screenshots__
```

Visual regression baselines are recorded in the `mcr.microsoft.com/playwright:v1.62.0-noble`
container so they match continuous integration:

```bash
yarn build-storybook
docker run --rm --ipc=host -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.62.0-noble \
  bash -lc "npx playwright test --config playwright.vr.config.ts"
```

## License

The code is free to use under the [MIT License](LICENSE). The MassChallenge and Propellant names
and logos are trademarks of MassChallenge, Inc. and are not covered by that license; see
[the brand guidelines](docs/brand.md) for how they may be used. The fonts are licensed under the
SIL Open Font License 1.1.
