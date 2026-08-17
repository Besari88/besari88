/* =========================================================================
   AKE Personal — main.js
   Vanilla JS, pa librari, pa varesi te jashtme.
   Module: nav mobile, header scroll, reveal, akordeon, vende pune, formular.
   ========================================================================= */
(function () {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* Sinjalizo qe JS-i punon. CSS-i i fsheh elementet .reveal vetem kur kjo
     klase eshte e pranishme — pa JavaScript permbajtja mbetet e dukshme.
     Ekzekutohet menjehere (jo brenda DOMContentLoaded) qe te mos duket flash. */
  document.documentElement.classList.add('js');

  /* ---------- 1. Navigimi mobil ---------- */
  function initNav() {
    const toggle = $('.nav__toggle');
    const menu   = $('.nav__menu');
    if (!toggle || !menu) return;

    const close = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) { close(); return; }
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    });

    // Mbyll kur klikohet nje link ose Escape
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    // 1150 duhet te perputhet me breakpoint-in e menuse ne style.css
    window.addEventListener('resize', () => { if (window.innerWidth > 1150) close(); });
  }

  /* ---------- 2. Gjendja e header-it ne scroll ---------- */
  function initHeader() {
    const header = $('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 3. Link aktiv ne meny ---------- */
  function initActiveLink() {
    const path = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    $$('.nav__link').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;
      const target = new URL(href, location.origin + location.pathname).pathname
        .replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
      if (target === path) a.setAttribute('aria-current', 'page');
    });
  }

  /* ---------- 4. Reveal ne scroll ---------- */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    els.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- 5. Akordeoni (FAQ) ---------- */
  function initAccordion() {
    $$('.accordion__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.accordion__item');
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        item.classList.toggle('is-open', !open);
      });
    });
  }

  /* ---------- 6. Seksioni aktiv ne meny gjate scroll-it (faqja nje-faqeshe) ---------- */
  function initScrollSpy() {
    const links = $$('.nav__link[href*="#"]').filter((a) => {
      const h = a.getAttribute('href');
      return h.startsWith('#') || h.startsWith('index.html#');
    });
    if (!links.length || !('IntersectionObserver' in window)) return;

    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute('href').split('#')[1];
      const sec = id && document.getElementById(id);
      if (sec) map.set(sec, a);
    });
    if (!map.size) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const link = map.get(e.target);
        if (!link) return;
        if (e.isIntersecting) {
          links.forEach((l) => l.removeAttribute('aria-current'));
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    map.forEach((_, sec) => io.observe(sec));
  }

  /* ---------- 7. Formulari i kontaktit ---------- */
  function initForm() {
    const form = $('#contact-form');
    if (!form) return;

    const note   = $('#form-note');
    const submit = form.querySelector('[type="submit"]');

    const showNote = (type, msg) => {
      if (!note) return;
      note.className = 'form-note is-visible form-note--' + type;
      note.textContent = msg;
      note.setAttribute('role', 'status');
      note.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const setError = (field, msg) => {
      const box = field.closest('.field') || field.closest('.check');
      const out = box?.querySelector('.field__error');
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (out) out.textContent = msg || '';
      return !msg;
    };

    const validate = () => {
      let ok = true;
      form.querySelectorAll('[required]').forEach((f) => {
        let msg = '';
        if (f.type === 'checkbox') {
          if (!f.checked) msg = 'Bitte bestätigen Sie dieses Feld.';
        } else if (!f.value.trim()) {
          msg = 'Bitte füllen Sie dieses Feld aus.';
        } else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.value.trim())) {
          msg = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        } else if (f.type === 'tel' && !/^[\d\s+()/-]{6,}$/.test(f.value.trim())) {
          msg = 'Bitte geben Sie eine gültige Telefonnummer ein.';
        }
        if (!setError(f, msg)) ok = false;
      });
      return ok;
    };

    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target, '');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) {
        showNote('err', 'Bitte prüfen Sie die markierten Felder.');
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      const original = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Wird gesendet …';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        showNote('ok', 'Vielen Dank! Ihre Nachricht ist bei uns eingegangen. Wir melden uns in der Regel innerhalb von 24 Stunden.');
      } catch (err) {
        showNote('err', 'Die Nachricht konnte nicht gesendet werden. Bitte rufen Sie uns an oder schreiben Sie an info@ake-personal.de.');
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    });
  }

  /* ---------- 8. Viti aktual ne footer ---------- */
  function initYear() {
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initHeader();
    initActiveLink();
    initReveal();
    initAccordion();
    initScrollSpy();
    initForm();
    initYear();
  });
})();
