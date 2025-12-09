(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      const panel = item.nextElementSibling;
      if (!panel) return;

      item.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        panel.hidden = true;
        item.querySelector('.faq-icon')?.classList.remove('open');
      } else {
        panel.hidden = false;
        item.querySelector('.faq-icon')?.classList.add('open');
      }
    });
  });
})();
