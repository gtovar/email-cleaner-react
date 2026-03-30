# Sprint_Log.md — Frontend React

Sprint: 2026-01
Scope: UI alignment for suggestions vs summary
Backend: yes (email-cleaner-fastify)
Frontend: yes

---

## 2025-11-28 — HU13 completed
- Added HTTP client retries and timeouts in `src/services/api.js`.

## 2025-11-29 — HU14 completed
- Frontend test suite stabilized under Vitest.

## 2025-12-03 — HU15 completed
- Added `tests/httpRequest.test.jsx` for HTTP client coverage.

## 2026-01-11 — Summary widget added
- Added `src/components/SummaryPanel.jsx`.
- Aligned suggestions list with `/api/v1/suggestions`.

## 2026-01-11 — OAuth UI flow wired
- Added login button and callback handling for backend OAuth.

## 2026-01-12 — Frontend doc alignment
- Updated `PROJECT_STATE.md` to match the frontend template labels.

## 2026-01-18 — UI refactor and auth UX
- Added Login screen and session-expired handling in `src/App.jsx`.
- Moved Summary into a right-side drawer and added shadcn-style UI components.

## 2026-01-18 — Test suite aligned
- Updated Vitest expectations for skeleton loaders, EmptyState, and delayed removal.
- Integration flow now mocks `onAuthExpired`.

## 2026-01-19 — CI added and lint fixed
- Added GitHub Actions CI (lint, test, build) for PRs and `develop`.
- Fixed lint failures found by CI.

## 2026-01-20 — HTTPS local guidance
- Updated local dev guidance to HTTPS for web/mobile parity.
- Updated `.env.example`, `README.md`, and `PROJECT_STATE.md` accordingly.

## 2026-03-09 — HU17 frontend closed
- Added `tests/SummaryPanel.test.jsx` to cover loading, error, empty-state, and daily/weekly summary switching.
- Added `tests/ActivityPanel.test.jsx` to verify SummaryPanel renders inside the drawer and panel actions still work.
- Added accessible title/description metadata to the drawer so dialog accessibility warnings are resolved during tests.

## 2026-03-09 — HU18 frontend closed
- Added `tests/AppAuthFlow.test.jsx` to cover successful `/auth/callback`, callback error handling, and `onAuthExpired` session-expiry behavior.
- Fixed OAuth callback error routing so failed sign-in returns to `/login` without immediately losing the error message.

## 2026-03-10 — Frontend checkpoint refreshed
- Revalidated the frontend Vitest suite at 9 files / 29 tests.
- Updated `PROJECT_STATE.md` and `README_REENTRY.md` so the next task is anchored to Inbox/Settings app-shell coverage.

## 2026-03-10 — App shell smoke coverage added
- Added `tests/AppShellViews.test.jsx` to verify `InboxPage` mounts from the main navigation and `SettingsPage` mounts from the activity drawer.
- Updated frontend checkpoint docs so the next task now points to direct `InboxList` coverage instead of app-shell wiring.

## 2026-03-10 — InboxList direct coverage added
- Added `tests/InboxList.test.jsx` to cover the empty state, request error state, and mobile preview opening.
- Updated frontend checkpoint docs so the next task now points to possible direct coverage for `SettingsPage`.

## 2026-03-10 — SettingsPage direct coverage added
- Added `tests/SettingsPage.test.jsx` to cover section rendering, labeled inputs, and toggle defaults.
- Updated frontend checkpoint docs so the next task now points to the unresolved behavior question around `InboxList` bulk actions.

## 2026-03-10 — Inbox bulk actions classified
- Reviewed `src/components/InboxList.jsx` against current frontend/backend evidence.
- Kept the current interpretation explicit: bulk and row-level Inbox actions are presentational placeholders, not active behavior in the confirmed product flow.

## 2026-03-10 — HU19 registered
- Registered a new tracked feature for Inbox direct and bulk actions instead of leaving the placeholder controls undocumented.
- Frontend next step now points to defining the product/API contract for Inbox actions before implementation.

## 2026-03-10 — HU19 aligned with ADR 007
- Aligned the frontend direction with a dedicated Inbox-action contract, separate from suggestion confirmation semantics.
- Frontend next step now points to defining confirmation and feedback UX for Inbox actions.

## 2026-03-10 — HU19 frontend UX defined
- Added ADR 003 to define the frontend UX contract for Inbox direct and bulk actions.
- Locked the first implementation slice to row-level Inbox actions with confirmation and toast feedback.
- Kept the backend/frontend contract boundary aligned: ADR 007 defines the dedicated Inbox action contract direction, while ADR 003 defines the user-facing flow.

## 2026-03-10 — HU19 row-level frontend slice implemented
- Added `runInboxAction` to the frontend API client for the dedicated Inbox action contract direction.
- Implemented row-level Inbox actions in `src/components/InboxList.jsx`: `archive` and `delete` now require confirmation, while `mark_unread` executes directly with toast feedback.
- Added direct coverage in `tests/InboxList.test.jsx` for archive confirmation and direct mark-unread behavior.
- Kept HU19 open because backend support for `POST /api/v1/inbox/actions` and the bulk-action slice are still pending.

## 2026-03-10 — HU19 backend contract landed
- Fastify now exposes `POST /api/v1/inbox/actions` as the dedicated backend contract for row-level Inbox actions.
- Frontend next step moved from contract design to end-to-end validation of the row-level flow.

## 2026-03-10 — HU19 E2E prerequisites clarified
- Added a stable DOM hook on each Inbox row (`data-testid="inbox-row-{id}"`) to avoid fragile selectors in future browser automation.
- Narrowed the next HU19 work to defining a deterministic Inbox seed and a stable authenticated session strategy before installing or writing Playwright specs.

## 2026-03-10 — HU19 E2E operating assumptions frozen
- Locked the browser-test dataset to a deterministic local Inbox seed with three visible controlled emails: archive target, delete target, and read email for `mark_unread`.
- Locked the browser-test auth path to a stable local authenticated session and explicitly excluded live Gmail inbox data and live Google OAuth from the HU19 E2E flow.

## 2026-03-10 — HU19 backend prerequisites materialized
- Fastify now exposes a deterministic fixture Inbox source behind `INBOX_SOURCE=fixture`.
- Backend now provides a local `session_token` helper for `e2e-user@example.com`, so the next frontend step can move directly to Playwright instead of building more local auth plumbing.

## 2026-03-10 — HU19 Playwright scaffold added
- Added `playwright.config.js` and the `test:e2e` script to prepare browser automation in the frontend repo.
- Added the first HU19 browser spec for the row-level `archive` flow, using the frozen local environment contract (`INBOX_SOURCE=fixture` + local `session_token`).

## 2026-03-10 — HU19 row-level browser validation passed
- Ran Playwright locally against the controlled HU19 environment and validated `archive`, `delete`, and `mark_unread` in a real browser.
- The row-level slice is now covered by browser automation; HU19 remains open only because bulk actions are still pending.

## 2026-03-10 — HU19 bulk semantics frozen
- Added ADR 008 to define partial-success semantics, per-item result reporting, and local reconciliation rules for bulk Inbox actions.
- Frontend next step now points to implementing the bulk slice against the frozen contract instead of redesigning semantics during coding.

## 2026-03-10 — HU19 bulk backend contract landed
- Fastify `/api/v1/inbox/actions` now emits ADR 008 fields for bulk execution: `execution`, `summary`, and `results`.
- Frontend next step now points to multi-select bulk execution and reconciliation in `InboxList.jsx`.

## 2026-03-11 — HU19 bulk frontend slice implemented
- Added multi-select bulk execution in `src/components/InboxList.jsx` for `archive`, `delete`, and `mark_unread` using the ADR 008 response contract.
- Added Vitest coverage for partial-success and `execution: none` outcomes, and expanded the Playwright spec with bulk browser scenarios.

## 2026-03-11 — HU19 closed locally
- Ran the full Playwright Inbox suite locally and validated 6 browser scenarios: 3 row-level and 3 bulk.
- HU19 is now closed for the current local scope; Gmail side effects remain outside this browser validation path.

## 2026-03-11 — Inbox row-action visibility fixed
- Added a localized Inbox-only CSS override for the Radix `ScrollArea` viewport wrapper after real-browser inspection showed the internal `display: table` wrapper was visually hiding row action controls behind the reading pane.

## 2026-03-11 — Inbox bulk Vitest assertions aligned
- Updated `tests/InboxList.test.jsx` to match the current bulk toast behavior after CI exposed stale expectations from the removed loading-toast flow.

## 2026-03-14 — Inbox row-action visibility guardrail restored
- Reconnected the `inbox-list-scroll` class on the list `ScrollArea` so the localized Radix viewport override applies to the real Inbox markup.
- Added a targeted Vitest assertion in `tests/InboxList.test.jsx` to keep the row-action visibility fix from silently detaching again.

## 2026-03-14 — Inbox review follow-ups fixed
- Updated row-level Inbox actions to inspect the backend response before reconciling local state, preventing `execution: none` outcomes from being shown as success.
- Stopped event bubbling from the mobile overflow action menu so tapping `archive`, `delete`, or `mark_unread` no longer opens the preview sheet as a side effect.

## 2026-03-14 — HU19 frontend merged to develop
- Merged the HU19 frontend branch into `develop` after the row-action visibility fix, the review follow-up fixes, and the React governance-doc alignment all cleared review and CI.
- Frontend user-story tracking now treats HU19 as closed on `develop` for the documented local/browser scope; the next frontend step is no longer a HU19 completion task.

## 2026-03-19 — Frontend checkpoint retargeted
- Updated the frontend checkpoint docs to declare HU_05 as the next active slice.
- Anchored the next UI work to the backend receipt-extraction and manual WhatsApp routes that are already landed in Fastify.

## 2026-03-19 — HU_05 frontend slice implemented
- Added the `Revisar recibo` row action in `src/components/InboxList.jsx` and the `src/components/ReceiptReviewDialog.jsx` flow for full-content fetch, receipt extraction, manual phone capture, and manual WhatsApp send.
- Added targeted Vitest coverage in `tests/InboxList.test.jsx` and `tests/ReceiptReviewDialog.test.jsx`; both test files passed locally.

## 2026-03-19 — HU_05 review fix for stale retry-load state
- Guarded `ReceiptReviewDialog` retry-load state updates so stale async results no longer apply after dialog close or after switching to another `emailId`.
- Added targeted Vitest coverage for the stale retry scenario in `tests/ReceiptReviewDialog.test.jsx`; `tests/InboxList.test.jsx` and `tests/ReceiptReviewDialog.test.jsx` passed locally.

## 2026-03-19 — HU_05 review fix for stale send-response state
- Guarded `ReceiptReviewDialog` send-response state updates so stale async send results no longer apply after dialog close or after switching to another `emailId`.
- Added targeted Vitest coverage for the stale send scenario in `tests/ReceiptReviewDialog.test.jsx`; `tests/InboxList.test.jsx` and `tests/ReceiptReviewDialog.test.jsx` passed locally.

## 2026-03-22 — Manual receipt send feedback clarified
- Updated `src/components/ReceiptReviewDialog.jsx` so a successful manual WhatsApp send now shows explicit actionable feedback, and send failures now differentiate validation, network, and backend/provider outcomes.
- Added targeted Vitest coverage in `tests/ReceiptReviewDialog.test.jsx` for the new post-send feedback states; `npm test -- ReceiptReviewDialog.test.jsx InboxList.test.jsx` passed locally.

## 2026-03-22 — HU06 browser receipt-review validation
- Added `tests/e2e/hu06-receipt-review.spec.js` to validate the local browser happy path for receipt review plus manual WhatsApp send and a visible provider-error path with retry affordance.
- Simplified the dialog description wiring in `src/components/ReceiptReviewDialog.jsx`, removing the prior Radix warning from `tests/ReceiptReviewDialog.test.jsx` while adding stable browser-test hooks for feedback and send actions.
- Local evidence passed with `npm test -- ReceiptReviewDialog.test.jsx`, `npm test -- emailsFixtureRoutes.integration.test.js`, and `npm run test:e2e -- tests/e2e/hu06-receipt-review.spec.js`.

## 2026-03-22 — HU06 fixture decoupling and risk clarification
- Switched `tests/e2e/hu06-receipt-review.spec.js` to dedicated HU06 fixture emails instead of reusing HU19 row IDs.
- Updated the frontend checkpoint to state explicitly that the HU06 provider-error scenario is a browser-level controlled override, not a real provider failure.

## 2026-03-22 — Husky and commitlint hooks added
- Added versioned `.husky/pre-commit` and `.husky/commit-msg` hooks plus `.commitlintrc.cjs`.
- Manual validation confirmed that valid Conventional Commit messages pass, invalid messages are blocked, and the cognitive pre-commit gate still runs.

## 2026-03-22 — CI commitlint check added
- Extended `.github/workflows/ci.yml` so pull requests now validate commit messages with `commitlint` in GitHub Actions.

## 2026-03-22 — Husky hook portability fix
- Replaced the workspace-root `pre-commit` dependency with repo-local scripts under `scripts/git-hooks/`, so the versioned hook now works in a clean standalone clone of `email-cleaner-react`.
- Replaced `prepare: "husky"` with a guarded installer so installs that omit devDependencies skip hook installation cleanly while normal dev installs still configure `.husky/_`.

## 2026-03-22 — Comment hygiene wired into React pre-commit
- Added `scripts/git-hooks/check-comment-hygiene.sh` and wired it into the repo-local Husky `pre-commit` flow.
- The React hook now blocks empty comments and vague follow-up markers before commit without depending on the workspace-root helper script.

## 2026-03-23 — Phase 2 backlog realigned
- Updated the canonical Phase 2 story docs so HU_05 and HU06 match the implemented frontend state.
- Registered HU_07, HU_08, and HU_09 as the next backlog candidates and synchronized the frontend checkpoint next step.

## 2026-03-23 — HU_07 execution slices defined
- Split `HU_07` into `HU_07A` backend-first and `HU_07B` frontend follow-up.
- Anchored the frontend next step to wait for the stabilized backend contract before opening the UI slice.

## 2026-03-24 — HU_07B frontend receipt-response slice implemented
- Added frontend read/write wiring for `GET/POST /api/v1/receipt-responses` inside `src/components/ReceiptReviewDialog.jsx` and `src/services/api.js`.
- Expanded `tests/ReceiptReviewDialog.test.jsx`; `npm test -- --run tests/ReceiptReviewDialog.test.jsx` passed locally.

## 2026-03-24 — HU_07B review follow-ups fixed
- Hardened `ReceiptReviewDialog.jsx` so blank extraction fields no longer enable WhatsApp send, and the send payload now uses the canonical dialog `emailId`.
- Added regression coverage in `tests/ReceiptReviewDialog.test.jsx`; `npm run lint` and `npm test -- --run tests/ReceiptReviewDialog.test.jsx tests/InboxList.test.jsx` passed locally.

## 2026-03-28 — Experimental UX remediation checkpoint
- Reframed the authenticated loop so Suggestions is the primary review queue, Inbox is manual context, and Settings is limited to scope-true workflow preferences.
- Reworked `ReceiptReviewDialog.jsx` into an explicit four-step sequence and revalidated the affected frontend slices with targeted Vitest and local Playwright visual checks.

## 2026-03-29 — DDR: public auth funnel simplified
- Changed the public funnel so `HomePage` now launches Google OAuth directly while `LoginPage` remains the re-entry screen for logout, session expiry, callback error, and deliberate `/login` access.
- Updated the public copy and frontend auth tests to match the new entry-flow behavior.

### [2026-03-29] Session Close
- **Done:** Collapsed the normal public auth funnel so HomePage now launches Google OAuth directly.
- **Done:** Repositioned LoginPage as the re-entry/exception screen for logout, session expiry, callback error, and deliberate /login access.
- **Done:** Updated frontend tests and re-entry/state docs to match the new funnel behavior.
- **Learned:** When a public entry screen already explains the product clearly, keeping a second pre-OAuth screen as a mandatory step adds funnel friction; the better pattern is direct OAuth for the normal path and a separate re-entry screen for exceptional auth states.
- **Status:** CHECKPOINTED
- **Next:** Review the mixed frontend working tree and cut a local commit boundary for the public auth funnel and home UX slice before starting another UI change.

### [2026-03-30] Session Start
- **Done:** Checkpointed the previous experimental UX changes to establish a clean state.
- **Done:** Implemented Glass & Void (dark mode) HomePage redesign with framer-motion, glassmorphism, gradient borders, grid mesh, typing terminal, and animated counters.
- **Decided:** Visual direction not selected as final; will iterate with a new proposal.
- **Next:** Commit Glass & Void iteration and explore a different visual direction.

## 2026-03-30 — Public Home redesign iteration selected
- Updated `src/pages/HomePage.jsx` and `src/index.css` to the current dark aurora Home direction on the experimental branch.
- Applied a two-block React-aligned headline gradient and a faux window-style inbox mockup chrome with hover-straighten behavior.
- Local validation passed with `npm test -- --run tests/HomePage.test.jsx tests/AppAuthFlow.test.jsx`.
