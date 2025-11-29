# ADR-001 — Frontend Stack, Testing Strategy and HTTP Client Decision

## 1. Context

The **Email Cleaner & Smart Notifications** project uses:

### Backend
- **Node.js + Fastify**
- Automated tests with **Jest**
- Python microservice for ML classification (already integrated and stable)

### Frontend
- **React 18** (UI library)
- **Vite** (bundler + dev server)
- Communication with backend via **fetch** (Fastify endpoints)
- Two main UI views:
  - Suggestions
  - History

### Project goals
- Demonstrate a real integration between **Node (Fastify)**, **Python ML**, and **React**.
- Use a modern, interview-ready frontend stack.
- Keep the implementation simple and avoid unnecessary complexity.
- Add frontend automated testing (HU14).

This ADR documents the decisions regarding:
- The chosen frontend stack
- The testing approach
- The HTTP client strategy
- The routing strategy (React Router or not)

---

## 2. Options Considered

### 2.1 Frontend UI Framework / Library

#### Option A — React 18 + Vite (Current)
**Pros**
- Industry-standard UI library.
- Excellent DX (Developer Experience) using Vite.
- Fast startup times and HMR.
- Tons of learning resources.
- Perfect fit for an SPA-style admin dashboard consuming a REST API.

**Cons**
- Advanced features (SSR, routing) require extra libraries.

---

#### Option B — Next.js
**Pros**
- Full-featured framework: routing, SSR/SSG, optimizations.

**Cons**
- Higher complexity (routing conventions, server components).
- Overkill for a dashboard consuming an external Fastify backend.
- Distracts from the project’s main purpose (Node + Python + React integration).

---

#### Option C — Vue / Angular / Svelte / Others
**Pros**
- Technically interesting.

**Cons**
- Less aligned with the career goal (React-focused job roles).
- Fragment learning effort.

---

### 2.2 Frontend Testing Tools

#### Option A — Jest + React Testing Library
**Pros**
- Well-known in the industry.
- RTL is the standard way of testing React components.

**Cons**
- Heavy configuration required in Vite projects (transformers, ESM issues).
- Slower startup and less smooth DX compared to Vitest.

---

#### Option B — Vitest + React Testing Library (Preferred)
**Pros**
- Native integration with Vite (uses the same pipeline).
- Almost zero config.
- API is nearly identical to Jest (`describe`, `test`, `expect`).
- Modern choice, strong DX.
- Easy interview explanation:
  - Jest in backend
  - Vitest in frontend

**Cons**
- Some recruiters may be more familiar with Jest.
  (Mitigated by explaining Jest is also used in backend.)

---

### 2.3 HTTP Client Strategy

#### Option A — Native `fetch` (Preferred)
**Pros**
- Standard browser API.
- No additional dependency.
- Combined with a small wrapper (`httpRequest`/`apiClient`) it supports:
  - error handling
  - timeouts
  - retries (HU13)

**Cons**
- Slightly verbose without a wrapper.

---

#### Option B — axios
**Pros**
- Cleaner API.
- Built-in interceptors.

**Cons**
- Adds a dependency without strong benefit for this project.
- Fetch + wrapper already solves the use case well.

---

### 2.4 Routing

#### Option A — Use React Router immediately
**Pros**
- Real URLs (`/suggestions`, `/history`).
- Better structure for large apps.

**Cons**
- Adds complexity not needed yet.
- The current UI works with simple tab-based navigation.

---

#### Option B — No React Router for now (Preferred)
**Pros**
- Simpler for the current MVP.
- Can be added later once more views are introduced.

**Cons**
- No direct URL navigation per view (acceptable for now).

---

## 3. Decisions

1. **Frontend Framework**
   - Use **React 18 + Vite** as the main frontend stack.

2. **Testing**
   - Use **Vitest** as test runner.
   - Use **React Testing Library** for component tests.
   - Use **@testing-library/jest-dom** for extended DOM matchers.

3. **HTTP Client**
   - Use **native fetch** wrapped in a custom helper (`httpRequest` / `apiClient`).
   - Do not introduce axios at this stage.

4. **Routing**
   - Do **not** use React Router yet.
   - The SPA uses tab-based navigation.
   - React Router may be added in a future HU if required.

5. **Backend**
   - Keep **Jest** for backend/Fastify testing.
   - Do not migrate backend tests to Vitest.

---

## 4. Rationale

- The main purpose of the project is to demonstrate a real integration between:
  - Fastify (Node backend),
  - Python ML microservice,
  - React 18 frontend.
- React 18 + Vite offers a fast, modern and interview-friendly stack.
- Using **Jest in backend** and **Vitest in frontend** shows:
  - knowledge of classic industry tools (Jest)
  - and modern tooling (Vitest + Vite)
- Fetch with a wrapper is enough for a controlled API environment.
- Avoiding React Router initially simplifies onboarding and learning cost.
- The decisions keep the architecture clean and aligned with best practices.

---

## 5. Consequences

### Positive
- Clean, modern, fast frontend dev experience.
- Professional story for interviews:
  > “Backend uses Jest.  
  > Frontend uses Vitest + React Testing Library.  
  > React 18 + Vite for a modern SPA.  
  > Fetch-based HTTP client with retries/timeouts.”
- Minimal dependencies.
- Easy-to-maintain testing setup.

### Negative / Risks
- Some companies may expect Jest for frontend tests.
  - Mitigation: highlight that Vitest’s API is Jest-compatible.
- Missing React Router limits URL-based navigation.
  - Can be added later via a dedicated HU.

---

## 6. Status

- **Status:** Accepted
- **Related Work:**
  - HU14 — Frontend Test Suite
  - T-HU14-01 — Vitest + RTL setup (first test: `StatusMessage`)

