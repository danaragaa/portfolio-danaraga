This is a portfolio website built with [Next.js](https://nextjs.org).

## Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contact Form Email Setup (Resend)

The contact form uses `POST /api/contact` and sends email via Resend API.

Create a `.env.local` file in the project root:

```bash
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=your-inbox@example.com
CONTACT_FROM_EMAIL=Portfolio Contact <onboarding@resend.dev>
SITE_URL=https://yourdomain.com

# Optional but recommended in production
UPSTASH_REDIS_REST_URL=https://***.upstash.io
UPSTASH_REDIS_REST_TOKEN=***
```

Notes:
- For production, use a verified domain in Resend for `CONTACT_FROM_EMAIL`.
- `CONTACT_TO_EMAIL` is the inbox destination where contact messages are sent.
- If env variables are missing, API will return a configuration error.
- `SITE_URL` digunakan untuk validasi origin request di endpoint contact agar lebih aman dari cross-site abuse.
- Untuk deployment multi-instance, isi `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` agar rate-limit dan dedupe konsisten lintas instance.
- Jika variabel Upstash tidak diisi, sistem akan fallback ke memory (aman untuk lokal/dev, kurang ideal untuk production scaling).

## Analytics Setup (Optional)

Event tracking is already implemented in UI components via `lib/analytics.ts`.

Enable one or both providers via `.env.local`:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
# Optional (if self-hosted or proxy)
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC=https://plausible.io/js/script.js
```

Notes:
- If no analytics env is set, no analytics script is loaded.
- Restart `npm run dev` after updating env variables.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Framer Motion
- Tailwind CSS

## Deploy on Vercel

Deploy on Vercel or your preferred hosting provider. Ensure all environment variables above are configured in your deployment settings.

### Vercel Mandatory Checklist

Before clicking **Deploy**, complete this checklist:

1. Import repository to Vercel and keep framework preset as **Next.js**.
2. In **Project Settings → Environment Variables**, set these variables for **Production** (and **Preview** if needed):
	- `RESEND_API_KEY`
	- `CONTACT_TO_EMAIL`
	- `CONTACT_FROM_EMAIL`
	- `SITE_URL` (exact domain, e.g. `https://yourdomain.com`)
	- `UPSTASH_REDIS_REST_URL`
	- `UPSTASH_REDIS_REST_TOKEN`
3. Verify `CONTACT_FROM_EMAIL` uses a verified Resend domain for production.
4. Add your custom domain in Vercel, then ensure `SITE_URL` matches it exactly.
5. Trigger deployment and run smoke test:
	- Open `/projects/[slug]` pages to verify images/rendering.
	- Submit contact form and confirm email delivery.
	- Re-submit quickly to confirm cooldown/rate-limit response.

Optional analytics variables:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC`

### Predeploy Command (Recommended)

Run this command before deploying:

```bash
npm run predeploy
```

This command will:
- Check required env values (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`)
- Warn if recommended env values are missing (`SITE_URL`, Upstash Redis)
- Run lint
- Run production build
