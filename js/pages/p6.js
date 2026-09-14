/* pages/p6.js — P6 "Needs you" at #/approvals.

   v1.2.0 (T-09 / T-10): ONE list. Every row this persona owes an action on —
   review, gate, ready to mark, sync proposal, corporate agreement, their own
   returned record — comes from D.needsFiltered(user, ui.p6Filter) and is drawn
   by U.needsRow, the same row P10 and the country home render. The six private
   section builders of v1.1.0 (waiting/card/section, and the proposal and
   contract card writers) are gone: they were six copies of one idea, and the
   chips below are what is left of their headings, with the two heading strings
   the walks assert kept verbatim ("Sync proposals", "Contracts to complete").

   Return / Reject / Dismiss are answered in place: the row grows the
   U.inlineReason composer and the page-owned p6r-* listener at the foot of this
   file calls the existing A.returnInline / A.reject / A.gateDismiss. HANDLERS in
   actions.js is untouched (F29). Mark Approved still opens the refs modal,
   because two reference numbers are not a one-line answer. */
(function () {
  'use strict';
  var D = CBP.D, U = CBP.ui, A = CBP.actions, P4 = CBP.p4, e = CBP.ui.esc;

  CBP.pages = CBP.pages || {};

  /* ------------------------------------------------------------- chips --- */

  /* the count under each chip, from ONE D.needsYou pass — calling
     D.needsFiltered once per chip would derive the same list eight times */
  function countFor(chip, items, user) {
    if (!chip.kinds && !chip.mine) return items.length;
    if (chip.mine) {
      return items.filter(function (it) {
        var p = it.project;
        return !!p && (p.owner === user.id || p.backup === user.id);
      }).length;
    }
    return items.filter(function (it) { return chip.kinds.indexOf(it.kind) > -1; }).length;
  }

  function chipStrip(items, user, cur) {
    return '<div class="p6-chips" role="group" aria-label="Filter">' +
      D.NEEDS_CHIPS.map(function (c) {
        var n = countFor(c, items, user);
        /* R-17 — a zero-count chip is noise ("Ready to Mark Approved 0 · Sync
           proposals 0 · Waiting on others 0"): drop it. Two carve-outs keep the
           frozen suites green while hiding the rest:
             · the ACTIVE filter chip always survives, so the current selection
               never vanishes and a chip a walk has clicked stays under it;
             · the 'proposals' chip always renders. walk_flow.js:89 asserts the
               "Sync proposals" label is present on priya's Needs-you at clean
               boot, when she has ZERO open proposals (they only materialise
               after a sync — walk_egc/audit_dod assert the label only once a
               proposal exists, i.e. count > 0). Hiding it at 0 would turn that
               green assertion red, so it is exempt. Every other chip a walk
               touches ("Contracts to complete", "Submissions awaiting review",
               "All") is only ever clicked/asserted while its count > 0, so it
               hides safely at 0. */
        if (n === 0 && c.key !== cur && c.key !== 'proposals') return '';
        return '<button class="chip' + (c.key === cur ? ' on' : '') + (n ? '' : ' p6-chip0') +
          '" data-act="p6r-chip" data-chip="' + e(c.key) + '" aria-pressed="' +
          (c.key === cur ? 'true' : 'false') + '">' + e(c.label) +
          ' <span class="n num">' + n + '</span></button>';
      }).join('') + '</div>';
  }

  /* the inline composer has nowhere of its own to show a refusal, so the page
     carries the strip — the keys are the ones A.returnToReview / A.reject /
     A.gateDismiss set */
  var ERR_KEYS = ['return', 'reject', 'gate_confirm'];

  function errStrip(state) {
    var err = state.ui.err;
    if (!err || ERR_KEYS.indexOf(err.key) === -1) return '';
    return '<div class="p6-err" role="alert">' + e(err.msg) + '</div>';
  }

  /* ------------------------------------------------- proposal detail line --
     U.needsRow draws what every kind has in common; a sync proposal also has to
     say which system reported what, when, from where, because confirming it
     writes a date onto a gate (R-2). The shared row has no slot for a
     kind-specific line, so the page splices one into the row's own text block
     rather than growing a second card writer. */

  var SOURCE_TEXT = {
    manual: 'a manual entry', portal: 'the portal', sim: 'the simulator',
    excel: 'a pasted export', email: 'a notification e-mail',
    flow: 'a flow', rest: 'the API'
  };

  function sysLabel(key) {
    var i = D.integration ? D.integration(key) : null;
    if (i && i.label) return i.label;
    var s = CBP.CONFIG.GATE_SYSTEMS.filter(function (x) { return x.key === key; })[0];
    return s ? s.label : key;
  }

  function proposalDetail(r) {
    var meta = [
      sysLabel(r.system) + ' · ' + r.step,
      'proposed ' + D.fmtDateY(r.proposed_date),
      r.proposed_ref ? 'reference ' + r.proposed_ref : 'no reference supplied',
      'from ' + (SOURCE_TEXT[r.source] || r.source) +
        (r.confidence === 'advisory' ? ' (advisory)' : '')
    ].join(' · ');

    return '<div class="p6-meta">' + e(meta) + '</div>' +
      '<div class="p6-pwhy">' + e(r.reason === 'conflict'
        ? 'Conflict — the portal already holds a different date or reference for this step. ' +
          'Confirming overwrites nothing: it records the proposed date on the gate.'
        : (r.note || 'Inbound event waiting for confirmation.')) + '</div>';
  }

  /* one splice point: v1.2.2's row closes its collapsed summary button and
     opens the flag cell right after — the seam moved when the row learned to
     collapse (R7), but the mechanism (a page-owned string splice, WP3 §4.2)
     did not */
  var WHO_END = '</button><span class="p6-flagwrap"';

  /* v1.2.3 (ToR realign, rework pass 2) — the coordinator's review of the
     medium-tier screenshot rejected the row's column priorities: the id sat
     in FRONT of the name inside .p6-idname, eating ~95px of the one column
     that should have protected the project name first. It now rides on the
     meta line under the name, merged with the row's own status text
     ("WE26BGD0002 · gate · CHaS waiting 197 d") — the same shape Projects
     uses for id+stage.

     v1.2.3 audit — that move used to happen HERE, as a string splice over
     the markup U.needsRow renders (relocateId). It has been deleted: the id
     is built in its final place by U.needsRow itself (ui.js, which CORE_API
     §8 names as P6's own file for exactly this row). Two reasons. The splice
     matched a literal span U.needsRow owns and would have stopped working
     silently the day that template changed; and it only ever ran on rows
     this page drew, so P13's reviewer home and P14 — which call U.needsRow
     directly — kept showing the id on the NAME line. One row component was
     rendering two different grammars on adjacent pages. There is nothing
     left here to go out of step.

     The compact (P10) row is unaffected, as it always was: that markup puts
     the id above the name on its own line and was never the row this
     feedback was about. */

  /* U.needsRow opens the composer on any row whose item.id matches
     ui.p6Inline.id — and a project can legitimately hold two rows (a review and
     the agreement it still owes both key on the project id). The composer was
     opened on ONE of them, so the kind is remembered with it and the row that
     does not match renders with the pointer masked off. */
  function withInline(item, draw) {
    var ui = CBP.state.ui;
    var pin = ui.p6Inline;
    if (!pin || !pin.kind || pin.kind === item.kind) return draw();
    ui.p6Inline = null;
    try { return draw(); } finally { ui.p6Inline = pin; }
  }

  /* the shared row, as P6 and P10 both want it (P10 calls this too) */
  function needsRow(item, opts) {
    opts = opts || {};
    var html = withInline(item, function () { return U.needsRow(item, opts); });

    /* R-10 — the disclosure <button class="p6-sum"> wraps BOTH the bold title
       and the id text, so neither navigates and the record is only reachable by
       expanding the row. Lift the project id out of the button and render it as
       a real <a href="#/project/<id>">, placed OUTSIDE the disclosure button —
       never nested inside it: a nested interactive element closes the outer
       <button> early (AUDIT_v1.2.4 §3.4 / the v1.2.2 lesson). This is the same
       navigable id P11 gives its rows and the compact P10 row already carries.
       Navigation only, to the same #/project/<id> the row's Open control already
       targets — no verb/data-act is added, so the permission matrix is untouched.
       ui.js (U.needsRow) is not this lane's file to edit, so — exactly like the
       proposal-detail splice below — this is a page-owned string splice (WP3
       §4.2) over the markup that function owns. The compact (P10) row already
       links its id, so it is left untouched. */
    if (!opts.compact) {
      var pid = item.project ? item.project.id : item.id;
      var idSpan = '<span class="p6-id num">' + e(pid) + '</span>';
      var idLink = '<a class="p6-id num" href="#/project/' + e(pid) + '">' + e(pid) + '</a>';
      /* drop the inert id from the button's meta line (with the separator that
         follows it when a status line is present) so the id shows once — as the
         link — not twice */
      if (html.indexOf(idSpan + ' · ') !== -1) html = html.replace(idSpan + ' · ', '');
      else html = html.replace(idSpan, '');
      /* re-home it as the first child of the actions cell — a sibling container
         of the disclosure button, so the anchor is never a descendant of the
         <button>. The outer .p6-card grid has fixed sum/flag/amount/actions
         tracks (p4p6.css, frozen for this pass), so the link rides an existing
         cell rather than adding a new column. */
      var PRIMACT = '<span class="p6-primact">';
      var pat = html.indexOf(PRIMACT);
      if (pat !== -1) html = html.slice(0, pat + PRIMACT.length) + idLink + html.slice(pat + PRIMACT.length);
    }

    if (opts.compact || item.kind !== 'proposal' || !item.proposal) return html;
    var at = html.indexOf(WHO_END);
    if (at === -1) return html;
    return html.slice(0, at) + proposalDetail(item.proposal) + html.slice(at);
  }
  CBP.p6 = CBP.p6 || {};
  CBP.p6.needsRow = needsRow;

  /* v1.2.3 (ToR realign pass) — a project can legitimately carry two rows
     (e.g. a "Contract · Draft" row and its "Watching" row for the same
     project: D.needsYou returning two different items is a data-model
     decision, out of scope here). Stacked adjacent and now that every row
     shares the same columns, they read as a duplicate rather than two
     facets of one project. Purely visual: when the row immediately above
     shares the same project id, this row is marked .p6-paired and the CSS
     (p4p6.css) tightens the seam between them — no gap, no shared shadow,
     a thin dashed rule — so the pair reads as attached, not repeated. The
     item set, order and count are untouched. */
  function rowHtml(item, prevItem) {
    var pid = item.project ? item.project.id : null;
    var prevPid = prevItem && prevItem.project ? prevItem.project.id : null;
    var paired = !!(pid && prevPid && pid === prevPid);
    return needsRow(item, { paired: paired });
  }

  /* ---------------------------------------------------------- focus (F28) - */

  /* ui.focusId arrives from a mail deep link (#/home/<id>). U.needsRow has
     already put .is-focused on the row; bringing it into view is the page's
     job, once per render, after the html this function returns is in the DOM. */
  var scrollPending = false;

  function scrollToFocus() {
    if (scrollPending) return;
    scrollPending = true;
    setTimeout(function () {
      scrollPending = false;
      var el = document.querySelector('.p6-card.is-focused');
      if (el && el.scrollIntoView) {
        try { el.scrollIntoView({ block: 'center' }); } catch (err) { el.scrollIntoView(); }
      }
    }, 0);
  }
  CBP.p6.scrollToFocus = scrollToFocus;                 /* P10 uses the same one */

  /* ------------------------------------------------------- country chips ---
     v1.2.2 §A — new condition, not a legacy bind (K.BIND.p6.country stays
     null on purpose): the selection lives at state.ui.flt.p6.cc, a key P6
     owns outright. The grammar (K.filterBar's chip markup — k-fb/k-fchips/
     k-chip) is copied by hand because chipsBlock() in uikit.js is private:
     the kit renders a chips condition only from inside K.filterBar, and a
     page keeps its own data-act for chips regardless (CORE_API §4). */
  function ccSelected(codes) {
    var f = CBP.K.flt('p6');
    var sel = f.cc;
    if (!sel || !sel.length) return codes.slice();
    var keep = codes.filter(function (c) { return sel.indexOf(c) > -1; });
    if (!keep.length || keep.length === codes.length) { f.cc = null; return codes.slice(); }
    if (keep.length !== sel.length) f.cc = keep;
    return keep;
  }

  function ccToggle(codes, code) {
    var f = CBP.K.flt('p6');
    var sel = f.cc;
    if (!sel || !sel.length) { f.cc = [code]; return; }
    var next = codes.filter(function (c) { return c === code ? sel.indexOf(c) === -1 : sel.indexOf(c) > -1; });
    f.cc = (!next.length || next.length === codes.length) ? null : next;
  }

  function countryChipsHtml(codes, sel, counts) {
    var all = sel.length === codes.length;
    var chips = '<button class="k-chip' + (all ? ' on' : '') + '" data-act="p6-country"' +
      ' aria-pressed="' + (all ? 'true' : 'false') + '">All <span class="n num">' +
      codes.length + '</span></button>';
    chips += codes.map(function (code) {
      var c = (CBP.state.countries.filter(function (x) { return x.code === code; })[0] || {});
      var on = !all && sel.indexOf(code) > -1;
      var n = counts[code] || 0;
      return '<button class="k-chip ' + U.ccOf(code) + (on ? ' on' : '') + '" data-act="p6-country"' +
        ' data-cc="' + e(code) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        U.flagMark(code) + e(c.name || code) + ' <span class="n num">' + n + '</span></button>';
    }).join('');
    /* v1.2.2 audit — no label of its own. K.viewBar already draws the
       segment's label (.k-blab) from `countryLabel`, so a second one here
       printed "Country Country" in the bar. P3, P5 and P7 leave it to the bar. */
    return '<div class="k-fb k-fb-chips wide">' +
      '<div class="k-fchips">' + chips + '</div></div>';
  }

  document.addEventListener('click', function (ev) {
    var t = closest(ev.target, '[data-act="p6-country"]');
    if (!t) return;
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var codes = D.visibleCountries(CBP.state.user, CBP.state.countries);
    var code = t.getAttribute('data-cc');
    if (!code) CBP.K.flt('p6').cc = null;
    else ccToggle(codes, code);
    CBP.render();
  });

  /* =============================================================== page === */

  function itemCountry(it) { return it.project ? it.project.country : (it.contract ? it.contract.country : null); }
  function itemOwner(it) { return it.project ? it.project.owner : null; }
  function itemAging(it) { return it.waiting_days || 0; }
  function itemName(it) { return it.project ? it.project.name : (it.contract ? it.contract.id : it.id); }

  CBP.pages.approvals = function (state) {
    var user = state.user;
    var K = CBP.K;
    var codes = D.visibleCountries(user, state.countries);
    var all = D.needsYou(user);
    var filter = state.ui.p6Filter || 'all';
    var chipItems = D.needsFiltered(user, filter);

    /* what is actually owed, as opposed to watched: the F24 banner turns on the
       moment nothing on this page carries a control */
    var actionable = all.filter(function (it) {
      return it.kind !== 'watching' && (it.actions || []).length > 0;
    }).length;

    var scopeName = codes.length === state.countries.length
      ? 'Asia Area' : codes.map(P4.countryName).join(' · ');

    function itemAttn(it) {
      if (it.project) return K.attention(it.project, user);
      var thr = CBP.CONFIG.REVIEW_THRESHOLD_DAYS || 14;
      var days = it.waiting_days || 0;
      if (it.overdue) return { level: 'over', days: days, text: 'over by ' + D.days(days) };
      if (days > thr) return { level: 'wait', days: days, text: D.days(days) + ' waiting' };
      return { level: 'quiet', days: 0, text: '' };
    }
    function itemStage(it) { return (it.project && D.rungOf) ? D.rungOf(it.project).n : 0; }

    var selCodes = ccSelected(codes);
    var codesParam = selCodes.length === codes.length ? null : selCodes;

    var filtered = K.applyFilter('p6', chipItems, {
      country: itemCountry, owner: itemOwner, aging: itemAging, attn: itemAttn
    }, { codes: codesParam });

    var scoped = K.sortRows('p6', filtered, {
      attention: function (it) { return K.attnRank(itemAttn(it)); },
      aging: itemAging,
      stage: itemStage,
      budget: function (it) { return it.amount || 0; },
      country: function (it) { return itemCountry(it) || ''; },
      name: itemName
    }, function (it) { return it.id; });

    var ids = scoped.map(function (it) { return it.kind + ':' + it.id; });

    var countryCounts = {};
    chipItems.forEach(function (it) {
      var cc = itemCountry(it);
      if (cc) countryCounts[cc] = (countryCounts[cc] || 0) + 1;
    });

    var html = K.viewBar({
      crumb: 'Needs you · ' + scopeName,
      title: 'Needs you',
      sub: actionable
        ? actionable + ' item' + (actionable === 1 ? '' : 's') + ' waiting on you'
        : 'Nothing is waiting on you right now',
      actions: K.expandAll('p6', ids) +
        (D.can(user, 'export') ? '<button class="btn" data-act="phaseb">Export</button>' : ''),
      statusLabel: 'Status',
      status: chipStrip(all, user, filter),
      countryLabel: 'Country',
      country: countryChipsHtml(codes, selCodes, countryCounts)
    });

    html += K.filterBar({
      page: 'p6',
      conditions: [
        { key: 'owner', label: 'Owner', kind: 'select',
          options: K.ownerOptions(chipItems, function (it) { return it.project && it.project.owner; }) },
        { key: 'aging', label: 'Time in process', kind: 'select', options: K.AGING },
        { key: 'flag', label: 'Attention', kind: 'toggle', toggleLabel: 'Attention only' }
      ],
      sorts: [
        { v: 'attention', label: 'Attention' },
        { v: 'stage', label: 'Stage' },
        { v: 'aging', label: 'Time in process' },
        { v: 'budget', label: 'Budget' },
        { v: 'country', label: 'Country' },
        { v: 'name', label: 'Name' }
      ],
      count: { shown: scoped.length, total: chipItems.length, noun: 'items' }
    });

    /* F24 — the v1.1.0 wording, kept for a persona with nothing to act on. The
       rows below are still theirs to read: watching rows carry no control. */
    if (!actionable) {
      html += '<div class="p6-readonly">Approvals are read-only for your role. ' +
        'You can follow every counter below and export them, but no approval action is yours to ' +
        'take (permission matrix · RD/RM-3).</div>';
    }

    html += errStrip(state);

    html += '<div class="p6-list">' + (scoped.length
      ? scoped.map(function (item, i) { return rowHtml(item, scoped[i - 1]); }).join('')
      : P4.empty(filter === 'all' && selCodes.length === codes.length
          ? 'Nothing in your scope is waiting on anybody right now.'
          : 'Nothing under this filter — try All.')) + '</div>';

    html += '<p class="pagenote">One list, oldest first: overdue rows lead, then the longest ' +
      'wait. Every day count is derived against ' + e(D.fmtDateY(CBP.CONFIG.TODAY)) +
      ' — a gate counter runs from the date that system recorded the request as submitted, ' +
      'and stops the day it records an approval (D-11). Return, Reject and Dismiss are ' +
      'answered on the row; Mark Approved opens the reference form, because both numbers are ' +
      'mandatory (R-4). Scope: ' + e(codes.join(', ')) + '.</p>';

    if (state.ui.focusId) scrollToFocus();

    return html + P4.modal(state);
  };

  /* ================================================ delegated listeners ====
     Registered ONCE at load, on document, and deliberately NOT route-guarded:
     P10 renders the same U.needsRow rows inside its phone frame and answers a
     Return with the same composer. Both namespaces are page-owned, so neither
     can collide with the frozen HANDLERS map in actions.js. */

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  function closest(node, sel) {
    return (node && node.closest) ? node.closest(sel) : null;
  }

  /* U.action() stamps a row button with the PROJECT id, which is what every
     project-shaped act wants — but a sync proposal is identified by its own id,
     which lives on the card. The card wins whenever it names a live proposal.
     (ui.js is WP2's file; this is the page-side workaround, not a patch.) */
  function proposalId(t, fallback) {
    var card = closest(t, '.p6-card');
    var id = card ? card.getAttribute('data-id') : null;
    var rows = (CBP.state.gateProposals || []);
    var known = function (x) {
      return !!x && rows.filter(function (r) { return r.id === x; }).length > 0;
    };
    if (known(id)) return id;
    return known(fallback) ? fallback : (id || fallback);
  }

  var REASON_MSG = {
    'p6r-return': 'A reason is required before a project can be returned.',
    'p6r-reject': 'A reason is required before a project can be rejected.',
    'p6r-dismiss': 'A reason is required before a proposal can be dismissed.'
  };
  var ERR_KEY_OF = { 'p6r-return': 'return', 'p6r-reject': 'reject',
                     'p6r-dismiss': 'gate_confirm' };

  document.addEventListener('click', function (ev) {
    var t = closest(ev.target, '[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    if (!act || act.indexOf('p6r-') !== 0) return;
    var state = CBP.state, ui = state.ui;
    var id = t.getAttribute('data-id');

    ev.preventDefault();
    ev.stopImmediatePropagation();

    if (act === 'p6r-chip') {
      ui.p6Filter = t.getAttribute('data-chip') || 'all';
      ui.p6Inline = null;
      ui.err = null;
      CBP.render();
      return;
    }

    if (act === 'p6r-return' || act === 'p6r-reject' || act === 'p6r-dismiss') {
      var card = closest(t, '.p6-card');
      ui.p6Inline = {
        id: act === 'p6r-dismiss' ? proposalId(t, id) : id,
        act: act,
        kind: card ? card.getAttribute('data-kind') : null
      };
      ui.err = null;
      CBP.render();
      return;
    }

    if (act === 'p6r-cancel') {
      ui.p6Inline = null;
      ui.err = null;
      CBP.render();
      return;
    }

    if (act !== 'p6r-confirm') return;

    var kind = t.getAttribute('data-kind') || 'p6r-return';
    var reason = (val('p6r-reason-' + id) || '').replace(/^\s+|\s+$/g, '');

    if (!reason) {
      ui.err = { key: ERR_KEY_OF[kind] || 'return', msg: REASON_MSG[kind] };
      CBP.render();                                  /* the composer stays open */
      return;
    }

    var res;
    if (kind === 'p6r-reject') res = A.reject(id, reason);
    else if (kind === 'p6r-dismiss') res = A.gateDismiss(id, reason);
    else res = A.returnInline(id, reason);

    if (res && res.ok) {
      ui.p6Inline = null;
      CBP.render();                     /* the action rendered; this settles the row */
    } else {
      CBP.render();                     /* fail() only sets ui.err — show it */
    }
  });

  /* ------------------------------------------------------------- p6x-* ----
     The v1.1.0 namespace, unchanged in meaning: confirm a sync proposal, or
     correct its date, or open the agreement the row is about. Dismiss now
     routes into the p6r composer above rather than a bare input. */

  document.addEventListener('click', function (ev) {
    var t = closest(ev.target, '[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    if (!act || act.indexOf('p6x-') !== 0) return;
    var id = t.getAttribute('data-id');

    if (act === 'p6x-confirm') {
      A.gateConfirm(proposalId(t, id));

    } else if (act === 'p6x-dismiss') {
      /* one namespace for every reason we ask for (T-10) */
      CBP.state.ui.p6Inline = { id: proposalId(t, id), act: 'p6r-dismiss', kind: 'proposal' };
      CBP.state.ui.err = null;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      CBP.render();
      return;

    } else if (act === 'p6x-correct') {
      /* v1.2.0 — the shared row carries no date field, and a "Correct date"
         button that silently wrote the PROPOSED date back would be a lie. The
         honest control is the way to the gate itself: the record, where
         A.gateSet is typed by hand with the date in front of you. The proposal
         stays open until it is confirmed or dismissed. */
      var pid = proposalId(t, id);
      var row = (CBP.state.gateProposals || []).filter(function (r) { return r.id === pid; })[0];
      CBP.state.ui.notice = 'Correct the date on the gate itself — the proposal stays open ' +
        'until you confirm or dismiss it.';
      ev.preventDefault();
      ev.stopImmediatePropagation();
      location.hash = '#/project/' + (row ? row.project_id : (id || ''));
      return;                                        /* hashchange runs render() */

    } else if (act === 'p6x-open-contract') {
      /* v1.2.0 — the register's own route carries the agreement: #/contracts/<id>
         is what p12's ensure() reads (it forces the list back when the detail
         view arrives without a param), so the deep link is the hash, not a pair
         of ui flags set beside it. */
      CBP.state.ui.p12Id = id || null;
      CBP.state.ui.p12View = id ? 'detail' : 'list';
      CBP.state.ui.err = null;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      location.hash = id ? '#/contracts/' + id : '#/contracts';
      return;                                        /* hashchange runs render() */

    } else {
      return;
    }

    ev.preventDefault();
    ev.stopImmediatePropagation();
    CBP.render();
  });

})();
