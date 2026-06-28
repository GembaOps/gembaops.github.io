# GembaOps — Website

Conversion-focused marketing site for **GembaOps** — automation (rule-based workflows + AI) for manufacturers and distributors.
Static HTML/CSS/JS, **no build step**, deployed to **GitHub Pages** with a custom domain via Cloudflare DNS (same pattern as the LIDM site).

**Live:** https://gembaops.com · **Tagline:** *Automation, built on the floor.*

---

## Quick start (local preview)

No toolchain required. From this folder:

```bash
# Python (already on the machine)
python -m http.server 3200
# then open http://localhost:3200
```

Or use the Claude Code preview config: server name **`gembaops-site`** is registered in `D:\Cerberus\.claude\launch.json` (Python http.server on port 3200).

> Use real `.html` URLs locally (e.g. `/pricing.html`). On GitHub Pages the same links work, and `404.html` serves unknown paths.

---

## File structure

```
website/
├── index.html                  Home
├── solutions.html              Solutions — by role & by outcome
├── ai-workflows.html           AI Workflows
├── clean-logic-workflows.html  Clean Logic Workflows (Power Automate / BI / 365)
├── how-it-works.html           Process + tech stack + FAQ
├── pricing.html                Engagement models + 4× rule + ROI calculator
├── case-studies.html           Gated "coming soon" + format template
├── resources.html              Lead magnet + roadmap
├── about.html                  Frank's story + gemba principle
├── contact.html                Booking + contact form
├── styleguide.html             Living component library (design-system reference)
├── privacy.html                GDPR/CCPA privacy notice
├── 404.html                    Branded not-found
├── CNAME                       gembaops.com (GitHub Pages custom domain)
├── robots.txt  sitemap.xml
├── assets/
│   ├── css/styles.css          Design tokens + every component
│   ├── js/app.js               Header/footer, nav, modal, carousel, accordion, consent, forms
│   ├── js/roi-calculator.js    ROI calculator
│   ├── fonts/                  Self-hosted Space Grotesk + Inter (woff2)
│   └── img/                    Logo SVGs, favicon, OG image, icons
├── README.md
├── copy-deck.md                All page copy (Joe-Filter voice)
├── implementation-guide.md     HubSpot setup + GitHub Pages deploy steps
└── qa-checklist.md             Accessibility / performance / SEO checks
```

`_backup/index.original.html` is the previous single-page site, kept for reference.

---

## Configure integrations (one place)

Open **`assets/js/app.js`** and fill the `CONFIG` block at the top:

| Key | What | Where to get it |
|---|---|---|
| `hubspotPortalId` | Enables consent-gated HubSpot tracking | HubSpot → Settings → Account |
| `hubspotMeetingsUrl` | Booking calendar inside the demo modal | HubSpot → Meetings → share link |
| `cloudflareToken` | Cookieless traffic analytics | Cloudflare → Web Analytics |
| `calendlyFallback` | Booking fallback if HubSpot not set | Already set to the current Calendly link |

Until HubSpot is set, the booking modal falls back to Calendly and the contact form composes an email to `frank@gembaops.com` — nothing breaks. Full walkthrough in **`implementation-guide.md`**.

---

## Deploy (GitHub Pages, like LIDM)

Short version (full steps + DNS in `implementation-guide.md`):

1. Create a GitHub repo for GembaOps and push the contents of this `website/` folder to `main`.
2. Repo → **Settings → Pages** → deploy from `main` → set custom domain `gembaops.com` (the `CNAME` file is already here).
3. In **Cloudflare DNS**, point the apex at GitHub Pages (4× A records `185.199.108–111.153`) + `CNAME www → <repo>.github.io`, **DNS-only**. Leave email (MX/SPF/DKIM) untouched.
4. Enable **Enforce HTTPS** once the cert issues. (If it stalls, remove + re-add the custom domain in Pages settings.)

---

## Editing content

- **Copy:** edit the page `.html` directly (or update `copy-deck.md` first, then the page).
- **Nav / header / footer:** edit the `NAV` array and the `buildHeader`/`buildFooter` templates in `assets/js/app.js` — one source for all pages.
- **Styles:** all tokens and components are in `assets/css/styles.css`. Change a brand color once in `:root`.
- **Regenerate PNG brand assets:** see `implementation-guide.md` (Pillow script).

## Brand
Navy `#0f1b2d` · Amber `#f5a623` · Space Grotesk (headings) · Inter (body) · "Pin + Rise" mark. Voice: plain, floor-credible, outcome-first — no corporate jargon.
