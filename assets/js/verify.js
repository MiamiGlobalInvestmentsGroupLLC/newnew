(function () {
  const resultEl = document.getElementById('verify-result');
  const serialInputEl = document.getElementById('serial-input');
  const nameInputEl = document.getElementById('last-name-input');
  const btn = document.getElementById('verify-btn');

  function lang() {
    return window.SiteI18n ? window.SiteI18n.getLang() : 'en';
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFC')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeSerial(value) {
    return normalize(value).toUpperCase();
  }

  function normalizeLastName(value) {
    return normalize(value).toLowerCase();
  }

  function safe(v) {
    return String(v ?? '');
  }

  function recordLastName(record) {
    if (record.lastName) return normalizeLastName(record.lastName);
    const full = normalize(record.fullName || '');
    if (!full) return '';
    return normalizeLastName(full.split(/\s+/).at(-1));
  }

  function recordMatchesName(record, enteredName) {
    const wanted = normalize(enteredName);
    if (!wanted) return false;

    if (recordLastName(record) === normalizeLastName(wanted)) return true;
    return normalize(record.fullName || '') === wanted;
  }

  function renderFound(rec) {
    const l = lang();
    const note = l === 'ar' ? rec.notesAr : rec.notesEn;
    const course = l === 'ar' ? rec.courseAr : rec.courseEn;
    const verifyLink = `${location.origin}${location.pathname}?serial=${encodeURIComponent(rec.serial)}&lastName=${encodeURIComponent(rec.lastName || rec.fullName || '')}`;

    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="verify-top"><span class="status-badge status-valid">VALID CERTIFICATE / شهادة صالحة</span></div>
      <h3>${safe(rec.fullName)}</h3>
      <p><strong>Serial:</strong> ${safe(rec.serial)}</p>
      <p><strong>${l === 'ar' ? 'اسم العائلة' : 'Last Name'}:</strong> ${safe(rec.lastName || '')}</p>
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
      try { await navigator.clipboard.writeText(verifyLink); } catch {}
    });

    document.getElementById('print-btn')?.addEventListener('click', () => window.print());

    if (window.QRCode) {
      const qr = document.getElementById('qrcode');
      qr.innerHTML = '';
      new QRCode(qr, { text: verifyLink, width: 140, height: 140 });
    }
  }

  function renderNotFound(serial, enteredName, reason) {
    const l = lang();
    console.log('[verify] reason for failure:', reason);

    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="verify-top"><span class="status-badge status-missing">${l === 'ar' ? 'الشهادة غير موجودة' : 'Certificate Not Found'}</span></div>
      <p>${l === 'ar' ? 'البيانات غير مطابقة. يرجى التأكد من الرقم التسلسلي والاسم.' : 'No certificate matched. Please check serial number and name.'}</p>
      <p class="muted">${safe(serial)} / ${safe(enteredName)}</p>
    `;
  }

  async function verify(serialRaw, nameRaw) {
    const serial = normalizeSerial(serialRaw);
    const enteredName = normalize(nameRaw);

    console.log('[verify] entered serial:', serial);
    console.log('[verify] entered name/lastName:', enteredName);

    if (!serial || !enteredName) {
      return renderNotFound(serialRaw, nameRaw, 'missing serial or name input');
    }

    try {
      const res = await fetch(`/api/get-certificate?serial=${encodeURIComponent(serial)}&lastName=${encodeURIComponent(enteredName)}`);
      const data = await res.json();

      if (data.found && data.certificate) {
        const cert = data.certificate;
        const serialMatched = normalizeSerial(cert.serial) === serial;
        const nameMatched = recordMatchesName(cert, enteredName);

        if (serialMatched && nameMatched) {
          console.log('[verify] matched certificate:', cert);
          return renderFound(cert);
        }
        return renderNotFound(serial, enteredName, 'API returned certificate but local normalized validation failed');
      }

      return renderNotFound(serial, enteredName, 'no matching certificate from API');
    } catch (error) {
      return renderNotFound(serial, enteredName, `request failed: ${error.message}`);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    btn?.addEventListener('click', () => verify(serialInputEl.value, nameInputEl.value));

    const params = new URLSearchParams(location.search);
    const serial = params.get('serial');
    const lastName = params.get('lastName');

    if (serial) serialInputEl.value = serial;
    if (lastName) nameInputEl.value = lastName;
    if (serial && lastName) verify(serial, lastName);
  });
})();
