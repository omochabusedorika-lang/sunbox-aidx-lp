/* ===== Scroll Fade-in (Intersection Observer) ===== */
document.addEventListener('DOMContentLoaded', () => {
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger animation for sibling cards
            const parent = entry.target.parentElement;
            const siblings = parent ? Array.from(parent.querySelectorAll('.fade-in')) : [];
            const siblingIndex = siblings.indexOf(entry.target);
            const delay = siblingIndex >= 0 ? siblingIndex * 100 : 0;

            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all immediately
    fadeEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ===== FAQ Accordion ===== */
  const faqButtons = document.querySelectorAll('.faq-item__q');

  faqButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');

      // Close all others
      document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ===== Number Count-up ===== */
  const numEls = document.querySelectorAll('.num[data-target]');

  if (numEls.length && 'IntersectionObserver' in window) {
    const numObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10);
            animateNumber(el, 0, target, 1200);
            numObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    numEls.forEach((el) => numObserver.observe(el));
  }

  function animateNumber(el, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* ===== Hackathon photo slideshow ===== */
  const slides = document.querySelectorAll('.hackathon-slide');
  const dots = document.querySelectorAll('.hackathon-dot');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('hackathon-slide--active');
      dots[current].classList.remove('hackathon-dot--active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('hackathon-slide--active');
      dots[current].classList.add('hackathon-dot--active');
    }, 3500);
  }

  /* ===== Smooth scroll for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
