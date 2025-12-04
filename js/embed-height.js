(() => {
  // Only run when the page is inside an iframe.
  if (window.top === window.self) return;

  const postHeight = () => {
    const body = document.body;
    const html = document.documentElement;
    if (!body || !html) return;

    const height = Math.max(
      body.scrollHeight,
      html.scrollHeight,
      body.getBoundingClientRect().height,
      html.getBoundingClientRect().height
    );

    if (height) {
      try {
        window.parent.postMessage(
          { type: 'd1-calc-height', height: Math.ceil(height), href: location.href },
          '*'
        );
      } catch (err) {
        // Swallow to avoid console noise in restrictive embeds.
      }
    }
  };

  const schedulePost = (() => {
    let frame;
    return () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(postHeight);
    };
  })();

  // Initial measurements
  schedulePost();
  window.addEventListener('load', schedulePost);
  window.addEventListener('resize', schedulePost);

  // Track content changes
  if ('ResizeObserver' in window && document.body) {
    new ResizeObserver(schedulePost).observe(document.body);
  } else {
    // Fallback: poke every second in older browsers.
    setInterval(schedulePost, 1000);
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(schedulePost).catch(() => {});
  }
})();
