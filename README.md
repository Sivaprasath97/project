# Auth Dashboard

Login, register and dashboard pages built with plain HTML, CSS and JavaScript.

> Demo only: accounts are stored in the browser's localStorage. A real app needs a backend for authentication.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Checks

```bash
npm install     # first time only
npm run ci      # lint HTML/CSS/JS, run smoke tests, build to dist/
```

## CI/CD

`.github/workflows/ci-cd.yml` runs on GitHub Actions:

| Trigger | What happens |
| --- | --- |
| Pull request to `main` | Lint, test and build (no deploy) |
| Push to `main` | Lint, test, build, then deploy `dist/` to GitHub Pages |
| Manual (Actions tab → Run workflow) | Same as a push to `main` |

If any check fails, the deploy does not run.

**One-time setup:** in the GitHub repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
