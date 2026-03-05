(function () {
  const resultEl = document.getElementById('verify-result');
  const inputEl = document.getElementById('serial-input');
  const btn = document.getElementById('verify-btn');

  function lang() {
    return window.SiteI18n ? window.SiteI18n.getLang() : 'en';
  }

  function safe(v) {
    return String(v ?? '');
  }

  function renderFound(rec) {
    const l = lang();
    const note = l === 'ar' ? rec.notesAr : rec.notesEn;
    const course = l === 'ar' ? rec.courseAr : rec.courseEn;
    const verifyLink = `${location.origin}${location.pathname}?serial=${encodeURIComponent(rec.serial)}`;

    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="verify-top"><span class="status-badge status-valid">${l === 'ar' ? 'الشهادة صالحة' : 'Certificate Valid'}</span></div>
      <h3>${safe(rec.fullName)}</h3>
      <p><strong>Serial:</strong> ${safe(rec.serial)}</p>
      <p><strong>${l === 'ar' ? 'البرنامج التدريبي' : 'Course'}:</strong> ${safe(course)}</p>
      <p><strong>${l === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}:</strong> ${safe(rec.issueDate)}</p>
      <p class="muted">${safe(note)}</p>
      <div class="verify-actions">
        <button class="btn btn-secondary" id="copy-link">${l === 'ar' ? 'نسخ رابط التحقق' : 'Copy Verification Link'}</button>
        <button class="btn btn-secondary" id="print-btn">${l === 'ar' ? 'طباعة' : 'Print'}</button>
      </div>
      <div id="qrcode" class="qrcode-wrap"></div>
    `;

    const copy = document.getElementById('copy-link');
    const printB = document.getElementById('print-btn');

    copy?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(verifyLink); } catch (error) {}
    });

    printB?.addEventListener('click', () => window.print());

    if (window.QRCode) {
      const qr = document.getElementById('qrcode');
      qr.innerHTML = '';
      new QRCode(qr, { text: verifyLink, width: 140, height: 140 });
    }
  }

  function renderNotFound(serial) {
    const l = lang();
    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="verify-top"><span class="status-badge status-missing">${l === 'ar' ? 'الشهادة غير موجودة' : 'Certificate Not Found'}</span></div>
      <p>${l === 'ar' ? 'تعذر العثور على شهادة بهذا الرقم التسلسلي. يرجى مراجعة الرقم.' : 'No certificate found for this serial. Please check the serial number.'}</p>
      <p class="muted">${safe(serial)}</p>
    `;
  }

  async function verify(serial) {
    if (!serial) return;
    try {
      const res = await fetch(`/api/get-certificate?serial=${encodeURIComponent(serial)}`);
      const data = await res.json();
      if (data.found && data.certificate) {
        renderFound(data.certificate);
      } else {
        renderNotFound(serial);
      }
    } catch (error) {
      renderNotFound(serial);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    btn?.addEventListener('click', () => verify(inputEl.value.trim()));
    const serial = new URLSearchParams(location.search).get('serial');
    if (serial) {
      inputEl.value = serial;
      verify(serial);
    }
  });

  document.addEventListener('languageChanged', () => {
    const serial = new URLSearchParams(location.search).get('serial') || inputEl?.value;
    if (serial && !resultEl.hidden) verify(serial);
  });
})();
