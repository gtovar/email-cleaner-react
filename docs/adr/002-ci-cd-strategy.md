# ADR 002: CI/CD Strategy (React Frontend)

## Status
Proposed

## Context
We need consistent frontend deployments with minimal operational overhead and
preview builds for PRs.

## Decision
- **CI**: GitHub Actions runs lint + test + build on PRs and `develop`.
- **CD**: Vercel Git Integration deploys automatically on `main`.
- **Domain**: `app.emailcleaner.gilbertotovar.com`.

## Practical Examples

1) CI/CD con GitHub Actions

- PR a develop → corre:
  - npm run lint
  - npm test
  - npm run build
- Merge a main → despliega:
  - Fastify a Cloud Run
  - React a Vercel

Ejemplo de workflow:

```
on:
  push:
    branches: [main]
jobs:
  deploy:
    steps:
      - run: gcloud run deploy ...
```

2) Infra como código (Terraform)

- Archivo cloudrun.tf define:
  - servicio Cloud Run
  - región us-central1
  - variables de entorno
  - permisos IAM
- Si mañana cambias de proyecto, ejecutas:

```
terraform apply
```

y recreas todo igual.

3) Staging y producción separados

- develop despliega a:
  - https://staging-api.tudominio.com
  - https://staging-app.tudominio.com
- main despliega a:
  - https://api.tudominio.com
  - https://app.tudominio.com

Así pruebas en staging antes de afectar usuarios.

4) Observabilidad integrada

- Al fallar login, recibes alerta en Slack:
  - “500 errors > 5% en /auth/google/callback”
- Dashboard muestra:
  - latencia p95
  - errores por endpoint
  - tasa de logins exitosos vs fallidos

## Alternatives Considered
1) **Cloud Run (Docker + nginx)**
   - Rejected: higher ops overhead for a static frontend.
2) **Manual deploy with Vercel CLI**
   - Rejected: no PR previews and easy to forget steps.
3) **GitHub Actions deploy to Vercel via token**
   - Rejected: less secure and duplicates Vercel’s native integration.

## Consequences
- Zero-config previews for PRs.
- Automatic production deploy on `main`.
- Requires repo linked to Vercel.
