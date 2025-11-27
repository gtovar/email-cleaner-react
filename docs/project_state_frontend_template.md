# PROJECT_STATE.md — Frontend React

Last updated: <YYYY-MM-DD HH:MM CST> — Commit: <hash | pending>

---

# 1. Technical Header (Snapshot Metadata)

PROJECT_NAME: Email Cleaner & Smart Notifications — Frontend (React)  
SNAPSHOT_DATE: <YYYY-MM-DD HH:MM CST>  
COMMIT: <short-hash | pending>  
ENVIRONMENT: <local / develop / main / feature/...>  

Notes:
- This snapshot reflects ONLY the React frontend repository.
- Backend Fastify and ML service are external dependencies.

---

# 2. Executive Summary

Short, factual summary (5–7 lines max):

- What works today in the frontend.
- Which screens are functional (Suggestions, History, etc.).
- Which flows are stable (loading, empty-state, errors, pagination, confirmation).
- Which HUs were recently completed.
- Which major limitation still exists (e.g. no tests, no retry/timeout).

No opinions. No plans. No backlog.

---

# 3. Component-by-Component Technical State

## 3.1 React Application

- Code present:
  - `src/main.jsx`
  - `src/App.jsx`
  - `index.html`
  - `tailwind.config.js`
- Navigation:
  - <describe active navigation approach: state, router, etc.>
- Styling:
  - <Tailwind / CSS state, if relevant>.

## 3.2 Screens and Components

### Suggestions screen

- Component(s):
  - `src/components/SuggestionsList.jsx`
  - other related components if any.
- Behaviour:
  - <how it loads data, what it renders>.
- States:
  - <loading / empty / error / success implemented?>.

### History screen

- Component(s):
  - `src/components/HistoryList.jsx`
- Behaviour:
  - <how it loads history, what it renders>.
- Pagination:
  - <page/perPage behaviour>.
- States:
  - <loading / empty / error implemented?>.

### Shared components (Buttons, Messages, etc.)

- `ConfirmButton.jsx`:
  - <behaviour, loading, success/error>.
- `StatusMessage.jsx` (or equivalent):
  - <how it centralizes feedback>.

## 3.3 API Client (`src/services/api.js`)

- API_BASE:
  - <where it comes from: VITE_API_BASE_URL, etc.>.
- Implemented methods:
  - `getSuggestions`
  - `getHistory`
  - `confirmAction`
- Error handling:
  - <how errors are normalized and propagated>.
- Resilience:
  - <retry/timeout present or not>.

## 3.4 Environment

- `.env.example` present: <yes/no>.
- Required env vars:
  - `VITE_API_BASE_URL`
  - <others, if any>.
- Dev environment state:
  - <works with local backend? any known issues?>.

## 3.5 Tests

- Test runner:
  - <none / Jest + RTL / other>.
- Existing tests:
  - <list of test files or "none">.
- Status:
  - <all green / not configured>.

---

# 4. User Story Status (Evidence-Driven)

Use this exact format for each HU:

### HUXX — <name>

**Estado:** <DONE | EN_CURSO | BLOCKED | BACKLOG>

**Evidencia comprobable:**
- <files and components that prove the HU is real>
- <behaviours verified: endpoints called, UI states, etc.>

**Pendientes (reales):**
- <only technical items that are truly missing in code>

**Riesgos técnicos:**
- <only objective risks derived from current code>

**Decisión o cambio reciente:**
- <1–2 lines: why the state changed, optionally with commit hash>

Repeat this block for each HU that touches the frontend.

---

# 5. Current Technical Risks

Bullet list of REAL, verified risks:

- <Security issues (if any)>
- <Architecture inconsistencies>
- <Infra / env fragility>
- <Lack of tests in critical areas>
- <Contract mismatches with backend>

No speculation. No psychological risks. No project management notes.

---

# 6. Next Immediate Action

➡️ <one single technical step executable in 5–15 minutes>

Examples:
- “Implement retry + timeout in api.js (HU13).”
- “Add unit test for StatusMessage (HU14).”

Only one. No lists.

---

# Version log

- <YYYY-MM-DD HH:MM CST> — <short description of change> (commit: <hash | pending>)
- <YYYY-MM-DD HH:MM CST> — <short description of change> (commit: <hash | pending>)

