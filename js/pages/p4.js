/* pages/p4.js — P4 Project detail at #/project/<id>, plus the create form at
   #/project/new. Header (C-10 pinned decision) · vertical approval panel (C-08
   carrying the C-15 gate tracker) · tabs Overview ∣ Budget ∣ Timeline ∣
   Activity (C-09 + C-11) ∣ Files. Every control is gated by CBP.actions.can,
   so a persona switch shows or hides the whole surface in one render pass. */
(function () {
  'use strict';
  var D = CBP.D, U = CBP.ui, A = CBP.actions, e = CBP.ui.esc;

  CBP.pages = CBP.pages || {};
  CBP.p4 = {};

  var TABS = [
    { k: 'overview', label: 'Overview' },
    { k: 'budget',   label: 'Budget' },
    { k: 'timeline', label: 'Timeline' },
    { k: 'comments', label: 'Comments' },
    { k: 'activity', label: 'Activity' },
    /* v1.1.0 — this project's Corporate Agreements. The tab is WP2's; the panel
       inside it is CBP.p12.projectTab, which WP4 owns. */
    { k: 'contracts', label: 'Contracts' },
    { k: 'files',    label: 'Files' }
  ];

  var TYPE_LABEL = { note: 'Note', question: 'Question', decision: 'Decision', system: 'System',
                     contract: 'Contract', sync: 'Sync' };

  /* v1.1.0 — the short form of each contract-gate state, for the header chip
     and the sixth step of the approval panel */
  var CONTRACT_CHIP = {
    todo: 'Draft required', drafting: 'Draft', review: 'In review', signing: 'Signing',
    executed: 'Executed', sent: 'Sent out', active: 'Active', amending: 'Amending'
  };

  /* ------------------------------------------------------------ helpers -- */

  function err(state, key) {
    var x = state.ui.err;
    if (!x || x.key !== key) return '';
    return '<div class="p4-err">' + e(x.msg) + '</div>';
  }
  CBP.p4.err = err;

  function initials(id) {
    var n = CBP.userName(id) || '?';
    var parts = n.replace(/[^A-Za-z .]/g, '').split(/\s+/).filter(Boolean);
    return ((parts[0] || '?').charAt(0) + (parts[1] || '').charAt(0)).toUpperCase();
  }

  function countryName(code) {
    var c = CBP.state.countries.filter(function (x) { return x.code === code; })[0];
    return c ? c.name : code;
  }
  CBP.p4.countryName = countryName;

  function tag(txt) { return txt ? '<span class="p4-tag">' + e(txt) + '</span>' : ''; }

  function btn(label, act, id, opts) {
    opts = opts || {};
    return '<button class="btn' + (opts.brass ? ' brass' : '') + (opts.sm === false ? '' : ' sm') +
           '" data-act="' + e(act) + '" data-id="' + e(id) + '"' +
           (opts.sys ? ' data-sys="' + e(opts.sys) + '"' : '') +
           (opts.step ? ' data-step="' + e(opts.step) + '"' : '') +
           (opts.disabled ? ' disabled' : '') + '>' + e(label) + '</button>';
  }
  CBP.p4.btn = btn;

  function empty(text) { return '<div class="p4-empty">' + e(text) + '</div>'; }
  CBP.p4.empty = empty;

  /* the pinned decision for a project, if any (C-10) */
  function pinnedEntry(id) {
    return CBP.entriesFor(id).filter(function (x) {
      return x.type === 'decision' && x.pinned;
    }).pop() || null;
  }

  function archivedPins(id) {
    return CBP.entriesFor(id).filter(function (x) { return x.archived_pin_at; }).length;
  }

  /* ============================================================ the page ==*/

  CBP.pages.project = function (state) {
    var id = state.ui.param;

    if (!id) {
      return page('Project', U.card('No project selected',
        '<p>Open a project from the register at <a href="#/projects">#/projects</a>.</p>'));
    }
    if (id === 'new') return createPage(state);

    var p = CBP.projectById(id);
    if (!p) {
      return page('Project not found', U.card('Not found',
        '<p>No project with the id <b>' + e(id) + '</b> is loaded. ' +
        'Back to the <a href="#/projects">register</a>.</p>'));
    }
    if (D.visibleCountries(state.user, state.countries).indexOf(p.country) === -1) {
      return page('Project', U.card('Outside your data scope',
        '<p><b>' + e(p.id) + '</b> belongs to ' + e(countryName(p.country)) +
        ', which is not in your scope. Signed in as ' + e(state.user.name) + '.</p>'));
    }

    /* the record editor lives on the Overview tab, so "Edit record" clicked
       from any other tab brings the tab pointer with it */
    if (state.ui.p4Edit) state.ui.p4Tab = 'overview';

    /* v1.2.7 (R-6) — entering a status-4 record that has not been released
       opens on the Development tab, unless a tab other than the default was
       already chosen (ui.p4Tab is persisted and defaults to 'overview').
       Clicks on the tab strip never pass through here: the id is unchanged. */
    if (state.ui.p4TabFor !== p.id) {
      state.ui.p4TabFor = p.id;
      if (devDefault(p) && !state.ui.p4Edit && (!state.ui.p4Tab || state.ui.p4Tab === 'overview')) {
        state.ui.p4Tab = 'development';
      }
    }
    if (state.ui.p4Tab === 'development' && !hasDevTab(p)) state.ui.p4Tab = 'overview';

    /* v1.2.6 (R-C) — the unread strip is now one item of the alert tray */
    var html = drillCrumb(state) + header(p, state) + returnBar(p, state) + alertTray(p, state) +
      banner(p, state) +
      '<div class="p4-cols">' +
        '<div class="p4-main bk">' + tabs(state, p) +
          '<div class="bk-panel" role="tabpanel" id="p4-panel" aria-labelledby="p4-tab-' +
            e(state.ui.p4Tab || 'overview') + '">' + tabBody(p, state) + '</div>' +
        '</div>' +
        '<div class="p4-aside">' + approvalPanel(p, state) + peopleCard(p, state) + '</div>' +
      '</div>' + CBP.p4.modal(state);

    return html;
  };

  function page(title, body) {
    return '<div class="crumb">Projects</div><div class="pagehead"><h1>' + e(title) +
           '</h1></div>' + body;
  }

  /* ------------------------------------------------------------- header -- */

  function header(p, state) {
    var user = state.user;
    var open = D.openGates(p);
    var gatePill = '';
    if (open.length) {
      var g = open.sort(function (a, b) { return b.days - a.days; })[0];
      gatePill = '<span class="p4-warn' + (g.overdue ? ' hot' : '') + '">' +
                 e(g.label) + ' gate · waiting ' + D.days(g.days) + '</span>';
    }

    /* v1.1.0 — the Corporate Agreement chip. WP4 owns the real one (it knows
       what CT2 shows); until it is loaded the header still tells the truth
       from D.contractGate rather than showing nothing. */
    var contractChip = '';
    if (CBP.p12 && typeof CBP.p12.headerChip === 'function') {
      contractChip = CBP.p12.headerChip(p, state) || '';
    } else if (D.contractGate) {
      var cg = D.contractGate(p);
      if (cg.state !== 'na') {
        contractChip = '<span class="p4-warn' + (cg.met ? ' ok' : '') + '">Agreement · ' +
          e(CONTRACT_CHIP[cg.state] || cg.state) +
          (cg.contract ? ' · ' + e(cg.contract.id) : '') + '</span>';
      }
    }

    var acts = [];
    if (A.can(user, 'edit', p) && !state.ui.p4Edit) {
      acts.push(btn('Edit record', 'p4-edit', p.id, { sm: false }));
    }
    if (A.can(user, 'create')) acts.push(btn('+ New project', 'p4-new', '', { sm: false }));

    /* Projects › Country › Project — the first crumb is always a one-click way
       back to the level-1 register, from every tab and from edit mode (RD 3.5) */
    return '<nav class="crumb p4-crumb" aria-label="Breadcrumb">' +
      '<a href="#/projects">Projects</a><span class="sep" aria-hidden="true">›</span>' +
      '<span>' + e(countryName(p.country)) + '</span>' +
      '<span class="sep" aria-hidden="true">›</span>' +
      '<b>' + e(p.name) + '</b><span class="pid num">' + e(p.id) + '</span></nav>' +
      '<div class="p4-head">' +
        '<div class="p4-htitle">' +
          '<h1>' + e(p.name) + '</h1>' +
          '<div class="p4-tags">' + U.statusPill(p.status) +
            tag(countryName(p.country)) + tag(p.primary_implementer) +
            tag(p.strategic_priority) + gatePill + contractChip +
          '</div>' +
        '</div>' +
        (acts.length ? '<div class="p4-hacts">' + acts.join('') + '</div>' : '') +
      '</div>' +
      '<div class="p4-hmeta">' +
        '<span>Requested <b class="num">' + D.money(p.amount) + '</b></span>' +
        '<span>Owner <b>' + e(p.owner ? CBP.userName(p.owner) : 'unassigned') + '</b></span>' +
        (D.dInQ(p) !== null ? '<span>In queue <b class="num">' + D.days(D.dInQ(p)) + '</b></span>' : '') +
        (D.daysInStage(p) !== null
          ? '<span>In current stage <b class="num">' + D.days(D.daysInStage(p)) + '</b></span>' : '') +
        '<span class="p4-hprog">Progress ' + U.progressBar(p) + '</span>' +
      '</div>' +
      /* T-08 — the four rungs and their sub-line, from the one helper P3, P6
         and P10 read. The record's own ladder used to be written out again in
         the approval panel; now the panel keeps only what is unique to it (the
         gate controls, the reference form and the action rows). */
      '<div class="p4-hstep">' + U.stepper(p, { flow: true }) + '</div>';
  }

  /* ------------------------------------- v1.0.1 · return + unread strips -- */

  /* After a record save A.projectUpdate sets ui.returnTo. The record does not
     bounce the user anywhere on its own — it offers the way back to the
     level-1 register and lets them decide (RD 3.5). */
  /* v1.2.2 — the record can now be reached by drilling a chart rather than by
     opening it from the register (Ask-gate 2.1: a project bar on Budget is a
     link straight to here). When it was, say where it came from and offer the
     way back, so the round trip the ToR asked for is a visible affordance and
     not just the browser's back button. ui.cameFrom is cleared by app.js the
     moment the route stops being a record, so this never goes stale. */
  function drillCrumb(state) {
    var from = state.ui.cameFrom;
    if (!from || !from.route) return '';
    return '<div class="p4-drill"><a href="#/' + e(from.route) + '">' +
      '<span aria-hidden="true">\u2190</span> Back to ' + e(from.label || from.route) +
      '</a></div>';
  }

  function returnBar(p, state) {
    if (state.ui.returnTo !== 'projects') return '';
    return '<div class="p4-return">' +
      '<b>Changes saved</b>' +
      '<span>The register and every derived total already read the new values.</span>' +
      '<span class="sp">' +
        btn('Back to projects', 'returnto', p.id, { brass: true, sm: false }) +
        btn('Stay on the record', 'p4c-stay', p.id, { sm: false }) +
      '</span></div>';
  }

  /* v1.2.6 — unreadStrip() retired: its count, "view comments" and "Mark all
     read" controls (same acts) are the first item of alertTray() below. */

  /* ------------------------------------------ v1.2.6 · alert tray (R-C) -- */

  /* Inline SVG glyphs (currentColor), one per alert kind so severity and kind
     never ride on colour alone (WCAG 1.4.1). */
  var GLYPH = {
    warn: '<path d="M8 1.8 15 14.2H1z" fill="none" stroke="currentColor" stroke-width="1.5" ' +
          'stroke-linejoin="round"/><path d="M8 6.2v3.6M8 11.7v.2" stroke="currentColor" ' +
          'stroke-width="1.6" stroke-linecap="round"/>',
    msg:  '<rect x="1.8" y="3.5" width="12.4" height="9" rx="1.5" fill="none" stroke="currentColor" ' +
          'stroke-width="1.4"/><path d="m2.4 4.3 5.6 4.4 5.6-4.4" fill="none" stroke="currentColor" ' +
          'stroke-width="1.4" stroke-linejoin="round"/>',
    gate: '<path d="M4 1.8h8M4 14.2h8M4.8 1.8c0 3.4 6.4 3.4 6.4 6.2S4.8 10.8 4.8 14.2M11.2 1.8c0 ' +
          '3.4-6.4 3.4-6.4 6.2s6.4 2.8 6.4 6.2" fill="none" stroke="currentColor" stroke-width="1.4" ' +
          'stroke-linecap="round"/>',
    clock: '<circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
           '<path d="M8 4.6V8l2.4 1.6" fill="none" stroke="currentColor" stroke-width="1.5" ' +
           'stroke-linecap="round" stroke-linejoin="round"/>',
    person: '<circle cx="8" cy="5.3" r="2.8" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
            '<path d="M2.6 14.2c.6-2.9 2.8-4.4 5.4-4.4s4.8 1.5 5.4 4.4" fill="none" ' +
            'stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    doc:  '<path d="M3.6 1.8h5.8l3 3v9.4H3.6z" fill="none" stroke="currentColor" stroke-width="1.4" ' +
          'stroke-linejoin="round"/><path d="M9.2 1.8v3.2h3.2M5.8 8.4h4.4M5.8 11h4.4" fill="none" ' +
          'stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>'
  };

  function glyph(k, cls) {
    return '<svg class="' + (cls || 'atr-ico') + '" viewBox="0 0 16 16" aria-hidden="true" ' +
      'focusable="false">' + GLYPH[k] + '</svg>';
  }

  var DIV_LABEL = { ogc: 'OGC', finance: 'Finance' };

  /* The items, in the order R-C fixes, each only when present. */
  function alertItems(p, state) {
    var user = state.user, items = [];
    var declined = p.status === 'declined';

    var n = D.unreadFor(user, p.id);
    if (n) {
      items.push({
        kind: 'msg', sev: 'warn',
        title: n + ' new message' + (n === 1 ? '' : 's'),
        detail: 'on this record’s Comments tab',
        acts: btn('view comments', 'p4c-gotocomments', p.id) +
          (D.can(user, 'comment') ? btn('Mark all read', 'comment-readall', p.id) : '')
      });
    }

    D.openGates(p).forEach(function (g) {
      var url = D.deepLink ? D.deepLink(p, g.key) : null;
      items.push({
        kind: 'gate', sev: g.overdue ? 'danger' : 'warn',
        title: g.label + ' gate · waiting ' + D.days(g.days),
        detail: 'with ' + g.label + ' since ' + D.fmtDateY(g.submitted_at) +
          (g.overdue ? ' · past the ' + CBP.CONFIG.GATE_THRESHOLD_DAYS + '-day threshold' : ''),
        acts: url ? '<a class="btn sm atr-link" href="' + e(url) + '" target="_blank" ' +
          'rel="noopener">Open in ' + e(g.label) + ' ↗</a>' : ''
      });
    });

    var a = CBP.K && CBP.K.attention ? CBP.K.attention(p, user) : { level: 'quiet' };
    if (a.level === 'over') {
      items.push({ kind: 'clock', sev: 'danger', title: 'Over by ' + D.days(a.days),
                   detail: a.full, acts: '' });
    } else if (a.level === 'needs') {
      items.push({ kind: 'person', sev: 'warn', title: 'Waiting on you',
                   detail: a.full, acts: '' });
    }

    var cg = (D.contractGate && !declined) ? D.contractGate(p) : null;
    if (cg && cg.state !== 'na' && !cg.met) {
      var cc = cg.contract;
      var thr = CBP.CONFIG.REVIEW_THRESHOLD_DAYS || 14;
      var open = D.can(user, 'contract_view')
        ? btn(cc ? 'Open agreement' : 'Open Contracts', 'p6x-open-contract', cc ? cc.id : '') : '';
      if (cg.days !== null && cg.days !== undefined && cg.days >= thr) {
        items.push({
          kind: 'doc', sev: 'warn',
          title: 'Corporate Agreement' + (cc ? ' ' + cc.id : '') + ' · ' +
            D.days(cg.days) + ' since it last moved',
          detail: 'State: ' + (CONTRACT_CHIP[cg.state] || cg.state) + ' · must be sent out ' +
            'before implementation can start',
          acts: open
        });
      }
      if (cc && D.reviewDue) {
        ['ogc', 'finance'].forEach(function (div) {
          var rd = D.reviewDue(cc, div);
          if (!rd || !rd.overdue) return;
          items.push({
            kind: 'doc', sev: 'danger',
            title: DIV_LABEL[div] + ' review overdue ' + D.days(-rd.days),
            detail: 'Corporate Agreement ' + cc.id + ' · due ' + D.fmtDateY(rd.due_at) +
              (rd.review.assignee ? ' · with ' + CBP.userName(rd.review.assignee) : ''),
            acts: open
          });
        });
      }
    }
    return items;
  }

  function alertTray(p, state) {
    var items = alertItems(p, state);
    if (!items.length) return '';
    var isOpen = !!state.ui.p4AlertsOpen;
    var sevWord = { danger: 'Urgent', warn: 'Attention' };

    var chips = items.map(function (it, i) {
      return '<li><span class="atr-chip is-' + it.sev + '" tabindex="0" role="img" ' +
        'aria-label="' + e(sevWord[it.sev] + ': ' + it.title) + '" aria-describedby="p4-atr-tip-' + i + '">' +
        glyph(it.kind, 'atr-cico') +
        '<span class="atr-tip" role="tooltip" id="p4-atr-tip-' + i + '">' +
          '<b>' + e(it.title) + '</b>' + e(it.detail) + '</span>' +
        '</span></li>';
    }).join('');

    var cards = items.map(function (it) {
      return '<article class="atr-card is-' + it.sev + '">' + glyph(it.kind) +
        '<div class="atr-cbody">' +
          '<h2 class="atr-title"><span class="atr-sev">' + sevWord[it.sev] + '</span>' +
            e(it.title) + '</h2>' +
          '<p class="atr-detail">' + e(it.detail) + '</p>' +
          (it.acts ? '<div class="atr-acts">' + it.acts + '</div>' : '') +
        '</div></article>';
    }).join('');

    var hot = items.some(function (it) { return it.sev === 'danger'; });
    return '<section class="atr' + (isOpen ? ' open' : '') + (hot ? ' hot' : '') +
      '" aria-label="Alerts on this record">' +
      '<div class="atr-row">' +
        '<button type="button" class="atr-toggle" id="p4-atr-toggle" data-act="p4alerts" ' +
          'aria-expanded="' + (isOpen ? 'true' : 'false') + '" aria-controls="p4-atr-body">' +
          glyph('warn') +
          '<span><b class="num">' + items.length + '</b> alert' + (items.length === 1 ? '' : 's') +
          '</span></button>' +
        '<ul class="atr-chips">' + chips + '</ul>' +
        '<span class="atr-chev" aria-hidden="true"></span>' +
      '</div>' +
      '<div class="atr-body" id="p4-atr-body"' + (isOpen ? '' : ' hidden') + '>' + cards + '</div>' +
      '</section>';
  }
  CBP.p4.alertItems = alertItems;

  /* ------------------------------------------------- C-10 pinned banner -- */

  function banner(p, state) {
    var pin = pinnedEntry(p.id);
    if (!pin) {
      return '<div class="p4-pin empty">No decision pinned. Pin one from the Activity tab so the ' +
             'answer to “why is this held” sits at the top of the record (C-10).</div>';
    }
    var archived = archivedPins(p.id);
    var can = D.can(state.user, 'pinDecision', p);
    return '<div class="p4-pin">' +
      '<span class="p4-pinlab">Pinned decision</span>' +
      '<div class="p4-pinbody">' + mention(pin.body) +
        '<small>Pinned by ' + e(CBP.userName(pin.pinned_by || pin.author)) + ' · ' +
        e(D.fmtDateY(pin.pinned_at || pin.at)) +
        (archived ? ' · replaces ' + archived + ' earlier pin' + (archived === 1 ? '' : 's') : '') +
        '</small>' +
      '</div>' +
      (can ? '<div class="p4-pinact">' + btn('Unpin', 'unpin', pin.id) + '</div>' : '') +
      '</div>';
  }

  /* ---------------------------------------------------------------tabs -- */

  function tabs(state, p) {
    var openQ = 0, unread = 0;
    if (state.ui.param) {
      openQ = CBP.entriesFor(state.ui.param).filter(function (x) {
        return x.type === 'question' && !x.resolved_at;
      }).length;
      unread = D.unreadFor(state.user, state.ui.param);
    }
    /* v1.2.6 — book tabs (.bk-): same keys, labels, badges and acts; the
       .p4-tabs / .p4-tab classes stay for the walks that select on them. */
    var list = tabList(state.ui.param ? CBP.projectById(state.ui.param) : p);
    return '<div class="p4-tabs bk-strip' + (list.length > TABS.length ? ' bk-many' : '') +
      '" role="tablist" aria-label="Project record">' +
      list.map(function (t) {
        var n = (t.k === 'activity') ? openQ : (t.k === 'comments' ? unread : 0);
        var badge = n ? ' <span class="p4-tbadge num">' + n + '</span>' : '';
        var on = state.ui.p4Tab === t.k;
        return '<button class="p4-tab bk-tab' + (on ? ' on' : '') +
               '" data-act="p4tab" data-tab="' + t.k + '" role="tab" id="p4-tab-' + t.k +
               '" aria-selected="' + (on ? 'true' : 'false') + '"' +
               (on ? ' aria-controls="p4-panel"' : '') + '>' + e(t.label) + badge + '</button>';
      }).join('') + '</div>';
  }

  function tabBody(p, state) {
    switch (state.ui.p4Tab) {
      case 'development': return hasDevTab(p) ? devTab(p, state) : overviewTab(p, state);
      case 'budget':   return budgetTab(p, state);
      case 'timeline': return timelineTab(p, state);
      case 'comments': return commentsTab(p, state);
      case 'activity': return activityTab(p, state);
      case 'contracts': return contractsTab(p, state);
      case 'files':    return filesTab(p, state);
      default:         return overviewTab(p, state);
    }
  }

  /* ------------------------------------------------------------ overview --*/

  function field(label, value) {
    return '<div class="p4-field"><span>' + e(label) + '</span><b>' +
           (value === null || value === undefined || value === '' ? '—' : e(value)) + '</b></div>';
  }

  function overviewTab(p, state) {
    if (state.ui.p4Edit) return recordForm(p, state);

    var rec = field('Project id', p.id) +
      field('Country', countryName(p.country)) +
      field('City', p.city) +
      field('Primary implementer', p.primary_implementer) +
      field('Strategic priority', p.strategic_priority) +
      field('Classification', p.classification) +
      field('Project type', p.project_type) +
      field('Target date', p.target_date ? D.fmtDateY(p.target_date) : null) +
      field('Budget year', CBP.CONFIG.BUDGET_YEAR) +
      field('CHaS sync', 'manual entry (D-09)');

    var dates = field('Created', p.created_at ? D.fmtDateY(p.created_at) : 'before the demo window') +
      field('Submitted (4 → 3)', p.submitted_at ? D.fmtDateY(p.submitted_at) : '—') +
      field('Gate opened', p.gate_opened_at ? D.fmtDateY(p.gate_opened_at) : '—') +
      field('Approved (3 → 2)', p.approved_at ? D.fmtDateY(p.approved_at) : '—') +
      field('Implementation (2 → 1)', p.implementation_date ? D.fmtDateY(p.implementation_date) : '—') +
      (p.status === 'declined' ? field('Declined', D.fmtDateY(p.declined_at)) : '') +
      (p.return_reason ? field('Last returned because', p.return_reason) : '');

    var desc = p.description
      ? '<p class="p4-desc">' + e(p.description) + '</p>'
      : '<p class="p4-desc empty">No description on the record yet — add one from ' +
        '“Edit record”.</p>';

    return '<div class="p4-two">' +
      U.card('Record', '<div class="p4-fields">' + rec + '</div>' + desc) +
      U.card('Stage dates', '<div class="p4-fields">' + dates + '</div>' +
        '<p class="p4-note">Every day count on this page is derived against ' +
        e(D.fmtDateY(CBP.CONFIG.TODAY)) + ' — nothing is stored as a counter.</p>') +
      '</div>' + budgetLine(p) + watchersCard(p, state);
  }

  function budgetLine(p) {
    var country = CBP.state.countries.filter(function (c) { return c.code === p.country; })[0];
    var ceiling = country ? country.ceiling : 0;
    var share = ceiling ? (p.amount / ceiling) * 100 : null;
    var label = { 4: 'draft', 3: 'requested', 2: 'approved', 1: 'approved',
                  declined: 'requested' }[p.status];

    return U.card('Budget line',
      '<div class="p4-bl">' +
        '<div class="p4-blv"><span class="num">' + D.money(p.amount) + '</span><small>' +
          e(label) + ' · USD (D-08)</small></div>' +
        '<div class="p4-blbar"><i style="width:' +
          Math.max(1, Math.min(100, Math.round(share || 0))) + '%"></i></div>' +
        '<div class="p4-blr"><span class="num">' + D.pct(share) + '</span><small>of the ' +
          e(countryName(p.country)) + ' ceiling ' + D.money(ceiling) + '</small></div>' +
      '</div>');
  }

  function watchersCard(p, state) {
    var w = (p.watchers || []).map(function (x) { return CBP.userName(x); });
    var body =
      '<div class="p4-fields">' +
        field('Accountable owner', p.owner ? CBP.userName(p.owner) : 'unassigned') +
        field('Backup owner (D-14)', p.backup ? CBP.userName(p.backup) : 'none') +
        field('Watchers (B-1)', w.length ? w.join(', ') : 'none yet') +
      '</div>' +
      (!p.owner ? '<p class="p4-note alert">No owner set — alerts cannot route until one is ' +
        'assigned (D-14).</p>' : '');
    return U.card('Owner and watchers', body);
  }

  /* -------------------------------------------------------------- budget --*/

  function budgetTab(p, state) {
    var country = CBP.state.countries.filter(function (c) { return c.code === p.country; })[0];
    var ceiling = country ? country.ceiling : 0;
    var mine = state.projects.filter(function (x) { return x.country === p.country; });
    var committed = D.committedTotal(mine);
    var rows = [
      ['Requested', p.status === 4 ? '—' : D.money(p.amount)],
      ['Draft', p.status === 4 ? D.money(p.amount) : '—'],
      ['Approved', (p.status === 2 || p.status === 1) ? D.money(p.amount) : '—'],
      ['Budget year', String(CBP.CONFIG.BUDGET_YEAR)],
      ['Share of the ' + countryName(p.country) + ' ceiling',
        D.pct(ceiling ? p.amount / ceiling * 100 : null)]
    ].map(function (r) {
      return '<tr><td>' + e(r[0]) + '</td><td class="r num">' + e(r[1]) + '</td></tr>';
    }).join('');

    var cov = D.coverage(committed, ceiling);
    /* v1.2.5 S3 (F15) — p4-bfields marks the budget country card's value column
       as money: the label wraps, the figure stays atomic (never split mid-
       number, e.g. "$1,31 / 0,801"). Presentation-only class; no P4 logic. */
    var ctx = '<div class="p4-fields p4-bfields">' +
      field('Country ceiling', D.money(ceiling)) +
      field('Committed across statuses 1–4', D.money(committed)) +
      field('Coverage', D.pct(cov)) +
      field(committed > ceiling ? 'Over ceiling' : 'Headroom',
            D.money(Math.abs(ceiling - committed))) +
      '</div>' +
      (committed > ceiling
        ? '<p class="p4-note alert">' + e(countryName(p.country)) + ' is committed above its ' +
          CBP.CONFIG.BUDGET_YEAR + ' allocation — every new request here adds to the overrun.</p>'
        : '');

    return '<div class="p4-two">' +
      U.card('This project', '<div class="tblwrap"><table class="tbl p4-btbl"><tbody>' + rows +
        '</tbody></table></div>' + (D.can(state.user, 'editBudget', p)
          ? '<p class="p4-note">Edit the amount from the record editor. ' +
            'M3 can change it only while the project is a draft.</p>' : '')) +
      U.card(countryName(p.country) + ' ' + CBP.CONFIG.BUDGET_YEAR, ctx) +
      '</div>' + budgetLine(p);
  }

  /* ------------------------------------------------------------ timeline --*/

  function timelineTab(p, state) {
    var model = D.ganttModel(p);
    var planned = (p.status !== 1);
    var head = '<div class="p4-thead">' +
      '<span>' + (planned ? 'Planned implementation timeline' : 'Implementation timeline') + '</span>' +
      '<span class="r">' +
        (A.can(state.user, 'editGantt', p) ? btn('Configure phases', 'deeplink', p.id) : '') +
        btn('Open full editor in TimeBlock ↗', 'deeplink', p.id) +
      '</span></div>';

    var body = model
      ? U.gantt(p) + '<p class="p4-note">' + (planned
          ? 'Dashed bars are planned — phase dates shift from the approval date. ' +
            'Progress reports only once the project reaches status 1 (C-17).'
          : 'Progress is the elapsed share of each implementation phase; the red line is ' +
            e(D.fmtDateY(CBP.CONFIG.TODAY)) + '.') +
        ' “Open full editor in TimeBlock” deep-links the TimeBlock add-on in a new tab (D-07) — no data round-trip.</p>'
      : empty('No phases entered yet. The mini Gantt appears here once phases are added ' +
              '(D-06 / D-07); the full editor is the TimeBlock add-on.');

    return U.card('', head + body, { cls: 'p4-tl' });
  }

  /* ------------------------------------------------------------- files ----*/

  function filesTab(p, state) {
    var files = [
      { n: 'Project proposal — signed', k: 'SharePoint link', by: p.owner, at: p.submitted_at || p.created_at },
      { n: 'Partner budget breakdown', k: 'SharePoint link', by: p.owner, at: p.submitted_at || p.created_at },
      { n: 'CHaS submission pack', k: 'External system', by: 'priya', at: (p.gate || {}).chas ? p.gate.chas.submitted_at : null }
    ];
    var rows = files.map(function (f) {
      return '<tr><td><b>' + e(f.n) + '</b></td><td class="dim">' + e(f.k) + '</td>' +
             '<td class="dim">' + e(f.by ? CBP.userName(f.by) : 'unassigned') + '</td>' +
             '<td class="r dim num">' + e(f.at ? D.fmtDateY(f.at) : '—') + '</td>' +
             '<td class="r">' + btn('Open ↗', 'deeplink', p.id) + '</td></tr>';
    }).join('');

    return U.card('Files as links',
      U.table([{ label: 'Document' }, { label: 'Held in' }, { label: 'Added by' },
               { label: 'Date', right: true }, { label: '', right: true }], [rows]) +
      '<p class="p4-note">v1 stores links, not uploads: documents stay in the systems that already ' +
      'own them and the project record points at them. Attachment upload is deliberately out of ' +
      'scope for the demo.</p>');
  }

  /* ---------------------------------------------------------- contracts ---*/

  /* WP4 renders the agreements themselves (it owns CT1–CT6 and their markup);
     this page only owns the tab and the guard, so the record is never a blank
     panel if the contracts UI has not loaded. */
  function contractsTab(p, state) {
    if (CBP.p12 && typeof CBP.p12.projectTab === 'function') {
      return CBP.p12.projectTab(p, state);
    }
    var cg = D.contractGate ? D.contractGate(p) : { state: 'na' };
    return U.card('Contracts section loading',
      '<p>The Corporate Agreements for this project are rendered by the Contracts section. ' +
      'Open <a href="#/contracts">Contracts</a> for the full register.</p>' +
      (cg.state === 'na'
        ? '<p class="p4-note">This project sits below the ' +
          e(D.money(CBP.CONFIG.CONTRACT_THRESHOLD_USD)) + ' threshold, so no Corporate ' +
          'Agreement is required before implementation.</p>'
        : '<p class="p4-note">Gate state: <b>' + e(CONTRACT_CHIP[cg.state] || cg.state) + '</b>' +
          (cg.contract ? ' · agreement ' + e(cg.contract.id) : ' · no draft yet') + '.</p>'));
  }

  /* ============================================ v1.0.1 · comments feed =====
     The conversation layer, deliberately NOT the audit stream: one flat
     chronological list, oldest first, name + date + time, no threading, no
     type chips beyond the one distinction that matters here (a decision note
     carried over from the approval flow). Reading is never implicit — nothing
     is marked read by opening the tab, only by the affordances below. */

  function commentRow(c, p, state) {
    var user = state.user;
    var mine = c.author === user.id;
    var unread = D.isUnread(user, c);
    var note = c.kind === 'approval_note';

    var meta = '<div class="cm-meta">' +
      '<b>' + e(CBP.userName(c.author)) + '</b>' +
      '<span class="num">' + e(D.fmtDateY(c.at)) + '</span>' +
      '<span class="num">' + e(c.time || '') + '</span>' +
      (note ? '<span class="cm-kind"><span class="ic" aria-hidden="true">✓</span>' +
        'Approval note</span>' : '') +
      (c.priority ? '<span class="cm-flag">Priority</span>' : '') +
      (c.edited_at ? '<span class="cm-edited">(edited ' + e(D.fmtDateY(c.edited_at)) +
        ')</span>' : '') +
      (unread ? '<span class="cm-new">new</span>' : '') +
      '</div>';

    var body;
    if (state.ui.editComment === c.id && mine) {
      body = '<div class="cm-edit">' +
        '<textarea id="p4cEdit" class="p4-input" rows="3" data-act="p4c-edraft">' +
        e(c.body) + '</textarea>' + err(state, 'comment') +
        '<div class="cm-btns">' +
          btn('Save comment', 'p4c-edit-save', c.id, { brass: true }) +
          btn('Cancel', 'p4c-edit-cancel', c.id) +
        '</div></div>';
    } else {
      body = '<div class="cm-txt">' + mention(c.body) + '</div>';
    }

    var acts = [];
    if (state.ui.editComment !== c.id) {
      if (mine && D.can(user, 'comment', p)) acts.push(btn('Edit', 'p4c-edit', c.id));
      if (!mine && D.can(user, 'comment')) {
        acts.push('<button class="btn sm" data-act="comment-read" data-id="' + e(c.id) +
          '" data-read="' + (unread ? 'true' : 'false') + '">' +
          (unread ? 'Mark read' : 'Mark unread') + '</button>');
      }
    }

    return '<article class="cm' + (note ? ' note' : '') + (unread ? ' unread' : '') +
      '" id="cm-' + e(c.id) + '">' +
      '<div class="cm-av' + (note ? ' note' : '') + '">' + e(initials(c.author)) + '</div>' +
      '<div class="cm-b">' + meta + body +
        (acts.length ? '<div class="cm-btns">' + acts.join('') + '</div>' : '') +
      '</div></article>';
  }

  function commentComposer(p, state) {
    var user = state.user;
    if (!D.can(user, 'comment', p)) {
      return '<div class="cm-composer readonly">Read-only role — you can follow the ' +
        'conversation and export it, but not post (RD/RM-3).</div>';
    }
    /* an unsent message belongs to the project it was written on */
    var draft = (state.ui.p4cDraftFor === p.id && typeof state.ui.p4cDraft === 'string')
      ? state.ui.p4cDraft : '';

    return '<div class="cm-composer">' +
      '<label class="vh" for="p4cBody">Write a comment</label>' +
      '<textarea id="p4cBody" class="p4-input" rows="2" data-act="p4c-draft" ' +
      'placeholder="Write to the people on this project — @mention to point at someone">' +
      e(draft) + '</textarea>' +
      err(state, 'comment') +
      '<div class="cm-crow">' +
        '<span class="cm-hint">Comments are conversation and stay on the project. ' +
        'Nothing is deleted — an edit is stamped “(edited)”.</span>' +
        '<span class="sp"><button class="btn brass sm" data-act="p4c-post" data-id="' +
        e(p.id) + '">Post comment</button></span>' +
      '</div></div>';
  }

  function commentsTab(p, state) {
    var list = D.commentsFor(p.id);                 /* D.commentOrder — oldest first */
    var unread = D.unreadFor(state.user, p.id);
    var notes = list.filter(function (c) { return c.kind === 'approval_note'; }).length;

    var head = '<div class="cm-head">' +
      '<div class="cm-htitle"><b>Conversation</b>' +
        '<small class="num">' + list.length + ' message' + (list.length === 1 ? '' : 's') +
        (notes ? ' · ' + notes + ' approval note' + (notes === 1 ? '' : 's') : '') +
        (unread ? ' · ' + unread + ' unread' : '') + '</small></div>' +
      '<div class="cm-hacts">' +
        (D.can(state.user, 'comment') && unread
          ? btn('Mark all read', 'comment-readall', p.id) : '') +
        '<a class="btn sm" href="#/projects">Back to projects</a>' +
      '</div></div>';

    var feed = list.length
      ? list.map(function (c) { return commentRow(c, p, state); }).join('')
      : empty('No comments on this project yet. The first message starts the thread.');

    return '<section class="card cm-card" id="p4comments">' + head +
      '<div class="cm-feed">' + feed + '</div>' +
      commentComposer(p, state) +
      '<p class="cm-foot">Opening this tab does not mark anything read — use ' +
      '“Mark all read”, or the control on a single message, so the balloon count stays ' +
      'something you chose.</p>' +
      '</section>';
  }

  /* ================================================ C-09 activity stream ==*/

  function mention(body) {
    return e(body).replace(/@([A-Za-z][A-Za-z0-9_.'-]*(?:\s[A-Z][A-Za-z.]*)?)/g,
      '<span class="act-mention">@$1</span>');
  }

  function activityTab(p, state) {
    var all = CBP.entriesFor(p.id);
    var tops = all.filter(function (x) { return !x.parent; });
    /* v1.1.0 · F16 — contract and sync entries are their own kind of history
       and get their own chip here, on P4, not on the messages hub. */
    function nOf(type) {
      return tops.filter(function (x) { return x.type === type; }).length;
    }
    var counts = {
      all: tops.length,
      note: nOf('note'),
      question: nOf('question'),
      decision: nOf('decision'),
      system: nOf('system'),
      contract: nOf('contract'),
      sync: nOf('sync')
    };
    var f = state.ui.actFilter || 'all';
    var shown = tops.filter(function (x) { return f === 'all' || x.type === f; });

    shown.sort(function (a, b) {
      if (a.at === b.at) return seq(b.id) - seq(a.id);
      return a.at < b.at ? 1 : -1;                        /* newest first */
    });

    var filters = [['all', 'All'], ['note', 'Notes'], ['question', 'Questions'],
                   ['decision', 'Decisions'], ['system', 'System'],
                   ['contract', 'Contract'], ['sync', 'Sync']]
      .filter(function (x) {
        /* the two new chips appear only once the project has such an entry */
        return (x[0] !== 'contract' && x[0] !== 'sync') || counts[x[0]] > 0;
      })
      .map(function (x) {
        return '<button class="act-ftab' + (f === x[0] ? ' on' : '') +
               '" data-act="actfilter" data-f="' + x[0] + '">' + e(x[1]) +
               ' <span class="n num">' + counts[x[0]] + '</span></button>';
      }).join('');

    var stream = shown.length
      ? shown.map(function (x) { return entryHtml(x, all, p, state); }).join('')
      : empty('Nothing in this filter yet.');

    return '<section class="card act-card">' +
      '<div class="act-sep">This is the audit stream — every status move, gate click and ' +
      'record edit, in the order it happened. Person-to-person conversation lives in the ' +
      '<button class="p4-inlink" data-act="p4c-gotocomments" data-id="' + e(p.id) +
      '">Comments tab</button>.</div>' +
      '<div class="act-ftabs">' + filters + '</div>' +
      '<div class="act-stream">' + stream + '</div>' +
      composer(p, state) +
      '</section>';
  }

  function seq(id) {
    var m = /(\d+)$/.exec(String(id || ''));
    return m ? parseInt(m[1], 10) : 0;
  }

  function entryHtml(x, all, p, state) {
    var user = state.user;
    var replies = all.filter(function (r) { return r.parent === x.id; })
      .sort(function (a, b) { return seq(a.id) - seq(b.id); });

    var meta = '<div class="act-meta">' +
      (x.type === 'system' ? '<b>System</b>' : '<b>' + e(CBP.userName(x.author)) + '</b>') +
      '<span class="num">' + e(D.fmtDateY(x.at)) + '</span>' +
      '<span class="act-type t-' + x.type + '">' + e(TYPE_LABEL[x.type] || x.type) + '</span>' +
      (x.type === 'question'
        ? '<span class="act-type ' + (x.resolved_at ? 't-resolved' : 't-open') + '">' +
          (x.resolved_at
            ? 'Resolved by ' + e(CBP.userName(x.resolved_by)) + ' · ' + e(D.fmtDateY(x.resolved_at))
            : 'Open → ' + e(CBP.userName(x.assigned_to))) + '</span>'
        : '') +
      (x.pinned ? '<span class="act-type t-pinned">Pinned</span>' : '') +
      (x.archived_pin_at ? '<span class="act-type t-arch">Pin archived ' +
        e(D.fmtDateY(x.archived_pin_at)) + '</span>' : '') +
      (x.edited_at ? '<span class="act-edited">edited by ' + e(CBP.userName(x.edited_by)) +
        ' · ' + e(D.fmtDateY(x.edited_at)) + '</span>' : '') +
      '</div>';

    var bodyHtml = (state.ui.editEntry === x.id)
      ? '<div class="act-edit">' +
          '<textarea id="entryBody" class="p4-input" rows="3">' + e(x.body) + '</textarea>' +
          err(state, 'editEntry') +
          '<div class="act-btns">' + btn('Save edit', 'entry-edit-save', x.id, { brass: true }) +
            btn('Cancel', 'entry-edit-cancel', x.id) + '</div>' +
        '</div>'
      : '<div class="act-txt">' + mention(x.body) + '</div>';

    /* controls, each behind the matching permission */
    var acts = [];
    if (state.ui.editEntry !== x.id) {
      if (x.type === 'question' && !x.resolved_at &&
          (x.assigned_to === user.id || x.author === user.id ||
           user.role === 'm1' || user.role === 'admin') && !user.read_only) {
        acts.push(btn('Mark resolved', 'resolve', x.id, { brass: true }));
      }
      if (x.type === 'decision' && !x.pinned && D.can(user, 'pinDecision', p)) {
        acts.push(btn('Pin to header', 'pin', x.id));
      }
      if (x.type === 'decision' && x.pinned && D.can(user, 'pinDecision', p)) {
        acts.push(btn('Unpin', 'unpin', x.id));
      }
      if (x.type !== 'system' && D.can(user, 'post', p) && state.ui.replyTo !== x.id) {
        acts.push(btn('Reply', 'reply-open', x.id));
      }
      if (x.type !== 'system' && !user.read_only &&
          (x.author === user.id || user.role === 'admin')) {
        acts.push(btn('Edit', 'entry-edit', x.id));
      }
    }

    var errKey = (state.ui.err && (state.ui.err.key === 'resolve' || state.ui.err.key === 'pin'))
      ? err(state, state.ui.err.key) : '';

    var replyBox = '';
    if (state.ui.replyTo === x.id) {
      replyBox = '<div class="act-reply-box">' +
        '<textarea id="replyBody" class="p4-input" rows="2" ' +
        'placeholder="Reply — one level only, so a project log never becomes a forum"></textarea>' +
        err(state, 'post') +
        '<div class="act-btns">' +
          '<button class="btn brass sm" data-act="reply-post" data-id="' + e(x.id) +
          '" data-project="' + e(p.id) + '">Post reply</button>' +
          btn('Cancel', 'reply-cancel', x.id) +
        '</div></div>';
    }

    var repliesHtml = replies.map(function (r) {
      return '<div class="act-reply">' +
        '<div class="act-meta"><b>' + e(CBP.userName(r.author)) + '</b>' +
        '<span class="num">' + e(D.fmtDateY(r.at)) + '</span>' +
        (r.edited_at ? '<span class="act-edited">edited by ' + e(CBP.userName(r.edited_by)) +
          ' · ' + e(D.fmtDateY(r.edited_at)) + '</span>' : '') +
        '</div>' +
        (state.ui.editEntry === r.id
          ? '<div class="act-edit"><textarea id="entryBody" class="p4-input" rows="2">' +
            e(r.body) + '</textarea>' + err(state, 'editEntry') + '<div class="act-btns">' +
            btn('Save edit', 'entry-edit-save', r.id, { brass: true }) +
            btn('Cancel', 'entry-edit-cancel', r.id) + '</div></div>'
          : '<div class="act-txt">' + mention(r.body) + '</div>' +
            (!state.user.read_only && (r.author === state.user.id || state.user.role === 'admin')
              ? '<div class="act-btns">' + btn('Edit', 'entry-edit', r.id) + '</div>' : '')) +
        '</div>';
    }).join('');

    return '<article class="act-entry t-' + x.type +
      (x.type === 'question' && !x.resolved_at ? ' open-q' : '') + '">' +
      '<div class="act-av' + (x.type === 'system' ? ' sys' : '') + '">' +
        (x.type === 'system' ? '⚙' : e(initials(x.author))) + '</div>' +
      '<div class="act-b">' + meta + bodyHtml +
        (acts.length ? '<div class="act-btns">' + acts.join('') + '</div>' : '') +
        errKey + repliesHtml + replyBox +
      '</div></article>';
  }

  /* -------------------------------------------------------- C-11 composer -*/

  function composer(p, state) {
    var user = state.user;
    if (!D.can(user, 'post', p)) {
      return '<div class="act-composer readonly">Read-only role — you can follow the stream and ' +
             'export it, but not post (RD/RM-3).</div>';
    }
    var d = state.ui.draft || { type: 'note', body: '', assigned_to: '' };
    var types = [['note', 'Note'], ['question', 'Question'], ['decision', 'Decision']]
      .map(function (t) {
        var on = (d.type || 'note') === t[0];
        return '<button class="act-tchip t-' + t[0] + (on ? ' on' : '') +
               '" data-act="draft-type" data-t="' + t[0] + '">' + e(t[1]) + '</button>';
      }).join('');

    var people = state.users.filter(function (u) { return u.role !== 'viewer'; });
    var assignee = (d.type === 'question')
      ? '<label class="act-assign">Assign to' +
        '<select class="sel sm" id="actAssignee">' +
        people.map(function (u) {
          return '<option value="' + e(u.id) + '"' +
                 (d.assigned_to === u.id ? ' selected' : '') + '>' + e(u.name) + '</option>';
        }).join('') + '</select></label>'
      : '';

    return '<div class="act-composer">' +
      '<textarea id="actBody" class="p4-input" rows="2" ' +
      'placeholder="Write a note, ask a question, or record a decision… @mention to notify">' +
      e(d.body || '') + '</textarea>' +
      err(state, 'post') +
      '<div class="act-crow">' + types + assignee +
        '<span class="sp">' +
          '<button class="btn brass sm" data-act="post-entry" data-id="' + e(p.id) + '">Post</button>' +
        '</span>' +
      '</div>' +
      '<div class="act-chint">A question must name an assignee and stays open until resolved. ' +
      'A decision can be pinned to the header. Nothing is ever deleted — edits are stamped ' +
      '(D-12).</div></div>';
  }

  /* ====================================== C-08 vertical approval panel ====*/

  /* C-15 — two systems × two click-done actions, per-system counter, M1 only.

     v1.1.0 (F1 · F8 · F15): the row itself is now U.gateStep, the one fragment
     P3, P6 and P10 render too, so the state pill, the source chip, the
     reference, the deep link and the outbound sync chip are the same
     everywhere. What stays here is the part only this page has: the manual
     click-done buttons, and they follow the sync mode — in Assisted or Auto
     with a proposal already waiting, the honest control is a pointer to
     Approvals, not a second way to write the same date. */
  function gateSystems(p, state, inModal) {
    var canGate = A.can(state.user, 'gate', p);

    var cards = D.gate(p).map(function (g) {
      var mode = D.syncMode ? D.syncMode(g.key) : 'manual';
      var props = (D.proposalsFor ? D.proposalsFor(p) : []).filter(function (r) {
        return r.system === g.key;
      });

      /* S-01 — the gate clock is read through D.gateSystem, never off p.gate */
      var rec = D.gateSystem(p, g.key);
      var awaiting = mode !== 'manual' && props.length > 0;

      var controls = '';
      if (canGate && awaiting) {
        controls = '<div class="p4-gwait">Awaiting ' + e(g.label) + ' (' + e(mode) + '): ' +
          props.length + ' proposal' + (props.length === 1 ? '' : 's') + ' waiting. ' +
          '<a href="#/approvals">Confirm it in Approvals</a> rather than recording the date twice.' +
          '</div>';
      } else if (canGate) {
        controls = '<div class="p4-gbtns">' +
            btn('Request submitted ✓', 'gate-click', p.id,
                { sys: g.key, step: 'submitted', disabled: !!rec.submitted_at }) +
            btn('Request approved ✓', 'gate-click', p.id,
                { sys: g.key, step: 'approved', brass: true,
                  disabled: !rec.submitted_at || !!rec.approved_at }) +
          '</div>' +
          (g.state === 'approved' ? '' :
            '<input class="p4-input sm" type="text" data-remark-for="' + e(g.key) + '" ' +
            'placeholder="Optional remark">') +
          (mode === 'manual' ? '' :
            '<div class="p4-gmode">' + e(g.label) + ' is in ' + e(mode) + ' mode — the portal ' +
            'lodges and listens, and a click here still records the step by hand.</div>');
      }

      /* v1.2.6 (R-D) — each system is its own equal card; the U.gateStep
         fragment (name, state pill, mode, source/ref/sync/link, dates and
         remark) is reused whole, the controls sit in the card foot. */
      return '<article class="sc-card' + (g.overdue ? ' is-alert' : '') + '">' +
        U.gateStep(p, g.key) +
        (controls ? '<div class="sc-foot">' + controls + '</div>' : '') + '</article>';
    }).join('');
    return '<div class="sc-grid">' + cards + '</div>' + (canGate ? '' :
      '<p class="p4-note">Gate clicks are recorded by the Regional Manager only (R-2). ' +
      'Everyone else sees the same counters, read-only.</p>');
  }
  CBP.p4.gateSystems = gateSystems;

  /* R-4 keeps both references mandatory and typed by M1, but when a system has
     already told us its own reference there is no reason to make anyone copy it
     out again: the audit row supplies the value and it stays editable. */
  function prefillRef(p, sys) {
    if ((p.refs || {})[sys]) return p.refs[sys];
    var src = D.gateSource ? D.gateSource(p, sys, 'approved') : null;
    return (src && src.ref) ? src.ref : '';
  }

  function refNote(p) {
    var got = CBP.CONFIG.GATE_SYSTEMS.filter(function (s) {
      var src = D.gateSource ? D.gateSource(p, s.key, 'approved') : null;
      return !!(src && src.ref);
    });
    if (!got.length) return '';
    return '<p class="p4-note">Pre-filled from what ' +
      e(got.map(function (s) { return s.label; }).join(' and ')) +
      ' reported — check it against the system of record before marking approved.</p>';
  }

  /* v1.2.6 (R-D) — one review division of a Corporate Agreement */
  function reviewCard(cc, div) {
    var rd = D.reviewDue ? D.reviewDue(cc, div) : null;
    var r = rd ? rd.review : null;
    var chip, cls, alert = false;
    if (!r) {
      chip = 'not started'; cls = 'is-none';
    } else if (r.status === 'approved') {
      chip = 'approved \u2713'; cls = 'is-done';
    } else if (rd.overdue) {
      chip = 'overdue ' + D.days(-rd.days); cls = 'is-stop'; alert = true;
    } else if (r.status === 'pending') {
      chip = rd.days === null ? 'pending'
        : (rd.days === 0 ? 'pending \u00b7 due today' : 'pending \u00b7 due in ' + D.days(rd.days));
      cls = 'is-wait';
    } else {
      chip = String(r.status || 'pending').replace(/_/g, ' '); cls = 'is-wait';
    }
    var meta = '';
    if (r) {
      meta = '<dl class="sc-meta">' +
        (r.assignee ? '<dt>Reviewer</dt><dd>' + e(CBP.userName(r.assignee)) + '</dd>' : '') +
        (r.due_at ? '<dt>Due</dt><dd class="num">' + e(D.fmtDateY(r.due_at)) + '</dd>' : '') +
        (r.decided_at ? '<dt>Decided</dt><dd class="num">' + e(D.fmtDateY(r.decided_at)) + '</dd>' : '') +
        '</dl>';
    } else {
      meta = '<p class="sc-empty">No review requested yet.</p>';
    }
    return '<article class="sc-card' + (alert ? ' is-alert' : '') + '">' +
      '<div class="sc-top"><h4>' + e(DIV_LABEL[div]) + '</h4>' +
        '<span class="sc-chip ' + cls + '">' + e(chip) + '</span></div>' +
      meta + '</article>';
  }

  function approvalPanel(p, state) {
    /* v1.2.7 (R-6) — while status 4 and not yet released, the aside is the
       In development card; after release a one-line note leads the v1.2.6
       cards, which are otherwise untouched. */
    if (p.status === 4 && !D.devReleased(p)) return devCard(p, state);
    var user = state.user;
    var declined = p.status === 'declined';
    var html = releasedLine(p);

    /* T-08 — steps 1, 2, the Corporate Agreement step and Implementation used to
       be four hand-written stepRow() narratives here, a second telling of the
       ladder the header already draws with U.stepper (pills + the U.rungSubline
       sub-line, one helper, identical wording on P3, P4, P6 and P10). Repeating
       that line here would only make the record disagree with itself the first
       time somebody edited one copy. What is left in this panel is what belongs
       to it alone: the gate controls, the contract gate, the reference form and
       the action rows. */

    /* 3 · external gate */
    html += '<div class="p4-gate"><div class="p4-glab">External gate: Decision Point and CHaS</div>' +
      (declined ? empty('The gate never opened for this record.') : gateSystems(p, state)) +
      '</div>';

    /* S-08 — the Corporate Agreement is a gate inside status 2, and a gate is
       named and reachable on the record, not only described in a sub-line. The
       STATE comes from the same D.contractGate the rung line reads; what is
       added here is the name of the gate and the way into the register. */
    var cg = D.contractGate ? D.contractGate(p) : null;
    if (cg && cg.state !== 'na' && !declined) {
      var cc = cg.contract;
      /* v1.2.6 (R-D) — header row (chip · id · age · Open agreement), then the
         two review divisions as equal cards read from cc.reviews. */
      html += '<div class="p4-gate p4-cgate">' +
        '<div class="p4-glab">Corporate Agreement: the gate inside status 2</div>' +
        '<div class="p4-cg sc-head' + (cg.met ? ' ok' : '') + '">' +
          '<span class="p6-gp' + (cg.met ? ' ok' : ' wait') + '">' +
            e(CONTRACT_CHIP[cg.state] || cg.state) + '</span>' +
          (cc ? '<b class="num sc-id">' + e(cc.id) + '</b>' : '') +
          (cg.days !== null && cg.days !== undefined
            ? '<span class="num sc-days">' + D.days(cg.days) + ' since it last moved</span>' : '') +
          (D.can(user, 'contract_view')
            ? '<span class="sc-headbtn">' + btn(cc ? 'Open agreement' : 'Open Contracts',
                'p6x-open-contract', cc ? cc.id : '') + '</span>'
            : '') +
        '</div>' +
        (cc ? '<div class="sc-grid">' + reviewCard(cc, 'ogc') + reviewCard(cc, 'finance') + '</div>' : '') +
        '<p class="p4-note">' + (cg.met
          ? 'The agreement has been sent out — implementation may start.'
          : 'Must be complete and sent out before implementation can start (' +
            D.money(CBP.CONFIG.CONTRACT_THRESHOLD_USD) + ' threshold).') + '</p>' +
        '</div>';
    }

    /* 4 · Mark Approved — the A-07 prompt and the two mandatory references.
       This is the one rung that carries a FORM, which is why it survives the
       collapse: R-4 will not take a reference the reader has not typed. */
    if (A.readyToMark(p)) {
      html += '<div class="p4-ready">' +
        '<b>Both gates cleared · ready to mark approved</b>' +
        '<small>A-07 prompt: the project is still at status 3. Both reference numbers are ' +
        'mandatory (R-4).</small>' +
        (D.can(user, 'markApproved')
          ? '<label class="p4-lab">Decision Point reference' +
            '<input class="p4-input" type="text" id="refDP" value="' +
            e(prefillRef(p, 'decision_point')) + '" placeholder="e.g. DP-2026-0501"></label>' +
            '<label class="p4-lab">CHaS reference' +
            '<input class="p4-input" type="text" id="refCH" value="' +
            e(prefillRef(p, 'chas')) + '" placeholder="e.g. CHS-78110"></label>' +
            refNote(p) +
            err(state, 'mark') +
            '<div class="p4-actrow">' + btn('Mark Approved · 3 → 2', 'do-mark', p.id,
              { brass: true, sm: false }) + '</div>'
          : '<small>Only the Regional Manager can mark the project approved.</small>') +
        '</div>';
    }

    /* action buttons per role */
    var acts = [];
    if (A.can(user, 'submit', p)) acts.push(btn('Request submitted', 'ask-submit', p.id, { brass: true, sm: false }));
    if (A.can(user, 'review', p)) {
      acts.push(btn('Request approved', 'ask-approve', p.id, { brass: true, sm: false }));
      acts.push(btn('Return to Review', 'ask-return', p.id, { sm: false }));
      acts.push(btn('Reject', 'ask-reject', p.id, { sm: false }));
    }
    /* S-08 — A.can('start') already refuses while the agreement is unsent, so
       the button would simply vanish. A control that disappears teaches nobody
       why: it is rendered disabled instead, carrying the reason as its title. */
    var blocked = p.status === 2 && !declined &&
      D.contractRequired && D.contractRequired(p) &&
      CBP.contracts && !CBP.contracts.gateMet(p);

    if (A.can(user, 'start', p)) {
      acts.push(btn('Start implementation', 'ask-start', p.id, { brass: true, sm: false }));
    } else if (blocked && (D.can(user, 'markApproved') || D.can(user, 'manageUsers'))) {
      acts.push('<button class="btn brass" disabled title="' +
        e('Corporate Agreement must be sent out first') +
        '">Start implementation</button>');
    }

    var errBlock = ['submit', 'review', 'return', 'reject', 'gate', 'start']
      .map(function (k) { return err(state, k); }).join('');

    var tail = acts.length
      ? '<div class="p4-actrow">' + acts.join('') + '</div>'
      : (A.can(user, 'gate', p) || A.readyToMark(p)
          ? ''                                   /* the gate controls above are the action */
          : '<p class="p4-note">Nothing here is waiting on your role right now.</p>');

    return U.card('Approval status',
      '<div class="p4-steps">' + html + '</div>' + errBlock + tail, { cls: 'p4-appr' });
  }

  function peopleCard(p, state) {
    var o = p.owner;
    return U.card('Owner',
      '<div class="p4-owner">' +
        '<span class="act-av">' + e(o ? initials(o) : '—') + '</span>' +
        '<div><b>' + e(o ? CBP.userName(o) : 'unassigned') + '</b>' +
        '<small>' + e(o && CBP.userById(o)
          ? (CBP.userById(o).title || CBP.CONFIG.ROLE_LABEL[CBP.userById(o).role])
          : 'country staff · ' + countryName(p.country)) + '</small></div>' +
      '</div>' +
      '<div class="p4-fields">' +
        field('Backup', p.backup ? CBP.userName(p.backup) : 'none') +
        field('Alert routing', p.owner ? 'owner + backup' : 'blocked: no owner') +
      '</div>' +
      (A.can(state.user, 'edit', p)
        ? '<div class="p4-actrow">' + btn('Owner settings', 'p4-edit', p.id) + '</div>' : ''));
  }

  /* ============================= v1.2.7 · in development (R-3 … R-8a) =====
     Lane C. Everything below reads D.dev* (derive.js) and writes only through
     the dev-* acts in actions.js. Page-local state, all session-only:
       ui.p4TabFor      the record the tab default was last applied to
       ui.p4DevOpen     {pid: {stage: bool}} — accordion state (details toggle)
       ui.p4DevKeep     {pid: {fieldId: value}} — typed-but-unsent field text
       ui.p4DevConfirm  section key whose "Reset to generated" asks to confirm
       ui.devDraft      {pid: {sec: html}} — unsaved editor text (CORE_API §1) */

  var DEV_GLYPH = { notstarted: '○', inprogress: '◐', done: '✓' };
  var DEV_ORDER = ['notstarted', 'inprogress', 'done'];
  var GATED_TITLE = 'In development not yet released by the Regional Manager or Admin';
  var STAGE_SUMMARY = {
    assessment: 'Observations, justification and images',
    concept: 'Pre-draft, documents, review link and mail',
    orgcheck: 'Information pack, review link and mail to HQ',
    areacomm: 'Information pack, review link and mail to the Area office'
  };

  function devStagesCfg() { return CBP.CONFIG.DEV_STAGES || []; }
  function devRec(p) {
    var st = CBP.state.devStages;
    return st && p && st[p.id] ? st[p.id] : null;
  }
  function hasDevTab(p) { return !!p && (p.status === 4 || !!devRec(p)); }
  function devDefault(p) { return p.status === 4 && !D.devReleased(p); }
  function tabList(p) {
    return hasDevTab(p) ? [{ k: 'development', label: 'Development' }].concat(TABS) : TABS;
  }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function statusLabel(s) { return D.devStatusLabel ? D.devStatusLabel(s) : s; }

  function devChip(status) {
    var s = DEV_GLYPH[status] ? status : 'notstarted';
    return '<span class="pd-chip is-' + s + '"><span aria-hidden="true">' + DEV_GLYPH[s] +
      '</span>' + e(statusLabel(s)) + '</span>';
  }

  function devProgress(done, total) {
    var cells = '';
    for (var i = 0; i < total; i++) cells += '<i' + (i < done ? ' class="on"' : '') + '></i>';
    return '<div class="pd-prog"><span class="pd-bar" aria-hidden="true">' + cells + '</span>' +
      '<span class="pd-cnt"><b class="num">' + done + ' of ' + total + '</b> stages done</span></div>';
  }

  function keepOf(pid) {
    var k = CBP.state.ui.p4DevKeep;
    return (k && k[pid]) || {};
  }
  function kept(pid, id, dflt) {
    var k = keepOf(pid);
    return typeof k[id] === 'string' ? k[id] : (dflt == null ? '' : dflt);
  }

  function releasedLine(p) {
    var r = D.devOf(p);
    if (!r.released) return '';
    return '<p class="pdc-rel"><span class="pdc-relic" aria-hidden="true">✓</span><span>' +
      'Released to submission by <b>' + e(CBP.userName(r.released_by)) + '</b> on ' +
      '<span class="num">' + e(D.fmtDateY(r.released_at)) + '</span> · ' +
      '<button type="button" class="p4-inlink" data-act="p4tab" data-tab="development">' +
      'development record</button></span></p>';
  }

  /* ---- aside: the In development card (replaces the gate cards) ---- */
  function devCard(p, state) {
    var user = state.user;
    var f = D.devFront(p);
    var total = f.stages.length;
    var rows = f.stages.map(function (s) {
      return '<li class="pdc-i is-' + e(s.status) + '">' +
        '<div class="pdc-top"><b class="pdc-lb">' + e(s.label) + '</b>' + devChip(s.status) + '</div>' +
        '<p class="pdc-by">' + (s.updated_by
          ? 'by ' + e(CBP.userName(s.updated_by)) + ' · <span class="num">' +
            e(D.fmtDateY(s.updated_at)) + '</span>'
          : 'No change recorded yet') + '</p>' +
        (s.note ? '<p class="pdc-note">' + e(s.note) + '</p>' : '') +
        '</li>';
    }).join('');

    var foot = '';
    if (D.can(user, 'dev_release', p)) {
      foot += '<div class="p4-actrow pdc-act"><button class="btn brass" data-act="dev-release" data-id="' +
        e(p.id) + '"' + (f.allDone ? '' : ' disabled title="' +
        e('All four stages must be Done before release (' + f.doneCount + ' of ' + total + ')') + '"') +
        '>Release to submission</button></div>' +
        '<p class="pdc-hint">' + (f.allDone
          ? 'All four stages are Done. Releasing opens Request submitted for the owner and notifies them and the Area Manager.'
          : 'Opens once all four stages are Done (' + f.doneCount + ' of ' + total + ' so far).') + '</p>';
    } else if (f.allDone) {
      foot += '<p class="pdc-wait">All four stages are Done. Waiting for the Regional Manager or Admin to release it to submission.</p>';
    } else {
      foot += '<p class="pdc-hint">When all four stages are Done, the Regional Manager or Admin releases the project to submission.</p>';
    }
    if (D.can(user, 'submit', p) && !A.can(user, 'submit', p)) {
      foot += '<div class="p4-actrow pdc-act"><button class="btn" disabled title="' + e(GATED_TITLE) +
        '">Request submitted</button></div>' +
        '<p class="pdc-hint">Request submitted opens after the release.</p>';
    }
    var onTab = state.ui.p4Tab === 'development';
    var errs = (onTab ? '' : err(state, 'dev')) + err(state, 'submit');
    return U.card('In development',
      devProgress(f.doneCount, total) +
      '<ol class="pdc-list">' + rows + '</ol>' + errs + foot +
      (onTab ? '' : '<p class="pdc-go"><button type="button" class="p4-inlink" data-act="p4tab" ' +
        'data-tab="development">Open the Development tab</button></p>'),
      { cls: 'p4-appr pdc' });
  }

  /* ---- Development tab ---- */
  function devTab(p, state) {
    var user = state.user;
    var f = D.devFront(p);
    var canEdit = D.devCanEdit(user, p);
    var cur = null;
    f.stages.forEach(function (s) { if (!cur && s.status !== 'done') cur = s.key; });
    var openMap = (state.ui.p4DevOpen && state.ui.p4DevOpen[p.id]) || {};

    var ro = '';
    if (f.released) {
      ro = '<p class="pd-ro"><span aria-hidden="true">✓</span> Released to submission by <b>' +
        e(CBP.userName(f.released_by)) + '</b> on ' + e(D.fmtDateY(f.released_at)) +
        '. This record is read-only history.</p>';
    } else if (p.status !== 4) {
      ro = '<p class="pd-ro">The project has left status 4. This record is read-only history.</p>';
    } else if (!canEdit) {
      ro = '<p class="pd-ro">Read-only for your role. You can read every stage and open or download ' +
        'the documents; the owner, the Area Manager, the Regional Manager or Admin make the changes.</p>';
    }
    var x = state.ui.err;
    var errHtml = (x && x.key === 'dev')
      ? '<div class="p4-err pd-err" role="alert">' + e(x.msg) + '</div>' : '';

    var panels = devStagesCfg().map(function (st, i) {
      var open = typeof openMap[st.key] === 'boolean' ? openMap[st.key] : st.key === cur;
      return stagePanel(p, st, i, open, canEdit, state);
    }).join('');

    return '<section class="card pd" aria-labelledby="pd-h">' +
      '<div class="pd-top"><h2 id="pd-h">In development</h2>' + devProgress(f.doneCount, f.stages.length) + '</div>' +
      '<p class="pd-lede">Four stages, in order. Each one is marked Not started, In progress or Done with a ' +
      'note; when all four are Done the Regional Manager or Admin releases the project to submission.</p>' +
      ro + errHtml + '<div class="pd-stages">' + panels + '</div></section>';
  }

  function stageCounts(key, sg) {
    var bits = [];
    if (key === 'assessment') {
      bits.push(plural(sg.observations.length, 'observation'));
      bits.push(plural(sg.images.length, 'image'));
    } else {
      if (key === 'concept' && sg.draft) {
        var ed = sg.draft.sections.filter(function (s) { return s.edited; }).length;
        bits.push('pre-draft' + (ed ? ', ' + ed + ' edited' : ''));
      }
      bits.push(plural(sg.docs.length, 'document'));
      bits.push(plural(sg.comments.length, 'comment'));
    }
    return bits.join(' · ');
  }

  function stagePanel(p, st, i, open, canEdit, state) {
    var key = st.key, pid = p.id;
    var sg = D.devStage(p, key);
    var aud = key !== 'assessment' && st.audience ? D.devAudience(p, key) : null;
    var meta = (aud ? 'For ' + e(aud.label) + ' · ' : '') + (sg.updated_by
      ? 'by ' + e(CBP.userName(sg.updated_by)) + ' · <span class="num">' + e(D.fmtDateY(sg.updated_at)) + '</span>'
      : 'no change recorded yet');

    var ctl = '';
    if (canEdit) {
      ctl = '<div class="pd-ctl">' +
        '<div class="pd-seg" role="group" aria-label="' + e('Status of ' + st.label) + '">' +
        DEV_ORDER.map(function (v) {
          var on = sg.status === v;
          return '<button type="button" class="pd-sb is-' + v + (on ? ' on' : '') +
            '" data-act="dev-stage-status" data-id="' + e(pid) + '" data-stage="' + e(key) +
            '" data-value="' + v + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
            '<span aria-hidden="true">' + DEV_GLYPH[v] + '</span>' + e(statusLabel(v)) + '</button>';
        }).join('') + '</div>' +
        '<div class="pd-notef"><label for="devNote-' + e(key) + '">Note</label>' +
        '<input class="inp pd-in" type="text" id="devNote-' + e(key) + '" data-keep="1" value="' +
        e(kept(pid, 'devNote-' + key, sg.note)) + '" placeholder="Saved with the status you press">' +
        '</div></div>';
    } else if (sg.note) {
      ctl = '<p class="pd-noteRo"><b>Note</b> ' + e(sg.note) + '</p>';
    }

    var body;
    if (key === 'assessment') body = assessBody(p, sg, canEdit);
    else if (key === 'concept') body = conceptBody(p, sg, canEdit, state) + docStrip(p, key, sg, canEdit);
    else body = '<p class="pd-sub">' + (key === 'orgcheck'
        ? 'The Org Background check goes to HQ with the project information pack.'
        : 'The Area Humane Society Communication goes to the Area office with the project information pack.') +
        '</p>' + docStrip(p, key, sg, canEdit);

    return '<section class="pd-stage is-' + e(sg.status) + '" id="pd-' + e(key) + '" aria-labelledby="pd-h-' + e(key) + '">' +
      '<div class="pd-hd">' +
        '<span class="pd-num" aria-hidden="true">' + (i + 1) + '</span>' +
        '<div class="pd-ttl"><h3 id="pd-h-' + e(key) + '">' + e(st.label) + '</h3>' +
          '<p class="pd-meta">' + meta + '</p></div>' +
        devChip(sg.status) +
      '</div>' + ctl +
      '<details class="pd-det" data-pid="' + e(pid) + '" data-stage="' + e(key) + '"' + (open ? ' open' : '') + '>' +
        '<summary><span class="pd-sumt">' + e(STAGE_SUMMARY[key] || 'Stage work') + '</span>' +
        '<span class="pd-sumc">' + e(stageCounts(key, sg)) + '</span></summary>' +
        '<div class="pd-body">' + body + '</div></details>' +
      '</section>';
  }

  /* the "new observation" box empties once an add has gone through */
  function obsNewValue(pid, sg) {
    var k = keepOf(pid);
    if (k._obsN !== undefined && sg.observations.length > +k._obsN) {
      delete k.devObsNew; delete k._obsN;
    }
    return kept(pid, 'devObsNew');
  }

  /* ---- stage 1 · Assessment ---- */
  function assessBody(p, sg, canEdit) {
    var pid = p.id;
    var cfg = CBP.CONFIG;
    var max = cfg.DEV_IMG_MAX || 6, kb = Math.round((cfg.DEV_IMG_BYTES || 409600) / 1024);
    var obs, just, imgs;

    if (canEdit) {
      obs = '<ol class="pd-obs">' + sg.observations.map(function (o, i) {
        var id = 'devObs-' + o.id;
        return '<li><label class="vh" for="' + e(id) + '">Observation ' + (i + 1) + '</label>' +
          '<input class="inp pd-in" type="text" id="' + e(id) + '" data-keep="1" value="' +
          e(kept(pid, id, o.text)) + '">' +
          '<button type="button" class="btn sm" data-act="dev-obs-del" data-id="' + e(pid) +
          '" data-obs="' + e(o.id) + '" aria-label="' + e('Remove observation ' + (i + 1)) + '">Remove</button></li>';
      }).join('') + '</ol>' +
      (sg.observations.length ? '' : '<p class="pd-empty">No observations yet.</p>') +
      '<div class="pd-add"><label class="vh" for="devObsNew">New observation</label>' +
        '<input class="inp pd-in" type="text" id="devObsNew" data-keep="1" value="' +
        e(obsNewValue(pid, sg)) +
        '" placeholder="Add an observation from the site visit">' +
        '<button type="button" class="btn sm" data-act="dev-obs-add" data-id="' + e(pid) + '">Add</button></div>';
      just = '<label class="pd-lab" for="devJust">Justification</label>' +
        '<textarea class="inp pd-in" id="devJust" rows="4" data-keep="1" placeholder="Why this project is needed, in a few sentences">' +
        e(kept(pid, 'devJust', sg.justification)) + '</textarea>' +
        '<div class="pd-actrow"><button type="button" class="btn sm brass" data-act="dev-assess-save" data-id="' +
        e(pid) + '">Save assessment</button><span class="pd-hint">Saves the observations and the justification.</span></div>';
    } else {
      obs = sg.observations.length
        ? '<ul class="pd-obsro">' + sg.observations.map(function (o) { return '<li>' + e(o.text) + '</li>'; }).join('') + '</ul>'
        : '<p class="pd-empty">No observations recorded.</p>';
      just = '<h4>Justification</h4>' + (sg.justification
        ? '<p class="pd-just">' + e(sg.justification) + '</p>'
        : '<p class="pd-empty">No justification recorded.</p>');
    }

    imgs = '<ul class="pd-imgs">' + sg.images.map(function (im) {
      var src = /^data:image\/(png|jpeg);base64,/.test(im.data || '') ? im.data : '';
      var capId = 'devCap-' + im.id;
      return '<li class="pd-img"><figure>' +
        (src ? '<img src="' + e(src) + '" alt="' + e(im.caption || im.name) + '">' : '<div class="pd-noimg">No preview</div>') +
        '<figcaption><b>' + e(im.name) + '</b>' +
        (im.bytes ? '<span class="num">' + Math.max(1, Math.round(im.bytes / 1024)) + ' KB</span>' : '') +
        (canEdit ? '' : (im.caption ? '<span class="pd-cap">' + e(im.caption) + '</span>' : '')) +
        '</figcaption></figure>' +
        (canEdit
          ? '<label class="vh" for="' + e(capId) + '">Caption for ' + e(im.name) + '</label>' +
            '<input class="inp pd-in" type="text" id="' + e(capId) + '" data-keep="1" value="' +
            e(kept(pid, capId, im.caption)) + '" placeholder="Caption">' +
            '<div class="pd-imact"><button type="button" class="btn sm" data-act="dev-img-caption" data-id="' +
            e(pid) + '" data-img="' + e(im.id) + '">Save caption</button>' +
            '<button type="button" class="btn sm" data-act="dev-img-del" data-id="' + e(pid) +
            '" data-img="' + e(im.id) + '" aria-label="' + e('Remove image ' + im.name) + '">Remove</button></div>'
          : '') +
        '</li>';
    }).join('') + '</ul>' +
    (sg.images.length ? '' : '<p class="pd-empty">No images yet.</p>');

    var add = canEdit
      ? '<div class="pd-actrow">' + (sg.images.length < max
          ? '<label class="btn sm pd-file">Add images<input class="vh" type="file" data-act="dev-img-add" data-id="' +
            e(pid) + '" accept="image/png,image/jpeg" multiple></label>'
          : '<button type="button" class="btn sm" disabled>Add images</button>') +
        '<span class="pd-hint">' + sg.images.length + ' of ' + max + ' images · PNG or JPEG · up to ' + kb +
        ' KB each. Images appear in the concept draft appendix.</span></div>'
      : '';

    return '<div class="pd-grid2">' +
      '<div class="pd-blk"><h4>Observations</h4>' + obs + '</div>' +
      '<div class="pd-blk">' + just + '</div></div>' +
      '<div class="pd-blk"><h4>Images</h4>' + imgs + add + '</div>';
  }

  /* ---- stage 2 · Project Concept pre-draft (block editor) ---- */
  function conceptBody(p, sg, canEdit, state) {
    var pid = p.id, d = sg.draft;
    if (!d || !d.sections || !d.sections.length) {
      return '<div class="pd-blk pd-gen"><h4>Pre-draft</h4>' +
        '<p class="pd-empty">No pre-draft yet. Generating one fills nine sections from the project record and the Assessment; each section can then be edited.</p>' +
        (canEdit ? '<button type="button" class="btn sm brass" data-act="dev-concept-generate" data-id="' +
          e(pid) + '">Generate pre-draft</button>' : '') + '</div>';
    }
    var drafts = (state.ui.devDraft && state.ui.devDraft[pid]) || {};
    var edited = d.sections.filter(function (s) { return s.edited; }).length;
    var head = '<div class="pd-bh"><h4>Pre-draft · 9 sections</h4>' +
      (canEdit ? '<button type="button" class="btn sm" data-act="dev-concept-generate" data-id="' + e(pid) +
        '" title="Rebuilds the sections you have not edited">Regenerate unedited sections</button>' : '') + '</div>' +
      '<p class="pd-sub">Generated <span class="num">' + e(D.fmtDateY(d.generated_at)) + '</span>' +
      (d.by ? ' by ' + e(CBP.userName(d.by)) : '') + ' · ' + plural(edited, 'section') + ' edited' +
      (canEdit ? '. Format with the small toolbar; paste comes in as plain text.' : '') + '</p>';
    var blocks = d.sections.map(function (sec, i) {
      return edBlock(pid, sec, i + 1, canEdit, drafts, state.ui.p4DevConfirm);
    }).join('');
    return '<div class="pd-blk pd-draft">' + head + blocks + '</div>';
  }

  function edBlock(pid, sec, n, canEdit, drafts, confirmSec) {
    var k = sec.key, G = CBP.docgen;
    var hasDraft = typeof drafts[k] === 'string';
    var html = G.sanitize(hasDraft ? drafts[k] : sec.html);
    var dirty = hasDraft && drafts[k] !== sec.html;
    var hid = 'edh-' + k;
    var title = n + ' · ' + sec.title;
    var flag = sec.edited ? '<span class="ed-flag">✎ Edited</span>' : '';
    if (!canEdit) {
      return '<div class="ed-block ed-roblk" data-sec="' + e(k) + '"><div class="ed-hd"><h5 id="' + e(hid) + '">' +
        e(title) + '</h5>' + flag + '</div>' +
        '<div class="ed-area ed-ro" role="region" aria-labelledby="' + e(hid) + '">' + html + '</div></div>';
    }
    var tb = '<div class="ed-tb" role="toolbar" aria-label="' + e('Formatting for ' + sec.title) + '" aria-controls="ed-' + e(k) + '">' +
      '<button type="button" data-ed="h3" tabindex="0" aria-pressed="false" title="Sub-heading">H3</button>' +
      '<button type="button" data-ed="bold" tabindex="-1" aria-pressed="false" aria-label="Bold" title="Bold (Ctrl+B)"><b>B</b></button>' +
      '<button type="button" data-ed="italic" tabindex="-1" aria-pressed="false" aria-label="Italic" title="Italic (Ctrl+I)"><span class="i">I</span></button>' +
      '<button type="button" data-ed="ul" tabindex="-1" aria-pressed="false" aria-label="Bullet list" title="Bullet list">•≡</button>' +
      '</div>';
    var foot;
    if (confirmSec === k) {
      foot = '<div class="ed-confirm" role="group" aria-label="Confirm reset"><span>Discard your edits to <b>' +
        e(sec.title) + '</b>?</span>' +
        '<button type="button" class="btn sm brass" data-act="dev-section-reset" data-id="' + e(pid) +
        '" data-sec="' + e(k) + '" data-confirm="1">Reset</button>' +
        '<button type="button" class="btn sm" data-act="dev-section-reset" data-id="' + e(pid) +
        '" data-sec="' + e(k) + '" data-cancel="1">Keep editing</button></div>';
    } else {
      foot = '<span class="ed-state" id="eds-' + e(k) + '" aria-live="polite">' +
        (dirty ? 'Unsaved changes' : (sec.edited ? 'Saved · edited' : 'As generated')) + '</span>' +
        '<button type="button" class="btn sm brass" data-act="dev-section-save" data-id="' + e(pid) +
        '" data-sec="' + e(k) + '">Save section</button>' +
        '<button type="button" class="btn sm" data-act="dev-section-reset" data-id="' + e(pid) +
        '" data-sec="' + e(k) + '">Reset to generated</button>';
    }
    return '<div class="ed-block' + (dirty ? ' dirty' : '') + '" data-sec="' + e(k) + '">' +
      '<div class="ed-hd"><h5 id="' + e(hid) + '">' + e(title) + '</h5>' + flag + tb + '</div>' +
      '<div class="ed-area" id="ed-' + e(k) + '" contenteditable="true" role="textbox" aria-multiline="true" ' +
        'aria-labelledby="' + e(hid) + '" aria-describedby="eds-' + e(k) + '" spellcheck="true" ' +
        'data-placeholder="' + e('Write the ' + sec.title.toLowerCase() + '…') + '">' + html + '</div>' +
      '<div class="ed-ft">' + foot + '</div></div>';
  }

  /* ---- Documents · Review link · Send from portal · Comments ---- */
  function docNoun(key) { return key === 'concept' ? 'Project Concept Draft' : 'project information pack'; }

  function docStrip(p, key, sg, canEdit) {
    var pid = p.id;
    var aud = D.devAudience(p, key);
    var docs = sg.docs.slice().reverse();
    var latest = docs[0] || null;

    var docsHtml = '<div class="pd-blk"><div class="pd-bh"><h4>Documents</h4>' +
      (canEdit ? '<button type="button" class="btn sm brass" data-act="dev-doc-generate" data-id="' + e(pid) +
        '" data-stage="' + e(key) + '">Generate ' + e(key === 'concept' ? 'Project Concept Draft' : 'information pack') +
        '</button>' : '') + '</div>' +
      (docs.length ? '<ul class="pd-docs">' + docs.map(function (d, i) {
        return '<li><div class="pd-dtx"><b>' + e(d.title) + '</b><span>by ' + e(CBP.userName(d.by)) +
          ' · <span class="num">' + e(D.fmtDateY(d.at)) + '</span>' + (i === 0 ? ' · latest' : '') + '</span></div>' +
          '<div class="pd-dact"><button type="button" class="btn sm" data-act="dev-doc-print" data-doc="' + e(d.id) +
          '">Open · print / PDF</button><button type="button" class="btn sm" data-act="dev-doc-docx" data-doc="' +
          e(d.id) + '">Download .docx</button></div></li>';
      }).join('') + '</ul>'
        : '<p class="pd-empty">No ' + e(docNoun(key)) + ' generated yet.</p>') + '</div>';

    var active = sg.links.filter(function (l) { return l.active; }).pop() || null;
    var inactive = sg.links.filter(function (l) { return !l.active; }).length;
    var linkDoc = active ? sg.docs.filter(function (d) { return d.id === active.doc_id; })[0] : null;
    var linkHtml = '<div class="pd-blk"><div class="pd-bh"><h4>Review link</h4>' +
      '<span class="pd-aud">Audience: <b>' + e(aud.label) + '</b></span></div>';
    if (active) {
      var url = A.devReviewUrl ? A.devReviewUrl(active.token) : '#/review/' + active.token;
      linkHtml += '<div class="pd-link"><label class="vh" for="devLink-' + e(active.token) + '">' +
        e('Review link for ' + aud.label) + '</label>' +
        '<input class="inp pd-in" type="text" readonly id="devLink-' + e(active.token) + '" value="' + e(url) + '">' +
        '<div class="pd-lact"><button type="button" class="btn sm" data-act="dev-link-copy" data-id="' + e(pid) +
        '" data-token="' + e(active.token) + '">Copy</button>' +
        '<a class="btn sm" href="#/review/' + e(active.token) + '" target="_blank" rel="noopener">Preview ↗</a>' +
        (canEdit ? '<button type="button" class="btn sm" data-act="dev-link-revoke" data-id="' + e(pid) +
          '" data-token="' + e(active.token) + '">Revoke</button>' : '') + '</div></div>' +
        '<p class="pd-hint">Opens ' + (linkDoc ? '<b>' + e(linkDoc.title) + '</b>' : 'the document') +
        ' · created by ' + e(CBP.userName(active.by)) + ' on <span class="num">' + e(D.fmtDateY(active.created_at)) +
        '</span>. No sign-in; an e-mail address is required to comment.</p>';
    } else {
      linkHtml += '<p class="pd-empty">No active link' + (D.devReleased(p) ? ' — links close at release.' : '.') + '</p>';
    }
    if (canEdit) {
      linkHtml += '<div class="pd-actrow"><button type="button" class="btn sm" data-act="dev-link-mint" data-id="' +
        e(pid) + '" data-stage="' + e(key) + '"' + (latest ? '' : ' disabled') + '>' +
        (active ? 'Replace with a new link' : 'Create review link') + '</button>' +
        '<span class="pd-hint">' + (latest ? 'A link always opens the latest document; creating one closes the previous link.'
          : 'Generate the document first.') + '</span></div>';
    }
    if (inactive) linkHtml += '<p class="pd-hint">' + plural(inactive, 'earlier link') + ' no longer active.</p>';
    linkHtml += '</div>';

    return '<div class="pd-grid2">' + docsHtml + linkHtml + '</div>' +
      mailForm(p, key, sg, aud, active, canEdit) + commentsList(sg);
  }

  function mailChips(value) {
    var list = String(value || '').split(/[,;\s]+/).filter(Boolean);
    return list.map(function (a) {
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a);
      return '<span class="ml-chip' + (ok ? '' : ' bad') + '"><span aria-hidden="true">' + (ok ? '✓' : '⚠') +
        '</span>' + e(a) + (ok ? '' : ' · not an e-mail address') + '</span>';
    }).join('');
  }

  function mailForm(p, key, sg, aud, active, canEdit) {
    var pid = p.id;
    var sent = (sg.mails || []).slice().reverse();
    var sentHtml = sent.length ? '<ul class="pd-sent">' + sent.map(function (m) {
      return '<li><b>' + e(m.subject) + '</b><span>to ' + e((m.to || []).join(', ')) + ' · <span class="num">' +
        e(D.fmtDateY(m.at)) + '</span>' + (m.by ? ' · by ' + e(CBP.userName(m.by)) : '') + '</span></li>';
    }).join('') + '</ul>' : '';
    if (!canEdit) {
      return sent.length ? '<div class="pd-blk"><h4>Mail sent from the portal</h4>' + sentHtml + '</div>' : '';
    }
    var keep = keepOf(pid);
    if (keep['_mailN-' + key] !== undefined && sent.length > +keep['_mailN-' + key]) {
      /* a send went through since the text was typed: start the form afresh */
      ['devMailTo-', 'devMailSubj-', 'devMailBody-', '_mailN-'].forEach(function (x) { delete keep[x + key]; });
    }
    var owner = p.owner ? CBP.userById(p.owner) : null;
    var country = countryName(p.country);
    var noun = docNoun(key);
    var url = active ? (A.devReviewUrl ? A.devReviewUrl(active.token) : '#/review/' + active.token)
                     : '[create a review link first]';
    /* v1.2.7 F10 — one subject per stage kind */
    var dSubj = key === 'orgcheck' ? 'Org background check: ' + pid + ' ' + p.name
              : key === 'areacomm' ? 'Area humanitarian communication: ' + pid + ' ' + p.name
              : 'Review request: ' + noun + ' — ' + pid + ' ' + p.name;
    var dBody = 'Hello,\n\nPlease review the ' + noun + ' for ' + pid + ' · ' + p.name + ' (' + country + ').\n\n' +
      'Open the document and leave a comment here, no sign-in needed:\n' + url + '\n\n' +
      'Replies to this e-mail reach the project team.\n\nThank you,\n' +
      (owner ? owner.name : CBP.userName(p.owner)) + '\n' +
      (owner ? (owner.title || CBP.CONFIG.ROLE_LABEL[owner.role] || '') : 'Project owner') + ', ' + country;
    var to = kept(pid, 'devMailTo-' + key, aud.to.join(', '));
    var k = e(key);
    return '<fieldset class="ml pd-blk"><legend>Send from portal</legend>' +
      '<div class="ml-row"><label for="devMailTo-' + k + '">To</label><div>' +
        '<input class="inp" type="text" id="devMailTo-' + k + '" data-keep="1" data-chips="devMailChips-' + k +
        '" value="' + e(to) + '" autocomplete="off" aria-describedby="devMailToHelp-' + k + '">' +
        '<div class="ml-chips" id="devMailChips-' + k + '" aria-live="polite">' + mailChips(to) + '</div>' +
        '<p class="ml-note" id="devMailToHelp-' + k + '">Separate addresses with commas. Recipients do not need an account.</p></div></div>' +
      '<div class="ml-row"><label for="devMailSubj-' + k + '">Subject</label><div><input class="inp" type="text" id="devMailSubj-' + k +
        '" data-keep="1" value="' + e(kept(pid, 'devMailSubj-' + key, dSubj)) + '"></div></div>' +
      '<div class="ml-row"><label for="devMailBody-' + k + '">Message</label><div><textarea class="inp" id="devMailBody-' + k +
        '" data-keep="1" rows="10">' + e(kept(pid, 'devMailBody-' + key, dBody)) + '</textarea></div></div>' +
      '<div class="ml-row"><span class="k" id="devMailRt-' + k + '">Reply-to</span><div>' +
        '<div class="ml-ro" aria-labelledby="devMailRt-' + k + '">' + e(aud.reply_to) + '</div>' +
        '<p class="ml-note">Set by the portal; replies are filed on this project.</p></div></div>' +
      '<div class="pd-actrow"><button type="button" class="btn sm brass" data-act="dev-mail-send" data-id="' + e(pid) +
        '" data-stage="' + k + '"' + (active ? '' : ' disabled title="Create a review link first"') + '>Send from portal</button>' +
        '<span class="pd-hint">Sent from the portal’s address. In this demo it lands in Alerts › Sent log; no real mail leaves.</span></div>' +
      (sentHtml ? '<h5 class="pd-lab">Sent</h5>' + sentHtml : '') +
      '</fieldset>';
  }

  function commentsList(sg) {
    var list = sg.comments.slice().reverse();
    return '<div class="pd-blk"><div class="pd-bh"><h4>Comments received <span class="pd-n num">' +
      list.length + '</span></h4></div>' +
      (list.length ? '<ul class="pd-cms">' + list.map(function (c) {
        return '<li class="pd-cm"><div class="pd-cmh"><b>' + e(c.name || c.email) + '</b>' +
          '<span>' + e(c.email) + ' · <span class="num">' + e(D.fmtDateY(c.at)) + '</span> · via ' +
          e(c.via) + '</span></div><p>' + e(c.body) + '</p></li>';
      }).join('') + '</ul>'
        : '<p class="pd-empty">No comments yet. Comments left on the review page appear here.</p>') + '</div>';
  }

  /* ---- editor kit (RESEARCH_v1.2.7_editor, DOM part). Toolbar buttons use
     data-ed on mousedown — never data-act — so the selection survives and no
     render runs. Sanitizing is CBP.docgen.sanitize (Lane A). ---- */
  var EDK = (function () {
    var installed = false;
    function sanitize(h) { return CBP.docgen.sanitize(h); }
    function areaOf(el) { var b = el && el.closest && el.closest('.ed-block'); return b ? b.querySelector('.ed-area[contenteditable]') : null; }
    function blockOf(node, area) {
      while (node && node !== area) { if (node.nodeType === 1 && /^(P|H3|LI|DIV)$/.test(node.tagName)) return node; node = node.parentNode; }
      return null;
    }
    function exec(cmd, val) { try { return document.execCommand(cmd, false, val); } catch (x) { return false; } }
    function qs(c) { try { return document.queryCommandState(c); } catch (x) { return false; } }
    function qv(c) { try { return document.queryCommandValue(c); } catch (x) { return ''; } }
    function fallbackInline(tag) {
      var sel = window.getSelection(); if (!sel || !sel.rangeCount || sel.isCollapsed) return;
      var r = sel.getRangeAt(0), w = document.createElement(tag);
      try { w.appendChild(r.extractContents()); r.insertNode(w); sel.removeAllRanges(); var n = document.createRange(); n.selectNodeContents(w); sel.addRange(n); } catch (x) {}
    }
    function fallbackBlock(area, tag) {
      var sel = window.getSelection(); if (!sel || !sel.rangeCount) return;
      var blk = blockOf(sel.anchorNode, area); if (!blk) return;
      var el = document.createElement(tag === 'ul' ? 'ul' : tag), inner = el;
      if (tag === 'ul') { inner = document.createElement('li'); el.appendChild(inner); }
      while (blk.firstChild) inner.appendChild(blk.firstChild);
      blk.parentNode.replaceChild(el, blk);
    }
    function syncToolbar() {
      var sel = window.getSelection();
      var n = sel && sel.anchorNode;
      var a = n && areaOf(n.nodeType === 1 ? n : n.parentNode);
      if (!a) return;
      var st = { bold: qs('bold'), italic: qs('italic'), ul: qs('insertUnorderedList'),
                 h3: String(qv('formatBlock')).toLowerCase() === 'h3' };
      var bs = a.parentNode.querySelectorAll('[data-ed]');
      for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', st[bs[i].getAttribute('data-ed')] ? 'true' : 'false');
    }
    function markDirty(area) {
      var blk = area.closest('.ed-block'); if (!blk) return;
      blk.classList.add('dirty');
      var sec = blk.getAttribute('data-sec');
      var ui = CBP.state.ui, pid = ui.param;
      if (!pid) return;
      ui.devDraft = ui.devDraft || {};
      ui.devDraft[pid] = ui.devDraft[pid] || {};
      ui.devDraft[pid][sec] = sanitize(area.innerHTML);
      var s = document.getElementById('eds-' + sec);
      if (s && s.textContent !== 'Unsaved changes') s.textContent = 'Unsaved changes';
    }
    function format(area, cmd) {
      area.focus();
      var ok, inH3 = String(qv('formatBlock')).toLowerCase() === 'h3';
      if (cmd === 'bold' || cmd === 'italic') { ok = exec(cmd); if (!ok) fallbackInline(cmd === 'bold' ? 'strong' : 'em'); }
      else if (cmd === 'ul') { ok = exec('insertUnorderedList'); if (!ok) fallbackBlock(area, 'ul'); }
      else if (cmd === 'h3') { ok = exec('formatBlock', inH3 ? '<p>' : '<h3>'); if (!ok) fallbackBlock(area, inH3 ? 'p' : 'h3'); }
      markDirty(area); syncToolbar();
    }
    function insertPlain(text) {
      text = String(text || '').replace(/\r\n?/g, '\n');
      if (exec('insertText', text)) return;
      var sel = window.getSelection(); if (!sel.rangeCount) return;
      var r = sel.getRangeAt(0); r.deleteContents(); var n = document.createTextNode(text); r.insertNode(n);
      r.setStartAfter(n); r.collapse(true); sel.removeAllRanges(); sel.addRange(r);
    }
    function install() {
      if (installed || typeof document === 'undefined') return;
      installed = true;
      document.addEventListener('mousedown', function (ev) {
        var b = ev.target.closest && ev.target.closest('[data-ed]'); if (!b) return;
        ev.preventDefault(); var a = areaOf(b); if (a) format(a, b.getAttribute('data-ed'));
      });
      document.addEventListener('keydown', function (ev) {
        var b = ev.target.closest && ev.target.closest('[data-ed]');
        if (b && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); var a0 = areaOf(b); if (a0) format(a0, b.getAttribute('data-ed')); return; }
        if (b && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')) {
          var all = b.parentNode.querySelectorAll('[data-ed]'), i = [].indexOf.call(all, b);
          var nx = all[(i + (ev.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
          b.tabIndex = -1; nx.tabIndex = 0; nx.focus(); ev.preventDefault(); return;
        }
        var area = ev.target.classList && ev.target.classList.contains('ed-area') && ev.target.isContentEditable ? ev.target : null;
        if (!area) return;
        if (ev.key === 'Enter' && !ev.shiftKey) {
          var sel = window.getSelection(), h = sel.rangeCount && blockOf(sel.anchorNode, area);
          if (h && h.tagName === 'H3') {
            ev.preventDefault();
            var r = sel.getRangeAt(0), tail = document.createRange(); tail.setStart(r.endContainer, r.endOffset);
            tail.setEndAfter(h.lastChild || h); var frag = tail.extractContents(), pp = document.createElement('p');
            while (frag.firstChild && frag.firstChild.nodeType === 1 && frag.firstChild.tagName === 'H3') frag = frag.firstChild;
            while (frag.firstChild) pp.appendChild(frag.firstChild);
            if (!pp.textContent) pp.innerHTML = '<br>';
            h.parentNode.insertBefore(pp, h.nextSibling);
            var c = document.createRange(); c.setStart(pp, 0); c.collapse(true); sel.removeAllRanges(); sel.addRange(c);
            markDirty(area); return;
          }
        }
        if ((ev.ctrlKey || ev.metaKey) && !ev.altKey) {
          var kk = String(ev.key).toLowerCase();
          if (kk === 'b' || kk === 'i') { ev.preventDefault(); format(area, kk === 'b' ? 'bold' : 'italic'); }
          if (kk === 'u') ev.preventDefault();
        }
      });
      document.addEventListener('paste', function (ev) {
        var area = ev.target.closest && ev.target.closest('.ed-area[contenteditable]'); if (!area) return;
        ev.preventDefault();
        var cd = ev.clipboardData || window.clipboardData;
        insertPlain(cd ? cd.getData(ev.clipboardData ? 'text/plain' : 'Text') : '');
        markDirty(area);
      });
      document.addEventListener('drop', function (ev) {
        var area = ev.target.closest && ev.target.closest('.ed-area[contenteditable]'); if (!area) return;
        ev.preventDefault();
      });
      document.addEventListener('input', function (ev) {
        var t = ev.target;
        if (t && t.classList && t.classList.contains('ed-area')) markDirty(t);
      });
      document.addEventListener('selectionchange', syncToolbar);
      exec('defaultParagraphSeparator', 'p');
      exec('styleWithCSS', false);
    }
    return { install: install, format: format };
  })();
  CBP.p4.EDK = EDK;

  /* ================================================= create / edit form ===*/

  function opt(v, label, sel) {
    return '<option value="' + e(v) + '"' + (sel ? ' selected' : '') + '>' + e(label) + '</option>';
  }

  function recordForm(p, state, isNew) {
    var user = state.user;
    var codes = D.visibleCountries(user, state.countries);
    var people = state.users.filter(function (u) { return u.role !== 'viewer'; });
    var v = p || { owner: user.id, country: codes[0] };   /* a new record starts on you */

    var countrySel = isNew
      ? '<label class="p4-lab">Country<select class="sel" id="fCountry">' +
        codes.map(function (c) { return opt(c, countryName(c), v.country === c); }).join('') +
        '</select></label>'
      : '<label class="p4-lab">Country<input class="p4-input" type="text" id="fCountry" value="' +
        e(countryName(v.country)) + '" disabled></label>';

    var ownerOpts = opt('', 'unassigned', !v.owner) +
      people.map(function (u) { return opt(u.id, u.name, v.owner === u.id); }).join('') +
      (v.owner && !CBP.userById(v.owner) ? opt(v.owner, CBP.userName(v.owner), true) : '');

    var backupOpts = opt('', 'none', !v.backup) +
      people.map(function (u) { return opt(u.id, u.name, v.backup === u.id); }).join('') +
      (v.backup && !CBP.userById(v.backup) ? opt(v.backup, CBP.userName(v.backup), true) : '');

    var amountDisabled = !isNew && !D.can(user, 'editBudget', p);

    var body =
      '<div class="p4-form">' +
        '<label class="p4-lab wide">Project name<input class="p4-input" type="text" id="fName" ' +
          'value="' + e(v.name || '') + '" placeholder="e.g. Emergency Shelter Kits"></label>' +
        countrySel +
        '<label class="p4-lab">Requested amount (USD)<input class="p4-input num" type="text" ' +
          'id="fAmount" value="' + e(v.amount === undefined ? '' : v.amount) + '" ' +
          'placeholder="250000"' + (amountDisabled ? ' disabled' : '') + '></label>' +
        '<label class="p4-lab">Primary implementer<input class="p4-input" type="text" ' +
          'id="fImplementer" value="' + e(v.primary_implementer || '') + '"></label>' +
        '<label class="p4-lab">Strategic priority<input class="p4-input" type="text" ' +
          'id="fPriority" value="' + e(v.strategic_priority || '') + '"></label>' +
        '<label class="p4-lab">City<input class="p4-input" type="text" id="fCity" value="' +
          e(v.city || '') + '"></label>' +
        '<label class="p4-lab">Target date<input class="p4-input num" type="date" id="fTarget" ' +
          'value="' + e(v.target_date || '') + '"></label>' +
        '<label class="p4-lab">Accountable owner<select class="sel" id="fOwner">' + ownerOpts +
          '</select></label>' +
        '<label class="p4-lab">Backup owner<select class="sel" id="fBackup">' + backupOpts +
          '</select></label>' +
        /* v1.0.1 — the contract's remaining record fields, so the edit area
           covers the whole record and not just the half it used to. They are
           edit-only: A.createProject takes the starting set above. */
        (isNew ? '' :
          '<label class="p4-lab">Classification<input class="p4-input" type="text" ' +
            'id="fClassification" value="' + e(v.classification || '') + '"></label>' +
          '<label class="p4-lab">Project type<input class="p4-input" type="text" ' +
            'id="fType" value="' + e(v.project_type || '') + '"></label>' +
          '<label class="p4-lab wide">Description<textarea class="p4-input" rows="3" ' +
            'id="fDescription" placeholder="What the project does, in the words the ' +
            'reviewers will read">' + e(v.description || '') + '</textarea></label>') +
      '</div>' +
      err(state, isNew ? 'create' : 'edit') +
      '<div class="p4-actrow">' +
        (isNew
          ? btn('Create project', 'p4-create', '', { brass: true, sm: false }) +
            btn('Cancel', 'p4-create-cancel', '', { sm: false })
          : btn('Save changes', 'p4c-save', v.id, { brass: true, sm: false }) +
            btn('Cancel', 'p4-edit-cancel', v.id, { sm: false }) +
            '<a class="btn" href="#/projects">Back to projects</a>') +
      '</div>' +
      '<p class="p4-note">' + (isNew
        ? 'A new record always starts at status 4 In Development and takes the next free id for ' +
          'its country — the next ' + e(countryName(codes[0])) + ' id is ' +
          e(A.nextProjectId(codes[0])) + '. Progress reads “not submitted”, never 0% (C-17).'
        : 'Every field on the record is editable here — name, amount, owner, backup, ' +
          'implementer, priority, target date and description. M3 can edit their own projects ' +
          'only while they sit at status 4, and only draft amounts (permission matrix). Every ' +
          'save writes a system entry to the activity stream and offers the way back to the ' +
          'register.') + '</p>';

    return U.card(isNew ? 'Project record' : 'Edit record', body, { cls: 'p4-formcard' });
  }

  function createPage(state) {
    var user = state.user;
    if (!A.can(user, 'create')) {
      return page('New project', U.card('Not available',
        '<p>Your role cannot create projects. Signed in as ' + e(user.name) + ' · ' +
        e(CBP.CONFIG.ROLE_LABEL[user.role]) + '.</p>'));
    }
    return '<div class="crumb"><a href="#/projects">Projects</a> · New</div>' +
      '<div class="pagehead"><h1>New project</h1>' +
      '<span class="sub">Status 4 In Development · budget year ' + CBP.CONFIG.BUDGET_YEAR +
      '</span></div>' + recordForm(null, state, true);
  }

  /* ======================================================= C-12 modals ====*/

  CBP.p4.modal = function (state) {
    var m = state.ui.modal;
    if (!m) return '';
    var p = CBP.projectById(m.id);
    if (!p) return '';
    var v = m.values || {};
    var head = '<p class="p4-msub">' + e(p.id) + ' · ' + e(p.name) + ' · ' +
               e(countryName(p.country)) + ' · <span class="num">' + D.money(p.amount) + '</span></p>';
    var title = '', body = '', acts = '';

    if (m.kind === 'submit') {
      title = 'Request submitted';
      body = head + '<p>This completes Process 4 and moves the record from status 4 to status 3. ' +
        'The stage clock restarts and the Regional Manager is alerted (A-01).</p>';
      acts = btn('Cancel', 'modal-cancel', p.id, { sm: false }) +
             btn('Request submitted', 'do-submit', p.id, { brass: true, sm: false });

    } else if (m.kind === 'approve') {
      title = 'Request approved';
      body = head + '<p>Process 3. The project stays at status 3 and moves to the external gate: ' +
        'Decision Point and CHaS are then tracked separately, each with its own day counter. ' +
        'The Area Manager and owner are prompted to lodge the request (A-02).</p>' +
        '<label class="p4-lab wide">Remark (optional)<input class="p4-input" type="text" ' +
        'id="mRemark" value="' + e(v.mRemark || '') + '"></label>' + err(state, 'review');
      acts = btn('Cancel', 'modal-cancel', p.id, { sm: false }) +
             btn('Request approved', 'do-approve', p.id, { brass: true, sm: false });

    } else if (m.kind === 'return') {
      title = 'Return to Review';
      body = head + '<p>The project drops back to status 4 In Development and the status-4 clock ' +
        'restarts. A reason is mandatory — it is sent to the Area Manager and the owner (A-03) ' +
        'and kept on the record.</p>' +
        '<label class="p4-lab wide">Reason<textarea class="p4-input" id="mReason" rows="3" ' +
        'placeholder="What has to change before this can be resubmitted?">' + e(v.mReason || '') +
        '</textarea></label>' + err(state, 'return');
      acts = btn('Cancel', 'modal-cancel', p.id, { sm: false }) +
             btn('Return to Review', 'do-return', p.id, { brass: true, sm: false });

    } else if (m.kind === 'reject') {
      title = 'Reject: Declined';
      body = head + '<p>The project moves to Declined. It is never reopened in place: a replacement ' +
        'is created under a new ID (R-3). A reason is mandatory (A-04).</p>' +
        '<label class="p4-lab wide">Reason<textarea class="p4-input" id="mReason" rows="3">' +
        e(v.mReason || '') + '</textarea></label>' + err(state, 'reject');
      acts = btn('Cancel', 'modal-cancel', p.id, { sm: false }) +
             btn('Reject', 'do-reject', p.id, { brass: true, sm: false });

    } else if (m.kind === 'gate') {
      title = 'Update the external gate';
      body = head + '<p>Four click-done actions across the two systems. Each click stamps today’s ' +
        'date and starts or stops that sub-step’s own counter; a remark is optional. ' +
        'M1 only (R-2).</p>' +
        '<div class="p4-gate">' + gateSystems(p, state, true) + '</div>' + err(state, 'gate') +
        (A.readyToMark(p)
          ? '<div class="p4-ready compact"><b>Both gates cleared · ready to mark approved</b>' +
            '<small>A-07 prompt sent to the Regional Manager.</small></div>' : '');
      acts = btn('Done', 'modal-cancel', p.id, { sm: false }) +
             (A.readyToMark(p) && D.can(state.user, 'markApproved')
               ? btn('Mark Approved…', 'ask-mark', p.id, { brass: true, sm: false }) : '');

    } else if (m.kind === 'mark') {
      title = 'Mark Approved · 3 → 2';
      body = head + '<p>Both external reference numbers are mandatory free text (R-4) — they are ' +
        'what joins this record to the church’s systems of record before any API exists.</p>' +
        '<label class="p4-lab wide">Decision Point reference<input class="p4-input" type="text" ' +
        'id="mRefDP" value="' + e(v.mRefDP || '') + '" placeholder="e.g. DP-2026-0501"></label>' +
        '<label class="p4-lab wide">CHaS reference<input class="p4-input" type="text" ' +
        'id="mRefCH" value="' + e(v.mRefCH || '') + '" placeholder="e.g. CHS-78110"></label>' +
        err(state, 'mark');
      acts = btn('Cancel', 'modal-cancel', p.id, { sm: false }) +
             btn('Mark Approved', 'do-mark', p.id, { brass: true, sm: false });

    } else if (m.kind === 'start') {
      title = 'Start implementation · 2 → 1';
      body = head + '<p>Moves the project to status 1 and starts the implementation clock. ' +
        'Progress then reports against the timeline phases.</p>' + err(state, 'start');
      acts = btn('Cancel', 'modal-cancel', p.id, { sm: false }) +
             btn('Start implementation', 'do-start', p.id, { brass: true, sm: false });
    }

    return '<div class="modal-wrap" data-act="mclose"><div class="modal p4-modal">' +
      '<h3>' + e(title) + '</h3>' + body +
      '<div class="acts">' + acts + '</div></div></div>';
  };

  /* ================================================ delegated listener ====
     Registered ONCE at load, never per render. actions.js owns every data-act
     it already knows; anything prefixed 'p4c-' is this page's own wiring — the
     comment composer, the inline comment editor and the full-record save, none
     of which can live in actions.js because the field ids belong to the page.
     Same one-pass rule throughout: read the DOM, call CBP.actions, render. */

  function S() { return CBP.state; }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  /* app.js's search box refocus, generalised: render() replaces the markup the
     event came from, so a control that survives it has to be given the caret
     back or the user loses their place mid-sentence. */
  function refocus(id, toEnd) {
    var el = document.getElementById(id);
    if (!el) return;
    try {
      el.focus();
      if (toEnd && el.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length);
    } catch (err) {}
  }

  function scrollToComments() {
    var el = document.getElementById('p4comments');
    if (el && el.scrollIntoView) {
      try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      catch (err) { try { el.scrollIntoView(); } catch (err2) {} }
    }
  }

  /* every editable field on the record — the contract set, in one object */
  function recordFieldsFull() {
    return {
      name: val('fName'),
      amount: val('fAmount'),
      owner: val('fOwner'),
      backup: val('fBackup'),
      primary_implementer: val('fImplementer'),
      strategic_priority: val('fPriority'),
      city: val('fCity'),
      classification: val('fClassification'),
      project_type: val('fType'),
      target_date: val('fTarget'),
      description: val('fDescription')
    };
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.getAttribute('data-act');
    if (!act || act.indexOf('p4c-') !== 0) return;
    var id = t.getAttribute('data-id');
    var after = null;

    if (act === 'p4c-gotocomments') {
      S().ui.p4Tab = 'comments';
      S().ui.err = null;
      after = scrollToComments;

    } else if (act === 'p4c-post') {
      var body = val('p4cBody');
      if (!body && S().ui.p4cDraftFor === id && typeof S().ui.p4cDraft === 'string') {
        body = S().ui.p4cDraft;
      }
      S().ui.p4cDraft = body;
      S().ui.p4cDraftFor = id;
      var res = A.commentAdd(id, body, 'comment');
      if (res.ok) { S().ui.p4cDraft = ''; S().ui.p4cDraftFor = null; }
      after = function () { refocus('p4cBody', true); };

    } else if (act === 'p4c-edit') {
      S().ui.editComment = id;
      S().ui.err = null;
      after = function () { refocus('p4cEdit', true); };

    } else if (act === 'p4c-edit-cancel') {
      S().ui.editComment = null;
      S().ui.err = null;

    } else if (act === 'p4c-edit-save') {
      var r2 = A.commentEdit(id, val('p4cEdit'));
      if (r2.ok) S().ui.editComment = null;
      else after = function () { refocus('p4cEdit', true); };

    } else if (act === 'p4c-save') {
      var r3 = A.projectUpdate(id, recordFieldsFull());
      if (r3.ok) S().ui.p4Edit = false;

    } else if (act === 'p4c-stay') {
      S().ui.returnTo = null;

    } else {
      return;
    }

    ev.preventDefault();
    ev.stopImmediatePropagation();
    CBP.render();
    if (after) after();
  });

  /* v1.1.0 — the gate additions this page owns, namespaced 'p4g-'. The retry
     control is emitted by U.gateStep, so it is wired once here and works on
     every surface that renders a gate step (P3, P4, P6, P10). */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.getAttribute('data-act');
    if (act !== 'p4g-retry') return;

    A.retrySync(t.getAttribute('data-id'));
    ev.preventDefault();
    ev.stopImmediatePropagation();
    CBP.render();
  });

  /* the composer and the inline editor keep their text in ui, so any other
     render (a persona switch, a mark-read click) cannot throw a half-written
     message away. Typing itself never triggers a render. */
  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!t || !t.getAttribute) return;
    if (t.getAttribute('data-act') === 'p4c-draft') {
      S().ui.p4cDraft = t.value;
      S().ui.p4cDraftFor = S().ui.param;
    }
  });

  /* ================================ v1.2.7 · development tab listeners ====
     Registered once. None of them introduces an act: they keep typed text and
     accordion state in ui without rendering, and give dev-section-reset its
     page-side two-step confirm (CORE_API §5). */
  EDK.install();

  function devKeepBag(pid) {
    var ui = S().ui;
    ui.p4DevKeep = ui.p4DevKeep || {};
    ui.p4DevKeep[pid] = ui.p4DevKeep[pid] || {};
    return ui.p4DevKeep[pid];
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.getAttribute('data-act');
    var ui = S().ui;
    if (act === 'dev-section-reset') {
      var sec = t.getAttribute('data-sec');
      var pid = t.getAttribute('data-id') || ui.param;
      if (t.getAttribute('data-cancel')) {
        ui.p4DevConfirm = null;
        ev.preventDefault(); ev.stopImmediatePropagation();
        CBP.render();
        return;
      }
      if (!t.getAttribute('data-confirm')) {
        var d = D.devStage(pid, 'concept').draft;
        var s = d && d.sections ? d.sections.filter(function (x) { return x.key === sec; })[0] : null;
        var dr = ui.devDraft && ui.devDraft[pid] && typeof ui.devDraft[pid][sec] === 'string' &&
                 s && ui.devDraft[pid][sec] !== s.html;
        if (s && (s.edited || dr)) {
          ui.p4DevConfirm = sec;
          ev.preventDefault(); ev.stopImmediatePropagation();
          CBP.render();
          return;
        }
      }
      ui.p4DevConfirm = null;               /* falls through to actions.js */
    } else if (act === 'dev-obs-add') {
      var p1 = t.getAttribute('data-id') || ui.param;
      devKeepBag(p1)._obsN = String(D.devStage(p1, 'assessment').observations.length);
    } else if (act === 'dev-mail-send') {
      var p2 = t.getAttribute('data-id') || ui.param, st = t.getAttribute('data-stage');
      devKeepBag(p2)['_mailN-' + st] = String((D.devStage(p2, st).mails || []).length);
    } else if (act === 'dev-concept-generate' || act === 'dev-section-save') {
      ui.p4DevConfirm = null;
    }
  }, true);

  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!t || !t.getAttribute || !t.getAttribute('data-keep') || !t.id) return;
    var pid = S().ui.param;
    if (S().ui.route !== 'project' || !pid) return;
    devKeepBag(pid)[t.id] = t.value;
    var chips = t.getAttribute('data-chips');
    if (chips) {
      var box = document.getElementById(chips);
      if (box) box.innerHTML = mailChips(t.value);
    }
  });

  /* <details> toggle does not bubble: capture it */
  document.addEventListener('toggle', function (ev) {
    var d = ev.target;
    if (!d || d.tagName !== 'DETAILS' || !d.classList.contains('pd-det')) return;
    var ui = S().ui, pid = d.getAttribute('data-pid');
    ui.p4DevOpen = ui.p4DevOpen || {};
    ui.p4DevOpen[pid] = ui.p4DevOpen[pid] || {};
    ui.p4DevOpen[pid][d.getAttribute('data-stage')] = d.open;
  }, true);

})();
