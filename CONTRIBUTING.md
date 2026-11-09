# Contributing

Thank you for helping build Propellant. Every product and website that uses it gets better when
you do, so we are glad you are here. This guide walks you through proposing a change, and the few
rules that keep the system consistent for everyone who depends on it.

## Who looks after Propellant

The MassChallenge team owns and maintains Propellant. We read every issue and decide what goes
into each release. Propellant is built first for MassChallenge products and websites, so we
prioritize what they need.

## How we handle contributions

- **Bug reports and questions are always welcome.** Open an issue and include what you expected,
  what happened, and the browser or builder you used.
- **Ideas for new components or changes start as an issue.** We discuss them there before anyone
  writes code, so nobody spends time on something we cannot take.
- **Pull requests from outside the team are by invitation.** If we agree a change is a good fit in
  an issue, we will say so and you are welcome to open a pull request. We may close pull requests
  that were not discussed first. That is not a judgment on the work, only a way to keep the system
  focused.
- **Brand changes come from the MassChallenge brand team.** Changes to the logo, colors, fonts or
  voice are not open to outside proposals, and we publish them when they are announced.
- **Security problems are never reported in a public issue.** Follow [SECURITY.md](SECURITY.md)
  instead.

## Before you start

- Open an issue first, even for a small fix. A short conversation up front saves you from building
  something we would have steered differently.
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
- Never crop an image someone uploaded. Show images whole with `imageFitClass()` from
  `src/internal/imageFit`, and crop to fill only for images we own, through an explicit `autoCrop`
  option. The [images guide](docs/images.md) explains the rule.

## Tokens

- Edit token files in `tokens/`, then run `yarn build` to regenerate `dist/`.
- Prefer semantic tokens, the ones named for a role such as `--label` or `--bg`. Add a component
  token only when its value differs per theme or is computed.
- `yarn test` fails if anything references a token that is not defined.

## Commit messages

Say why the change is needed, not only what changed. Keep one logical change per commit, so each
one is easy to review and easy to undo.
