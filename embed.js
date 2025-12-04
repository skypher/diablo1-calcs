(() => {
  const script = document.currentScript;
  if (!script) return;

  const dataset = script.dataset || {};
  const params = new URL(script.src, location.href).searchParams;

  const calcPath = dataset.calc || params.get('calc') || dataset.src || 'index.html';
  const title = dataset.title || params.get('title') || 'Diablo I Calculator';
  const width = dataset.width || params.get('width') || '100%';
  const maxWidth = dataset.maxWidth || params.get('maxWidth') || '960px';
  const initialHeight = dataset.height || params.get('height') || '900';

  const base = new URL(script.src);
  const iframeSrc = new URL(calcPath, base).toString();

  const iframe = document.createElement('iframe');
  iframe.src = iframeSrc;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.style.border = '0';
  iframe.style.width = width;
  iframe.style.maxWidth = maxWidth;
  iframe.style.display = 'block';
  iframe.style.height = `${initialHeight}px`;
  iframe.width = width;
  iframe.height = initialHeight;
  iframe.setAttribute('allowfullscreen', 'false');
  iframe.className = 'diablo1-calc-frame';

  // Insert iframe before the script tag for predictable placement.
  script.parentNode.insertBefore(iframe, script);

  // Single global listener to handle height messages from calculators.
  if (!window.__d1CalcEmbedListener) {
    window.__d1CalcEmbedListener = true;
    window.addEventListener('message', event => {
      const data = event.data;
      if (!data || data.type !== 'd1-calc-height') return;
      const height = Number(data.height);
      if (!Number.isFinite(height) || height <= 0) return;

      const target = Array.from(document.querySelectorAll('iframe'))
        .find(f => f.contentWindow === event.source);

      if (target) {
        target.style.height = `${Math.ceil(height)}px`;
      }
    });
  }
})();
