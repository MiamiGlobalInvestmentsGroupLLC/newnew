const i18n = {
  en: {
    navHome:'Home', navPrograms:'Programs', navTrust:'Trust & Ecosystem', navContact:'Contact',
    heroBadge:'Trust • Standards • Verification',
    heroTitle:'Trust & Ecosystem',
    heroSub:'Executive-grade learning with verifiable credentials—built on internal standards and globally recognized open technologies.',
    heroCred:'Registered participant in the Microsoft AI Cloud Partner Program (Partner ID: 7086941).',
    heroCta1:'Explore Standards', heroCta2:'Verify a Credential',
    sealsTitle:'MGI Academic Seals',
    sealsSub:'University-inspired seals representing internal academic governance and excellence.',
    openTitle:'Open Technology Ecosystem', openSub:'Used in our learning labs and tools (descriptive use).',
    marksTitle:'MGI Verification & Delivery Standards', marksSub:'Internal trust marks supporting credential verification and delivery quality.',
    thirdPartyDisc:'Third-party marks are used for descriptive purposes only and do not imply endorsement.',
    showMore:'Show more', showLess:'Show less',
    faqTitle:'FAQ',
    footerDisc:'MGI seals and trust marks are internal standards and verification features. Third-party marks are used descriptively and do not imply endorsement.'
  },
  ar: {
    navHome:'الرئيسية', navPrograms:'البرامج', navTrust:'الثقة والنظام البيئي', navContact:'اتصل بنا',
    heroBadge:'الثقة • المعايير • التحقق',
    heroTitle:'الثقة والنظام البيئي',
    heroSub:'تعليم تنفيذي بمعايير عالية مع شهادات قابلة للتحقق، مبني على معايير داخلية وتقنيات مفتوحة معترف بها عالمياً.',
    heroCred:'مشارك مسجّل في Microsoft AI Cloud Partner Program (Partner ID: 7086941).',
    heroCta1:'استكشف المعايير', heroCta2:'تحقق من الشهادة',
    sealsTitle:'أختام MGI الأكاديمية',
    sealsSub:'أختام بطابع جامعي تعبّر عن الحوكمة الأكاديمية الداخلية والتميّز.',
    openTitle:'النظام التقني المفتوح', openSub:'تقنيات مستخدمة في المختبرات والأدوات التعليمية (استخدام وصفي).',
    marksTitle:'معايير MGI للتحقق وجودة التنفيذ', marksSub:'علامات ثقة داخلية تدعم التحقق من الشهادات وجودة التقديم.',
    thirdPartyDisc:'تُستخدم علامات الجهات الخارجية لأغراض وصفية فقط ولا تعني أي اعتماد أو تأييد.',
    showMore:'عرض المزيد', showLess:'عرض أقل',
    faqTitle:'الأسئلة الشائعة',
    footerDisc:'أختام MGI وعلامات الثقة هي معايير داخلية وخصائص للتحقق. وتُستخدم علامات الجهات الخارجية بشكل وصفي فقط دون أي دلالة على التأييد.'
  }
};

const sealItems = [
['MGI Academic Excellence Seal','Academic governance standard','ختم التميّز الأكاديمي','معيار الحوكمة الأكاديمية'],
['MGI Faculty Standard Seal','Instructor excellence baseline','ختم معيار الهيئة التدريبية','خط أساس جودة المدرب'],
['MGI Curriculum Senate Seal','Curriculum review & versioning','ختم مجلس المناهج','مراجعة المناهج وإصداراتها'],
['MGI Assessment Council Seal','Assessment integrity standard','ختم مجلس التقييم','معيار نزاهة التقييم'],
['MGI Credential Integrity Seal','Credential authenticity standard','ختم نزاهة الشهادة','معيار أصالة الشهادات'],
['MGI Honors Track Seal','High-performance track standard','ختم مسار التميّز','معيار المسار عالي الأداء'],
['MGI Professional Ethics Seal','Ethics & conduct standard','ختم الأخلاقيات المهنية','معيار الأخلاقيات والسلوك'],
['MGI Research-Informed Seal','Applied research alignment','ختم مرتكزات البحث التطبيقي','مواءمة مع البحث التطبيقي'],
['MGI Capstone Approval Seal','Capstone validation','ختم اعتماد المشروع الختامي','تحقق المشروع الختامي'],
['MGI Executive Delivery Seal','Premium delivery standard','ختم التنفيذ التنفيذي','معيار تقديم متميز'],
['MGI Global Standards Seal','Global professionalism baseline','ختم المعايير العالمية','خط أساس المهنية العالمية'],
['MGI Quality Assurance Seal','QA checkpoints framework','ختم ضمان الجودة','إطار نقاط فحص الجودة']
];

const openTech = [
['Python™','Used in Python-based labs'],['Project Jupyter™','Notebook workflows used in practice sessions'],['NumPy','Numerical computing used in exercises'],['Pandas','Data analysis stack used in coursework'],['Matplotlib','Visualization workflows in practical labs'],['Scikit-learn','Machine learning examples in class'],['PyTorch','Model prototyping in selected modules'],['TensorFlow','Applied AI practice workflows'],['Git','Version control in project assignments'],['Docker','Container basics for deployment labs'],['Kubernetes','Orchestration concepts in advanced modules'],['HTML5','Web standards used in platform delivery'],['CSS3','Styling standards used in practice'],['Creative Commons (CC BY icon)','CC icons used to describe sample licensing']
];

const marks = ['MGI Verified Credentials','MGI Certificate Registry','MGI QR Credential Verification','MGI Serial ID Authentication','MGI Secure Credential Issuance','MGI Anti-Fraud Certification','MGI Digital Credential Validation','MGI Lifetime Credential Page','MGI Audit-Ready Records','MGI Exam Integrity Framework','MGI Completion Verification','MGI Attendance Verification','MGI Document Authenticity','MGI Verification API Ready','MGI Curriculum Governance','MGI Version Control Standard','MGI Instructor Excellence Standard','MGI Learner Support Standard','MGI Premium Delivery Standard','MGI Corporate Readiness Standard','MGI Case-Based Learning Standard','MGI Practical Outcomes Standard','MGI Capstone Validation','MGI Skills Framework','MGI Industry Alignment','MGI Continuous Learning Standard','MGI Content Quality Seal','MGI Policy Transparency','MGI Data Privacy Standard','MGI Excellence Standard'];

const faqs = {
  en:[
    ['Are these third-party accreditations?','No. These are internal MGI standards and trust marks.'],
    ['How does verification work?','Verification is completed through serial number and registry lookup.'],
    ['What does certificate registry mean?','It is an internal record system for issued credentials.'],
    ['How can employers verify quickly?','Employers can use the verify page with serial ID.'],
    ['How long are records retained?','Records are retained according to internal quality and audit policy.'],
    ['Who should I contact for support?','Please contact MGI Education support for registry assistance.']
  ],
  ar:[
    ['هل هذه اعتمادات من جهات خارجية؟','لا، هذه معايير وعلامات ثقة داخلية خاصة بـ MGI.'],
    ['كيف تعمل عملية التحقق؟','تتم عبر الرقم التسلسلي ومطابقته مع سجل الشهادات.'],
    ['ما المقصود بسجل الشهادات؟','هو نظام داخلي لتوثيق الشهادات الصادرة.'],
    ['كيف يمكن لصاحب العمل التحقق بسرعة؟','من خلال صفحة التحقق وإدخال الرقم التسلسلي.'],
    ['ما مدة الاحتفاظ بالسجلات؟','تُحفظ السجلات وفق سياسة الجودة والتدقيق الداخلية.'],
    ['كيف أتواصل للدعم؟','يرجى التواصل مع فريق دعم MGI Education للمساعدة.']
  ]
};

const storedLang = localStorage.getItem('trustLang');
let lang = (storedLang === 'en' || storedLang === 'ar') ? storedLang : ((navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en');

function sealSVG(label){
  return `<svg viewBox="0 0 120 120" class="seal-svg" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="#b99645" stroke-width="3"/><circle cx="60" cy="60" r="38" fill="none" stroke="#d5bc7a" stroke-width="2"/><path d="M35 86 L60 72 L85 86" fill="none" stroke="#b99645" stroke-width="2"/><text x="60" y="65" text-anchor="middle" font-size="14" fill="#7f6321" font-family="serif">MGI</text><circle cx="28" cy="60" r="2.5" fill="#b99645"/><circle cx="92" cy="60" r="2.5" fill="#b99645"/></svg>`;
}
function markSVG(){return `<svg class="mark-icon" viewBox="0 0 24 24"><path d="M4 12h16M7 6l10 12M7 18L17 6"/></svg>`}

function render(){
  document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  localStorage.setItem('trustLang',lang);
  document.querySelector('#langToggle').textContent = lang==='ar'?'EN':'AR';
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=i18n[lang][el.dataset.i18n]||'');

  const seals=document.getElementById('sealGrid');
  seals.innerHTML=sealItems.map(([en,capEn,ar,capAr])=>`<article class="card">${sealSVG(en)}<div class="seal-title">${lang==='ar'?ar:en}</div><div class="seal-cap">${lang==='ar'?capAr:capEn}</div></article>`).join('');

  const open=document.getElementById('openGrid');
  open.classList.add('collapsed');
  open.innerHTML=openTech.map(([name,cap])=>`<article class="card"><div class="logo-spot">${name}</div><h3>${name}</h3><p class="seal-cap">${cap}</p><a class="policy" href="#">Policy</a></article>`).join('');

  const marksGrid=document.getElementById('marksGrid');
  marksGrid.classList.add('collapsed');
  marksGrid.innerHTML=marks.map(name=>`<article class="card mark-item">${markSVG()}<div class="mark-label">${name}</div></article>`).join('');

  const faq=document.getElementById('faqList');
  faq.innerHTML=faqs[lang].map(([q,a])=>`<div class="faq-item"><div class="q">${q}</div><div>${a}</div></div>`).join('');

  document.querySelectorAll('.show-more').forEach(btn=>btn.textContent=i18n[lang].showMore);
}

document.addEventListener('click',(e)=>{
  const btn=e.target.closest('.show-more');
  if(btn){
    const grid=document.getElementById(btn.dataset.target);
    grid.classList.toggle('collapsed');
    btn.textContent = grid.classList.contains('collapsed') ? i18n[lang].showMore : i18n[lang].showLess;
  }
  if(e.target.id==='langToggle'){ lang=lang==='en'?'ar':'en'; render(); }
});

render();
