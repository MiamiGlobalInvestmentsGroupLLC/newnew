(function () {
  const STRIPE_CHECKOUT_URL = 'PASTE_YOUR_STRIPE_LINK_HERE';
  const OFFER_DEADLINE = new Date('2026-04-15T23:59:00+03:00').getTime();

  function getLang() {
    return window.SiteI18n ? window.SiteI18n.getLang() : 'en';
  }

  function formatCountdown(ms, lang) {
    if (ms <= 0) {
      return `<span class="offer-ended">${lang === 'ar' ? 'انتهى العرض' : 'Offer Ended'}</span>`;
    }
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const labels = lang === 'ar' ? ['يوم', 'ساعة', 'دقيقة', 'ثانية'] : ['Days', 'Hours', 'Minutes', 'Seconds'];
    return `
      <div class="time-box"><strong>${d}</strong><span>${labels[0]}</span></div>
      <div class="time-box"><strong>${h}</strong><span>${labels[1]}</span></div>
      <div class="time-box"><strong>${m}</strong><span>${labels[2]}</span></div>
      <div class="time-box"><strong>${s}</strong><span>${labels[3]}</span></div>
    `;
  }

  function getAmmanOffsetMs() {
    const now = new Date();
    const ammanNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Amman' }));
    return ammanNow.getTime() - now.getTime();
  }

  function getNextWeeklyDrawTarget() {
    const offset = getAmmanOffsetMs();
    const ammanNow = new Date(Date.now() + offset);
    const target = new Date(ammanNow);
    const day = target.getDay();
    const daysUntilFriday = (5 - day + 7) % 7;
    target.setDate(target.getDate() + daysUntilFriday);
    target.setHours(23, 0, 0, 0);
    if (target.getTime() <= ammanNow.getTime()) target.setDate(target.getDate() + 7);
    return target.getTime() - offset;
  }

  function getNextFridayCourseLocalText(lang) {
    const offset = getAmmanOffsetMs();
    const ammanNow = new Date(Date.now() + offset);
    const target = new Date(ammanNow);
    const day = target.getDay();
    const daysUntilFriday = (5 - day + 7) % 7;
    target.setDate(target.getDate() + daysUntilFriday);
    target.setHours(21, 30, 0, 0);
    const localTime = new Date(target.getTime() - offset);
    const fmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
    return lang === 'ar' ? `توقيتك: ${fmt.format(localTime)} (تلقائي)` : `Your Time: ${fmt.format(localTime)} (auto)`;
  }

  function applyStripeLinks() {
    document.querySelectorAll('a[href="PASTE_YOUR_STRIPE_LINK_HERE"]').forEach((a) => {
      a.href = STRIPE_CHECKOUT_URL;
    });
  }

  function tick() {
    const lang = getLang();
    const now = Date.now();
    const offerDiff = OFFER_DEADLINE - now;
    const drawDiff = getNextWeeklyDrawTarget() - now;

    document.querySelectorAll('[data-offer-countdown]').forEach((el) => { el.innerHTML = formatCountdown(offerDiff, lang); });
    document.querySelectorAll('[data-draw-countdown]').forEach((el) => { el.innerHTML = formatCountdown(drawDiff, lang); });

    const localLine = getNextFridayCourseLocalText(lang);
    document.querySelectorAll('[data-local-time], [data-local-time-line]').forEach((el) => {
      el.textContent = localLine;
    });

    document.querySelectorAll('[data-offer-price-block], [data-price-block]').forEach((block) => {
      const cur = block.querySelector('[data-price-current]');
      const orig = block.querySelector('[data-price-original]');
      const ended = block.querySelector('[data-offer-ended]');
      if (!cur || !orig || !ended) return;
      if (offerDiff <= 0) {
        cur.textContent = '$350';
        orig.textContent = '';
        ended.textContent = lang === 'ar' ? 'انتهى العرض' : 'Offer Ended';
        ended.hidden = false;
      } else {
        cur.textContent = '$60';
        orig.textContent = lang === 'ar' ? 'الرسوم الأساسية: 350 دولار' : 'Regular Price: $350';
        ended.hidden = true;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyStripeLinks();
    tick();
    setInterval(tick, 1000);
  });
  document.addEventListener('languageChanged', tick);
})();
