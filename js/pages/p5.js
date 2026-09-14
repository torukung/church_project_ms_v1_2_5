/* pages/p5.js — P5 Timeline, route #/timeline (build-plan item 6, v1.0.1 item 8).
   The cross-project Gantt: one row per project in the signed-in user's scope,
   grouped by country, status or owner, in the same visual grammar as the C-06
   mini chart on P3 and P4 — pill bars, month grid, one rose line for today —
   so nobody has to learn a second chart.

   v1.0.1: the balloons are live. A user who may edit the record drags a phase
   balloon (or the target-date diamond) along its row; the drag snaps to whole
   days against the same scale the chart is drawn on, a tooltip carries the live
   date, and the drop writes back through A.projectUpdate — which appends the
   system log line. Clicking a balloon selects it instead, and a small tray under
   the row offers ← / → one-day nudges and a Done dismiss, so the whole feature
   is reachable without a pointer. Viewers and out-of-scope personas get plain
   divs: no handles, no selection, no cursor change.

   v1.0.3: a phase balloon also RESIZES. Its last ~9px at either end are a grip
   (.p5-h, ew-resize) that moves only that date; the middle keeps the whole-bar
   move. Left drags the start, right drags the end, both day-snapped against the
   same MODEL frame and clamped so the phase keeps at least one day and stays
   inside the drawn window. While the pointer is down nothing re-renders — the
   balloon's left/width, its title and the selection tray's date remark are
   written straight to the DOM — and the drop lands on the one commit() path a
   nudge uses, so there is still exactly one way a timeline date reaches the
   store. A cancelled or zero-day gesture puts everything back and writes
   nothing. The tray gained per-end ± pairs, which is the same feature without
   a pointer. The target diamond is a single date and keeps v1.0.2 behaviour.

   v1.2.2 — minimised first paint (ToR ruling "start with minimize, with one
   main timeline bar, with colouring status(phase)"). A project row now opens
   collapsed to ONE consolidated bar spanning its whole implementation window,
   segmented and coloured by phase (the same odd/even fill the C-06 mini Gantt
   on P4 already uses, so a phase reads the same colour in both places).
   Expanding the row (the CORE_API §2 button/panel contract) reveals the exact
   per-phase rendering v1.0.3 built — same bars, same drag/resize/nudge, same
   tooltip, same commit() path — nothing about editing changed, only what shows
   before a row is opened. A framed K.viewBar top bar carries the grouping
   control, the phase legend and the country chips; a K.filterBar strip adds a
   project picker, an owner picker, a "days in stage" cut and an attention-only
   toggle, plus a small owned search box (p5 has no legacy search key). Both
   frames are pure kit calls — the chart, the grouping and every pixel of the
   editing surface below them are still this file's own.

   v1.2.3 — ToR's Ask-gate on the expanded row: the panel used to repeat the
   project's own name and meta verbatim, so parent and child read as
   duplicates. The label column now says "Task actions" instead, tinted a
   step darker than the country band it belongs to (same --ccb hue, a thin
   wash over it, never a new colour) and indented under the project row it
   opens from. The panel now draws a PROJECT bar — the same envelope the
   collapsed row's consolidated bar shows, now itself draggable — with any
   real phases as half-height task bars underneath it, so every project has
   something to drag, not only ones already in implementation. Phase/target
   -date fields stay the only things ever written; the project bar has no
   date of its own, it is always their union, so dragging either side can
   never leave the other out of step — see the comments over rowHtml(),
   paint() and commit(). K.todayMark (CORE_API, frozen) replaces the
   "today · <date>" pill with a small marker perched on the line.

   Local pure helpers (iso, monthsBetween, spansFor, model) live here rather
   than in derive.js because derive.js is not this round's to edit; they are
   side-effect free and can move up later. */
(function () {
  'use strict';
  var D = CBP.D, U = CBP.ui, A = CBP.actions, K = CBP.K, e = CBP.ui.esc;

  CBP.pages = CBP.pages || {};

  var GROUPS = [
    { k: 'country', label: 'Country' },
    { k: 'status',  label: 'Status' },
    { k: 'owner',   label: 'Owner' }
  ];

  /* the narrowest a month column may be drawn: enough for the wrapped
     "Mar" / "’26" form of a .p5-mh head plus its padding and rule. Read by
     the inline min-width the chart sets below. */
  var MONTH_MIN_PX = 42;

  var NOMINAL_PLAN_DAYS = 90;    /* window used when a record has no target date */
  var NOMINAL_IMPL_DAYS = 120;   /* window used when status 1 has no phases */
  var DAY = 86400000;

  /* ------------------------------------------------------- pure helpers -- */

  function iso(d) {
    return d.getUTCFullYear() + '-' +
           ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' +
           ('0' + d.getUTCDate()).slice(-2);
  }

  function plus(isoDate, days) { return iso(D.addDays(D.parse(isoDate), days)); }

  function earlier(a, b) { return D.parse(a) <= D.parse(b) ? a : b; }
  function later(a, b)   { return D.parse(a) >= D.parse(b) ? a : b; }

  /* What this project occupies on the chart.
     status 1  → the real implementation phases, solid
     status 2  → approved → target, dashed (planned, not started)
     status 3/4→ today → target, dashed (it cannot start before it is approved)
     a target date already passed inverts into a rose "target passed" band
     declined  → no bar at all, just a note in the track

     A span that carries `pi` is backed by a real stored phase, and only those
     are draggable — a nominal stand-in window has nothing to write back to. */
  function spansFor(p) {
    var T = CBP.CONFIG.TODAY;

    if (p.status === 'declined') {
      return { spans: [], note: 'declined' + (p.declined_at ? ' ' + D.fmtDate(p.declined_at) : '') };
    }

    if (p.status === 1) {
      var ph = D.phases(p);
      if (ph.length) {
        return {
          spans: ph.map(function (x, i) {
            return { start: x.start, end: x.end, label: x.phase, plan: false, v: i % 2, pi: i };
          })
        };
      }
      var s = p.implementation_date || p.approved_at || T;
      return {
        spans: [{ start: s, end: p.target_date || plus(s, NOMINAL_IMPL_DAYS),
                  label: 'In implementation', plan: false, v: 0 }],
        note: p.target_date ? null : 'phases not entered'
      };
    }

    var start = (p.status === 2 ? (p.approved_at || T) : T);
    var end = p.target_date || plus(start, NOMINAL_PLAN_DAYS);
    var over = D.parse(end) < D.parse(start);
    if (over) { var t = start; start = end; end = t; }

    return {
      spans: [{
        start: start, end: end, plan: true, over: over, v: 0,
        label: over ? 'Target passed ' + D.days(D.daysSince(p.target_date))
                    : (p.status === 2 ? 'Planned — awaiting kickoff' : 'Planned implementation')
      }],
      note: p.target_date ? null : 'no target date · nominal ' + NOMINAL_PLAN_DAYS + ' d'
    };
  }

  /* the chart frame: whole months covering every span plus today */
  function model(rows) {
    var min = null, max = null;
    var T = CBP.CONFIG.TODAY;
    rows.forEach(function (r) {
      r.spans.forEach(function (s) {
        min = min === null ? s.start : earlier(min, s.start);
        max = max === null ? s.end : later(max, s.end);
      });
      if (r.project.target_date) {
        min = min === null ? r.project.target_date : earlier(min, r.project.target_date);
        max = max === null ? r.project.target_date : later(max, r.project.target_date);
      }
    });
    min = min === null ? T : earlier(min, T);
    max = max === null ? plus(T, 30) : later(max, T);

    var a = D.parse(min), b = D.parse(max);
    var from = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), 1));
    var to = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth() + 1, 1));
    var total = (to - from) || 1;

    var months = [];
    var cur = from;
    while (cur < to) {
      var next = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 1));
      months.push({
        label: D.monthName(cur) + ' ’' + String(cur.getUTCFullYear()).slice(2),
        width: (Math.min(next, to) - cur) / total * 100,
        offset: (cur - from) / total * 100
      });
      cur = next;
    }

    return {
      from: from, to: to, total: total, months: months,
      fromMs: +from, toMs: +to, totalDays: total / DAY,
      pos: function (isoDate) {
        var d = D.parse(isoDate);
        if (!d) return null;
        return Math.max(0, Math.min(100, (d - from) / total * 100));
      }
    };
  }

  function pct(n) { return (Math.round(n * 100) / 100) + '%'; }

  /* full-height overlay position, measured across the whole chart including
     the fixed label column AND the fixed flag column at the right (v1.2.2) —
     every row (head, group, collapsed summary, expanded phase row) reserves
     the same --p5-flag width whether or not it draws anything in it, so the
     visible timeline area is pixel-identical everywhere this is used. */
  function overlay(f) {
    return 'calc(var(--p5-lab) + (100% - var(--p5-lab) - var(--p5-flag)) * ' + (f / 100) + ')';
  }

  /* may this persona move this record's dates? One gate, used by the markup
     and re-checked by every handler, so a stale DOM can never write. */
  function mayMove(user, p) { return D.can(user, 'edit', p); }

  function countryName(code) {
    var c = CBP.state.countries.filter(function (x) { return x.code === code; })[0];
    return c ? c.name : code;
  }

  /* ============================================================== page ====*/

  CBP.pages.timeline = function (state) {
    var user = state.user;
    var codes = D.visibleCountries(user, state.countries);
    var scoped = D.visibleProjects(user, state.projects, state.countries);
    var group = state.ui.p5Group || 'country';

    /* v1.2.2 — the page-owned half of the new-condition bag: country chips,
       a project picker and a free-text box, none of which had a home in
       K.BIND (p5 carries no legacy status/search/country key at all). */
    var f = K.flt('p5');
    if (f.countries === undefined) f.countries = null;
    if (f.project === undefined) f.project = '';
    if (f.q === undefined) f.q = '';

    var selCodes = (!f.countries || !f.countries.length) ? codes.slice()
      : codes.filter(function (c) { return f.countries.indexOf(c) > -1; });

    var allRows = scoped.map(function (p) {
      var s = spansFor(p);
      return { project: p, spans: s.spans, note: s.note, may: mayMove(user, p) };
    });

    /* country chip counts — off the full user scope, so a chip's own number
       never moves just because another chip got toggled */
    var ccCount = {};
    scoped.forEach(function (p) { ccCount[p.country] = (ccCount[p.country] || 0) + 1; });

    var filtered = K.applyFilter('p5', allRows, {
      country: function (r) { return r.project.country; },
      owner: function (r) { return r.project.owner || ''; },
      aging: function (r) { return D.daysInStage(r.project); },
      attn: function (r) { return K.attention(r.project, user); },
      text: function (r) { return r.project.id + ' ' + r.project.name; }
    }, { q: f.q, codes: selCodes });

    if (f.project) filtered = filtered.filter(function (r) { return r.project.id === f.project; });

    function spanStart(r) {
      return r.spans.length
        ? Math.min.apply(null, r.spans.map(function (s) { return +D.parse(s.start); }))
        : +D.parse(CBP.CONFIG.TODAY);
    }
    function spanEnd(r) {
      return r.spans.length
        ? Math.max.apply(null, r.spans.map(function (s) { return +D.parse(s.end); }))
        : +D.parse(CBP.CONFIG.TODAY);
    }

    var sorted = K.sortRows('p5', filtered, {
      attention: function (r) { return K.attnRank(K.attention(r.project, user)); },
      start: spanStart,
      end: spanEnd,
      duration: function (r) { return Math.round((spanEnd(r) - spanStart(r)) / DAY); },
      country: function (r) { return countryName(r.project.country); },
      name: function (r) { return r.project.name; }
    }, function (r) { return r.project.id; });

    var m = model(sorted);
    MODEL = m;                       /* the frame the pointer handlers measure against */

    /* a selection never survives a persona switch, a scope change or a filter
       that drops the project it belongs to */
    var sel = state.ui.p5Sel || null;
    if (sel) {
      var keep = sorted.filter(function (r) {
        return r.project.id === sel.pid && r.may;
      })[0];
      if (!keep) { sel = null; state.ui.p5Sel = null; }
    }

    var movable = sorted.filter(function (r) { return r.may; }).length;
    var ids = sorted.map(function (r) { return r.project.id; });

    var scopeName = codes.length === state.countries.length
      ? 'Asia Area' : codes.map(countryName).join(' · ');

    /* -------------------------------------------------------- the top bar */

    var phaseCount = sorted.reduce(function (acc, r) {
      return acc + r.spans.filter(function (s) { return s.pi !== undefined; }).length;
    }, 0);
    var subHtml = sorted.length + ' project' + (sorted.length === 1 ? '' : 's') +
      (phaseCount ? ' · ' + phaseCount + ' phase' + (phaseCount === 1 ? '' : 's') : '') +
      ' · ' + e(D.fmtDateY(iso(m.from))) + ' – ' + e(D.fmtDateY(iso(D.addDays(m.to, -1))));

    var groupControl = '<span class="p5-glab">Group by</span>' +
      GROUPS.map(function (g) {
        return '<button type="button" class="chip' + (group === g.k ? ' on' : '') +
               '" data-act="p5group" data-g="' + g.k + '">' + e(g.label) + '</button>';
      }).join('');

    var legend = '<span class="p5-legend">' +
      '<span class="p5-key solid"></span><span class="p5-key solid v2"></span>Phases (alternating)' +
      '<span class="p5-key plan"></span>Planned (dashed until approved)' +
      '<span class="p5-key over"></span>Target passed' +
      '<span class="p5-key mile"></span>Target date' +
      '<span class="p5-key today"></span>Today' +
      '</span>';

    var actionsHtml =
      '<span class="p5-addon" title="Licensed add-on module (D-07)">Required Licenses</span>' +
      K.expandAll('p5', ids) +
      (D.can(user, 'viewGantt')
        ? '<button type="button" class="btn" data-act="deeplink">Open full editor in TimeBlock ↗</button>' : '');

    var countryChips = countryChipsHtml(selCodes, codes, ccCount, f);

    var html = K.viewBar({
      crumb: 'TimeBlock · ' + e(scopeName) + ' · Budget year ' + e(String(CBP.CONFIG.BUDGET_YEAR)),
      title: 'TimeBlock',
      sub: subHtml,
      actions: actionsHtml,
      statusLabel: 'View',
      status: groupControl + legend,
      countryLabel: 'Country',
      country: countryChips
    });

    /* -------------------------------------------------------- the filters */

    var projOptions = [{ v: '', label: 'All projects' }].concat(
      scoped.slice().sort(function (a, b) { return a.id.localeCompare(b.id); })
        .map(function (p) { return { v: p.id, label: p.id + ' · ' + p.name }; })
    );
    var ownerOpts = K.ownerOptions(allRows, function (r) { return r.project.owner; });

    /* v1.2.2 audit — the search box moved out of the bar's `right` slot into
       K.filterBar's own k-fb-q condition slot, labelled "Search", so it sits
       and reads exactly where P3's and P12's do. The act stays page-owned
       (p5 has no legacy search key), which `value` now lets the kit render. */

    html += K.filterBar({
      page: 'p5',
      conditions: [
        { key: 'project', label: 'Project', kind: 'select', options: projOptions },
        { key: 'owner', label: 'Owner', kind: 'select', options: ownerOpts },
        { key: 'aging', label: 'Time in process', kind: 'select', options: K.AGING },
        { key: 'flag', label: 'Attention', kind: 'toggle', toggleLabel: 'Attention only' }
      ],
      sorts: [
        { v: 'attention', label: 'Attention' },
        { v: 'start', label: 'Start date' },
        { v: 'end', label: 'End date' },
        { v: 'duration', label: 'Duration' },
        { v: 'country', label: 'Country' },
        { v: 'name', label: 'Name' }
      ],
      search: { act: 'p5-q', label: 'Search',
                placeholder: 'Search by id or name…', value: f.q },
      count: { shown: sorted.length, total: allRows.length,
               noun: sorted.length === 1 ? 'project' : 'projects' }
    });

    if (!allRows.length) {
      return '<div class="p5-page">' + html + U.card('', '<div class="p5-empty">No projects in ' +
        'your scope carry a timeline yet.</div>', { cls: 'p5-card' }) + '</div>';
    }
    if (!sorted.length) {
      /* v1.2.2 audit — no bespoke reset here any more: the strip's own
         Clear filters now empties the whole flt bag, this one included. */
      return '<div class="p5-page">' + html + U.card('', '<div class="p5-empty">No projects match ' +
        'the current filters.</div>', { cls: 'p5-card' }) + '</div>';
    }

    if (movable) {
      html += '<p class="p5-lead">Expand a project to drag the middle of a phase balloon (or the ' +
        'target diamond) along its row; drag either <b>end</b> of a balloon to move just that date ' +
        'and change how long the phase runs. Everything snaps to whole days and the drop is written ' +
        'to the record with a log line. Prefer the keyboard? Click a balloon to select it, then nudge ' +
        'the start, the end or the whole phase a day at a time.</p>';
    }

    /* -------------------------------------------------------- the chart */
    /* v1.2.3 audit — the chart's own floor is sized from the MONTH COUNT, not
       from a single literal. .p5-mh used to nowrap+ellipsis, so a 13-month
       span at 1024 cut every head to "M…"; the head now wraps instead, and
       this guarantees each month a column wide enough for the wrapped form
       (~42px) whatever the viewport. The label and flag columns are named,
       not hard-coded, so the narrow tier's own --p5-lab still applies. */
    var chart = '<div class="p5-gantt"><div class="p5-scroll">' +
      '<div class="p5-inner" style="min-width:calc(var(--p5-lab) + var(--p5-flag) + ' +
      (m.months.length * MONTH_MIN_PX) + 'px)">';

    m.months.forEach(function (mo, i) {
      if (i) chart += '<div class="p5-div" style="left:' + overlay(mo.offset) + '"></div>';
    });

    /* v1.2.3 — the "today · <date>" pill covered whatever fell under it;
       K.todayMark (CORE_API, frozen) draws the same rose line and perches a
       small chapel on top instead, the date arriving on hover/focus. It is
       positioned from this file's own overlay() value, so the chart's own
       maths never has to change to adopt it. */
    var todayF = m.pos(CBP.CONFIG.TODAY);
    if (todayF !== null) {
      chart += K.todayMark({ left: overlay(todayF), label: D.fmtDateY(CBP.CONFIG.TODAY), cls: 'p5' });
    }

    chart += '<div class="p5-head"><div class="p5-lab">Project</div><div class="p5-months">' +
      m.months.map(function (mo) {
        return '<div class="p5-mh" style="width:' + pct(mo.width) + '">' + e(mo.label) + '</div>';
      }).join('') + '</div><div class="p5-fcell">Flag</div></div>';

    groupRows(sorted, group, state).forEach(function (g) {
      if (group === 'country') {
        chart += K.band({
          code: g.key, name: g.label, cc: U.ccOf(g.key),
          count: g.count, noun: g.count === 1 ? 'project' : 'projects',
          figures: [{ label: 'Budget', html: D.money(g.money) }].concat(
            g.unowned ? [{ label: 'Unassigned', value: g.unowned, tone: 'neg' }] : [])
        });
      } else {
        chart += '<div class="p5-grp"><div class="p5-lab"><b>' + e(g.label) + '</b>' +
          '<small>' + e(g.sub) + '</small></div><div class="p5-track grp"></div></div>';
      }
      g.rows.forEach(function (r) {
        var open = K.isOpen('p5', r.project.id);
        /* v1.2.3 — the project's own country class, so --ccb/--ccl/--ccx
           (C-21, app.css) are already in scope for the expanded panel below
           regardless of how the page is currently grouped (country, status
           or owner) — the tint always matches THIS project's own band. */
        chart += '<div class="p5-item ' + U.ccOf(r.project.country) +
          '" data-open="' + (open ? 'true' : 'false') + '">' +
          summaryRowHtml(r, m, open, user) +
          (open
            ? '<div class="p5-panel">' + rowHtml(r, m, sel) +
              (sel && sel.pid === r.project.id ? trayHtml(state, r, sel) : '') + '</div>'
            : '') +
          '</div>';
      });
    });

    chart += '</div></div></div>';

    html += U.card('', chart, { cls: 'p5-card' });

    html += '<p class="pagenote">One row per project, collapsed by default to a single bar spanning ' +
      'its whole window and split by phase colour; open a row for the full phase-by-phase editor. ' +
      'Bars before approval are dashed: a record cannot start implementing until it is marked ' +
      'approved, so the planned window runs from today (or from the approval date at status 2) ' +
      'to the target date — a nominal ' + NOMINAL_PLAN_DAYS + '-day window stands in where no ' +
      'target date is set. The owner carries on the label column (D-14); the diamond is the target ' +
      'date. ' +
      (movable
        ? 'Moving dates is owner + M1-and-above (D-06): open the row, then drag a balloon or select ' +
          'it and nudge, and the record is saved here with its own activity line — the full phase ' +
          'editor still lives on the project page and in the TimeBlock full editor (D-07).'
        : 'Moving dates is owner + M1-and-above (D-06), so this chart is read-only for you — the ' +
          'balloons carry no handles.') +
      ' Scope: ' + e(selCodes.join(', ')) + '.</p>';

    /* the .p5-page wrapper gives p5p9.css a safe, page-scoped hook for the
       handful of narrow-viewport overrides the shared K.viewBar actions area
       needs here (three items — a badge and two buttons — is more than the
       kit's own .k-bacts assumes room for at 390px) without touching any
       frozen kit class everywhere else it is used. */
    return '<div class="p5-page">' + html + '</div>';
  };

  /* --------------------------------------------------------- grouping ---- */

  function groupRows(rows, group, state) {
    var keyOf, labelOf, order;

    if (group === 'status') {
      keyOf = function (r) { return String(r.project.status); };
      labelOf = function (k) { return CBP.CONFIG.STATUS[k === 'declined' ? 'declined' : +k].label; };
      order = CBP.CONFIG.STATUS_ORDER.map(String);
    } else if (group === 'owner') {
      keyOf = function (r) { return r.project.owner || '—'; };
      labelOf = function (k) { return k === '—' ? 'Unassigned' : CBP.userName(k); };
      order = null;
    } else {
      keyOf = function (r) { return r.project.country; };
      labelOf = countryName;
      order = state.countries.map(function (c) { return c.code; });
    }

    var buckets = {}, keys = [];
    /* rows arrive already sorted (K.sortRows) — bucket only, never re-sort,
       so the sort control the filter strip offers actually holds inside a
       group too */
    rows.forEach(function (r) {
      var k = keyOf(r);
      if (!buckets[k]) { buckets[k] = []; keys.push(k); }
      buckets[k].push(r);
    });

    if (order) {
      keys.sort(function (a, b) {
        var ia = order.indexOf(a), ib = order.indexOf(b);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
    } else {
      keys.sort(function (a, b) {
        if (a === '—') return 1;
        if (b === '—') return -1;
        return labelOf(a).localeCompare(labelOf(b));
      });
    }

    return keys.map(function (k) {
      var list = buckets[k];
      var money = list.reduce(function (acc, r) {
        return acc + (r.project.status === 'declined' ? 0 : (r.project.amount || 0));
      }, 0);
      var unowned = list.filter(function (r) { return !r.project.owner; }).length;
      return {
        key: k,
        label: labelOf(k),
        count: list.length,
        money: money,
        unowned: unowned,
        sub: list.length + ' project' + (list.length === 1 ? '' : 's') + ' · ' + D.money(money) +
             (group !== 'owner' && unowned ? ' · ' + unowned + ' unassigned' : ''),
        rows: list
      };
    });
  }

  /* --------------------------------------------------- country chips ----- */
  /* Page-owned: p5 carries no legacy country key (K.BIND.p5.country is null),
     so the selection lives under state.ui.flt.p5.countries and the chips get
     their own act — handled by this file's own listener below, never by a
     kit- or actions.js-registered one. */

  function countryChipsHtml(selCodes, codes, ccCount, f) {
    var allOn = !f.countries || !f.countries.length;
    var html = '<button type="button" class="k-chip' + (allOn ? ' on' : '') +
      '" data-act="p5-country" data-cc="" aria-pressed="' + (allOn ? 'true' : 'false') + '">All' +
      ' <span class="n num">' + codes.length + '</span></button>';
    html += codes.map(function (code) {
      var on = !allOn && f.countries.indexOf(code) > -1;
      return '<button type="button" class="k-chip' + (on ? ' on' : '') + '" data-act="p5-country"' +
        ' data-cc="' + e(code) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        U.flagMark(code) + e(countryName(code)) +
        ' <span class="n num">' + (ccCount[code] || 0) + '</span></button>';
    }).join('');
    return html;
  }

  /* ------------------------------------------------------------- a row --- */

  var MIN_BAR_PCT = 1.4;    /* the floor every bar's width is clamped to (Math.max below) */
  /* and the floor the CSS itself holds open whatever that per cent works out
     to: .p5-bar declares min-width:26px, and .p5-pbar's 10px side padding
     plus its 1px border make 22px with box-sizing:border-box. 27 clears the
     larger of the two by a pixel. */
  var BAR_FLOOR_PX = 27;
  var MIN_TEXT_WIDTH = 8;   /* % of the range a bar needs before its label fits inside */
  var FLOAT_FLIP = 62;      /* past this, a floating label is hung before the bar instead */

  /* a balloon is a <button> only where it can actually be moved; everywhere else
     it stays a plain <div>, which is what keeps the viewer's chart inert */
  function balloon(tag, cls, style, title, attrs, inner) {
    var live = tag === 'button';
    return '<' + tag + (live ? ' type="button"' : '') + ' class="' + cls + '"' +
      ' style="' + style + '" title="' + title + '"' + (live ? ' aria-label="' + title + '"' : '') + attrs + '>' + inner +
      '</' + tag + '>';
  }

  /* --------------------------------------------- v1.2.2 · the collapsed row */
  /* A single button carrying the CORE_API §2 row contract: the fixed label
     column, ONE consolidated bar (segmented by phase where there is more
     than one), and the attention flag at the right. No live balloons here —
     collapsed rows are always inert, even for a persona who may edit, so a
     click anywhere on the row does exactly one thing: open it. */
  function summaryRowHtml(r, m, open, user) {
    var p = r.project;
    var owner = p.owner ? CBP.userName(p.owner) : 'unassigned';
    /* v1.2.3 audit — r.note is NOT repeated here. It is already drawn in the
       track beside the bar as the floating .p5-note ("no target date ·
       nominal 90 d"), and carrying it a second time on the meta line pushed
       that line to 511px inside a 211px column, so the line ellipsised on
       every row and could cut a figure. Said once, in the place that has
       room for it. */
    var chev = open ? '▴' : '▾';

    return '<button type="button" class="p5-sum" data-act="k-row" data-page="p5"' +
      ' data-id="' + e(p.id) + '" aria-expanded="' + (open ? 'true' : 'false') + '">' +
      '<div class="p5-lab">' +
        '<b>' + e(p.name) + '</b>' +
        '<small' + (p.owner ? '' : ' class="unowned"') + '>' +
        '<i class="p5-id">' + e(p.id) + '</i> · ' + e(owner) + ' · ' +
        e(CBP.CONFIG.STATUS[p.status].short) + '</small>' +
      '</div>' +
      '<div class="p5-track">' + consolidatedBar(r, m) + '</div>' +
      '<div class="p5-fcell"><i class="p5-chev" aria-hidden="true">' + chev + '</i>' +
        K.flagCell(K.attention(p, user)) + '</div>' +
      '</button>';
  }

  /* the one bar a collapsed row shows: one pill spanning the project's whole
     window; when it carries more than one real phase, inner segments split
     it by phase in the same odd/even fill the C-06 mini Gantt on P4 uses
     (derive.js:341 — `variant: i % 2 === 1 ? 'v2' : ''`), so a phase reads
     the same colour there and here. A single-span project (declined aside)
     still gets the plain pill it always had, just inert. */
  function consolidatedBar(r, m) {
    var p = r.project;
    var out = '';

    if (r.spans.length) {
      var minStart = null, maxEnd = null;
      r.spans.forEach(function (s) {
        minStart = minStart === null ? s.start : earlier(minStart, s.start);
        maxEnd = maxEnd === null ? s.end : later(maxEnd, s.end);
      });
      var a = m.pos(minStart), b = m.pos(maxEnd);
      var w = Math.max(1.4, b - a);
      var multi = r.spans.length > 1;
      var single = r.spans[0];
      var wrapCls = 'p5-cbar' +
        (!multi && single.plan ? (single.over ? ' plan over' : ' plan') : '');

      var segs = '';
      if (multi) {
        var span0 = Math.max(1, D.daysBetween(minStart, maxEnd));
        segs = r.spans.map(function (s) {
          var left = D.daysBetween(minStart, s.start) / span0 * 100;
          var width = Math.max(2, D.daysBetween(s.start, s.end) / span0 * 100);
          return '<span class="p5-cseg' + (s.v ? ' v2' : '') + '" style="left:' + pct(left) +
                 ';width:' + pct(width) + '"></span>';
        }).join('');
      }

      var tip = D.fmtDateY(minStart) + ' – ' + D.fmtDateY(maxEnd) +
        (multi ? ' · ' + r.spans.length + ' phases' : ' · ' + single.label);
      out += '<span class="' + wrapCls + '" style="left:' + pct(a) + ';width:' + pct(w) +
        '" title="' + e(tip) + '">' + segs + '</span>';
    } else if (r.note) {
      out += '<span class="p5-note" style="left:0">' + e(r.note) + '</span>';
    }

    if (p.target_date) {
      out += '<span class="p5-mile' + (D.pastTarget(p) ? ' over' : '') + '" style="left:' +
        pct(m.pos(p.target_date)) + '" title="' + e('Target date ' + D.fmtDateY(p.target_date)) +
        '"></span>';
    }
    return out;
  }

  /* ------------------------------------------- the expanded phase detail -- */
  /* v1.2.3 — ToR's Ask-gate: the panel used to repeat the project's own name
     and meta verbatim, so the parent row and its detail read as duplicates.
     The label column now carries the SECTION's identity ("Task actions"),
     never the project's, and the track draws two tiers instead of one:

       .p5-pbar   the PROJECT's own timeline — the same envelope the
                  collapsed row's consolidated bar shows, now itself a live
                  balloon. It is the only bar a phase-less project ever
                  gets, so every project is adjustable (Ask 3), not only the
                  ones in implementation.
       .p5-bar.task  one balloon per REAL phase, unchanged drag/resize/nudge,
                  drawn at half the project bar's height (Ask 4) underneath it.

     Source of truth stays the children: a real phase's own start/end (or,
     with no phases at all, target_date) is what commit() ever writes. The
     project bar carries no date of its own — it is always the union of
     whatever spansFor(p) returns, recomputed on every render, so dragging a
     task can never leave the project bar out of step with it (Ask 3). Drag
     the project bar instead and it is sugar for "shift every child by the
     same number of days," landing through the very same commit() write —
     see the header there. Both directions paint the other side live, mid
     -gesture, in paint() below, purely as pixels; the store still only
     changes on drop. */
  function rowHtml(r, m, sel) {
    var p = r.project;
    var owner = p.owner ? CBP.userName(p.owner) : 'unassigned';
    var outside = [];       /* labels too long for their bar, plus the row note */
    var hasPhases = r.spans.some(function (s) { return s.pi !== undefined; });

    var taskBars = !hasPhases ? '' : r.spans.map(function (s) {
      var a = m.pos(s.start), b = m.pos(s.end);
      var w = Math.max(1.4, b - a);
      /* a "target passed" band always hangs its label outside: the band is the
         alarming part, and the label is more legible beside it than clipped */
      var roomy = w >= MIN_TEXT_WIDTH && !s.over;
      var live = r.may && s.pi !== undefined;
      var on = live && sel && sel.pid === p.id && sel.kind === 'phase' && sel.idx === s.pi;
      var cls = 'p5-bar task ' +
                (s.plan ? (s.over ? 'plan over' : 'plan') : (s.v ? 'v2' : '')) +
                (roomy ? '' : ' tiny') + (live ? ' p5-live' : '') + (on ? ' on' : '');
      var text = s.label + ((s.plan && !s.over) ? ' · ' + owner : '');
      if (!roomy) outside.push({ text: s.label, over: s.over });

      var attrs = live
        ? ' data-act="p5sel" data-p5drag="phase" data-pid="' + e(p.id) + '" data-idx="' + s.pi +
          '" data-start="' + e(s.start) + '" data-end="' + e(s.end) + '"' +
          ' aria-pressed="' + (on ? 'true' : 'false') + '"'
        : '';

      /* v1.0.3 — the two resize grips. They are inert <u> elements inside the
         balloon, so nothing interactive nests and a persona who may not move
         the record never gets them (or the ew-resize cursor) at all. The
         pointerdown handler reads which one the gesture started on. */
      var grips = live
        ? '<u class="p5-h l" data-p5end="start" aria-hidden="true"></u>' +
          '<u class="p5-h r" data-p5end="end" aria-hidden="true"></u>'
        : '';

      return balloon(live ? 'button' : 'div', cls,
        'left:' + pct(a) + ';width:' + pct(w),
        e(s.label + ' · ' + D.fmtDateY(s.start) + ' – ' + D.fmtDateY(s.end) + ' · ' + owner +
          (live ? ' · drag the middle to move, an end to change that date' : '')),
        attrs,
        '<i></i>' + (roomy ? '<span>' + e(text) + '</span>' : '') + grips);
    }).join('');

    /* the project bar — always the union of r.spans, so it is drawn even
       when there is only the one nominal "planned"/"in implementation"
       window and no real phase behind it (Ask 3's "something to drag"). */
    var pbar = '';
    if (r.spans.length) {
      var pStart = null, pEnd = null;
      r.spans.forEach(function (s) {
        pStart = pStart === null ? s.start : earlier(pStart, s.start);
        pEnd = pEnd === null ? s.end : later(pEnd, s.end);
      });
      var pa = m.pos(pStart), pb = m.pos(pEnd);
      var pw = Math.max(1.4, pb - pa);
      var single = r.spans[0];
      /* v1.2.3 audit — a bar is live only when there is a REAL field behind
         it, the same rule this file already states for phase spans ("a
         nominal stand-in window has nothing to write back to"). A phase-less
         record with no target date is drawn from the nominal 90/120-day
         stand-in, and dragging it used to invent a target date out of that
         stand-in. Phases → live; a stored target_date → live; neither →
         drawn, not draggable. */
      var plive = r.may && (hasPhases || !!p.target_date);
      var pon = plive && sel && sel.pid === p.id && sel.kind === 'project';
      var pOver = !hasPhases && single.over;
      var pcls = 'p5-pbar' +
        (!hasPhases && single.plan ? (single.over ? ' plan over' : ' plan') : '') +
        (plive ? ' p5-live' : '') + (pon ? ' on' : '');
      var ptext = hasPhases
        ? r.spans.length + ' phase' + (r.spans.length === 1 ? '' : 's')
        : single.label;
      var proomy = pw >= MIN_TEXT_WIDTH && !pOver;
      if (!proomy) outside.push({ text: ptext, over: pOver });

      var pattrs = plive
        ? ' data-act="p5sel" data-p5drag="project" data-pid="' + e(p.id) + '" data-idx="0"' +
          ' data-start="' + e(pStart) + '" data-end="' + e(pEnd) + '"' +
          ' aria-pressed="' + (pon ? 'true' : 'false') + '"'
        : '';

      pbar = balloon(plive ? 'button' : 'div', pcls,
        'left:' + pct(pa) + ';width:' + pct(pw),
        e('Project timeline ' + D.fmtDateY(pStart) + ' – ' + D.fmtDateY(pEnd) + ' · ' + ptext +
          (plive
            /* say which field the gesture writes — "the whole project" was
               true of the pixels and false of the record on a phase-less
               row, where the only stored date is the target (v1.2.3 audit) */
            ? (hasPhases ? ' · drag to shift every phase by the same number of days'
                         : ' · drag to move the target date')
            : '')),
        pattrs,
        '<i></i>' + (proomy ? '<span>' + e(ptext) + '</span>' : ''));
    }

    var mile = '';
    if (p.target_date) {
      var mlive = r.may;
      var mon = mlive && sel && sel.pid === p.id && sel.kind === 'target';
      mile = balloon(mlive ? 'button' : 'div',
        'p5-mile' + (D.pastTarget(p) ? ' over' : '') + (mlive ? ' p5-live' : '') +
          (mon ? ' on' : ''),
        'left:' + pct(m.pos(p.target_date)),
        e('Target date ' + D.fmtDateY(p.target_date) +
          (mlive ? ' · drag or click to move' : '')),
        mlive
          ? ' data-act="p5sel" data-p5drag="target" data-pid="' + e(p.id) + '" data-idx="0"' +
            ' data-date="' + e(p.target_date) + '" aria-pressed="' + (mon ? 'true' : 'false') +
            '" aria-label="Target date ' + e(D.fmtDateY(p.target_date)) + '"'
          : '',
        '');
    }

    if (r.note) outside.push({ text: r.note, muted: true });

    /* one floating label per row, hung after the last bar — or before the first
       bar when that would run off the right edge of the chart */
    var float = '';
    if (outside.length) {
      /* v1.2.3 audit — hang the label off the bar's DRAWN right edge, not off
         the date's position. Every bar's width is Math.max(MIN_BAR_PCT, …),
         so a span shorter than that floor is painted wider than its dates
         and the label, placed at the date, landed 6px UNDER the bar it
         describes. The target diamond is the same story: 9px of ink centred
         on its date, half of it past the date. Clearing both is one max(). */
      var lastSpan = r.spans.length ? r.spans[r.spans.length - 1] : null;
      var first = r.spans.length ? m.pos(r.spans[0].start) : m.pos(CBP.CONFIG.TODAY);
      var last = lastSpan
        ? Math.max(m.pos(lastSpan.end), m.pos(lastSpan.start) + MIN_BAR_PCT,
                   first + MIN_BAR_PCT)
        : m.pos(CBP.CONFIG.TODAY);
      if (p.target_date) last = Math.max(last, m.pos(p.target_date));
      var hot = outside.some(function (x) { return x.over; });
      var text = outside.map(function (x) { return x.text; }).join(' · ');
      /* …and the rest of the floor is in PIXELS, not per cent, so the
         percentage max() above cannot express it: a balloon's own padding
         and border (BAR_FLOOR_PX) hold it open at 22–26px however short its
         span is, and the diamond is 9px of ink centred on its date. CSS
         max() takes both in one value, so a long bar keeps the tight 10px
         hang it always had and only a hairline-short one is pushed clear. */
      var anchors = [pct(last)];
      if (lastSpan) anchors.push('calc(' + pct(m.pos(lastSpan.start)) +
        ' + ' + BAR_FLOOR_PX + 'px)');
      if (p.target_date) anchors.push('calc(' + pct(m.pos(p.target_date)) + ' + 6px)');
      var leftVal = anchors.length > 1 ? 'max(' + anchors.join(', ') + ')' : anchors[0];
      float = last <= FLOAT_FLIP
        ? '<span class="p5-note' + (hot ? ' over' : '') + '" style="left:' + leftVal + '">' +
          e(text) + '</span>'
        : '<span class="p5-note before' + (hot ? ' over' : '') + '" style="right:' +
          pct(100 - first) + '">' + e(text) + '</span>';
    }

    /* v1.2.3 — "Task actions" replaces the project's own name/meta here; the
       phase name/count rides on or beside the bars themselves instead. The
       record link survives (title carries the full identity) so the panel
       still opens the project, it just no longer says its name twice. */
    var subMeta = hasPhases
      ? (r.spans.length + ' phase' + (r.spans.length === 1 ? '' : 's') + ' · ' + owner)
      : ((r.note ? r.note : 'planned window') + ' · ' + owner);

    return '<div class="p5-row' + (sel && sel.pid === p.id ? ' sel' : '') + '">' +
      '<div class="p5-lab">' +
        '<a class="p5-plink" href="#/project/' + e(p.id) + '" title="' +
        e(p.id + ' · ' + p.name + ' · ' + owner) + '">' +
        '<b>Task actions</b>' +
        '<small' + (p.owner ? '' : ' class="unowned"') + '>' + e(subMeta) + '</small></a>' +
      '</div>' +
      '<div class="p5-track detail' + (hasPhases ? ' has-tasks' : '') + '">' +
        pbar + taskBars + mile + float + '</div></div>';
  }

  /* ------------------------------------------------- the selection tray --- */

  /* What a selected balloon currently spans, in words. */
  function selDates(p, sel) {
    if (sel.kind === 'target') {
      return p.target_date
        ? { name: 'Target date', when: D.fmtDateY(p.target_date) } : null;
    }
    if (sel.kind === 'project') {
      /* v1.2.3 — the project bar has no date of its own; read the same
         union spansFor(p) draws it from, so the tray's remark always
         matches what is on screen, mid-drag included. */
      var sf = spansFor(p);
      if (!sf.spans.length) return null;
      /* v1.2.3 audit — and nothing to write is nothing to move: a phase-less
         record with no target date draws its bar from the nominal stand-in
         window, so the bar is inert (rowHtml's plive) and the tray must not
         offer ±1 d buttons that silently do nothing. */
      if (!D.phases(p).length && !p.target_date) return null;
      var lo = null, hi = null;
      sf.spans.forEach(function (s) {
        lo = lo === null ? s.start : earlier(lo, s.start);
        hi = hi === null ? s.end : later(hi, s.end);
      });
      return {
        name: 'Project timeline',
        when: D.fmtDateY(lo) + ' – ' + D.fmtDateY(hi) + ' · ' + D.days(D.daysBetween(lo, hi))
      };
    }
    var ph = D.phases(p)[sel.idx];
    if (!ph) return null;
    return {
      name: ph.phase,
      when: D.fmtDateY(ph.start) + ' – ' + D.fmtDateY(ph.end) +
            ' · ' + D.days(D.daysBetween(ph.start, ph.end))
    };
  }

  /* one ± pair. `mode` is what the commit path does with the day: move the whole
     balloon, or only one of its ends. */
  function nudgePair(label, mode, what) {
    return '<span class="p5-nudge"><span class="p5-nlab">' + e(label) + '</span>' +
      '<button type="button" class="btn sm" data-act="p5nudge" data-mode="' + e(mode) +
        '" data-dir="-1" aria-label="' + e(what + ' one day earlier') + '">−1 d</button>' +
      '<button type="button" class="btn sm" data-act="p5nudge" data-mode="' + e(mode) +
        '" data-dir="1" aria-label="' + e(what + ' one day later') + '">+1 d</button>' +
      '</span>';
  }

  function trayHtml(state, r, sel) {
    var what = selDates(r.project, sel);
    if (!what) return '';
    var err = (state.ui.err && state.ui.err.key === 'edit')
      ? '<span class="p5-editerr">' + e(state.ui.err.msg) + '</span>' : '';

    /* v1.0.3 — a phase can be nudged whole, or one end at a time, which is the
       keyboard half of the bar-end resize. The target diamond is a single date,
       so it keeps the v1.0.2 move-only pair. v1.2.3 — the project bar is the
       same move-only shape: it has no ends of its own to nudge, only a whole
       -project shift (see commit()'s 'project' branch). The date remark above
       recomputes from the record on every render, and tracks a drag live. */
    var nudges = (sel.kind === 'target')
      ? nudgePair('Move', 'move', 'Move the target date')
      : (sel.kind === 'project')
      /* v1.2.3 audit — name the field, not the picture: on a phase-less
         record the project bar's only stored date is target_date */
      ? nudgePair('Move', 'move', D.phases(r.project).length
          ? 'Shift every phase by one day' : 'Move the target date')
      : nudgePair('Whole phase', 'move', 'Move the phase') +
        nudgePair('Start', 'start', 'Move the start date') +
        nudgePair('End', 'end', 'Move the end date');

    return '<div class="p5-edit">' +
      '<span class="p5-editlab">Moving <b>' + e(what.name) + '</b> ' +
        '<span class="num">' + e(what.when) + '</span></span>' +
      nudges +
      '<button type="button" class="btn sm" data-act="p5done">Done</button>' +
      err +
      '<span class="p5-editnote">Each change is saved to the record with its own activity ' +
      'line; a phase always keeps at least one day between its ends.</span></div>';
  }

  /* ===================================================== interaction ====== */
  /* Registered ONCE at load, delegated, and route-guarded — the page markup is
     rebuilt on every render() pass, so nothing may bind to an element. */

  var MODEL = null;      /* the frame of the chart currently on screen */
  var DRAG = null;       /* the balloon under the pointer, mid-drag */
  var TIP = null;        /* the live date tooltip, parked on <body> */
  var SUPPRESS = 0;      /* a committed drag must not also read as a click */
  /* R-03 — the browser fires one spurious 'click' on a drag's own target right
     after pointerup, and it must not read as a selection. The flag is armed on
     the drop and cleared on the first click that reaches the handler. But
     endDrag()'s commit() re-renders SYNCHRONOUSLY inside pointerup, detaching
     the dragged node before that trailing click is dispatched — and a click on
     a detached node does not bubble to this document-delegated handler, so the
     flag was never consumed and instead ate the NEXT genuine click (first click
     after any drag did nothing). The fix disarms the flag on an async task at
     the end of the gesture (see endDrag's setTimeout below): that macrotask
     runs AFTER this gesture's own trailing click (if it reaches) but BEFORE any
     later genuine user/test click, which is always a separate task. Nothing
     about what a drag writes changes. */

  function onP5() {
    return !!(CBP.state && CBP.state.ui && CBP.state.ui.route === 'timeline' && MODEL);
  }

  function onTimelineRoute() {
    return !!(CBP.state && CBP.state.ui && CBP.state.ui.route === 'timeline');
  }

  function closest(node, sel) {
    return (node && node.closest) ? node.closest(sel) : null;
  }

  /* ------------------------------------------------------------ tooltip -- */

  function tipEl() {
    if (TIP) return TIP;
    try {
      TIP = document.createElement('div');
      TIP.className = 'p5-tip';
      document.body.appendChild(TIP);
    } catch (err) { TIP = null; }
    return TIP;
  }

  function showTip(ev, text) {
    var t = tipEl();
    if (!t) return;
    t.textContent = text;
    t.style.left = ev.clientX + 'px';
    t.style.top = ev.clientY + 'px';
    t.classList.add('on');
  }

  function hideTip() {
    if (TIP) TIP.classList.remove('on');
  }

  /* --------------------------------------------------------- the maths --- */

  var MIN_SPAN_DAYS = 1;   /* a phase always keeps at least one day of width */

  /* How far this gesture may travel. Three shapes, one function, so a drag and
     a tray nudge can never clamp differently:

       move   both ends stay inside the drawn window
       start  the start may not pass the window's left edge, nor reach the end
       end    the end may not pass the window's right edge, nor reach the start

     The window is the same MODEL frame the chart is drawn on, and every bound
     is in whole days, so the result is day-snapped by construction. A phase
     that already sits on the frame's edge therefore cannot be dragged past it
     — the tray's ±1 day nudge is the way out, and the next render redraws the
     frame around the new date. */
  function clampDays(d, days, mode) {
    var s = +D.parse(d.start), en = +D.parse(d.end);
    var lo, hi;

    if (mode === 'start') {
      lo = Math.ceil((MODEL.fromMs - s) / DAY);
      hi = Math.floor((en - MIN_SPAN_DAYS * DAY - s) / DAY);
    } else if (mode === 'end') {
      lo = Math.ceil((s + MIN_SPAN_DAYS * DAY - en) / DAY);
      hi = Math.floor((MODEL.toMs - DAY - en) / DAY);
    } else {
      lo = Math.ceil((MODEL.fromMs - s) / DAY);
      hi = Math.floor((MODEL.toMs - DAY - en) / DAY);
    }

    if (lo > hi) return 0;                 /* nowhere legal to go */
    if (days < lo) days = lo;
    if (days > hi) days = hi;
    return days;
  }

  /* where this gesture puts the balloon's two dates */
  function dragDates(d, days, mode) {
    if (d.kind === 'target') return { start: plus(d.start, days), end: plus(d.start, days) };
    if (mode === 'start')    return { start: plus(d.start, days), end: d.end };
    if (mode === 'end')      return { start: d.start, end: plus(d.end, days) };
    return { start: plus(d.start, days), end: plus(d.end, days) };
  }

  /* the date remark, in the exact words selDates() renders at rest — so the
     line the tray shows mid-drag is the line it will show after the commit */
  function dragLabel(d, dates) {
    if (d.kind === 'target') return D.fmtDateY(dates.start);
    return D.fmtDateY(dates.start) + ' – ' + D.fmtDateY(dates.end) +
           ' · ' + D.days(D.daysBetween(dates.start, dates.end));
  }

  /* Mid-drag, write straight to the DOM: no render pass fires until the drop,
     so the balloon, its title, and the tray's date remark are all moved by
     hand. Everything here is undone by putting the balloon back on a cancel.

     v1.2.3 — `days` (the current whole-day shift) is now also passed in, so
     a project-bar drag can repaint its task bars by the very same delta,
     and a task-bar drag can repaint the project bar around the union of
     every span with this one substituted — pixels only, nothing commits
     until the drop; see the header above rowHtml() for why this can never
     fall out of step with what actually gets written. */
  function paint(d, dates, days) {
    var a = MODEL.pos(dates.start), b = MODEL.pos(dates.end);
    d.el.style.left = pct(a);
    if (d.kind !== 'target') d.el.style.width = pct(Math.max(1.4, b - a));

    var text = dragLabel(d, dates);
    try {
      d.el.setAttribute('title', d.name + ' · ' + text);
      if (d.kind === 'target') {
        d.el.setAttribute('data-date', dates.start);
      } else {
        d.el.setAttribute('data-start', dates.start);
        d.el.setAttribute('data-end', dates.end);
      }
    } catch (err) { /* older engines */ }

    /* a task drag repaints the project bar around the union of every span,
       this one included, at its dragged position */
    if (d.kind === 'phase' && d.pbar && d.allSpans) {
      var lo = null, hi = null;
      d.allSpans.forEach(function (s, i) {
        var st = (i === d.idx) ? dates.start : s.start;
        var en = (i === d.idx) ? dates.end : s.end;
        lo = lo === null ? st : earlier(lo, st);
        hi = hi === null ? en : later(hi, en);
      });
      var pa = MODEL.pos(lo), pb = MODEL.pos(hi);
      d.pbar.el.style.left = pct(pa);
      d.pbar.el.style.width = pct(Math.max(1.4, pb - pa));
    }

    /* a project-bar drag shifts every task bar underneath it by the same
       number of days — the exact bulk shift commit() will write on drop */
    if (d.kind === 'project' && d.kids && d.kids.length) {
      d.kids.forEach(function (k) {
        var ns = plus(k.start0, days), ne = plus(k.end0, days);
        var ka = MODEL.pos(ns), kb = MODEL.pos(ne);
        k.el.style.left = pct(ka);
        k.el.style.width = pct(Math.max(1.4, kb - ka));
      });
    }

    /* the tray belongs to the selection; only touch it when it is this balloon */
    var sel = CBP.state.ui.p5Sel;
    if (!sel || sel.pid !== d.pid || sel.kind !== d.kind || sel.idx !== d.idx) return;
    var node = document.querySelector('.p5-edit .p5-editlab .num');
    if (node) node.textContent = text;
  }

  /* ------------------------------------------------------------- commit -- */

  /* Both paths — drag drop and keyboard nudge — land here, so there is exactly
     one way a timeline date reaches the store. A phases-only save deliberately
     leaves ui.returnTo alone (CORE contract), so no "Back to projects" bar
     jumps over the chart.

     v1.2.3 — the project bar is never itself stored: it is always the union
     spansFor(p) draws from the record's real phases, or from target_date
     when there are none. Children are the single source of truth either
     way, so "move the project" (kind 'project') is deliberately just sugar
     for shifting every one of those same fields by the same number of days
     — a phased project gets every phase shifted together (each phase keeps
     its own length), a phase-less project gets its target_date shifted.
     There is nothing else to go out of sync, by construction. */
  function commit(kind, pid, idx, days, mode) {
    mode = mode || 'move';
    var p = CBP.projectById(pid);
    if (!p || !days) { CBP.render(); return; }
    if (!mayMove(CBP.state.user, p)) { CBP.render(); return; }

    var res;
    if (kind === 'target') {
      if (!p.target_date) { CBP.render(); return; }
      res = A.projectUpdate(pid, { target_date: plus(p.target_date, days) });
      /* a target move is a timeline gesture, not a record save: projectUpdate
         arms ui.returnTo for record saves, which would leave a stale "Back to
         projects" bar on the next P4 visit — clear it here (audit fix). */
      if (res && res.ok) CBP.state.ui.returnTo = null;
    } else if (kind === 'project') {
      var kidPhases = D.phases(p);
      if (kidPhases.length) {
        var shifted = kidPhases.map(function (x) {
          var o = {}, k;
          for (k in x) { if (Object.prototype.hasOwnProperty.call(x, k)) o[k] = x[k]; }
          o.start = plus(x.start, days);
          o.end = plus(x.end, days);
          return o;
        });
        res = A.projectUpdate(pid, { phases: shifted });
      } else {
        /* v1.2.3 audit — shift the RECORD's own target_date, never the
           drawn window's end. spansFor() deliberately SWAPS start and end
           when the target date has already passed, so that the "target
           passed" band reads left-to-right; reading spans[0].end back here
           therefore picked up TODAY, not the target date, on exactly the
           projects the flag calls "over by N d". One +1 d nudge on
           WE26BGD0002 moved its target from 30 Jun 26 to 29 Aug 26 — a
           60-day jump from a one-day gesture, written silently, with the
           tray still saying "Moving Project timeline 30 Jun 26 – 28 Aug 26".
           A phase-less bar with no stored target date has nothing to write
           at all and is no longer draggable (see rowHtml's plive), so this
           guard is the second lock, not the first. */
        if (!p.target_date) { CBP.render(); return; }
        res = A.projectUpdate(pid, { target_date: plus(p.target_date, days) });
        if (res && res.ok) CBP.state.ui.returnTo = null;
      }
    } else {
      var sorted = D.phases(p);
      var moved = sorted[idx];
      if (!moved) { CBP.render(); return; }

      /* the last guard before the store: whatever the pointer or the tray asked
         for, a phase leaves here with start strictly before end */
      var ns = (mode === 'end') ? moved.start : plus(moved.start, days);
      var ne = (mode === 'start') ? moved.end : plus(moved.end, days);
      if (D.daysBetween(ns, ne) < MIN_SPAN_DAYS) { CBP.render(); return; }

      var out = (p.phases || []).map(function (x) {
        var o = {}, k;
        for (k in x) { if (Object.prototype.hasOwnProperty.call(x, k)) o[k] = x[k]; }
        if (x === moved) { o.start = ns; o.end = ne; }
        return o;
      });
      res = A.projectUpdate(pid, { phases: out });
    }
    /* the action renders on success; a refusal only leaves ui.err behind */
    if (!res || !res.ok) CBP.render();
  }

  /* ------------------------------------------------------------- events -- */

  document.addEventListener('pointerdown', function (ev) {
    if (!onP5()) return;
    var t = closest(ev.target, '[data-p5drag]');
    if (!t) return;

    var pid = t.getAttribute('data-pid');
    var p = CBP.projectById(pid);
    if (!p || !mayMove(CBP.state.user, p)) return;

    var track = closest(t, '.p5-track');
    var rect = track && track.getBoundingClientRect ? track.getBoundingClientRect() : null;
    if (!rect || !rect.width) return;

    /* v1.2.3 — data-p5drag now names the kind directly: 'phase' | 'target' |
       'project'. The grips are ~9px of a TASK bar at each end (see .p5-h in
       p5p9.css), so the middle keeps the whole-bar move it has always had
       and the ends change one date each. A diamond is a single date and the
       project bar is a whole-project move — neither has ends. */
    var dragKind = t.getAttribute('data-p5drag');
    var isTarget = dragKind === 'target';
    var grip = (dragKind === 'phase') ? closest(ev.target, '[data-p5end]') : null;
    var mode = grip ? grip.getAttribute('data-p5end') : 'move';

    /* v1.2.3 audit — how the bar is PAINTED mid-gesture, which is not always
       how it is clamped or committed. A phase-less project bar spans an
       anchored end (today, or the approval date) and the target date; only
       the target end can actually move, so sliding the whole bar showed the
       user a window that the drop would not produce. `mode` still drives
       clampDays and commit(); `pmode` drives the pixels and the tray line
       so both tell the same truth as the write. */
    var pmode = mode;
    if (dragKind === 'project' && !D.phases(p).length) {
      pmode = (p.target_date && p.target_date === t.getAttribute('data-start'))
        ? 'start' : 'end';
    }

    var idx = parseInt(t.getAttribute('data-idx'), 10) || 0;
    var ph = (dragKind === 'phase') ? D.phases(p)[idx] : null;

    /* the sync partners for the other side of the gesture (paint() below):
       dragging a task bar repaints the project bar around it; dragging the
       project bar repaints every task bar underneath it. Both are read once,
       at gesture start, and only ever used to move pixels before the drop. */
    var pbarNode = (dragKind === 'phase') ? track.querySelector('.p5-pbar') : null;
    var pbarInfo = pbarNode
      ? { el: pbarNode, left0: pbarNode.style.left, width0: pbarNode.style.width } : null;

    var kids = [];
    if (dragKind === 'project') {
      var kidNodes = track.querySelectorAll('.p5-bar.task');
      for (var ki = 0; ki < kidNodes.length; ki++) {
        var kn = kidNodes[ki];
        kids.push({
          el: kn, start0: kn.getAttribute('data-start'), end0: kn.getAttribute('data-end'),
          left0: kn.style.left, width0: kn.style.width
        });
      }
    }

    DRAG = {
      el: t,
      kind: dragKind,
      mode: mode,
      pmode: pmode,
      pid: pid,
      idx: idx,
      name: isTarget ? 'Target date' : dragKind === 'project' ? 'Project timeline' : ((ph && ph.phase) || 'Phase'),
      start: isTarget ? t.getAttribute('data-date') : t.getAttribute('data-start'),
      end: isTarget ? t.getAttribute('data-date') : t.getAttribute('data-end'),
      x0: ev.clientX,
      w: rect.width,
      left0: t.style.left,
      width0: t.style.width,
      title0: t.getAttribute('title'),
      pbar: pbarInfo,
      kids: kids,
      allSpans: (dragKind === 'phase') ? spansFor(p).spans.map(function (s) { return { start: s.start, end: s.end }; }) : null,
      days: 0,
      moved: false
    };
    try { t.setPointerCapture(ev.pointerId); } catch (err) { /* older engines */ }
    ev.preventDefault();
  });

  document.addEventListener('pointermove', function (ev) {
    if (!DRAG || !MODEL) return;
    var dx = ev.clientX - DRAG.x0;
    if (Math.abs(dx) > 3) DRAG.moved = true;

    var days = clampDays(DRAG, Math.round(dx / DRAG.w * MODEL.totalDays), DRAG.mode);
    DRAG.days = days;
    var dates = dragDates(DRAG, days, DRAG.pmode || DRAG.mode);
    paint(DRAG, dates, days);
    showTip(ev, DRAG.name + ' · ' + dragLabel(DRAG, dates));
  });

  /* put a balloon back exactly as it was drawn — a cancelled or zero-day
     gesture must leave no trace at all, in the DOM or in the store */
  function restore(d) {
    d.el.style.left = d.left0;
    if (d.kind !== 'target') d.el.style.width = d.width0;
    try {
      if (d.title0 !== null && d.title0 !== undefined) d.el.setAttribute('title', d.title0);
      if (d.kind === 'target') {
        d.el.setAttribute('data-date', d.start);
      } else {
        d.el.setAttribute('data-start', d.start);
        d.el.setAttribute('data-end', d.end);
      }
    } catch (err) { /* older engines */ }

    if (d.pbar) { d.pbar.el.style.left = d.pbar.left0; d.pbar.el.style.width = d.pbar.width0; }
    if (d.kids && d.kids.length) {
      d.kids.forEach(function (k) { k.el.style.left = k.left0; k.el.style.width = k.width0; });
    }

    var sel = CBP.state.ui.p5Sel;
    if (!sel || sel.pid !== d.pid || sel.kind !== d.kind || sel.idx !== d.idx) return;
    var node = document.querySelector('.p5-edit .p5-editlab .num');
    if (node) node.textContent = dragLabel(d, { start: d.start, end: d.end });
  }

  function endDrag(ev) {
    if (!DRAG) return;
    var d = DRAG;
    DRAG = null;
    hideTip();
    try { d.el.releasePointerCapture(ev.pointerId); } catch (err) { /* noop */ }

    if (!d.moved || !d.days) {
      /* a tap, or a wobble smaller than a day — put the balloon back and let the
         click handler turn it into a selection */
      restore(d);
      return;
    }
    SUPPRESS = 1;
    CBP.state.ui.p5Sel = { pid: d.pid, kind: d.kind, idx: d.idx };
    commit(d.kind, d.pid, d.idx, d.days, d.mode);
    /* R-03 — disarm on a fresh macrotask: it fires after this gesture's own
       trailing synthetic click (which, because commit() re-rendered and
       detached the target, never actually reaches the delegated handler), and
       before any later genuine click, so the flag can only ever eat this drop's
       own click and never the next real one. */
    setTimeout(function () { SUPPRESS = 0; }, 0);
  }

  document.addEventListener('pointerup', endDrag);

  /* a cancelled gesture (scroll take-over, lost capture) puts the balloon back
     and writes nothing */
  document.addEventListener('pointercancel', function () {
    if (!DRAG) return;
    var d = DRAG;
    DRAG = null;
    hideTip();
    restore(d);
  });

  /* click = the keyboard-and-mouse fallback path: select, nudge, dismiss */
  document.addEventListener('click', function (ev) {
    if (!onTimelineRoute()) return;
    var t = closest(ev.target, '[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    if (act !== 'p5sel' && act !== 'p5nudge' && act !== 'p5done') return;
    ev.preventDefault();

    if (act === 'p5done') {
      CBP.state.ui.p5Sel = null;
      CBP.state.ui.err = null;
      CBP.render();
      return;
    }

    if (act === 'p5sel') {
      if (SUPPRESS) { SUPPRESS = 0; return; }
      var pid = t.getAttribute('data-pid');
      var p = CBP.projectById(pid);
      if (!p || !mayMove(CBP.state.user, p)) return;
      /* v1.2.3 — data-p5drag now carries the kind directly ('phase' | 'target'
         | 'project'); a stray/legacy button with none falls back to 'phase'. */
      var next = {
        pid: pid,
        kind: t.getAttribute('data-p5drag') || 'phase',
        idx: parseInt(t.getAttribute('data-idx'), 10) || 0
      };
      var cur = CBP.state.ui.p5Sel;
      CBP.state.ui.p5Sel = (cur && cur.pid === next.pid && cur.kind === next.kind &&
                            cur.idx === next.idx) ? null : next;
      CBP.state.ui.err = null;
      CBP.render();
      return;
    }

    /* p5nudge — ±1 day on whatever is selected, whole balloon or one end.
       Same commit path as the drag, so the same guard and the same log line.
       Neither the target diamond nor the project bar has ends of its own. */
    var sel = CBP.state.ui.p5Sel;
    if (!sel) return;
    var dir = parseInt(t.getAttribute('data-dir'), 10);
    var mode = t.getAttribute('data-mode') || 'move';
    if (sel.kind === 'target' || sel.kind === 'project') mode = 'move';
    commit(sel.kind, sel.pid, sel.idx, dir === -1 ? -1 : 1, mode);
  });

  /* v1.2.2 — the country chips in the top bar's country segment. Page-owned
     act, page-owned state (state.ui.flt.p5.countries), so no kit or
     actions.js listener ever sees it. */
  document.addEventListener('click', function (ev) {
    if (!onTimelineRoute()) return;
    var t = closest(ev.target, '[data-act="p5-country"]');
    if (!t) return;
    ev.preventDefault();

    var code = t.getAttribute('data-cc');
    var f = K.flt('p5');
    var codes = D.visibleCountries(CBP.state.user, CBP.state.countries);

    if (!code) {
      f.countries = null;
    } else {
      var cur = (f.countries && f.countries.length) ? f.countries.slice() : codes.slice();
      var idx = cur.indexOf(code);
      if (idx > -1) cur.splice(idx, 1); else cur.push(code);
      f.countries = (!cur.length || cur.length === codes.length) ? null : cur;
    }
    ev.stopImmediatePropagation();
    CBP.render();
  });

  /* v1.2.2 audit — the page-owned p5-reset button and its listener are both
     gone: K.filterBar's own Clear filters now wipes every key in flt.p5,
     including the countries/project/q this file added to the bag, so a second
     control would only be a second thing to keep in step. */

  /* the owned free-text box, now rendered in K.filterBar's standard k-fb-q
     slot via search:{ act, value } — p5 has no legacy search key for the
     kit's own k-q input to bind to, so it passes its value in. */
  document.addEventListener('input', function (ev) {
    var t = closest(ev.target, '[data-act="p5-q"]');
    if (!t) return;
    K.flt('p5').q = t.value;
    CBP.render();
    var again = document.getElementById(t.id);
    if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
  });

  /* exposed for the build harness: the same commit path the UI uses, plus the
     frame the pointer handlers are currently measuring against */
  CBP.p5 = {
    commit: commit, spansFor: spansFor, model: model, clampDays: clampDays,
    frame: function () { return MODEL; }
  };

})();
