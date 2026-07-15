
    /* ── Self-disabling same-page links ─────────────────────────────────
       Document-level CAPTURE phase listener fires before any element
       handler. Handles clicks on child nodes inside links (icons, spans).
       Works on file://, http://, and https:// without any visual change.
    ─────────────────────────────────────────────────────────────────────── */
    (function () {
      var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      document.addEventListener('click', function (e) {
        var a = e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) {
          /* Fallback for older browsers — walk up the DOM manually */
          var el = e.target;
          while (el && el.tagName !== 'A') { el = el.parentElement; }
          a = (el && el.getAttribute('href')) ? el : null;
        }
        if (!a) return;
        var href = (a.getAttribute('href') || '').toLowerCase();
        href = href.split('?')[0].split('#')[0].replace(/^\.?\//, '');
        if (href === page) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true); /* true = capture phase — runs before ALL other handlers */
    })();


    /* ══ SipSavvy Video — Autoplay + Tap-to-Unmute ═══════════════════════
       VIDEO : starts immediately via <video autoplay muted> — guaranteed
               in Chrome, Firefox, Safari, Edge with zero user interaction.
       AUDIO : a one-tap "Tap for Sound" overlay button unmutes at 5%.
               All browsers block programmatic unmute on load; the overlay
               is the only standards-compliant way to activate audio.
    ════════════════════════════════════════════════════════════════════ */

    /* Called by the overlay button */
    function ssTapUnmute() {
      var vid = document.getElementById('drSipSavVideo');
      var btn = document.getElementById('ssUnmuteBtn');
      if (vid) { vid.muted = false; vid.volume = 0.05; }
      if (btn) {
        btn.style.opacity  = '0';
        btn.style.transform = 'scale(0.85)';
        setTimeout(function () { btn.style.display = 'none'; }, 400);
      }
    }

    (function () {
      var vid = document.getElementById('drSipSavVideo')
             || document.querySelector('.intro-video');
      if (!vid) return;

      /* Pre-set volume so it is ready when the button is tapped */
      vid.volume = 0.05;

      /* Pause when tab hidden, resume when tab shown */
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          vid.pause();
        } else {
          vid.play().catch(function () {});
        }
      });

      /* Resume on bfcache restore (back/forward navigation) */
      window.addEventListener('pageshow', function (e) {
        if (e.persisted) { vid.play().catch(function () {}); }
      });

    })();
