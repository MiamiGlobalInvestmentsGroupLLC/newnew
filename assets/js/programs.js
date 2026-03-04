(function () {
  function initAccordions() {
    document.querySelectorAll('.accordion-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        if (!content) return;
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        content.style.maxHeight = !open ? `${content.scrollHeight}px` : '0px';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAccordions);
})();
