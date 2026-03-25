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
    setTimeout(() => { toast.hidden = true; }, 1700);
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

  async function loadCourses() {
    try {
      const res = await fetch('assets/data/courses.json', { cache: 'no-store' });
      const courses = await res.json();
      courseSelect.innerHTML = '';
      const first = document.createElement('option');
      first.value = '';
      first.textContent = getLang() === 'ar' ? 'اختر البرنامج' : 'Select course';
      first.setAttribute('data-en', 'Select course');
      first.setAttribute('data-ar', 'اختر البرنامج');
      courseSelect.appendChild(first);

      courses.forEach((course) => {
        const option = document.createElement('option');
        option.value = JSON.stringify(course);
        option.textContent = `${course.en} / ${course.ar}`;
        courseSelect.appendChild(option);
      });
    } catch (error) {
      courseSelect.innerHTML = '<option value="">Failed to load courses</option>';
    }
  }

  function validate() {
    return Boolean(
      form.fullName.value.trim() &&
      form.lastName.value.trim() &&
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

  function normalizeCustomSerial(value) {
    return String(value || '').trim().toUpperCase();
  }

  function renderSuccess(payload, apiResponse) {
    jsonOutput.textContent = JSON.stringify(
      {
        success: true,
        serial: apiResponse.serial,
        certificate: payload,
        verifyWith: {
          serial: apiResponse.serial,
          lastName: payload.lastName
        }
      },
      null,
      2
    );

    const verifyLink = `${window.location.origin}/verify.html?serial=${encodeURIComponent(apiResponse.serial)}&lastName=${encodeURIComponent(payload.lastName)}`;
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

    const selectedCourse = JSON.parse(courseSelect.value);
    const customSerial = normalizeCustomSerial(form.customSerial.value);

    const payload = {
      fullName: form.fullName.value.trim(),
      lastName: form.lastName.value.trim(),
      courseEn: selectedCourse.en,
      courseAr: selectedCourse.ar,
      issueDate: issueDate.value,
      notesEn: form.notesEn.value.trim(),
      notesAr: form.notesAr.value.trim(),
      customSerial
    };

    try {
      throw new Error('Certificate auto-publish API is disabled. Update assets/data/certificates.json directly.');
    } catch (error) {
      jsonOutput.textContent = JSON.stringify({ success: false, error: error.message }, null, 2);
      verifyUrl.value = '';
      if (qrWrap) qrWrap.innerHTML = '';
      showToast(getLang() === 'ar' ? `ميزة النشر الآلي متوقفة: ${error.message}` : `Auto publish disabled: ${error.message}`);
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    gateAdmin();
    if (document.getElementById('admin-view').hidden) return;

    setDefaultDate();
    await loadCourses();

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      await publishCertificate();
    });

    copyJsonBtn.addEventListener('click', () => copyText(jsonOutput.textContent || '{}'));
    copyUrlBtn.addEventListener('click', () => copyText(verifyUrl.value || ''));
  });
})();
