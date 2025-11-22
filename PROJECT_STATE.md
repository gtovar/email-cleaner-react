# 1. Technical Header (Snapshot Metadata)

PROJECT_NAME: Email Cleaner & Smart Notifications — Frontend (React)
SNAPSHOT_DATE: 2025-11-21 19:45 CST
COMMIT: b24e4b40934bf31c83fc3fac82a8939f5f5d9ac1
ENVIRONMENT: local development (npm run dev)

COMPONENT_SCOPE:
  - React 18 + Vite
  - TailwindCSS
  - Custom HTTP service layer (api.js)
  - Two main views: SuggestionsList, HistoryList
  - Manual navigation via state (no React Router)

Notes:
- Snapshot covers ONLY this frontend repository.
- Backend Fastify and ML service are external dependencies.
- The frontend depends strictly on API_BASE configuration.

---

## 2. Executive Summary

The frontend builds and mounts correctly under Vite.  
Two functional screens exist: “Suggestions” and “History”.  
Navigation is implemented through internal state in `App.jsx`.  
API calls are centralized in `src/services/api.js` and successfully reach the backend when API_BASE is correct.  
However, several flows remain incomplete or out of sync with backend behaviour.

---

## 3. Component-by-Component Technical State

### 3.1 React Application Structure

- Code present:
  - `src/App.jsx`
  - `src/components/SuggestionsList.jsx`
  - `src/components/HistoryList.jsx`
  - `src/components/ConfirmButton.jsx`
  - `src/services/api.js`
  - `src/main.jsx`
  - `tailwind.config.js`
  - `index.html`

- App shell:
  - Navigation via `activeTab` state.
  - Renders:
    - `<SuggestionsList />`  
    - `<HistoryList />`  

- Styling:
  - TailwindCSS integrated and working.

---

### 3.2 Suggestions Feature (GET /suggestions)

- Component:
  - `src/components/SuggestionsList.jsx`

- Behaviour:
  - On mount → calls `getSuggestions()` from `api.js`.
  - Displays suggestion cards with accept/reject buttons.
  - Uses `ConfirmButton` to call backend.

- Verified against repo:
  - UI renders but suggestions mapping logic is partial.
  - No empty-state handling (“no suggestions available”).
  - No loading state.
  - No error boundary.

---

### 3.3 Confirm Action Feature (POST /notifications/confirm)

- Code in:
  - `src/components/ConfirmButton.jsx`
  - `src/services/api.js`

- Behaviour:
  - Sends `{ ids, action }` payload.
  - Shows success message (“Acción X confirmada…”).

- Verified:
  - Works when backend responds correctly.
  - Error state exists but is simplistic.
  - No optimistic UI or disabling while loading.

---

### 3.4 History Feature (GET /notifications/history)

- Component:
  - `src/components/HistoryList.jsx`

- Behaviour:
  - On mount → calls `getHistory()`.
  - Renders list of action cards.
  - “Repetir acción” calls `confirmAction()` again.

- Verified:
  - Cards render.
  - Payload mapping is incomplete (missing date formatting, missing perPage/page UI).
  - No pagination UI.
  - No empty-state messaging.

---

### 3.5 Navigation

- Implemented in:
  - `src/App.jsx`

- Verified:
  - functional, stable, no router required.
  - switching tabs does not crash the SPA.

- Limitation:
  - No URL-based navigation (refresh resets the view).
  - No global state persistence.

---

### 3.6 API Layer (src/services/api.js)

- API_BASE defined directly in file.
- Methods:
  - getSuggestions()
  - confirmAction()
  - getHistory()

- Verified issues:
  - API_BASE is hardcoded, must be configurable.
  - No centralized headers beyond Bearer token.
  - Error handling is minimal.

---

## 4. User Story Status (Evidence-Driven)

### HU6 — “Frontend wiring: Suggestions + Confirm + History”

**Status:** PARTIAL

**Evidence:**
- SuggestionsList exists and calls `/suggestions`.
- ConfirmAction works via ConfirmButton.
- HistoryList exists and calls `/notifications/history`.
- Navigation between both screens working.

**Pending:**
- Empty states for both screens.
- Loading states.
- Error handling consistent with backend.
- History pagination UI.
- Schema alignment with backend suggestions payload.

**Technical risks:**
- UI behaviour may break if backend ML schema changes.
- Lack of validation on suggestion items.
- Missing loading/error boundaries cause UI flicker.

**Recent decision/change:**
- Kept PARTIAL because flows exist but are not robust nor aligned with final backend contracts.

---

### HU7 — “API_BASE externalization + Environment readiness”

**Status:** NOT_STARTED

**Evidence:**
- API_BASE hardcoded in `src/services/api.js`.

**Pending:**
- Move API_BASE to env or config layer.
- Add switching for dev/stage/prod builds.

**Technical risks:**
- Hardcoded URL breaks deploys and local/remote testing.

**Decision:**
- Marked as NOT_STARTED until env-based configuration is implemented.

---

### HU8 — “Frontend UX reliability (loading, errors, empty states)”

**Status:** NOT_STARTED

**Evidence:**
- No loading states.
- Limited error handling.
- No empty-state UI in Suggestions or History.

**Pending:**
- Implement loading skeletons or spinners.
- Add empty-state UI for both screens.
- Unified error messages and retry options.

**Technical risks:**
- Unclear behaviour when backend returns empty lists or error codes.

**Decision:**
- Marked as NOT_STARTED; blocked only by implementation.

---

## 5. Current Technical Risks

- Contract drift between backend suggestions payload and frontend mapping.
- No environment-based configuration for API_BASE.
- No pagination controls in HistoryList.
- Limited error handling across the SPA.

---

## 6. Next Immediate Action

➡️ Externalize API_BASE into an environment config (HU7) and update `api.js` to use it.

---

## Version log

- 2025-11-21 19:45 CST — Initial creation of PROJECT_STATE.md based on full code audit (commit: pending)

