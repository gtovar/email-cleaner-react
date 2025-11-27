# 📄 README_REENTRY.md — Frontend React

**Last updated:** 2025-11-27
**Branch:** `main`
**Scope:** Frontend React (Vite + Tailwind)
**Backend:** External Fastify service (separate repository)

---

# 1. Current Position (Where You Left Off)

The frontend is stable and fully functional:

* SuggestionsList loads suggestions with loading, empty-state and unified error handling.
* HistoryList displays action history, supports real pagination and allows repeating actions.
* ConfirmButton shows success/error states using StatusMessage.
* API_BASE is correctly loaded from `VITE_API_BASE_URL`.
* Navigation inside App.jsx works without router.
* HU8 (UX Reliability) and HU10 (Confirm actions) were completed in this session.

No broken flows, no pending wiring.

---

# 2. Active HU (What is currently being worked on)

**HU13 — Robust HTTP Client (retry + timeout)**
Focused on improving the resilience of the frontend requests.

---

# 3. How to Resume Work

(First command + first file to inspect)

### 3.1 Start backend & frontend

Backend (separate repo):

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
```

---

# 4. What To Do Next

(Single Next Action)

➡️ Implement retry + timeout wrappers inside `src/services/api.js` as part of HU13.

---

# 5. Files You Must Open Right Now

(In this exact order)

1. `src/services/api.js`
2. `src/components/SuggestionsList.jsx`
3. `src/components/HistoryList.jsx`
4. `src/components/ConfirmButton.jsx`

These files are directly impacted by HU13.

---

# 6. Known Risks (Frontend only)

* No automated test suite yet (covered in HU14).
* Retry/timeout is not implemented (current HU).
* Pagination still depends on array length; backend changes might require metadata.

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
* The technical state is documented in `PROJECT_STATE.md`.
* This file only exists to safely resume the project without reviewing old conversations.

