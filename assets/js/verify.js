(function(){
  const dataUrl = 'assets/data/certificates.json';
  const resultEl = document.getElementById('verify-result');
  const inputEl = document.getElementById('serial-input');
  const btn = document.getElementById('verify-btn');

  function lang(){ return window.SiteI18n ? window.SiteI18n.getLang() : 'en'; }

  function badge(status){
    if (status === 'valid') return '<span class="status-badge status-valid">VALID / صالحة</span>';
    if (status === 'revoked') return '<span class="status-badge status-revoked">REVOKED / ملغاة</span>';
    return '<span class="status-badge status-missing">NOT FOUND / غير موجودة</span>';
  }

  function safe(v){ return String(v ?? ''); }

  function renderFound(rec){
    const l = lang();
    const note = l === 'ar' ? rec.notesAr : rec.notesEn;
    const course = l === 'ar' ? rec.courseAr : rec.courseEn;
    const verifyLink = `${location.origin}${location.pathname}?serial=${encodeURIComponent(rec.serial)}`;
    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="verify-top">${badge(rec.status)}</div>
      <h3>${safe(rec.fullName)}</h3>
      <p><strong>Serial:</strong> ${safe(rec.serial)}</p>
      <p><strong>${l==='ar'?'البرنامج التدريبي':'Course'}:</strong> ${safe(course)}</p>
      <p><strong>${l==='ar'?'تاريخ الإصدار':'Issue Date'}:</strong> ${safe(rec.issueDate)}</p>
      <p class="muted">${safe(note)}</p>
      <div class="verify-actions">
        <button class="btn btn-secondary" id="copy-link">${l==='ar'?'نسخ رابط التحقق':'Copy Verification Link'}</button>
        <button class="btn btn-secondary" id="print-btn">${l==='ar'?'طباعة':'Print'}</button>
      </div>
      <div id="qrcode" class="qrcode-wrap"></div>
    `;
    const copy = document.getElementById('copy-link');
    const printB = document.getElementById('print-btn');
    copy?.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(verifyLink);}catch(e){} });
    printB?.addEventListener('click', ()=>window.print());
    if (rec.status === 'valid' && window.QRCode) {
      const qr = document.getElementById('qrcode');
      qr.innerHTML='';
      new QRCode(qr, { text: verifyLink, width: 140, height: 140 });
    }
  }

  function renderNotFound(serial){
    const l = lang();
    resultEl.hidden = false;
    resultEl.innerHTML = `
      <div class="verify-top">${badge('missing')}</div>
      <p>${l==='ar'?'تعذر العثور على شهادة بهذا الرقم التسلسلي. يرجى مراجعة الرقم والتواصل مع فريق الدعم.':'No certificate found for this serial. Please check the serial and contact support.'}</p>
      <p class="muted">${safe(serial)}</p>
    `;
  }

  async function verify(serial){
    if(!serial) return;
    const res = await fetch(dataUrl);
    const rows = await res.json();
    const rec = rows.find(r => String(r.serial).toUpperCase() === String(serial).toUpperCase());
    if(rec) renderFound(rec); else renderNotFound(serial);
  }

  function initAdmin(){
    const params = new URLSearchParams(location.search);
    if(params.get('admin') !== '1') return;
    const box = document.getElementById('admin-tools');
    const btn = document.getElementById('generate-serial');
    const out = document.getElementById('generated-serial');
    box.hidden = false;
    btn?.addEventListener('click', ()=>{
      const y = new Date().getFullYear();
      const key = 'mgiSerialCounter';
      const n = Number(localStorage.getItem(key) || '0') + 1;
      localStorage.setItem(key, String(n));
      const serial = `MGI-${y}-${String(n).padStart(6,'0')}`;
      out.textContent = serial;
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    btn?.addEventListener('click', ()=>verify(inputEl.value.trim()));
    const serial = new URLSearchParams(location.search).get('serial');
    if(serial){ inputEl.value = serial; verify(serial); }
    initAdmin();
  });
  document.addEventListener('languageChanged', ()=>{
    const serial = new URLSearchParams(location.search).get('serial') || inputEl?.value;
    if(serial && !resultEl.hidden) verify(serial);
  });
})();
