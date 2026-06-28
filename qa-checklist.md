# GembaOps — QA Checklist (Accessibility · Performance · SEO)

Run before each deploy. Status legend: ✅ done/verified · ⬜ to verify by Frank · ⚠️ note.

---

## Accessibility (target: WCAG 2.1 AA)
- ✅ Semantic landmarks on every page (`header`, `nav`, `main#main`, `footer`) + skip-to-content link.
- ✅ One `<h1>` per page; logical heading order.
- ✅ Keyboard operable: nav, dropdowns (`focus-within`), accordion, carousel (arrow keys), modal (focus trap + Esc), ROI calculator.
- ✅ Visible focus styles (`:focus-visible`, 3px amber ring) on all interactive elements.
- ✅ Demo modal: `role="dialog"`, `aria-modal`, labelled, focus returns to opener on close.
- ✅ Forms: `<label>` for every field, required marked, inline errors, honeypot hidden from AT (`aria-hidden`).
- ✅ Color contrast AA: body ink `#1a2233` on white; muted `#5b6678` on white; white/`#c4cedd` on navy; dark text on amber buttons. (Amber used for large text/UI accents, not small body text on white.)
- ✅ `prefers-reduced-motion` disables scroll-reveal + transitions.
- ✅ All decorative SVG icons `aria-hidden`/`focusable=false`; logo has `aria-label`.
- ✅ Site works without JS (`<noscript>` nav fallback; page content is static HTML; forms degrade to mailto).
- ⬜ Screen-reader pass (NVDA/VoiceOver) on home + contact before launch.

## Performance (target: Lighthouse ≥ 90)
- ✅ No framework, no bundler — one CSS file (~22 KB) + two small JS files, all `defer`.
- ✅ Fonts self-hosted woff2 (Space Grotesk + Inter), `font-display:swap`, preloaded — no Google Fonts round-trip.
- ✅ Brand graphics are inline SVG / small assets; OG PNG only loaded by crawlers, not on-page.
- ✅ No layout-shift fonts (swap) ; header height reserved by CSS.
- ✅ Third-party scripts (HubSpot) load lazily — Meetings on modal open, tracking only after consent.
- ⚠️ GitHub Pages serves gzip; CSS/JS are unminified for maintainability (small enough to pass). Optional: minify for a few extra points.
- ⬜ Run Lighthouse in Chrome DevTools (mobile + desktop) on `/`, `/pricing.html`, `/ai-workflows.html`; confirm Performance & Accessibility ≥ 90.

## SEO
- ✅ Unique `<title>` + meta description per page; canonical on every page.
- ✅ Open Graph + Twitter card tags + real PNG share image (`og-default.png`, 1200×630).
- ✅ JSON-LD: Organization, ProfessionalService, WebSite (home); Service (AI / Clean Logic); FAQPage (how-it-works); BreadcrumbList (all sub-pages); AboutPage / ContactPage.
- ✅ `sitemap.xml` (public pages) + `robots.txt` (disallows `/styleguide.html`, points to sitemap).
- ✅ `styleguide.html` + `404.html` set `noindex`.
- ✅ Descriptive link text; breadcrumbs on sub-pages.
- ⬜ After deploy: validate JSON-LD in Google Rich Results Test; submit sitemap in Search Console.

## Functional
- ✅ Header/footer inject on every page; active nav state set by path.
- ✅ ROI calculator math verified (salary ÷ 2,000; 4× line; payback; first-year multiple).
- ✅ Demo modal opens from every "Book a demo"/CTA, closes on Esc/backdrop/X, traps focus.
- ✅ Accordion + carousel operate via mouse and keyboard.
- ✅ Contact + guide forms validate, block honeypot bots, and fall back to mailto when no backend.
- ⬜ After HubSpot wiring: submit a real form → lead appears in CRM; book a meeting → Google Calendar event + CRM contact created.
- ⬜ Test on real iOS Safari + Android Chrome.

## Cross-page
- ✅ Consistent header/footer/modal/consent across all 13 pages.
- ✅ All internal links resolve (root-relative `.html`).
- ✅ Responsive: 3 breakpoints (mobile/tablet/desktop) — grids collapse, nav becomes drawer.

---

## Verification results (this build)
Recorded from local preview (`python -m http.server` on :3200, preview MCP):
- **All 13 pages return HTTP 200** with unique titles, an `<h1>`, header/footer slots, `app.js`, canonical (404 intentionally none), and the expected JSON-LD counts. **0 console errors** on every page tested.
- Header/footer/modal **inject correctly** on home, pricing, how-it-works, styleguide (shared `app.js` proven across pages); active nav state set by path (e.g. Pricing highlighted on `/pricing.html`).
- **ROI calculator** (home + pricing): 2 people × 8 hrs/wk × 52 = **832 hrs/yr**, $60K ÷ 2,000 = **$30/hr**, **$24,960/yr**, 4× line **$6,240**, at $8K build = **3.1× / 3.8-mo payback** — all correct.
- **Demo modal:** opens from CTA, locks body scroll, moves focus inside, Calendly fallback present, **Esc closes** and returns focus.
- **Accordion:** false → true (panel 74px = scrollHeight) → false. Correct + ARIA wired.
- **Carousel:** 2 dots auto-generated, dot-2 → `translateX(-100%)`.
- **Mobile (375px):** hamburger visible, nav hidden until toggled (then `aria-expanded=true`), hero collapses to one column.
- **Contrast (measured):** muted body `#5b6678` on white ≈ **5.8:1** (AA pass, 17px); hero eyebrow amber `#f5a623` on navy ≈ **8.5:1** (pass).
- **Fonts:** Space Grotesk (headings) + Inter (body) confirmed via computed `font-family`; self-hosted woff2, no Google Fonts request.
- ⬜ **Lighthouse not run here** (no Node/Chrome CLI on machine). Engineered to pass ≥ 90 — run in Chrome DevTools post-deploy and append scores.
- ⬜ Screen-reader spot-check (NVDA/VoiceOver) recommended before launch.
