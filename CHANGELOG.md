# Changelog

All notable changes to `@masschallenge/propellant-web` are recorded here. The project follows
semantic versioning. The version is available at runtime as the `--propellant-version` custom
property and from `@masschallenge/propellant-web/version`.

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
