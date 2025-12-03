# Email Cleaner & Smart Notifications — Frontend (React + Vite)

Frontend application for the Email Cleaner & Smart Notifications system.  
This interface allows users to visualize ML-generated suggestions, review the action history, and interact with the backend via a resilient HTTP client.

This README follows the project’s official documentation style.

---

## 1. Purpose

This repository contains the **React + Vite frontend** for:

- Displaying categorized email suggestions (from ML service).
- Reviewing historical actions (confirm/reject decisions).
- Sending confirm/reject actions to the backend.
- Providing a clean UI for interacting with the Fastify backend and ML microservice.

The frontend is intentionally lightweight, resilient, and fully tested.

---

## 2. Requirements

- **Node.js:** v22.x
  (match `.nvmrc` — run `nvm use`)
- **npm:** v10+  
- **Vite:** 6.x or 7.x
- Backend running locally at:  
  `http://localhost:3000/api/v1`

---

## 3. Installation

```bash
git clone <your-repo-url>
cd email-cleaner-react
nvm use          # reads .nvmrc
npm install
````

### Environment Variables

The frontend expects the following:

| Variable            | Default                        | Usage                    |
| ------------------- | ------------------------------ | ------------------------ |
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | Root URL for backend API |

Create a `.env` file if you want to customize it:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

---

## 4. Quick Start

Run development mode:

```bash
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---

## 5. Testing

Run the full test suite:

```bash
npm test
```

Includes:

* **HU14:** Integration/UI tests
* **HU15:** Direct unit tests for `httpRequest()`
* **HU13:** Resilient networking (retry, timeout, normalized errors)

Testing environment:

* Vitest
* @testing-library/react
* happy-dom

---

## 6. Project Structure

```txt
src/
 ├─ components/
 │   ├─ SuggestionsList.jsx
 │   ├─ HistoryList.jsx
 │   └─ Navigation.jsx
 ├─ services/
 │   └─ api.js               # httpRequest(), getSuggestions(), getHistory(), confirmAction()
 └─ App.jsx

tests/
 ├─ httpRequest.test.jsx     # HU15
 ├─ SuggestionsList.test.jsx # HU14
 └─ HistoryList.test.jsx     # HU14
```

---

## 7. API Endpoints Consumed

The frontend interacts strictly with the Fastify backend (same contract validated by tests):

### Summary (ML Suggestions)

```
GET /emails/summary
```

### Action History

```
GET /notifications/history?page=X&perPage=20
```

### Confirm/Reject Action

```
POST /notifications/confirm
```

These endpoints are defined in the backend’s Swagger (Fastify).

---

## 8. Documentation Index

Main documentation files in this repo:

| Document            | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| `PROJECT_STATE.md`  | Truth snapshot of progress, HUs and tech status       |
| `README_REENTRY.md` | Quick-start mental model to re-enter the project      |
| `Sprint_Log.md`     | Chronological log of real actions and micro-decisions |

These documents must remain consistent with code and tests.

---

## 9. Contribution Guide

1. Create a branch based on `main`:

   ```bash
   git checkout -b feature/<hu-or-task-name>
   ```
2. Follow commit best practices:

   * English
   * Clear scope
   * Atomic commits
3. Always run:

   ```bash
   npm test
   ```

   before pushing.
4. Submit PR → review → squash merge into `main`.

---

## 10. License / Status

Internal project for personal portfolio and educational purposes.
Not intended for public distribution.
