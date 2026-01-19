# DEPLOYMENT.md

## Purpose

Document a repeatable deployment flow for the React frontend on Google Cloud Run.

## Deployment Target

Cloud Run (static frontend served from a container).

## Prerequisites

* Google Cloud project with Cloud Run enabled.
* `gcloud` installed and authenticated.
* Artifact Registry enabled.
* A backend URL (public) for runtime configuration.

## Build and Runtime Configuration

Current frontend uses Vite build-time variables (`VITE_*`). For true runtime configuration,
serve a small config file at container start (example below) and read it in the app.

Required values:

* `API_BASE_URL` (example: `https://api.example.com/api/v1`)
* `API_ORIGIN` (example: `https://api.example.com`)

## Dockerfile (static server + runtime config)

```Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ops/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ops/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8080
CMD ["/entrypoint.sh"]
```

## Runtime config entrypoint (example)

Create `ops/entrypoint.sh`:

```sh
#!/bin/sh
cat <<EOF > /usr/share/nginx/html/runtime-config.js
window.__APP_CONFIG__ = {
  API_BASE_URL: "${API_BASE_URL}",
  API_ORIGIN: "${API_ORIGIN}"
};
EOF

nginx -g "daemon off;"
```

Your app should read `window.__APP_CONFIG__` when present, and fall back to Vite envs.

## Nginx config (example)

Create `ops/nginx/default.conf`:

```nginx
server {
  listen 8080;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

## Build and Deploy (Cloud Run)

1) Build the container locally:

```bash
docker build -t gcr.io/YOUR_PROJECT/email-cleaner-frontend:latest .
```

2) Push the image:

```bash
docker push gcr.io/YOUR_PROJECT/email-cleaner-frontend:latest
```

3) Deploy to Cloud Run:

```bash
gcloud run deploy email-cleaner-frontend \
  --image gcr.io/YOUR_PROJECT/email-cleaner-frontend:latest \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars API_BASE_URL="https://api.example.com/api/v1",API_ORIGIN="https://api.example.com"
```

## Validation

* Open the Cloud Run URL in a browser.
* Verify login redirects to the backend.
* Confirm `/api/v1/suggestions` and `/api/v1/notifications/summary` load.

## Notes

* If runtime config is not implemented, use build-time `VITE_*` variables instead.
* For staging vs production, deploy separate services or revisions.
