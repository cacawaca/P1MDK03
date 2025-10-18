# Deployment instructions (Netlify & Vercel)

## Netlify (automated via GitHub Actions)

1. Create a site in Netlify (pick 'Deploy an existing project' -> GitHub).
2. Add repository to Netlify (or you can let GitHub Actions deploy via Netlify CLI).
3. To enable GitHub Actions auto-deploy step, add the following secrets to your GitHub repository:
   - `NETLIFY_AUTH_TOKEN` — your Netlify personal access token
   - `NETLIFY_SITE_ID` — the target site ID (found in Site Settings → General → Site details)

4. After adding secrets, GitHub Actions workflow `.github/workflows/ci.yml` will run `deploy-netlify` job and deploy the `dist/` folder to Netlify.

## Vercel

1. Install Vercel CLI or connect via GitHub import.
2. If using Vercel UI, simply import the repository and set build command to `npm run build` and output directory to `dist`.
3. For environment variables (CMS keys), add them in Vercel Dashboard → Settings → Environment Variables.

## Running locally (test preview + pa11y)

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Preview: `npm run preview -- --port 5173`
4. Run pa11y locally: `npx pa11y http://localhost:5173`

Notes:
- The GitHub Actions workflow will run pa11y to create basic accessibility reports and optionally deploy to Netlify if secrets are configured.
- For deeper automated accessibility testing consider adding axe-core with Playwright in CI.
