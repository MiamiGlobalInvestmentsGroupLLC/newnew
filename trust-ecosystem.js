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
    openTitle:'Technology Ecosystem',
    openSub:'Registered participant in the Microsoft AI Cloud Partner Program (Partner ID: 7086941).',
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
    openTitle:'النظام التقني',
    openSub:'مشارك مسجّل في Microsoft AI Cloud Partner Program (Partner ID: 7086941).',
    marksTitle:'معايير MGI للتحقق وجودة التنفيذ', marksSub:'علامات ثقة داخلية تدعم التحقق من الشهادات وجودة التقديم.',
    thirdPartyDisc:'تُستخدم علامات الجهات الخارجية لأغراض وصفية فقط ولا تعني أي اعتماد أو تأييد.',
    showMore:'عرض المزيد', showLess:'عرض أقل',
    faqTitle:'الأسئلة الشائعة',
    footerDisc:'أختام MGI وعلامات الثقة هي معايير داخلية وخصائص للتحقق. وتُستخدم علامات الجهات الخارجية بشكل وصفي فقط دون أي دلالة على التأييد.'
  }
};

const sealItems = [
  ['Academic Excellence','Academic governance standard','التميّز الأكاديمي','معيار الحوكمة الأكاديمية'],
  ['Faculty Standard','Instructor excellence baseline','معيار الهيئة التدريبية','خط أساس جودة المدرب'],
  ['Curriculum Senate','Curriculum review and versioning','مجلس المناهج','مراجعة المناهج وإصداراتها'],
  ['Assessment Council','Assessment integrity standard','مجلس التقييم','معيار نزاهة التقييم'],
  ['Credential Integrity','Credential authenticity standard','نزاهة الشهادة','معيار أصالة الشهادات'],
  ['Honors Track','High-performance track standard','مسار التميّز','معيار المسار عالي الأداء'],
  ['Professional Ethics','Ethics and conduct standard','الأخلاقيات المهنية','معيار الأخلاقيات والسلوك'],
  ['Research-Informed','Applied research alignment','مرتكزات البحث التطبيقي','مواءمة مع البحث التطبيقي'],
  ['Capstone Approval','Capstone validation standard','اعتماد المشروع الختامي','تحقق المشروع الختامي'],
  ['Executive Delivery','Premium delivery standard','التنفيذ التنفيذي','معيار تقديم متميز'],
  ['Global Standards','Global professionalism baseline','المعايير العالمية','خط أساس المهنية العالمية'],
  ['Quality Assurance','QA checkpoints framework','ضمان الجودة','إطار نقاط فحص الجودة'],
  ['Strategic Leadership','Leadership competency framework','القيادة الاستراتيجية','إطار كفاءة القيادة'],
  ['Financial Excellence','Financial rigor benchmark','التميّز المالي','معيار الانضباط المالي'],
  ['Innovation & Technology','Innovation implementation standard','الابتكار والتقنية','معيار تطبيق الابتكار'],
  ['Corporate Governance','Governance and accountability model','الحوكمة المؤسسية','نموذج الحوكمة والمساءلة'],
  ['Risk & Compliance','Risk control and compliance standard','المخاطر والامتثال','معيار الضبط والامتثال'],
  ['Sustainable Finance','Sustainable decision standard','التمويل المستدام','معيار القرار المستدام'],
  ['Digital Transformation','Digital transition execution quality','التحول الرقمي','جودة تنفيذ التحول'],
  ['Professional Mastery','Advanced practitioner benchmark','الاحتراف المهني','معيار الممارسة المتقدمة'],
  ['Advanced Banking Studies','Advanced banking studies benchmark','الدراسات المصرفية المتقدمة','معيار الدراسات المتقدمة'],
  ['Global Business Strategy','Global strategy formulation standard','استراتيجية الأعمال العالمية','معيار صياغة الاستراتيجية']
];

const openTech = [
  ['Python','Used in labs'],['Project Jupyter','Used in workshops'],['TensorFlow','Used in delivery'],['PyTorch','Used in labs'],['Docker','Used in delivery'],['Kubernetes','Used in workshops'],['Git','Used in labs']
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

function createLaurels() {
  let left = '';
  let right = '';
  for (let i = 0; i < 12; i++) {
    const a = -68 + (i * 8.2);
    left += `<ellipse cx="36" cy="60" rx="3.7" ry="1.9" transform="rotate(${a} 36 60) translate(0 ${-i * 1.14})"/>`;
    right += `<ellipse cx="84" cy="60" rx="3.7" ry="1.9" transform="rotate(${-a} 84 60) translate(0 ${-i * 1.14})"/>`;
  }
  return `<g fill="none" stroke="#b99645" stroke-width="1.2">${left}${right}</g>`;
}

function sealSVG(label) {
  const ribbon = label.split(' ')[0].toUpperCase();
  return `<svg viewBox="0 0 180 180" class="seal-svg" aria-hidden="true"><circle cx="90" cy="90" r="82" fill="#fff" stroke="#b99645" stroke-width="1.6"/><circle cx="90" cy="90" r="72" fill="none" stroke="#b99645" stroke-width="1.2"/><circle cx="90" cy="90" r="58" fill="none" stroke="#b99645" stroke-width="1.1"/>${createLaurels()}<text x="90" y="40" text-anchor="middle" font-size="6.6" letter-spacing=".9" fill="#7e6323" font-family="Georgia">MGI EDUCATION • MIAMI GLOBAL INVESTMENTS GROUP LLC</text><text x="90" y="98" text-anchor="middle" font-size="28" fill="#7e6323" font-family="Georgia" font-weight="700">MGI</text><path d="M44 124 H136 L126 136 H54 Z" fill="none" stroke="#b99645" stroke-width="1.2"/><text x="90" y="132" text-anchor="middle" font-size="7" fill="#7e6323" font-family="Georgia" letter-spacing=".6">${ribbon}</text><path d="M74 108 L90 114 L106 108" fill="none" stroke="#b99645" stroke-width="1.1"/><polygon points="90,46 92.2,51 97.6,51 93.2,54.2 94.8,59.3 90,56.2 85.2,59.3 86.8,54.2 82.4,51 87.8,51" fill="none" stroke="#b99645" stroke-width="1"/></svg>`;
}

function techIcon(name){
  const s = '#2f3a46';
  if(name==='Python') return `<svg class="tech-icon" viewBox="0 0 24 24"><path d="M7 5h7a3 3 0 013 3v3H10a3 3 0 00-3 3v3H5a3 3 0 01-3-3V8a3 3 0 013-3h2z" fill="none" stroke="${s}" stroke-width="1.5"/><circle cx="9" cy="8" r="1" fill="${s}"/></svg>`;
  if(name==='Project Jupyter') return `<svg class="tech-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="${s}" stroke-width="1.5"/><path d="M3 12h3M18 12h3M12 3v3M12 18v3" stroke="${s}" stroke-width="1.5"/></svg>`;
  if(name==='TensorFlow') return `<svg class="tech-icon" viewBox="0 0 24 24"><path d="M4 6h16M8 6v12M16 6v12M8 12h8" fill="none" stroke="${s}" stroke-width="1.5"/></svg>`;
  if(name==='PyTorch') return `<svg class="tech-icon" viewBox="0 0 24 24"><path d="M12 4v8l5 5" fill="none" stroke="${s}" stroke-width="1.5"/><circle cx="12" cy="12" r="7" fill="none" stroke="${s}" stroke-width="1.5"/></svg>`;
  if(name==='Docker') return `<svg class="tech-icon" viewBox="0 0 24 24"><rect x="4" y="11" width="3" height="3" fill="none" stroke="${s}" stroke-width="1.3"/><rect x="8" y="11" width="3" height="3" fill="none" stroke="${s}" stroke-width="1.3"/><rect x="12" y="11" width="3" height="3" fill="none" stroke="${s}" stroke-width="1.3"/><path d="M4 16h10c3 0 5-2 6-4" fill="none" stroke="${s}" stroke-width="1.5"/></svg>`;
  if(name==='Kubernetes') return `<svg class="tech-icon" viewBox="0 0 24 24"><polygon points="12,3 20,8 20,16 12,21 4,16 4,8" fill="none" stroke="${s}" stroke-width="1.4"/><circle cx="12" cy="12" r="2.5" fill="none" stroke="${s}" stroke-width="1.4"/></svg>`;
  return `<svg class="tech-icon" viewBox="0 0 24 24"><path d="M5 4v16M9 8l10-4M9 16l10 4" fill="none" stroke="${s}" stroke-width="1.5"/></svg>`;
}

function markSVG(i){
  const set = [
    `<path d="M4 12h16M7 6l10 12M7 18L17 6"/>`,
    `<circle cx="12" cy="12" r="8"/><path d="M8 12h8"/>`,
    `<rect x="5" y="5" width="14" height="14" rx="3"/><path d="M8 12h8M12 8v8"/>`,
    `<path d="M4 12l8-8 8 8-8 8z"/>`,
    `<path d="M4 18h16M6 14l3-4 3 3 4-6 2 3"/>`
  ];
  return `<svg class="mark-icon" viewBox="0 0 24 24">${set[i % set.length]}</svg>`;
}

function render(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('trustLang',lang);
  document.querySelector('#langToggle').textContent = lang === 'ar' ? 'EN' : 'AR';
  document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = i18n[lang][el.dataset.i18n] || '');

  const seals=document.getElementById('sealGrid');
  seals.innerHTML=sealItems.map(([en,capEn,ar,capAr])=>`<article class="card seal-tile">${sealSVG(en)}<div class="seal-title">${lang==='ar'?ar:en}</div><div class="seal-cap">${lang==='ar'?capAr:capEn}</div></article>`).join('');

  const open=document.getElementById('openGrid');
  open.classList.add('collapsed');
  open.innerHTML=openTech.map(([name,cap])=>`<article class="card tech-tile"><div class="logo-spot">${techIcon(name)}</div><h3>${name}</h3><p class="seal-cap">${cap}</p></article>`).join('');

  const marksGrid=document.getElementById('marksGrid');
  marksGrid.classList.add('collapsed');
  marksGrid.innerHTML=marks.map((name,i)=>`<article class="card mark-item">${markSVG(i)}<div class="mark-label">${name}</div></article>`).join('');

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
