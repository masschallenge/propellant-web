# Contributing

Thank you for helping build Propellant. Every product and website that uses it gets better when
you do, so we are glad you are here. This guide walks you through proposing a change, and the few
rules that keep the system consistent for everyone who depends on it.

## Before you start

- For anything bigger than a small fix, open an issue first. A short conversation up front saves
  you from building something we would have steered differently.
- Every component should serve a real need in a MassChallenge product or website. Tell us where it
  will be used.

## Making a change

1. Fork the repository and create a branch.
2. Run `yarn install`.
3. Make the change, with its tests and stories.
4. Run `yarn lint`, `yarn typecheck`, `yarn test` and `yarn test:stories`.
5. If the change is visual, update the visual baselines in the Playwright container described in
   the README, then look at every changed image before you commit it.
6. Add an entry to `CHANGELOG.md` and open a pull request that explains why the change is needed.

## Code standards

These keep the code easy to read for the next person, who may be you in six months.

- Use arrow function constants, never function declarations.
- Use descriptive names. No single letter or abbreviated names, including callback parameters.
- Do not write comments. Well named code explains itself. The only exception is a short note on a
  workaround, or a `TODO:`.
- Do not use `any`. Type props precisely and use `React.ComponentPropsWithoutRef` for pass
  through attributes.
- Do not use em dashes or en dashes in code, copy, stories or tests.
- Style with tokens through Tailwind arbitrary values, such as `bg-[var(--bg)]` or
  `rounded-[var(--corner-lg)]`. Never use a raw color or a magic pixel value.
- Keep every accessibility contract: roles, names, keyboard support, focus return and the privacy
  classes on personal data.

## Tokens

- Edit token files in `tokens/`, then run `yarn build` to regenerate `dist/`.
- Prefer semantic tokens, the ones named for a role such as `--label` or `--bg`. Add a component
  token only when its value differs per theme or is computed.
- `yarn test` fails if anything references a token that is not defined.

## Commit messages

Say why the change is needed, not only what changed. Keep one logical change per commit, so each
one is easy to review and easy to undo.
