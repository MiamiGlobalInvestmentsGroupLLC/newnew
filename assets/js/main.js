(function () {
  function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function initWhatsapp() {
    const link = document.getElementById('whatsapp-float');
    if (!link) return;
    const update = () => {
      const lang = window.SiteI18n ? window.SiteI18n.getLang() : 'en';
      const msg = lang === 'ar'
        ? 'مرحباً، أرغب في الاستفسار عن البرامج التنفيذية المباشرة في التغذية والتسويق والأعمال والتقنية وغيرها. يرجى تزويدي بالتفاصيل والجدول الزمني.'
        : 'Hello, I’m interested in your executive programs in business, finance, marketing, and nutrition. Please share details and schedule.';
      link.href = `https://wa.me/13056290491?text=${encodeURIComponent(msg)}`;
      link.setAttribute('aria-label', lang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp');
    };
    update();
    document.addEventListener('languageChanged', update);
  }

  function initLocalScheduleHint() {
    const node = document.querySelector('[data-local-time]');
    if (!node) return;
    const update = () => {
      const lang = window.SiteI18n ? window.SiteI18n.getLang() : 'en';
      const start = new Date('2026-03-25T14:30:00-04:00');
      const end = new Date('2026-03-25T16:30:00-04:00');
      const fmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local time';
      const text = `${fmt.format(start)} – ${fmt.format(end)}`;
      node.textContent = lang === 'ar'
        ? `التوقيت المحلي الحالي (${zone}): ${text}`
        : `Your detected local schedule (${zone}): ${text}`;
    };
    update();
    document.addEventListener('languageChanged', update);
  }

  function initYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent('Program Inquiry - MGI Education');
      const body = encodeURIComponent(
        `Name: ${data.get('name') || ''}\nCompany: ${data.get('company') || ''}\nEmail: ${data.get('email') || ''}\nPhone: ${data.get('phone') || ''}\n\nMessage:\n${data.get('message') || ''}`
      );
      window.location.href = `mailto:info@miamiglobalgroup.com?subject=${subject}&body=${body}`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initWhatsapp();
    initLocalScheduleHint();
    initYear();
    initContactForm();
  });
})();
