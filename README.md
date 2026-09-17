# Church Project-Budget Management Platform - Demo v1.2.7.1

A fully client-side demo of a budget approval and visibility platform for a church humanitarian
area office running **22 countries × $1,000,000/year** (7 countries seeded). Built from
**Blueprint v1.5 (confirmed 28 Aug 2026)** - decisions D-01…D-15, R-1…R-4 and the Regional
Director basics RD-1…RD-5 are all in scope. v1.1.0 added the External Gate Connector (EGC) and
the Corporate Agreement (Contracts) gate; v1.2.0 adds browser persistence with backup/restore, a
single four-rung stepper, a one-list "Needs you" queue, two-bucket alerts, nine role-scoped home
pages and a mobile approve reduction; v1.2.1 is a patch on top of it, applying the measured
UX review's accessibility findings; v1.2.2 is a UI/UX fine-tuning pass over five pages
(Projects, Needs-you, TimeBlock, Budget, Contracts); v1.2.3 is a second, smaller
fine-tuning pass ToR asked for the same day, in two batches, with no Ask-gate —
Needs-you's column alignment, the approval stepper's equal columns, TimeBlock's
project/task bars and the Gantt/TimeBlock today marker, plus twelve defects
an independent audit found in a build where every automated gate was already green;
v1.2.4 is a Messages & Alerts pass, **with an Ask-gate this time** — Messages & Alerts
(P11) rebuilt to six type tags, a column-one identity stack and a per-user "clear from
my hub," Admin › Alerts (P8) gaining `My alerts` open to every persona, and a mid-build
fix to the today marker's halo — plus thirteen more defects an independent audit found
in a build where, again, every automated gate was already green; v1.2.5 is a no-new-scope
demo-safety patch; v1.2.5.1 adds a top-bar Tone picker; v1.2.5.2 replaces it with a full
seven-tone, dark-capable theming system and adds the Decision Point/CHaS and Cooperation
Agreement step-lines to the stepper; v1.2.6 is a minor presentational pass — sidebar
group headers, labelled register cells, and on the project record a book-style tab bar, a
collapsible alert tray and side-by-side approval cards; **v1.2.7 is a feature pass** — the
status-4 "In development" phase gets its own four-stage workflow (Assessment · Project
Concept · Org Background check · Area Humane Society Communication) with real .docx +
print-to-PDF documents, public review links with mandatory-e-mail comments, outbound
portal mail with a reply-to, and an M1/Admin release that opens the road to submission —
plus an "Open" icon column on the Projects register.

## What is new in v1.2.7

A feature pass (17 Sep 2026), driven by two Ask-gates with ToR (rulings R-1…R-8 plus
R-8a/R-3a/R-2a/R-1a in `docs/BUILD_BRIEF_v1.2.7.md` §1). New folder from the shipped
v1.2.6. `APP_VERSION` 1.2.6 → 1.2.7; **schema_version 3 → 4** (additive migration; a
v1.2.x backup still restores). Full detail, the decision record and the gate board:
`docs/CHANGES_v1.2.7.md`; the independent audit (verdict SHIP-WITH-NOTES):
`docs/AUDIT_v1.2.7.md`; reading order: `docs/HANDOVER_INDEX_v1.2.7.md`.

- **Projects register — Open column.** A right-most "Open" icon after Comments links
  straight to the record (middle-click and Cmd-click both work); for a status-4 project,
  the register's expanded Status segment becomes a purpose-built front view — a 12-month
  strip for the budget year, the budget triple, an Objectives/Activities brief preview,
  owner and backup, and four labelled stage dots.
- **Project record — Development tab.** First in the tab strip while a project is status
  4 and unreleased; four accordion panels (current stage open) let any project-scoped
  role (M3 owner, M2, M1, Admin) flip a stage Not started → In progress → Done with a
  note. Assessment takes observations, a justification and up to 6 images (400 KB each).
  Project Concept generates a 9-section editable pre-draft (headings/bold/bullets, a
  per-section "Reset to generated"). Every stage can then generate its document, mint a
  public review link, send it from the portal with a shown reply-to, and see the
  comments that come back.
- **Documents.** A real **.docx** (a hand-built OOXML zip, no library) and a
  print-to-PDF view come from the same document model, so what a reviewer sees on the
  public page, on screen and on paper never drifts apart. Assessment images embed in the
  .docx and show in the print view too.
- **Public review page.** `#/review/<token>` — no sign-in, fullbleed: the document plus a
  comment box with a mandatory e-mail. A revoked or unknown token shows "This review link
  is no longer active," never stale content.
- **Release gate.** Request submitted stays disabled on a status-4 project until all four
  stages are Done and an M1/Admin clicks Release to submission (Needs-you surfaces it);
  the ladder itself and every other act are unchanged.
- **Ask-gate 4 fixes.** The Budget summary section on documents leaving the building now
  shows the requested amount only (no country-level figures to an outside reviewer);
  Send from portal refuses until a review link exists; external mail drops the internal
  footer; the Open icon sits beside the row's toggle button, not nested inside it; the
  Org check/Area comm mail subjects use their own document title.

## What is new in v1.2.6

A minor presentational pass (16 Sep 2026), driven by an Ask-gate with ToR (rulings
R-A…R-E in `docs/BUILD_BRIEF_v1.2.6.md` §1). New folder from the shipped v1.2.5.2, no
act renamed, no route or fixture touched, no new persisted key. Full detail, the gate
board and the lessons: `docs/CHANGES_v1.2.6.md`; the independent audit (verdict
SHIP-WITH-NOTES): `docs/AUDIT_v1.2.6.md`; reading order: `docs/HANDOVER_INDEX_v1.2.6.md`.

- **Sidebar (R-A).** "Projects" is a bold group header on a light brass band that is
  *still the link* to `#/projects`; Needs you · TimeBlock · Budget · Messages & Alerts ·
  Contracts indent under it past a 1px guide, and the Admin children (Alerts ·
  Administration) indent the same way. `CONFIG.NAV` rows gained `head`/`child` flags;
  `sidebar()` emits `navhead` / `sub` classes; routes, labels, badges and role filtering
  are byte-identical. The column stays 212px — 224px was tried and made a Gantt nudge
  click in `flow_timeline` land behind a `.p5-div` divider.
- **Projects register (R-B).** The "Phase / approval stage" cell reads two labelled lines,
  **Stage ·** (the status pill) and **Gate ·** or **Timing ·** (the existing sub-line — "Gate"
  only when the text starts with "gate ·", whose leading words are visually hidden rather
  than removed, so `textContent` is unchanged for the tests); the "Attention" cell reads
  **Attention ·** plus the plain-language reason that used to live only in `title`. Both
  cells centre vertically as a block. `K.flagCell` gained an additive `opts.labelled`; every
  other caller renders exactly as before.
- **Project record — book tabs.** The tab strip is drawn as folder tabs: the open tab joins
  the panel, the others sit recessed, hover lifts the tab and shows an underline, the whole
  row fits the main column at 1440 and scrolls with edge fades below that. Keys, labels,
  badges and `data-act="p4tab"` unchanged.
- **Project record — alert tray (R-C, R-E).** The unread strip is replaced by a collapsible
  tray, collapsed by default: a warning glyph, "N alerts", one icon chip per alert with a
  CSS-only hover/focus popover, and a chevron. Clicking it (the release's one new act,
  `p4alerts`, toggling the non-persisted `ui.p4AlertsOpen`) opens a two-column grid (one
  column ≤768px) of attention-tinted cards — unread messages (same `view comments` /
  `Mark all read` controls and acts), open Decision Point/CHaS gates with their overdue
  reading, past target date, waiting-on-you, and a stale agreement or overdue OGC/Finance
  review. The Pinned decision band and the Changes-saved bar are untouched. Tinted alert
  cards are a ruled exception to the design system's "left rule, no tint" alert rule, for
  this tray only; text uses `--rose`/`--brass`, never `--rose-ink` on `--rose-bg` (fails AA
  on four tones).
- **Project record — Approval status (R-D).** Decision Point and CHaS are two equal cards
  side by side (CHaS un-nested from under DP), each with its state chip, sync mode, dates,
  remark, deep link and — for the Regional Manager — the same gate buttons and remark
  input. Corporate Agreement is a header row (state chip · id · days since it moved · Open
  agreement) over two cards, **OGC | Finance**, reading `cc.reviews` and `D.reviewDue`
  (approved ✓ / pending · due in N d / overdue N d / not started). The aside widens to 470px
  at ≥1280px so the pairs fit; everything stacks ≤768px. The remark placeholder is now
  "Optional remark".
- **Gates.** All green and at their v1.2.5.2 counts: smoke 153/0 · ux_probe 0 · contrast
  0 on all seven tones / 6 font sizes / 0 heading jumps · flow_projects 163 · flow_timeline
  121 · flow_budget 154 · flow_approval 120 · flow_messages 178 · flow_persist 45 · walks
  30/46/30/98 · align_probe 2604/0. `tools/flow_perm.js` was **re-baselined** (candidate
  v1.2.6, baseline v1.2.5.2 — it had not been re-baselined since v1.2.5): 221/1, the one
  red being the standing F7 santoso-clear ruling item; declared deltas are the `p4alerts`
  toggle and the R-B row-label change only.
- **Deferred to v1.3** (`docs/CONTINUE_v1.3.md` §8): Esc should close a chip popover,
  arrow-key movement across the tabs, a stronger header band on the dark tones, the
  "approved" chip wrapping under "Decision Point" at 1440.
- **Version.** `APP_VERSION` is `'1.2.6'`, so the browser's storage key changes again: a
  v1.2.5.2 record is not read here and this build starts from fixtures. The schema is
  still 3, so **Restore from a v1.2.5.x backup file works.** No fixture or schema change.

## What is new in v1.2.5 · v1.2.5.1 · v1.2.5.2

- **v1.2.5 (13 Sep)** — a no-new-scope demo-safety patch clearing the demo-visible defects
  the 12 Sep flow re-check surfaced (register band tracking the filter, post-drag click no
  longer swallowed, declined projects showing no live agreement chip, budget 100% rule on
  the tick, short attention labels, zero-count chips hidden, F9–F17 alignment). Verified by
  an independent audit against v1.2.4 (verdict SHIP). `docs/CHANGES_v1.2.5.md`.
- **v1.2.5.1 (14 Sep)** — a top-bar **Tone** picker: seven accent swatches recolouring only
  the warm brand family on the fixed light base; choice persists. `docs/CHANGES_v1.2.5.1.md`.
- **v1.2.5.2 (15 Sep)** — that picker replaced by a **full seven-tone, dark-capable theming
  system** (`:root[data-tone]` palettes, light/dark identity sets keyed by ground, default
  **Dark Brass**; ~276 hardcoded colours retired to tokens, all seven tones AA), plus two
  **data-driven stepped approval lines** — Decision Point/CHaS and Cooperation Agreement —
  inside the stepper's gate-detail frame. `docs/CHANGES_v1.2.5.2.md`,
  `docs/CORE_API_v1.2.5.2.md`.

## What is new in v1.2.4

A Messages & Alerts pass (12 Sep 2026), driven by an Ask-gate with ToR. Full detail,
ToR's asks quoted in full and mapped to what shipped, the Ask-gate rulings, the file
inventory, the gate table and the honest lessons: `docs/CHANGES_v1.2.4.md`; the
independent audit this pass leans on for its Lessons section: `docs/AUDIT_v1.2.4.md`.

- **Messages & Alerts (P11), rebuilt.** Six type tags — Comment and Approval note
  (from `c.kind`, as before) plus Question, Decision, Note and System (from
  `state.activity`, never surfaced in this hub before) — text and bold only, no
  glyph, one equal-width frame each, differentiated by background and text colour
  (**Ask-gate ruling: six types, not two**). Column one is a stack: type tag, country
  flag, project id linking to the record. The row frame reads Date · Status · Sender ·
  Subject (**ruled: Date leftmost**), Status carrying the priority flag, the read tag
  and the select checkbox together. The body is one CSS-clamped line with the full
  text on `title` — a numeric-token atomic-box fix keeps a date or an amount from
  ever being cut in half. Multi-select "Clear from my hub" is a per-user dismissal
  (**ruled: "remove from my hub only, the record is untouched"**), never a mutation
  of the thread or the audit chain, with an inline "N cleared · Undo".
  `K.filterBar(page:'p11')` carries Time (Newest/Oldest) and Type (the grouping
  dimension: Project · Country · Sender). The pinned-projects rail is rebuilt around
  its real job — a project's own unread messages, count leading, every one listed and
  linked, with a button to mark that project's messages read.
- **Admin › Alerts (P8) gains `My alerts`.** Moved out of P11 and **ruled open to
  every persona for their own row** — the literal reading of ToR's ask would have
  locked non-admins out of their own digest hour and mute switch. It is the first tab
  in the strip, and the landing tab is now persona-aware (Sent log for admins, My
  alerts for everyone else); the other three tabs (Rule catalogue, Template editor,
  Director digest) keep exactly the gating they had before, independently
  reconfirmed across all nine personas. P8's own head moves onto `K.viewBar`.
- **The today marker's halo stops scaling.** ToR, mid-build: *"Line should only touch
  the circle, not see the line on circle at all… expanding upper frame to make circle
  rest inside the frame."* Two new tokens, `--k-tmd` (24px, the circle) and
  `--k-tmlane` (25px, the reserved lane), replace a scaling breathe with an
  opacity-only one and start the today line at the foot of the lane instead of its
  top — the circle keeps one radius, so "touching" is true at every frame, not one
  instant of the cycle. Measured on both charts: circle 24×24px, gap 0.0px,
  horizontal centring 0.0px.
- **Thirteen defects, all found by an independent audit, none of them visible to any
  gate — three of them hidden by the gates' own blind spots rather than merely
  missed.** The build was fully green, `ux_probe` reporting zero, `contrastFails`
  reading 0, before the audit found: the Messages grid overflowing and clipping on
  70 consecutive widths (881–950px) that no probed width or viewport-based
  breakpoint check could see; an "Unread" filter that let every activity row through
  unconditionally, so the chip and the count disagreed with what "Mark all read"
  actually cleared; one persona's cleared banner shown to the next persona after a
  switch; a character-level ellipsis cutting a date in half ("since the 14 Jul
  resubmission" → "since the 1…"); "2 selecteds"; a page note still naming a type
  ("Report") that had already been reverted everywhere else; two of six new type
  colours measuring ΔE2000 2.6 apart — the same colour; a pointer to the moved alert
  settings landing on the wrong tab; a pinned card capping a list its own contract
  said was uncapped; Messages left as the only list page with no framed bar, in the
  same pass that gave P8 one and quoted the rule against hand-rolling one; the alert
  tab strip losing a quarter of its width and running off a desktop window; an Alert
  centre head calling itself read-only above two live controls; and — the sharpest —
  the "one font family" gate staying green **only because nothing in the toolchain
  ever opened the tab this pass created**. Full write-up: `docs/AUDIT_v1.2.4.md`.
- **Version.** `APP_VERSION` is `'1.2.4'`, so the browser's storage key changes
  again: a v1.2.3 record is not read here and this build starts from fixtures. The
  schema is still 3, so **Restore from a v1.2.3 backup file works.** No fixture or
  schema change this cycle.

## What is new in v1.2.3

A second fine-tuning pass (12 Sep 2026), requested by ToR in two batches the same day
v1.2.2 shipped — specific enough to build from directly, so this round had no
Ask-gate. Full detail, the two batches quoted in full, the gate table and the
honest lessons: `docs/CHANGES_v1.2.3.md`; the independent audit this pass leans on
for its Lessons section: `docs/AUDIT_v1.2.3.md`.

- **Needs-you (P6) realign** — ToR: *"realign tab / contents / text-wrap, and make it
  more structured column, and make it more well arranged."* The collapsed row moves
  to a fixed-track grid (kind/name/meta/flag/money/actions all lining up down the
  whole list — 194 measured alignment failures → 0), with an explicit priority order
  (name → flag → money → status → action → id → kind tag) so the name and figures are
  never what gives way at a narrow width. Rows sharing a project pair visually rather
  than reading as duplicates.
- **The approval stepper** — ToR: *"align each process width to be the same."* The
  four rungs (`U.stepper`) become equal-width grid columns; the Decision Point/CHaS
  detail is a framed block pinned to whichever rung is actually current. Lands
  identically on every page that calls the stepper (P3, P4, P6, P10, P13) with no
  changes to those files themselves. The per-gate chip stops repeating a state the
  sentence above it already gives (`U.gateStep`'s new `pill:false`), and a
  manual-driver gate gets a one-line explanation.
- **TimeBlock (P5)** — ToR: *"indent details from each project, with background
  colour change to be more bold but related to header"* and *"sub action timeline
  will be half slimmer than project timeline."* A project's expansion indents on a
  darker step of its own country tint; every project draws a full-height, always-
  draggable envelope bar with any real phases as half-height task bars underneath —
  children stay the single source of truth, so the envelope is always their union,
  never a stored value of its own that could fall out of step with them.
- **The today marker** — the "today · date" pill on the Gantt and TimeBlock charts is
  gone; `K.todayMark()` perches a small animated chapel on the today line instead,
  showing the date on hover or keyboard focus, animation off under
  `prefers-reduced-motion`.
- **Twelve defects, all found by an independent audit, none of them visible to any
  gate.** The build was fully green — every automated gate, `ux_probe` reporting
  zero issues — before the audit found: the today marker half-clipped and its
  tooltip 100% unreadable; the Gantt marker's label doubled ("Today · today · 28 Aug
  26"); a one-day drag on a P5 project bar silently writing a 60-day change to
  `target_date`; a row component rendering two different grammars on adjacent pages;
  a third AA-contrast bite on a composited country tint; five pre-existing
  truncations (including the exact "197 read as 19" defect v1.2.2 had already
  written up once, on a different page); and the confirmation that `ux_probe` cannot
  see anything `position:absolute` — five screens were added to close its coverage
  gaps, but the day-to-day blind spot itself stands and the next pass must keep
  measuring absolutely-positioned elements by hand. Full write-up:
  `docs/AUDIT_v1.2.3.md`.
- **Version.** `APP_VERSION` is `'1.2.3'`, so the browser's storage key changes
  again: a v1.2.2 record is not read here and this build starts from fixtures. The
  schema is still 3, so **Restore from a v1.2.2 backup file works.** No fixture or
  schema change this cycle.

## What is new in v1.2.2

A layout and interaction pass (12 Sep 2026) driven by an Ask-gate with ToR: all five
reworked pages open **minimised** (one line per row, no wrap, no horizontal scroll),
share **one framed top bar** (header/status/country) and **one filter+sort strip**, and
read the same **attention flag** everywhere — rose past target, brass you owe an
action, amber-ink waiting past threshold, a faint rule when nothing's owed. A new
shared file pair, `js/uikit.js` and `css/uikit.css` (`CBP.uikit`, aliased `CBP.K`),
carries this grammar so it lives in one place instead of five.

- **Projects (P3)** — five fixed collapsed columns; the expansion is segment tabs
  (Status, Timeline, Budget, Contract when live, Comments).
- **Needs-you (P6)** — row height falls from 208–332px to 55px collapsed; the second
  sub-line, gate chips, ceiling bar and chain move into Actions/Gates/History/Budget
  segments.
- **TimeBlock (P5)** — a project opens to one consolidated, phase-coloured bar; expand
  reveals full per-phase drag/resize editing, unchanged from v1.0.3, on the same axis.
- **Budget (P7)** — country bars unfold in place into their project bars (several
  countries at once); a project bar is a real link to its record, which now shows a
  "← Back to Budget" crumb when reached this way.
- **Contracts (P12)** — a dashboard strip sits over country bands of collapsed rows;
  the row click expands it, and "Open agreement ↗" opens the full record.
- **Type scale (UX-01)** — 18 rendered sizes collapse to 6 (11.5/12.5/14/16/20/25);
  body text moves 14.5px → 14px.
- **Scroll cue (UX-03)** — a wide table gets a right-edge fade + "scroll →" hint only
  while it actually overflows; `budgettrack` renders as country cards at ≤480px.
- **Separators (UX-04, ToR ruling)** — system-generated " — " joins now read ": " or
  "·"; fixture and authored names are untouched. One frozen exception: the daily A-14
  digest subject keeps its em-dash because a persistence test pins that exact string.
- **Meta chains (UX-05, ToR ruling)** — long "·"-joined lines split across two lines at
  ≤1024px instead of running on or wrapping mid-word.
- **Version.** `APP_VERSION` is `'1.2.2'`, so the browser's storage key changes again: a
  v1.2.1 record is not read here and this build starts from fixtures. The schema is
  still 3, so **Restore from a v1.2.1 backup file works.** No fixture or schema change
  this cycle. Full note, including the page-logic caveat, the Ask-gate rulings and the
  lessons the pass left behind: `docs/CHANGES_v1.2.2.md`.

## What is new in v1.2.1

A patch release (5 Sep 2026): no new features, no new pages, no fixture or schema change. It
applies eight findings of `docs/UX_REVIEW_v1.2.0.md`: R1, R2, R3, R4, R5, R8, R10, R11.

- **Contrast now passes AA everywhere measured.** `--muted` moves #69747E → #5C6770 (the colour
  of every crumb, sub-line and hint), `--brass` #9A7833 → #85672A so white text on the primary
  button clears 4.5:1, `--verd` #3F7E72 → #366E63. The lighter brass survives as `--brass-tint`
  for bars and chip grounds, and two new text-only tokens (`--s3-ink`, `--s4-ink`) let the status
  fills stay pastel while the words that sit on them darken. Measured contrast failures: 1198 → 0.
- **Country flags are inline SVG, not emoji.** A 16 × 12 SVG per seeded country, because on
  Windows Chrome and Edge an emoji flag renders as two letters. `U.flagMark` keeps its signature,
  and `widgets.js` and `p11.js` now delegate to it, so there is exactly one flag source.
- **Touch targets at phone width.** A single `@media (max-width:768px)` block: buttons 40 px,
  chips 36, inline links 32, a scope chip's × 28, with the Needs-you card restacking to two
  columns under 1100 and one under 760. Desktop is untouched.
- **Accessible names and heading order.** Labels or `aria-label`s on the Restore file input, the
  mute checkbox, the hub search and the sign-in e-mail/password; `aria-label` on the draggable
  Timeline bars; Worker and Reviewer home headings step one level at a time (h3 → h2, h4 → h3).
- **`bt-chev`** goes 10 px to 12 px in the budgettrack widget.
- **Version.** `APP_VERSION` is `'1.2.1'`, so the browser's storage key changes: a record saved
  by v1.2.0 is not read by v1.2.1 and this build starts from fixtures. The schema is still 3, so
  **Restore from a v1.2.0 backup file works**, so take a backup before switching folders if a demo
  machine holds work worth keeping. Full note: `docs/CHANGES_v1.2.1.md`.

## What is new in v1.2.0

Seven features, one release, on top of v1.1.0:

- **Persistence + backup** — every mutation is saved to IndexedDB (localStorage fallback, then
  in-memory with a banner if neither is available); reloading the tab restores your work exactly.
  Administration › Data offers Backup now (a checksum-stamped, downloadable file), a scheduled
  backup written automatically whenever the clock advances (keeps the last 7), Restore from file
  (tamper-detected — a modified file is refused with a checksum message), Reset to fixtures, CSV
  export (projects, contracts, gate events, activity, outbox) and a `schema_version` with
  migrations, so a schema-2 (v1.1.0-shaped) snapshot loads and upgrades automatically.
- **Production database design pack** — `docs/db/` holds an ERD, a PostgreSQL 16 DDL (35 tables
  including 4 reference tables, row-level security by country scope, an append-only audit log),
  a backup/retention runbook and a data dictionary generated from the fixtures. Documents only;
  the demo's own snapshot format is the same logical model, mapped table by table in the ERD.
- **Four-rung stepper** — every project shows exactly four rungs, In development → Submitted →
  Approved → Implementation, from one shared helper, on the register, the project page, the
  Needs-you list, mobile and e-mail text. A declined project shows all four rungs with the one
  it died at struck through and a Declined tag, instead of the old two-pill shortcut.
- **"Needs you"** — Approvals becomes one ordered list (oldest wait first) with filter chips in
  place of the old six sections; each row carries a budget bar and a "who acted before me" chain
  line. Return/Reject/Dismiss take their reason inline, on the row — no modal. Personas with
  nothing to approve still see their read-only "Watching" rows rather than an empty page.
- **Role home pages** — signing in lands every persona on a home built for their role: Worker
  "My projects" (own records + a task checklist), Country Head "Needs you" plus a country
  roll-up, Regional Head "Portfolio" (countries as an ordered bar list, drilling to country then
  project in two clicks), Reviewer "My reviews" (money on the left, versions/attestations/
  screening on the right — there is no document store, so nothing here says "documents"), Viewer
  a curated read-only summary with one Export. Administration keeps the dashboard and gets a
  visibly tinted shell.
- **Two-bucket alerts** — every alert rule is classed immediate or digest; digest rules batch
  into one daily A-14 mail per recipient, folded by Administration › Data's "Advance day" or the
  Alerts page's "Run daily digest" button — never during a page render. Immediate mails carry
  Approve/Return/Confirm action buttons that deep-link straight to the row, pre-focused. Users
  set their own digest hour and a mute toggle on Approvals' "My alerts" panel.
- **Mobile approve** — the phone quick-view's rows now carry the same Needs-you actions and the
  same inline reason pattern as the desktop list, one tap to a dossier; signing an agreement
  stays a desktop-preferred flow.

## Run it

- **Local:** double-click `index.html`. No build step, no server, no network required
  (Google Fonts load when online; system fonts otherwise).
- **GitHub Pages:** serve this folder as the site root (Settings → Pages → deploy from branch).
  `.nojekyll` is included.

## The demo walk (under 12 minutes, no refresh)

Sign in from the front door, or use the persona switcher (top right) at any time. Since v1.2.0
every persona lands on a role home (`#/home`) rather than a shared board — Worker for Anik,
Portfolio for a Regional Head, and so on; the sidebar's old "Approvals" label now reads "Needs
you". From the home page, open Projects (P3) or a project directly to follow the walk below.
Since v1.2.2, Projects, Needs-you, TimeBlock, Budget and Contracts all open with their
rows **collapsed to one line** — click a row (or "Expand all" in its top bar) to see the
detail the steps below describe; nothing about the actions themselves moved, only what
shows before you open a row. v1.2.3 realigned those collapsed rows' own columns
(sharpest on Needs-you) and gave the approval stepper equal-width rungs, but touched no
action or route either. v1.2.4 rebuilt Messages & Alerts (P11) and moved `My alerts`
onto Admin › Alerts (P8) — neither page sits on the walk below, so it is unchanged
again; open Messages & Alerts or Admin › Alerts directly from the sidebar to see them.
Since v1.2.5.2 the app opens in the **Dark Brass** tone — pick a light tone from the
top-bar swatches if the room calls for it (the choice persists). v1.2.6 changed how
things are grouped and labelled, not what they do: the sidebar's Projects header is
still the Projects link; on a record, the alerts sit collapsed in one row above the
Pinned decision — click "N alerts" to open the cards — and the Approval status card
shows Decision Point beside CHaS and OGC beside Finance. Step 4 below is the best place
to see it: WE26BGD0002's tray carries the CHaS gate, the past target date and its unread
message together.

1. **Anik (M3, Bangladesh)** — create and edit a status-4 project; progress reads *"not submitted"*, never 0%.
   1b. **Still Anik, on WE26BGD0003** — Development tab: mint the review link on Project
   Concept, open it in a new tab as an anonymous reviewer, leave a comment. **Priya (M1)**
   then releases WE26NPL0011 (all four stages already Done) to submission — its Request
   submitted enables the moment the release lands. See `docs/DEMO_SCRIPT_v1.2.7.md`.
2. **Daniel (M2)** — open WE26BGD0005, **Request submitted** → status 3; stage clock restarts; the Needs-you queue gains an item.
3. **Priya (M1)** — Needs you: **Return to Review** (reason now inline, no modal), **Request approved** on WE26BGD0005 → external gate opens.
4. **Still Priya** — tick the gate: Decision Point submitted → approved, CHaS submitted → approved; **Mark Approved** demands both reference numbers → status 2. Contrast WE26BGD0002's CHaS counter (197 days and counting).
5. **Dashboard** — deselect Bangladesh in the scope selector: over-ceiling flips to headroom. Open the country league table (RD-1) and the director exception digest (RD-2) under Alerts.
6. **Bp. Santoso (Viewer)** — same dashboards, Bangladesh + Nepal only, every action gone, Export (RD-3 print pre-read) still works.
7. **Mobile** — toggle "Mobile device" on the sign-in page: quick view with period chips, approval cards, update feed, "Full site" escape (remembered).

## v1.1.0 demo walks

Two more walks on top of the seven steps above, exercising the External
Gate Connector and the Contracts gate. `tools/walk_egc.js` and
`tools/walk_contracts.js` automate both end to end - see "Run the tools"
below.

### EGC - admin flips a system, Priya confirms, the ladder shows why it's blocked

1. **Admin** - Administration › Integrations: put CHaS into **Assisted**
   mode.
2. **Still Admin** - pick project WE26NPL0010 in the simulator, step
   "approved", a reference and a date, **Simulate inbound event**. The
   panel reports back that a proposal was raised - nothing has written the
   gate yet.
3. **Priya (M1)** - Approvals: the new **Sync proposals** section lists
   it. **Confirm.** The gate pill on the project now reads "CHaS ·
   approved · via sim" with a deep link into CHaS.
4. **Priya, on WE26BGD0002** - a manual click of the CHaS gate, then
   **Mark Approved** with both references - the header gains the
   Corporate Agreement chip, in Draft.
5. **Admin, on WE26HKG0004** (status 2, no agreement yet, and the country
   the area office runs directly per the v1.0.4 ruling) - **Start
   implementation** is visibly disabled, its title reading "Corporate
   Agreement must be sent out first."

### Contracts - the full lifecycle, two reviewers, a signing ceremony

1. **Daniel (M2)** - Corporate Agreements: the register, the country
   chips, a new draft opened from the CT6 wizard on a status-2 project
   with no agreement.
2. **Daniel** - completes the draft-exit checklist (four attestations,
   due diligence verified, screening clear, partner, amount) and submits
   for review.
3. **Elena (OGC)** approves her review; **Rafael (Finance)** returns his
   with a comment - the agreement drops back to draft.
4. **Daniel** resubmits; **Elena** and **Rafael** both approve this
   round - the agreement clears for signature.
5. **Priya/Admin** starts the signing ceremony; **Daniel**, an eligible
   church signatory, opens CT3: scrolls the document to its end, ticks
   intent, types his name - only then does Sign enable.
6. The partner signature is recorded (wet ink) by the Area or Regional
   Manager - the agreement executes.
7. **Daniel** marks it Sent out, with a channel and reference - the
   contract gate is now met, and Start implementation on that project
   unblocks.

## v1.2.0 demo walks

Full presenter script: `docs/DEMO_SCRIPT_v1.2.0.md`. In brief, on top of
the walks above: edit a project as any persona, reload the tab — the edit
is still there; Administration › Data → **Backup now**, tamper the
downloaded file's bytes, **Restore from file** → refused with a checksum
message; **Advance day +1** as admin → one folded digest mail per
recipient with queued items plus one scheduled backup row; **Reset to
fixtures** → back to the fixture day with a two-step confirm. `tools/
test_persist.js` and `tools/walk_flow.js`/`tools/walk_roles.js` automate
persistence, the Needs-you list and all nine role homes end to end — see
"Run the tools" below.

## Personas

| Persona | id | Role | Scope | Notes |
|---|---|---|---|---|
| Area Office Admin | `admin` | admin | all | configures Integrations, Process, templates, signing authority |
| Priya N. | `priya` | m1 | BGD, NPL, IND | Regional Manager · South Asia |
| Marco T. | `marco` | m1 | KHM, MMR, LAO | Regional Manager · Mekong |
| Daniel K. | `daniel` | m2 | all | Area Manager; runs HKG's approvals and contracts (no M1 covers HKG) |
| Anik R. | `anik` | m3 | BGD | |
| Sunita M. | `sunita` | m3 | NPL | |
| Bp. Santoso | `santoso` | viewer | BGD, NPL | read-only; export still works |
| **Elena V.** | `elena` | **ogc** | all | **new in v1.1.0** - Office of General Counsel, Asia Area; contract reviewer only |
| **Rafael T.** | `rafael` | **finance** | all | **new in v1.1.0** - Area Finance Reviewer; contract reviewer only |

## Run the tools

From this repo's root (`. tools/env.sh` first sets up the browser path):

```
. tools/env.sh
node tools/gen-data.js          # regenerate js/data.js from fixtures/*.json
node tools/gen-data.js --check  # verify js/data.js is byte-identical to a fresh regen
node tools/smoke.js             # boot every persona through every route, file://, headless
node tools/test_egc.js          # unit-level checks on the EGC state machine
node tools/test_contracts.js    # unit-level checks on the Contracts state machine
node tools/walk_egc.js          # WP2 UI walk: admin flips CHaS, Priya confirms, the blocked ladder
node tools/walk_contracts.js    # WP4 UI walk: the full contract lifecycle through the real UI
node tools/test_persist.js      # v1.2.0: persistence engine, real headless Chromium (playwright)
node tools/test_flow.js         # v1.2.0: D.needsYou / D.rungOf / U.stepper / U.needsRow
node tools/walk_flow.js         # v1.2.0 UI walk: Needs-you list, inline return, P8 buckets/digest
node tools/walk_roles.js        # v1.2.0 UI walk: all nine role homes, the Data tab, Advance day
node tools/gen-dictionary.js    # regenerates docs/db/DATA_DICTIONARY.md from fixtures/*.json
node tools/ux_audit_v120.js     # contrast, touch targets, focus, type scale, dashes, a11y names
node tools/ux_probe.js          # clipping, overlaps, tab wraps, hscroll, fonts, 5 widths;
                                 # v1.2.3 added 5 screens (#/budget, both U.gantt hosts, P5
                                 # with a selection, Contracts expanded); v1.2.4 added 4 more
                                 # (#/messages for daniel selected/expanded/pinned, #/messages
                                 # grouped, #/alerts on My alerts controls + read-only) — still
                                 # blind to position:absolute (the today marker, P5's bars) and
                                 # to the 881-950px width band where v1.2.4's worst defect lived
                                 # (see docs/AUDIT_v1.2.4.md)
node tools/audit_identity.js    # RD-2 digest + P2 text vs the v1.1.0 baseline, every intentional
                                 # change resolved to a named ruling (18 ruled deltas, unchanged
                                 # since v1.2.2 — nothing since reaches this text)
node tools/flow_projects.js     # v1.2.4+ flow suites, one per page family: projects, timeline,
node tools/flow_timeline.js     # budget, approval, messages, persist — real Chromium, screenshots
node tools/flow_budget.js       # to tools/shots_flow_*/ (delete before packing)
node tools/flow_approval.js
node tools/flow_messages.js
node tools/flow_persist.js
node tools/flow_perm.js         # F-6 permission truth table, DIFFERENTIAL: needs the baseline
                                 # tree beside this one (../CBP_v1.2.6/ for v1.2.7); expected
                                 # 260/1 — the 1 is the F7 santoso-clear ruling item, red on purpose
node tools/align_probe.js       # column/label alignment across the register and Needs-you rows
node tools/test_docgen.js       # v1.2.7 NEW: builds concept/orgpack/areapack for the seeded
                                 # projects, validates the zip, parses every XML part, byte-
                                 # identity across two builds, python-docx cross-check (224/0)
node tools/flow_dev.js          # v1.2.7 NEW: UI walk — stage flips, images, generate, mint/
                                 # revoke a link, public comment, portal mail, release, the
                                 # R-3a gate (94/0)
```

The differential gates (`flow_perm.js`, `test_flow.js`'s sub-line diff, `audit_identity.js`)
expect the earlier release folders to sit beside this one under `50 - Build/` exactly as the
vault keeps them; run from a lone copy they report a missing tree, not a regression.

`gen-data.js` is the only thing allowed to write `js/data.js` - never
hand-edit it; edit the matching file under `fixtures/` and regenerate.
The walk scripts drive real Chromium against `app/index.html` over
file://, fail on any console error, and drop screenshots into
`tools/shots_wp2/`, `tools/shots_wp3/`, `tools/shots_wp4/` and
`tools/shots_flow_*/` - delete these before packing a release;
`tools/evidence/` is the only screenshot directory that ships (v1.2.6's
own shots are the `v126-*.png` files there, plus the audit set under
`tools/evidence/audit126/`).

## Apply on a fresh clone

This folder (`app/`, alongside `fixtures/`, `tools/` and `docs/` at the
repo root) is the **complete, self-contained application** - not a patch
or a change-pack layered onto some other checkout. There is no "base" to
apply this on top of and no pack stacking: clone the repo, open
`app/index.html`, and every change from v1.0 through v1.2.7 is already there,
generated from the fixtures already in `fixtures/`. Earlier releases live in their
own sibling folders (`CBP_v1.2.6/`, `CBP_v1.2.5.2/`, …) and are never edited.

## Structure

```
index.html          shell + script wiring (load order matters)
css/                app.css (tokens + shared components; v1.2.3: stepper grid,
                    --rose-ink, .k-today; v1.2.4: .k-today's top reads
                    var(--k-tmlane)) · page styles · home.css / p9data.css
                    (v1.2.0) · uikit.css (v1.2.2 shared view kit; v1.2.3 §9: the
                    today-marker component, §1: the segment label grid; v1.2.4:
                    §9's --k-tmd/--k-tmlane tokens, opacity-only halo breathe) ·
                    v101-msg.css (P11, rebuilt v1.2.4: the fixed row grid, the
                    six type-tag colours, the clamp/atomic-figure fix) ·
                    p7p8.css (P8; v1.2.4: the My alerts font fix, the tab
                    strip's segment stacking tier) · v1.2.5.2: app.css carries the
                    seven :root[data-tone] palettes + the two data-ground identity
                    sets · v1.2.6: app.css .side a.navhead/.sub (sidebar header band
                    + child indent), v101-proj.css .l3-* (labelled register cells),
                    p4v126.css NEW (book tabs .bk-*, alert tray .atr-*, split status
                    cards .sc-*, the ≥1280 aside width) — loaded last, after uikit.css ·
                    v1.2.7: v101-proj.css .l-open/.xopen, p3dev.css NEW (.dv-* front
                    view: year strip, budget triple, brief, dot rail), p4dev.css NEW
                    (.pd-*/.pdc-*/.ed-* Development tab, editor toolbar, stage chips),
                    p18.css NEW (public review page .rv-*), print.css NEW (.dc-* print
                    sheet shared by p18/p19, the @media print tone re-point)
js/config.js        TODAY constant + thresholds - the demo ages from here; v1.2.6: NAV
                    rows carry head/child flags (Projects header, indented children);
                    v1.2.7: DEV_STAGES/DEV_RECIPIENTS/DEV_IMG_MAX/DEV_IMG_BYTES,
                    ROUTES += review/doc
js/data.js          GENERATED from ../fixtures/*.json - the only place numbers live
js/uikit.js         v1.2.2 - the shared view kit (CBP.uikit / CBP.K): state bags
                    (flt/col/seg), collapse, the attention flag, filter+sort, the
                    framed top bar, the scroll cue; v1.2.3 adds K.todayMark and the
                    .k-bwrap segment-content grid - see docs/CORE_API_v1.2.3.md
                    (extends, does not replace, docs/CORE_API_v1.2.2.md); byte-
                    identical in v1.2.4 - that pass needed no kit JS change
js/derive.js        pure derivations (coverage, clocks, league table, permissions,
                    v1.2.0: D.needsYou, D.rungOf, D.portfolio, D.countryHome, …;
                    v1.2.3: ganttModel.todayLabel is the date alone, no prefix);
                    byte-identical in v1.2.4
js/store.js         state + dashboard seed (5 boards per blueprint RM-4); v1.2.5.x:
                    CBP.TONES / DEFAULT_TONE / setTone + ui.tone; v1.2.6: ui.p4AlertsOpen
                    default (false, not persisted); v1.2.7: devStages/devSeq domain
                    slices, ui.devDraft/ui.reviewSent (session-only, not persisted)
js/actions.js       every mutation: submit / return / reject / gate / mark approved / activity /
                    advanceDay / runDigest / setAlertPref (v1.2.0); v1.2.4: the
                    dead msggroup handler made string-safe against ui.msgGroup's
                    boolean-to-string change; v1.2.6: the one new act, 'p4alerts'
                    (alert-tray toggle), beside 'p4tab'; v1.2.7: every dev-* act
                    (§"Acts table" in docs/CHANGES_v1.2.7.md) + review-comment, the
                    R-3a gate on A.can(user,'submit',p), send()'s opts.external
js/persist.js       v1.2.0 - the whole persistence engine: boot/save/restore/reset, backups,
                    CSV export, IndexedDB → localStorage → memory fallback ladder;
                    byte-identical in v1.2.4 - P11's msgSel/msgCleared/msgUndo are
                    deliberately excluded from UI_KEYS, not persisted; v1.2.7:
                    DOMAIN_KEYS += devStages/devSeq, MIGRATIONS[3] (schema 3→4)
js/ui.js, widgets.js  shared components + 13-widget dashboard library +
                    v1.2.0 U.stepper/U.needsRow/U.taskList/U.chain/U.countryBarRow
                    (v1.2.2: U.needsRow rewritten for P6's collapse; v1.2.3:
                    U.stepper's equal-column grid, U.gateStep's pill option,
                    U.needsRow now builds the row's own id in place); byte-
                    identical in v1.2.4
js/egc.js           v1.1.0 - External Gate Connector: sync modes, proposals, outbound queue
js/contracts.js     v1.1.0 - Corporate Agreement lifecycle: reviews, signing, amendments
js/docgen.js        v1.2.7 NEW - CBP.docgen: build/toHtml/toDocx/download for the
                    concept/orgpack/areapack document model; a stored (uncompressed)
                    zip, CRC-32, fixed DOS dates, numbering.xml for bullets, images
                    via atob + PNG IHDR/JPEG SOF sizing; sanitize/htmlToBlocks/
                    plainToHtml for the section editor. See docs/CORE_API_v1.2.7.md §7
js/pages/           p1 sign-in · p2 dashboard · p3 register (v1.2.2 reframe; v1.2.6:
                    labelled Stage/Gate|Timing/Attention cells; v1.2.7: the right-most
                    Open column, devFrontView() for status-4 projects) · p4 detail
                    (v1.2.6: book tabs, alertTray() replacing unreadStrip(), DP|CHaS and
                    OGC|Finance cards; v1.2.5.2: the two step-lines via U.stepper;
                    v1.2.7: the Development tab, the In-development aside card) ·
                    p5 timeline (v1.2.2 reframe; v1.2.3: project/task bar tiers,
                    the indent tint) · p6 needs you (v1.2.2 reframe; v1.2.3: the
                    fixed-track collapsed row, relocateId deleted; v1.2.7: the
                    dev-release row) ·
                    p7 budget (v1.2.2 reframe; v1.2.3: one sentence corrected) ·
                    p8 alerts (v1.2.4: gains My alerts, persona-aware landing
                    tab, head moved onto K.viewBar; v1.2.7: reply_to + External chip
                    on outbox rows) · p9 admin · p10 mobile ·
                    p11 messages & alerts (v1.2.4: rebuilt - six type tags, the
                    column-one stack, the Date/Status/Sender/Subject frame,
                    multi-select clear, K.filterBar, the rebuilt pinned rail;
                    alertPanel() deleted) ·
                    p12 Corporate Agreements (v1.2.2 reframe) ·
                    p13 worker home · p14 country home · p15 portfolio · p16 reviewer home ·
                    p17 viewer home (v1.2.0 role homes) ·
                    p18 v1.2.7 NEW - public review page, route review, fullbleed, no
                    persona · p19 v1.2.7 NEW - print/PDF view, route doc, fullbleed
```

## Fixtures — v1.2.7 additions

`fixtures/dev_stages.json` NEW - the devStages seeds for WE26BGD0003 / WE26NPL0011 /
WE26BGD0005 (see `docs/04_DATA_MODEL.md` §"v1.2.7 additions"). `fixtures/meta.json` -
schema_version 4. `tools/gen-data.js` picks it up alongside the other fixture files.

## Ground rules honoured

Every number on screen is **derived** from the fixture data - nothing hard-coded. Day counters
derive from `CONFIG.TODAY` (2026-08-28). The status ladder keeps the client's original numbers:
**4 In Development → 3 Submitted → 2 Approved → 1 Implementation** (+ Declined). Formal approval
happens outside the platform (Decision Point + CHaS); the platform tracks it as a clocked,
M1-only gate with mandatory reference numbers at Mark Approved.

## Known demo simplifications (say these out loud to the client)

State is client-side, saved to the browser's own IndexedDB (v1.2.0) — a reload keeps your work,
but the record lives only on this machine, in this browser profile; nothing is synced to a
server and clearing site data loses it. Emails render to the in-app outbox (Alerts → Sent log)
and to a simulated daily digest; there is no real mail transport. The CHaS pull is a fixture,
not a live call. Sign-in accepts anything; SSO is a stubbed button (SSO-ready UI per D-10).
Dashboards live in shared demo state across personas. The eight catalogue-only alert rules
(A-06, A-08 through A-11, A-13, A-20) are listed with a bucket for completeness but never
actually raised anywhere in this build. There is no document store: Contracts and the Reviewer
home show version history, attestation checkboxes and a screening line — never a file.

## As-built rulings (deviations from the papers, decided in build)

- v1.2.0: byte-identity of the RD-2 digest and the P2 attention headline holds only at
  `advanced_days === 0` with a wiped store (`?nopersist` on the URL query, never the hash) -
  advancing the clock legitimately changes wording after that point.
- v1.2.0: the folded daily digest reuses the catalogue's own **A-14** id rather than a new
  literal id, retimed to daily.
- v1.2.0: `D.phaseDeadlines`'s overdue (negative-day) branch is opt-in (`{overdue:true}`) rather
  than always on - two day-0 fixtures already have an ended phase, and an unconditional branch
  would have changed the P2 attention text and broken the byte-identity gate.
- v1.2.0: Worker home (P13) is strictly own-records-only for every role that can reach it,
  including admin and a Regional/Area Manager opening `#/worker` directly by URL - admin and
  Daniel see an empty state pointing at the Projects register rather than every project.
- v1.2.0: P15's fourth portfolio sort option is `exceptions` (count of open exceptions per
  country), not `headroom`, to match the brief's chip set; `headroom` and `queue` stay reachable
  through the underlying derive helper but are not offered as a chip.
- v1.2.0: P1's persona-routing footer sentence still describes the pre-v1.2.0 destinations
  (Regional Manager → Approvals, etc.) - routing itself now sends every persona to a role home;
  the sentence was not updated in this release (`app/js/pages/p1.js`).
- Gate day-counters always derive; the seeded "196 d" was a day-old snapshot - it derives to 197 at TODAY.
- Status-2 progress reads italic *"starts at kickoff"* (blueprint semantics outrank the sample's 0%).
- Country queue = statuses 4+3+2 (`D.queueCount`) - the only self-consistent reading; Lao PDR = 1.
- Approvals badge counts items actionable *by me* (hidden for M3 / viewer / admin).
- Mark-approved and 2→1 notices use `SYS-*` ids; catalogue ids A-01…A-14 fire only at their docs/05 triggers.
- v1.2.2: the legacy status filter, search text and country-chip state keys
  (`p3Filter`/`p3Search`/`p3Countries`, `p6Filter`, `p12Filter`/`p12Search`/`p12Countries`)
  stay exactly where they were rather than moving into the new `flt` state bag, because
  frozen walks and deep links read those exact keys; `K.BIND` is the map from a page to
  its legacy key.
- v1.2.2: the A-14 daily digest subject keeps its em-dash ("Daily digest — 2026-08-29")
  rather than following the UX-04 separator ruling, because `tools/test_persist.js:289`
  pins that exact string.
- v1.2.2: P12's collapsed row is a `<tr role="button" tabindex="0">`, not a `<button>` —
  the one ruled exception to the collapse contract, because a button cannot span a table
  row's cells and Contracts needs the table for column alignment.
- v1.2.2: `tools/walk_contracts.js:90` is the one test-file line this pass touched,
  because the row click became the row's expand action (Ask-gate ruling 2.2), so the
  walk now clicks the explicit "Open agreement" link instead of the row.
- v1.2.3: a phase-less P5 project bar with no stored `target_date` is inert — not
  draggable at all — rather than inventing a target date out of its nominal
  90/120-day display placeholder; only a bar with a real stored date can be dragged.
- v1.2.3: Contracts' page head still carries a `pagehead` class alongside the kit's
  own `K.viewBar` markup, purely so `tools/walk_contracts.js`'s frozen `.pagehead h1`
  selector keeps finding the title — a page reaching into a kit-owned class, ruled
  acceptable rather than rewriting a frozen walk in a page-only pass. Carried to
  `docs/CONTINUE_v1.3.md` as consistency item 13.
- v1.2.3: `.p12-sub` (the Contracts register's id+name line) now ellipsises the
  project name rather than letting a long name wrap the row taller than its
  neighbours (106 rows affected) — the id leads the line, so no figure is ever at
  risk, and the partner name is shown in full on the line above.
- v1.2.4: `My alerts` is open to every persona for their **own row** — reading
  ToR's ask literally would have made it admin-only, matching the rest of P8,
  but that locks Priya, Anik and the two contract reviewers out of their own
  digest hour and mute switch, which is worse than where the panel was.
- v1.2.4: P8's default landing tab stays the Sent log for admins; every other
  persona lands on `My alerts` instead — resolved once, in `p8.js`'s own
  `ensure()`, so a persona switch re-resolves it on the next render without
  extra wiring. `tools/audit_v120/a5_needs.js` now names the tab it means to
  test (`outbox`) rather than leaning on the (now persona-aware) default.
- v1.2.4: activity-derived message types (Question/Decision/Note/System) carry
  no per-user read state, and this stays presentational rather than reaching
  into `CBP.commentById` — doing so would move `D.unreadCount`, which feeds
  the sidebar badge and the identity gate. Carried to `docs/CONTINUE_v1.3.md`
  as consistency item 18.
- v1.2.4: clearing a message from the hub ("Clear from my hub") is a per-user
  view dismissal, deliberately not persisted (`ui.msgSel`/`msgCleared`/
  `msgUndo` are excluded from `persist.js`'s `UI_KEYS`) — a reload restores
  every cleared row. Clearing twice in one session strands the first batch
  behind the second's undo banner; disclosed on screen and fixed by reload,
  not by a second Undo. Carried to `docs/CONTINUE_v1.3.md` as consistency
  item 17.
- v1.2.4: `ui.msgGroup` changed from a boolean to one of four strings (`''` /
  `project` / `country` / `sender`); a pre-v1.2.4 boolean value migrates in
  place on the next render (`true` → `'country'`, `false` → `''`).
  `actions.js`'s dead `msggroup` HANDLERS entry was made string-safe rather
  than deleted, since a future caller could still dispatch it by name.

Provenance: built 28 Aug 2026 by the Adeptio working session (orchestrator/architect + two
builders + independent auditor) from the `cbp-demo` build kit; spec lineage lives in
`../docs/` and `../reference/` in the vault, which are not part of this deployable folder.

## v1.0.1 (29 Aug 2026) — change set

Built on v1.0 by the same working-team pattern (architect + core builder + five parallel page
builders + independent audit; full contract in `../ARCH_v1.0.1.md` + `../CORE_API_v1.0.1.md`).

- **Navigation** — Dashboard moved to the top of the sidebar; new **Messages & Alerts** menu
  (`#/messages`) with a live unread balloon; "+ New dashboard" removed from the Dashboard page
  and relocated to Administration → Dashboards & datasets (with the predefined widget catalog).
- **Projects** — multi-country selector chips; layered country bands (structural glass tint)
  with inset project cards; per-project comment pill; breadcrumb + "Back to projects" return
  flow after every record save; edit area covers all record fields.
- **Comments** — flat, editable ("(edited)"-stamped) per-project comments with name, date and
  time; unread strip on the project page; viewer reads but never writes.
- **Approvals** — requester↔approver notes thread per entry (✓/↩ voices); Decision Point and
  CHaS dates editable by M1/Admin with derivation-guarded validation; counters re-derive live.
- **Messages & Alerts hub** — unified comments + approval notes; Unread/All, search, sort,
  group-by-country, priority flags, per-row read toggles, pinned-projects rail, mark-all-read.
- **Dashboard** — per-board edit mode (drag/arrow reorder, 1×/2×/3× resize, remove, add from
  catalog, Save/Cancel on a draft); layouts persist per board.
- **Timeline** — phase balloons and target diamonds draggable (day-snapped, live date tooltip)
  with click + nudge fallback; every move logs to the activity stream.
- **Budget** — all utilisation bars share one scale so every 100% mark aligns on a single rule
  (over-ceiling crosses it, hatched); new **Reports** (custom report builder + print) and
  **Forecasting** (2024/2025 history vs 2026, editable 2027 plan) sub-menus; **Sync dashboards**
  adds the "Budget years 2024–2027" widget to the Budget Utilisation board.
- **Data** — new fixtures `comments_seed.json` and `budget_history.json` (2024/2025 are
  synthesized demo history; 2027 plan editable in-session), regenerated into `js/data.js`.

### v1.0.1 as-built rulings

- Viewer's unread balloon is a count only — read/flag/pin/composer controls are not rendered
  and the API refuses them.
- Approval-note composer = approver + requester side (M1/M2/Admin); M3 is routed to the
  project's own comments instead.
- Approvals entries collapse after completed approval actions; gate edits and notes keep the
  entry open so the re-deriving counters stay visible.
- Dashboard spans are proportional within their row (1+1 renders 50/50), reproducing the v1.0
  layouts exactly from the seeded `layout` maps.
- A phases-only or timeline-gesture save never arms the "Back to projects" bar; record saves do.
- Report-builder defaults are a session preference and stay available to the viewer (no data
  write), consistent with "export still works".

## v1.0.2 (29 Aug 2026) — minor edit

- **TimeBlock** — the Timeline page is remarked as the TimeBlock add-on module: sidebar entry
  "TimeBlock" with an "Add-on" chip, page header badge, and every full-editor remark now reads
  "Open full editor in TimeBlock" (P3, P4, P5, deep-link notice, admin integrations row).
- **Forecasting simulation** — new "2027 projected" column and a faded fourth comparison bar:
  a least-squares extension of the 2024–2026 utilisation trend (`D.trend2027`), derived on
  every render, marked with "≈" and italics so simulation never reads as record data.
- **Brand** — sidebar mark is now "Church Budget&Project MS" with a gold chapel glyph carrying
  a slow lux shimmer and three twinkling glints (pure CSS, honours `prefers-reduced-motion`;
  the mobile quick-view mark follows).

## v1.0.3 (29 Aug 2026) — minor edit

- **Country identity system** — every seeded country carries its flag (emoji) and a pastel
  palette drawn from its international flag colors (bold pastel headers, light pastel row
  areas, saturated accent rules; AA-contrast tuned, C-21 tokens in app.css). Applied to the
  Projects country selector chips, the country group bands, and mirrored across the Messages
  & Alerts hub (rows, chips, group headers, pinned cards) so both pages read as one system.
- **TimeBlock** — the "Add-on" chip is now **Required Licenses** (nav, page badge, admin
  integrations row). Phase bars are resizable by dragging either end (day-snapped, start<end
  guarded); the date remarks tied to the bar update live during the drag, and the selection
  tray gains Start/End ±1 day nudges. Commits keep the single projectUpdate path + log line.
- **Alerts** — column widths rechecked in all four sections; rule ids no longer wrap.
- **Forecasting** — per-country, per-year numbers are configurable (history years editable;
  2026 stays derived from live records); the comparison graph and the trend projection
  re-derive from configured numbers; years can be added backward (back-cast seeds) and
  forward (new plan years, trend seeds), added years removable (×).

### v1.0.3 as-built rulings

- Pastel country tints are an explicit client request and override the "no tinted cards"
  rule for country bands/rows only; text on pastel steps up to slate/ink for AA contrast,
  and the IND/MMR accent rules are darkened from literal flag yellows to clear 3:1.
- Flags are emoji (macOS demo); unknown countries fall back to a neutral palette, no glyph.
- LAO pairs a red pastel with the flag's blue accent rule to stay distinct from NPL crimson.
- A.histSet stays country-scope-checked; year add/remove is area-level (plan permission).
- The projection column keeps targeting the first year after the live budget year (2027).

## v1.0.4 (29 Aug 2026) — dashboard enhancement

- **Hong Kong (HKG)** — the 7th seeded country, with data across the whole platform: 4
  projects (WE26HKG0001 status 1 with phases, WE26HKG0002 status 3 submitted 20 Aug,
  WE26HKG0003 status 4, WE26HKG0004 status 2; committed $975,000 = 97.5% of the $1,000,000
  ceiling), 2024/2025 history (58%/66%) plus an editable 2027 plan of $900,000, 3 seeded
  comments (C15–C17), 2 activity entries, and the 🇭🇰 flag wherever flags render (P3, P11).
  It carries its own **bauhinia-purple** `cc-hkg` palette rather than a literal red/white
  reading of the flag — see the ruling below.
- **Dashboard — Overview reworked** — a new **Budget track — country detail** widget leads
  the board: per-country rows show the year's ceiling, the committed spend split
  Implementation / Approved / Submitted / In development under one "Actual spend" group
  header, and a mini budget bar for every country aligned to a single shared scale.
  Expanding a row lists that country's projects grouped by status rung, with counts and
  totals matching the header columns, each project linking to its page; open records show
  "in queue N d" from the queue clock, status-1 records show "implementing since" their
  start date.
- **Dashboard — new Unread messages & alerts widget** replaces the segmented budget bar on
  Overview (the bar and the compact country coverage widgets stay in the predefined
  catalogue, one click away in Edit layout). Per-country rows show the signed-in persona's
  unread count and that country's open alert count; expanding a row shows an "N unread
  messages" header, up to 3 of the briefest unread items linking to their projects, that
  country's alert lines, and a link through to Messages & Alerts.
- **Dashboard — Needs attention reworked** into two labelled sections: **Approval
  required** (status-3 records waiting longer than the configured wait since submission,
  longest first, red day counts) and **Project timeline alert** (implementation phases
  ending inside the configured window, soonest first, brass at 30 days or closer, red at 7
  days or closer). Both thresholds live in `config.js` (Admin-configurable in the real
  product); the RD-2 director exception digest is untouched.
- **Live examples** — with `CONFIG.TODAY` at 2026-08-28, WE26HKG0002 shows 8 days waiting
  in Approval required (submitted 20 Aug); WE26HKG0001's "Distribution rounds" phase ends
  15 Sep, 18 days out, in Project timeline alert. WE26BGD0002 is a standing reminder that
  the platform runs two independent clocks off two different start dates: its approval
  wait derives from `submitted_at` (210 days), while its CHaS gate clock derives from the
  gate's own `submitted_at` (197 days) — both correct, neither the other.

### v1.0.4 as-built rulings

- Hong Kong's flag is red and white; its bauhinia flower is purple. The country's palette
  is built from the bauhinia, not the flag ground, because a red `cc-hkg` would sit next
  to NPL's crimson and LAO's red with nothing to tell them apart at a glance.
- Hong Kong ships with area-office scope only: **daniel** (M2, area-wide) and **admin**
  see it; **priya**, **anik** and the viewer persona do not, and no seeded M1 covers it
  (Priya's scope is South Asia, Marco's is Mekong). Accepted for the demo — approvals for
  Hong Kong sit with the area office until an M1 region is assigned.
- `budgettrack` and `msgalert` both carry a full, scrollable per-country list rather than a
  single figure, so the Overview seed gives each the full board width; `budget` and
  `coverage` are unchanged widgets that simply leave this one board's default seed.
- `W.exceptionSet` and the RD-2 director digest read from it unchanged; the two attention
  sections on Overview are a new read of the same derived exception set, not a new one.

## v1.1.0 (2 Sep 2026) - External Gate Connector + Contracts

Built by the same working-team pattern (architect + four parallel builders + independent
audit; full contract in `../docs/ARCH_v1.1.0.md` + `../docs/CORE_API_v1.1.0.md`).

- **External Gate Connector (EGC)** - Admin › Integrations configures CHaS and Decision
  Point (driver, sync mode, health, field mapping, an inbound-event simulator, a
  pasted-export importer). Three sync modes per system - Manual, Assisted (inbound events
  become proposals for a Regional Manager to confirm), Auto (trusted inbound events write
  the gate directly). One append-only event log records every gate write, manual or
  inbound; an outbound sync queue never blocks the approval ladder on a failure, showing a
  red chip and a deep link instead. Every surface that shows a gate step - the Projects
  stepper, the project gate tracker, Approvals, Alerts, the RD-2 digest, mobile quick view,
  the sidebar badge - now reads it through one shared helper.
- **Contracts** - a new Corporate Agreements section (`#/contracts`) holding the full
  Corporate Agreement lifecycle: draft, parallel OGC/Finance review, approved for
  signature, a signing ceremony with a scroll-and-intent gate, executed, sent out, active,
  with amendments as child agreements. Wired as the last gate of project approval: a
  project at or above the Corporate Agreement threshold cannot start Implementation until
  its agreement has been sent out; a draft opens automatically at Mark Approved.
- **Reviewer roles** - two new personas, Elena V. (OGC, Asia Area) and Rafael T. (Area
  Finance Reviewer), added purely to review Corporate Agreements; neither has any project
  action.
- **Data** - new fixtures `contracts.json`, `integrations.json`, `gate_events_seed.json`,
  `contract_templates.json`, `signing_authority.json`, plus `users.json` (the two reviewer
  personas) and small additions to `projects.json`, `delegations.json` and
  `seed_attention.json`; regenerated into `js/data.js` via `tools/gen-data.js`.

### v1.1.0 as-built rulings

- The contract gate is **threshold-driven**: `CONFIG.CONTRACT_THRESHOLD_USD` ($50,000,
  editable in Admin › Process), not always-on - settling the open question left in the
  scaffold plan.
- Hong Kong still has no seeded M1 (per the v1.0.4 ruling), so its Corporate Agreement
  steps in the demo walk - approving for signature, starting the signing ceremony - are
  run by the area office (`daniel`, `admin`) rather than a Regional Manager.
- `state.signingDelegations` is a new slice, kept fully separate from the platform's
  pre-existing (and unrelated) `state.delegations`, which is RD-5 widget data.
- An Excel/CHaS export import is always advisory, regardless of sync mode - a pasted row
  can raise a proposal but never write a gate on its own.
- An amendment in progress (`amending`) never re-blocks a contract gate the project has
  already satisfied; the gate only re-closes if the agreement itself is terminated.
- No persistence, no e-signature vendor, no real network calls - every EGC driver is
  simulated in-memory, and a page refresh resets both new engines along with everything
  else in the demo.

## v1.2.0 (3 Sep 2026) — Flow pass + persistence

Built by the same working-team pattern (architect + five parallel builders + independent audit;
full contract in `../docs/ARCH_v1.2.0.md` + `../docs/CORE_API_v1.2.0.md`).

- **Persistence + backup** — `js/persist.js`, loaded immediately before `app.js`; every render
  saves a debounced snapshot to IndexedDB (localStorage, then in-memory, on failure). Reload
  restores it; Administration › Data adds Backup now, a scheduled backup on every clock advance
  (keeps 7), Restore from file with checksum tamper-detection, Reset to fixtures, and CSV export
  for projects/contracts/gate events/activity/outbox. `schema_version` moves to 3; a v1.1.0-shaped
  (schema 2) snapshot migrates on load.
- **Production database design pack** — `docs/db/` (ERD, PostgreSQL 16 DDL, backup/retention
  runbook, generated data dictionary) — see `docs/db/README.md`.
- **Four-rung stepper, one source** — `D.rungOf(p)` feeds the register, the project page, the
  Needs-you list, mobile and e-mail text; a declined project shows all four rungs, the one it
  died at struck through.
- **"Needs you"** — Approvals (P6) becomes one ordered list with filter chips, replacing the six
  v1.1.0 sections; inline reason composer for Return/Reject/Dismiss.
- **Role homes** — new routes/pages P13 Worker, P14 Country Head, P15 Regional/Portfolio, P16
  Reviewer, P17 Viewer; every persona's sign-in landing is now their role home (`#/home`).
- **Two-bucket alerts** — every rule is `immediate` or `digest`; digest rules fold into one daily
  A-14 mail per recipient from Administration › Data's Advance day or the Alerts page's Run
  daily digest button. Immediate mails carry Approve/Return/Confirm buttons that deep-link to
  the row.
- **Mobile approve** — P10 rows use the same Needs-you actions and inline reason pattern as the
  desktop list, replacing the modal-only approve path.
- **Clock** — `state.clock = {today, advanced_days, backup_seq}`; Administration › Data's
  Advance day (+1/+7) moves `CONFIG.TODAY` forward, which is what makes digest folding, SLA
  nudges and scheduled backups demonstrable.
- **Data** — no new fixture *keys* this cycle beyond `fixtures/meta.json`'s `schema_version: 3`;
  everything else added (`clock`, `alertPrefs`, `digestQueue`, per-row `bucket`/`delivered`/
  `actions`) is runtime state, not fixture data.

### v1.2.0 as-built rulings

See "As-built rulings" above — the six v1.2.0-specific rulings are listed there alongside the
earlier releases' rulings, in the order they were decided.

### v1.2.0 known polish backlog (not defects; not done this cycle)

- A project owing two actions at once (a gate and its agreement) renders as two full Needs-you
  rows rather than one grouped row — this is `D.needsYou`'s shape, not a page bug.
- The country ceiling bar's "ceiling $1,000,000" caption repeats on every row of a bar list
  (P15/P17) where every ceiling is identical; a per-list "print once" option would read cleaner.
- P16's attestation grid puts the fourth attestation on its own second row at 1440px (three fit
  per row).
- The P9 tab strip still scrolls sideways at 390px (pre-existing v1.1.0 behaviour); the new
  "Data" tab sits off-screen until scrolled.
- P8's Sent-log outbox groups (Sent immediately / Daily digest) do not collapse; a long session
  makes the immediate group long.
