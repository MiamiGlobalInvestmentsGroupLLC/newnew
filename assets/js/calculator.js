(function () {
  'use strict';

  var BASE = 400;
  var PREMIUM = 460;
  var MAX_MONTHS = 12;
  var WA_NUMBER = '13056290491';

  function calcTotal(months) {
    if (months <= 1) return BASE;
    return BASE + Math.round((months - 1) * (PREMIUM - BASE) / (MAX_MONTHS - 1));
  }

  function calcMonthly(months) {
    if (months <= 1) return BASE;
    return Math.ceil(calcTotal(months) / months);
  }

  function getLang() {
    return window.SiteI18n ? window.SiteI18n.getLang() : 'en';
  }

  function fmt(usdAmount) {
    if (window.SiteCurrency) return window.SiteCurrency.format(usdAmount);
    return '$' + usdAmount;
  }

  function updateSliderTrack(slider) {
    var pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background =
      'linear-gradient(90deg, var(--gold) ' + pct + '%, #e0d5b5 ' + pct + '%)';
  }

  function update() {
    var slider = document.getElementById('installment-slider');
    if (!slider) return;

    var months = parseInt(slider.value, 10);
    var total   = calcTotal(months);
    var monthly = calcMonthly(months);
    var isAr    = getLang() === 'ar';

    updateSliderTrack(slider);

    var monthsEl  = document.getElementById('calc-months-display');
    var monthlyEl = document.getElementById('calc-monthly');
    var totalEl   = document.getElementById('calc-total');
    var waBtn     = document.getElementById('calc-whatsapp-btn');

    if (monthsEl) {
      monthsEl.textContent = months === 1
        ? (isAr ? 'دفعة واحدة (كاش)' : '1 (Cash)')
        : months + (isAr ? ' أشهر' : ' months');
    }

    if (monthlyEl) {
      monthlyEl.textContent = months === 1
        ? fmt(total)
        : fmt(monthly) + (isAr ? '/شهر' : '/mo');
    }

    if (totalEl) totalEl.textContent = fmt(total);

    if (waBtn) {
      var msgEn = 'Hello MGI, I want to enroll in a diploma with installments: ' +
        months + ' month' + (months !== 1 ? 's' : '') +
        ' — $' + monthly + '/mo, total $' + total + '. Please confirm.';
      var msgAr = 'مرحباً MGI، أريد التسجيل في دبلوم بالتقسيط: ' +
        months + (months === 1 ? ' شهر' : ' أشهر') +
        '، ' + monthly + '$/شهر، الإجمالي ' + total + '$. يرجى التأكيد.';
      waBtn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(isAr ? msgAr : msgEn);
    }
  }

  function init() {
    var slider = document.getElementById('installment-slider');
    if (!slider) return;
    slider.addEventListener('input', update);
    update();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('languageChanged', update);
  document.addEventListener('currencyChanged', update);
})();
