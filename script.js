// Set current year in footer
(function setYear(){
  document.querySelectorAll('#y').forEach(el => { el.textContent = new Date().getFullYear(); });
})();

// Mobile nav toggle
(function mobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();

// Simple contact form handler (client-side only)
(function contactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const msg = document.getElementById('formMsg');
  const btn = document.getElementById('submitBtn');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!btn || !msg) return;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email) {
      msg.textContent = 'Please provide your name and email so our Dispatch Sales Team can respond.';
      return;
    }
    btn.disabled = true;
    msg.textContent = 'Thank you. Our Dispatch Sales Team will reach out shortly.';
    setTimeout(() => {
      btn.disabled = false;
      form.reset();
    }, 1500);
  });
})();
