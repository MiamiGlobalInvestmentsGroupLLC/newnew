(function () {
  function bindProgramInteractions() {
    document.querySelectorAll('[data-learn-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.program-card');
        const panel = card.querySelector('.learn-more');
        const isOpen = panel.classList.toggle('open');
        const lang = (window.getCurrentLanguage && window.getCurrentLanguage()) || 'en';
        const t = window.I18N[lang] || window.I18N.en;
        btn.textContent = isOpen ? t.learn_less : t.learn_more;
      });
    });
  }

  function refreshLearnMoreLabels() {
    const lang = (window.getCurrentLanguage && window.getCurrentLanguage()) || 'en';
    const t = window.I18N[lang] || window.I18N.en;
    document.querySelectorAll('.program-card').forEach((card) => {
      const panel = card.querySelector('.learn-more');
      const btn = card.querySelector('[data-learn-toggle]');
      if (!btn || !panel) return;
      btn.textContent = panel.classList.contains('open') ? t.learn_less : t.learn_more;
    });
  }

  bindProgramInteractions();
  refreshLearnMoreLabels();
  document.addEventListener('languageChanged', refreshLearnMoreLabels);
})();
