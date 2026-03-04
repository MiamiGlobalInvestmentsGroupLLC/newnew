(function () {
  // Switch between 'A' | 'B' | 'C'
  const ACTIVE_HERO_VARIANT = 'A';

  const CRED_EN = 'Registered participant in the Microsoft AI Cloud Partner Program (Partner ID: 7086941).';
  const CRED_AR = 'مشارك مسجّل في Microsoft AI Cloud Partner Program (Partner ID: 7086941).';

  const HERO_VARIANTS = {
    A: {
      badgeEn: 'Executive Cohort Enrollment Open',
      badgeAr: 'التسجيل مفتوح للدفعة التنفيذية',
      titleEn: 'Premium Professional Programs for Business, Banking, and High-Impact Careers',
      titleAr: 'برامج مهنية متميزة في الأعمال والبنوك ومسارات مهنية عالية الأثر',
      subEn: 'Built for ambitious professionals who want practical learning, premium delivery, and measurable outcomes.\nLive classes. Structured content. Immediate workplace value.',
      subAr: 'مصممة للمهنيين الطموحين الباحثين عن تعلم عملي وتقديم راقٍ ومخرجات قابلة للقياس.\nمحاضرات مباشرة، ومحتوى منظم، وقيمة مهنية فورية في بيئة العمل.',
      cta1En: 'Explore Programs',
      cta1Ar: 'استعرض البرامج',
      cta2En: 'Start Enrollment',
      cta2Ar: 'ابدأ التسجيل'
    },
    B: {
      badgeEn: 'Luxury Executive Learning — Miami',
      badgeAr: 'تعليم تنفيذي راقٍ — ميامي',
      titleEn: 'Advance Faster with Elite Bilingual Training Designed for Real Performance',
      titleAr: 'تقدّم أسرع عبر تدريب ثنائي اللغة بمستوى نخبة وموجّه للأداء الفعلي',
      subEn: 'MGI Education combines executive clarity with practical frameworks across business and finance tracks.\nA premium learning journey for professionals ready to lead confidently.',
      subAr: 'يجمع MGI Education بين الوضوح التنفيذي والأطر العملية عبر مسارات الأعمال والتمويل.\nرحلة تعليمية متميزة للمهنيين المستعدين للقيادة بثقة.',
      cta1En: 'View Premium Tracks',
      cta1Ar: 'عرض المسارات المتميزة',
      cta2En: 'Secure Your Seat',
      cta2Ar: 'احجز مقعدك'
    },
    C: {
      badgeEn: 'High-Demand Live Batches',
      badgeAr: 'دفعات مباشرة عالية الطلب',
      titleEn: 'From Skills to Results: Executive Programs that Strengthen Your Professional Position',
      titleAr: 'من المهارات إلى النتائج: برامج تنفيذية تعزّز موقعك المهني',
      subEn: 'Join carefully structured live cohorts with clear progression, mentor support, and certificate-backed credibility.\nDesigned for professionals who value quality and speed.',
      subAr: 'انضم إلى دفعات مباشرة منظمة بعناية مع تقدم واضح ودعم تدريبي ومصداقية مدعومة بالشهادة.\nمصممة للمهنيين الذين يقدّرون الجودة وسرعة الإنجاز.',
      cta1En: 'Compare Programs',
      cta1Ar: 'قارن البرامج',
      cta2En: 'Enroll Today',
      cta2Ar: 'سجّل اليوم'
    }
  };

  function applyHero() {
    const lang = window.SiteI18n ? window.SiteI18n.getLang() : 'en';
    const v = HERO_VARIANTS[ACTIVE_HERO_VARIANT] || HERO_VARIANTS.A;
    const isAr = lang === 'ar';

    const badge = document.getElementById('hero-badge');
    const title = document.getElementById('hero-title');
    const sub = document.getElementById('hero-subtitle');
    const cred = document.getElementById('hero-cred');
    const cta1 = document.getElementById('hero-cta-primary');
    const cta2 = document.getElementById('hero-cta-secondary');
    if (!badge || !title || !sub || !cred || !cta1 || !cta2) return;

    badge.textContent = isAr ? v.badgeAr : v.badgeEn;
    title.textContent = isAr ? v.titleAr : v.titleEn;
    sub.textContent = isAr ? v.subAr : v.subEn;
    cred.textContent = isAr ? CRED_AR : CRED_EN;
    cta1.textContent = isAr ? v.cta1Ar : v.cta1En;
    cta2.textContent = isAr ? v.cta2Ar : v.cta2En;
  }

  document.addEventListener('DOMContentLoaded', applyHero);
  document.addEventListener('languageChanged', applyHero);
})();
