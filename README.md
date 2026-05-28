# Majestic Pine Renovations

Premium, SEO-focused construction and remodeling website for Minneapolis, Buffalo, and the Twin Cities metro. Built with Next.js App Router, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Vercel-ready** deployment (standalone Docker output included)

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Local Development

```bash
cd majestic-pine-renovations
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production site URL (canonical, OG, sitemap) |
| `CRM_PROVIDER` | `hubspot` or `buildertrend` |
| `HUBSPOT_API_KEY` | HubSpot API key (server-only) |
| `DISPATCH_WEBHOOK_URL` | Internal dispatch webhook |
| `LEAD_NOTIFICATION_EMAIL` | Email for new lead alerts |
| `SMS_PROVIDER` | SMS confirmation provider |

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/about-us` | About Jeremy Stoesz & company |
| `/commercial-contracting-minnesota` | Commercial services |
| `/services` | Services overview |
| `/services/[slug]` | Individual service pages (9 subpages) |
| `/financing` | Financing options |
| `/contact` | Contact form & info |

## Lead Capture API

`POST /api/lead` accepts multipart form data with:

- First & last name, property address, phone, email
- SMS opt-in checkbox
- Project category (Residential / Commercial / Exterior)
- Budget range
- Optional file uploads (max 5 files, 10MB each)

Server-side validation and swap-friendly integration hooks for HubSpot, Buildertrend, SMS, and email notifications live in `src/lib/integrations/lead-handler.ts`.

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set environment variables from `.env.example`
4. Deploy

```bash
npx vercel
```

For production:

```bash
npx vercel --prod
```

## Docker Deployment

```bash
docker build -t majestic-pine-renovations .
docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com majestic-pine-renovations
```

## Adding Service Pages

Service data lives in `src/lib/services.ts`. To add a new service:

1. Add an entry to the `SERVICES` array with slug, content, and SEO fields
2. The dynamic route at `/services/[slug]` renders automatically
3. Rebuild to regenerate static params

## SEO

- Unique metadata per page via `buildMetadata()` in `src/lib/metadata.ts`
- JSON-LD schema: LocalBusiness, ConstructionCompany, Service, FAQPage, Review, ContactPage
- Auto-generated `sitemap.xml` and `robots.txt`

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## License

Private — Majestic Pine Renovations.
