(function () {
  'use strict';

  var RATES = {
    USD: 1, SAR: 3.75, AED: 3.67, KWD: 0.307,
    JOD: 0.71, EGP: 48.5, QAR: 3.64, OMR: 0.385,
    BHD: 0.377, EUR: 0.92, GBP: 0.79, MAD: 10.1, TND: 3.15
  };

  var SYMBOLS = {
    USD: '$', SAR: 'ر.س', AED: 'د.إ', KWD: 'د.ك',
    JOD: 'د.أ', EGP: 'ج.م', QAR: 'ر.ق', OMR: 'ر.ع',
    BHD: 'د.ب', EUR: '€', GBP: '£', MAD: 'د.م', TND: 'د.ت'
  };

  var NAMES = {
    USD: 'USD — US Dollar',    SAR: 'SAR — Saudi Riyal',
    AED: 'AED — UAE Dirham',   KWD: 'KWD — Kuwaiti Dinar',
    JOD: 'JOD — Jordanian Dinar', EGP: 'EGP — Egyptian Pound',
    QAR: 'QAR — Qatari Riyal', OMR: 'OMR — Omani Rial',
    BHD: 'BHD — Bahraini Dinar', EUR: 'EUR — Euro',
    GBP: 'GBP — British Pound', MAD: 'MAD — Moroccan Dirham',
    TND: 'TND — Tunisian Dinar'
  };

  var TZ_MAP = {
    'Asia/Riyadh': 'SAR', 'Asia/Jeddah': 'SAR', 'Asia/Dubai': 'AED',
    'Asia/Muscat': 'OMR', 'Asia/Kuwait': 'SAR', 'Asia/Qatar': 'QAR',
    'Asia/Bahrain': 'BHD', 'Asia/Amman': 'JOD', 'Asia/Baghdad': 'USD',
    'Africa/Cairo': 'EGP', 'Africa/Casablanca': 'MAD', 'Africa/Tunis': 'TND',
    'Europe/London': 'GBP', 'Europe/Paris': 'EUR', 'Europe/Berlin': 'EUR',
    'Europe/Madrid': 'EUR', 'Europe/Rome': 'EUR', 'Europe/Amsterdam': 'EUR'
  };

  var current = 'USD';

  function detect() {
    var stored = localStorage.getItem('mgi_currency');
    if (stored && RATES[stored]) return stored;
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return TZ_MAP[tz] || 'USD';
    } catch (e) { return 'USD'; }
  }

  function format(usdAmount) {
    if (current === 'USD') return '$' + usdAmount;
    var local = Math.round(usdAmount * (RATES[current] || 1));
    return '$' + usdAmount + ' ≈ ' + local + ' ' + (SYMBOLS[current] || current);
  }

  function setCurrency(code) {
    if (!RATES[code]) return;
    current = code;
    localStorage.setItem('mgi_currency', code);
    document.querySelectorAll('.currency-select').forEach(function (sel) { sel.value = code; });
    document.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: code } }));
  }

  function buildSelects() {
    document.querySelectorAll('.currency-select').forEach(function (sel) {
      sel.innerHTML = '';
      Object.keys(NAMES).forEach(function (code) {
        var opt = document.createElement('option');
        opt.value = code;
        opt.textContent = NAMES[code];
        if (code === current) opt.selected = true;
        sel.appendChild(opt);
      });
      if (!sel.dataset.currencyBound) {
        sel.addEventListener('change', function () { setCurrency(sel.value); });
        sel.dataset.currencyBound = '1';
      }
    });
  }

  window.SiteCurrency = {
    getCurrency: function () { return current; },
    getRate:     function () { return RATES[current] || 1; },
    format:      format,
    setCurrency: setCurrency
  };

  document.addEventListener('DOMContentLoaded', function () {
    current = detect();
    buildSelects();
  });
})();
