const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== NAVBAR: scroll effect + auto-hide ===== */
const navbar = document.getElementById('navbar');
let lastY = window.scrollY;

/* ===== SCROLL PROGRESS ===== */
const progress = document.querySelector('.scroll-progress span');

let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;

  requestAnimationFrame(() => {
    const y = window.scrollY;

    navbar.classList.toggle('scrolled', y > 40);

    // Nasconde la navbar scorrendo in basso, la riporta scorrendo in alto
    const hide = y > lastY && y > 260 && !mobileMenu.classList.contains('open');
    navbar.classList.toggle('nav-hidden', hide);
    lastY = y;

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }

    scrollQueued = false;
  });
});

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

// Indice per la cascata delle voci
mobileMenu.querySelectorAll('li').forEach((li, i) => {
  li.style.setProperty('--i', i);
});

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) navbar.classList.remove('nav-hidden');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== SCROLL REVEAL ===== */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Ogni gruppo ha la sua direzione di entrata
const revealGroups = [
  { sel: '.badge, #hero h1, .hero-desc, .hero-cta, .hero-chips', variant: 'reveal-blur' },
  { sel: '.section-title',   variant: '' },
  { sel: '.about-text',      variant: 'reveal-left' },
  { sel: '.stat-card',       variant: 'reveal-right' },
  { sel: '.skill-card',      variant: 'reveal-scale' },
  { sel: '.tl-item',         variant: 'reveal-left' },
  { sel: '.portfolio-card',  variant: 'reveal-scale' },
  { sel: '.cert-card',       variant: 'reveal-scale' },
  { sel: '.contact-card',    variant: '' }
];

revealGroups.forEach(({ sel, variant }) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (variant) el.classList.add(variant);
    el.style.setProperty('--d', `${(i % 6) * 70}ms`);
    observer.observe(el);
  });
});

/* ===== TIMELINE: linea che si disegna ===== */
const lineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('drawn');
      lineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline').forEach(t => lineObserver.observe(t));

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

/* ===== STAT: conteggio progressivo ===== */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statObserver.unobserve(entry.target);

    const el = entry.target;
    const match = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!match) return; // valori non numerici (es. "B2") restano come sono

    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1100;
    const start = performance.now();

    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}, { threshold: 0.6 });

if (!reduced) {
  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));
}

/* ===== CARD: alone che segue il puntatore ===== */
if (!reduced && window.matchMedia('(pointer: fine)').matches) {
  const spotlight = '.skill-card, .portfolio-card, .cert-card, .contact-card:not(.no-link)';

  document.querySelectorAll(spotlight).forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}
