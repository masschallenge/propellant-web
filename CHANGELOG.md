# Changelog

All notable changes to `@masschallenge/propellant-web` are recorded here. The project follows
semantic versioning. The version is available at runtime as the `--propellant-version` custom
property and from `@masschallenge/propellant-web/version`.

## 2.0.0 (2026-11-12)

This release applies the MassChallenge brand guidelines 2026 from MassChallenge
Marketing, which now set the brand standard; Propellant applies them. It is a breaking change for
brand documentation and for websites that use the website stylesheet. The signed in product looks
the same: no existing token value changes, and components such as `Button`, `Card` and `AppShell`
keep their sentence case Lato buttons and rounded corners. Moving the product's primary color,
`--tint`, to the new Teal is a later, separate release.

### Breaking

- `website.css` follows the brand guidelines for websites. Headings, the eyebrow, subheads and
  buttons are Oswald capitals (SemiBold, Regular and Bold for the big stat only), body text has a
  line height of 1.5, buttons are Oswald pills whose fill clears to a Teal outline on hover (Cyan
  outlines that fill with Teal on dark sections), and text, links and headings use the new
  palette. `propellant-brand-band` is now a Navy section with Cyan links and Cyan outline buttons.
  Class names are unchanged, so existing pages keep working but look different.
- The old palette names Deep teal, Teal (`#065E6F`), Mid teal, Bright teal, Pale teal, Mist, Ink,
  Slate, Magenta, Logo teal and Logo gray are no longer brand colors. Their values stay as interface
  tokens, and the brand guidelines map each one to its replacement for brand material.
- The website spec and every builder guide (Squarespace, WordPress, Webflow, Wix, HubSpot and
  plain HTML) use the new palette, Oswald capitals for headings and buttons, square corners on
  cards and photos, and the dark and light section rhythm.

### Added

- Brand palette tokens with an `--mc-` prefix in `tokens/color.css`: the core colors, supporting
  blues and warm accents, the print substitutes, Navy black, the light tint, the MC Gradient and
  the two hero overlay stops. They are in every build, the token reference and the Storybook
  foundations.
- Website classes for the new patterns: `propellant-eyebrow`, `propellant-headline-accent`,
  `propellant-subhead`, `propellant-stat`, `propellant-tag`, `propellant-accent-rule`, the section
  classes (`propellant-section-white`, `-warm-white`, `-angled`, `-navy`, `-black` and
  `-deep-teal`), `propellant-notch`, `propellant-card`, `propellant-photo`, `propellant-numbered`,
  `propellant-hero` and `propellant-hero-subject-left`.
- New sections in the brand guidelines: Imagery, Video, and Sub-brands and partners. The images
  guide adds the brand photography direction: treatments, warmth, what to avoid, the rule on AI
  images and where photos come from.

### Changed

- The brand guidelines name the MassChallenge brand guidelines from MassChallenge Marketing as the
  standard. Logo, Color, Typography, Graphic devices and Iconography follow them: the vertical,
  horizontal, MC mark and local versions, the official logo colors, clear space by the height of
  the M, minimum sizes on screen and in print, the full palette with print substitutes and
  verified pairings, Oswald and Lato roles, and the Aptos fallback for Office and email. CMYK
  values are approximate until confirmed with a printer proof. The monogram rules are unchanged.
- The chart color order is Teal, Yellow, Navy, MC Blue, Deep Teal and Gray 300, and
  `ColorPicker`'s default brand swatches follow it. They replace Slate and Bright teal, as well as
  the earlier Accent teal, Pink, Lime, Mustard and duplicate Orange, and leave Magenta for errors.
- The graphic devices use the new palette: the geometric pattern and the hexagon network frame
  in MC Blue and the light tint, stat callouts in Teal or Cyan, icons in Teal or Cyan, and the
  program and partner lockups follow the sub-brand system, which only MassChallenge Marketing
  creates.
- The site's brand and logo pages follow the brand guidelines, and the color page separates the
  interface teals from the brand palette.
- New brand guidelines sections from earlier in this release stay: Messaging (primary line,
  positioning, boilerplate, approved figures with their as-of date, Challenge Areas, accelerators,
  audiences and naming rules) and Contact, social and legal.

### Removed

- The teal duotone graphic device is retired. Use the hero overlay instead.
- The standard mix of colors by share of a page, and the CMYK calculation note.

### Notes

- The logo PNG files still measure `#17ACBC` and `#828486`. Official artwork from MassChallenge
  Marketing will replace them with the official MC Blue `#0EABBC` and MC Gray `#808285`.
- The install commands and CDN links in the README, the usage guide, the website guides and the
  site's Usage page point at `v2.0.0`, the first release with the new website classes.

### Fixed

- "It takes a community to raise a startup" is a founder testimonial, not a MassChallenge line.
  The brand guidelines and the site's brand and accessibility pages no longer present it as our
  voice.

## 1.1.1 (2026-11-10)

### Fixed

- The install commands and CDN links in the README, the usage guide, the website guides and the
  site's Usage page now point at the current release instead of v1.0.0.

## 1.1.0 (2026-11-10)

### Added

- `tone="warning"` on `Card`, for cards that need attention, such as a draft.
- `--cal-ev-brand-ac` for the edge of brand calendar events, following light and dark themes.
- `--type-eyebrow-size`, `--type-eyebrow-weight` and `--type-eyebrow-tracking` for uppercase
  eyebrow labels.
- `--toolbar-menu-max-width` for menus in the toolbar, such as a program switcher.
- A design-first step in CONTRIBUTING: new components and visual changes start from an approved
  design.
- An images and uploads guideline: uploaded photos and logos are never cropped by the interface,
  people crop once at upload, and the crop step starts uncropped unless a face is detected in a
  profile photo. It recommends shapes and minimum sizes for each kind of upload.
- `autoCrop` on `Avatar` and on `EmptyState` tiles, for images designated as safe to crop.

### Changed

- Components that show photos and logos (`Avatar`, `Breadcrumb`, `Card`, `Menu`, `PageHeader`,
  `PopUpButton`, `RadioCardGroup`, `Sheet` and `EmptyState` tiles) now show the whole image on a
  quiet background instead of cropping it to fill the frame.

### Fixed

- `Menu` items with `selected` are now radio items with `aria-checked`, so screen readers announce
  which choice is current.
- A `Menu` opened from the compact `AppShell` sidebar now opens above the sidebar instead of
  underneath it. Menus open inside the nearest `data-propellant-layer-host`.

## 1.0.0 (2026-11-05)

The first public release.

### Added

- Tokens for color, typography, shape, depth, motion and layout, with light and dark themes, a
  system appearance mode, touch sizes for coarse pointers, reduced motion and reduced
  transparency support. Tokens are scoped to a `[data-propellant]` boundary, with an unscoped
  stylesheet for sites that adopt them everywhere.
- The Propellant mark: lockups, marks and an app icon in `assets/brand`, in color, white and
  black.
- Propellant Sans (Lato 2.0) at four weights and Oswald for brand headlines, with eleven text
  styles available as Tailwind CSS utilities.
- Components: actions (Button, IconButton, SocialButton), inputs (TextField, Textarea, Checkbox,
  Radio, Switch, Slider, Stepper, SearchField, PopUpButton, ComboBox, DatePicker, Calendar,
  PhoneField, FileUploader, ColorPicker, VerificationCodeInput, RadioCardGroup, Token),
  navigation (SegmentedControl, TabBar, Breadcrumb, Pagination, FilterBar), overlays (Menu,
  Popover, Tooltip, Sheet, Inspector, Toast), feedback (Banner, Badge, StatusIcon, Progress,
  Spinner, Skeleton, EmptyState) and data display (List, Table, Card, Avatar, ActivityFeed,
  DisclosureGroup).
- Layout: AppShell with Sidebar and Toolbar, PageContainer, PageHeader, Separator and
  AuthLayout.
- The MassChallenge logo as a `Logo` component and as image files in full color, white and black.
- A website stylesheet, `dist/website.css`, with plain class names for headings, text, links,
  buttons and brand sections, plus a guide for WordPress, Squarespace, Webflow, Wix, HubSpot and
  plain HTML.
- A usage guide, brand guidelines with logo usage, a documentation site and Storybook.
