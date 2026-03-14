# PROJECT_STATE.md — Frontend React

This document is the React-specific extension for `PROJECT_STATE.md`.

The shared structure and required labels now live in:
- `email-cleaner-react/docs/project_state_fill_guide.md`

Use that fill guide as the primary contract.
Use this file only for frontend-specific expectations.

---

## Frontend-Specific Expectations

Section 3 should usually cover:
- application shell and navigation
- screens and shared components
- API client and environment configuration
- test status for Vitest, RTL, and Playwright when present

Section 4 should track frontend-facing HUs with the shared status block exactly.

---

## Update Triggers

Update `PROJECT_STATE.md` when one of these is true:
- a frontend user story changes status
- screens, components, routes, or contracts change
- critical frontend test status changes
- environment or runtime assumptions for the frontend change

Never update it for plans, ideas, or speculative notes.
