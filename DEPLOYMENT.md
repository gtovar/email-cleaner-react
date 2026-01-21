# DEPLOYMENT.md (React Frontend)

## Purpose

Repeatable deployment flow for the React frontend using **Vercel**.

---

## 1) Prerequisites

- Vercel account + CLI installed.
- Backend URL available (Cloud Run).
- Domain: `app.emailcleaner.gilbertotovar.com`.

---

## 2) Environment variables (Vercel)

Set **production** env vars:

```
VITE_API_ORIGIN=https://api.emailcleaner.gilbertotovar.com
VITE_API_BASE_URL=https://api.emailcleaner.gilbertotovar.com/api/v1
```

Commands:

```bash
vercel env add VITE_API_ORIGIN production
vercel env add VITE_API_BASE_URL production
```

---

## 3) SPA routing (required)

Vercel needs a rewrite for client-side routes (OAuth callback):

`vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 4) Deploy

```bash
cd email-cleaner-react
vercel
vercel --prod
```

Production URL:
- `https://email-cleaner-react.vercel.app`

---

## 5) CI/CD automation (GitHub Actions)

Workflow: `.github/workflows/deploy.yml`

Required GitHub Secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Notes:
- Deploys on `main` and on manual trigger.

---

## 6) Custom domain (app)

Add domain in Vercel:

```bash
vercel domains add app.emailcleaner.gilbertotovar.com
```

DNS in GoDaddy:
- Type: `A`
- Name: `app.emailcleaner`
- Value: `76.76.21.21`

Verify DNS:

```bash
dig +short app.emailcleaner.gilbertotovar.com
```

---

## 7) Validation

- Open `https://app.emailcleaner.gilbertotovar.com`
- Confirm login redirects to:
  `https://api.emailcleaner.gilbertotovar.com/auth/google/callback`
- Confirm UI loads suggestions after login.

---

**Last updated:** January 2026
