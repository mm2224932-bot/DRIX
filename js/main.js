/* Main interactions for the DRIX website */
const body = document.body;
const backToTop = document.querySelector('.back-to-top');
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const siteHeader = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-list a');

const handleScroll = () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add('show');
  } else {
    backToTop?.classList.remove('show');
  }

  siteHeader?.classList.toggle('scrolled', window.scrollY > 20);
};

const setupMenu = () => {
  menuToggle?.addEventListener('click', () => {
    const isOpen = navbar?.classList.toggle('open');
    if (isOpen) {
      menuToggle?.setAttribute('aria-expanded', 'true');
    } else {
      menuToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navbar?.classList.contains('open')) {
        navbar.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
};

const setupBackToTop = () => {
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

const revealOnScroll = () => {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(
    (entries, observerRef) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          observerRef.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((element) => observer.observe(element));
};

const initPage = () => {
  setupMenu();
  setupBackToTop();
  revealOnScroll();
  window.addEventListener('scroll', handleScroll);
};

window.addEventListener('DOMContentLoaded', initPage);
