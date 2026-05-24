# BuildFlow — Marketing Site

**BuildFlow** is a static marketing website for **Alberta Studio**. It presents revenue/automation services for **Canadian home-services contractors** (roofing, HVAC, plumbing, electrical, landscaping, renovation).

> **Not the same as Production ERP.** This repo is HTML/CSS only. The sellable ERP (PrecastForge, Claresholm) lives in other repos — see parent `Antigravity/CLAUDE.md`.

---

## Goals

| Goal | How this site supports it |
|------|---------------------------|
| Generate leads | CTAs → Contact / strategy call |
| Explain the offer | Services, pricing teaser, ROI section |
| Build trust | About, process, comparison table |
| Demo the brand | Consistent BuildFlow visual system |

**Product story:** one connected system — website, CRM, call tracking, AI voice, SMS automation — so contractors stop losing leads.

---

## Live & repo

| | URL / path |
|-|------------|
| **GitHub** | https://github.com/Albertastudio/BuildFlow |
| **Live (GitHub Pages)** | https://albertastudio.github.io/BuildFlow/ |
| **Local preview** | `python -m http.server 8765` → http://localhost:8765/index.html |
| **Local folder** | `Albertastudio1` (Cursor workspace) |

**Deploy:** push to `main` → GitHub Pages updates (no build step).

---

## Stack

- Plain **HTML5** pages
- Single shared **`styles.css`** (design tokens in `:root`, blue/green theme)
- **`favicon.svg`**
- Photos in **`images/services/`** (Unsplash, committed to repo)
- **No** bundler, framework, or backend
- **`login.html`** — client-portal **UI mock** only (large inline `<style>` still; not unified with `styles.css`)

---

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, stats, dashboard mock, service carousel, process, benefits, ROI, integrations, CTA |
| `services.html` | Core services 01–05 (text + photo cards), add-ons, process, comparison, pricing teaser |
| `pricing.html` | Plans, AI add-ons, web packages, hosting, FAQ |
| `about.html` | Story, team, values, approach, support |
| `contact.html` | Contact form (client-side validation only), FAQ, map placeholder |
| `login.html` | Portal login + dashboard demo (inline CSS) |

Shared chrome: fixed nav, ticker (on most pages), footer (logo | copyright | links).

---

## Key conventions (for edits)

1. **New global styles** → `styles.css`, not inline `<style>` (except `login.html` until migrated).
2. **Eyebrow classes:** `sec-eyebrow` or `sec-ey` (both styled in CSS).
3. **Service imagery:** `images/services/NN-name.jpg` — used on Services big cards and Home carousel `.svc-img img`.
4. **Reveal animations:** `.reveal` + JS `IntersectionObserver` adds `.in` on scroll (per-page `<script>` at bottom).
5. **Do not commit** `node_modules/`, `audit-screenshots/` (see `.gitignore`).

---

## Dev tools (optional)

| File | Use |
|------|-----|
| `audit-site.mjs` | Playwright smoke test all pages + nav (`node audit-site.mjs`, needs `playwright` in `node_modules`) |

---

## Brand / contact (as on site)

- **Legal line:** © 2025 Alberta Studio. BuildFlow is a division of Alberta Studio. Calgary, Alberta.
- **Email on contact page:** hello@buildflow.ca
- **Phone on contact page:** 587-327-8440

---

## Handoff for AI agents

1. Read **`NOTES.md`** first for recent changes and open tasks.
2. Do **not** confuse with `precastforge` / `structural-precast` ERP repos.
3. Prefer **minimal diffs** — one CSS file drives most pages.
4. After visual changes, spot-check **footer + CTA** and **Services 01–05** images.

**Active log:** [`NOTES.md`](NOTES.md)
