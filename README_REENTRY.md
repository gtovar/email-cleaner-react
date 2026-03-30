# README_REENTRY.md — Frontend (React)

## 1) Current Context Snapshot
- Repo: `email-cleaner-react`
- Branch: `feat/ux-review-bundle-experiments`
- Latest commit: `e6fffa6`
- Current work is a local experimental UX remediation pass based on `ux_review_bundle/feedback_pack_v2`.
- Summary lives in a right-side drawer (Sheet) opened from the header.
- OAuth login uses Google directly from `HomePage`, with `LoginPage` reserved for re-entry, callback errors, logout, and session expiry.
- Session expiry triggers a Login screen via `onAuthExpired`.
- Public Home page now renders at `/` and launches Google OAuth directly for unauthenticated users.
- Suggestions is now the explicit authenticated start point; Inbox is framed as manual review/context.
- Settings now exposes only scope-true workflow preferences and explicitly excludes account/security management.
- Open Graph / Twitter preview assets are present in `public/`.
- SummaryPanel and drawer flow are covered by automated tests.
- Auth callback success/error and session-expiry flow are covered by direct tests.
- Inbox and Settings app-shell mounting are covered by smoke tests in `tests/AppShellViews.test.jsx`.
- `SuggestionsList.jsx` now shows review priority, confidence, sensitivity, and richer inline context derived from the existing suggestion contract.
- `ReceiptReviewDialog.jsx` now separates review context, extracted evidence, receipt status, and WhatsApp send into an explicit four-step sequence.

## 2) What Changed During the Last Session
- Reworked `src/pages/HomePage.jsx` into the current dark aurora visual direction and kept the direct Google OAuth entry from `/`.
- Updated the headline treatment to use React-aligned two-block gradients instead of the earlier single-block experiment.
- Added a faux macOS-inspired chrome treatment plus hover-straighten behavior to the hero inbox mockup.
- Revalidated the current Home slice with `npm test -- --run tests/HomePage.test.jsx tests/AppAuthFlow.test.jsx`.

## 3) Exact Commands to Resume Work
```bash
git switch feat/ux-review-bundle-experiments
npm install
npm test -- --run tests/AppAuthFlow.test.jsx tests/SummaryPanel.test.jsx tests/HistoryList.test.jsx tests/AppShellViews.test.jsx tests/InboxList.test.jsx tests/SuggestionsList.test.jsx tests/ReceiptReviewDialog.test.jsx tests/SettingsPage.test.jsx
npm run dev
```

## 4) Where the Workflow Stopped
- The current public Home direction is implemented locally in `src/pages/HomePage.jsx` and selected by the user for this experimental branch.
- The working tree is commit-ready for the Home slice, excluding local temporary screenshot helpers.
- No remote action has been taken from this checkpoint.

## 5) Immediate Next Step
➡️ Commit the current public Home redesign iteration for `src/pages/HomePage.jsx` and `src/index.css`.

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
