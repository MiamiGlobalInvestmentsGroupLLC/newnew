(function () {
  const deadline = new Date('2026-04-01T00:00:00-04:00').getTime();

  function pad(v) {
    return String(v).padStart(2, '0');
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = deadline - now;
    const lang = (window.getCurrentLanguage && window.getCurrentLanguage()) || 'en';
    const t = window.I18N[lang] || window.I18N.en;
    const expired = diff <= 0;

    document.querySelectorAll('[data-price-current]').forEach((el) => {
      el.textContent = expired ? '$350 USD' : '$125 USD';
    });

    document.querySelectorAll('[data-promo-note]').forEach((el) => {
      el.textContent = expired ? t.promo_note_ended : t.promo_note_active;
    });

    document.querySelectorAll('[data-offer-ended]').forEach((el) => {
      el.style.display = expired ? 'block' : 'none';
      el.textContent = t.offer_ended;
    });

    if (expired) {
      document.querySelectorAll('[data-countdown]').forEach((box) => {
        box.style.display = 'none';
      });
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    document.querySelectorAll('[data-countdown]').forEach((box) => {
      box.style.display = 'inline-flex';
      box.querySelector('[data-d]').textContent = pad(days);
      box.querySelector('[data-h]').textContent = pad(hours);
      box.querySelector('[data-m]').textContent = pad(minutes);
      box.querySelector('[data-s]').textContent = pad(seconds);
      box.querySelector('[data-lbl-days]').textContent = t.days;
      box.querySelector('[data-lbl-hours]').textContent = t.hours;
      box.querySelector('[data-lbl-minutes]').textContent = t.minutes;
      box.querySelector('[data-lbl-seconds]').textContent = t.seconds;
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
  document.addEventListener('languageChanged', updateCountdown);
})();
