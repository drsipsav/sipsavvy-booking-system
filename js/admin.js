/**
 * SipSavvy — admin.js
 * Admin dashboard: bookings table (render/filter/sort/pagination),
 * booking detail drawer, KPI sparklines, revenue bar chart, donut chart,
 * activity feed, upcoming events list, page router, sidebar collapse,
 * and period tab toggle.
 *
 * Dependencies: site.js is NOT required on admin.html (no shared header).
 * Load order in admin.html:
 *   <script src="js/admin.js" defer></script>
 */

'use strict';

/* ============================================================
   BOOKING DATA
   ============================================================ */
var BOOKINGS = [
  { ref: 'SS-2026-00142', guest: 'Amanda Mitchell',  exp: 'Vineyard Sunset Tasting',    date: 'Sat 10 May 2026', guests: 4, total: 340,  status: 'confirmed' },
  { ref: 'SS-2026-00141', guest: 'James Rodriguez',  exp: 'Cellar Reserve Experience',  date: 'Sat 10 May 2026', guests: 2, total: 290,  status: 'confirmed' },
  { ref: 'SS-2026-00140', guest: 'Sofia Patel',      exp: 'Harvest Blending Session',   date: 'Sun 11 May 2026', guests: 6, total: 1350, status: 'pending'   },
  { ref: 'SS-2026-00139', guest: 'Chris Kamau',      exp: "Winemaker's Table",          date: 'Thu 8 May 2026',  guests: 2, total: 390,  status: 'confirmed' },
  { ref: 'SS-2026-00138', guest: 'Lily Okonkwo',     exp: 'Vineyard Sunset Tasting',    date: 'Thu 8 May 2026',  guests: 3, total: 255,  status: 'confirmed' },
  { ref: 'SS-2026-00137', guest: 'Marcus Webb',      exp: 'Cellar Reserve Experience',  date: 'Fri 9 May 2026',  guests: 2, total: 290,  status: 'pending'   },
  { ref: 'SS-2026-00136', guest: 'Priya Sharma',     exp: 'Vineyard Sunset Tasting',    date: 'Fri 9 May 2026',  guests: 5, total: 425,  status: 'confirmed' },
  { ref: 'SS-2026-00135', guest: 'Daniel Nguyen',    exp: "Winemaker's Table",          date: 'Wed 7 May 2026',  guests: 4, total: 780,  status: 'completed' },
  { ref: 'SS-2026-00134', guest: 'Rachel Torres',    exp: 'Cellar Reserve Experience',  date: 'Wed 7 May 2026',  guests: 2, total: 290,  status: 'completed' },
  { ref: 'SS-2026-00133', guest: 'Tom Blackwell',    exp: 'Harvest Blending Session',   date: 'Tue 6 May 2026',  guests: 2, total: 450,  status: 'cancelled' },
];

/* ── Status badge HTML map ─────────────────────────────────── */
var STATUS_HTML = {
  confirmed: '<span class="status-badge status-confirmed">Confirmed</span>',
  pending:   '<span class="status-badge status-pending">Pending</span>',
  cancelled: '<span class="status-badge status-cancelled">Cancelled</span>',
  completed: '<span class="status-badge status-completed">Completed</span>',
};

/* ── Pagination state ─────────────────────────────────────── */
var tableState = {
  query:      '',
  sortCol:    -1,
  sortDesc:   false,
  page:       1,
  perPage:    10,
  filtered:   BOOKINGS.slice(),
};

/* ============================================================
   TABLE — render, filter, sort, pagination
   ============================================================ */

/**
 * renderTable — paint rows into tbody.
 * @param {Array}  data   - subset of BOOKINGS to display
 * @param {string} bodyId - id of the <tbody> element (default: 'tableBody')
 */
function renderTable(data, bodyId) {
  var tbody = document.getElementById(bodyId || 'tableBody');
  if (!tbody) return;

  if (!data || data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="9" style="text-align:center;padding:2rem;' +
      'color:var(--color-muted);font-size:.9rem;">No bookings match your search.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(function (b, rowIdx) {
    var globalIdx = BOOKINGS.indexOf(b);
    return [
      '<tr>',
      '  <td><input type="checkbox" class="form-check-input" style="margin:0;"></td>',
      '  <td><code style="font-size:.75rem;color:var(--color-wine);">' + b.ref + '</code></td>',
      '  <td><strong>' + escHtml(b.guest) + '</strong></td>',
      '  <td style="max-width:11rem;white-space:normal;font-size:.82rem;">' + escHtml(b.exp) + '</td>',
      '  <td style="font-size:.82rem;">' + escHtml(b.date) + '</td>',
      '  <td style="text-align:center;">' + b.guests + '</td>',
      '  <td style="font-weight:600;">$' + b.total.toLocaleString() + '</td>',
      '  <td>' + (STATUS_HTML[b.status] || b.status) + '</td>',
      '  <td>',
      '    <div class="data-table-row-actions">',
      '      <button class="data-table-action-btn" title="View" onclick="openDrawer(' + globalIdx + ')">👁</button>',
      '      <button class="data-table-action-btn" title="Email" onclick="adminToast(\'Email sent to ' + escHtml(b.guest) + '\',\'info\')">✉</button>',
      '      <button class="data-table-action-btn danger" title="Cancel" onclick="confirmCancel(\'' + b.ref + '\',' + globalIdx + ')">✕</button>',
      '    </div>',
      '  </td>',
      '</tr>',
    ].join('\n');
  }).join('');
}

/** Escape HTML special chars for safe injection into innerHTML */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * filterTable — live search across ref, guest name, experience.
 * Exposed globally for oninput="filterTable(this.value)".
 */
function filterTable(q) {
  tableState.query   = (q || '').toLowerCase();
  tableState.page    = 1;
  tableState.filtered = BOOKINGS.filter(function (b) {
    return (
      b.ref.toLowerCase().includes(tableState.query) ||
      b.guest.toLowerCase().includes(tableState.query) ||
      b.exp.toLowerCase().includes(tableState.query)
    );
  });
  renderTable(tableState.filtered);
  updateTableCount();
}

/** updateTableCount — update the "Showing X of Y" label. */
function updateTableCount() {
  var el = document.getElementById('tableCount');
  if (el) {
    el.textContent = 'Showing ' + tableState.filtered.length + ' of ' + BOOKINGS.length + ' bookings';
  }
}

/**
 * toggleAll — select / deselect all visible checkboxes.
 * Exposed globally for onchange="toggleAll(this)".
 */
function toggleAll(cb) {
  document.querySelectorAll('#tableBody input[type=checkbox], #tableBody2 input[type=checkbox]')
    .forEach(function (c) { c.checked = cb.checked; });
}

/**
 * sortTable — single-column ascending sort; second click reverses.
 * @param {number} col — 0-based column index
 */
function sortTable(col) {
  // Toggle direction if same column
  if (tableState.sortCol === col) {
    tableState.sortDesc = !tableState.sortDesc;
  } else {
    tableState.sortCol  = col;
    tableState.sortDesc = false;
  }

  // Update header indicators
  document.querySelectorAll('.data-table th').forEach(function (th, i) {
    th.classList.remove('is-sorted', 'is-sorted-desc');
    if (i === col) {
      th.classList.add('is-sorted');
      if (tableState.sortDesc) th.classList.add('is-sorted-desc');
    }
  });

  // Sort filtered data
  var colKeys = [null, 'ref', 'guest', 'exp', 'date', 'guests', 'total', 'status'];
  var key     = colKeys[col];
  if (!key) return;

  tableState.filtered.sort(function (a, b) {
    var av = a[key], bv = b[key];
    if (typeof av === 'number') {
      return tableState.sortDesc ? bv - av : av - bv;
    }
    var cmp = String(av).localeCompare(String(bv));
    return tableState.sortDesc ? -cmp : cmp;
  });

  renderTable(tableState.filtered);
}

/* ============================================================
   BOOKING DETAIL DRAWER
   ============================================================ */

/**
 * openDrawer — populate and show the booking detail side drawer.
 * @param {number} idx — index in global BOOKINGS array
 */
function openDrawer(idx) {
  var b = BOOKINGS[idx];
  if (!b) return;

  var titleEl  = document.getElementById('drawerTitle');
  var statusEl = document.getElementById('drawerStatus');
  var bodyEl   = document.getElementById('drawerBody');

  if (titleEl)  titleEl.textContent = b.ref;
  if (statusEl) {
    statusEl.className   = 'status-badge status-' + b.status;
    statusEl.textContent = b.status.charAt(0).toUpperCase() + b.status.slice(1);
  }

  if (bodyEl) {
    bodyEl.innerHTML = [
      '<div class="form" style="gap:1rem;">',
      '  <div class="form-field">',
      '    <label class="form-label">Guest Name</label>',
      '    <input class="form-input" value="' + escHtml(b.guest) + '">',
      '  </div>',
      '  <div class="form-row">',
      '    <div class="form-field">',
      '      <label class="form-label">Experience</label>',
      '      <input class="form-input" value="' + escHtml(b.exp) + '">',
      '    </div>',
      '    <div class="form-field">',
      '      <label class="form-label">Date</label>',
      '      <input class="form-input" value="' + escHtml(b.date) + '">',
      '    </div>',
      '  </div>',
      '  <div class="form-row">',
      '    <div class="form-field">',
      '      <label class="form-label">Guests</label>',
      '      <input class="form-input" type="number" value="' + b.guests + '" min="1" max="12">',
      '    </div>',
      '    <div class="form-field">',
      '      <label class="form-label">Total</label>',
      '      <input class="form-input" value="$' + b.total.toLocaleString() + '" readonly>',
      '    </div>',
      '  </div>',
      '  <div class="form-field">',
      '    <label class="form-label">Status</label>',
      '    <select class="form-select">',
      '      <option' + (b.status === 'confirmed'  ? ' selected' : '') + '>confirmed</option>',
      '      <option' + (b.status === 'pending'    ? ' selected' : '') + '>pending</option>',
      '      <option' + (b.status === 'completed'  ? ' selected' : '') + '>completed</option>',
      '      <option' + (b.status === 'cancelled'  ? ' selected' : '') + '>cancelled</option>',
      '    </select>',
      '  </div>',
      '  <div class="form-field">',
      '    <label class="form-label">Internal Notes</label>',
      '    <textarea class="form-textarea" rows="3" placeholder="Add notes for this booking…"></textarea>',
      '  </div>',
      '  <div style="display:flex;gap:.75rem;margin-top:.5rem;">',
      '    <button class="btn btn-primary" onclick="adminToast(\'Changes saved\',\'success\');closeDrawer()">Save Changes</button>',
      '    <button class="btn btn-secondary" onclick="closeDrawer()">Cancel</button>',
      '  </div>',
      '</div>',
    ].join('\n');
  }

  var drawer = document.getElementById('drawer');
  if (drawer) drawer.style.display = '';
  document.body.style.overflow = 'hidden';
}

/**
 * closeDrawer — hide the booking detail drawer.
 * Exposed globally for onclick="closeDrawer()".
 */
function closeDrawer() {
  var drawer = document.getElementById('drawer');
  if (drawer) drawer.style.display = 'none';
  document.body.style.overflow = '';
}

/**
 * confirmCancel — prompt before soft-cancelling a booking.
 * Exposed globally for onclick in renderTable.
 */
function confirmCancel(ref, idx) {
  if (window.confirm('Cancel booking ' + ref + '? This cannot be undone.')) {
    BOOKINGS[idx].status = 'cancelled';
    renderTable(tableState.filtered);
    adminToast('Booking ' + ref + ' cancelled.', 'error');
  }
}

/* ============================================================
   PAGE ROUTER — sidebar navigation
   ============================================================ */

var PAGE_IDS = [
  'dashboard', 'bookings', 'experiences',
  'guests', 'revenue', 'calendar', 'reviews', 'settings',
];

/**
 * setPage — show the named sub-page, hide all others.
 * Exposed globally for onclick="setPage('bookings', this)".
 */
function setPage(name, link) {
  PAGE_IDS.forEach(function (p) {
    var el = document.getElementById('page-' + p);
    if (el) el.style.display = p === name ? '' : 'none';
  });

  document.querySelectorAll('.admin-nav-link').forEach(function (l) {
    l.classList.remove('is-active');
  });
  if (link) link.classList.add('is-active');

  var breadcrumb = document.getElementById('breadcrumbCurrent');
  if (breadcrumb) {
    breadcrumb.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Render the bookings table in the Bookings sub-page
  if (name === 'bookings') {
    renderTable(BOOKINGS, 'tableBody2');
  }

  var content = document.getElementById('adminContent');
  if (content) content.scrollTop = 0;
}

/* ============================================================
   SIDEBAR — collapse / expand
   ============================================================ */

/**
 * toggleSidebar — collapse or expand the admin sidebar.
 * Exposed globally for onclick="toggleSidebar()".
 */
function toggleSidebar() {
  var sidebar = document.getElementById('adminSidebar');
  if (sidebar) sidebar.classList.toggle('is-collapsed');
}

/* ============================================================
   SPARKLINES — KPI card mini bar charts
   ============================================================ */

/**
 * renderSparkline — builds a mini bar chart from a data array.
 * @param {string} id        - element ID to render into
 * @param {number[]} data    - array of numeric values
 * @param {string} peakColor - CSS colour for the tallest bar (optional)
 */
function renderSparkline(id, data, peakColor) {
  var el = document.getElementById(id);
  if (!el) return;

  var max    = Math.max.apply(null, data);
  var peakIdx = data.indexOf(max);

  el.innerHTML = data.map(function (v, i) {
    var heightPct = Math.max(15, Math.round((v / max) * 100));
    var isPeak    = i === peakIdx;
    var cls       = 'sparkline-bar' + (isPeak ? ' peak' : '');
    var style     = 'height:' + heightPct + '%;';
    if (isPeak && peakColor) style += 'background:' + peakColor + ';';
    return '<div class="' + cls + '" style="' + style + '"></div>';
  }).join('');
}

// KPI sparkline data — trailing 12 data-points per metric
renderSparkline('spark1', [88, 95, 102, 98, 110, 125, 118, 130, 142, 138, 145, 142]);
renderSparkline('spark2', [15200, 17800, 19200, 18100, 21400, 23800, 22100, 25200, 24380, 26100, 25800, 24380]);
renderSparkline('spark3', [310, 328, 355, 342, 380, 420, 408, 445, 4219, 462, 470, 4219]);
renderSparkline('spark4', [4.82, 4.85, 4.84, 4.87, 4.86, 4.89, 4.88, 4.90, 4.91, 4.90, 4.91, 4.91]);

/* ============================================================
   REVENUE BAR CHART (SVG-style div bars)
   ============================================================ */
(function renderRevenueChart() {
  var months  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  var rev     = [18200, 21400, 19800, 22900, 24380, null];
  var target  = [20000, 20000, 20000, 22000, 22000, 22000];
  var max     = 26000;
  var wrap    = document.getElementById('revenueChart');
  if (!wrap) return;

  var H = 208;
  wrap.style.height = H + 'px';

  wrap.innerHTML = months.map(function (m, i) {
    var h  = rev[i] ? Math.round((rev[i] / max) * H * 0.88) : 0;
    var th = Math.round((target[i] / max) * H * 0.88);

    var actualBar = rev[i]
      ? '<div class="chart-bar" style="flex:1;height:' + h + 'px;background:var(--color-wine);' +
        'border-radius:4px 4px 0 0;animation-delay:' + (i * 80) + 'ms;" title="$' + rev[i].toLocaleString() + '"></div>'
      : '<div style="flex:1;background:var(--color-border-light);border-radius:4px 4px 0 0;height:4px;"></div>';

    var targetBar =
      '<div class="chart-bar" style="flex:.6;height:' + th + 'px;background:var(--color-gold-light);' +
      'border-radius:4px 4px 0 0;opacity:.6;animation-delay:' + (i * 80 + 40) + 'ms;" ' +
      'title="Target: $' + target[i].toLocaleString() + '"></div>';

    var label =
      '<div style="font-size:.65rem;color:var(--color-muted);font-weight:500;">' + m + '</div>';

    var value = rev[i]
      ? '<div style="font-size:.6rem;color:var(--color-wine);font-weight:600;">$' + (rev[i] / 1000).toFixed(1) + 'k</div>'
      : '<div style="font-size:.6rem;color:var(--color-border);">—</div>';

    return [
      '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;height:100%;">',
      '  <div style="flex:1;display:flex;align-items:flex-end;gap:3px;width:100%;">',
      '    ' + actualBar,
      '    ' + targetBar,
      '  </div>',
      '  ' + label,
      '  ' + value,
      '</div>',
    ].join('\n');
  }).join('');
})();

/* ============================================================
   DONUT CHART — bookings by experience
   ============================================================ */
(function renderDonutChart() {
  var wrap = document.getElementById('donutChart');
  if (!wrap) return;

  var slices = [
    { label: 'Sunset Tasting',    pct: 38, color: 'var(--color-wine)'       },
    { label: 'Cellar Reserve',    pct: 27, color: 'var(--color-wine-light)' },
    { label: "Winemaker's Table", pct: 20, color: 'var(--color-gold)'       },
    { label: 'Harvest Blending',  pct: 15, color: 'var(--color-charcoal)'   },
  ];

  // Build conic-gradient
  var stops = [];
  var acc   = 0;
  slices.forEach(function (s) {
    stops.push(s.color + ' ' + acc + '% ' + (acc + s.pct) + '%');
    acc += s.pct;
  });

  var donutEl = wrap.querySelector('.donut-ring, .donut');
  if (donutEl) {
    donutEl.style.background = 'conic-gradient(' + stops.join(', ') + ')';
  }

  // Build legend
  var legendEl = wrap.querySelector('.donut-legend, .chart-legend');
  if (legendEl) {
    legendEl.innerHTML = slices.map(function (s) {
      return [
        '<div class="chart-legend-item" style="display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:var(--color-ink);">',
        '  <span style="width:10px;height:10px;border-radius:2px;background:' + s.color + ';flex-shrink:0;display:inline-block;"></span>',
        '  <span>' + s.label + '</span>',
        '  <span style="margin-left:auto;font-weight:600;color:var(--color-charcoal);">' + s.pct + '%</span>',
        '</div>',
      ].join('');
    }).join('');
  }
})();

/* ============================================================
   ACTIVITY FEED
   ============================================================ */
(function renderActivityFeed() {
  var el = document.getElementById('activityFeed');
  if (!el) return;

  var activities = [
    { icon: '📅', color: 'var(--color-success)', text: '<strong>New booking</strong> — Amanda Mitchell, Sunset Tasting',        time: '2 min ago'  },
    { icon: '💳', color: 'var(--color-wine)',     text: '<strong>Payment received</strong> — $390 from Chris Kamau',            time: '18 min ago' },
    { icon: '⭐', color: 'var(--color-gold)',     text: '<strong>New review</strong> — 5 stars from Sofia Patel',              time: '1 hr ago'   },
    { icon: '✉️', color: 'var(--color-info)',     text: '<strong>Email sent</strong> — Confirmation to James Rodriguez',       time: '2 hr ago'   },
    { icon: '↩️', color: 'var(--color-error)',    text: '<strong>Cancellation</strong> — Tom Blackwell, Harvest Session',      time: '4 hr ago'   },
    { icon: '📅', color: 'var(--color-success)', text: '<strong>New booking</strong> — Priya Sharma, Sunset Tasting ×5',      time: '5 hr ago'   },
  ];

  el.innerHTML = activities.map(function (a) {
    return [
      '<div style="display:flex;gap:.75rem;padding:.6rem 0;border-bottom:1px solid var(--color-border-light);">',
      '  <div style="font-size:1rem;flex-shrink:0;margin-top:.1rem;">' + a.icon + '</div>',
      '  <div style="flex:1;">',
      '    <p style="font-size:.8rem;color:var(--color-ink);line-height:1.4;">' + a.text + '</p>',
      '    <p style="font-size:.7rem;color:var(--color-muted);margin-top:.15rem;">' + a.time + '</p>',
      '  </div>',
      '</div>',
    ].join('');
  }).join('');
})();

/* ============================================================
   UPCOMING EVENTS LIST
   ============================================================ */
(function renderUpcomingList() {
  var el = document.getElementById('upcomingList');
  if (!el) return;

  var STATUS_HTML_LOCAL = {
    confirmed: '<span class="status-badge status-confirmed">Confirmed</span>',
    pending:   '<span class="status-badge status-pending">Pending</span>',
  };

  var upcoming = [
    { day: 'Today',     date: 'Thu 7 May', exp: "Winemaker's Table",  guests: 4, time: '7:00 PM', status: 'confirmed' },
    { day: 'Today',     date: 'Thu 7 May', exp: 'Vineyard Sunset',    guests: 3, time: '5:30 PM', status: 'confirmed' },
    { day: 'Fri 8 May', date: '',          exp: 'Cellar Reserve',     guests: 2, time: '2:00 PM', status: 'pending'   },
    { day: 'Fri 8 May', date: '',          exp: 'Vineyard Sunset',    guests: 5, time: '5:30 PM', status: 'confirmed' },
    { day: 'Sat 9 May', date: '',          exp: 'Sunset Tasting',     guests: 4, time: '5:30 PM', status: 'confirmed' },
  ];

  el.innerHTML = upcoming.map(function (u) {
    return [
      '<div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 1.5rem;border-bottom:1px solid var(--color-border-light);">',
      '  <div style="flex-shrink:0;width:3rem;text-align:center;">',
      '    <p style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--color-muted);">' + u.day + '</p>',
      '    <p style="font-size:.75rem;font-weight:600;color:var(--color-wine);">' + u.time + '</p>',
      '  </div>',
      '  <div style="flex:1;min-width:0;">',
      '    <p style="font-size:.82rem;font-weight:600;color:var(--color-charcoal);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + u.exp + '</p>',
      '    <p style="font-size:.72rem;color:var(--color-muted);">' + u.guests + ' guests</p>',
      '  </div>',
      '  ' + (STATUS_HTML_LOCAL[u.status] || ''),
      '</div>',
    ].join('');
  }).join('');
})();

/* ============================================================
   CHART PERIOD TABS
   ============================================================ */
(function initPeriodTabs() {
  document.querySelectorAll('.chart-period-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var siblings = tab.closest('.chart-card-period-tabs');
      if (siblings) {
        siblings.querySelectorAll('.chart-period-tab').forEach(function (t) {
          t.classList.remove('is-active');
        });
      }
      tab.classList.add('is-active');
    });
  });
})();

/* ============================================================
   DRAWER — close on backdrop click / Escape key
   ============================================================ */
(function initDrawerDismiss() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  var overlay = document.getElementById('drawerOverlay');
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }
})();

/* ============================================================
   TOAST NOTIFICATIONS (admin-scoped, no dependency on site.js)
   ============================================================ */

/**
 * adminToast — show a brief notification toast.
 * @param {string} msg  - message text
 * @param {string} type - 'success' | 'error' | 'info' | 'warning'
 */
function adminToast(msg, type) {
  type = type || 'info';
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

  var colours = { success: '#2E7D4F', error: '#B91C1C', warning: '#92400E', info: '#722F37' };
  var icons   = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

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
    'max-width:20rem',
    'transition:opacity .25s,transform .25s',
  ].join(';');
  toast.innerHTML = '<span>' + (icons[type] || icons.info) + '</span>' + msg;
  container.appendChild(toast);

  setTimeout(function () {
    toast.style.opacity  = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(function () { toast.remove(); }, 300);
  }, 3200);
}

/* ============================================================
   INITIALISATION — runs on DOMContentLoaded
   ============================================================ */
function adminInit() {
  // Render the main dashboard bookings table
  renderTable(BOOKINGS);
  updateTableCount();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', adminInit);
} else {
  adminInit();
}

/* ── Expose public API ─────────────────────────────────────── */
// All functions called via onclick="" attrs must be on window.
window.renderTable    = renderTable;
window.filterTable    = filterTable;
window.toggleAll      = toggleAll;
window.sortTable      = sortTable;
window.openDrawer     = openDrawer;
window.closeDrawer    = closeDrawer;
window.confirmCancel  = confirmCancel;
window.setPage        = setPage;
window.toggleSidebar  = toggleSidebar;
window.renderSparkline = renderSparkline;
window.adminToast     = adminToast;
