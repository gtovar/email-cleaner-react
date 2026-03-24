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
- Hardened `ReceiptReviewDialog` send-response handling so stale async send results no longer update state after dialog close or `emailId` switch, and added targeted stale-send coverage in `tests/ReceiptReviewDialog.test.jsx`.
- Clarified the manual send outcome so success is explicit and actionable, and send failures now differentiate validation, network, and backend/provider errors in `src/components/ReceiptReviewDialog.jsx`.
- Added `tests/e2e/hu06-receipt-review.spec.js` to validate the browser happy path for receipt review and a visible provider-error path with retry affordance.
- Switched `tests/e2e/hu06-receipt-review.spec.js` to dedicated HU06 fixture emails so the receipt-review browser flow no longer depends on HU19 row IDs or content.
- Removed the Radix dialog warning from `tests/ReceiptReviewDialog.test.jsx` by simplifying the dialog description wiring in `src/components/ReceiptReviewDialog.jsx`.
- Added versioned Husky hooks in `.husky/` so `pre-commit` now delegates to repo-local scripts under `scripts/git-hooks/`, while `commit-msg` validates Conventional Commit syntax with `commitlint`.
- Extended `.github/workflows/ci.yml` so PRs now validate commit messages with `commitlint` remotely before lint/test/build.
- Replaced `prepare: "husky"` with a guarded repo-local installer so production-style installs that omit devDependencies do not fail.
- Extended the repo-local Husky `pre-commit` flow with `scripts/git-hooks/check-comment-hygiene.sh` so empty comments and vague follow-up markers are blocked before commit.
- The hook-migration work is already merged; the repo is now clean on `develop`.

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
- The local browser spec for HU06 now passes against dedicated HU06 fixture emails for the receipt-review happy path and for a visible provider-error path with retry affordance.
- `ReceiptReviewDialog.jsx` now has stable hooks for the browser spec and no longer emits the previous Radix dialog warning in Vitest.
- The happy path still depends on the controlled local fixture/auth path rather than live Gmail or a live WhatsApp provider.
- The visible provider-error path still uses a controlled browser override on `/api/v1/notifications/receipt-whatsapp`; it validates feedback and retry affordance, not a real provider failure.
- Husky now owns the versioned hook entry point for this repo; manual validation confirmed that valid commit messages pass, invalid ones are blocked, the repo-local pre-commit gate now includes basic comment hygiene checks, and `prepare` no longer depends on workspace-only paths.
- There is no pending hook-migration checkpoint left in this repo; HU06 browser validation is already captured in the merged baseline.

## 5) Immediate Next Step
➡️ Wait for `HU_07A` to freeze the backend response identity and contract, then open `HU_07B` from `develop`; do not reopen the merged hook-migration work.

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
- Tests: last verified PASS (`npm test -- ReceiptReviewDialog.test.jsx`; `npm run test:e2e -- tests/e2e/hu06-receipt-review.spec.js`) on 2026-03-22
