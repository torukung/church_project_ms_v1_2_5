/* ui.js — shared components. Every function returns an HTML string; pages
   compose them and app.js writes the result in one pass. */
(function () {
  'use strict';
  var U = {};
  CBP.ui = U;
  var D = CBP.D;

  U.esc = function (s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };
  var e = U.esc;

  /* ------------------------------------------------------- C-13 pill ---- */

  U.statusPill = function (status) {
    var s = CBP.CONFIG.STATUS[status] || CBP.CONFIG.STATUS.declined;
    return '<span class="pill p-' + s.key + '"><span class="dot"></span>' + e(s.label) + '</span>';
  };

  /* --------------------------------------------------- C-17 progress ---- */

  U.progressBar = function (project) {
    var pr = D.progress(project);
    if (pr.mode === 'bar') {
      return '<span class="prog"><span class="pb ' + (pr.tone || '') + '">' +
             '<i style="width:' + Math.round(pr.pct) + '%"></i></span>' +
             '<span class="pc">' + e(pr.label) + '</span></span>';
    }
    if (pr.mode === 'na') {
      return '<span class="prog"><span class="na">' + e(pr.label) + '</span></span>';
    }
    return '<span class="prog"><span class="na">—</span></span>';
  };

  /* --------------------------------------------- attention pill / cell -- */

  U.attentionPill = function (text, severity) {
    return '<span class="tagpill ' + (severity || '') + '">' + e(text) + '</span>';
  };

  /* C-03 aligned budget bar (v1.0.1 helper the change packs relied on; restored
     in v1.1.0 because the base ui.js never shipped it). pct is a coverage %,
     scale is the shared column scale from D.barScale so the 100% rule lands on
     the same x for every row. opts: { scale, sm, label, title } */
  U.budgetBar = function (pct, opts) {
    opts = opts || {};
    var v = D.barPct(pct);
    var scale = (typeof opts.scale === 'number' && opts.scale > 0) ? opts.scale : D.barScale([v]);
    var cls = D.coverageClass(v);
    var fillW = Math.min(v, 100) / scale * 100;
    var overW = v > 100 ? (Math.min(v, scale) - 100) / scale * 100 : 0;
    var rule = 100 / scale * 100;
    var html = '<span class="ubar-wrap' + (opts.sm ? ' sm' : '') + '"' +
      (opts.title ? ' title="' + e(opts.title) + '"' : '') + '>' +
      '<span class="ubar">' +
        '<span class="ubar-fill' + (cls ? ' ' + cls : '') + '" style="width:' + fillW.toFixed(2) + '%"></span>' +
        (overW > 0 ? '<span class="ubar-over" style="left:' + rule.toFixed(2) + '%;width:' + overW.toFixed(2) + '%"></span>' : '') +
        '<span class="ubar-rule" style="left:' + rule.toFixed(2) + '%"></span>' +
      '</span>';
    if (opts.label !== false) {
      html += '<span class="ubar-val num' + (cls === 'over' ? ' neg' : '') + '">' + e(D.pct(v)) + '</span>';
    }
    return html + '</span>';
  };

  /* ============================== v1.1.0 · C-21 country chips (S-12) ======
     Promoted from pages/p3.js so P12 (Contracts) and any later surface reuse
     ONE component. Each surface owns its state key and data-act namespace:
       U.countryChips({ state, stateKey:'p12Countries', actPrefix:'p12',
                        codes, counts:{code:n}, label:'Countries', hint })
     emits .cselect > .cchip.cc-xxx.ccsel with data-act="<prefix>-country" /
     "<prefix>-countries-all". Tint binds to the .ccsel class (F13), not the act.
     The dashboard C-20 scope engine in widgets.js is a different component and
     is deliberately untouched (F14). P3 keeps its own listener + key. */
  /* v1.2.1 R3 — simplified inline SVG flags (16×12). Emoji flags rendered as
     two letters on Windows Chrome/Edge; SVG is identical everywhere. */
  var FLAG = {
    BGD: '<svg viewBox="0 0 16 12"><rect width="16" height="12" fill="#006A4E"/><circle cx="7" cy="6" r="3.4" fill="#F42A41"/></svg>',
    NPL: '<svg viewBox="0 0 16 12"><rect width="16" height="12" fill="#F4F5F3"/><path d="M3 0.6h1.2L10 5.2H6.4l4.6 5.4V11.4H3z" fill="#003893"/><path d="M3.8 1.4h0.4l4.4 3.2H5.4l4 4.8v1.2H3.8z" fill="#DC143C"/><circle cx="6" cy="8" r="1.1" fill="#fff"/><circle cx="6" cy="4" r="0.7" fill="#fff"/></svg>',
    KHM: '<svg viewBox="0 0 16 12"><rect width="16" height="12" fill="#032EA1"/><rect y="3" width="16" height="6" fill="#E00025"/><path d="M6 8h4V6.6H9.3V5.6H8.6V4.8H7.4v0.8H6.7v1H6z" fill="#fff"/></svg>',
    IND: '<svg viewBox="0 0 16 12"><rect width="16" height="4" fill="#FF9933"/><rect y="4" width="16" height="4" fill="#fff"/><rect y="8" width="16" height="4" fill="#138808"/><circle cx="8" cy="6" r="1.5" fill="none" stroke="#000080" stroke-width="0.6"/></svg>',
    MMR: '<svg viewBox="0 0 16 12"><rect width="16" height="4" fill="#FECB00"/><rect y="4" width="16" height="4" fill="#34B233"/><rect y="8" width="16" height="4" fill="#EA2839"/><path d="M8 2.2l1.1 3.3h3.4l-2.8 2 1.1 3.3L8 8.8 5.2 10.8l1.1-3.3-2.8-2h3.4z" fill="#fff"/></svg>',
    LAO: '<svg viewBox="0 0 16 12"><rect width="16" height="12" fill="#CE1126"/><rect y="3" width="16" height="6" fill="#002868"/><circle cx="8" cy="6" r="2.3" fill="#fff"/></svg>',
    HKG: '<svg viewBox="0 0 16 12"><rect width="16" height="12" fill="#DE2910"/><g fill="#fff"><circle cx="8" cy="3.6" r="1.1"/><circle cx="10.3" cy="5.3" r="1.1"/><circle cx="9.4" cy="8" r="1.1"/><circle cx="6.6" cy="8" r="1.1"/><circle cx="5.7" cy="5.3" r="1.1"/></g><circle cx="8" cy="6" r="1" fill="#DE2910"/></svg>'
  };
  U.flagOf = function (code) { return FLAG[String(code || '').toUpperCase()] || ''; };
  U.ccOf = function (code) {
    var k = String(code || '').toUpperCase();
    return FLAG[k] ? 'cc-' + k.toLowerCase() : 'cc-x';
  };
  U.flagMark = function (code) {
    var f = U.flagOf(code);
    return f ? '<span class="ccflag" aria-hidden="true">' + f + '</span>' : '';
  };
  /* self-repairing selection: null = all; drops codes that left the scope */
  U.selectedCodes = function (state, stateKey, codes) {
    var sel = state.ui[stateKey];
    if (!sel || Object.prototype.toString.call(sel) !== '[object Array]' || !sel.length) {
      state.ui[stateKey] = null; return codes.slice();
    }
    var keep = codes.filter(function (c) { return sel.indexOf(c) > -1; });
    if (!keep.length || keep.length === codes.length) { state.ui[stateKey] = null; return codes.slice(); }
    if (keep.length !== sel.length) state.ui[stateKey] = keep;
    return keep;
  };
  U.toggleCountry = function (state, stateKey, codes, code) {
    if (codes.indexOf(code) === -1) return;
    var sel = state.ui[stateKey];
    if (!sel || Object.prototype.toString.call(sel) !== '[object Array]' || !sel.length) {
      state.ui[stateKey] = [code]; return;
    }
    var next = codes.filter(function (c) { return c === code ? sel.indexOf(c) === -1 : sel.indexOf(c) > -1; });
    state.ui[stateKey] = (!next.length || next.length === codes.length) ? null : next;
  };
  U.countryChips = function (o) {
    var state = o.state, codes = o.codes || [], counts = o.counts || {};
    var sel = U.selectedCodes(state, o.stateKey, codes);
    var all = sel.length === codes.length;
    var chips = '<button class="cchip' + (all ? ' on' : '') + '" data-act="' + e(o.actPrefix) +
      '-countries-all" aria-pressed="' + (all ? 'true' : 'false') + '">All countries <span class="n num">' +
      codes.length + '</span></button>';
    chips += codes.map(function (code) {
      var c = state.countries.filter(function (x) { return x.code === code; })[0];
      var on = !all && sel.indexOf(code) > -1;
      var n = counts[code] === undefined ? '' : ' <span class="n num">' + counts[code] + '</span>';
      return '<button class="cchip ccsel ' + U.ccOf(code) + (on ? ' on' : '') + '" data-act="' + e(o.actPrefix) +
        '-country" data-c="' + e(code) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        U.flagMark(code) + e(c ? c.name : code) + n + '</button>';
    }).join('');
    /* v1.2.2 audit — `label:false` suppresses the group's own label, matching
       the `hint:false` convention just below. Inside K.viewBar's country
       segment the bar already draws a .k-blab, and a second label there read
       "Countries Countries". */
    return '<div class="cselect" role="group" aria-label="Filter by country">' +
      (o.label === false ? '' : '<span class="cslab">' + e(o.label || 'Countries') + '</span>') + chips +
      (o.hint === false ? '' : '<span class="cshint">' + e(o.hint || (all ? 'Showing every country in your scope.' : 'Totals below follow this selection.')) + '</span>') +
      '</div>';
  };

  U.coverageCell = function (coverage) {
    if (coverage === null || coverage === undefined) {
      return '<span class="covcell"><span class="covbar"><i style="width:0"></i></span>' +
             '<span class="cv">—</span></span>';
    }
    var cls = D.coverageClass(coverage);
    var val = cls === 'over'
      ? '<span class="cv neg num">' + D.pct(coverage) + '</span>'
      : '<span class="cv num">' + D.pct(coverage) + '</span>';
    return '<span class="covcell"><span class="covbar ' + cls + '">' +
           '<i style="width:' + Math.min(coverage, 100) + '%"></i></span>' + val + '</span>';
  };

  /* ------------------------------------------------------ card / kpi ---- */

  U.card = function (title, body, opts) {
    opts = opts || {};
    var h = title
      ? '<h2>' + e(title) + (opts.more ? '<span class="more">' + e(opts.more) + '</span>' : '') + '</h2>'
      : '';
    return '<section class="card' + (opts.cls ? ' ' + opts.cls : '') + '">' + h + body + '</section>';
  };

  U.kpi = function (label, value, sub, alert) {
    return '<div class="kpi ' + (alert ? 'alert' : 'ok') + '">' +
           '<div class="k">' + e(label) + '</div>' +
           '<div class="v num">' + e(value) + '</div>' +
           '<div class="d">' + e(sub) + '</div></div>';
  };

  U.kpiRow = function (kpis) {
    return '<div class="kpis">' + kpis.join('') + '</div>';
  };

  /* ------------------------------------------------------- C-04 table --- */

  U.table = function (cols, rows) {
    var head = cols.map(function (c) {
      return '<th' + (c.right ? ' class="r"' : '') + '>' + e(c.label) + '</th>';
    }).join('');
    return '<div class="tblwrap"><table class="tbl"><thead><tr>' + head +
           '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>';
  };

  /* ------------------------------------------- C-16 one-line stepper ----
     v1.2.0 · T-08 — the five/six-pill C-16 ladder and its two-pill declined
     early return are gone; U.stepper now lives in the FLOW block at the foot of
     this file and renders exactly four rungs from D.rungOf(p). U.stepline is
     kept as the generic pill-row renderer for anything that still wants one. */

  U.stepline = function (steps) {
    var out = '<div class="stepline">';
    steps.forEach(function (s, i) {
      if (i) out += '<span class="conn' + (steps[i - 1].st === 'ok' ? ' ok' : '') + '"></span>';
      out += '<span class="sl ' + s.st + '"><span class="mk">' + e(s.mark) + '</span>' +
             '<b>' + e(s.label) + '</b>' +
             (s.sub ? ' <small>' + e(s.sub) + '</small>' : '') + '</span>';
    });
    return out + '</div>';
  };

  /* =========================== v1.1.0 · C-15b one gate step (EGC · §2) =====
     ONE fragment for a single system's gate state, used by the P3 panel, the
     P4 gate tracker, the P6 inbox cards and P10, so no two surfaces can tell a
     different story about the same gate (S-01). It renders what is known and
     nothing else:

       state pill · source chip · reference · deep link · outbound sync chip

     opts: { compact:true } drops the sub-line and the deep link label prose;
           { label:false }   drops the system name (the caller already printed it);
           { pill:false }    drops the state pill (v1.2.3 — the caller already
                              said "approved"/"waiting Nd" in its own sentence).
     The retry control appears only for the area office (D.can 'integrations'). */

  var GS_SOURCE = {
    manual: 'manual',
    portal: 'via portal',
    sim:    'via sim',
    excel:  'excel import',
    email:  'via e-mail',
    flow:   'via flow',
    rest:   'via API'
  };

  var GS_OP = {
    lodge: 'lodge',
    contract_sent: 'contract ref',
    reconcile: 'reconcile',
    status_mirror: 'status mirror'
  };

  U.gateStep = function (p, sys, opts) {
    opts = opts || {};
    var g = D.gateSystem(p, sys);
    var user = CBP.state.user;

    var pill, sub;
    if (g.state === 'approved') {
      pill = '<span class="p4-gp ok">approved ✓</span>';
      sub = (g.submitted_at && g.approved_at)
        ? 'submitted ' + D.fmtDateY(g.submitted_at) + ' → approved ' + D.fmtDateY(g.approved_at) +
          ' · <b class="num">' + D.days(g.days) + '</b>'
        : (g.approved_at ? 'approved ' + D.fmtDateY(g.approved_at)
                         : 'cleared before the demo window');
    } else if (g.state === 'waiting') {
      pill = '<span class="p4-gp ' + (g.overdue ? 'hot' : 'wait') + '">waiting <span class="num">' +
             D.days(g.days) + '</span></span>';
      sub = 'submitted ' + D.fmtDateY(g.submitted_at) + ', no approval yet' +
            (g.overdue ? ' · past the ' + CBP.CONFIG.GATE_THRESHOLD_DAYS + '-day threshold' : '');
    } else {
      pill = '<span class="p4-gp todo">not lodged</span>';
      sub = 'nothing lodged with this system yet';
    }

    /* who said so — the last audit row for the step this pill is showing */
    var step = g.state === 'approved' ? 'approved' : 'submitted';
    var src = D.gateSource ? D.gateSource(p, sys, step) : null;
    var bits = [];

    if (src) {
      bits.push('<span class="gs-src' + (src.confidence === 'advisory' ? ' adv' : '') + '">' +
        e(GS_SOURCE[src.source] || src.source) +
        (src.confidence === 'advisory' ? ' · advisory' : '') + '</span>');
    } else if (g.state !== 'todo') {
      bits.push('<span class="gs-src">manual</span>');
    }

    var ref = g.ref || (src && src.ref) || null;
    if (ref) bits.push('<span class="gs-ref num">ref ' + e(ref) + '</span>');

    /* S-06 — the outbound queue, shown wherever the gate shows */
    var q = D.syncFor ? D.syncFor(p, sys) : null;
    if (q) {
      var cls = q.status === 'ok' ? 'ok' : (q.status === 'failed' ? 'failed' : 'queued');
      bits.push('<span class="gs-sync ' + cls + '" title="' + e(q.err || q.id) + '">sync ' +
        e(GS_OP[q.op] || q.op) + ' · ' + e(q.status) + '</span>');
      if (q.status === 'failed' && D.can(user, 'integrations')) {
        bits.push('<button class="btn sm" data-act="p4g-retry" data-id="' + e(q.id) +
          '">Retry</button>');
      }
    }

    /* S-07 — a deep link is offered in every mode, whenever one can be built */
    var url = D.deepLink ? D.deepLink(p, sys) : null;
    if (url) {
      bits.push('<a class="gs-link" href="' + e(url) + '" target="_blank" rel="noopener">' +
        'Open in ' + e(g.label) + ' ↗</a>');
    }

    return '<div class="gs">' +
      '<div class="gs-hd">' +
        (opts.label === false ? '' : '<b>' + e(g.label) + '</b>') +
        (opts.pill === false ? '' : pill) +
        (opts.mode === false ? '' : '<span class="gs-mode">' +
          e(D.syncMode ? D.syncMode(sys) : 'manual') + '</span>') +
      '</div>' +
      (bits.length ? '<div class="gs-line">' + bits.join('') + '</div>' : '') +
      (opts.compact ? '' : '<div class="gs-sub">' + sub +
        (g.remark ? '<em class="p4-grem">Remark: ' + e(g.remark) + '</em>' : '') + '</div>') +
      '</div>';
  };

  /* ------------------------------------------------------- C-06 gantt --- */

  U.gantt = function (p) {
    var m = D.ganttModel(p);
    if (!m) return '';
    var L = 'var(--gantt-label)';
    var pos = function (u) {
      return 'calc(' + L + ' + (100% - ' + L + ') * ' + (u / m.cells) + ')';
    };

    var html = '<div class="gantt"><div class="gantt-scroll"><div class="gantt-inner">';

    /* v1.2.3 — the "today · <date>" pill is gone; K.todayMark (uikit) draws
       the line and perches the shared chapel glyph on top of it, date on
       hover/focus. cls:'' falls through K.todayMark's own `o.cls || 'k'` to
       the default prefix, so the line comes out ".k-today" — app.css styles
       that class (renamed from the old ".today" rule). The marker chip
       itself is uikit.css's own §9, untouched here. */
    if (m.todayUnit !== null) {
      html += CBP.K.todayMark({ left: pos(m.todayUnit), label: m.todayLabel, cls: '' });
    }

    html += '<div class="gm"><div class="gl">Phase</div><div class="mrow">' +
            m.heads.map(function (h) { return '<div class="mh">' + e(h) + '</div>'; }).join('') +
            '</div></div>';

    m.bars.forEach(function (b) {
      var pctTxt = b.planned ? 'planned' : D.pct(b.pct);
      var fill = (!b.planned && b.pct > 0)
        ? '<div class="fill' + (b.pct >= 100 ? ' full' : '') + '" style="width:' +
          Math.min(100, Math.round(b.pct)) + '%"></div>' : '';
      /* D-14 — the owner's name shows under each phase label on the Gantt */
      html += '<div class="grow2" title="' +
              e(b.label + ' · ' + D.fmtDate(b.start) + ' – ' + D.fmtDate(b.end)) + '">' +
              '<div class="gl"><b>' + e(b.label) + '</b>' +
              '<small>' + e(b.owner ? CBP.userName(b.owner) : 'unassigned') + '</small></div>' +
              /* v1.2.3 audit — the in-bar label is the FIGURE alone. It used to
                 read "<phase> · <pct>" inside a box only as wide as the phase
                 itself, so at 768 and below it ellipsised to "Proc…" and the
                 percentage — the only place progress is stated anywhere on
                 this chart — disappeared. The phase name is already set in
                 the label column immediately to the left and in the row's
                 title, so dropping it from the bar costs nothing and lets the
                 number fit in almost any bar. */
              '<div class="track"><div class="bar ' +
              (b.planned ? 'plan' : b.variant) + '" style="grid-column:' + b.col +
              /* …and a PLANNED bar carries no label at all: "planned" does not
                 fit a short future phase's bar and rendered "pl…", while the
                 dashed outline and the caption under the chart already say
                 exactly that. Only a real figure earns the space. */
              '/span ' + b.span + '">' + fill + '<i></i>' +
              (b.planned ? '' : '<span>' + e(pctTxt) + '</span>') +
              '</div></div></div>';
    });

    return html + '</div></div></div>';
  };

  /* ------------------------------------------------------- C-12 modal --- */

  U.modal = function (title, body, acts) {
    return '<div class="modal-wrap" data-act="modal-close"><div class="modal">' +
           '<h3>' + e(title) + '</h3>' + body +
           '<div class="acts">' + (acts || '') + '</div></div></div>';
  };

  /* ----------------------------------------------------- misc helpers --- */

  U.btn = function (label, opts) {
    opts = opts || {};
    return '<button class="btn' + (opts.brass ? ' brass' : '') + (opts.sm ? ' sm' : '') +
           (opts.action ? ' act' : '') + '"' +
           (opts.act ? ' data-act="' + e(opts.act) + '"' : '') +
           (opts.id ? ' data-id="' + e(opts.id) + '"' : '') +
           (opts.disabled ? ' disabled' : '') + '>' + e(label) + '</button>';
  };

  /* an action control — rendered only when can() says so */
  U.action = function (user, permission, project, label, opts) {
    if (!D.can(user, permission, project)) return '';
    opts = opts || {};
    opts.action = true;
    opts.act = opts.act || 'phaseb';
    opts.id = project ? project.id : '';
    return U.btn(label, opts);
  };

  U.phaseTag = function (phase) {
    return '<span class="phasetag">Phase ' + e(phase) + '</span>';
  };

  /* === v1.2.0 FLOW === =====================================================
     WP2 · the flow render layer. Everything here draws what D.rungOf,
     D.needsYou, D.projectTaskList, D.chainFor and D.portfolio derive — no page
     computes a rung, a wait or a chain of its own from now on. */

  /* ------------------------------------------------------- rung sub-line -- */

  /* the wording DRIVER_MEANING.manual gives the "manual" driver on the P9
     Integrations screen — reused verbatim here (v1.2.3) rather than a second
     phrase, plus the one thing P9's line doesn't need to say: the deep link
     still opens the live record even though nothing about it is automatic. */
  var GATE_MANUAL_NOTE = 'manual: no transport · dates typed in the portal — ' +
    'the ↗ link still opens the record over there.';

  function gateChipIsManual(p, sys) {
    var g = D.gateSystem(p, sys);
    var step = g.state === 'approved' ? 'approved' : 'submitted';
    var src = D.gateSource ? D.gateSource(p, sys, step) : null;
    return src ? src.source === 'manual' : g.state !== 'todo';
  }

  /* the html of every line D.rungOf put under the current rung. A gate line
     names its systems and U.gateStep draws the source chip + deep link for each
     (T-08); derive never builds that markup itself.

     v1.2.3 (ToR 12 Sep, item 3) — the gate line's own sentence ("Decision
     Point ✓ 26 Feb · with CHaS since 12 Feb, 197 d") already states each
     system's state and date; the per-system chip used to repeat exactly that
     (a state pill reading "approved ✓" / "waiting 197 d" a second time)
     before adding what the sentence can't: its source, its reference, its
     outbound sync state and the deep link out. U.rungSublineText keeps
     reading every sub[] line verbatim (the e-mail digest still says the same
     thing the sentence does), so the sentence itself stays — what changes is
     the chip: `pill:false` drops its restated state, `compact:true` drops its
     restated date, leaving only the facts the sentence never had. */
  U.rungSubline = function (p) {
    var r = D.rungOf(p);
    return r.sub.map(function (s) {
      var line = '<span class="sl-line' + (s.tone ? ' ' + s.tone : '') + '">' +
        (s.chip || '') + e(s.text) + '</span>';
      if (s.systems && s.systems.length) {
        var open = s.systems.filter(function (k) {
          var g = D.gateSystem(p, k);
          return g.state !== 'todo';
        });
        if (open.length) {
          var manual = open.some(function (k) { return gateChipIsManual(p, k); });
          line += '<span class="sl-gates">' + open.map(function (k) {
            return U.gateStep(p, k, { compact: true, mode: false, pill: false });
          }).join('') + (manual ? '<div class="gs-note">' + e(GATE_MANUAL_NOTE) + '</div>' : '') +
            '</span>';
        }
      }
      return line;
    }).join('');
  };

  /* the same wording with no markup — e-mail bodies and the digest read this */
  U.rungSublineText = function (p) {
    return D.rungOf(p).sub.map(function (s) { return s.text; })
      .filter(function (t) { return !!t; }).join('\n');
  };

  /* ------------------------------------------------- T-08 four-rung stepper */

  var RUNG_MARK = { ok: '✓', wait: '◷', todo: '◻', dead: '✕' };

  function rungState(r, n) {
    if (r.declined) {
      if (n > r.diedAt) return 'ok';
      if (n === r.diedAt) return 'dead';
      return 'todo';
    }
    if (n > r.n) return 'ok';            /* the ladder counts down: 4 → 1 */
    if (n === r.n) return n === 1 ? 'ok' : 'wait';
    return 'todo';
  }

  /* the small print under one pill — dates only, never a second sub-line */
  function rungPillSub(p, n, st) {
    if (n === 4) {
      if (st === 'ok') return p.submitted_at ? 'submitted ' + D.fmtDate(p.submitted_at) : 'recorded';
      if (st === 'dead') return 'never submitted';
      return p.target_date ? 'target ' + D.fmtDate(p.target_date) : 'not submitted';
    }
    if (n === 3) {
      if (st === 'ok') return p.gate_opened_at ? 'gate opened ' + D.fmtDate(p.gate_opened_at)
                                               : 'advanced to the gate';
      if (st === 'dead') return p.declined_at ? 'declined ' + D.fmtDate(p.declined_at) : 'declined';
      if (st === 'wait') return p.submitted_at ? 'submitted ' + D.fmtDate(p.submitted_at)
                                               : 'in review';
      return '';
    }
    if (n === 2) {
      if (st === 'ok' || st === 'wait') {
        return p.approved_at ? 'approved ' + D.fmtDate(p.approved_at) : 'marked approved';
      }
      if (st === 'dead') return p.declined_at ? 'declined ' + D.fmtDate(p.declined_at) : 'declined';
      return '';
    }
    if (st === 'ok') {
      return p.implementation_date ? 'started ' + D.fmtDate(p.implementation_date) : 'in implementation';
    }
    if (st === 'dead') return p.declined_at ? 'declined ' + D.fmtDate(p.declined_at) : 'declined';
    return '';
  }

  /* EXACTLY four pills, always — a declined project shows the rung it died at
     struck through with a Declined tag rather than a two-pill early return
     (T-08 / F15). The sub-line under the current rung comes from
     U.rungSubline, which reads the same D.rungOf(p).

     v1.2.3 (ToR 12 Sep, item 1/2) — the four rungs become equal-width grid
     tracks (CSS: .stepline is a 4-column grid) instead of content-sized
     pills, and .sl-sub — the frame U.rungSubline fills — is placed as a
     second row of that SAME grid, its `grid-column` start pinned to the rung
     that is actually current (D.rungOf(p).n), so its left edge shares the
     current rung's left edge exactly (per D.rungOf / the ladder in
     CORE_API_v1.2.0.md, the external gate detail only ever appears while
     n===3, i.e. Submitted — this generalises to "whichever rung is current"
     so every rung's own detail, not only the gate's, gets the same visible
     parentage). It spans to the last column rather than matching just the
     one rung's width, so the frame has room for gate chips/dates instead of
     being squeezed to a quarter of the row. */
  /* v1.2.5.2 Phase 2 — a stepped sub-line drawn in the SAME node grammar as the
     ladder above it (a node dot, a connector, a label; done / current /
     pending). It is not a standalone widget: U.stepper drops it into the .sl-sub
     frame under the current rung, so it reads as the rung expanding to show its
     own sub-steps. Done = --verd (the app's "done" green, filled dot + check),
     current = --brass accent ring, pending = --muted/--line hollow; the
     connector INTO a done-or-current node is --verd, otherwise --line. */
  U.subflow = function (caption, nodes) {
    if (!nodes || !nodes.length) return '';
    var line = nodes.map(function (n) {
      var word = n.state === 'done' ? 'done'
               : (n.state === 'cur' ? 'in progress' : 'pending');
      return '<span class="subflow-node is-' + n.state + '">' +
        '<span class="sfn-dot" aria-hidden="true">' +
          (n.state === 'done' ? '✓' : '') + '</span>' +
        '<span class="sfn-lab">' + e(n.label) +
          '<span class="vh"> — ' + word + '</span></span>' +
        '</span>';
    }).join('');
    return '<div class="subflow">' +
      '<div class="subflow-cap">' + e(caption) + '</div>' +
      '<div class="subflow-line">' + line + '</div></div>';
  };

  /* both Phase-2 lines, in order: the external gate first (it is the 3 → 2
     story), the Cooperation Agreement second (it lives inside status 2). The
     agreement line is omitted when no agreement is required. */
  U.stepFlows = function (p) {
    var out = '';
    var g = D.gateFlow ? D.gateFlow(p) : null;
    if (g) out += U.subflow('Decision Point and CHaS', g);
    var a = D.agreementFlow ? D.agreementFlow(p) : null;
    if (a) out += U.subflow('Cooperation Agreement', a);
    return out;
  };

  U.stepper = function (p, opts) {
    opts = opts || {};
    var r = D.rungOf(p);
    var labels = CBP.CONFIG.RUNG_LABELS || {};
    var prev = null;
    var curCol = 1;
    var cells = '';

    D.RUNGS.forEach(function (n, i) {
      var st = rungState(r, n);
      var cur = (n === r.n);
      if (cur) curCol = i + 1;
      var cls = (st === 'dead' ? 'wait sl-dead' : st) + (cur ? ' sl-cur' : '') +
        (i && prev === 'ok' ? ' sl-prevok' : '');
      var label = labels[n] || String(n);
      var sub = rungPillSub(p, n, st);
      cells += '<span class="sl ' + cls + '">' +
        '<span class="sl-row"><span class="mk">' + e(RUNG_MARK[st]) + '</span>' +
        '<b>' + (st === 'dead' ? '<s>' + e(label) + '</s>' : e(label)) + '</b>' +
        (st === 'dead' ? '<span class="sl-tag">Declined</span>' : '') + '</span>' +
        (sub ? '<small>' + e(sub) + '</small>' : '') + '</span>';
      prev = st;
    });

    /* the frame's tone follows the worst tone among the lines it holds, so a
       waiting/overdue gate still reads as the "time alert" it is even though
       the sentence that used to carry the colour on its own is gone */
    var tones = r.sub.map(function (s) { return s.tone; });
    var frameTone = tones.indexOf('hot') > -1 ? ' hot' : (tones.indexOf('warm') > -1 ? ' warm' : '');

    /* v1.2.3 audit — the pin is two CUSTOM PROPERTIES, not a literal
       grid-column. The stepper drops from four equal tracks to two below
       560px (app.css: at a quarter of a 390px card "Implementation" broke
       mid-word across four lines), and an inline `grid-column:4/5` would
       have addressed a fourth column that no longer exists there — the grid
       would have grown an implicit track and the frame would have hung off
       the right of the rungs it belongs to. --sl-c4 is the current rung's
       column on the four-track grid, --sl-c2 the same rung's column on the
       two-track one ((n-1) mod 2 + 1); each media query reads the one it
       needs, so the frame's left edge is its own rung's left edge at every
       width, with no second code path. */
    var flowHtml = opts.flow ? U.stepFlows(p) : '';

    return '<div class="stepline">' + cells +
      '<div class="sl-sub' + frameTone + '" style="--sl-c4:' + curCol +
        ';--sl-c2:' + (((curCol - 1) % 2) + 1) + '">' +
        U.rungSubline(p) + flowHtml +
      '</div></div>';
  };

  /* ------------------------------------------------------------- chain ---- */

  U.chain = function (items) {
    if (!items || !items.length) return '';
    return '<ol class="chain">' + items.map(function (x) {
      return '<li><b>' + e(x.who) + '</b><span>' + e(x.what) + '</span>' +
        '<time>' + e(x.at ? D.fmtDateY(x.at) : '') + '</time></li>';
    }).join('') + '</ol>';
  };

  /* ---------------------------------------------------------- needs row --- */

  /* the permission each row act is gated by; an act with no row here is a
     page-owned control and renders as a plain button (T-10). */
  var ACT_PERM = {
    'ask-approve': 'review', 'ask-gate': 'gate', 'ask-mark': 'markApproved',
    'ask-submit': 'submit', 'p6r-return': 'review', 'p6r-reject': 'review',
    'p6x-confirm': 'gate_confirm', 'p6x-dismiss': 'gate_confirm',
    'p6x-correct': 'gate_edit'
  };

  U.inlineReason = function (id, act) {
    var lab = act === 'p6r-reject' ? 'Why is this rejected?'
            : (act === 'p6r-dismiss' ? 'Why is this wrong?' : 'Why is this going back?');
    return '<div class="p6-inline" data-for="' + e(id) + '">' +
      '<label class="vh" for="p6r-reason-' + e(id) + '">' + e(lab) + '</label>' +
      '<textarea class="p4-input p6-reason" id="p6r-reason-' + e(id) + '" rows="2" ' +
        'placeholder="' + e(lab) + '"></textarea>' +
      '<div class="p6-iacts">' +
        '<button class="btn brass sm" data-act="p6r-confirm" data-id="' + e(id) +
          '" data-kind="' + e(act) + '">Confirm</button>' +
        '<button class="btn sm" data-act="p6r-cancel" data-id="' + e(id) + '">Cancel</button>' +
      '</div></div>';
  };

  function needsBtn(user, item, a) {
    var perm = ACT_PERM[a.act];
    var opts = { sm: true, brass: a.brass, act: a.act };
    if (perm && item.project) {
      return U.action(user, perm, item.project, a.label, opts);
    }
    if (perm && !D.can(user, perm)) return '';
    opts.id = item.id;
    return U.btn(a.label, opts);
  }

  /* v1.2.2 · R7 — the row arrives collapsed to one line (kind + id/name +
     sub[0] + flag + amount + primary action); everything else (sub[1], the
     gate-step chips, the ceiling bar, the chain, the secondary actions and the
     inline reason composer) lives in a K.segTabs expansion, opened with the
     CORE_API §2 button/panel contract (data-page="p6").

     Two exceptions, both forced by walk_egc.js / walk_flow.js clicking a
     control on the row WITHOUT opening it first (see docs/CORE_API_v1.2.2.md
     §2's own escape hatch — "keep it on the collapsed line" when a walk can't
     be edited): the row's primary action (already collapsed-line by design)
     and, for a review row specifically, "Return to Review" (p6r-return) —
     walk_flow.js:122 clicks it directly. Everything else item.actions carries
     (Reject, Dismiss, Correct date) moves into the Actions tab.

     Compact mode (P10's phone row) is untouched byte-for-byte: it is a
     different, older grammar (CSS grid, no collapse) that three walk
     assertions (bars===0, old===0, ask-approve reachable) already pin down,
     and collapsing it is not part of this pass. */
  var NEEDS_KIND_LABEL = {
    review: 'Review', gate: 'Gate', ready: 'Ready to mark', mine_return: 'Returned to you',
    proposal: 'Sync proposal', watching: 'Watching',
    contract_draft: 'Contract · Draft', contract_review: 'Contract · Review',
    contract_approve_sig: 'Contract · Sign-off', contract_sign: 'Contract · Signature',
    contract_send: 'Contract · Send'
  };

  U.needsRow = function (item, opts) {
    opts = opts || {};
    var state = CBP.state;
    var user = state.user;
    var p = item.project;
    var compact = !!opts.compact;
    var focused = state.ui.focusId && (state.ui.focusId === item.id ||
                  (p && state.ui.focusId === p.id));

    var pid = p ? p.id : item.id;
    var title = p ? p.name : (item.contract ? item.contract.id : item.id);
    var country = p ? p.country : (item.contract ? item.contract.country : null);

    var inline = '';
    var pin = state.ui.p6Inline;
    if (pin && (pin.id === item.id || (p && pin.id === p.id))) {
      inline = U.inlineReason(pin.id, pin.act || 'p6r-return');
    }

    /* -------------------------------------------------- compact (P10) ---- */
    if (compact) {
      var cname = country
        ? ((state.countries.filter(function (c) { return c.code === country; })[0] || {}).name || country)
        : '';
      var meta = [];
      if (cname) meta.push(cname);
      meta.push('<span class="num">' + e(D.money(item.amount)) + '</span>');
      if (p && p.primary_implementer) meta.push(e(p.primary_implementer));
      meta.push('owner ' + e(p && p.owner ? CBP.userName(p.owner) : 'unassigned'));

      var cacts = (item.actions || []).map(function (a) { return needsBtn(user, item, a); }).join('');

      return '<article class="p6-card p6-compact' + (item.tone === 'hot' || item.overdue ? ' hot' : '') +
        (focused ? ' is-focused' : '') + '" data-id="' + e(item.id) +
        '" data-kind="' + e(item.kind) + '">' +
        '<div class="p6-who">' +
          '<a class="p6-id num" href="#/project/' + e(pid) + '">' + e(pid) + '</a>' +
          '<b>' + U.flagMark(country) + e(title) + '</b>' +
          '<div class="p6-meta">' + meta.join(' · ') + '</div>' +
          '<div class="p6-inline-step compact">' + (p ? U.stepper(p) : '') + '</div>' +
          inline +
        '</div>' +
        '<div class="p6-age ' + e(item.tone || '') + '">' +
          '<span class="v num">' + e(D.days(item.waiting_days)) + '</span>' +
          '<small>' + e(item.waiting_at || '') + '</small>' +
        '</div>' +
        '<div class="p6-acts">' + cacts +
          '<a class="btn sm" href="#/project/' + e(pid) + '">Open</a>' +
        '</div></article>';
    }

    /* --------------------------------------------- collapse/expand (R7) -- */
    var K = CBP.K;

    var attn;
    if (p && K && K.attention) {
      attn = K.attention(p, user);
    } else {
      var thr = (CBP.CONFIG.REVIEW_THRESHOLD_DAYS || 14);
      var days = item.waiting_days || 0;
      if (item.overdue) {
        attn = { level: 'over', days: days, text: 'over by ' + D.days(days), full: 'Past its due date' };
      } else if (days > thr) {
        attn = { level: 'wait', days: days, text: D.days(days) + ' waiting',
                 full: (item.waiting_at || '') + ' · ' + D.days(days) };
      } else {
        attn = { level: 'quiet', days: 0, text: '', full: 'Nothing outstanding' };
      }
    }

    var sub0Html = '', sub0Title = '';
    if (p && D.rungOf) {
      var s0 = (D.rungOf(p).sub || [])[0];
      if (s0) {
        sub0Title = s0.text || '';
        sub0Html = '<span class="sl-line' + (s0.tone ? ' ' + s0.tone : '') + '">' +
          (s0.chip || '') + e(s0.text) + '</span>';
      }
    }

    /* v1.2.3 audit — the project id belongs on the META LINE, under the name,
       and it is built here rather than spliced in afterwards.

       The realign pass put it here with a string splice in pages/p6.js
       (relocateId), on the reading that ui.js was not that pass's file to
       edit. Two things followed. It was fragile by construction — it matched
       a literal '<span class="p6-id num">' against markup this function
       owns, and would have silently stopped relocating the day this template
       changed. And, more immediately, it was wrong on two live pages: P13's
       reviewer home and P14 call U.needsRow DIRECTLY, so priya's and marco's
       home rows still showed "WE26BGD0002 CARE — WASH & Nutrition" on the
       name line while the identical row on Needs-you showed the id below it.
       Same component, two grammars, one page apart.

       Built here, every caller gets the one shape and there is no splice to
       break. CORE_API §8 already names U.needsRow as P6's to change. */
    var idHtml = '<span class="p6-id num">' + e(pid) + '</span>';
    var metaHtml = '<span class="p6-sub0"' +
      (sub0Title ? ' title="' + e(sub0Title) + '"' : '') + '>' +
      idHtml + (sub0Html ? ' · ' + sub0Html : '') + '</span>';

    var actions = item.actions || [];
    var primary = actions.filter(function (a) { return a.brass; })[0] || actions[0] || null;
    var kept = actions.filter(function (a) { return a !== primary && a.act === 'p6r-return'; });
    var rest = actions.filter(function (a) { return a !== primary && kept.indexOf(a) === -1; });

    var primaryHtml = primary ? needsBtn(user, item, primary) : '';
    var keptHtml = kept.map(function (a) { return needsBtn(user, item, a); }).join('');
    var restHtml = rest.map(function (a) { return needsBtn(user, item, a); }).join('');

    var rowKey = item.kind + ':' + item.id;
    var open = K ? K.isOpen('p6', rowKey) : false;

    var chainHtml = U.chain((item.chain || []).slice(-3));
    var barHtml = '';
    if (item.ceilingBar && item.ceilingBar.ceiling && CBP.W && CBP.W.budgetBar) {
      barHtml = '<div class="cbar-row">' +
        CBP.W.budgetBar(item.ceilingBar.byStatus || {}, item.ceilingBar.ceiling,
                        { scale: item.ceilingBar.scale }) + '</div>';
    }
    var gatesHtml = p ? U.stepper(p) : '';

    var tabs = [];
    if (restHtml) tabs.push({ v: 'actions', label: 'Actions', n: rest.length });
    if (gatesHtml) tabs.push({ v: 'gates', label: 'Gates' });
    if (chainHtml) tabs.push({ v: 'history', label: 'History' });
    if (barHtml) tabs.push({ v: 'budget', label: 'Budget' });

    var segHtml = '', curSeg = null;
    if (tabs.length && K) {
      curSeg = K.seg('p6', rowKey, tabs, tabs[0].v);
      segHtml = K.segTabs({ ns: 'p6', id: rowKey, tabs: tabs, fallback: tabs[0].v,
                             label: 'Row detail' });
    } else if (tabs.length) {
      curSeg = tabs[0].v;
    }

    function segBody(v, body) {
      if (!body) return '';
      return '<div class="p6-segbody" data-seg="' + e(v) + '"' +
        (v === curSeg ? '' : ' hidden') + '>' + body + '</div>';
    }

    var panelInner = segHtml +
      segBody('actions', restHtml ? '<div class="p6-acts">' + restHtml + '</div>' : '') +
      segBody('gates', gatesHtml) +
      segBody('history', chainHtml) +
      segBody('budget', barHtml);

    var panelHtml = tabs.length
      ? '<div class="p6-panel"' + (open ? '' : ' hidden') + '>' + panelInner + '</div>'
      : '';

    return '<article class="p6-card' + (item.tone === 'hot' || item.overdue ? ' hot' : '') +
      (focused ? ' is-focused' : '') + (opts.paired ? ' p6-paired' : '') + '" data-id="' + e(item.id) +
      '" data-kind="' + e(item.kind) + '" data-open="' + (open ? 'true' : 'false') + '">' +
      '<button class="p6-sum" data-act="k-row" data-page="p6" data-id="' + e(rowKey) +
        '" aria-expanded="' + (open ? 'true' : 'false') + '"' + (tabs.length ? '' : ' disabled') + '>' +
        '<span class="p6-kind" title="' + e(NEEDS_KIND_LABEL[item.kind] || item.kind) + '">' +
          e(NEEDS_KIND_LABEL[item.kind] || item.kind) + '</span>' +
        '<span class="p6-idname">' + U.flagMark(country) +
          '<b title="' + e(title) + '">' + e(title) + '</b></span>' +
        metaHtml +
        (tabs.length ? '<span class="p6-chev" aria-hidden="true">' + (open ? '▴' : '▾') + '</span>' : '') +
      '</button>' +
      '<span class="p6-flagwrap">' + (K ? K.flagCell(attn) : '') + '</span>' +
      '<span class="p6-amt num">' + e(D.money(item.amount)) + '</span>' +
      '<span class="p6-primact">' + primaryHtml + keptHtml +
        '<a class="btn sm" href="#/project/' + e(pid) + '">Open</a></span>' +
      panelHtml + inline +
    '</article>';
  };

  /* --------------------------------------------------------- task list ---- */

  var TASK_TAG = { done: 'Done', todo: 'To do', blocked: 'Cannot start yet', na: 'Not needed' };

  U.taskList = function (rows) {
    if (!rows || !rows.length) return '';
    return '<ul class="tasklist">' + rows.map(function (r) {
      return '<li class="tl-' + e(r.status) + '">' +
        '<a href="' + e(r.href || '#') + '"><span class="tl-lab">' + e(r.label) + '</span>' +
        '<span class="tl-tag tl-' + e(r.status) + '">' + e(TASK_TAG[r.status] || r.status) +
        '</span></a></li>';
    }).join('') + '</ul>';
  };

  /* ------------------------------------------------------- country row ---- */

  U.countryBarRow = function (c) {
    var bar = (CBP.W && CBP.W.budgetBar)
      ? CBP.W.budgetBar(c.byStatus || {}, c.ceiling, { scale: c.scale }) : '';
    return '<a class="cbar-row" href="#/country/' + e(c.code) + '">' +
      '<span class="cbar-name">' + U.flagMark(c.code) + '<b>' + e(c.name) + '</b>' +
      '<small>' + e(c.count + ' project' + (c.count === 1 ? '' : 's') +
        ' · queue ' + c.queue) + '</small></span>' +
      '<span class="cbar-bar">' + bar + '</span>' +
      '<span class="cbar-fig"><b class="num' + (c.cls === 'over' ? ' neg' : '') + '">' +
        e(D.pct(c.coverage)) + '</b>' +
      '<small class="num">' + e(D.money(c.committed)) + ' of ' + e(D.money(c.ceiling)) +
      '</small></span></a>';
  };

  /* ---------------------------------------------------------- print pack -- */

  /* F27 — the RD-3 print pre-read wrapper, promoted from the private copies in
     p2.js (printHead) and p7.js (printHead). Both class names ride on the one
     element so P2, P7 and P17 keep their existing print CSS unchanged. */
  U.printPack = function (headerHtml) {
    return '<div class="p2-print p7-print printpack">' + (headerHtml || '') + '</div>';
  };

  /* --------------------------------------------------------- role guards -- */

  U.homeFor = function (role) {
    if (role === 'm3') return 'worker';
    if (role === 'm1') return 'country';
    if (role === 'm2') return 'portfolio';
    if (role === 'ogc' || role === 'finance') return 'reviews';
    if (role === 'viewer') return 'viewer';
    return 'dashboard';
  };

  /* F18 — routing carries no permission check, so every P13–P17 page opens with
     this guard. Returns true when the persona may stay; otherwise it sets the
     notice and sends them to their own home. */
  U.requireRole = function (state, roles) {
    var role = state && state.user ? state.user.role : null;
    if (role && roles && roles.indexOf(role) > -1) return true;
    state.ui.notice = 'That page belongs to another role — this is your home instead.';
    try { location.replace('#/home'); } catch (err) { location.hash = '#/home'; }
    return false;
  };

  /* === end FLOW === */

})();
