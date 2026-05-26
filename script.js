(() => {
  const root = document.documentElement;
  const STORAGE_KEY = 'ak-portfolio-theme';
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-choice]'));
  const mql = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------- Theme ---------- */
  const applyTheme = (choice) => {
    root.setAttribute('data-theme', choice);
    if (choice === 'system') {
      root.setAttribute('data-system', mql.matches ? 'dark' : 'light');
    } else {
      root.removeAttribute('data-system');
    }
    themeButtons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.themeChoice === choice));
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const isDark = choice === 'dark' || (choice === 'system' && mql.matches);
      meta.setAttribute('content', isDark ? '#0a0e1a' : '#f6f7fb');
    }
  };

  const stored = (() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  })();
  applyTheme(stored || 'system');

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.themeChoice;
      try { localStorage.setItem(STORAGE_KEY, choice); } catch { /* ignore */ }
      applyTheme(choice);
    });
  });

  mql.addEventListener?.('change', () => {
    const current = root.getAttribute('data-theme') || 'system';
    if (current === 'system') applyTheme('system');
  });

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    const closeMenu = () => {
      mobileNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Scroll spy ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((a) => {
              a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = Array.from(document.querySelectorAll('.section, .hero-inner, .card'));
  revealEls.forEach((el) => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
})();
