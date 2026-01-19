# PROJECT_STATE.md — Frontend React

Last updated: 2026-01-19 06:20 CST — Commit: pending

---

# 1. Technical Header (Snapshot Metadata)

PROJECT_NAME: Email Cleaner & Smart Notifications — Frontend (React)
SNAPSHOT_DATE: 2026-01-19 06:20 CST
COMMIT: pending
ENVIRONMENT: local

Notes:
- This snapshot reflects only the React frontend repository.
- Fastify backend and ML service are external dependencies.

---

# 2. Executive Summary

- Summary is shown in a right-side drawer (Sheet) opened from the header.
- Suggestions load from `/api/v1/suggestions` and render actionable emails.
- Summary aggregates load from `/api/v1/notifications/summary` with period controls.
- History screen loads paginated data from `/api/v1/notifications/history`.
- Confirmation actions call `/api/v1/notifications/confirm` and update UI state.
- Login view handles OAuth redirect and session expiry via `onAuthExpired`.

---

# 3. Component-by-Component Technical State

## 3.1 React Application

- Code present:
  - `src/main.jsx`
  - `src/App.jsx`
  - `index.html`
  - `tailwind.config.js`
- Navigation:
  - Local state toggles between Suggestions, History, Settings, and Login (no router).
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
  - `tests/HistoryList.test.jsx`
  - `tests/integration/confirmActionFlow.test.jsx`
  - `tests/httpRequest.test.jsx`
- Status:
  - PASS (Vitest, 6 files / 21 tests).
- CI:
  - GitHub Actions runs lint, test, and build on PRs and pushes to `develop`.

---

# 4. User Story Status (Evidence-Driven)

### HU17 — Suggestions vs Summary alignment (frontend)

**Estado:** IN_PROGRESS

**Evidencia comprobable:**
- `src/components/SummaryPanel.jsx`
- `src/components/SuggestionsList.jsx`
- `src/services/api.js`

**Pendientes (reales):**
- Add tests for SummaryPanel in the drawer.

**Riesgos técnicos:**
- SummaryPanel has no automated tests.
- Drawer content is not covered by tests.

**Decisión o cambio reciente:**
- Summary moved to right-side drawer (commit: pending).

### HU18 — Google OAuth session flow (frontend)

**Estado:** IN_PROGRESS

**Evidencia comprobable:**
- `src/App.jsx` (login button + callback handling)
- `src/services/api.js` (`credentials: 'include'`)

**Pendientes (reales):**
- Add tests for auth callback behavior.

**Riesgos técnicos:**
- Frontend depends on backend cookie settings (SameSite/Secure).
- Auth callback flow has no direct tests.

**Decisión o cambio reciente:**
- OAuth UI flow wired to backend login (commit: pending).

---

# 5. Current Technical Risks

- OAuth callback handling is not covered by tests.
- SummaryPanel and drawer UI are not covered by tests.

---

# 6. Next Immediate Action

➡️ Add tests for SummaryPanel and auth callback UI.

---

# Version log

- 2026-01-11 23:51 CST — Doc alignment and tests verified (commit: pending)
- 2026-01-12 01:45 CST — Template label alignment for HU sections (commit: pending)
- 2026-01-18 02:53 CST — UI refactor (drawer summary, login screen) and tests failing (commit: pending)
