# README_REENTRY.md — Frontend (React)

## 1) Current Context Snapshot
- Repo: `email-cleaner-react`
- Branch: `feat/ux-review-bundle-experiments`
- Latest commit: `e6fffa6`
- Current work is a local experimental UX remediation pass based on `ux_review_bundle/feedback_pack_v2`.
- Summary lives in a right-side drawer (Sheet) opened from the header.
- OAuth login uses a dedicated Login page and httpOnly session cookie.
- Session expiry triggers a Login screen via `onAuthExpired`.
- Public Home page now renders at `/` and redirects to `/login` when unauthenticated.
- Suggestions is now the explicit authenticated start point; Inbox is framed as manual review/context.
- Settings now exposes only scope-true workflow preferences and explicitly excludes account/security management.
- Open Graph / Twitter preview assets are present in `public/`.
- SummaryPanel and drawer flow are covered by automated tests.
- Auth callback success/error and session-expiry flow are covered by direct tests.
- Inbox and Settings app-shell mounting are covered by smoke tests in `tests/AppShellViews.test.jsx`.
- `SuggestionsList.jsx` now shows review priority, confidence, sensitivity, and richer inline context derived from the existing suggestion contract.
- `ReceiptReviewDialog.jsx` now separates review context, extracted evidence, receipt status, and WhatsApp send into an explicit four-step sequence.

## 2) What Changed During the Last Session
- Reframed the authenticated UX so `Suggestions` is the primary loop and `Inbox` is manual review/context support.
- Improved visible operational truth across public auth screens, summary/history messaging, fixture content, and local review data.
- Added richer decision quality in `src/components/SuggestionsList.jsx` with visible priority, confidence, sensitivity, and expanded context.
- Reordered `src/components/ReceiptReviewDialog.jsx` into explicit steps and clarified that receipt status and WhatsApp send are independent actions.
- Replaced the old generic account/security `SettingsPage` with scope-true workflow preferences plus an explicit out-of-scope section.
- Revalidated the affected slices with targeted Vitest and local Playwright visual passes.

## 3) Exact Commands to Resume Work
```bash
git switch feat/ux-review-bundle-experiments
npm install
npm test -- --run tests/AppAuthFlow.test.jsx tests/SummaryPanel.test.jsx tests/HistoryList.test.jsx tests/AppShellViews.test.jsx tests/InboxList.test.jsx tests/SuggestionsList.test.jsx tests/ReceiptReviewDialog.test.jsx tests/SettingsPage.test.jsx
npm run dev
```

## 4) Where the Workflow Stopped
- The experimental branch now contains a mixed local working tree across the UX remediation slices.
- `Suggestions`, `Inbox`, `ReceiptReviewDialog`, and `Settings` have already been reworked locally and validated with targeted tests.
- No remote action is intended from this checkpoint: no push, no merge, no PR update.
- The next risk is not implementation uncertainty; it is letting more work accumulate before cutting a local checkpoint boundary.

## 5) Immediate Next Step
➡️ Review the mixed experimental working tree and cut a local checkpoint boundary before adding another UX slice.

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
- `tests/SuggestionsList.test.jsx`
- `tests/ReceiptReviewDialog.test.jsx`
- `tests/SettingsPage.test.jsx`

## 7) Reentry Status
- Reentry: dirty and mid-experiment, but recoverable from this branch without remote dependencies
- Tests: last verified PASS (`npm test -- --run tests/AppAuthFlow.test.jsx tests/SummaryPanel.test.jsx tests/HistoryList.test.jsx tests/AppShellViews.test.jsx tests/InboxList.test.jsx tests/SuggestionsList.test.jsx tests/ReceiptReviewDialog.test.jsx tests/SettingsPage.test.jsx`) on 2026-03-28
