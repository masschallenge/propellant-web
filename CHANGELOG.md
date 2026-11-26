# Changelog

All notable changes to `@masschallenge/propellant-web` are recorded here. The project follows
semantic versioning. The version is available at runtime as the `--propellant-version` custom
property and from `@masschallenge/propellant-web/version`.

## Unreleased

### Added

- A `RadioCardGroup` option takes `readableLinks` to keep its links usable when it is disabled. The
  links sit inline after the hint, at full contrast and focusable, while the rest of the card fades
  as before and stays unselectable and announced as disabled. A faded link fell to about 2:1, below
  WCAG 2.2 AA; the readable link measures at least 7.0:1 in light and 8.5:1 in dark. It applies to
  the `row` layout, for example a company that already applied, "Applied Nov 4. View
  application". Without it a disabled card is unchanged.
- `ComboBox` takes `panelWidth="content"`, single or multiple, to size the open panel to its longest
  option instead of the trigger: never narrower than the trigger, and capped to the window less an
  8px gap on each side, so long labels such as "Healthcare IT and digital health" read in full from
  a narrow filter. The closed control and the default, `trigger`, are unchanged.
- `Sheet` takes `header="divided"` to draw a stacked sheet's header as one row: the icon on the
  left, a 17px title over a 13px sub line, and the close button on the right, with a separator
  between the header and the body, as on the message and announcement sheets. The default header is
  unchanged, and the horizontal and split layouts ignore it.

## 2.10.0 (2026-11-25)

### Added

- Favicon sets in `assets/favicons/masschallenge/`, for every MassChallenge product and website,
  and `assets/favicons/propellant/`, for Propellant's own site. Each has `favicon.ico` (16, 32 and
  48px), `favicon-16x16.png`, `favicon-32x32.png`, an opaque 180px `apple-touch-icon.png`,
  `android-chrome-192x192.png`, `android-chrome-512x512.png` and a `site.webmanifest` with token
  colors. The Propellant set adds `favicon.svg`; the MassChallenge set has none, because there is no
  vector MC mark. A unit test checks every size and that each manifest points at real files.
- The documentation site shows the Propellant favicon set, with PNG fallbacks and an apple touch
  icon beside the SVG.
- The brand guidelines cover favicons, with `<link>` and Next.js `metadata.icons` snippets, and share
  images: 1200 by 630 with a safe area, logos shown whole, and a generic product card for pages
  behind sign in so nothing private leaks.

## 2.9.0 (2026-11-25)

### Added

- `Sheet` takes `placement="content"` for sheets opened inside an `AppShell`. On wide screens it
  centers the sheet within the content area and aligns it to the top, at `topOffset` from the top
  of the window: `sm` 64px (the default), `md` 160px, `lg` 180px or `xl` 200px. It leaves room for
  a pinned sidebar or a rail, uses the whole window when the sidebar is hidden or absent, and keeps
  wide sizes such as `xl` and `full` inside the content area. Narrower, or outside an `AppShell`, it
  is centered like `center`.
- `Sheet` takes `closeButton="plain"` for a close button without a fill, with a 24px glyph at a 1.5
  stroke. The default, `gray`, is unchanged.
- `IconButton` takes `variant="inverse"` for a dark or colored band: a white glyph on a 15% white
  fill that deepens to 30% on hover and while its menu is open, with a white focus ring. It is a
  rounded rectangle by default and has no destructive style: `destructive` with `inverse` is a type
  error.
- The `--inverse`, `--inverse-fill` and `--inverse-fill-hover` color tokens, the same in light and
  dark, for content on a dark or colored band.
- The `--sheet-offset-sm`, `--sheet-offset-md`, `--sheet-offset-lg` and `--sheet-offset-xl` layout
  tokens, 64px, 160px, 180px and 200px, for the `Sheet` top offsets.

## 2.8.0 (2026-11-24)

Propellant now targets WCAG 2.2 AA instead of WCAG 2.1 AA. The guidelines, the usage guide and the
README say so, and the components below change to meet the criteria that are new in 2.2.

### Added

- `SidebarItem` takes `navigates`: a parent with an `href` becomes a link that goes to its page
  and opens its list, with a separate chevron button named for the section, such as "Your companies
  pages", that opens and closes the list. `aria-expanded` says whether the list is open. Without
  `navigates` a parent still only opens and closes.
- `FileRow` takes `action` for a control beside the file, such as Replace, and
  `showStatus={false}` to keep the upload status for screen readers only.
- Sidebar `media` takes `shape: 'logo'` for a 20px square logo, contained rather than cropped.
  Without a `src`, `initials` show on a tinted square instead. Below a nested row with a logo,
  children line up with the row's name instead of its edge, and the children of a
  `navigates` parent line up with that parent.
- The `--target-minimum` token, 24px, the smallest pointer target WCAG 2.2 AA allows. A unit test
  keeps `--hit-target` and `--control-sm` at or above it with a mouse and on touch.
- `AuthLayout` takes a `help` slot that renders below every auth screen in the same place, for a
  support link or contact details (Consistent help).
- Story accessibility checks include the WCAG 2.2 A and AA rules, and a story checks that a control
  scrolled into view lands below the sticky toolbar.
- The accessibility guidelines cover focus not hidden by sticky bars, a click alternative for every
  drag, help in a consistent place, never asking for the same information twice, and sign in that
  allows paste and password managers.
- `Toast` takes `actionPlacement="inline"` to put its actions on the right of the message line,
  vertically centred with the glyph and the message, for a short toast with one action such as
  Undo. The actions stay real buttons inside the live region. The default, `below`, is unchanged.
  `inline` is typed only for a one line toast: it is a type error together with `children`,
  `when` or `progress`.

### Changed

- The sticky `Toolbar` adds its height to the scroll padding of the container it sticks in, on top
  of any padding the page already sets, so a focused control never scrolls under it. Toolbars on
  the same container share the padding by the tallest one, since Propellant never stacks sticky
  bars, and the original value returns when the last one unmounts (Focus not obscured).
- `Pagination` dots and lines sit in a full `--hit-target` box each, so neighboring targets no
  longer overlap. The dots are spaced wider apart (Target size).
- The vertical stepper on `TextField` is tall enough for two 24px buttons, so a field with it is
  48px tall (Target size).
- The clear button in the single select `ComboBox` is a full `--hit-target` box instead of an 18px
  button with a pseudo element, and the "more" button in `Calendar` month cells is at least 24px
  tall (Target size).

### Fixed

- `VerificationCodeInput` accepts a pasted code and the browser's one-time-code autofill, and
  spreads the code across its cells. Before, only the last character of a paste was kept
  (Accessible authentication).

### Upgrade notes

- `Inspector` opens at 480px instead of 420px, and `wide` at 640px instead of 480px. Pass
  `size="md"` to keep 420px.
- `RoleTag` is sentence case at 12px. Pass the words as people should read them; the tag no longer
  turns them into capitals.
- The sidebar program row is 2px taller (46px), to fit the whole 64 by 38 logo.
- Uncontrolled `SidebarItem` parents now open and close on their own as the current page moves. Set
  `defaultExpanded` or control `expanded` to keep the old behavior.
- `AppShell` without a toolbar shows its own Show sidebar button below 1024px. Set
  `showsSidebarToggle={false}` if you already have one.

### Accelerate design rules

Propellant adopts the Accelerate design rules marked as moving to Propellant (Accelerate-Projects
#11497), since Propellant is the design system of record.

- Added `LoadOnScroll`, which loads the next page of a long working list as its end scrolls into
  view, with placeholder rows and no Load more button. One status region stays mounted and
  announces loading and how many items arrived (`itemCount`); `error` stops loading and shows a
  Retry button; a Load more button stands in where the browser has no IntersectionObserver.
- `AppShell` runs without a toolbar: below 1024px it shows its own Show sidebar button, named by
  the new `sidebarToggleLabel`, when there is a sidebar and no toolbar. Set the new
  `showsSidebarToggle={false}` to leave it out.
- A `SidebarItem` parent opens on its own while it holds the current page and closes when the page
  leaves it, unless someone opened it. Items wrapped in your own component need `inTrail` on the
  parent. `defaultExpanded` and the controlled props still override it.
- `RoleTag` is sentence case at 12px (the Caption style) instead of uppercase at 10px, and reads
  its colors from new `--role-tag-admin-*`, `-pm-*`, `-evaluator-*` and `-founder-*` tokens,
  which start at today's colors. New `evaluator` and `founder` tones; `judge` and `startup` stay as
  aliases.
- `Sidebar` program logos show whole in a 64 by 38 box instead of cropped to 60 by 36, and the
  program row grows from 44px to 46px.
- `Inspector` opens at `--inspector-width`, now 480px (was 420px), and `wide` at the new
  `--inspector-width-wide`, 640px (was 480px). `size="md"` keeps 420px.
- The guidelines cover the console shell without a toolbar or breadcrumbs, containers, console
  sizes, text that earns its place, date and time formats, menus, Needs attention, bulk confirms,
  reorderable lists with Move up and Move down, long lists, autosave, neutral-first badges,
  EmptyState usage and wide program logos. The account menu shows Privacy and Terms above Sign out.
- A product word list is added to the Writing guidelines as proposed wording, pending MassChallenge
  Marketing's sign-off.

## 2.6.0 (2026-11-23)

### Added

- `StepIndicator` shows where a person is in a short multi-step flow: the steps in order, the current
  one as a pill with a filled number and `aria-current="step"`, finished ones with a check.
  `onStepSelect` lets a person go back to a finished step. Below the small breakpoint,
  `compact="auto"` shows "Step 2 of 4 · Stages" instead of the list. `isStepReachable` lets a
  person also jump forward to a step they have already reached, shown and announced as visited.
- `Sheet` takes `placement="side"` for a full height panel on the right, full width on phones,
  with the same focus trap, Escape and scrim close as the centred sheet and a body that scrolls.
  `eyebrow` puts a short label, such as Preview, above the title.
- `DatePicker` takes `dateStyle="weekday"` to show the date as Thursday, Jan 14, 2027, and
  `fullWidth` to fill its column.
- `Switch` takes `tone="success"` to fill the on track with `--success-solid`. The on track
  keeps a 1px `--success` edge, since the fill is 2.19:1 against white.
- `Switch` takes `size="compact"`: a 38 by 22 track with an 18px knob, between `sm` and `md`.
- `SearchField` takes `variant="inset"`: square, the full row height and an inset focus ring,
  for a search that sits as the first row of the list it filters. Its focus ring is an inset
  outline, so it stays visible in forced colors.
- `RadioCardGroup` takes `layout="choice"`: an icon tile on the left, an optional neutral
  badge with `--corner-sm` corners and the radio on the right, and the title on its own line.
- `MenuItem` takes `description`: a second line of footnote text under the label, aligned with
  the label past any icon, that says what the action will do. It stays secondary on destructive
  items, the item keeps its label as its accessible name and the line becomes its accessible
  description.
- `PageHeader` takes `leading` to put an element, such as a stage `IconTile`, before the title,
  centred on the title block with a 16px gap.
- `IconTile` takes `size="lg"` for the 44px stage tile with a 22px icon and `--corner-lg`
  corners, the one that leads a stage page title. The `IconTileSize` type is exported, and the
  `--icon-tile-lg-size` and `--icon-tile-lg-icon` tokens hold its measures.
- `Menu` takes `minWidth`, a CSS length such as `17.5rem`, to widen the panel past its default
  for menus whose items carry a description.
- `Menu` takes `size="md"`: a 232px panel, 32px rows with 10px side padding, 8px padding on
  rows with a description, and a separator inset 6px. `sm` stays the default. It composes with
  `minWidth`. The `MenuSize` type is exported.
- `PopUpButton` takes `indicator="chevron"`: a single down chevron at 16px with the
  `--icon-stroke` weight in secondary label color, at the field's own trailing inset. `popup`
  stays the default. The `PopUpButtonIndicator` type is exported.
- `PopUpButton` takes `size="sm-md"`, the step between `sm` and `md`: the 32px `md` height with
  the 13px `sm` text, 12px leading and 10px trailing inset. `sm` and `md` are unchanged.
- `Radio` and `RadioGroup` take `density="compact"`: a 16px circle 8px from a callout label and
  rows 28px apart, with a 1.5px resting ring from the new `--stroke-medium` token. A group passes
  it to radios that do not set their own.
- `Avatar` takes `size="sm-md"`, 32px, the step between `sm` and `md`, from the new
  `--avatar-sm-md` token.
- `RadioCardGroup` takes `density="compact"` for the row layout: 14px padding, content centred
  and a 15/22 semibold title over a tertiary hint, which makes a 70px row with a 40px logo passed
  as `icon`, a 20px selection circle with a 2px resting ring, and a selected fill from the new
  `--radio-card-compact-selected-bg` token. `RadioCardGroupProps` only accepts `compact` with
  the row layout. The `RadioCardDensity` type is exported.

## 2.5.0 (2026-11-19)

### Added

- `IconTile` draws the 36px rounded tile that leads a to do item or list row, holding an 18px
  icon. `teal`, `gray` and `orange` tones mark something to act on, to read and that needs
  attention, and the stage tones `application`, `prescreening`, `online`, `pitch`, `cohort` and
  `closed` match a program stage. It is hidden from assistive technology unless given an
  `aria-label`, when it is a named image. The `IconTileProps` and `IconTileTone` types are
  exported.
- `ListRow` takes `media` to lead with something in place of the icon, with the row separator
  starting at the text in every density: a program logo as a 64 by 38 thumbnail with
  `--corner-thumbnail` corners and a separator ring, or with `shape: 'squircle'` a company logo
  as a 36px squircle, shown whole on a quiet background unless `autoCrop` is set;
  `{ tile: { icon, tone } }` for an `IconTile` on to do items; or
  `{ avatar: { initials?, src?, alt?, tone?, size?, autoCrop? } }` for a round `Avatar` at
  `size: 'md'` (36px, the default) or `'compact'` (26px). `titleEmphasis: 'strong'` sets the
  title in semibold callout type. `subtitlePosition: 'inline'` sets the subtitle after the title
  on one baseline in tertiary subheadline type, both truncating, for a name followed by a
  company. `valueStyle: 'subheadline'` sets the value in secondary subheadline type, for progress
  such as "3 of 6 done", and `'callout'` in callout type in the label color, for the People
  counts. `openHref` adds a chevron link, rendered with `linkAs`, after the accessory of a row
  that is not itself a link or button, so a row can hold its own buttons and still open without
  nesting interactive elements. The link is named "Open" and the row title (for example "Open
  Finish reviews") unless `openLabel` gives its name, its chevron uses `--label-tertiary` to
  reach 3:1, and `showChevron` is ignored on that row so only one chevron shows. A fragment
  accessory is no longer given `aria-labelledby`, and accessory items are spaced 8px apart. Rows
  without the new props are unchanged. The `ListRowMedia`, `ListRowMediaShape`,
  `ListRowImageMedia`, `ListRowTileMedia`, `ListRowTile`, `ListRowAvatar`, `ListRowAvatarMedia`,
  `ListRowAvatarSize`, `ListRowTitleEmphasis`, `ListRowSubtitlePosition` and
  `ListRowValueStyle` types are exported.
- `ListSection` takes `density: 'roomy'` for spacious lists such as the persona Home: rows get
  `--space-3-5` (14px) vertical and `--space-5` (20px) horizontal padding with `--space-3-5`
  between the lead, the text and the trailing content, and the row separator still starts at the
  text; `regular` and `dense` rows are unchanged. `framed` draws the title and `trailing` content
  as a header band inside the list box, on `--bg-secondary` above a separator line, with the box
  ringed in the separator color, as on the email confirmation recipient list; the footer stays
  below the box. `headingProps` passes attributes and a `ref` to the title heading, so an app can
  move focus to it with `tabIndex: -1` and screen readers announce it as a heading; the section
  keeps the heading id that names it. The `ListSectionHeadingProps` type is exported.
- `Avatar` takes `count` to show an unread count as a critical capsule at its top right corner,
  hidden at 0, with assistive technology reading `countLabel`, "N unread" by default, instead of
  the bare number. `tone` (`gray`, `amber`, `green` or `teal`) paints initials from the new avatar
  tone tokens: gray, amber and green tell mentors, evaluators and founders apart in the admin
  Home People rows, and teal (teal 150 with teal 900 initials, a translucent teal 400 fill with
  teal 150 initials in dark mode) is the default initials avatar on the Home and account menu
  boards, an explicit exception to the rule that initials sit on a neutral fill. A tone wins over
  `neutral` and leaves photos unchanged. A `compact` size, 26px, sits between `xs` and `sm` for
  dense rows. The `AvatarTone` type is exported.
- `RoleTag` has a `mentor` tone, a soft Yellow fill from `--role-tag-mentor-fill` and
  `--role-tag-mentor-label`.
- Icon tile tokens, a background and foreground per tone such as `--icon-tile-teal-bg` and
  `--icon-tile-teal-fg`, with dark mode values, and `--corner-tile`, 10px, for icon tiles and
  company logos at the start of a row.
- `Menu` `accountBand` takes `avatar` (`{ src?, initials?, tone? }`) to show an `md` (36px)
  `Avatar` beside the name and email, as on the account menu board, and its `title` and `sub`
  take any `ReactNode` in the same type and color. A band without `avatar` and with string text
  is unchanged. The `MenuAccountBandAvatar` type is exported.
- `MenuItem` takes `badge` (`{ count, label? }`) to show a trailing critical count capsule after
  the label, hidden at 0, with assistive technology reading `label`, "N unread" by default, as
  part of the item name instead of the bare number. `href` renders the item as a `menuitem` link,
  with `linkAs` for a router's link component (`a` by default); arrow keys, Home, End, Enter,
  Escape and focus return work as for button items, and a disabled item or one with a submenu
  stays a button. Row highlights now use `not-disabled:` in place of `enabled:` so they also apply
  to links. The `MenuItemBadge` type is exported.
- `Badge` takes `shape: 'rounded'` to draw small `--corner-sm` corners in place of the capsule; at
  `size="sm"` it is the persona Home boards' badge, 20px high with 12px caption text and 8px
  padding, and `'capsule'` stays the default. `dot` also takes a tone, such as `dot="warning"`,
  to lead a badge with a 7px dot in that tone's label color while the badge keeps its own tone
  and padding, as for a failing integration on a neutral badge; `dot` set to `true` is
  unchanged. The `BadgeShape` type is exported.
- `Sheet` has an `md-wide` size, 540px, for the email confirmation dialog. Existing sizes keep
  their widths.
- Avatar tone tokens, a background and foreground per tone such as `--avatar-green-bg` and
  `--avatar-green-fg`, with dark mode values, and `--avatar-compact`, 26px.
- `IconButton` `plain` fills with `--fill` while it has `aria-haspopup` and `aria-expanded` is
  true, as the open item menu trigger on the Home board, so a `Menu` trigger built from an
  `IconButton` shows the open style while its menu is open. A disclosure such as the Sidebar
  collapse toggle, which has `aria-expanded` but no popup, keeps the plain background.
  `shape: 'capsule'` draws a circular button, as the board's item menu trigger, and
  `shape: 'rounded'` draws `--corner-md` corners. Without `shape`, plain stays rounded and gray,
  tinted and filled stay circular. The `IconButtonShape` type is exported.

### Fixed

- `Menu` now moves focus to the first enabled item when it opens by click, Enter or ArrowDown (the
  last item on ArrowUp), so arrow keys, Home and End work. Focus was set while the panel was still
  hidden off screen before its first position applied, and browsers ignored it. The same race kept
  focus off the `Menu` and `MultiComboBox` search fields and the `FilterSelect` listbox and search
  field; each now takes focus once the panel is placed.

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
