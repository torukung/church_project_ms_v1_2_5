/* pages/p3.js — P3 Projects register (v1.2.2 reframe).

   ToR's Ask-gate rulings (12 Sep 2026) this pass implements, verbatim from
   docs/CORE_API_v1.2.2.md:
     1.1 — country bands stay open, project rows collapse; Expand/Collapse all
           lives in the top bar.
     1.2 — the collapsed line is ID+Name · Status+gate · Flag · Budget ·
           Comments. Owner/implementer/priority and the progress bar move
           into the expansion.
     1.3 — the expansion is inline segment tabs: Status, Timeline, Budget,
           Contract (only when live), Comments.
     1.4 — one filter strip, state kept per page, conditions AND-ed.

   Everything the kit already owns — the framed bar, the filter+sort strip,
   the attention flag, collapse state, segment tabs, the country band shell —
   is called through K (CBP.uikit), never re-implemented here. Country chips
   and the "open comments" jump keep their own data-act namespace and their
   own delegated listener at the foot of this file, because the walks assert
   against both (CORE_API §1). Every number below still comes from derive.js
   at render time. */
(function () {
  'use strict';
  var D = CBP.D, U = CBP.ui, K = CBP.uikit, e = CBP.ui.esc;

  CBP.pages = CBP.pages || {};

  /* a Corporate Agreement is only worth its own tab while it is actually in
     flight — once it is sent/active/amending the project's own conversation
     with it lives in Contracts (P12), not here (unchanged from v1.0.1). */
  var LIVE_CONTRACT_STATES = ['todo', 'drafting', 'review', 'signing', 'executed'];

  CBP.pages.projects = function (state) {
    var user = state.user;
    var codes = D.visibleCountries(user, state.countries);
    var sel = K.countries('p3', codes);
    var narrowed = sel.length !== codes.length;

    var scoped = D.visibleProjects(user, state.projects, state.countries);
    var inSel = scoped.filter(function (p) { return sel.indexOf(p.country) > -1; });
    var counts = D.statusRollups(inSel);

    var rollup = D.countryRollup(inSel, state.countries, sel);
    var byCode = {};
    rollup.forEach(function (r) { byCode[r.code] = r; });
    var totalCeiling = rollup.reduce(function (a, r) { return a + r.ceiling; }, 0);
    var totalCommitted = rollup.reduce(function (a, r) { return a + r.committed; }, 0);
    var totalCoverage = D.coverage(totalCommitted, totalCeiling);

    var scopeName = sel.length === state.countries.length
      ? 'Asia Area'
      : rollup.map(function (r) { return r.name; }).join(' · ');

    /* ------------------------------------------------------- filter + sort */
    var adapters = {
      country: function (p) { return p.country; },
      status: function (p) { return p.status; },
      owner: function (p) { return p.owner || ''; },
      aging: agingOf,
      attn: function (p) { return K.attention(p, user); },
      text: function (p) { return matchText(p); }
    };

    var shown = K.applyFilter('p3', inSel, adapters, {});

    var sorters = {
      /* over/needs/wait/quiet first, then the longest-waiting row of that
         kind first — one numeric key so K.sortRows' asc/desc toggle still
         reverses the whole ordering in one motion */
      attention: function (p) { return K.attnRank(K.attention(p, user)) * 100000 - agingOf(p); },
      stage: function (p) { return statusRank(p.status); },
      aging: agingOf,
      budget: function (p) { return p.amount || 0; },
      deadline: function (p) { return p.target_date ? D.parse(p.target_date).getTime() : null; },
      name: function (p) { return (p.name || '').toLowerCase(); }
    };
    var sorted = K.sortRows('p3', shown, sorters, function (p) { return p.id; });
    var visibleIds = sorted.map(function (p) { return p.id; });

    /* ------------------------------------------------------------ top bar */
    var actions =
      (D.can(user, 'export') ? U.btn('Export', { act: 'phaseb' }) : '') +
      U.action(user, 'create', null, '+ New project', { brass: true }) +
      K.expandAll('p3', visibleIds);

    var sub = narrowed
      ? inSel.length + ' of ' + scoped.length + ' projects · selected ceiling ' + D.money(totalCeiling)
      : scoped.length + ' project' + (scoped.length === 1 ? '' : 's') +
        ' in scope · ceiling ' + D.money(totalCeiling);

    var html = K.viewBar({
      crumb: 'Projects · ' + e(scopeName) + ' · Budget year ' + e(CBP.CONFIG.BUDGET_YEAR),
      title: 'Projects',
      sub: sub,
      actions: actions,
      statusLabel: 'Status',
      status: statusChips(counts, state.ui.p3Filter),
      countryLabel: 'Countries',
      country: countryChips(scoped, codes, sel, state)
    });

    /* --------------------------------------------------------- filter bar */
    /* R-07 — the status chip (p3Filter) and search (p3Search) are page-owned
       narrowers the kit's summaryLine can't see. Report them as a dirty signal
       so the "Clear filters" affordance renders on a chip-only or search-only
       narrowing; the k-clear handler already resets both via K.BIND.p3
       (status→'all', q→''). Default state (status 'all', empty search) leaves
       this falsy, so an unnarrowed page shows no Clear button. */
    var pageNarrowed = K.status('p3') !== 'all' || K.query('p3').trim() !== '';
    html += K.filterBar({
      page: 'p3',
      extraDirty: pageNarrowed,
      conditions: [
        { key: 'owner', label: 'Owner', kind: 'select',
          options: K.ownerOptions(scoped, function (p) { return p.owner; }) },
        { key: 'aging', label: 'Time in process', kind: 'select', options: K.AGING },
        { key: 'flag', label: 'Attention', kind: 'toggle', toggleLabel: 'Attention only' }
      ],
      sorts: [
        { v: 'attention', label: 'Attention' },
        { v: 'stage', label: 'Stage' },
        { v: 'aging', label: 'Time in process' },
        { v: 'budget', label: 'Budget' },
        { v: 'deadline', label: 'Deadline' },
        { v: 'name', label: 'Name' }
      ],
      search: { act: 'k-q', placeholder: 'Search project, owner, implementer…' },
      count: { shown: sorted.length, total: inSel.length, noun: 'projects' }
    });

    /* ------------------------------------------------------- the register */
    html += '<div class="preg">' +
      '<div class="lhead"><span class="l-name">Project</span>' +
      '<span class="l-stage">Phase / approval stage</span>' +
      '<span class="l-flag">Attention</span>' +
      '<span class="l-budget r">Budget</span>' +
      '<span class="l-cmt r">Comments</span>' +
      '<span class="l-chev" aria-hidden="true"></span></div>';

    var anyRow = false;
    rollup.forEach(function (r) {
      var rows = sorted.filter(function (p) { return p.country === r.code; });
      if (!rows.length) return;
      anyRow = true;
      var cc = U.ccOf(r.code);
      html += '<section class="cgrp ' + cc + '">' + countryBand(r, rows) +
        '<div class="cbody">' +
        rows.map(function (p) { return projectRow(p, state, r); }).join('') +
        '</div></section>';
    });

    if (!anyRow) {
      var q = K.query('p3');
      html += '<div class="cempty"><b>No projects match' +
              (q ? ' “' + e(q) + '”' : ' this filter') + '</b>' +
              '<span>in ' + e(scopeName) + '</span></div>';
    }
    html += '</div>';

    /* ------------------------------------------------------ foot totals */
    var neg = totalCommitted > totalCeiling;
    html += '<div class="foot">' +
      '<span>Committed across statuses 1–4: <b>' + D.money(totalCommitted) +
      '</b> of <b>' + D.money(totalCeiling) + '</b> ceiling' +
      (narrowed ? ' · ' + sel.length + ' of ' + codes.length + ' countries selected' : '') + '</span>' +
      '<span class="' + (neg ? 'neg' : '') + '">' +
      (neg ? 'Budget minus total: ' + D.money(totalCeiling - totalCommitted) + ' · ' : 'Headroom: ' +
        D.money(totalCeiling - totalCommitted) + ' · ') +
      'coverage ' + D.pct(totalCoverage) + '</span></div>';

    html += '<p class="pagenote">Amounts in USD. Every figure is summed from the fixture set at ' +
      'render time — country totals, coverage and all day counts are derived against ' +
      e(D.fmtDateY(CBP.CONFIG.TODAY)) + ', never stored. Rows are scoped to the signed-in ' +
      'user’s countries (' + e(codes.join(', ')) + ')' +
      (narrowed ? ' and narrowed to the countries selected above' : '') + '. ' +
      'The comment count on each row is that project’s conversation; a dot marks messages you ' +
      'have not read yet.</p>';

    return html;
  };

  /* ------------------------------------------------------- little helpers */

  function statusRank(s) {
    return { 1: 0, 2: 1, 3: 2, 4: 3, declined: 4 }[s];
  }

  /* days in the current stage, falling back to days in the queue overall —
     the one "how long has this been sitting" number the filter and the
     aging sort both read */
  function agingOf(p) {
    var d = D.daysInStage(p);
    if (d === null || d === undefined) d = D.dInQ(p);
    return d || 0;
  }

  /* free-text search across project name, id, owner and implementer */
  function matchText(p) {
    return [p.name, p.id, p.primary_implementer, p.strategic_priority,
            p.owner ? CBP.userName(p.owner) : 'unassigned', p.owner]
      .filter(Boolean).join(' ');
  }

  /* --------------------------------------------------- status chip row -- */
  /* rendered as the kit's own .k-chip grammar so it reads identically to
     every other filter chip in the app; the act/data-f pair is untouched —
     app.js's delegated 'filter' handler still owns the click (CORE_API §1). */
  function statusChips(counts, filter) {
    var chips = [{ f: 'all', label: 'All', n: counts.all }];
    CBP.CONFIG.STATUS_ORDER.forEach(function (s) {
      chips.push({ f: String(s), label: CBP.CONFIG.STATUS[s].label, n: counts[s] || 0 });
    });
    return chips.map(function (c) {
      var on = String(filter) === c.f;
      return '<button class="k-chip' + (on ? ' on' : '') + '" data-act="filter" data-f="' +
        e(c.f) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + e(c.label) +
        ' <span class="n num">' + c.n + '</span></button>';
    }).join('');
  }

  /* -------------------------------------------------- country chip row -- */
  /* same .k-chip grammar; the ON state keeps the country's own flag-colour
     identity (v101-proj.css), so a selected country still reads as that
     country and not as a generic "on" chip. data-act/data-c untouched. */
  function countryChips(scoped, codes, sel, state) {
    var all = sel.length === codes.length;
    var chips = '<button class="k-chip' + (all ? ' on' : '') +
      '" data-act="p4c-countries-all" aria-pressed="' + (all ? 'true' : 'false') + '">' +
      'All countries <span class="n num">' + codes.length + '</span></button>';

    chips += codes.map(function (code) {
      var c = state.countries.filter(function (x) { return x.code === code; })[0];
      var n = scoped.filter(function (p) { return p.country === code; }).length;
      var on = !all && sel.indexOf(code) > -1;
      return '<button class="k-chip ccsel ' + U.ccOf(code) + (on ? ' on' : '') +
        '" data-act="p4c-country" data-c="' + e(code) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        U.flagMark(code) + e(c ? c.name : code) + ' <span class="n num">' + n + '</span></button>';
    }).join('');

    return chips;
  }

  /* --------------------------- country band with the derived totals ------
     K.band owns the frame; only the figures are ours. Coverage keeps its
     own bar-and-badge markup (U.coverageCell) so it stays in `tail` rather
     than being squeezed through the label/value figure grammar. */
  function countryBand(r, shownRows) {
    /* R-01 — every figure the band prints is derived from the rows the filter
       actually shows, measured against the country's own ceiling (option (a) of
       REVAMP_v1.2.4 R-01). committed, coverage %, "over" and the coverage bar
       fill are ONE arithmetic over `shownRows` vs `r.ceiling`, so the band can
       always be reconciled with the rows beneath it — never "$760,801 of
       $1,000,000 · 131%". queue also reflects the shown set. `r.ceiling` is the
       country's structural budget line (unfiltered, like the page footer/scope);
       the derived committed/coverage/over/bar all move together against it.

       Unfiltered-view proof: with no filter, `shownRows` is r.projects reordered,
       so shownCommitted === r.committed, shownCoverage === D.coverage(r.committed,
       r.ceiling) === r.coverage, shownOver === r.over, shownQueue === r.queue and
       shownCount === r.count — every reused derive function is order-independent,
       so the rendered band is byte-identical to the pre-R-01 rollup output. */
    var rows = shownRows || r.projects || [];
    var shownCount = rows.length;
    var shownCommitted = D.committedTotal(rows);
    var shownCoverage = D.coverage(shownCommitted, r.ceiling);
    var shownOver = shownCommitted > r.ceiling ? shownCommitted - r.ceiling : 0;
    var shownQueue = D.queueCount(rows);

    var figures = [
      { label: 'committed', html: D.money(shownCommitted), after: 'of ' + D.money(r.ceiling) }
    ];
    var tail = U.coverageCell(shownCoverage) +
      (shownOver > 0 ? '<span class="k-bfig neg"><b class="num">' + D.money(shownOver) + '</b> over</span>' : '') +
      '<span class="k-bfig">queue <b class="num">' + shownQueue + '</b></span>';

    return K.band({
      code: r.code, name: r.name,
      count: shownCount, noun: shownCount === 1 ? 'project' : 'projects',
      figures: figures, tail: tail
    });
  }

  /* ---------------------------------------- C-05 collapsible project row -
     Markup contract is CORE_API §2: a button the kit's own delegated
     listener toggles (data-act="k-row"), the panel rendered only when open.
     Exactly five fixed columns, plus the chevron affordance. */
  function projectRow(p, state, r) {
    var user = state.user;
    var open = K.isOpen('p3', p.id);
    var sub = D.stageSubLine(p);
    var attn = K.attention(p, user);
    /* v1.2.6 — only a "gate · …" sub-line is a gate; the rest are timing lines */
    var isGate = sub && sub.text ? /^gate · /i.exec(sub.text) : null;
    var budgetSub = { 4: 'draft', 3: 'requested', 2: 'approved', 1: 'approved',
                       declined: 'requested' }[p.status];

    var cols =
      '<span class="xc xc-name"><span class="id num">' + e(p.id) + '</span>' +
        '<b>' + e(p.name) + '</b></span>' +
      /* v1.2.6 R-B — labelled lines in-cell; the pill and the sub-line markup
         inside them are unchanged. The Gate line is dropped when empty. */
      '<span class="xc xc-stage"><span class="xstg l3-cell">' +
        '<span class="l3-line"><span class="l3-k">Stage</span>' + U.statusPill(p.status) + '</span>' +
        (sub && sub.text
          ? '<span class="l3-line l3-gate"><span class="l3-k">' + (isGate ? 'Gate' : 'Timing') + '</span>' +
            '<small class="' + e(sub.tone) + '">' +
            (isGate
              /* the leading "gate · " stays in textContent (tests read it)
                 but is visually hidden — the key already says "Gate" */
              ? '<span class="vh">' + e(isGate[0]) + '</span>' + e(sub.text.slice(isGate[0].length))
              : e(sub.text)) +
            '</small></span>'
          : '') +
        '</span></span>' +
      '<span class="xc xc-flag">' + K.flagCell(attn, { labelled: true }) + '</span>' +
      '<span class="xc xc-budget num"><b>' + D.money(p.amount) + '</b>' +
        '<small>' + e(budgetSub) + '</small></span>' +
      commentCell(p, state);

    return '<div class="xrow" data-open="' + (open ? 'true' : 'false') + '">' +
      '<button class="xsum" data-act="k-row" data-page="p3" data-id="' + e(p.id) + '"' +
      ' aria-expanded="' + (open ? 'true' : 'false') + '">' + cols +
      '<span class="xchev" aria-hidden="true">' + (open ? '▴' : '▾') + '</span></button>' +
      (open ? xpanel(p, state, r) : '') + '</div>';
  }

  /* the conversation count, straight through to that project's comments.
     This sits inside the row's own toggle <button> (CORE_API §2), so the
     pill itself must not be a <button> — a real button cannot nest inside
     another button (the browser closes the outer one early and the rest of
     the row falls outside the grid). A span with the same data-act still
     reaches the delegated click listener; role+tabindex keep it operable
     from the keyboard. */
  function commentCell(p, state) {
    var n = D.commentsFor(p.id).length;
    var unread = D.unreadFor(state.user, p.id);
    var title = n
      ? n + ' comment' + (n === 1 ? '' : 's') +
        (unread ? ' · ' + unread + ' unread' : ' · all read')
      : 'No comments yet — open the project to start the conversation';

    return '<span class="xc xc-cmt"><span class="cpill' + (unread ? ' unread' : '') +
      (n ? '' : ' none') + '" role="button" tabindex="0" data-act="p4c-comments" data-id="' +
      e(p.id) + '" title="' + e(title) + '" aria-label="' + e(title) + '">' +
      '<span class="ic" aria-hidden="true">❝</span>' +
      '<span class="n num">' + n + '</span>' +
      (unread ? '<span class="dot" aria-hidden="true"></span>' : '') +
      '</span></span>';
  }

  /* -------------------------------------------------------- open panel --
     Inline segment tabs (CORE_API §5): Status is the default, Contract is
     only offered while an agreement is actually in flight for this row. */
  function xpanel(p, state, r) {
    var user = state.user;
    var cg = D.contractGate ? D.contractGate(p) : null;
    var liveGate = cg && LIVE_CONTRACT_STATES.indexOf(cg.state) > -1 && D.can(user, 'contract_view');
    var nc = D.commentsFor(p.id).length;
    var nu = D.unreadFor(user, p.id);

    var tabs = [
      { v: 'status', label: 'Status' },
      { v: 'timeline', label: 'Timeline' },
      { v: 'budget', label: 'Budget' }
    ];
    if (liveGate) tabs.push({ v: 'contract', label: 'Contract' });
    tabs.push({ v: 'comments', label: 'Comments', n: nc, dot: !!nu });

    var cur = K.seg('p3', p.id, tabs, 'status');
    var html = '<div class="xpanel">' +
      K.segTabs({ ns: 'p3', id: p.id, tabs: tabs, fallback: 'status', label: 'Project sections' });

    if (cur === 'timeline') html += timelineSeg(p, user);
    else if (cur === 'budget') html += budgetSeg(p, r);
    else if (cur === 'contract' && liveGate) html += contractSeg(cg);
    else if (cur === 'comments') html += commentsSeg(p, state);
    else html += statusSeg(p, user);

    return html + '</div>';
  }

  /* Status — the approval-stage stepper, the queue/stage/target/backup meta
     line, the progress bar (moved out of the collapsed line, D.2) and the
     row's own action bar, all unchanged from v1.0.1's open panel. */
  function statusSeg(p, user) {
    var html = '<div class="ph">Approval stage' + rowActions(p, user) + '</div>';
    html += U.stepper(p);

    var dq = D.dInQ(p);
    var bits = [];
    if (dq !== null) bits.push('<b>' + D.days(dq) + '</b> in queue');
    if (D.daysInStage(p) !== null) bits.push('<b>' + D.days(D.daysInStage(p)) + '</b> in current stage');
    if (p.target_date) bits.push('target <b>' + D.fmtDateY(p.target_date) + '</b>');
    if (p.backup) bits.push('backup <b>' + e(CBP.userName(p.backup)) + '</b>');
    bits.push('comments <b class="num">' + D.commentsFor(p.id).length + '</b>' +
      (D.unreadFor(user, p.id) ? ' · <b class="num neg">' + D.unreadFor(user, p.id) + '</b> unread' : ''));
    if (bits.length) html += '<div class="pmeta"><span>' + bits.join('</span><span>') + '</span></div>';

    html += '<div class="xprog">' + U.progressBar(p) + '</div>';

    if (!p.owner) {
      html += '<div class="gnote">No owner set — alerts cannot route until one is assigned (D-14).</div>';
    }
    return html;
  }

  /* Timeline — the mini Gantt, exactly as it rendered in the old open panel */
  function timelineSeg(p, user) {
    var model = D.ganttModel(p);
    var planned = (p.status !== 1);
    var html;
    if (model) {
      html = '<div class="ph">' + (planned ? 'Planned implementation timeline' : 'Implementation timeline') +
        '<span class="r">' +
          U.action(user, 'editGantt', p, 'Configure', { sm: true }) +
          U.action(user, 'editGantt', p, 'Open full editor in TimeBlock ↗', { sm: true }) +
        '</span></div>';
      html += U.gantt(p);
      html += '<div class="gnote">' + (planned
        ? 'Dashed until Marked Approved — phase dates shift from the approval date (D-07).'
        : 'Progress is the elapsed share of each implementation phase; the red line is ' +
          D.fmtDateY(CBP.CONFIG.TODAY) + '.') + '</div>';
    } else {
      html = '<div class="ph">Implementation timeline' +
        '<span class="r">' + U.action(user, 'editGantt', p, 'Configure', { sm: true }) + '</span></div>' +
        '<div class="gnote">No phases entered yet — the mini Gantt appears here once ' +
        'phases are added (D-06/D-07).</div>';
    }
    return html;
  }

  /* Budget — kept small on purpose (D.3): the amount, what it currently is
     (draft/requested/approved) and this project's share of its country's
     ceiling. The real budget workspace is P7. */
  function budgetSeg(p, r) {
    var budgetSub = { 4: 'draft', 3: 'requested', 2: 'approved', 1: 'approved',
                       declined: 'requested' }[p.status];
    var html = '<div class="xbud-row"><span class="xbud-amt num">' + D.money(p.amount) + '</span>' +
      '<span class="xbud-lab">' + e(budgetSub) + '</span></div>';

    if (r && r.ceiling > 0) {
      var share = p.amount / r.ceiling * 100;
      html += U.budgetBar(share, {
        title: D.money(p.amount) + ' is ' + D.pct(share) + ' of ' + e(r.name) + '’s ' + D.money(r.ceiling) + ' ceiling'
      });
      html += '<div class="gnote">Share of ' + e(r.name) + '’s ' + D.money(r.ceiling) +
        ' ceiling. Full budget detail lives in Budget.</div>';
    }
    return html;
  }

  /* Contract — only ever reached when xpanel already found a live gate */
  function contractSeg(cg) {
    var stateLabel = { todo: 'Not started', drafting: 'Drafting', review: 'In review',
                        signing: 'Signing', executed: 'Executed' }[cg.state] || cg.state;
    var html = '<div class="ph">Corporate Agreement</div>' +
      '<div class="xc-state"><b>' + e(stateLabel) + '</b>' +
      (cg.days !== null && cg.days !== undefined
        ? '<span class="num"> · ' + D.days(cg.days) + '</span>' : '') + '</div>' +
      '<div class="gnote">A Corporate Agreement is required before this project can complete' +
      (CBP.CONFIG.CONTRACT_IDLE_DAYS
        ? '; it is flagged idle after ' + CBP.CONFIG.CONTRACT_IDLE_DAYS + ' days with no movement.'
        : '.') + '</div>' +
      /* v1.2.2 audit — a real <a href>, like P12's .p12-openlink, so
         middle-click and cmd-click reach the agreement on both pages. The
         delegated p6x-open-contract handler still owns the plain click (it
         preventDefaults and sets the hash itself); only the native paths the
         handler never sees now behave. */
      '<a class="btn sm" href="' + (cg.contract ? '#/contracts/' + e(cg.contract.id) : '#/contracts') +
      '" data-act="p6x-open-contract" data-id="' +
      e(cg.contract ? cg.contract.id : '') + '">Open contract</a>';
    return html;
  }

  /* Comments — count and a jump to the real feed on P4; the feed itself is
     never rebuilt here (D.5). */
  function commentsSeg(p, state) {
    var n = D.commentsFor(p.id).length;
    var unread = D.unreadFor(state.user, p.id);
    var html = '<div class="xc-state"><b class="num">' + n + '</b> comment' + (n === 1 ? '' : 's') +
      (unread ? ' · <b class="num neg">' + unread + '</b> unread' : ' · all read') + '</div>' +
      '<button class="btn sm brass" data-act="p4c-comments" data-id="' + e(p.id) + '">Open comments</button>';
    return html;
  }

  /* action controls, each gated by can() — the viewer renders none of them */
  function rowActions(p, user) {
    /* the sixth pill in the stepper above says a Corporate Agreement is
       owed or in flight; this is the way straight to it. It is a link, not
       an approval control, so every persona in scope sees it. */
    var cg = D.contractGate ? D.contractGate(p) : null;
    var contract = '';
    if (cg && LIVE_CONTRACT_STATES.indexOf(cg.state) > -1 && D.can(user, 'contract_view')) {
      contract = '<a class="btn sm" href="' +
        (cg.contract ? '#/contracts/' + e(cg.contract.id) : '#/contracts') +
        '" data-act="p6x-open-contract" data-id="' +
        e(cg.contract ? cg.contract.id : '') + '">Contract</a>';
    }

    var acts = [
      '<a class="btn sm" href="#/project/' + e(p.id) + '">Open project detail</a>',
      '<button class="btn sm" data-act="p4c-comments" data-id="' + e(p.id) + '">Open comments</button>',
      U.action(user, 'submit', p, 'Request submitted', { sm: true, brass: true }),
      U.action(user, 'review', p, 'Request approved', { sm: true, brass: true }),
      U.action(user, 'review', p, 'Return to Review', { sm: true }),
      U.action(user, 'gate', p, 'Update gate', { sm: true }),
      U.action(user, 'markApproved', p, 'Mark Approved', { sm: true, brass: true }),
      contract
    ].filter(Boolean);
    return acts.length ? '<span class="r">' + acts.join('') + '</span>' : '';
  }

  /* ================================================ delegated listener ====
     Registered ONCE, at load. The country chips are the only P3 controls
     that are not already wired in actions.js or in uikit.js's own listener;
     'p4c-comments' is shared with P4 and is handled here because P3 is
     where it is clicked most. Everything follows the one-pass rule: mutate
     CBP.state, then CBP.render(). Row open/close, segment tabs and the new
     filter conditions are all handled by uikit.js — nothing to add here. */

  function toggleCountry(code) {
    var state = CBP.state;
    var codes = D.visibleCountries(state.user, state.countries);
    if (codes.indexOf(code) === -1) return;

    var sel = state.ui.p3Countries;
    if (!sel || Object.prototype.toString.call(sel) !== '[object Array]' || !sel.length) {
      state.ui.p3Countries = [code];               /* from "all" → just this one */
      return;
    }
    var next = codes.filter(function (c) {
      return c === code ? sel.indexOf(c) === -1 : sel.indexOf(c) > -1;
    });
    state.ui.p3Countries = (!next.length || next.length === codes.length) ? null : next;
  }

  /* the comments pill inside the collapsed row is a <span role="button">,
     not a real button (it nests inside the row's own toggle button — see
     commentCell above), so it needs its own key handling to stay operable
     from the keyboard. */
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    var t = ev.target.closest ? ev.target.closest('[data-act="p4c-comments"][role="button"]') : null;
    if (!t) return;
    ev.preventDefault();
    t.click();
  });

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.getAttribute('data-act');

    if (act === 'p4c-country') {
      toggleCountry(t.getAttribute('data-c'));
    } else if (act === 'p4c-countries-all') {
      CBP.state.ui.p3Countries = null;
    } else if (act === 'p4c-comments') {
      /* straight to the conversation on that project — the register's row
         pill and the panel button both land on the P4 comments tab */
      CBP.state.ui.p4Tab = 'comments';
      CBP.state.ui.err = null;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      location.hash = '#/project/' + t.getAttribute('data-id');
      return;                                      /* hashchange runs render() */
    } else {
      return;
    }

    ev.preventDefault();
    ev.stopImmediatePropagation();                 /* keep app.js's fallbacks quiet */
    CBP.render();
  });

})();
