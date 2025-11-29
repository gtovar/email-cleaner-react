# 1. Technical Header (Snapshot Metadata)

PROJECT_NAME: Email Cleaner & Smart Notifications — Frontend (React)
SNAPSHOT_DATE: 2025-11-28 23:30 CST
COMMIT: 3abbb56d9e034ee2f3c4f6ae9feb774371522023 
ENVIRONMENT: local development (`npm run dev`)

Notes:

* This snapshot reflects ONLY the React frontend repository.
* Fastify backend and Python ML service are external dependencies.

---

# 2. Executive Summary

The current frontend is fully functional under Vite + React 18.
Suggestions and History screens load data from the Fastify backend and support confirmation + repeat actions.
A centralized, resilient HTTP client is now in place (HU13), implementing retry, timeout and normalized errors across all API calls.
The UI presents consistent loading, error, empty and success states.
No automated test suite exists yet; all behavior validated manually.

---

# 3. Component-by-Component Technical State

## 3.1 React Application

* Code present:

  * `src/main.jsx`
  * `src/App.jsx`
  * `index.html`
  * `tailwind.config.js`
* Navigation:

  * Simple in-component state toggle (no router).
* Styling:

  * TailwindCSS operational and rendering correctly.

---

## 3.2 Screens and Components

### Suggestions screen (`SuggestionsList.jsx`)

* Loads suggestions via `getSuggestions()`.
* Renders subject, sender, date, suggestions.
* Includes:

  * Loading state.
  * Empty state (no suggestions).
  * Error state with `StatusMessage`.
* Confirming an action removes the suggestion from the UI and shows success feedback.

---

### History screen (`HistoryList.jsx`)

* Loads actions via `getHistory(page, perPage)`.
* Uses **pagination** via local `page` state.
* Expects `getHistory()` to return a **plain array of actions**.
* Includes:

  * Loading state.
  * Empty state.
  * Error state with `StatusMessage`.
* “Repeat Action” button calls `confirmAction()`.

---

### Shared components

#### `ConfirmButton.jsx`

* Handles POST confirmation.
* Shows loading + error handling.
* On success triggers parent callback.

#### `StatusMessage.jsx`

* Centralized UI for success / error / info messages.
* Used in Suggestions and History screens.

---

## 3.3 API Client (`src/services/api.js`)

### API_BASE

* Read from `VITE_API_BASE_URL`.
* Default fallback: `http://localhost:3000/api/v1`.

### Implemented methods

* `getSuggestions(period)`
* `getHistory(page, perPage)`
* `confirmAction(ids, action)`

### Resilience (HU13 — DONE)

* **Typed `HttpError`** for HTTP-level failures.
* **Timeout** using `AbortController` (configurable via `VITE_API_TIMEOUT_MS`).
* **Retry logic**:

  * Retries only on `"Timeout"` and `"Network error"`.
  * No retry on `"Server error"` / `"Request failed <status>"`.
* **Error normalization**:

  * `"Network error"`
  * `"Timeout"`
  * `"Server error"`
  * `"Request failed <status>"`

### Contract adaptation

* `/notifications/history` returns:

  ```json
  { "total": ..., "page": ..., "perPage": ..., "data": [...] }
  ```
* `getHistory()` adapts this → returns only the array (`result.data`).

---

## 3.4 Environment

* `.env.example` present with `VITE_API_BASE_URL`.
* Optional: `VITE_API_TIMEOUT_MS` for local tuning.
* Dev setup tested with:

  * Fastify backend in local mode.
  * Frontend via `npm run dev`.

---

## 3.5 Tests

* No automated test suite present.
* No Jest / Vitest configuration.
* All validation performed manually during HU13.

---

# 4. User Story Status (Evidence-Driven)

---

### **HU8 — Frontend UX Reliability & UI Consistency**

**Estado:** DONE
**Evidencia comprobable:**

* `StatusMessage.jsx` in use.
* History pagination implemented.
* Loading/empty/error states in both screens.
* ConfirmButton standardized feedback.

**Pendientes reales:** ninguno
**Riesgos técnicos:** ninguno
**Decisión:** confirmed after full UI review.

---

### **HU10 — Confirmar acciones desde el frontend (Cierre)**

**Estado:** DONE
**Evidencia comprobable:**

* Functional `ConfirmButton`.
* History reflects confirmed actions.
* End-to-end loop works (suggest → confirm → history).

**Pendientes:** ninguno
**Riesgos técnicos:** ninguno

---

### **HU13 — Robust HTTP Client (Retry + Timeout + Resilience)**

**Estado:** DONE
**Evidencia comprobable:**

* `httpRequest()` implemented with typed `HttpError`.
* `normalizeHttpError()` + `normalizeNetworkError()` working.
* Timeout via AbortController validated.
* Retries validated manually (network error + timeout scenarios).
* Error messages normalized across UI.
* `getHistory()` adapted to backend response `{ data: [...] }`.

**Pendientes reales:** ninguno
**Riesgos técnicos:** mínimos (no tests yet).

**Decisión:** merged after validating all resilience paths (OK, 404, 500, Timeout, Network error).

---

## HU14 — Frontend Test Suite (Unit + Integration Testing)



**Estado:** DONE (2025-11-30)

**Evidencia comprobable:**

* Configuración completa de Vitest + React Testing Library + happy-dom:

  * `vite.config.js` → sección `test.environment = "happy-dom"`
  * `tests/setupTests.js` → `@testing-library/jest-dom/vitest`
* Suite funcionando:

  * `tests/StatusMessage.test.jsx`
  * `tests/ConfirmButton.test.jsx`
  * `tests/SuggestionsList.test.jsx`
  * `tests/HistoryList.test.jsx`
  * `tests/integration/confirmActionFlow.test.jsx`
* Todos los tests en verde (`npm test`): 16 tests pasando.
* Suite valida flujos reales:

  * loading / empty / error
  * paginación
  * confirmación
  * repeatAction
  * interacción entre componentes

**Pendientes (reales):**
Ninguno.
*Todos los TODOs fueron implementados durante T-HU14-03.*

**Riesgos técnicos:**

* Tests E2E todavía no existen (serán otra HU futura).
* El cliente HTTP (`httpRequest`) no tiene tests unitarios dedicados (será HU15).

**Decisión o cambio reciente:**

* Se cerraron T-HU14-01, T-HU14-02 y T-HU14-03.
* Se reemplazó el estado BACKLOG previamente registrado en este archivo, que ya no correspondía al estado real.



---

# 5. Current Technical Risks

* No automated test suite (critical area: `httpRequest()`).
* Error paths tested manually only.
* Pagination correctness depends on backend availability and correct metadata.
* No E2E tests for full workflows.

---

# 6. Next Immediate Action

➡️ **Design and implement HU14 — Setup frontend automated tests (Jest/Vitest).**
(Single executable step: create base test config + first test for `StatusMessage` or `httpRequest()`.)

---

# Version log

* **2025-11-28 23:30 CST** — Updated PROJECT_STATE after completing HU13; added resilience layer details; updated HU statuses. (commit: pending)
* **2025-11-27 14:00 CST** — Initial snapshot created (HU8, HU10 done; HU13, HU14 added).

### 2025-11-28 — HU14: Base frontend test suite

- [x] T-HU14-01 — Setup de entorno de pruebas (Vitest + React Testing Library + happy-dom)
- [x] T-HU14-02 — Tests iniciales de componentes clave
  - StatusMessage: sin mensaje, success, error.
  - ConfirmButton: loading, éxito (onSuccess), error (mensaje visible).
  - SuggestionsList: loading, empty-state, error, flujo de “Aceptar” con confirmAction mockeado.
- [ ] T-HU14-03 — HistoryList test coverage + confirmAction integration flow
  - Especificado como siguiente tarea.
  - TODOs documentados en:
    - `tests/HistoryList.test.jsx`
    - `tests/integration/confirmActionFlow.test.jsx`

### 2025-11-30 01:10 CST — HU14 completada. Suite unitaria + integración lista (16 tests green).
