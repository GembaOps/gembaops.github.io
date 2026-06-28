/* =================================================================
   GembaOps — app.js
   Shared header/footer, nav, demo modal (HubSpot Meetings),
   contact-form handling, testimonial carousel, FAQ accordion,
   cookie-consent gating, scroll reveal. Vanilla JS, no deps.
   ================================================================= */
(function () {
  "use strict";

  /* ---------- CONFIG: fill these once HubSpot is set up ----------
     See implementation-guide.md. Placeholders are safe to ship —
     the booking modal shows an email/Calendly fallback until set. */
  var CONFIG = {
    hubspotPortalId: "",                 // e.g. "44441234"
    hubspotRegion: "na1",                // na1 / eu1
    hubspotMeetingsUrl: "",              // e.g. "https://meetings.hubspot.com/frank/ops-audit"
    calendlyFallback: "https://calendly.com/frankpapaleo76/free-operations-audit",
    contactEmail: "frank@gembaops.com",
    cloudflareToken: ""                  // Cloudflare Web Analytics beacon token (cookieless)
  };
  window.GEMBA_CONFIG = CONFIG;

  var MARK = '<svg class="mark" viewBox="0 0 100 132" aria-hidden="true" focusable="false">' +
    '<path d="M50 130 C 27 98 16 86 16 52 A 34 34 0 1 1 84 52 C 84 86 73 98 50 130 Z" fill="#f5a623"/>' +
    '<line x1="31" y1="64" x2="69" y2="64" stroke="#0f1b2d" stroke-width="3" stroke-linecap="round"/>' +
    '<rect x="35" y="56" width="8" height="8" rx="1.5" fill="#0f1b2d"/>' +
    '<rect x="46" y="48" width="8" height="16" rx="1.5" fill="#0f1b2d"/>' +
    '<rect x="57" y="38" width="8" height="26" rx="1.5" fill="#0f1b2d"/></svg>';

  var NAV = [
    { label: "Solutions", href: "/solutions.html", children: [
      { label: "Solutions overview", href: "/solutions.html", desc: "By role and by outcome" },
      { label: "AI Workflows", href: "/ai-workflows.html", desc: "Automation powered by AI" },
      { label: "Clean Logic Workflows", href: "/clean-logic-workflows.html", desc: "Rule-based, Power Automate, BI" }
    ]},
    { label: "How it works", href: "/how-it-works.html" },
    { label: "Pricing", href: "/pricing.html" },
    { label: "Resources", href: "/resources.html", children: [
      { label: "Guides & resources", href: "/resources.html", desc: "Playbooks and downloads" },
      { label: "Case studies", href: "/case-studies.html", desc: "Before / after results" }
    ]},
    { label: "About", href: "/about.html" }
  ];

  /* ---------- helpers ---------- */
  function el(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; }
  function currentPath() {
    var p = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "");
    return p === "" ? "/" : p;
  }
  function isActive(href) {
    var c = currentPath(), h = href.replace(/index\.html$/, "").replace(/\/$/, "");
    if (h === "" ) h = "/";
    return c === h;
  }

  /* ---------- HEADER ---------- */
  function buildHeader() {
    var links = NAV.map(function (item) {
      var active = isActive(item.href) || (item.children && item.children.some(function (c) { return isActive(c.href); }));
      if (item.children) {
        var sub = item.children.map(function (c) {
          return '<a href="' + c.href + '"' + (isActive(c.href) ? ' aria-current="page"' : '') + '>' + c.label +
                 '<small>' + c.desc + '</small></a>';
        }).join("");
        return '<div class="has-dropdown">' +
          '<a href="' + item.href + '"' + (active ? ' aria-current="page"' : '') + ' aria-haspopup="true">' + item.label + ' ▾</a>' +
          '<div class="dropdown">' + sub + '</div></div>';
      }
      return '<a href="' + item.href + '"' + (active ? ' aria-current="page"' : '') + '>' + item.label + '</a>';
    }).join("");

    return el(
      '<header class="site">' +
        '<div class="wrap nav">' +
          '<a class="brand" href="/" aria-label="GembaOps home">' + MARK +
            '<span class="wordmark">Gemba<span class="ops">Ops</span></span></a>' +
          '<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="primary-nav">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
          '</button>' +
          '<nav class="nav-links" id="primary-nav" aria-label="Primary">' + links +
            '<a class="btn" href="#" data-open-modal>Book a demo</a>' +
          '</nav>' +
        '</div>' +
      '</header>'
    );
  }

  /* ---------- FOOTER ---------- */
  function buildFooter() {
    var year = new Date().getFullYear();
    return el(
      '<footer class="site">' +
        '<div class="wrap">' +
          '<div class="footer-grid">' +
            '<div>' +
              '<a class="brand" href="/" aria-label="GembaOps home">' + MARK +
                '<span class="wordmark">Gemba<span class="ops">Ops</span></span></a>' +
              '<p class="foot-tagline">Automation, built on the floor. Rule-based workflows and AI for manufacturers and distributors — designed by someone who’s run one.</p>' +
              '<div class="foot-social">' +
                '<a href="https://www.linkedin.com/company/gembaops" aria-label="LinkedIn" rel="noopener" target="_blank"><svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.96 1.83-1.97 3.77-1.97 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z"/></svg></a>' +
                '<a href="mailto:' + CONFIG.contactEmail + '" aria-label="Email"><svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7 8-5H4zM4 8v10h16V8l-8 5z"/></svg></a>' +
              '</div>' +
            '</div>' +
            '<div><h5>Solutions</h5>' +
              '<a href="/solutions.html">Overview</a><br><a href="/ai-workflows.html">AI Workflows</a><br>' +
              '<a href="/clean-logic-workflows.html">Clean Logic Workflows</a><br><a href="/how-it-works.html">How it works</a></div>' +
            '<div><h5>Company</h5>' +
              '<a href="/about.html">About</a><br><a href="/pricing.html">Pricing</a><br>' +
              '<a href="/case-studies.html">Case studies</a><br><a href="/resources.html">Resources</a></div>' +
            '<div><h5>Get started</h5>' +
              '<a href="#" data-open-modal>Book a free audit</a><br><a href="/contact.html">Contact</a><br>' +
              '<a href="mailto:' + CONFIG.contactEmail + '">' + CONFIG.contactEmail + '</a></div>' +
          '</div>' +
          '<div class="foot-bottom">' +
            '<span>© ' + year + ' GembaOps · Long Island, NY</span>' +
            '<span><a href="/privacy.html">Privacy</a> · Automation, built on the floor.</span>' +
          '</div>' +
        '</div>' +
      '</footer>'
    );
  }

  /* ---------- MODAL (demo booking) ---------- */
  var lastFocus = null;
  function buildModal() {
    var embed = CONFIG.hubspotMeetingsUrl
      ? '<div class="meetings-iframe-container" data-src="' + CONFIG.hubspotMeetingsUrl + '?embed=true"></div>'
      : '<div class="meetings-fallback"><p class="muted">Pick a time that works for you:</p>' +
        '<a class="btn btn-lg" href="' + CONFIG.calendlyFallback + '" target="_blank" rel="noopener">Open the booking calendar →</a></div>';

    var m = el(
      '<div class="modal" id="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title" hidden>' +
        '<div class="modal-backdrop" data-close-modal></div>' +
        '<div class="modal-box">' +
          '<button class="modal-close" data-close-modal aria-label="Close dialog">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
          '<span class="eyebrow">Free 20-minute ops audit</span>' +
          '<h2 id="demo-modal-title">Find your three biggest time-wasters.</h2>' +
          '<p class="muted">No pitch, no obligation. We’ll walk through where your team is losing hours and what’s worth automating first.</p>' +
          embed +
          '<p class="form-note mt-2">Prefer email? <a href="mailto:' + CONFIG.contactEmail + '">' + CONFIG.contactEmail + '</a></p>' +
        '</div>' +
      '</div>'
    );
    return m;
  }

  var meetingsLoaded = false;
  function loadMeetingsScript() {
    if (meetingsLoaded || !CONFIG.hubspotMeetingsUrl) return;
    meetingsLoaded = true;
    var s = document.createElement("script");
    s.src = "https://static.hsappstatic.net/MeetingsEmbedCode/static-1/meetings-embed-code.js";
    s.async = true;
    document.body.appendChild(s);
  }

  function openModal() {
    var modal = document.getElementById("demo-modal");
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    loadMeetingsScript();
    var focusable = modal.querySelector("a,button,input");
    if (focusable) focusable.focus();
    document.addEventListener("keydown", onModalKey);
  }
  function closeModal() {
    var modal = document.getElementById("demo-modal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKey);
    if (lastFocus) lastFocus.focus();
  }
  function onModalKey(e) {
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") {
      var modal = document.getElementById("demo-modal");
      var f = modal.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* ---------- NAV TOGGLE ---------- */
  function wireNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("primary-nav");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a") && !e.target.closest("a").hasAttribute("data-open-modal")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- GLOBAL CLICK (modal triggers) ---------- */
  function wireGlobalClicks() {
    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-open-modal]");
      if (opener) { e.preventDefault(); openModal(); return; }
      if (e.target.closest("[data-close-modal]")) { e.preventDefault(); closeModal(); }
    });
  }

  /* ---------- ACCORDION ---------- */
  function wireAccordions() {
    document.querySelectorAll(".acc-trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        btn.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (panel) panel.style.maxHeight = expanded ? null : panel.scrollHeight + "px";
      });
    });
  }

  /* ---------- CAROUSEL ---------- */
  function wireCarousels() {
    document.querySelectorAll(".carousel").forEach(function (car) {
      var track = car.querySelector(".carousel-track");
      var slides = car.querySelectorAll(".slide");
      var nav = car.querySelector(".carousel-nav");
      if (!track || slides.length < 2 || !nav) return;
      var idx = 0;
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        if (i === 0) dot.setAttribute("aria-current", "true");
        dot.addEventListener("click", function () { go(i); });
        nav.appendChild(dot);
      });
      function go(i) {
        idx = (i + slides.length) % slides.length;
        track.style.transform = "translateX(-" + (idx * 100) + "%)";
        nav.querySelectorAll(".carousel-dot").forEach(function (d, di) {
          if (di === idx) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        });
      }
      track.style.transition = "transform .4s ease";
      slides.forEach(function (s) { s.style.transition = ""; });
      car.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") go(idx + 1);
        if (e.key === "ArrowLeft") go(idx - 1);
      });
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  function wireReveal() {
    var nodes = document.querySelectorAll("[data-animate]");
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---------- CONSENT + ANALYTICS ----------
     Cloudflare Web Analytics is cookieless -> loads always.
     HubSpot tracking (sets cookies) -> only after consent. */
  function loadCloudflareAnalytics() {
    if (!CONFIG.cloudflareToken) return;
    var s = document.createElement("script");
    s.defer = true;
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", '{"token":"' + CONFIG.cloudflareToken + '"}');
    document.body.appendChild(s);
  }
  function loadHubspotTracking() {
    if (!CONFIG.hubspotPortalId || document.getElementById("hs-script-loader")) return;
    var s = document.createElement("script");
    s.id = "hs-script-loader";
    s.async = true; s.defer = true;
    s.src = "https://js.hs-scripts.com/" + CONFIG.hubspotPortalId + ".js";
    document.body.appendChild(s);
  }
  function wireConsent() {
    loadCloudflareAnalytics();
    var decision = localStorage.getItem("gemba-consent");
    if (decision === "accepted") { loadHubspotTracking(); return; }
    if (decision === "declined") return;
    var banner = el(
      '<div class="consent" role="region" aria-label="Cookie consent">' +
        '<p>We use cookieless analytics by default. May we also enable marketing cookies (HubSpot) to improve our outreach? See our <a href="/privacy.html">privacy notice</a>.</p>' +
        '<div class="consent-actions">' +
          '<button class="btn" data-consent="accept">Accept</button>' +
          '<button class="btn btn-decline" data-consent="decline">Decline</button>' +
        '</div>' +
      '</div>'
    );
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add("show"); });
    banner.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]"); if (!b) return;
      if (b.getAttribute("data-consent") === "accept") { localStorage.setItem("gemba-consent", "accepted"); loadHubspotTracking(); }
      else { localStorage.setItem("gemba-consent", "declined"); }
      banner.remove();
    });
  }

  /* ---------- CONTACT FORM (graceful, no-backend fallback) ----------
     If a HubSpot form is configured it is embedded by the page.
     This handles the plain progressive-enhancement form: honeypot +
     validation + mailto fallback so the form never silently fails. */
  function wireContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector(".hp input") && form.querySelector(".hp input").value) return; // bot
      var ok = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var valid = input.checkValidity() && input.value.trim() !== "";
        if (field) field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) { var bad = form.querySelector(".field.invalid input,.field.invalid textarea"); if (bad) bad.focus(); return; }
      // No backend configured yet -> compose a mailto so the lead is never lost.
      var data = {};
      ["name", "email", "company", "role", "message"].forEach(function (k) {
        var f = form.querySelector('[name="' + k + '"]'); if (f) data[k] = f.value;
      });
      var subject = encodeURIComponent("Ops audit / automation inquiry — " + (data.company || data.name || ""));
      var body = encodeURIComponent(
        "Name: " + (data.name || "") + "\nEmail: " + (data.email || "") + "\nCompany: " + (data.company || "") +
        "\nRole: " + (data.role || "") + "\n\n" + (data.message || ""));
      form.style.display = "none";
      var ok2 = document.getElementById("contact-success");
      if (ok2) ok2.style.display = "block";
      window.location.href = "mailto:" + CONFIG.contactEmail + "?subject=" + subject + "&body=" + body;
    });
  }

  /* ---------- BOOT ---------- */
  function boot() {
    var headerSlot = document.getElementById("site-header");
    var footerSlot = document.getElementById("site-footer");
    if (headerSlot) headerSlot.replaceWith(buildHeader());
    if (footerSlot) footerSlot.replaceWith(buildFooter());
    document.body.appendChild(buildModal());
    wireNav();
    wireGlobalClicks();
    wireAccordions();
    wireCarousels();
    wireReveal();
    wireContactForm();
    wireConsent();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
