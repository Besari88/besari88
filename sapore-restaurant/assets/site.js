/* Sapore – small replacement for the Hostinger Builder runtime */
(function () {
  // 1. Scroll animations (same CSS classes the builder used)
  var targets = [];
  document.querySelectorAll('.transition').forEach(function (el) {
    if (el.classList.contains('transition--root-hidden')) {
      el.querySelectorAll('[data-animation-role]').forEach(function (c) { targets.push(c); });
    } else { targets.push(el); }
  });
  document.querySelectorAll('[data-animation-role="image"] img, img[data-animation-role="image"]').forEach(function (img) {
    var holder = img.closest('[data-animation-role="image"]');
    function done() { holder.classList.add('loaded'); }
    if (img.complete) done(); else { img.addEventListener('load', done); img.addEventListener('error', done); }
  });
  function activate(el) { el.setAttribute('data-animation-state', 'active'); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { activate(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -5% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else { targets.forEach(activate); }

  // 2. Mobile burger menu
  document.querySelectorAll('.block-header__hamburger-menu').forEach(function (btn) {
    var dd = btn.parentElement.querySelector('.block-header-layout-mobile__dropdown');
    btn.addEventListener('click', function () {
      btn.classList.toggle('burger--open');
      if (dd) dd.classList.toggle('block-header-layout-mobile__dropdown--open');
    });
  });

  // 3. Contact / reservation forms -> opens the visitor's e-mail app
  document.querySelectorAll('form.form__control').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = f.querySelectorAll('input, textarea'), lines = [], ok = true;
      fields.forEach(function (i) {
        var label = (i.labels && i.labels[0] ? i.labels[0].textContent : i.id).replace('*', '').trim();
        if (!i.value.trim()) ok = false;
        lines.push(label + ': ' + i.value);
      });
      if (!ok) { (f.querySelector('input,textarea')).reportValidity && fields.forEach(function (i) { i.required = true; }); f.reportValidity(); return; }
      location.href = 'mailto:reserve@sapore-restaurant.fr?subject=' +
        encodeURIComponent(f.getAttribute('name') || 'Sapore') + '&body=' + encodeURIComponent(lines.join('\n'));
    });
  });
})();
