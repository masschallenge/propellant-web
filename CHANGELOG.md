# Changelog

All notable changes to `@masschallenge/propellant-web` are recorded here. The project follows
semantic versioning. The version is available at runtime as the `--propellant-version` custom
property and from `@masschallenge/propellant-web/version`.

## Unreleased

### Added

- `StepIndicator` shows where a person is in a short multi-step flow: the steps in order, the current
  one as a pill with a filled number and `aria-current="step"`, finished ones with a check.
  `onStepSelect` lets a person go back to a finished step. Below the small breakpoint,
  `compact="auto"` shows "Step 2 of 4 · Stages" instead of the list.
- `Sheet` takes `placement="side"` for a full height panel on the right, full width on phones,
  with the same focus trap, Escape and scrim close as the centred sheet and a body that scrolls.
  `eyebrow` puts a short label, such as Preview, above the title.
- `DatePicker` takes `dateStyle="weekday"` to show the date as Thursday, Jan 14, 2027, and
  `fullWidth` to fill its column.
- `Switch` takes `tone="success"` to fill the on track with `--success-solid`. The on track
  keeps a 1px `--success` edge, since the fill is 2.19:1 against white.

### Changed

- The medium `Switch` is a 38 by 22 track with an 18px knob, the size the design system draws.
  It was 40 by 24 with a 20px knob.

## 2.4.0 (2026-11-18)

### Added

- Motion tokens `--ease-in-out` (`cubic-bezier(0.4, 0, 0.2, 1)`) and `--duration-resize` (250ms,
  1ms under `prefers-reduced-motion`) for layout that resizes. Listed on the docs site's Motion
  page and in the usage guide.

### Changed

- `AppShell` in rail mode eases the sidebar column between the tree and the rail when a person
  collapses or expands it, with `--ease-in-out` over `--duration-resize`. The tree keeps its full
  width while the column opens, so labels do not rewrap mid motion. Nothing animates on load or
  when the stored choice changes in another tab, and hide mode is unchanged.

### Fixed

- `AppShell`'s sidebar column now sits on the sticky layer (`--layer-sticky`). It was sticky with
  no z-index, so a menu opened from the rail, such as the account menu, was covered by any
  positioned page content where it overhung the 56px column.

## 2.3.0 (2026-11-17)

### Added

- `SidebarItem` nests: `subitems` shows more items in a nested list, the disclosure navigation
  pattern. A parent is a button that only opens and closes its list, uncontrolled with
  `defaultExpanded` or controlled with `expanded` and `onExpandedChange`. It ignores `href`,
  never navigates and never closes the compact overlay; only leaves are destinations.
  `collapsible={false}` always shows the list, with no chevron and no `aria-expanded`. With an
  `href` it stays a link; without one it is a plain row that takes no focus and no clicks. It is
  the program row: at any depth, with or without `media`, it starts at the top level icon column
  and its children take the stage indent.
  `marker` shows a stage as `done`, `now` or `next` with an accessible label, `media` crops a
  logo to fill a rounded 60 by 36 thumbnail beside a name of up to two lines, and the program
  row and its rows sit 6px in from the sidebar edge. `inTrail` marks the top level item whose
  branch holds the current page; in the rail it carries `aria-current="true"`. A `RoleTag`
  accessory is read once after the label, and not when it repeats it. The `SidebarItemMarker`,
  `SidebarItemMedia` and `SidebarMarkerState` types are exported.
- `SidebarSeparator` draws a hairline between groups of sidebar items, inset to the rows of a
  branch when nested, and is left out of the rail.
- `AppShell` takes `sidebarCollapse="rail"` to collapse the sidebar to a 56px column of icons on
  wide windows, where each item is a 32px button with an 18px icon. The sidebar header carries
  a 30px Collapse menu button, and the rail a 32px Expand menu button, with
  `aria-expanded` and `aria-controls`, and the toolbar drops its toggle on wide windows. Expand menu pins the full tree again, and a click on a
  parent's icon pins it with that parent expanded; a leaf's icon is a link. Only Collapse menu
  returns to the rail. `sidebarStorageKey` remembers the collapsed choice across reloads and
  tabs, and `defaultSidebarCollapsed` sets it when nothing is stored. Both also work in the
  default hide mode, where collapsed means hidden. `useAppShell()` adds
  `collapseMode`, `isCollapsed`, `isRail` and `toggleCollapsed`, and the `SidebarCollapseMode`
  type is exported.
- `RoleTag` names the role a destination belongs to in uppercase, with `admin`, `pm`, `judge`,
  `startup` and `neutral` tones. The `RoleTagProps`, `RoleTagTone` and `SidebarSeparatorProps`
  types are exported.
- The `--sidebar-rail-width` token, and `--corner-thumbnail`, 5px, for image thumbnails beside a
  label.
- The Caption 2 text style, `text-caption2`: 10px on a 14px line with 0.06em tracking, from the
  `--type-caption2-size`, `--type-caption2-line` and `--type-caption2-tracking` tokens. It sets no
  weight, so the component sets it. `RoleTag` and the sidebar stage marker use it.

### Changed

- Sidebar rows in a tree follow the console design: 36px rows with 15px labels and 20px icons for
  top level parents and nested rows with an icon, a 44px program row with a 14px semibold name,
  34px for nested rows that hold more items or carry a marker, and 32px with 14px secondary labels
  for nested leaves, with a 10px gap. With `sidebarCollapse="rail"` every top level row takes the
  36px size. In the default hide mode a top level item with nothing nested keeps the height its
  `size` gives it, with its 14px label and 16px icon, so flat sidebars keep their row size. An
  explicit `size` sets the height of any row in the list. Children of a row with an icon line up
  with its label.
- Sidebar labels turn teal under the pointer with no fill, instead of a tertiary fill.
- Sidebar labels wrap to two lines instead of ending in an ellipsis, and the row grows with them.
- The sidebar is 264px wide, up from 240px, through `--sidebar-width`.
- The light sidebar material, `--material-sidebar`, is more opaque: `rgb(235 240 241 / 0.92)`,
  up from 0.82.
- The sidebar scrolls between its header and footer, so the footer stays in view on long lists.
  It never scrolls sideways and shows no scrollbar.

## 2.2.0 (2026-11-16)

### Added

- `SidebarItem` takes `size`, `sm` by default for today's small control height, or `md` for the
  medium control height, so top level places can stand taller than the destinations under a
  section. The `SidebarItemSize` type is exported.
- `Toolbar` takes `sidebarToggleIcon`, `sidebar` by default for today's panel glyph, or `menu` for
  a three line menu glyph at the same size and stroke. The toggle keeps its accessible name from
  `sidebarToggleLabel`. The `ToolbarSidebarToggleIcon` type is exported.
- `AuthLayout` takes `variant`, `split` by default for today's brand panel beside the form, or
  `centered` for a single column on the grouped background with the MassChallenge logo above the
  form and no brand panel. In the centered variant, `brand` replaces the logo, for example with a
  product lockup. The form keeps its width and the version still shows. The `AuthLayoutVariant`
  type is exported.

## 2.1.0 (2026-11-16)

### Added

- `Token` takes `children` to show rich content in place of the label, such as the letters that
  matched a search wrapped in `<mark>`. The `label` stays required and is what assistive
  technology reads, for the token, its toggle and its remove button.
- `ComboBox` with `multiple` takes `chipTone="tint"` to color the chosen tokens with the tint,
  keeping their weight, and options take a `marker`, an icon and a label, shown on the option row
  and its token. The marker label joins the accessible name of both, and of the token's remove
  button, so a product can mark values that came from a search. The `MultiComboBoxChipTone` and
  `MultiComboBoxOptionMarker` types are exported.

### Fixed

- The combobox stories show the import that works, `ComboBox` from the package, rendered with
  `multiple` for multiple select. `SingleComboBox` and `MultiComboBox` are not exported.

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
