// Flip-digit odometer counter. Each digit is a vertical strip 0-9 that
// scrolls to its final value — like an airport departure board / old
// mechanical odometer. Whole count finishes in under 5 seconds.

function buildOdometer(el, target) {
  const digits = String(target).split('');
  el.innerHTML = '';

  digits.forEach((digit, i) => {
    if (digit === ',') {
      const comma = document.createElement('span');
      comma.className = 'odometer-comma';
      comma.textContent = ',';
      el.appendChild(comma);
      return;
    }

    const digitVal = parseInt(digit, 10);
    const wrap = document.createElement('span');
    wrap.className = 'odometer-digit';

    const strip = document.createElement('span');
    strip.className = 'odometer-strip';
    // Strip contains 0-9 stacked; we animate translateY to land on digitVal.
    for (let n = 0; n <= 9; n++) {
      const s = document.createElement('span');
      s.className = 'odometer-num';
      s.textContent = n;
      strip.appendChild(s);
    }
    wrap.appendChild(strip);
    el.appendChild(wrap);

    // Stagger each digit slightly so it reads left-to-right like a real
    // odometer settling, finishing well within 5 seconds total.
    const delay = i * 120;
    const duration = 1200 + i * 150;

    setTimeout(() => {
      strip.style.transition = `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      strip.style.transform = `translateY(-${digitVal * 10}%)`;
    }, delay + 30);
  });
}

function formatWithCommas(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Trigger once each counter scrolls into view.
const odometerEls = document.querySelectorAll('.odometer');
if (odometerEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        buildOdometer(el, formatWithCommas(target));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  odometerEls.forEach(el => observer.observe(el));
}