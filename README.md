# Maison Mode Ecommerce

Production-ready full-stack fashion ecommerce project.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn-style components
- Backend: Java 21, Spring Boot, Spring Security, JWT, Spring Data JPA
- Database: PostgreSQL
- Ops: Docker, Docker Compose, Actuator, Prometheus-ready metrics

## Project Structure

```text
.
|-- backend
|   |-- Dockerfile
|   `-- src/main/java/com/maisonmode
|       |-- config
|       |-- controller
|       |-- dto
|       |-- entity
|       |-- exception
|       |-- repository
|       |-- security
|       |-- service
|       |-- specification
|       |-- util
|       `-- validator
|-- frontend
|   |-- Dockerfile
|   |-- nginx.conf
|   |-- public
|   `-- src
|-- docs
|-- monitoring
|-- docker-compose.yml
|-- render.yaml
`-- railway.json
```

## Local Development

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run backend:

```bash
cd backend
mvn spring-boot:run
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8080/api`

## Production With Docker Compose

Create an env file:

```bash
cp .env.production.example .env
```

Set strong values for `POSTGRES_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`, and `VITE_API_URL`.
For managed Postgres providers, you may use `DATABASE_URL` instead of `SPRING_DATASOURCE_URL`.

Build and run:

```bash
docker compose up --build -d
```

Run with monitoring:

```bash
docker compose --profile monitoring up --build -d
```

Services:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Prometheus: `http://localhost:9090`

## Production Features

- Validated backend environment variables through `AppProperties`
- Managed `DATABASE_URL` support for Render/Railway Postgres
- Standard API response and error response shape
- Centralized exception handling
- Spring Security headers and JWT auth
- IP-based API rate limiting
- Actuator health and Prometheus metrics
- Nginx static asset caching, gzip, and security headers
- SEO metadata, `robots.txt`, and `sitemap.xml`
- React error boundary
- Docker images for frontend and backend

## Verification

Frontend:

```bash
cd frontend
npm run lint
npm run build:prod
```

Backend:

```bash
cd backend
mvn test
mvn package
```

## Deployment

See [docs/deployment.md](docs/deployment.md).
