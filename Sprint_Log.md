# Sprint_Log.md — Frontend React

Sprint: 2026-01
Scope: UI alignment for suggestions vs summary
Backend: yes (email-cleaner-fastify)
Frontend: yes

---

### 2025-11-28 — HU13 completed
- Added HTTP client retries and timeouts in `src/services/api.js`.

### 2025-11-29 — HU14 completed
- Frontend test suite stabilized under Vitest.

### 2025-12-03 — HU15 completed
- Added `tests/httpRequest.test.jsx` for HTTP client coverage.

### 2026-01-11 — Summary widget added
- Added `src/components/SummaryPanel.jsx`.
- Aligned suggestions list with `/api/v1/suggestions`.

### 2026-01-11 — OAuth UI flow wired
- Added login button and callback handling for backend OAuth.

### 2026-01-12 — Frontend doc alignment
- Updated `PROJECT_STATE.md` to match the frontend template labels.

### 2026-01-18 — UI refactor and auth UX
- Added Login screen and session-expired handling in `src/App.jsx`.
- Moved Summary into a right-side drawer and added shadcn-style UI components.

### 2026-01-18 — Test suite aligned
- Updated Vitest expectations for skeleton loaders, EmptyState, and delayed removal.
- Integration flow now mocks `onAuthExpired`.
