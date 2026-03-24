(function () {
  const langButtons = document.querySelectorAll('[data-lang-switch]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  const yearNode = document.querySelector('[data-year]');

  function applyLanguage(lang) {
    const t = window.I18N[lang] || window.I18N.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    document.body.classList.toggle('rtl', t.dir === 'rtl');

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (t[key]) node.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const key = node.getAttribute('data-i18n-placeholder');
      if (t[key]) node.setAttribute('placeholder', t[key]);
    });

    const whatsapp = document.querySelector('[data-whatsapp-float]');
    if (whatsapp) {
      const message = encodeURIComponent(t.whatsapp_msg);
      whatsapp.href = `https://wa.me/13056290491?text=${message}`;
      whatsapp.setAttribute('aria-label', t.whatsapp_aria);
      whatsapp.title = t.whatsapp_aria;
    }

    langButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.langSwitch === lang);
      btn.setAttribute('aria-pressed', String(btn.dataset.langSwitch === lang));
    });

    localStorage.setItem('mgiLang', lang);
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  window.getCurrentLanguage = function () {
    return localStorage.getItem('mgiLang') || 'en';
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navLinks.classList.remove('show')));
  }

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.langSwitch));
  });

  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  const initial = localStorage.getItem('mgiLang') || 'en';
  applyLanguage(initial);

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lang = window.getCurrentLanguage();
      const t = window.I18N[lang];
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const program = contactForm.querySelector('[name="program"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();
      const subject = encodeURIComponent(`Program Inquiry - ${program || 'General'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProgram: ${program}\n\nMessage:\n${message}`);
      window.location.href = `mailto:info@miamigi.com?subject=${subject}&body=${body}`;
      alert(t.form_success);
      contactForm.reset();
    });
  }
})();
