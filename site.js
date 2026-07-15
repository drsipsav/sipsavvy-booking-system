/**
 * SipSavvy — site.js
 * Shared module: header behaviour, mobile nav, scroll-reveal,
 * smooth-scroll, newsletter, toast notifications, and global utilities.
 *
 * Load order (every page):
 *   <script src="js/site.js" defer></script>
 *   <script src="js/booking.js" defer></script>  ← booking.html only
 *   <script src="js/admin.js"   defer></script>  ← admin.html only
 *
 * Exposes: window.SS  (utility namespace used by other modules)
 */

'use strict';

/* ============================================================
   NAMESPACE — window.SS
   Public utilities referenced by booking.js and admin.js
   ============================================================ */
window.SS = window.SS || {};

/* ── Utility: format currency ─────────────────────────────── */
SS.formatCurrency = function (amount, symbol) {
  symbol = symbol || '$';
  return symbol + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/* ── Utility: generate booking reference ─────────────────── */
SS.generateRef = function () {
  const n = Math.floor(10000 + Math.random() * 90000);
  return 'SS-2026-' + String(n).padStart(5, '0');
};

/* ── Utility: clamp a number ─────────────────────────────── */
SS.clamp = function (val, min, max) {
  return Math.min(Math.max(val, min), max);
};

/* ── Utility: debounce ───────────────────────────────────── */
SS.debounce = function (fn, ms) {
  var timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, arguments), ms || 200);
  };
};

/* ── Utility: show a toast notification ─────────────────── */
SS.toast = function (message, type) {
  type = type || 'info'; // 'info' | 'success' | 'error' | 'warning'
  var container = document.getElementById('ss-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ss-toast-container';
    container.style.cssText = [
      'position:fixed', 'bottom:1.5rem', 'right:1.5rem',
      'z-index:9999', 'display:flex', 'flex-direction:column', 'gap:.5rem',
    ].join(';');
    document.body.appendChild(container);
  }

  var colours = {
    success: '#2E7D4F',
    error:   '#B91C1C',
    warning: '#92400E',
    info:    '#722F37',
  };
  var icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  var toast = document.createElement('div');
  toast.style.cssText = [
    'background:' + (colours[type] || colours.info),
    'color:#fff',
    'padding:.75rem 1.25rem',
    'border-radius:999px',
    'font-family:Inter,sans-serif',
    'font-size:.82rem',
    'font-weight:600',
    'box-shadow:0 4px 16px rgba(0,0,0,.18)',
    'display:flex',
    'align-items:center',
    'gap:.5rem',
    'animation:ss-fade-up .25s ease both',
    'max-width:20rem',
  ].join(';');
  toast.innerHTML = '<span>' + icons[type] + '</span>' + message;
  container.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all .25s ease';
    setTimeout(function () { toast.remove(); }, 300);
  }, 3200);
};

/* ============================================================
   HEADER — scroll shrink + transparency toggle
   Works on every page. Detects .site-header#siteHeader.
   ============================================================ */
(function initHeader() {
  var hdr = document.getElementById('siteHeader');
  if (!hdr) return;

  var SCROLL_THRESHOLD = 60;
  var isHero = document.body.classList.contains('page-hero');

  function onScroll() {
    var scrolled = window.scrollY > SCROLL_THRESHOLD;
    hdr.classList.toggle('is-scrolled', scrolled);
    if (isHero) {
      hdr.classList.toggle('is-transparent', !scrolled);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run immediately on load
})();

/* ============================================================
   MOBILE NAV — hamburger toggle + drawer
   ============================================================ */
(function initMobileNav() {
  var toggle  = document.getElementById('menuToggle');
  var mNav    = document.getElementById('mobileNav');
  var hdr     = document.getElementById('siteHeader');
  if (!toggle || !mNav) return;

  function openNav() {
    mNav.classList.add('is-open');
    if (hdr) hdr.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // animate drawer links in
    mNav.querySelectorAll('.mobile-nav-link').forEach(function (link, i) {
      link.style.animationDelay = (60 + i * 50) + 'ms';
    });
  }

  function closeNav() {
    mNav.classList.remove('is-open');
    if (hdr) hdr.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    mNav.classList.contains('is-open') ? closeNav() : openNav();
  });

  // Close on any link click
  mNav.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mNav.classList.contains('is-open')) closeNav();
  });

  // Close on backdrop click (if one exists)
  mNav.addEventListener('click', function (e) {
    if (e.target === mNav) closeNav();
  });

  // Expose for other modules
  SS.closeNav = closeNav;
})();

/* ============================================================
   SCROLL-REVEAL — IntersectionObserver for .reveal elements
   ============================================================ */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    document.querySelectorAll('.reveal, .reveal-left').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left').forEach(function (el) {
    io.observe(el);
  });
})();

/* ============================================================
   SMOOTH SCROLL — anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var id     = anchor.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    var hdr    = document.getElementById('siteHeader');
    var offset = hdr ? hdr.offsetHeight + 16 : 0;
    var top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
    // Update hash without jumping
    history.pushState(null, '', '#' + id);
  });
})();

/* ============================================================
   NEWSLETTER — inline form on index / homepage
   ============================================================ */
(function initNewsletter() {
  var form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn   = form.querySelector('button[type="submit"]');
    var input = form.querySelector('input[type="email"]');
    if (!input || !input.value) return;

    btn.textContent = '✓ Subscribed!';
    btn.style.background = 'var(--color-success, #2E7D4F)';
    btn.disabled = true;
    input.disabled = true;

    SS.toast('You\'re on the list! Check your inbox soon.', 'success');

    setTimeout(function () {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      btn.disabled = false;
      input.value = '';
      input.disabled = false;
    }, 4000);
  });
})();

/* ============================================================
   AWARD ITEMS — hover opacity (index page)
   ============================================================ */
(function initAwards() {
  document.querySelectorAll('.award-item').forEach(function (item) {
    item.addEventListener('mouseenter', function () { item.style.opacity = '1'; });
    item.addEventListener('mouseleave', function () { item.style.opacity = ''; });
  });
})();

/* ============================================================
   NAV DROPDOWN — keyboard accessibility
   ============================================================ */
(function initNavDropdowns() {
  document.querySelectorAll('.header-nav-item').forEach(function (item) {
    var link     = item.querySelector('.header-nav-link');
    var dropdown = item.querySelector('.nav-dropdown');
    if (!link || !dropdown) return;

    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');

    item.addEventListener('mouseenter', function () {
      link.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', function () {
      link.setAttribute('aria-expanded', 'false');
    });
    link.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var expanded = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', String(!expanded));
      }
    });
  });
})();

/* ============================================================
   ACTIVE NAV LINK — highlight current page
   ============================================================ */
(function initActiveNav() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.header-nav-link, .mobile-nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var name = href.split('/').pop().split('?')[0].split('#')[0];
    if (name && name === page) {
      link.classList.add('is-active');
    } else if (page === '' || page === 'index.html') {
      // Also check hash-only links on index
      if (href.startsWith('#') || name === 'index.html') {
        // Don't auto-mark — let CSS handle scroll-spy if needed
      }
    }
  });
})();

/* ============================================================
   PRINT HELPER — used on confirmation step
   ============================================================ */
SS.printPage = function () { window.print(); };

/* ============================================================
   DOM READY GUARD — fire deferred init if DOM already loaded
   ============================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    SS.ready = true;
  });
} else {
  SS.ready = true;
}
