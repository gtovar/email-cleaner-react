# ADR 001: Frontend deployment on Cloud Run (containers)

- Status: accepted
- Date: 2026-01-12

## Context

The project requires a single, auditable deployment model with immutable artifacts across
environments. The backend already uses Docker-based CI/CD. Using Firebase Hosting for the
frontend would introduce a separate deployment paradigm and reduce operational consistency.

## Decision

Deploy the React frontend as a container on Google Cloud Run. The frontend will be built and
packaged via Docker, published to Artifact Registry, and deployed using the same CI/CD model
as the backend. Firebase Hosting is not used for the primary frontend.

## Consequences

- Pros:
  - Single deployment model (containers) for frontend and backend.
  - Immutable artifacts across dev/staging/prod.
  - Unified operational controls in Cloud Run.
- Cons:
  - Slightly more setup for a static frontend (Dockerfile, container build).
  - Runtime configuration requires a documented pattern (see `DEPLOYMENT.md`).
