# 📄 README_REENTRY.md — Frontend React

*(Email Cleaner & Smart Notifications — React App)*

**Last updated:** 2025-11-28
**Branch:** `develop`
**Scope:** Frontend React (Vite + Tailwind)
**Backend:** External Fastify service (separate repository)

---

# 1. Current Position (Where You Left Off)

The frontend is fully operational:

* SuggestionsList loads suggestions with loading, empty-state, and normalized error handling.
* HistoryList loads paginated history, supports repeating actions, and shows proper feedback.
* ConfirmButton works with success/error states through StatusMessage.
* API_BASE and timeout values are read from environment variables.
* All network requests now use the centralized resilient client (`httpRequest`).
* HU8, HU10, and HU13 are completed and verified manually.

No broken flows. No pending wiring. No temporary test code remaining.

---

# 2. Active HU (What is currently being worked on)

**HU14 — Frontend Test Suite (Unit + Integration)**
Focus: configure Jest/Vitest and add tests for the HTTP client and UI components.

---

# 3. How to Resume Work

(First command + first file to inspect)

### 3.1 Start backend & frontend

Backend (separate repository):

```
npm run dev
```

Frontend:

```
npm install
npm run dev
```

### 3.2 Environment

`.env` must include:

```
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_API_TIMEOUT_MS=5000
```

---

# 4. What To Do Next (Single Next Action)

➡️ **Initialize HU14 by creating the frontend test environment (Jest/Vitest).**

---

# 5. Files You Must Open Right Now

(Open exactly in this order)

1. `src/services/api.js`
2. `src/services/__tests__/` *(to be created for HU14)*
3. `src/components/StatusMessage.jsx`
4. `src/components/ConfirmButton.jsx`

These are the first targets for the initial HU14 test cases.

---

# 6. Known Risks (Frontend only)

* No automated test suite (critical for resilience).
* Error normalization and retry logic presently verified only with manual testing.
* Pagination correctness depends on backend metadata.

---

# 7. Environment Requirements

* Node.js 20+
* npm 10+
* Vite (as dev dependency)
* Backend running at the configured API base URL

---

# 8. Useful Commands

### Development

```
npm run dev
```

### Build

```
npm run build
```

### Preview build

```
npm run preview
```

---

# 9. Notes

* This file does not contain backlog or User Stories.
* The full technical state lives in `PROJECT_STATE.md`.
* This file exists only to allow safe resumption without reviewing previous conversations.

