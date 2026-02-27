# CLAUDE.md – ORL Equipment Prospectus Flipbook

## What This Is

A static flipbook-style PDF viewer served at **https://prospectus.orl-inc.com/** via Cloudflare Pages.
No build step, no backend — pure static HTML/JS/CSS.

---

## URLs & Services

| Thing | Value |
|---|---|
| Live site | https://prospectus.orl-inc.com/ |
| GitHub repo | https://github.com/ORL-edmorra/orl-inc.com-website |
| CF Pages project | `orl-inc-com-website` (no dots allowed in CF project names) |
| GitHub account | `ORL-edmorra` (dayjob, active) |

---

## File Structure

```
cloudflare/
  index.html            # Viewer entry point + Open Graph meta tags
  Prospectus-74.pdf     # The PDF catalog (renamed from Prospectus(74).pdf)
  prospectus-card.png   # 400×400 social card for LinkedIn / email
  css/
    viewer.css          # Dark theme layout and navigation controls
  js/
    init.js             # PDF.js + StPageFlip wiring; ?page=N deep linking
  .gitignore            # Excludes desktop.ini, OpenSans-Bold.ttf, etc.
  CLAUDE.md             # This file
```

---

## Libraries (CDN — no local JS files needed)

- **PDF.js 3.11.174** — renders PDF pages to `<canvas>`
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`
- **StPageFlip 2.0.7** — flip animation, used as `new St.PageFlip(...)`
  `https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js`

---

## Key Features

- Page-flip animation (click / drag)
- `?page=N` URL parameter — opens directly to page N (1-based, clamped)
- Address bar syncs as you flip — current page is always shareable
- Open Graph + Twitter Card meta tags point to `prospectus-card.png`
- Progress bar while PDF renders on first load

---

## Updating the Prospectus PDF

Replace `Prospectus-74.pdf` with the new version (same filename), then:

```bash
git add Prospectus-74.pdf
git commit -m "Update prospectus"
git push
```

Cloudflare Pages auto-deploys in ~1 minute. No other changes needed.

> **Note:** Git stores each binary version in full (~10 MB per update).
> Fine for occasional updates; consider Git LFS if updates become frequent.

---

## Social Card (`prospectus-card.png`)

400×400 px, cornflower blue gradient (`#80aff5` → `#3d6ec7`), Open Sans Bold.
`OpenSans-Bold.ttf` is excluded from git (build tool only).

To regenerate:

```bash
# Download font if not present
curl -L "https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4n.ttf" \
  -o OpenSans-Bold.ttf

magick \
  -size 400x400 gradient:'#80aff5-#3d6ec7' \
  -font OpenSans-Bold.ttf \
  -pointsize 36 -fill white -gravity Center \
  -annotate +0-26 "ORL Equipment" \
  -annotate +0+26 "Prospectus" \
  -pointsize 20 -fill "#FFFFFFBB" -gravity South \
  -annotate +0+22 "prospectus.orl-inc.com" \
  prospectus-card.png

git add prospectus-card.png
git commit -m "Regenerate social card"
git push
```

---

## Git / GitHub Notes

- Remote uses **HTTPS** (not SSH) to avoid conflict with personal `DrFunn1` SSH key
- `gh auth setup-git` was run to wire the `ORL-edmorra` credential helper
- Two accounts on this machine: `ORL-edmorra` (active/dayjob), `DrFunn1` (personal)

---

## Cloudflare Pages Notes

- Custom domain added via **dashboard**: Workers & Pages → project → Custom Domains
- CF auto-created the CNAME since `orl-inc.com` is on the same CF account
- Auto-deploy on push is active (Git integration connected in dashboard)
- **Do not manually add a CNAME record before adding the domain in the CF dashboard** —
  doing so causes a 522 error; CF must own the process end-to-end

---

## Deep Link Examples

```
https://prospectus.orl-inc.com/          → page 1
https://prospectus.orl-inc.com/?page=12  → page 12
```
