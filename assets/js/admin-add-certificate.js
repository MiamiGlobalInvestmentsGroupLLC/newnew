(function () {
  const ADMIN_PASSCODE = 'CHANGE_ME';

  const form = document.getElementById('admin-cert-form');
  const issueDate = document.getElementById('issue-date');
  const courseSelect = document.getElementById('course-select');
  const jsonOutput = document.getElementById('json-output');
  const verifyUrl = document.getElementById('verify-url');
  const copyJsonBtn = document.getElementById('copy-json');
  const copyUrlBtn = document.getElementById('copy-url');
  const toast = document.getElementById('copy-toast');
  const qrWrap = document.getElementById('admin-qr');

  function getLang() {
    return window.SiteI18n ? window.SiteI18n.getLang() : 'en';
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 1500);
  }

  function safeJsonParse(input) {
    try {
      return JSON.parse(input);
    } catch (error) {
      return null;
    }
  }

  function setDefaultDate() {
    const d = new Date();
    issueDate.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

  function validate() {
    return Boolean(
      form.fullName.value.trim() &&
      issueDate.value &&
      courseSelect.value
    );
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(getLang() === 'ar' ? 'تم النسخ' : 'Copied');
    } catch (error) {
      showToast(getLang() === 'ar' ? 'تعذّر النسخ' : 'Copy failed');
    }
  }

  function renderSuccess(certificate, apiResponse) {
    jsonOutput.textContent = JSON.stringify({
      success: true,
      serial: apiResponse.serial,
      certificate
    }, null, 2);

    const verifyLink = `${window.location.origin}/verify.html?serial=${encodeURIComponent(apiResponse.serial)}`;
    verifyUrl.value = verifyLink;

    if (window.QRCode && qrWrap) {
      qrWrap.innerHTML = '';
      new QRCode(qrWrap, { text: verifyLink, width: 132, height: 132 });
    }

    const l = getLang();
    showToast(l === 'ar' ? `تم نشر الشهادة: ${apiResponse.serial}` : `Certificate published: ${apiResponse.serial}`);
  }

  async function publishCertificate() {
    if (!validate()) {
      showToast(getLang() === 'ar' ? 'يرجى تعبئة الحقول الإلزامية' : 'Please fill required fields');
      return;
    }

    const selectedCourse = safeJsonParse(courseSelect.value);
    if (!selectedCourse) {
      showToast(getLang() === 'ar' ? 'صيغة البرنامج غير صالحة' : 'Invalid course format');
      return;
    }

    const payload = {
      fullName: form.fullName.value.trim(),
      courseEn: selectedCourse.en,
      courseAr: selectedCourse.ar,
      issueDate: issueDate.value,
      notesEn: form.notesEn.value.trim(),
      notesAr: form.notesAr.value.trim()
    };

    try {
      const response = await fetch('/api/add-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to publish certificate');
      }

      renderSuccess(payload, data);
    } catch (error) {
      jsonOutput.textContent = JSON.stringify({ success: false, error: error.message }, null, 2);
      verifyUrl.value = '';
      if (qrWrap) qrWrap.innerHTML = '';
      showToast(getLang() === 'ar' ? 'فشل نشر الشهادة' : 'Failed to publish certificate');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    gateAdmin();
    if (document.getElementById('admin-view').hidden) return;

    setDefaultDate();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await publishCertificate();
    });

    copyJsonBtn.addEventListener('click', () => copyText(jsonOutput.textContent || '{}'));
    copyUrlBtn.addEventListener('click', () => copyText(verifyUrl.value || ''));
  });
})();
