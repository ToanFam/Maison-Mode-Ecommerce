# Deployment Guide

This project can be deployed as two services plus PostgreSQL:

- `frontend`: static React app served by Nginx
- `backend`: Spring Boot API
- `postgres`: managed PostgreSQL or Docker PostgreSQL

## Required Environment Variables

Backend:

```text
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/fashion_commerce
# Or use managed provider URLs. Used only when SPRING_DATASOURCE_URL is blank:
DATABASE_URL=postgresql://user:password@host:5432/fashion_commerce
POSTGRES_USER=...
POSTGRES_PASSWORD=...
SPRING_JPA_HIBERNATE_DDL_AUTO=update
JWT_SECRET=at-least-32-random-characters
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
RATE_LIMIT_ENABLED=true
RATE_LIMIT_CAPACITY=120
RATE_LIMIT_WINDOW_SECONDS=60
```

Frontend build:

```text
VITE_API_URL=https://your-api-domain.com/api
```

## Docker VPS

1. Install Docker and Docker Compose on the server.
2. Point DNS records to the VPS.
3. Copy the repository to the server.
4. Create `.env` from `.env.production.example`.
5. Start services:

```bash
docker compose up --build -d
```

6. Put Caddy, Nginx Proxy Manager, Traefik, or your VPS load balancer in front for TLS.
7. Set:

```text
CORS_ALLOWED_ORIGINS=https://your-store.com
VITE_API_URL=https://api.your-store.com/api
```

Recommended production database setting after migrations are stable:

```text
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```

## Render

The repository includes `render.yaml`.

Recommended setup:

1. Create a Blueprint from the repository.
2. Review generated services:
   - `maison-mode-api`
   - `maison-mode-web`
   - `maison-mode-db`
3. Replace placeholder domains in `render.yaml`:
   - `CORS_ALLOWED_ORIGINS`
   - `VITE_API_URL`
4. Deploy.

Render managed PostgreSQL exposes `DATABASE_URL` as a provider connection string. The backend converts `postgres://` or `postgresql://` values to a JDBC URL at startup, so no manual conversion is needed. If you choose to set `SPRING_DATASOURCE_URL` yourself, use:

```text
jdbc:postgresql://HOST:PORT/DATABASE
```

## Railway

Railway works best with separate services:

1. Create PostgreSQL service.
2. Create backend service from `backend/Dockerfile`.
3. Create frontend service from `frontend/Dockerfile`.
4. Set backend variables from the PostgreSQL service.
5. Set frontend `VITE_API_URL` to the backend public URL plus `/api`.
6. Set backend `CORS_ALLOWED_ORIGINS` to the frontend public URL.

Railway PostgreSQL can provide `DATABASE_URL`; the backend accepts it directly. If you set `SPRING_DATASOURCE_URL`, it takes precedence and must use the JDBC format.

The included `railway.json` provides default Docker deployment behavior. In a monorepo, configure each Railway service root directory explicitly in the Railway UI.

## Monitoring

Backend endpoints:

```text
/actuator/health
/actuator/health/readiness
/actuator/metrics
/actuator/prometheus
```

Prometheus local profile:

```bash
docker compose --profile monitoring up -d prometheus
```

For production, secure Prometheus behind a private network or authenticated reverse proxy.

## Security Checklist

- Use HTTPS only.
- Set a strong `JWT_SECRET`.
- Restrict `CORS_ALLOWED_ORIGINS` to production frontend domains.
- Do not expose PostgreSQL publicly.
- Keep `/actuator/prometheus` private in production.
- Use `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` after adopting migrations.
- Rotate database credentials before public launch.
- Store uploaded product images on persistent disk or object storage.

## SEO

Static SEO assets are in `frontend/public`:

- `robots.txt`
- `sitemap.xml`
- `og-image.svg`
- `favicon.svg`

Before launch, replace `https://maison-mode.example.com` with your production domain in:

- `frontend/index.html`
- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml`
