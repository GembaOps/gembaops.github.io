# GembaOps — Implementation & Deployment Guide

Everything needed to wire up integrations and ship the site. No build tools required.

---

## 1. HubSpot (free CRM) setup

GembaOps captures leads in HubSpot's free tier via **embedded forms** and the **Meetings scheduler** (which creates the calendar event *and* the CRM contact in one step — satisfying the "booking creates a calendar event and captures lead data" requirement).

### 1a. Create the account & get your Portal ID
1. Sign up free at hubspot.com (use `frank@gembaops.com`).
2. Settings (gear) → **Account Setup → Account Defaults** → note the **Hub ID / Portal ID** (a number).
3. Put it in `assets/js/app.js` → `CONFIG.hubspotPortalId`. Set `hubspotRegion` to `na1` (default) unless your account is EU (`eu1`).

> The Portal ID only enables the **consent-gated** HubSpot tracking script. It loads *after* a visitor clicks "Accept" on the consent banner. Forms and Meetings work without it.

### 1b. Connect your calendar & create the Meetings link
1. HubSpot → **CRM → Meetings** (or **Library → Meetings scheduler**).
2. Connect your Google Calendar (this is what auto-creates calendar events).
3. Create a meeting type: **"Free 20-minute ops audit"**, 20 min, your availability.
4. Copy the share link (e.g. `https://meetings.hubspot.com/frank/ops-audit`).
5. Paste it into `assets/js/app.js` → `CONFIG.hubspotMeetingsUrl`.

Once set, the **demo modal** (the "Book a demo" buttons everywhere) renders the HubSpot scheduler inline, and the **contact page** booking panel does too. Until then, both fall back to the existing Calendly link.

> **Contact-page inline scheduler:** the `#meetings-inline` block on `contact.html` currently shows the Calendly fallback. To embed HubSpot Meetings there too, replace the inner `.meetings-fallback` div with:
> `<div class="meetings-iframe-container" data-src="YOUR_MEETINGS_URL?embed=true"></div>`
> and add the script `https://static.hsappstatic.net/MeetingsEmbedCode/static-1/meetings-embed-code.js` before `</body>` (the modal already loads it on open).

### 1c. (Optional) Replace the progressive contact form with a HubSpot form
The contact and resources pages ship with a **progressive-enhancement form** that validates, blocks bots (honeypot), and composes an email to `frank@gembaops.com` so no lead is ever lost. To route submissions straight into the CRM instead:

1. HubSpot → **Marketing → Forms → Create form** (fields: name, email, company, role, message). Publish and note the **Form GUID**.
2. On `contact.html`, replace the `<form id="contact-form">…</form>` with the HubSpot embed:
   ```html
   <div id="hubspot-form"></div>
   <script src="https://js.hsforms.net/forms/embed/v2.js"></script>
   <script>
     hbspt.forms.create({ portalId: "YOUR_PORTAL_ID", formId: "YOUR_FORM_GUID", region: "na1", target: "#hubspot-form" });
   </script>
   ```
3. Repeat on `resources.html` for the guide form if you want those captured in the CRM (or keep the email-based capture).

> **Spam:** HubSpot forms include built-in protection; enable reCAPTCHA in the form options for more. The progressive form keeps a honeypot field regardless.

---

## 2. Analytics & consent

- **Cloudflare Web Analytics (cookieless, default):** Cloudflare dashboard → **Web Analytics → Add a site** → copy the beacon **token** → `CONFIG.cloudflareToken`. No consent banner needed for this; it sets no cookies and doesn't track across sites.
- **Consent banner:** appears bottom-center on first visit. "Accept" loads the HubSpot tracking script (cookies); "Decline" keeps the site fully functional with cookieless analytics only. Choice is remembered in `localStorage` (`gemba-consent`).
- **No other third-party trackers** are present. Do not add GA/ads pixels without extending the consent flow.

---

## 3. Deploy to GitHub Pages (mirrors the LIDM site)

> The GembaOps domain currently sits on **Cloudflare** (registrar + email routing + the old Cloudflare Pages site). We keep DNS + email on Cloudflare and move *hosting* to GitHub Pages.

### 3a. Repo
1. Decide the GitHub account/org for GembaOps (a dedicated account/org keeps it cleanly separate from LIDM; or use the existing `LongIslandDungeonMaster` account with a `gembaops` repo). **Log into the right account first.**
2. Create a repo (e.g. `gembaops`). Push the contents of this `website/` folder to `main` (the `CNAME` file is already included).

### 3b. Enable Pages
- Repo → **Settings → Pages** → Source: **Deploy from a branch** → `main` / root.
- Custom domain: `gembaops.com` (uses the `CNAME` file). Save.

### 3c. Point Cloudflare DNS at GitHub Pages
In Cloudflare (account `e048aeeef6b5e3df87a8a2523e2c1026`), DNS for `gembaops.com`:
- **Remove** the record pointing at the old Cloudflare Pages site.
- Add four **A** records on `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
- Add **CNAME** `www → <repo-or-user>.github.io`.
- Set these to **DNS only (grey cloud)** so GitHub can issue the Let's Encrypt cert.
- **Do NOT touch** the MX, SPF (`v=spf1 …`), DKIM, or DMARC records — email routing for `frank@gembaops.com` stays exactly as-is.

### 3d. HTTPS
- After DNS propagates, back in **Settings → Pages**, check **Enforce HTTPS**.
- If the cert stalls (GitHub serves a `*.github.io` cert for a while): **remove the custom domain, save, re-add it, save** — this forces a fresh cert. Then enable Enforce HTTPS.

### 3e. Clean up
- Once `https://gembaops.com` serves from GitHub Pages, delete the old **Cloudflare Pages** `gembaops` project.

### 3f. Future deploys
- Just `git push` to `main`. GitHub Pages rebuilds automatically. (No build step — it serves the files as-is.)

---

## 4. Phase-2 content

### Un-hide proof components (when real)
The testimonial carousel and partner/logo strip are built and documented in `styleguide.html` but kept **off live pages** until real material exists (your decision). To go live with a real one:
- **Testimonials:** copy the `.carousel` block from `styleguide.html` into the home credibility section, replace sample quotes with the real quote + metric + attribution.
- **Case study:** on `case-studies.html`, replace the "Illustrative format" article with the real Problem → Approach → Result, remove the "illustrative" labels, and add `Review`/`CreativeWork` JSON-LD if desired.
- **Logos:** drop real client logo SVG/PNGs into `assets/img/` and swap the `.logo-ph` placeholders for `<img>`.

### Lead-magnet PDF
`resources.html` promises *"The 5 Workflows Every Ops Team Should Automate First."* Create the PDF, place it at `assets/downloads/5-workflows.pdf`, and either (a) email it on form submit, or (b) change the form's success state to link the download.

---

## 5. Regenerate PNG brand assets

The `og-default.png`, `apple-touch-icon.png`, `favicon-32.png`, and `icon-512.png` were generated from the "Pin + Rise" mark with Pillow (no SVG renderer on the machine). To regenerate after a brand tweak, re-run the script in the scratchpad (`gen_assets.py`) or recreate it from the source SVGs in `assets/img/` (`mark.svg`, `og-default.svg`). The favicon itself is `favicon.svg` (crisp at any size in modern browsers); the PNGs are fallbacks + the social share image.

---

## 6. Acceptance criteria — where each is met
- **Hero value + CTA:** `index.html` hero + global "Book a demo" modal.
- **Booking creates calendar event + captures lead:** HubSpot Meetings (§1b).
- **ROI / 4× tool:** `assets/js/roi-calculator.js` on home + pricing.
- **AI vs Clean Logic pages:** `ai-workflows.html`, `clean-logic-workflows.html`.
- **Lighthouse ≥ 90 / WCAG AA:** see `qa-checklist.md`.
- **Case studies:** components built; gated until real per your decision (§4).
