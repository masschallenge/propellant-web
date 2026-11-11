# Changelog

All notable changes to `@masschallenge/propellant-web` are recorded here. The project follows
semantic versioning. The version is available at runtime as the `--propellant-version` custom
property and from `@masschallenge/propellant-web/version`.

## Unreleased

### Changed

- The brand guidelines in `docs/brand.md` state the MassChallenge brand standards: print CMYK and
  the token for every palette and logo color, how the CMYK values were calculated, the supporting
  neutrals Gray 100 and Gray 300, the chart color order and the standard mix of colors, and where
  each font applies on the web, in Office, in Google Workspace and in email.
- New sections in the brand guidelines: Messaging (primary line, positioning, boilerplate, approved
  figures with their as-of date, Challenge Areas, accelerators, audiences and naming rules),
  Contact, social and legal, and Graphic devices.
- The website guides use the standard Mist `#F3FBFC` and Magenta `#BF0261` instead of `#F3F6F7`
  and `#A30253`, and the plain HTML guide maps Mist to `--teal-50`.
- The site's brand page states the typefaces' scope and the trademark rule as the standard does.
- `ColorPicker`'s default brand swatches are the chart colors in chart order (Teal, Yellow, Slate,
  Bright teal, Deep teal, Gray 300), named as the palette names them. They replace Accent teal,
  Pink, Lime, Mustard and a duplicate Orange, and leave Magenta for errors.
- The geometric pattern's label is set in Ink, or in White on a solid Deep teal panel, so it
  passes contrast on both triangle colors.

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
