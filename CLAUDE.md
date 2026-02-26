text
# CLAUDE.md – Prospectus Flipbook at prospectus.orl-inc.com



\## Goal



Create a static, flipbook‑style viewer for a PDF named `Prospectus(74).pdf`, served at `https://prospectus.orl-inc.com/` using Cloudflare Pages.



Project root on disk:



```text

G:\\Shared drives\\WEB\\orl-inc.com\\cloudflare\\

This directory will be the root of the Pages project and Git repo.



Plan

Build a pure static HTML/JS/CSS flipbook viewer that loads Prospectus(74).pdf in the browser (no backend).



Keep everything in this one directory so the Pages project can serve it directly.



Point the subdomain prospectus.orl-inc.com at this Pages project so visiting that URL shows the flipbook.



Local Directory Layout

Target structure:



text

G:\\Shared drives\\WEB\\orl-inc.com\\cloudflare\\

&nbsp; index.html          # flipbook viewer entry point

&nbsp; Prospectus(74).pdf  # the PDF catalog/prospectus

&nbsp; js/

&nbsp;   pdf.js            # PDF renderer (or loaded from CDN)

&nbsp;   flipbook.js       # page-flip library or wrapper

&nbsp;   init.js           # wiring between PDF.js and flipbook UI

&nbsp; css/

&nbsp;   viewer.css        # layout and styles

&nbsp; CLAUDE.md           # this file

Notes:



index.html is the main viewer page so that / (and thus https://prospectus.orl-inc.com/) loads the flipbook.



init.js will reference Prospectus(74).pdf; if parentheses cause issues, rename to something like Prospectus-74.pdf and update the code.



Flipbook Implementation Strategy

Components:



PDF renderer

Use PDF.js (or similar) to render PDF pages into <canvas> or images in the browser.



Page‑flip UI

Use a flipbook library or demo that accepts rendered pages, for example a “pdf-html5-page-flip” style approach:



index.html loads the JS and CSS.



init.js loads the PDF and feeds each page to the flipbook component.



Optionally support a ?file= query parameter so the viewer can be reused for other PDFs later.



Initial goal: a single viewer wired to Prospectus(74).pdf, with:



Page‑flip animation (click/drag).



Full‑width layout on desktop, acceptable on tablet.



Basic next/previous navigation and page indicator.



Cloudflare Pages and DNS

Pages project



Put this directory under Git and push to a repo (for example orl-inc-prospectus).



Create a Cloudflare Pages project pointed at that repo.



Use this directory as the project root so index.html is served at /.



Custom domain



In the Pages project, add the custom domain prospectus.orl-inc.com.



Let Cloudflare create or instruct you to create the appropriate DNS record (typically a CNAME pointing prospectus to the Pages hostname).



Result:



Visiting https://prospectus.orl-inc.com/ loads index.html (flipbook viewer).



The viewer loads Prospectus(74).pdf from the same origin as a static asset.



No Worker is required for the initial implementation; this can be entirely static.



How I Want Help From the Assistant Later

From this directory, I’ll ask the assistant to:



Scaffold index.html, viewer.css, and init.js wired to Prospectus(74).pdf.



Suggest safe handling or renaming of the PDF file if the parentheses cause problems.



Provide concise Git and Cloudflare Pages setup snippets as needed.



Help refine layout, navigation, and responsiveness once the base flipbook works.

