## PROJECT_STATE.md — Frontend React

Last updated: 2026-03-31 18:30 CST — Commit: pending

---

## 1. Technical Header (Snapshot Metadata)

PROJECT_NAME: Email Cleaner & Smart Notifications — Frontend (React)
SNAPSHOT_DATE: 2026-03-31 18:30 CST
COMMIT: e6fffa6
ENVIRONMENT: feature/ux-review-bundle-experiments
BRANCH: feat/ux-review-bundle-experiments
WORKING_TREE_STATUS: Dirty (Dashboard and Shell redesign completed and verified)
TEST_STATUS: PASS (All tests passed locally, including SummaryPanel, SettingsPage, and AppShellViews)

Notes:
- This snapshot reflects only the React frontend repository.
- Fastify backend and ML service are external dependencies.
- The Husky/comment-hygiene slice is already merged into `develop`; there is no pending hook-migration branch to resume.

---

## 2. Executive Summary

- Summary is shown in a right-side drawer (Sheet) opened from the header.
- Suggestions load from `/api/v1/suggestions` and render actionable emails.
- Summary aggregates load from `/api/v1/notifications/summary` with period controls.
- History screen loads paginated data from `/api/v1/notifications/history`.
- Inbox and Settings views are available from the app shell navigation.
- Confirmation actions call `/api/v1/notifications/confirm` and update UI state.
- Public Home page now launches Google OAuth directly for unauthenticated users at `/`.
- `src/pages/HomePage.jsx` now uses a dark aurora hero with React-aligned headline gradients, a faux window-style inbox mockup, and the current selected visual direction for the public landing experiment.
- Login view is reserved for callback errors, session expiry, logout, and deliberate `/login` access.
- Open Graph / Twitter tags are defined in `index.html` with assets in `public/`.
- `InboxList` now exposes the `Revisar recibo` row action for the first `HU_05` frontend slice.
- `ReceiptReviewDialog` now fetches `/api/v1/emails/:id/content`, calls the existing receipt extraction route, captures phone manually, and triggers the existing WhatsApp delivery route.
- `ReceiptReviewDialog` now shows explicit post-send feedback states that differentiate validation, network, and backend/provider failures while keeping retry and close actions clear.
- `ReceiptReviewDialog` now reads and writes the manual receipt response state against `/api/v1/receipt-responses`, reflecting `paid`, `ignore`, or `null` inside the existing review flow.
- `tests/e2e/hu06-receipt-review.spec.js` now validates the receipt-review browser flow against dedicated HU06 fixture emails for one successful manual WhatsApp send and one visible provider-error path with retry affordance.
- The authenticated UX now makes `Suggestions` the explicit primary loop and reframes `Inbox` as manual review/context support.
- `SuggestionsList` now renders review priority, visible confidence, visible sensitivity, richer inline context, and a more explicit expanded evidence block.
- `ReceiptReviewDialog` now presents the receipt flow as four explicit steps: review context, confirm extracted data, register receipt status, and send WhatsApp manually.
- `SettingsPage` now exposes only scope-true workflow preferences and explicitly removes generic account/security promises that the current product does not support.
- Unified the visual language of the entire application under the "Midnight Aurora" design system:
  - Deep navy background (`#0B1120`) with subtle teal/blue glass orb backgrounds.
  - Interactive headers with gradient borders, rounded corners (`rounded-[1.75rem]`), and shadow-relief treatments.
  - Consistent iconography (Teal for suggestions/review, blue for history/settings, violet for inbox).
  - Modern typography using `font-home-display` for headings and high-contrast slate text for body.
  - Activity drawer (Sheet) and SummaryPanel now use dark aurora styling with skeleton loaders and high-contrast summary badges.
  - Header (App shell) now features a backdrop-blur background, aria-label enabled Menu toggle, and a shadow-inner teal mail icon.
  - All dashboard views (`Suggestions`, `Inbox`, `History`, `Settings`) now carry a unified "Selected Proposal" look for the experimental UX remediation branch.

---

## 3. Component-by-Component Technical State

## 3.1 React Application

- Code present:
  - `src/main.jsx`
  - `src/App.jsx`
  - `index.html`
  - `tailwind.config.js`
- Navigation:
  - Local state toggles between Home, Login, Suggestions, History, Settings, and Inbox (no router).
- Styling:
  - TailwindCSS + shadcn-style UI components.

## 3.2 Screens and Components

### Suggestions view

- Components:
  - `src/components/SuggestionsList.jsx`
  - `src/components/activity/ActivityPanel.jsx`
  - `src/components/SummaryPanel.jsx`
- Behavior:
  - SuggestionsList loads actionable emails and handles confirm/reject.
  - SuggestionsList now sorts visible cards by review priority and exposes confidence/sensitivity heuristics derived from the existing suggestion contract.
  - SummaryPanel loads aggregated counts with daily/weekly toggle inside the drawer.
- States:
  - Loading (skeleton), empty (EmptyState), error (StatusMessage).

### History screen

- Components:
  - `src/components/HistoryList.jsx`
- Behavior:
  - Loads history via `getHistory(page, perPage)`.
- Pagination:
  - Local page state controlling backend pagination.
- States:
  - Loading (skeleton), empty (EmptyState), error (StatusMessage).

### Shared components

- `src/components/ConfirmButton.jsx`:
  - Handles POST confirmation with loading and error handling.
- `src/components/StatusMessage.jsx`:
  - Centralized success/error/info UI feedback.
- `src/components/State/EmptyState.jsx`:
  - Empty states for Suggestions and History.
- `src/components/ReceiptReviewDialog.jsx`:
  - Handles full-content fetch, receipt extraction, manual phone input, manual WhatsApp send, and manual receipt-response state (`paid | ignore | null`) for one Inbox email.
  - Presents the receipt review as an explicit four-step sequence with visible separation between receipt status and WhatsApp send.

## 3.3 API Client (`src/services/api.js`)

- API_BASE:
  - `VITE_API_BASE_URL` with fallback to `http://localhost:3000/api/v1`.
- API_ORIGIN:
  - `VITE_API_ORIGIN` with fallback to `http://localhost:3000`.
- Implemented methods:
  - `getSuggestions`
  - `getSummary`
  - `getHistory`
  - `confirmAction`
  - `runInboxAction`
  - `getEmailContent`
  - `extractReceipt`
  - `getReceiptResponse`
  - `saveReceiptResponse`
  - `sendReceiptWhatsApp`
- Error handling:
  - Normalized HTTP and network errors with retries and timeout.
- Auth:
  - Uses httpOnly session cookie with `credentials: 'include'`.

## 3.4 Environment

- `.env.example` present: yes.
- Required env vars:
  - `VITE_API_BASE_URL`
  - `VITE_API_ORIGIN`
- Dev environment state:
  - Works against local Fastify backend endpoints.

## 3.5 Tests

- Test runner: Vitest + React Testing Library + happy-dom.
- Existing tests:
  - `tests/StatusMessage.test.jsx`
  - `tests/ConfirmButton.test.jsx`
  - `tests/SuggestionsList.test.jsx`
  - `tests/InboxList.test.jsx`
  - `tests/ReceiptReviewDialog.test.jsx`
  - `tests/SettingsPage.test.jsx`
  - `tests/AppShellViews.test.jsx`
  - `tests/SummaryPanel.test.jsx`
  - `tests/ActivityPanel.test.jsx`
  - `tests/HistoryList.test.jsx`
  - `tests/AppAuthFlow.test.jsx`
  - `tests/integration/confirmActionFlow.test.jsx`
  - `tests/httpRequest.test.jsx`
  - `tests/e2e/hu19-row-level.spec.js`
  - `tests/e2e/hu06-receipt-review.spec.js`
- Status:
  - Last verified PASS (Vitest, `tests/ReceiptReviewDialog.test.jsx`) on 2026-03-24.
  - Last verified PASS (Playwright, `tests/e2e/hu06-receipt-review.spec.js`) on 2026-03-22.
- CI:
  - GitHub Actions runs lint, test, and build on PRs and pushes to `develop`.

---

## 4. User Story Status (Evidence-Driven)

### HU17 — Suggestions vs Summary alignment (frontend)

**Status:** DONE

**Evidence:**
- `src/components/SummaryPanel.jsx`
- `src/components/activity/ActivityPanel.jsx`
- `src/services/api.js`
- `tests/SummaryPanel.test.jsx`
- `tests/ActivityPanel.test.jsx`

**Open items:**
- None.

**Technical risks:**
- SummaryPanel drawer flow is covered by automated tests.

**Recent change:**
- Summary drawer behavior and SummaryPanel states are now covered by tests; ActivityPanel includes accessible title/description metadata for the drawer (commit: pending).

### HU18 — Google OAuth session flow (frontend)

**Status:** DONE

**Evidence:**
- `src/App.jsx` (login button + callback handling)
- `src/services/api.js` (`credentials: 'include'`)
- `tests/AppAuthFlow.test.jsx`

**Open items:**
- None.

**Technical risks:**
- Frontend depends on backend cookie settings (SameSite/Secure).
- Auth callback and session-expiry behavior are covered by direct tests.

**Recent change:**
- Added direct coverage for successful callback, callback error routing, and session-expiry behavior; fixed callback error handling so failed OAuth returns to `/login` without losing the error message (commit: pending).
- Simplified the public entry funnel so `HomePage` launches Google OAuth directly while `LoginPage` remains the re-entry and exception screen; targeted auth-flow tests passed locally (commit: pending).

### HU19 — Inbox direct and bulk actions (frontend)

**Status:** DONE

**Evidence:**
- `src/components/InboxList.jsx` renders bulk and row-level controls for `Archivar`, `Marcar no leído`, and `Eliminar`.
- `src/components/InboxList.jsx` now implements row-level `archive`, `delete`, and `mark_unread` actions.
- `src/components/InboxList.jsx` now implements multi-select bulk archive, delete, and mark-unread flows with local reconciliation based on ADR 008 `results`.
- `src/services/api.js` now exposes `runInboxAction` for the dedicated Inbox-action path.
- `tests/InboxList.test.jsx` now covers archive confirmation, direct mark-unread behavior, bulk partial success, and `execution: none`.
- `tests/e2e/hu19-row-level.spec.js` now contains row-level and bulk browser scenarios against the local fixture Inbox environment.
- `src/index.css` now applies a localized Inbox-only override for the Radix `ScrollArea` viewport wrapper so row actions remain visible beside the reading panel in real usage.

**Open items:**
- None.

**E2E Inbox source strategy (frozen):**
- The browser tests will not use a live Gmail inbox.
- The Inbox dataset now comes from the backend fixture source when `INBOX_SOURCE=fixture`.
- The fixture Inbox now contains dedicated HU19 action rows and separate HU06 receipt-review rows:
  - `email-hu19-archive`,
  - `email-hu19-delete`,
  - `email-hu19-read`,
  - `email-hu06-success`,
  - `email-hu06-provider-error`.

**E2E session strategy (frozen):**
- The HU19 browser test will not execute live Google OAuth.
- The test must open Inbox under a stable local authenticated session for `e2e-user@example.com`.
- The preferred source is the backend helper that mints a local `session_token` compatible with the real auth middleware.
- The goal is to make authentication a controlled prerequisite instead of a moving part inside the HU19 flow itself.

**Technical risks:**
- Gmail side effects remain outside browser validation because Inbox actions still use the stubbed executor path in local test environments.

**Recent change:**
- Promoted Inbox placeholder controls into a tracked cross-repo feature candidate, aligned the backend direction with ADR 007, defined the frontend UX contract in ADR 003, and implemented the first row-level slice in `InboxList` (commit: pending).
- Prepared HU19 for future E2E by adding a stable row-level DOM hook (`data-testid=\"inbox-row-{id}\"`) and by fixing the next design decisions around seed and authenticated session strategy (commit: pending).
- Froze the HU19 E2E prerequisites and aligned them with backend reality: `INBOX_SOURCE=fixture` for deterministic Inbox data and a local `session_token` helper for authenticated runs without live Google OAuth (commit: pending).
- Added Playwright configuration plus the first HU19 browser spec for the `archive` row-level flow; local browser execution is the next step (commit: pending).
- Closed the HU19 row-level E2E gap locally: `archive`, `delete`, and `mark_unread` now pass in Playwright against `POST /api/v1/inbox/actions` with the fixture Inbox source (commit: pending).
- Accepted ADR 008 to freeze bulk-result semantics, per-item response detail, and local reconciliation before bulk implementation begins (commit: pending).
- Backend `/api/v1/inbox/actions` now emits ADR 008 bulk semantics, and `InboxList.jsx` now consumes that contract for multi-select archive, delete, and mark-unread flows with local reconciliation (commit: pending).
- Added frontend bulk Vitest coverage plus bulk Playwright scenarios; local browser execution now passes for bulk `archive`, `delete`, and `mark_unread`, closing HU19 at the frontend level (commit: pending).
- Added a localized Inbox-only `ScrollArea` viewport override after real-browser inspection showed Radix's internal `display: table` wrapper was visually hiding row action controls behind the reading pane (commit: pending).
- Aligned `tests/InboxList.test.jsx` with the current bulk toast implementation after CI exposed stale assertions tied to the removed loading-toast flow (commit: pending).
- Reconnected the `inbox-list-scroll` class on the Inbox list `ScrollArea` so the localized Radix viewport override actually applies in production markup, and added a guardrail test to keep the row-action visibility fix anchored (commit: pending).
- Hardened row-level Inbox actions so `execution: none` no longer reconciles local state as success, and stopped mobile overflow actions from triggering the row preview via event bubbling (commit: pending).
- HU19 frontend changes, ADR 003, the row-action review fixes, and the React governance-doc alignment are now merged into `develop` (commit: pending).

### HU_05 — Review de recibo detectado y disparo manual de notificación WhatsApp (frontend)

**Status:** DONE

**Evidence:**
- `src/components/InboxList.jsx`
- `src/components/ReceiptReviewDialog.jsx`
- `src/services/api.js`
- `tests/InboxList.test.jsx`
- `tests/ReceiptReviewDialog.test.jsx`

**Open items:**
- None for this frontend slice.

**Technical risks:**
- The browser flow still depends on the controlled local fixture/auth setup used by Playwright; no live Gmail or live WhatsApp provider validation is part of this slice.

**Recent change:**
- Added the `Revisar recibo` Inbox row action plus the receipt-review dialog that fetches `/api/v1/emails/:id/content`, calls the existing extraction route, captures the WhatsApp phone manually, and triggers the existing WhatsApp delivery route (commit: pending).
- Guarded `ReceiptReviewDialog` retry-load state updates so stale async results no longer apply after the dialog closes or the user switches to another `emailId`; added targeted Vitest coverage for the stale retry scenario (commit: pending).
- Guarded `ReceiptReviewDialog` send-response state updates so stale async send results no longer apply after the dialog closes or the user switches to another `emailId`; added targeted Vitest coverage for the stale send scenario (commit: pending).
- Clarified the manual WhatsApp send outcome in `ReceiptReviewDialog` so success is explicit and actionable, while send failures now differentiate validation, network, and backend/provider errors with retry guidance; targeted Vitest coverage passed for `tests/ReceiptReviewDialog.test.jsx` and `tests/InboxList.test.jsx` (commit: pending).

### HU_06 — Browser validation of receipt review and manual WhatsApp send flow

**Status:** DONE

**Evidence:**
- `tests/e2e/hu06-receipt-review.spec.js`
- `src/components/ReceiptReviewDialog.jsx`
- `src/components/InboxList.jsx`

**Open items:**
- None for this frontend browser-validation slice.

**Technical risks:**
- The visible provider-error browser case uses a controlled response override for `/api/v1/notifications/receipt-whatsapp` to prove feedback and retry affordance without claiming a real full-stack provider failure.
- The happy path is still local end-to-end only across the controlled fixture/auth environment, not live Gmail or a live WhatsApp provider.

**Recent change:**
- Added `tests/e2e/hu06-receipt-review.spec.js` with a local happy path for receipt review plus manual WhatsApp send and a visible provider-error path with retry affordance; the browser spec now targets dedicated HU06 fixture emails instead of reusing HU19 rows (commit: pending).
- Removed the Radix dialog warning from Vitest by simplifying the `DialogPrimitive.Description` wiring in `src/components/ReceiptReviewDialog.jsx` and keeping stable test hooks for the new browser spec (commit: pending).

### HU_07B — Frontend manual receipt response UI

**Status:** DONE

**Evidence:**
- `src/components/ReceiptReviewDialog.jsx`
- `src/services/api.js`
- `tests/ReceiptReviewDialog.test.jsx`

**Open items:**
- None for the first frontend receipt-response slice.

**Technical risks:**
- No blocking technical risks for the first `HU_07B` slice.

**Recent change:**
- Added `getReceiptResponse` and `saveReceiptResponse` to `src/services/api.js`, reusing the canonical `/api/v1/receipt-responses` backend contract without introducing a parallel payload shape (commit: pending).
- Extended `ReceiptReviewDialog.jsx` so the existing review flow now reads the current receipt state, lets the user mark it as paid or ignored, reflects `paid | ignore | null`, and guards stale async state around the new response requests (commit: pending).
- Expanded `tests/ReceiptReviewDialog.test.jsx` with targeted coverage for response-state load, `paid` success, `ignore` success, load failure, and save failure; `npm test -- --run tests/ReceiptReviewDialog.test.jsx tests/InboxList.test.jsx` passed locally (commit: pending).
- Hardened the WhatsApp send gate so blank extraction fields no longer enable submission, switched the send payload to use the dialog `emailId` instead of `emailContent.id`, and added regression coverage for both review findings (commit: pending).

---

## 5. Current Technical Risks

- Frontend auth still depends on backend cookie settings (SameSite/Secure) in real environments.
- Local Settings toggles are intentionally scope-true but still presentational only; no backend persistence contract exists for these workflow preferences.
- HU06 browser validation currently proves the happy path only against the local controlled fixture/auth path, not against live Gmail or a live WhatsApp provider.
- HU06 provider-error coverage is browser-level only because the spec uses a controlled route override instead of a real backend/provider failure.
- The experimental branch still relies on a local-only Home redesign iteration that has not been pushed or merged yet.

---

## 6. Next Immediate Action

➡️ Commit the current public Home redesign iteration for `src/pages/HomePage.jsx` and `src/index.css`.

---

## Version log

- 2026-01-11 23:51 CST — Doc alignment and tests verified (commit: pending)
- 2026-01-12 01:45 CST — Template label alignment for HU sections (commit: pending)
- 2026-01-18 02:53 CST — UI refactor (drawer summary, login screen) and tests failing (commit: pending)
- 2026-01-29 00:00 CST — Home page + Open Graph preview assets (commit: pending)
- 2026-03-10 00:03 CST — Refreshed frontend checkpoint after HU17/HU18 closure; suite revalidated at 12 files / 36 tests, app-shell smoke coverage was added, and InboxList/SettingsPage now have direct state/render coverage (commit: pending)
- 2026-03-10 00:03 CST — Classified `InboxList` bulk actions as presentational-only UI, not active product behavior, based on current code and route evidence (commit: pending)
- 2026-03-10 00:03 CST — Registered HU19 to track Inbox direct and bulk actions as a real feature instead of leaving placeholder controls undocumented (commit: pending)
- 2026-03-10 02:42 CST — Added `playwright.config.js`, the `test:e2e` script, and the first HU19 browser spec for the row-level `archive` flow; browser execution is still pending on the live local environment (commit: pending)
- 2026-03-10 20:57 CST — HU19 row-level browser validation passed locally for `archive`, `delete`, and `mark_unread` using Playwright with `INBOX_SOURCE=fixture` and a local `session_token` (commit: pending)
- 2026-03-10 00:03 CST — Aligned HU19 design direction with ADR 007: dedicated Inbox-action contract, separate from suggestion confirmation (commit: pending)
- 2026-03-10 00:03 CST — Defined the frontend UX contract for HU19 in ADR 003, including confirmation rules, toast feedback, and row-vs-bulk action behavior (commit: pending)
- 2026-03-10 01:34 CST — Implemented the first HU19 frontend slice in `InboxList`: row-level archive/delete confirmation, direct mark-unread execution, local reconciliation, and direct test coverage (commit: pending)
- 2026-03-10 01:35 CST — Backend contract for `POST /api/v1/inbox/actions` now exists in Fastify; the next frontend step is end-to-end validation of the row-level HU19 UX before expanding to bulk actions (commit: pending)
- 2026-03-10 01:52 CST — Added a stable row-level DOM hook for HU19 (`data-testid` per Inbox row) and narrowed the next E2E prerequisites to deterministic seed + authenticated session design before installing browser tooling (commit: pending)
- 2026-03-10 02:08 CST — Froze the HU19 E2E operating assumptions: local deterministic Inbox seed, no live Gmail inbox, and stable authenticated local session without live Google OAuth (commit: pending)
- 2026-03-10 21:05 CST — Accepted ADR 008 to freeze bulk Inbox-action result semantics before bulk implementation begins (commit: pending)
- 2026-03-10 21:20 CST — Backend `/api/v1/inbox/actions` now emits ADR 008 bulk semantics, so the next frontend task is multi-select bulk execution and reconciliation (commit: pending)
- 2026-03-11 00:12 CST — Implemented the HU19 bulk frontend slice in `InboxList.jsx`, added Vitest coverage for partial and none outcomes, and expanded the Playwright spec with bulk archive/delete/mark-unread scenarios (commit: pending)
- 2026-03-11 00:39 CST — HU19 closed at the frontend level after the full Playwright suite passed locally for 3 row-level and 3 bulk Inbox scenarios (commit: pending)
- 2026-03-11 03:15 CST — Aligned React Inbox bulk Vitest assertions with the current toast behavior after CI exposed stale expectations from the removed loading-toast flow (commit: pending)
- 2026-03-14 00:39 CST — Reconnected the Inbox-specific `ScrollArea` class so the Radix viewport override for row-action visibility applies again; `npm test -- InboxList.test.jsx` passed locally (commit: pending)
- 2026-03-14 02:02 CST — Fixed review follow-ups in `InboxList`: row actions now inspect backend result semantics before local reconciliation, and mobile overflow actions stop row-click propagation; `npm test -- InboxList.test.jsx` passed locally (commit: pending)
- 2026-03-14 02:05 CST — Merged the HU19 frontend branch into `develop`, including the row-action visibility fix, review follow-up fixes, and the React governance-doc alignment (commit: pending)
- 2026-03-19 15:18 CST — Refreshed the frontend checkpoint to declare HU_05 as the next active slice after confirming HU_02 backend and HU_03 backend are already landed in Fastify (commit: pending)
- 2026-03-19 19:05 CST — Implemented the first `HU_05` frontend slice in `src/components/InboxList.jsx` and `src/components/ReceiptReviewDialog.jsx`, consuming `GET /api/v1/emails/:id/content` plus the existing extraction and WhatsApp routes; targeted Vitest coverage passed for `tests/InboxList.test.jsx` and `tests/ReceiptReviewDialog.test.jsx` (commit: pending)
- 2026-03-19 19:39 CST — Hardened `ReceiptReviewDialog` retry-load behavior so stale async results no longer update state after close or `emailId` change; added targeted coverage for the stale retry case in `tests/ReceiptReviewDialog.test.jsx` (commit: pending)
- 2026-03-19 19:50 CST — Hardened `ReceiptReviewDialog` send-response behavior so stale async send results no longer update state after close or `emailId` change; added targeted coverage for the stale send case in `tests/ReceiptReviewDialog.test.jsx` (commit: pending)
- 2026-03-22 00:06 CST — Clarified the manual WhatsApp send outcome in `ReceiptReviewDialog` with explicit success copy plus differentiated validation, network, and backend/provider error states; `npm test -- ReceiptReviewDialog.test.jsx InboxList.test.jsx` passed locally (commit: pending)
- 2026-03-22 01:21 CST — Realigned the frontend checkpoint after the merged manual receipt send feedback slice so `develop` is the active baseline and the next action is selecting the next story (commit: pending)
- 2026-03-22 02:06 CST — Added `tests/e2e/hu06-receipt-review.spec.js`, fixed the Radix dialog warning in Vitest, and passed local browser validation for both the successful manual send flow and a visible provider-error path with retry affordance (commit: pending)
- 2026-03-22 03:05 CST — Decoupled HU06 browser validation from HU19 fixture rows by targeting dedicated HU06 receipt-review emails and clarified that the provider-error case remains a browser-level controlled override (commit: pending)
- 2026-03-22 12:19 CST — Added versioned Husky hooks plus `commitlint` so `commit-msg` now validates Conventional Commit syntax while `pre-commit` still routes through the workspace cognitive gate (commit: pending)
- 2026-03-22 12:19 CST — Extended `ci.yml` so pull requests now validate commit messages with `commitlint` in GitHub Actions in addition to the local Husky hook (commit: pending)
- 2026-03-23 01:30 CST — Reconciled the frontend operational checkpoint with the real clean `develop` baseline and closed HU06 from the existing browser evidence (commit: pending)
- 2026-03-23 15:51 CST — Realigned the Phase 2 backlog with the code-backed baseline, registered HU_06 explicitly in the story canon, and added HU_07, HU_08, and HU_09 as the next candidate slices (commit: pending)
- 2026-03-23 17:08 CST — Split `HU_07` into `HU_07A` backend-first and `HU_07B` frontend follow-up, and anchored the frontend next step to wait for the stabilized backend contract (commit: pending)
- 2026-03-24 13:48 CST — Implemented `HU_07B` in `ReceiptReviewDialog.jsx` by consuming `GET/POST /api/v1/receipt-responses`, reflecting `paid | ignore | null`, and adding targeted Vitest coverage for load/save success and failure states; `npm test -- --run tests/ReceiptReviewDialog.test.jsx` passed locally (commit: pending)
- 2026-03-24 14:33 CST — Addressed PR review follow-ups in `ReceiptReviewDialog.jsx` by rejecting blank extraction fields before WhatsApp send and by sending the canonical dialog `emailId`; `npm run lint` plus `npm test -- --run tests/ReceiptReviewDialog.test.jsx tests/InboxList.test.jsx` passed locally (commit: pending)
- 2026-03-24 14:47 CST — Committed the HU_07B follow-up fix as `0138a5e` and left the feature branch clean with PR 47 open against `develop` (commit: 0138a5e)
- 2026-03-28 14:46 CST — Local experimental UX remediation updated the authenticated loop, improved decision quality in `Suggestions`, reordered `ReceiptReviewDialog`, reduced `Settings` to scope-true workflow preferences, and revalidated the affected slices with targeted Vitest plus local Playwright visual passes (commit: pending)
- 2026-03-30 08:50 CST — Checkpointed the experimental auth funnel and home slice to establish a clean commit boundary before proceeding with a new high-fidelity visual redesign iteration.
- 2026-03-30 10:10 CST — Implemented the Glass & Void (dark mode) HomePage redesign with framer-motion animations, glassmorphism cards, gradient borders, and grid mesh background; tests pass but visual direction not selected as final.
- 2026-03-30 12:35 CST — Reworked the experimental public Home into the currently selected dark aurora direction with a two-block React-aligned headline gradient, a faux macOS-inspired inbox mockup chrome, and hover-straighten motion; `npm test -- --run tests/HomePage.test.jsx tests/AppAuthFlow.test.jsx` passed locally (commit: pending)
