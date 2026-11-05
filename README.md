<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/propellant-lockup-white.svg" />
  <img src="assets/brand/propellant-lockup-color.svg" alt="Propellant" height="64" />
</picture>

# Propellant for the web

Propellant is the MassChallenge design system. This repository is its web implementation: design
tokens, React components, an application shell, and the brand and usage guidelines behind them.
It is used for MassChallenge web applications and websites.

Propellant was inspired by Apple's Human Interface Guidelines and Google's Material Design.
Apple and Human Interface Guidelines are trademarks of Apple Inc. Google and Material Design are
trademarks of Google LLC. Propellant is not affiliated with, sponsored by or endorsed by Apple or
Google.

## What is included

- **Tokens** for color, type, shape, depth, motion and layout, in light and dark themes, with touch
  sizes on coarse pointers and reduced motion support.
- **Components** for actions, inputs, navigation, overlays, feedback and data display, each with
  keyboard support, accessible names and tests.
- **An application shell** with a sidebar, a toolbar and a responsive overlay for narrow windows.
- **The MassChallenge logo** as a component and as image files in three treatments.
- **Guidelines** for using Propellant and for the MassChallenge brand.

## Install

```bash
npm install github:masschallenge/propellant-web#v1.0.0
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

Read the [usage guide](docs/usage.md) for applications, websites and pages that use only the
tokens.

## Documentation

- [Usage guide](docs/usage.md)
- [Brand guidelines](docs/brand.md), including logo usage
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

The documentation site and Storybook run locally:

```bash
yarn site         # documentation site with live examples
yarn storybook    # component workshop on http://localhost:6006
yarn site:build   # the documentation site as one HTML file in site/dist
```

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

The code is released under the [MIT License](LICENSE). The MassChallenge name and logos are
trademarks of MassChallenge, Inc. and are not covered by that license; see
[the brand guidelines](docs/brand.md) for how they may be used. The fonts are licensed under the
SIL Open Font License 1.1.
