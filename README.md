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

## Deploy (LIVE — GitHub Pages)

**This folder IS the git repo.** It's already deployed and live at **https://gembaops.com** (HTTPS enforced).

- **Repo:** `https://github.com/GembaOps/gembaops.github.io` (remote `origin` is set; account: `LongIslandDungeonMaster` owns the `GembaOps` org).
- **To deploy a change:** edit files here → `git push origin main`. GitHub Pages auto-rebuilds in ~1 min. That's it — no build step.
- DNS lives on Cloudflare (apex + `www` CNAME → `gembaops.github.io`, DNS-only; email untouched). One-time infra steps + the cert-stall fix are documented in `implementation-guide.md`.
- Windows/PowerShell note: `git push` prints progress to stderr so the tool shows a red `NativeCommandError` even on success — trust the `<old>..<new> main -> main` line. Avoid double-quotes in commit messages (breaks arg parsing).

---

## Editing content

- **Copy:** edit the page `.html` directly (or update `copy-deck.md` first, then the page).
- **Nav / header / footer:** edit the `NAV` array and the `buildHeader`/`buildFooter` templates in `assets/js/app.js` — one source for all pages.
- **Styles:** all tokens and components are in `assets/css/styles.css`. Change a brand color once in `:root`.
- **Regenerate PNG brand assets:** see `implementation-guide.md` (Pillow script).

## Brand
Navy `#0f1b2d` · Amber `#f5a623` · Space Grotesk (headings) · Inter (body) · "Pin + Rise" mark. Voice: plain, floor-credible, outcome-first — no corporate jargon.
