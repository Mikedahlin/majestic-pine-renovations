<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single product: a Next.js 16 (App Router, Turbopack) marketing site for "Majestic Pine Renovations". Core dynamic features are the lead form (`POST /api/lead`) and the chat assistant (`POST /api/contact-chat`); everything else is static/SSG pages. Standard commands are in `README.md` / `package.json` (`npm run dev`, `lint`, `build`); the dev server listens on port 3000.

Non-obvious notes:
- No secrets are required to run or test. All external integrations degrade gracefully: a lead with no provider configured (HubSpot/Resend/dispatch webhook) is written to `data/leads/*.json` (gitignored), and the chat falls back to a local keyword reply when no AI key (`GEMINI_API_KEY`/`GROQ_API_KEY`/`OPENAI_API_KEY`) is set. Copy `.env.example` to `.env.local` only if you want to exercise real providers.
- The real build is `next build` (`npm run build`); there is no webpack config. (A leftover `.github/workflows/webpack.yml` starter-template workflow that ran `npx webpack` was removed; there is currently no CI build workflow.)
- The `preview`/`deploy`/`upload` scripts use OpenNext + Cloudflare Workers (`wrangler`) and are for deployment only — use `npm run dev` for local development, not these.
