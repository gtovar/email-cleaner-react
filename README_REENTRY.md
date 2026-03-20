# README_REENTRY.md — Frontend (React)

## 1) Current Context Snapshot
- Repo: `email-cleaner-react`
- Branch: `feat/hu05-receipt-review-whatsapp`
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
- HU19 is closed on `develop` for the documented local/browser scope; the next frontend task is no longer a HU19 completion step.
- ADR 007 now gives HU19 a direction: Inbox actions should use a dedicated contract, not the suggestion-confirm endpoint.
- ADR 003 now defines the frontend UX contract for confirmations, disabled states, and feedback.
- ADR 008 now defines bulk-result semantics, including partial success, per-item results, and local reconciliation for the first implementation pass.
- Fastify now emits ADR 008 response fields for bulk execution on `/api/v1/inbox/actions`, so the next frontend step is wiring multi-select bulk behavior to that contract.
- `InboxList` now implements the first HU19 slice for row-level actions: `archive` and `delete` confirm before executing, while `mark_unread` executes directly with toast feedback.
- Each Inbox row now exposes `data-testid="inbox-row-{id}"` so future E2E coverage can target rows without relying on DOM position.
- Playwright is now configured locally in `playwright.config.js`, and the first browser spec lives in `tests/e2e/hu19-row-level.spec.js`.
- The full HU19 browser suite now passes locally for row-level and bulk Inbox actions (`archive`, `delete`, `mark_unread`) against the fixture Inbox environment.
- Fastify already exposes the receipt-extraction route, the manual WhatsApp delivery route, and `GET /api/v1/emails/:id/content`, so the current slice consumes existing backend behavior only.

## 2) What Changed During the Last Session
- Added the `Revisar recibo` row action in `src/components/InboxList.jsx`.
- Added `src/components/ReceiptReviewDialog.jsx` to fetch full email content, call receipt extraction, capture phone manually, and trigger manual WhatsApp send.
- Added `getEmailContent`, `extractReceipt`, and `sendReceiptWhatsApp` helpers to `src/services/api.js`.
- Added targeted Vitest coverage in `tests/InboxList.test.jsx` and `tests/ReceiptReviewDialog.test.jsx`.
- Hardened `ReceiptReviewDialog` retry-load handling so stale async results no longer update state after dialog close or `emailId` switch, and added targeted stale-retry coverage in `tests/ReceiptReviewDialog.test.jsx`.

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
- The first `HU_05` frontend slice is implemented in `InboxList.jsx` and `ReceiptReviewDialog.jsx`.
- The dialog fetches `/api/v1/emails/:id/content`, calls the existing extraction route, and sends WhatsApp manually with phone input captured inside the dialog only.
- Targeted Vitest coverage for the slice is passing.
- A non-blocking Radix dialog warning still appears in test output and is currently deferred.
- The narrow review fix for stale retry-load updates is implemented and validated locally; the next step is to commit and push it to the active frontend PR branch.

## 5) Immediate Next Step
➡️ Commit and push the narrow `ReceiptReviewDialog` review fix for stale retry-load state updates to `feat/hu05-receipt-review-whatsapp`.

## 6) Technical Quick Reference
- `src/App.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/LoginPage.jsx`
- `src/components/activity/ActivityPanel.jsx`
- `src/components/SummaryPanel.jsx`
- `src/components/SuggestionsList.jsx`
- `src/components/InboxList.jsx`
- `src/components/ReceiptReviewDialog.jsx`
- `src/pages/SettingsPage.jsx`
- `src/services/api.js`

## 7) Reentry Status
- Reentry: clean
- Tests: last verified PASS (Vitest targeted `HU_05` slice plus stale retry review-fix coverage: `tests/InboxList.test.jsx`, `tests/ReceiptReviewDialog.test.jsx`) on 2026-03-19
