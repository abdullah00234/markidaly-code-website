# Markidly

Marketing site for Markidly — an Amazon account management and growth
agency. Built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in the values before testing
the growth-audit form — without `RESEND_API_KEY` and `GROWTH_AUDIT_TO_EMAIL`
set, that route returns a 500 rather than silently dropping a submission.

## Scripts

| Script          | Purpose                                      |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Start the development server                  |
| `npm run build`  | Production build                               |
| `npm run start`  | Serve the production build                     |
| `npm run lint`   | ESLint                                         |
| `npm run test`   | Run the test suite (Vitest)                    |

## Project structure

- `src/app` — routes, layout, metadata, and the `/api/growth-audit` route handler
- `src/components` — page sections and UI primitives
- `public` — static assets

## Deployment

Deployed on Netlify. `netlify.toml` configures a rate limit on
`/api/growth-audit` to bound Resend email-sending cost from the public
growth-audit form; see the comment in that file and in
`src/app/api/growth-audit/route.ts` for the full picture of how that route
is hardened.
