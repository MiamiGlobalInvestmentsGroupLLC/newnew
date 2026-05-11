(function () {
  'use strict';

  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-up, .fade-in');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  function initFilterNav() {
    var filterBtns = document.querySelectorAll('.prog-filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var category = btn.getAttribute('data-filter');
        var sections = document.querySelectorAll('.course-category');

        sections.forEach(function (section) {
          if (category === 'all' || section.getAttribute('data-category') === category) {
            section.classList.remove('hidden-filter');
          } else {
            section.classList.add('hidden-filter');
          }
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initFilterNav();
  });
})();
