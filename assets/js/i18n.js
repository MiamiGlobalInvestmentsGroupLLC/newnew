(function () {
  function applyBilingual(lang) {
    const active = lang === 'ar' ? 'ar' : 'en';
    localStorage.setItem('siteLang', active);
    document.documentElement.lang = active;
    document.documentElement.dir = active === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('ar', active === 'ar');

    document.querySelectorAll('[data-en][data-ar]').forEach((el) => {
      el.textContent = active === 'ar' ? el.dataset.ar : el.dataset.en;
    });
    document.querySelectorAll('[data-en-html][data-ar-html]').forEach((el) => {
      el.innerHTML = active === 'ar' ? el.dataset.arHtml : el.dataset.enHtml;
    });
    document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', active === 'ar' ? el.dataset.arPlaceholder : el.dataset.enPlaceholder);
    });

    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === active);
    });

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: active } }));
  }

  window.SiteI18n = {
    getLang() {
      return localStorage.getItem('siteLang') === 'ar' ? 'ar' : 'en';
    },
    setLanguage: applyBilingual,
    t(key) {
      const lang = this.getLang();
      const node = document.querySelector(`[data-key="${key}"]`);
      if (!node) return '';
      return lang === 'ar' ? node.dataset.ar || '' : node.dataset.en || '';
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const initial = window.SiteI18n.getLang();
    applyBilingual(initial);
    document.querySelectorAll('.lang-toggle button').forEach((btn) => {
      btn.addEventListener('click', () => applyBilingual(btn.dataset.lang));
    });
  });
})();
