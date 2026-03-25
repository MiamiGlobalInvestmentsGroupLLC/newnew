(function () {
  const resultEl = document.getElementById('verify-result');
  const serialInputEl = document.getElementById('serial-input');
  const nameInputEl = document.getElementById('last-name-input');
  const btn = document.getElementById('verify-btn');

  function lang() {
    return window.SiteI18n ? window.SiteI18n.getLang() : 'en';
  }

  function normalizeName(value) {
    return String(value || '')
      .normalize('NFC')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeSerial(value) {
    return String(value || '').trim().toUpperCase();
  }

  function safe(v) {
    return String(v ?? '');
  }

  function renderFound(rec) {
    const l = lang();
    const note = l === 'ar' ? rec.notesAr : rec.notesEn;
    const course = l === 'ar' ? rec.courseAr : rec.courseEn;

    resultEl.hidden = false;
    resultEl.classList.add('verify-result-success');
    resultEl.innerHTML = `
      <img class="verify-success-seal" src="/assets/images/IMG_1929.jpeg" alt="MGI verification seal">
      <div class="verify-top"><span class="status-badge status-valid">VALID CERTIFICATE / شهادة صالحة</span></div>
      <p class="verify-trust-line">Verified by MGI Education<br>تم التحقق من الشهادة بواسطة MGI Education</p>
      <h3>${safe(rec.fullName)}</h3>
      <p><strong>Serial:</strong> ${safe(rec.serial)}</p>
      <p><strong>${l === 'ar' ? 'اسم العائلة' : 'Last Name'}:</strong> ${safe(rec.lastName || '')}</p>
      <p><strong>${l === 'ar' ? 'البرنامج التدريبي' : 'Course'}:</strong> ${safe(course)}</p>
      <p><strong>${l === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}:</strong> ${safe(rec.issueDate)}</p>
      <p class="muted">${safe(note)}</p>
    `;
  }

  function renderNotFound(serial, name) {
    const l = lang();
    resultEl.hidden = false;
    resultEl.classList.remove('verify-result-success');
    resultEl.innerHTML = `
      <div class="verify-top"><span class="status-badge status-missing">Certificate Not Found / الشهادة غير موجودة</span></div>
      <p>${l === 'ar' ? 'تعذر العثور على شهادة مطابقة.' : 'No matching certificate was found.'}</p>
      <p class="muted">${safe(serial)} / ${safe(name)}</p>
    `;
  }

  async function requestVerify(serial, enteredName, mode) {
    const query = mode === 'name'
      ? `serial=${encodeURIComponent(serial)}&name=${encodeURIComponent(enteredName)}`
      : `serial=${encodeURIComponent(serial)}&lastName=${encodeURIComponent(enteredName)}`;

    console.log('[verify] request mode:', mode, 'serial:', serial, 'name:', enteredName);

    const res = await fetch(`/api/get-certificate?${query}`);
    const data = await res.json();
    console.log('[verify] API result:', data);
    return data;
  }

  async function verify(serialRaw, nameRaw) {
    const serial = normalizeSerial(serialRaw);
    const enteredName = normalizeName(nameRaw);

    console.log('[verify] entered serial:', serial);
    console.log('[verify] entered name/lastName:', enteredName);

    if (!serial || !enteredName) {
      console.log('[verify] reason for failure: missing serial or name');
      return renderNotFound(serialRaw, nameRaw);
    }

    try {
      // Try serial + lastName first
      let data = await requestVerify(serial, enteredName, 'lastName');

      // Fallback serial + fullName exact
      if (!data?.found) {
        data = await requestVerify(serial, enteredName, 'name');
      }

      if (data?.found && data.certificate) {
        console.log('[verify] matched certificate:', data.certificate);
        return renderFound(data.certificate);
      }

      console.log('[verify] reason for failure: no match from API');
      return renderNotFound(serial, enteredName);
    } catch (error) {
      console.log('[verify] reason for failure: request error', error?.message || error);
      return renderNotFound(serial, enteredName);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    btn?.addEventListener('click', () => verify(serialInputEl.value, nameInputEl.value));

    const params = new URLSearchParams(location.search);
    const serial = params.get('serial');
    const lastName = params.get('lastName') || params.get('name');

    if (serial) serialInputEl.value = serial;
    if (lastName) nameInputEl.value = lastName;
    if (serial && lastName) verify(serial, lastName);
  });
})();
