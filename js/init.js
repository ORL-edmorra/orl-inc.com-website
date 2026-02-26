(async () => {
  'use strict';

  const PDF_URL = 'Prospectus-74.pdf';
  const SCALE   = 1.5;

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const loadingEl     = document.getElementById('loading');
  const loadingText   = document.getElementById('loading-text');
  const progressFill  = document.getElementById('progress-fill');
  const viewerWrap    = document.getElementById('viewer-wrap');
  const flipbookEl    = document.getElementById('flipbook');
  const btnPrev       = document.getElementById('btn-prev');
  const btnNext       = document.getElementById('btn-next');
  const pageIndicator = document.getElementById('page-indicator');

  try {
    const pdf      = await pdfjsLib.getDocument(PDF_URL).promise;
    const numPages = pdf.numPages;

    // Derive page dimensions from the first page
    const firstPage = await pdf.getPage(1);
    const vp0 = firstPage.getViewport({ scale: SCALE });
    const W   = Math.floor(vp0.width);
    const H   = Math.floor(vp0.height);

    // Render every page into a .page div containing a <canvas>
    for (let i = 1; i <= numPages; i++) {
      const page   = await pdf.getPage(i);
      const vp     = page.getViewport({ scale: SCALE });
      const canvas = document.createElement('canvas');
      canvas.width  = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);

      await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;

      const div = document.createElement('div');
      div.className = 'page';
      div.appendChild(canvas);
      flipbookEl.appendChild(div);

      const pct = Math.round((i / numPages) * 100);
      progressFill.style.width = pct + '%';
      loadingText.textContent  = `Loading prospectus… ${i} / ${numPages}`;
    }

    // Initialise StPageFlip
    const book = new St.PageFlip(flipbookEl, {
      width:               W,
      height:              H,
      size:                'stretch',
      minWidth:            315,
      maxWidth:            W * 2,
      minHeight:           420,
      maxHeight:           H * 2,
      drawShadow:          true,
      flippingTime:        700,
      usePortrait:         true,
      autoSize:            true,
      maxShadowOpacity:    0.5,
      showCover:           true,
      mobileScrollSupport: false,
    });

    book.loadFromHTML(document.querySelectorAll('.page'));

    // Swap loading → viewer
    loadingEl.hidden  = true;
    viewerWrap.hidden = false;

    // Jump to ?page=N on load (1-based, clamped to valid range)
    const startPage = Math.min(
      Math.max(parseInt(new URLSearchParams(location.search).get('page')) || 1, 1),
      numPages
    );
    if (startPage > 1) book.turnToPage(startPage - 1);

    function updateIndicator() {
      const cur = book.getCurrentPageIndex() + 1;
      pageIndicator.textContent = `Page ${cur} / ${numPages}`;
      history.replaceState(null, '', `?page=${cur}`);
    }

    book.on('flip', updateIndicator);
    updateIndicator();

    btnPrev.addEventListener('click', () => { book.flipPrev(); });
    btnNext.addEventListener('click', () => { book.flipNext(); });

  } catch (err) {
    loadingText.textContent = `Error: ${err.message}`;
    console.error(err);
  }
})();
