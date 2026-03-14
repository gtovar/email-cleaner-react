# README_REENTRY.md — Frontend (React)

## 1) Current Context Snapshot
- Repo: `email-cleaner-react`
- Branch: `develop`
- Latest commit: pending
- Summary lives in a right-side drawer (Sheet) opened from the header.
- OAuth login uses a dedicated Login page and httpOnly session cookie.
- Session expiry triggers a Login screen via `onAuthExpired`.
- Public Home page now renders at `/` and redirects to `/login` when unauthenticated.
- Inbox and Settings remain available views from the authenticated app shell.
- Open Graph / Twitter preview assets are present in `public/`.
- SummaryPanel and drawer flow are covered by automated tests.
- Auth callback success/error and session-expiry flow are covered by direct tests.
- Inbox and Settings app-shell mounting are covered by smoke tests in `tests/AppShellViews.test.jsx`.
- `InboxList` now has direct coverage for empty, error, and mobile preview states in `tests/InboxList.test.jsx`.
- `SettingsPage` now has direct coverage for section rendering, labeled inputs, and toggle defaults in `tests/SettingsPage.test.jsx`.
- `InboxList` now implements bulk controls for `archive`, `delete`, and `mark_unread` against the ADR 008 contract.
- HU19 is now the tracked follow-up for deciding whether Inbox becomes an actionable surface or stays read-only.
- ADR 007 now gives HU19 a direction: Inbox actions should use a dedicated contract, not the suggestion-confirm endpoint.
- ADR 003 now defines the frontend UX contract for confirmations, disabled states, and feedback.
- ADR 008 now defines bulk-result semantics, including partial success, per-item results, and local reconciliation for the first implementation pass.
- Fastify now emits ADR 008 response fields for bulk execution on `/api/v1/inbox/actions`, so the next frontend step is wiring multi-select bulk behavior to that contract.
- `InboxList` now implements the first HU19 slice for row-level actions: `archive` and `delete` confirm before executing, while `mark_unread` executes directly with toast feedback.
- Each Inbox row now exposes `data-testid="inbox-row-{id}"` so future E2E coverage can target rows without relying on DOM position.
- Playwright is now configured locally in `playwright.config.js`, and the first browser spec lives in `tests/e2e/hu19-row-level.spec.js`.
- The full HU19 browser suite now passes locally for row-level and bulk Inbox actions (`archive`, `delete`, `mark_unread`) against the fixture Inbox environment.

## 2) What Changed During the Last Session
- Added SummaryPanel coverage for loading, error, empty-state, and daily/weekly switching.
- Added ActivityPanel coverage to verify drawer rendering and actions.
- Added accessible title/description metadata to the drawer.
- Added App-level auth flow coverage for `/auth/callback` success, `/auth/callback?error=...`, and `onAuthExpired`.

## 3) Exact Commands to Resume Work
```bash
npm install
npm test
npm run dev
npm run test:e2e
npm run test:e2e -- --list
npm test -- SummaryPanel.test.jsx ActivityPanel.test.jsx
npm test -- AppAuthFlow.test.jsx
```

## 4) Where the Workflow Stopped
- HU17 and HU18 frontend are closed; app-shell coverage now includes Inbox and Settings mounting from `App.jsx`.
- `InboxList` direct state coverage now exists for empty, error, and mobile preview behavior.
- `SettingsPage` direct render coverage now exists for account, notification, and security sections.
- `InboxList` row-level actions are now wired at the frontend layer to the dedicated Inbox-action client path.
- `InboxList` bulk actions are implemented and covered by local browser validation.
- HU19 is the next tracked cross-repo feature: Inbox direct and bulk actions.
- The backend contract for `POST /api/v1/inbox/actions` now exists.
- Before browser automation, HU19 still needs two E2E prerequisites defined: a deterministic Inbox seed and a stable authenticated session strategy that does not depend on live Google OAuth.
- Those prerequisites are now available in backend form:
- `INBOX_SOURCE=fixture` provides the deterministic local Inbox dataset,
- the fixture dataset exposes the three controlled HU19 emails,
- `npm run session:e2e` provides a local `session_token` without live Google OAuth.
- Playwright setup now exists, and the row-level browser suite passes locally for `archive`, `delete`, and `mark_unread`.
- HU19 is now closed at the feature level for the current local scope: row-level and bulk Inbox flows both pass local browser validation.
- A localized `ScrollArea` viewport override in `src/index.css` keeps row action controls visible beside the reading pane during real-browser usage.

## 5) Immediate Next Step
➡️ Choose the next frontend feature slice after HU19 and update the working checkpoint before opening a new implementation track.

## 6) Technical Quick Reference
- `src/App.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/LoginPage.jsx`
- `src/components/activity/ActivityPanel.jsx`
- `src/components/SummaryPanel.jsx`
- `src/components/SuggestionsList.jsx`
- `src/components/InboxList.jsx`
- `src/pages/SettingsPage.jsx`
- `src/services/api.js`

## 7) Reentry Status
- Reentry: clean
- Tests: last verified PASS (Vitest, 12 files / 40 tests; Playwright, 6 tests) on 2026-03-11
