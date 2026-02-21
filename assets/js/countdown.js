(function () {
  const deadline = new Date('2026-04-01T00:00:00-04:00').getTime();

  function getLabels(lang) {
    return lang === 'ar'
      ? { days: 'يوم', hours: 'ساعة', minutes: 'دقيقة', seconds: 'ثانية', ended: 'انتهى العرض' }
      : { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', ended: 'Offer Ended' };
  }

  function paintCountdown(el, diff, labels) {
    if (diff <= 0) {
      el.innerHTML = `<span class="offer-ended">${labels.ended}</span>`;
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    el.innerHTML = `
      <div class="time-box"><strong>${days}</strong><span>${labels.days}</span></div>
      <div class="time-box"><strong>${hours}</strong><span>${labels.hours}</span></div>
      <div class="time-box"><strong>${minutes}</strong><span>${labels.minutes}</span></div>
      <div class="time-box"><strong>${seconds}</strong><span>${labels.seconds}</span></div>
    `;
  }

  function updatePrices(isExpired, lang) {
    const label = lang === 'ar' ? 'السعر الأساسي' : 'Regular price';
    document.querySelectorAll('[data-price-block]').forEach((block) => {
      const current = block.querySelector('[data-price-current]');
      const original = block.querySelector('[data-price-original]');
      const ended = block.querySelector('[data-offer-ended]');
      if (!current || !original || !ended) return;
      if (isExpired) {
        current.textContent = '$350';
        original.textContent = '';
        ended.textContent = lang === 'ar' ? 'انتهى العرض' : 'Offer Ended';
        ended.hidden = false;
      } else {
        current.textContent = '$125';
        original.textContent = `${label}: $350`;
        ended.hidden = true;
      }
    });
  }

  function tick() {
    const now = Date.now();
    const diff = deadline - now;
    const lang = window.SiteI18n ? window.SiteI18n.getLang() : 'en';
    const labels = getLabels(lang);
    document.querySelectorAll('[data-countdown]').forEach((el) => paintCountdown(el, diff, labels));
    updatePrices(diff <= 0, lang);
  }

  document.addEventListener('DOMContentLoaded', () => {
    tick();
    setInterval(tick, 1000);
  });

  document.addEventListener('languageChanged', tick);
})();
