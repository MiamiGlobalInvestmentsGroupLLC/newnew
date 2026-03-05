(function () {
  const resultEl = document.getElementById('verify-result');
  const serialInputEl = document.getElementById('serial-input');
  const lastNameInputEl = document.getElementById('last-name-input');
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
    const verifyLink = `${location.origin}${location.pathname}?serial=${encodeURIComponent(rec.serial)}&lastName=${encodeURIComponent(rec.lastName)}`;

    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="verify-top"><span class="status-badge status-valid">${l === 'ar' ? 'الشهادة صالحة' : 'Certificate Valid'}</span></div>
      <h3>${safe(rec.fullName)}</h3>
      <p><strong>Serial:</strong> ${safe(rec.serial)}</p>
      <p><strong>${l === 'ar' ? 'اسم العائلة' : 'Last Name'}:</strong> ${safe(rec.lastName)}</p>
      <p><strong>${l === 'ar' ? 'البرنامج التدريبي' : 'Course'}:</strong> ${safe(course)}</p>
      <p><strong>${l === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}:</strong> ${safe(rec.issueDate)}</p>
      <p class="muted">${safe(note)}</p>
      <div class="verify-actions">
        <button class="btn btn-secondary" id="copy-link">${l === 'ar' ? 'نسخ رابط التحقق' : 'Copy Verification Link'}</button>
        <button class="btn btn-secondary" id="print-btn">${l === 'ar' ? 'طباعة' : 'Print'}</button>
      </div>
      <div id="qrcode" class="qrcode-wrap"></div>
    `;

    document.getElementById('copy-link')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(verifyLink); } catch (error) {}
    });

    document.getElementById('print-btn')?.addEventListener('click', () => window.print());

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
      <p>${l === 'ar' ? 'البيانات غير مطابقة. يرجى التأكد من الرقم التسلسلي واسم العائلة.' : 'No certificate matched. Please check serial number and last name.'}</p>
      <p class="muted">${safe(serial)}</p>
    `;
  }

  async function verify(serial, lastName) {
    if (!serial || !lastName) return;
    try {
      const res = await fetch(`/api/get-certificate?serial=${encodeURIComponent(serial)}&lastName=${encodeURIComponent(lastName)}`);
      const data = await res.json();
      if (data.found && data.certificate) renderFound(data.certificate);
      else renderNotFound(serial);
    } catch (error) {
      renderNotFound(serial);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    btn?.addEventListener('click', () => verify(serialInputEl.value.trim(), lastNameInputEl.value.trim()));

    const params = new URLSearchParams(location.search);
    const serial = params.get('serial');
    const lastName = params.get('lastName');

    if (serial) serialInputEl.value = serial;
    if (lastName) lastNameInputEl.value = lastName;
    if (serial && lastName) verify(serial, lastName);
  });
})();
