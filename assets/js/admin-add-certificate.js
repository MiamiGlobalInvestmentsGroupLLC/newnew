(function () {
  const ADMIN_PASSCODE = 'CHANGE_ME';

  const form = document.getElementById('admin-cert-form');
  const issueDate = document.getElementById('issue-date');
  const courseSelect = document.getElementById('course-select');
  const jsonOutput = document.getElementById('json-output');
  const verifyUrl = document.getElementById('verify-url');
  const regenBtn = document.getElementById('regen-serial');
  const copyJsonBtn = document.getElementById('copy-json');
  const copyUrlBtn = document.getElementById('copy-url');
  const toast = document.getElementById('copy-toast');
  const qrWrap = document.getElementById('admin-qr');

  let currentSerial = '';

  function getLang() {
    return window.SiteI18n ? window.SiteI18n.getLang() : 'en';
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 1200);
  }

  function pad(num) { return String(num).padStart(6, '0'); }

  function yearFromDate(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return String(new Date().getFullYear());
    return value.slice(0, 4);
  }

  function serialKey(year) {
    return `mgi_serial_counter_${year}`;
  }

  function generateSerial(increment = false) {
    const year = yearFromDate(issueDate.value);
    const key = serialKey(year);
    const current = Number(localStorage.getItem(key) || '0');
    const next = increment ? current + 1 : (current || 1);
    if (increment || !current) localStorage.setItem(key, String(next));
    currentSerial = `MGI-${year}-${pad(next)}`;
    return currentSerial;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function buildRecord() {
    const fullName = form.fullName.value.trim();
    const issue = issueDate.value;
    const courseRaw = courseSelect.value;
    if (!fullName || !issue || !courseRaw) return null;
    const course = JSON.parse(courseRaw);
    return {
      serial: currentSerial || generateSerial(false),
      fullName,
      courseEn: course.en,
      courseAr: course.ar,
      issueDate: issue,
      status: form.status.value || 'valid',
      notesEn: form.notesEn.value.trim(),
      notesAr: form.notesAr.value.trim()
    };
  }

  function updateOutputs(record) {
    const jsonText = JSON.stringify(record, null, 2);
    jsonOutput.textContent = jsonText;
    const base = window.location.origin || 'https://YOUR_DOMAIN';
    const url = `${base}/verify.html?serial=${encodeURIComponent(record.serial)}`;
    verifyUrl.value = url;

    if (window.QRCode && qrWrap) {
      qrWrap.innerHTML = '';
      new QRCode(qrWrap, { text: url, width: 132, height: 132 });
    }
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(getLang() === 'ar' ? 'تم النسخ' : 'Copied');
    } catch (e) {
      showToast(getLang() === 'ar' ? 'تعذّر النسخ' : 'Copy failed');
    }
  }

  function validate() {
    const fullName = form.fullName.value.trim();
    const issue = issueDate.value;
    const courseRaw = courseSelect.value;
    return Boolean(fullName && issue && courseRaw);
  }

  function gateAdmin() {
    const key = 'mgi_admin_access';
    if (sessionStorage.getItem(key) === 'ok') {
      document.getElementById('admin-view').hidden = false;
      return;
    }
    const entered = window.prompt('Admin passcode');
    if (entered === ADMIN_PASSCODE) {
      sessionStorage.setItem(key, 'ok');
      document.getElementById('admin-view').hidden = false;
    } else {
      document.getElementById('locked-view').hidden = false;
    }
  }

  function setDefaultDate() {
    const d = new Date();
    issueDate.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    gateAdmin();
    if (document.getElementById('admin-view').hidden) return;

    setDefaultDate();
    generateSerial(false);

    issueDate.addEventListener('change', () => {
      generateSerial(false);
    });

    regenBtn.addEventListener('click', () => {
      generateSerial(true);
      const rec = buildRecord();
      if (rec) updateOutputs(rec);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) {
        showToast(getLang() === 'ar' ? 'يرجى تعبئة الحقول الإلزامية' : 'Please fill required fields');
        return;
      }
      if (!currentSerial) generateSerial(true);
      const record = buildRecord();
      updateOutputs(record);
    });

    copyJsonBtn.addEventListener('click', () => copyText(jsonOutput.textContent || '{}'));
    copyUrlBtn.addEventListener('click', () => copyText(verifyUrl.value || ''));
  });
})();
