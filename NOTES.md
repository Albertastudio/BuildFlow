# BuildFlow — NOTES (handoff log)

**Update this file** after each work session (newest at top). AI: read `README.md` + this file before editing.

---

## Status (2026-05-24)

| Item | State |
|------|--------|
| GitHub `main` | Synced — https://github.com/Albertastudio/BuildFlow |
| GitHub Pages | Live — https://albertastudio.github.io/BuildFlow/ |
| Shared CSS | `styles.css` on index, services, pricing, about, contact |
| Blocker | None |

---

## Session log (newest first)

### 2026-05-24 — Site polish, docs, push to GitHub

**Problems fixed**

- Footer & CTA on Home/Services/Pricing looked broken — `styles.css` was missing `.cta-section`, `footer`, `.cta-btns`, `.hero-sub`, `.hero-btns` (only existed as inline CSS on About/Contact before).
- Services page 01–05 showed large **emoji** instead of photos — no `.svc-vis-*` styles in shared CSS.
- About & Contact used **purple** inline theme, inconsistent with rest of site.

**Changes made**

1. **`styles.css`**
   - Added shared CTA + footer + hero button row styles.
   - Added Services visuals (`.svc-vis-frame`, `.svc-big-feats`, `.svc-feat`, etc.).
   - Added About-specific blocks (story, timeline, city card, approach, support, numbers).
   - Added Contact-specific blocks (form, FAQ accordion, map, expect grid).
   - Home carousel: `.svc-img img` with gradient overlay.
   - Mobile tweaks for footer, service cards, contact form.
   - `--error` token for form validation.
   - `.logo > span:not(.logo-sub)` — gradient only on “Flow”, not subtitle.

2. **Images** — `images/services/`
   - `01-website.jpg` … `05-google-local.jpg` (Unsplash).
   - `06-call-tracking.jpg`, `07-sms-followup.jpg` — **temporary copies** of 02 and 04 (Unsplash download failed); replace with unique photos when possible.

3. **`index.html`** — carousel emojis → `<img src="images/services/...">`.

4. **`services.html`** — emoji blocks → `<figure class="svc-vis-frame"><img …>`.

5. **`about.html`**, **`contact.html`** — removed ~200-line inline `<style>`; link only `styles.css` + `favicon.svg`.

6. **`favicon.svg`** — BF monogram; linked on all main HTML pages.

7. **Git**
   - Init repo in `Albertastudio1`, `.gitignore` (node_modules, audit-screenshots).
   - Merged with existing GitHub `main` (kept our file versions on conflict).
   - Commits: `c3418e2` (main work), `d8bdaf8` (merge).

8. **`audit-site.mjs`** — Playwright audit all 6 pages (dev dependency, not pushed as required runtime).

**Verified**

- Playwright audit: all pages OK, 5 service images on Services, nav flow OK.
- Live Pages URL serves updated home content after push.

---

## Open / optional next steps

| Priority | Task |
|----------|------|
| Low | Replace `06-call-tracking.jpg` / `07-sms-followup.jpg` with dedicated Unsplash (or brand) assets |
| Low | Migrate **`login.html`** inline CSS → `styles.css` (large file; portal-specific) |
| Medium | **Contact form** — wire to Formspree, EmailJS, or Cloud Function (currently client-only `submitForm()`) |
| Medium | Custom domain (e.g. buildflow.ca) → DNS to GitHub Pages |
| Low | Add `package.json` for audit script only, or document `npx playwright` one-liner |
| Low | GitHub Pages custom 404 page |

---

## File touch map (quick reference)

```
index.html      — home carousel uses images/services/*
services.html   — svc-big 01–05 + images
styles.css      — ALL shared layout/theme + page-specific sections
about.html      — story, team, values (no inline CSS)
contact.html    — form + FAQ (no inline CSS)
login.html      — STILL has own <style> block
favicon.svg
audit-site.mjs  — local QA only
```

---

## Commands cheat sheet

```bash
# Local preview
python -m http.server 8765

# Audit (from repo root, after npm install playwright)
node audit-site.mjs

# Ship to live
git add -A && git status
git commit -m "Describe change"
git push origin main
# Wait ~1–2 min → https://albertastudio.github.io/BuildFlow/
```

---

## Do not confuse with

| Project | Repo / Firebase | What it is |
|---------|-----------------|------------|
| **This site** | `Albertastudio/BuildFlow` | Marketing static site |
| Production ERP | `precastforge` / `structural-precast` | Claresholm ERP |
| Demo ERP | `precastforge-client` | Multi-tenant trial |
| Alberta landing | `albertastudio-website` | Separate marketing + chatbot |

Parent memory: `Antigravity/CLAUDE.md`, `Notes.md` (PrecastForge ops — not BuildFlow HTML).
