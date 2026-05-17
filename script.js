/* ===== NAVBAR: scroll effect ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
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
}, { threshold: 0.1 });

const revealSelectors = [
  '.skill-card', '.tl-item', '.cert-card',
  '.contact-card', '.stat-card', '.about-text',
  '.badge', '#hero h1', '.hero-desc', '.hero-cta', '.hero-chips'
];

document.querySelectorAll(revealSelectors.join(', ')).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 60}ms`;
  observer.observe(el);
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.style.color = active ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));
