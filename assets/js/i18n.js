(function () {
  function applyBilingual(lang) {
    var active = lang === 'ar' ? 'ar' : 'en';
    localStorage.setItem('siteLang', active);
    document.documentElement.lang = active;
    document.documentElement.dir = active === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('ar', active === 'ar');

    document.querySelectorAll('[data-en][data-ar]').forEach(function (el) {
      el.textContent = active === 'ar' ? el.dataset.ar : el.dataset.en;
    });
    document.querySelectorAll('[data-en-html][data-ar-html]').forEach(function (el) {
      el.innerHTML = active === 'ar' ? el.dataset.arHtml : el.dataset.enHtml;
    });
    document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', active === 'ar' ? el.dataset.arPlaceholder : el.dataset.enPlaceholder);
    });

    document.querySelectorAll('.lang-toggle button').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === active);
    });

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: active } }));
  }

  window.SiteI18n = {
    getLang: function () {
      var stored = localStorage.getItem('siteLang');
      if (stored === 'ar' || stored === 'en') return stored;
      return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
    },
    setLanguage: applyBilingual,
    t: function (key) {
      var lang = this.getLang();
      var node = document.querySelector('[data-key="' + key + '"]');
      if (!node) return '';
      return lang === 'ar' ? (node.dataset.ar || '') : (node.dataset.en || '');
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    applyBilingual(window.SiteI18n.getLang());

    /* Event delegation — works for dynamically added buttons, no duplicates */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-toggle button[data-lang]');
      if (btn) applyBilingual(btn.dataset.lang);
    });
  });
})();
