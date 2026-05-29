# Portfolio Blog Deployment

This project is a React frontend plus a small Node.js backend in one deployable service.

## What the backend does

- Serves the React production build.
- Provides `/api/auth/login` for admin login.
- Provides `/api/posts` CRUD endpoints for blog posts.
- Stores posts in `posts.json` under `DATA_DIR`.
- Seeds default posts, projects, and site config only when the corresponding mounted data file does not exist.

## Admin credentials

Set credentials locally or in your deployment environment before starting the server. Do not commit real values.

```text
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-strong-password
SESSION_SECRET=replace-with-a-random-secret-at-least-32-characters-long
```

`ADMIN_PASSWORD` is required. `SESSION_SECRET` must be a random value with at least 32 characters.
For Docker Compose, keep these values in a local `.env` file that is not committed.

## Docker Compose

```bash
docker compose up -d --build
```

Open:

- Site: `http://localhost:8080`
- Admin login: `http://localhost:8080/admin/login`
- Blog: `http://localhost:8080/blog`

The compose file mounts `./data` at `/app/data`, so admin edits survive container restarts and rebuilds. Existing mounted files always win over bundled defaults.

## Environment variables

```text
PORT=8080
DATA_DIR=/app/data
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-strong-password
SESSION_SECRET=replace-with-a-random-secret-at-least-32-characters-long
```

## Production notes

This backend is intentionally small and dependency-free. It is enough for a personal blog admin panel behind a single account, but for public production you should still:

- Use HTTPS through a reverse proxy such as Nginx or Caddy.
- Set a strong `SESSION_SECRET`.
- Replace the default admin password.
- Back up the Docker volume containing `/app/data/posts.json`.
