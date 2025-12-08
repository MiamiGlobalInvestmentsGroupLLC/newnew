// Set current year
const yearEls = document.querySelectorAll('#y');
yearEls.forEach((el) => (el.textContent = new Date().getFullYear()));

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!question || !answer) return;

  question.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    question.setAttribute('aria-expanded', String(isOpen));
    answer.hidden = !isOpen;
  });
});

// Contact form (frontend only)
const form = document.getElementById('contactForm');
if (form) {
  const formMsg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submitBtn) submitBtn.disabled = true;
    if (formMsg) formMsg.textContent = 'Sending...';

    // Simulate async submission
    setTimeout(() => {
      if (formMsg) formMsg.textContent = 'Thanks! Matt will reach out shortly to confirm your lanes and equipment.';
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
    }, 400);
  });
}
