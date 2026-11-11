// Scroll-triggered 3D hero banner with a sliding activity ticker.
// Place <div id="tabIntro" data-intro-image="..." data-intro-eyebrow="..."
//   data-intro-title="..." data-intro-font="..." data-intro-activity="a|b|c">
// further down the page (below the fold) — it builds its markup immediately
// but only plays its spring-bounce entrance once scrolled into view.

(function () {
  const introEl = document.getElementById('tabIntro');
  if (!introEl) return;

  const image = introEl.dataset.introImage;
  const eyebrow = introEl.dataset.introEyebrow || 'Welcome to';
  const title = introEl.dataset.introTitle || '';
  const font = introEl.dataset.introFont || 'var(--font-body)';
  const activityRaw = introEl.dataset.introActivity || '';
  const messages = activityRaw.split('|').map(s => s.trim()).filter(Boolean);

  introEl.classList.add('tab-hero');
  introEl.innerHTML = `
    <div class="tab-hero-image"><img src="${image}" alt=""></div>
    ${messages.length ? '<div class="activity-ticker" id="tabTicker"></div>' : ''}
    <div class="tab-hero-content">
      <p class="tab-hero-eyebrow">${eyebrow}</p>
      <h1 class="tab-hero-title">${title}</h1>
    </div>
  `;

  if (messages.length) {
    const ticker = document.getElementById('tabTicker');
    ticker.style.fontFamily = font;
    let idx = 0;
    ticker.textContent = messages[idx];

    ticker.addEventListener('animationiteration', () => {
      idx = (idx + 1) % messages.length;
      ticker.textContent = messages[idx];
    });
  }

  // Fire the spring-bounce entrance once, the moment the banner scrolls
  // into view — not on page load, so it never fights the sticky header.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        introEl.classList.add('in-view');
        observer.unobserve(introEl);
      }
    });
  }, { threshold: 0.35 });

  observer.observe(introEl);
})();
