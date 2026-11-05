(() => {
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.progress span');
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  const updateScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 18);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = open ? '&times;' : '&#9776;';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); document.body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false'); toggle.innerHTML = '&#9776;';
    }));
  }
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('in-view'));
  // Subtle parallax on the home hero.
  const hero = document.querySelector('.hero');
  if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const offset = Math.min(window.scrollY * 0.18, 100);
      hero.style.backgroundPosition = `center ${offset}px`;
    }, { passive: true });
  }

  // Count up the published impact totals when they enter the viewport.
  const counters = document.querySelectorAll('[data-count]');
  const formatCounter = value => Math.round(value).toLocaleString('en-US');
  const animateCounter = el => {
    if (el.dataset.counted === 'true') return;
    el.dataset.counted = 'true';
    const target = Number(el.dataset.count || 0);
    const duration = 1700;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = formatCounter(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatCounter(target);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
    }), { threshold: 0.35 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else counters.forEach(animateCounter);
})();
