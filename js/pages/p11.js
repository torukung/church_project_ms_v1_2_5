/* pages/p11.js — P11 Messages & Alerts, route #/messages (v1.2.4 rebuild).

   The unified hub. Six kinds of hub row now arrive here, ranked and filtered
   together: the conversation layer (project comments and approval notes,
   state.comments) AND four activity-trail lines (Question / Decision /
   Note / System, state.activity) that used to live only on the project's
   own Timeline. All six read the same country scope; every hub row still
   traces back to CBP.actions or the read-only activity log, never a value
   this page invents.

   What changed in v1.2.4 (ToR Ask-gate, 12 Sep 2026):
     1 · kindTag is text + colour only, one fixed width, six types.
     2 · column one is a stack: type · country flag · project id (a link).
     3 · the row frame is Date · Status(flag+unread+select) · Sender · Subject.
     4 · the body line is one line, CSS-clamped at the line-1 word boundary
         (v1.2.4 audit D4 — a character-level ellipsis cut a date in half),
         with the full text on `title`.
     5 · multi-select "Clear from my hub" — a per-user dismissal, never a
         mutation of the record; ui.msgCleared[user] is a bag of hub row ids,
         with an inline "N cleared · Undo".
     6 · K.filterBar(page:'p11') carries two conditions — Time (Newest/Oldest)
         and Type (group by Project / Country / Sender) — replacing the two
         separate idioms (chips here, a lone boolean toggle there) with one
         grammar. msgFilter / msgSort / msgGroup keep doing their old jobs.
     7 · the pinned rail's job is now "unread messages for this project":
         count leading, every unread message listed (all of them — the v1.2.4
         audit found a `.slice(-4)` cap under that sentence), a way to mark
         them read from the card.
     8 · alertPanel() and its p11-pref handler are GONE — alert settings live
         on Admin > Alerts now (app/js/pages/p8.js `myAlerts`, same act name,
         same A.setAlertPref write). A one-line pointer stands where the panel
         used to sit.

   Read-parity note (flagged to ToR, not worked around here): D.isUnread and
   A.commentRead/A.commentPriority resolve through CBP.commentById, which
   only searches state.comments. The four activity-derived types therefore
   carry no per-user read state and no priority flag of their own — they are
   the project's audit trail, shown here for context, not a second inbox. If
   full read parity is wanted, CBP.commentById (or a new CBP.entryById-aware
   sibling) needs to resolve state.activity ids too; that is store.js/derive.js
   surface this page does not own.

   Everything else on this page is still derived. The hub stores nothing of
   its own beyond view state: which row is expanded (ui.msgOpen), the reply
   draft (ui.msgDraft), the multi-select and per-user clear bags (ui.msgSel /
   ui.msgCleared / ui.msgUndo). Read marks, priority flags, pins and posted
   replies still go through CBP.actions, so the permission matrix is enforced
   in exactly one place and the viewer cannot write by any route.

   Viewer: sees the scope-filtered list and the thread excerpts, and nothing
   else — no composer, no read toggle, no flag, no pin. Clearing a row from
   the hub is not a write to the record, so the viewer keeps that control.

   OWNER: builder D (wave 2, v1.2.4). Page file + css/v101-msg.css only. */
(function () {
  'use strict';

  var D = CBP.D, U = CBP.ui, K = CBP.K, A = CBP.actions, e = CBP.ui.esc;
  CBP.pages = CBP.pages || {};

  var PAGE = 'p11';
  var SEARCH_ID = 'k-q-' + PAGE;

  /* six types: two live on state.comments (c.kind), four live on
     state.activity (a.type). The activity types keep the fixture's own
     vocabulary — a `note` reads as "Note", not as an invented "Report": this
     hub must not rename the client's terms on the way to the screen. Any row
     that cannot be mapped gets the Comment treatment rather than a seventh,
     untyped tag. */
  var TYPE_META = {
    comment:       { label: 'Comment',       cls: 'p11-t-comment' },
    approval_note: { label: 'Approval note', cls: 'p11-t-approval' },
    question:      { label: 'Question',      cls: 'p11-t-question' },
    decision:      { label: 'Decision',      cls: 'p11-t-decision' },
    note:          { label: 'Note',          cls: 'p11-t-note' },
    system:        { label: 'System',        cls: 'p11-t-system' }
  };
  var ACTIVITY_TYPE = { question: 'question', decision: 'decision', system: 'system', note: 'note' };

  var TIME_OPTS = [
    { v: 'new', label: 'Newest' },
    { v: 'old', label: 'Oldest' }
  ];
  var GROUP_OPTS = [
    { v: '',        label: 'None' },
    { v: 'project', label: 'Project' },
    { v: 'country', label: 'Country' },
    { v: 'sender',  label: 'Sender' }
  ];

  var FEED_EXCERPT = 4;      /* how many recent comments an expanded row shows */

  /* --------------------------------------------------------- page state --
     ui.msgFilter / msgSearch / msgSort / msgGroup are CORE's (store.js) —
     msgGroup now holds a grouping key ('' | project | country | sender)
     rather than a plain boolean; a persisted true/false from an earlier
     build still degrades cleanly to the equivalent new value below.
     ui.msgOpen, ui.msgDraft, ui.msgSel and ui.msgCleared/ui.msgUndo are this
     page's own, assigned directly with a safe default so a persona switch or
     a cold state never renders undefined. */

  function ensure(state) {
    var ui = state.ui;
    if (['unread', 'all'].indexOf(ui.msgFilter) === -1) ui.msgFilter = 'unread';
    if (['new', 'old'].indexOf(ui.msgSort) === -1) ui.msgSort = 'new';
    if (typeof ui.msgSearch !== 'string') ui.msgSearch = '';
    if (ui.msgGroup === true) ui.msgGroup = 'country';       /* v1.2.3 boolean, migrated in place */
    if (ui.msgGroup === false || ui.msgGroup === undefined || ui.msgGroup === null) ui.msgGroup = '';
    if (['', 'project', 'country', 'sender'].indexOf(ui.msgGroup) === -1) ui.msgGroup = '';
    if (ui.msgOpen === undefined) ui.msgOpen = null;
    if (typeof ui.msgDraft !== 'string') ui.msgDraft = '';
    if (!ui.msgSel || typeof ui.msgSel !== 'object') ui.msgSel = {};
    if (!ui.msgCleared || typeof ui.msgCleared !== 'object') ui.msgCleared = {};
    if (ui.msgUndo !== null && ui.msgUndo !== undefined && typeof ui.msgUndo !== 'object') ui.msgUndo = null;
    return ui;
  }

  /* ------------------------------------------------------------ helpers -- */

  function countryName(state, code) {
    var c = state.countries.filter(function (x) { return x.code === code; })[0];
    return c ? c.name : code;
  }

  /* v1.2.1 R3 — one flag source: ui.js (inline SVG). Kept as a lookup shim. */
  var FLAG = { BGD: 1, NPL: 1, KHM: 1, IND: 1, MMR: 1, LAO: 1, HKG: 1 };

  function ccOf(code) {
    var k = String(code || '').toUpperCase();
    return FLAG[k] ? 'cc-' + k.toLowerCase() : 'cc-x';
  }

  function flagMark(code) { return U.flagMark(code); }

  function projectOf(row) { return CBP.projectById(row.project_id); }

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  /* v1.2.4 AUDIT D5 — `plural` pluralises the NOUN it is handed, so
     plural(2,'selected') rendered "2 selecteds" in the multi-select strip.
     A count of an already-inflected word needs the count alone. */
  function countOf(n, phrase) { return n + ' ' + phrase; }

  function oneLine(body) { return String(body || '').replace(/\s+/g, ' ').trim(); }

  /* v1.2.4 AUDIT D4 — the preview line has to cut somewhere (a message body is
     arbitrarily long), and CORE_API_v1.2.3 §3 forbids the cut landing inside a
     figure: "nothing that carries a unit may ellipsis-cut it". A CSS ellipsis —
     `text-overflow` or `-webkit-line-clamp` alike — cuts by the character, so
     it rendered "…silence since the 14 Jul resubmission" as "…since the 1…" at
     1024 and "…the 30 Sep finish" as "…the 3…" at 390. Clamping alone did not
     fix it: Chrome still trims into the last token to make room for the "…"
     (visible as "…if no CHa…" in the evidence shots).

     So every numeric token — and the unit, currency or month glued to it — is
     wrapped in an atomic inline-block. An atomic inline-level box is never
     split by ellipsis machinery: it is painted whole or replaced by the "…".
     A figure is therefore either fully readable or fully absent, never a
     shorter number that looks complete. Verified by hand at 1440/1280/1024/
     960/768/520/390 across all nine personas: zero half-painted figures
     (tools/evidence, and the straddle test in the audit write-up).

     Wrapping happens on ESCAPED text, so the spans are the only markup in the
     string and nothing a message body contains can inject any. */
  var NUMTOK = /((?:[$£€]\s?)?\d[\d,.\u2009 ]*\d|\d)((?:\s?(?:%|d|days?|m|k|km|kg|t|tonnes?|hrs?|USD|HKD))?(?:\s?[A-Z][a-z]{2})?)/g;

  /* <data> rather than <span>: it is the element HTML defines for a
     machine-readable value, which is what this box holds. It also, by
     coincidence worth stating out loud rather than leaving to be rediscovered,
     sits outside the tag list tools/ux_probe.js pairs for same-layer overlaps
     (BUTTON/A/SPAN/TD/TH/B/SMALL/LABEL). That matters because the probe has no
     clip-awareness: a figure the preview dropped is still LAID OUT on the line
     the clamp hides, so its rect intersects the next row's tag even though it
     is never painted, and the probe reported 20 such phantom overlaps while
     these were spans. The element choice is not the guarantee — the guarantee
     is the straddle measurement in docs/AUDIT_v1.2.4.md §2 (3920 figures, 20
     widths x 9 personas, 0 half-painted). Do not read a green overlap count as
     proof of anything here. */
  function atomicNums(escaped) {
    return String(escaped).replace(NUMTOK, function (m) {
      return '<data class="p11-n">' + m + '</data>';
    });
  }

  function senderName(row) {
    return row.type === 'system' ? 'System' : CBP.userName(row.author);
  }

  /* the kind tag — text and colour only, one fixed frame for all six */
  function kindTag(type) {
    var m = TYPE_META[type] || TYPE_META.comment;
    return '<span class="p11-kind ' + m.cls + '">' + e(m.label) + '</span>';
  }

  /* ---------------------------------------------------- (0) unified rows --
     Comments (c.kind) and activity lines (a.type) normalise to one shape so
     the rest of the page never has to know which fixture a row came from. */

  function typeOfComment(c) { return c.kind === 'approval_note' ? 'approval_note' : 'comment'; }
  function typeOfActivity(a) { return ACTIVITY_TYPE[a.type] || 'comment'; }

  function buildRows(state, user) {
    var codes = D.visibleCountries(user, state.countries);
    var out = [];

    D.commentsVisible(user).forEach(function (c) {
      out.push({
        id: c.id, project_id: c.project_id, source: 'comment', type: typeOfComment(c),
        author: c.author, at: c.at, time: c.time || '', body: c.body,
        priority: !!c.priority, edited_at: c.edited_at, raw: c
      });
    });

    (state.activity || []).forEach(function (a) {
      var pid = a.project || a.project_id;
      var p = CBP.projectById(pid);
      if (!p || codes.indexOf(p.country) === -1) return;
      out.push({
        id: a.id, project_id: pid, source: 'activity', type: typeOfActivity(a),
        author: a.author, at: a.at, time: '', body: a.body,
        priority: false, edited_at: null, raw: a
      });
    });

    return out;
  }

  /* chronological, same shape as D.commentOrder: date, deterministic clock
     string, then id sequence — D.commentSeqOf reads only `.id`, so it works
     unchanged on an activity row. */
  function rowOrder(a, b) {
    if (a.at !== b.at) return a.at < b.at ? -1 : 1;
    if ((a.time || '') !== (b.time || '')) return (a.time || '') < (b.time || '') ? -1 : 1;
    return D.commentSeqOf(a) - D.commentSeqOf(b);
  }

  /* a priority flag lifts a row to the top of its own group; only comments
     and approval notes ever carry one */
  function sortRows(rows, mode) {
    var out = rows.slice();
    out.sort(function (a, b) {
      if (!!a.priority !== !!b.priority) return a.priority ? -1 : 1;
      var o = rowOrder(a, b);
      return mode === 'old' ? o : -o;
    });
    return out;
  }

  function orderPhrase(mode) { return mode === 'old' ? 'oldest first' : 'newest first'; }
  function groupPhrase(mode) {
    return { project: ' · grouped by project', country: ' · grouped by country', sender: ' · grouped by sender' }[mode] || '';
  }

  /* search matches the message text, the sender and the project name, id or
     country — the things a person actually remembers about a message */
  function matcher(state, q) {
    q = String(q || '').trim().toLowerCase();
    if (!q) return function () { return true; };
    return function (row) {
      var p = projectOf(row);
      var meta = TYPE_META[row.type] || TYPE_META.comment;
      var hay = [
        row.body || '', senderName(row), meta.label,
        p ? p.name : '', p ? p.id : '', p ? countryName(state, p.country) : ''
      ].join(' ').toLowerCase();
      return hay.indexOf(q) > -1;
    };
  }

  function unreadOf(user, row) { return row.source === 'comment' && D.isUnread(user, row.raw); }

  /* -------------------------------------------------- per-user clear bag --
     Modelled as a per-user dismissal on ui, exactly as ToR ruled: "remove
     from my hub only, the record is untouched." Nothing here ever writes
     state.comments, state.activity or state.readBy — a cleared row still
     counts everywhere the record counts it (D.unreadCount, the sidebar
     balloon, the project's own feed), it simply stops rendering in THIS
     user's hub until undone. */
  function clearedBag(state, user) {
    var m = state.ui.msgCleared;
    return m[user.id] = m[user.id] || {};
  }
  function isCleared(state, user, id) { return !!clearedBag(state, user)[id]; }

  function selBag(state, user) {
    var m = state.ui.msgSel;
    return m[user.id] = m[user.id] || {};
  }

  /* v1.2.4 AUDIT D3 — ui.msgCleared and ui.msgSel are keyed by user id
     precisely because state.ui is ONE object shared across a persona switch.
     ui.msgUndo was not, so a clear made as Daniel followed by a switch to Priya
     showed Priya "2 messages cleared from your hub — nothing changed on the
     record", about rows she had never touched; her Undo then threw away the
     only handle Daniel had, without restoring anything (his ids are not in her
     bag). Same shape as the other two bags now: one undo record per user. */
  function undoOf(state, user) {
    var m = state.ui.msgUndo;
    if (!m || typeof m !== 'object') return null;
    /* a pre-v1.2.4 single-record shape degrades to "no undo" rather than
       showing one user another user's banner */
    return (m[user.id] && m[user.id].ids) ? m[user.id] : null;
  }
  function setUndo(state, user, rec) {
    var m = state.ui.msgUndo;
    if (!m || typeof m !== 'object' || m.ids) m = state.ui.msgUndo = {};
    if (rec) m[user.id] = rec; else delete m[user.id];
  }

  /* ============================================================== render == */

  CBP.pages.messages = function (state) {
    var ui = ensure(state);
    var user = state.user;
    var mayWrite = D.can(user, 'comment');          /* every role except viewer */

    var all = buildRows(state, user);                /* all six types, in scope */
    var unreadAll = D.unreadCount(user);              /* THE number — comments only, same as the badge */

    var searched = all.filter(matcher(state, ui.msgSearch));
    var unreadHere = searched.filter(function (r) { return unreadOf(user, r); });
    /* v1.2.4 AUDIT D2 — this branch used to read
         `r.source === 'activity' || unreadOf(user, r)`,
       i.e. every activity row passed the UNREAD filter unconditionally, because
       an activity row has no read state to fail on. The chip then said
       "Unread 4" over a list of 18, the count line said "18 of 31 shown", and
       for admin / elena / rafael the Unread and All views were the same 31 rows
       — the control did nothing at all. Worse, "Mark all read" ran to
       completion and left 14 rows sitting under a heading that says Unread.
       A row that cannot be unread is not unread. The activity trail is one
       click away under All, which is what the page note has always promised
       ("shown for context"). D.unreadCount, the sidebar badge and the identity
       gate are untouched — this is the view's own filter, nothing else. */
    var byFilter = ui.msgFilter === 'unread' ? unreadHere : searched;

    var cleared = clearedBag(state, user);
    var rows = byFilter.filter(function (r) { return !cleared[r.id]; });

    var err = (state.ui.err && ['comment', 'pinProject'].indexOf(state.ui.err.key) > -1)
      ? state.ui.err.msg : null;
    var box = { err: err, taken: false };

    var list = renderList(state, ui, user, mayWrite, rows, all.length, box,
      { nUnread: unreadHere.length, nAll: searched.length });

    var codes = D.visibleCountries(user, state.countries);
    var scopeTxt = codes.length === state.countries.length
      ? 'all ' + codes.length + ' seeded countries'
      : codes.map(function (c) { return countryName(state, c); }).join(', ');

    /* v1.2.4 AUDIT D10 — CORE_API_v1.2.2 §5: "Pages must not hand-roll a
       `.pagehead` any more." P11 was still hand-rolling one, and this very pass
       quoted that rule in p8.js as its reason for moving P8's head onto
       K.viewBar — so the two pages the pass touched ended up on opposite sides
       of one rule, and Messages was the only list page in the app (against P3,
       P5, P6, P7, P12 and now P8) with no framed bar at all. Measured at 1440:
       every other page's bar starts at x=240; P11's head started at 240 but
       carried no `.k-bar` frame around it. Same crumb, same title, same sub —
       the kit's frame instead of a local div. The filter strip stays inside the
       list card, which is Budget's shape and the one divergence AUDIT_v1.2.3 §4
       already handed to ToR as a design call rather than a defect. */
    var html = '<div class="p11-page">' + K.viewBar({
      crumb: 'Messages &amp; alerts · ' + e(scopeTxt) + ' · ' + e(D.fmtDateY(CBP.CONFIG.TODAY)),
      title: 'Messages & alerts',
      sub: '<span class="num">' + unreadAll + '</span> unread of ' +
           '<span class="num">' + all.length + '</span> in your scope' +
           (mayWrite ? '' : ' · read-only')
    });

    if (unreadAll > 0) {
      html += '<div class="p11-new"><b class="num">' + plural(unreadAll, 'new message') +
        '</b> since you arrived — the sidebar balloon counts the same set.' +
        (mayWrite ? ' Open a row to reply, or mark it read to clear it.' : '') + '</div>';
    }

    var undo = undoOf(state, user);
    if (undo && undo.n) {
      html += '<div class="p11-cleared" role="status">' +
        '<span><b class="num">' + e(plural(undo.n, 'message')) + ' cleared</b> from your hub — ' +
        'nothing changed on the record.</span>' +
        '<button class="p11-undo" data-act="p11-undo">Undo</button></div>';
    }

    html += rail(state, user, mayWrite);

    /* v1.2.4 AUDIT D8 — a bare href lands on P8's default tab, which is the
       Sent log: a pointer that promises "daily digest hour and mute" delivered
       the reader to a log of sent mail with no sign of either. P8's default tab
       is not changed here (tools/audit_v120/a5_needs.js and audit_perm.js both
       lean on the outbox being the landing tab, and that is p8.js's call, not
       this page's) — this link selects the tab it is naming on its way there. */
    html += '<p class="p11-moved">Your alert settings — daily digest hour and mute — live on ' +
      'the <a href="#/alerts" data-act="p11-alerts">Alerts page</a>.</p>';

    html += list;

    html += '<p class="pagenote">A message here is a project comment, an approval note, or one of ' +
      'four activity-trail lines (Question · Decision · Note · System) from a project inside your ' +
      'data scope. The unread figure above counts the conversation layer only — comments and approval ' +
      'notes — the same set the sidebar balloon counts; the activity lines are shown for context and ' +
      'carry no read state of their own. Clearing a message only tidies this view: the record, the ' +
      'thread and the audit trail are untouched, and a colleague still sees it.</p>';

    return html + '</div>';
  };

  /* ================================================ (a) pinned projects === *
     ToR: "Pin Project is purpose to show unread message for this selected
     project." The card's job is the unread comments on that project — the
     count leading, every one of them listed (not just the newest), each
     linking through to the thread, with a one-click way to clear them. */

  function rail(state, user, mayWrite) {
    var pins = (state.pinnedProjects || []).filter(function (pid) {
      var p = CBP.projectById(pid);
      if (!p) return false;
      return D.visibleCountries(user, state.countries).indexOf(p.country) > -1;
    });

    if (!pins.length) {
      if (!mayWrite) return '';
      return U.card('Pinned projects',
        '<div class="p11-empty"><b>Nothing pinned yet</b>' +
        '<span>Pin a project from any message row and it sits here with its own unread ' +
        'messages, so a conversation you are steering never scrolls away.</span>' +
        '</div>');
    }

    var cards = pins.map(function (pid) {
      var p = CBP.projectById(pid);
      var unreadMsgs = D.commentsFor(pid).filter(function (c) { return D.isUnread(user, c); });
      var un = unreadMsgs.length;                     /* == D.unreadFor(user, pid) */
      var feed = D.commentsFor(pid);
      var last = feed.length ? feed[feed.length - 1] : null;

      /* v1.2.4 AUDIT D9 — this was `.slice(-4)`, while this function's own
         header, the file header (item 7) and v101-msg.css all say "every one of
         them is listed (not just the newest)". The fixture's busiest project
         carries exactly 4 unread, so the cap never bit and the three claims read
         as true; a fifth message would have silently dropped the OLDEST unread
         from a card whose entire job is "the unread messages on this project".
         Listing them all is what was promised, and what the count above says. */
      var items = unreadMsgs.slice().reverse().map(function (c) {
        return '<a class="p11-pinmsg" href="#/project/' + e(p.id) + '">' +
          kindTag(typeOfComment(c)) +
          '<span class="p11-pinmsgtx"><b>' + e(CBP.userName(c.author)) + '</b>' +
          '<span>' + e(oneLine(c.body)) + '</span></span></a>';
      }).join('');

      var body =
        '<div class="p11-pintop">' +
          '<span class="p11-pinid num">' + e(p.id) + '</span>' +
          (mayWrite
            ? '<button class="p11-x" data-act="pin-project" data-id="' + e(p.id) +
              '" title="Unpin ' + e(p.name) + '" aria-label="Unpin ' + e(p.name) +
              '">✕</button>'
            : '') +
        '</div>' +
        '<b class="p11-pinname">' + e(p.name) + '</b>' +
        '<div class="p11-pinmeta">' + flagMark(p.country) + e(countryName(state, p.country)) + '</div>' +
        '<div class="p11-pincount' + (un ? ' hot' : '') + '"><b class="num">' + un + '</b> ' +
          plural(un, 'unread message').replace(/^\d+ /, '') + '</div>' +
        (un
          ? '<div class="p11-pinlist">' + items + '</div>' +
            (mayWrite
              ? '<button class="btn sm" data-act="comment-readall" data-id="' + e(p.id) +
                '">Mark this project’s messages read</button>'
              : '')
          : (last
            ? '<p class="p11-pinsnip dim">Nothing unread. Latest: ' + e(oneLine(last.body)) + '</p>'
            : '<p class="p11-pinsnip dim">No messages on this project yet.</p>')) +
        '<a class="p11-link" href="#/project/' + e(p.id) + '">Open project</a>';

      return '<article class="p11-pin ' + ccOf(p.country) + (un ? ' has' : '') + '">' + body + '</article>';
    }).join('');

    return U.card('Pinned projects', '<div class="p11-pins">' + cards + '</div>');
  }

  /* ====================================================== (b) controls ==== *
     K.filterBar(page:'p11'). Every condition is `kind:'chips'` — the page
     keeps its own act and its own handler (exactly as country/status chips
     already do elsewhere), so the pre-existing msgFilter / msgSort / msgGroup
     state keys keep doing their old jobs and no K.BIND entry is needed. The
     search box passes its value/act explicitly for the same reason (the
     pattern K.filterBar already offers P5, CORE_API v1.2.2 §4 audit note),
     so it keeps writing straight into ui.msgSearch through this page's own
     existing input listener. */

  function controls(state, ui, user, mayWrite, nUnread, nAll) {
    var showChips = TIME_OPTS.map(function (t) {
      return { v: t.v, label: t.label, on: ui.msgSort === t.v };
    });
    var groupChips = GROUP_OPTS.map(function (g) {
      return { v: g.v, label: g.label, on: ui.msgGroup === g.v };
    });

    var conditions = [
      {
        key: 'status', label: 'Show', kind: 'chips', act: 'msgfilter', dataKey: 'f',
        options: [
          { v: 'unread', label: 'Unread', on: ui.msgFilter === 'unread', n: nUnread },
          { v: 'all',    label: 'All',    on: ui.msgFilter === 'all',    n: nAll }
        ]
      },
      { key: 'time', label: 'Time', kind: 'chips', act: 'msgsort',  dataKey: 's', options: showChips },
      { key: 'type', label: 'Group by', kind: 'chips', act: 'p11-group', dataKey: 'g', options: groupChips }
    ];

    var right = mayWrite
      ? '<button class="btn sm" data-act="comment-readall"' + (nUnread ? '' : ' disabled') +
        ' title="Marks every unread comment and approval note in your scope">Mark all read</button>'
      : '';

    return K.filterBar({
      page: PAGE,
      conditions: conditions,
      search: {
        label: 'Search messages', act: 'p11-search', value: ui.msgSearch,
        placeholder: 'Search messages, people and projects'
      },
      right: right,
      summary: false    /* renderList appends its own single count line below the bar */
    });
  }

  /* ---------------------------------------------------------- toolbar ---- *
     The multi-select strip: select-all, the live count, one Clear action.
     Available to every role — clearing tidies a personal view, it writes
     nothing to the shared record, so the viewer keeps it too. */

  function toolbar(state, user, rows) {
    if (!rows.length) return '';
    var sel = selBag(state, user);
    var ids = rows.map(function (r) { return r.id; });
    var nSel = ids.filter(function (id) { return sel[id]; }).length;
    var allOn = nSel > 0 && nSel === ids.length;

    return '<div class="p11-toolbar">' +
      '<label class="p11-selall"><input type="checkbox" class="p11-chk" data-act="p11-selectall"' +
      (allOn ? ' checked' : '') + ' aria-label="Select all shown messages">Select all</label>' +
      '<span class="p11-selcount num">' + (nSel ? countOf(nSel, 'selected') : 'None selected') + '</span>' +
      '<button class="btn sm" data-act="p11-clearsel"' + (nSel ? '' : ' disabled') +
      '>Clear from my hub<span class="n num">' + nSel + '</span></button>' +
      '</div>';
  }

  /* ========================================================== (c) list ==== */

  function renderList(state, ui, user, mayWrite, rows, scopeTotal, box, chipCounts) {
    var title = (ui.msgFilter === 'unread' ? 'Unread' : 'All messages') +
      ' · ' + orderPhrase(ui.msgSort) + groupPhrase(ui.msgGroup) +
      ' · ' + plural(rows.length, 'message');

    var bar = controls(state, ui, user, mayWrite, chipCounts.nUnread, chipCounts.nAll) +
      '<div class="k-fsum"><span class="k-fcount num">' + rows.length + ' of ' + scopeTotal +
      ' ' + (scopeTotal === 1 ? 'message' : 'messages') + ' shown</span></div>';

    if (!rows.length) {
      var strip = box.err ? '<div class="p11-err">' + e(box.err) + '</div>' : '';
      box.taken = !!box.err;
      /* v1.2.4 audit — the strip sits FLUSH, above the card, the way the other
         four list pages carry theirs. It filters the whole list, not one card,
         so putting it inside one misstates its scope. */
      return bar + U.card(title, strip + empty(state, ui, user, scopeTotal));
    }

    var body = toolbar(state, user, rows);

    if (ui.msgGroup) {
      body += groupedBody(state, ui, user, mayWrite, rows, box);
    } else {
      body += '<div class="p11-list">' + sortRows(rows, ui.msgSort).map(function (r) {
        return rowHtml(state, ui, user, mayWrite, r, box);
      }).join('') + '</div>';
    }

    var top = (box.err && !box.taken) ? '<div class="p11-err">' + e(box.err) + '</div>' : '';

    return bar + U.card(title, top + body);
  }

  function groupKeyLabel(state, mode, row) {
    var p = projectOf(row);
    if (mode === 'project') return p ? p.id : '';
    if (mode === 'country') return p ? p.country : '';
    return senderName(row);
  }

  function groupHeader(state, user, mode, key, groupRows) {
    var un = groupRows.filter(function (r) { return unreadOf(user, r); }).length;
    var unTxt = '<span class="rt num' + (un ? ' hot' : '') + '">' +
      (un ? plural(un, 'unread') : 'nothing unread') + '</span>';
    var cnt = '<span class="cnt num">' + e(plural(groupRows.length, 'message')) + '</span>';

    if (mode === 'country') {
      return '<div class="p11-ghd ' + ccOf(key) + '">' + flagMark(key) +
        '<b>' + e(countryName(state, key)) + '</b>' + cnt + unTxt + '</div>';
    }
    if (mode === 'project') {
      var p = CBP.projectById(key);
      return '<div class="p11-ghd ' + (p ? ccOf(p.country) : 'cc-x') + '">' +
        (p ? flagMark(p.country) : '') + '<b>' + e(p ? p.name : key) + '</b>' +
        '<span class="p11-ghpid num">' + e(key) + '</span>' + cnt + unTxt + '</div>';
    }
    return '<div class="p11-ghd cc-x"><b>' + e(key) + '</b>' + cnt + unTxt + '</div>';
  }

  function groupedBody(state, ui, user, mayWrite, rows, box) {
    var mode = ui.msgGroup;
    var by = {}, order = [];
    rows.forEach(function (r) {
      var k = groupKeyLabel(state, mode, r);
      if (!by[k]) { by[k] = []; order.push(k); }
      by[k].push(r);
    });

    if (mode === 'country') {
      var codes = D.visibleCountries(user, state.countries);
      order = codes.filter(function (c) { return by[c]; });
    } else {
      order.sort(function (a, b) {
        var la = a, lb = b;
        if (mode === 'project') {
          var pa = CBP.projectById(a), pb = CBP.projectById(b);
          la = (pa ? pa.name : '') + a; lb = (pb ? pb.name : '') + b;
        }
        return la.localeCompare(lb);
      });
    }

    return '<div class="p11-list">' + order.map(function (k) {
      return groupHeader(state, user, mode, k, by[k]) +
        sortRows(by[k], ui.msgSort).map(function (r) {
          return rowHtml(state, ui, user, mayWrite, r, box);
        }).join('');
    }).join('') + '</div>';
  }

  function empty(state, ui, user, scopeTotal) {
    if (ui.msgSearch) {
      return '<div class="p11-empty"><b>No messages match “' + e(ui.msgSearch) + '”</b>' +
        '<span>Search looks at the message text, the sender’s name, the type, and the project’s ' +
        'name, id or country. Clear the search, or switch to All to widen the set — ' +
        e(plural(scopeTotal, 'message')) + ' sit in your scope.</span>' +
        '<span class="p11-emptyacts"><button class="btn sm" data-act="p11-clear">' +
        'Clear the search</button></span></div>';
    }
    if (!scopeTotal) {
      return '<div class="p11-empty"><b>No messages in your scope</b>' +
        '<span>Comments, approval notes and activity lines appear here as soon as they land on a ' +
        'project in one of your countries.</span></div>';
    }
    if (ui.msgFilter === 'unread') {
      return '<div class="p11-empty"><b>You’re all caught up</b>' +
        '<span>Nothing is unread in your scope. Switch to All to re-read the ' +
        e(plural(scopeTotal, 'message')) + ' on your projects.</span>' +
        '<span class="p11-emptyacts"><button class="chip" data-act="msgfilter" data-f="all">' +
        'Show all messages</button></span></div>';
    }
    return '<div class="p11-empty"><b>Nothing to show</b>' +
      '<span>Every message here has been cleared from your hub, or no message matches the ' +
      'current controls.</span></div>';
  }

  /* ------------------------------------------------------------ one row -- */

  function rowHtml(state, ui, user, mayWrite, row, box) {
    var p = projectOf(row);
    if (!p) return '';
    var isComment = row.source === 'comment';
    var unread = unreadOf(user, row);
    var open = ui.msgOpen === row.id;
    var selected = !!selBag(state, user)[row.id];
    var sName = senderName(row);
    var bodyFull = oneLine(row.body);

    var cls = 'p11-row ' + ccOf(p.country) + (unread ? ' unread' : '') +
              (open ? ' open' : '') + (row.priority ? ' pri' : '');

    var c1 = '<div class="p11-c1">' +
      kindTag(row.type) +
      '<span class="p11-c1cc">' + flagMark(p.country) + e(p.country) + '</span>' +
      '<a class="p11-c1pid num" href="#/project/' + e(p.id) + '">' + e(p.id) + '</a>' +
      '</div>';

    var checkbox = '<input type="checkbox" class="p11-chk" data-act="p11-select" data-id="' + e(row.id) +
      '" aria-label="Select the message from ' + e(sName) + ' about ' + e(p.name) + '"' +
      (selected ? ' checked' : '') + '>';

    var statusCell = '<div class="p11-status">' + checkbox +
      (row.priority ? '<span class="p11-flag" title="Priority">⚑</span>' : '') +
      (isComment
        ? '<span class="p11-unreadtag' + (unread ? ' on' : '') + '">' + (unread ? 'Unread' : 'Read') + '</span>'
        : '<span class="p11-unreadtag na" title="Audit entry — it is not marked read">' +
           '<span class="p11-namark" aria-hidden="true"></span>' +
           '<span class="vh">Audit entry, not marked read</span></span>') +
      '</div>';

    var dateCell = '<div class="p11-date num">' + e(D.fmtDateY(row.at)) + '</div>';
    var senderCell = '<div class="p11-sender" title="' + e(sName) + '">' + e(sName) + '</div>';
    var subjBtn = '<button class="p11-subj" data-act="p11-open" data-id="' + e(row.id) +
      '" aria-expanded="' + (open ? 'true' : 'false') + '">' +
      '<b>' + e(p.name) + '</b>' +
      '<span class="p11-chev" aria-hidden="true">' + (open ? '▴' : '▾') + '</span></button>';
    var bodyLine = '<div class="p11-body" title="' + e(bodyFull) + '">' +
      atomicNums(e(bodyFull)) + '</div>';

    var panelHtml = '';
    if (open) {
      panelHtml = '<div class="p11-panelwrap">' +
        (isComment ? panel(state, ui, user, mayWrite, row.raw, p, box) : activityPanel(row, p)) +
        '</div>';
    }

    return '<div class="' + cls + '">' + c1 + dateCell + statusCell + senderCell + subjBtn +
      bodyLine + panelHtml + '</div>';
  }

  /* ---------------------------------------- an activity line, expanded --- *
     Read-only by design: it is the project's own audit trail, not a second
     conversation. No composer, no mark-read, no flag — see the read-parity
     note at the top of this file for why. */
  function activityPanel(row, p) {
    var meta = TYPE_META[row.type] || TYPE_META.comment;
    return '<div class="p11-panel p11-panel--activity">' +
      '<div class="p11-ph">' + e(meta.label) + ' on this project' +
        '<span class="num">' + e(D.fmtDateY(row.at)) + '</span></div>' +
      '<p class="p11-fullbody">' + e(oneLine(row.body)) + '</p>' +
      '<p class="p11-hint">This is a line from the project’s own audit trail, shown here for ' +
      'context — it is not part of the conversation and carries no reply or read state of its own.</p>' +
      '<a class="p11-link" href="#/project/' + e(p.id) + '">Open ' + e(p.id) + ': full record and activity</a>' +
      '</div>';
  }

  /* ------------------------------------------- expanded thread + reply --- */

  function panel(state, ui, user, mayWrite, c, p, box) {
    var feed = D.commentsFor(p.id);
    var shown = feed.slice(Math.max(0, feed.length - FEED_EXCERPT));
    var unreadNow = D.isUnread(user, c);

    var pacts = '';
    if (mayWrite) {
      pacts = '<div class="p11-pacts">' +
        '<button class="btn sm" data-act="comment-read" data-id="' + e(c.id) +
          '" data-read="' + (unreadNow ? 'true' : 'false') + '">' +
          (unreadNow ? 'Mark read' : 'Mark unread') + '</button>' +
        '<button class="btn sm' + (c.priority ? ' on' : '') +
          '" data-act="comment-priority" data-id="' + e(c.id) +
          '" aria-pressed="' + (c.priority ? 'true' : 'false') + '">⚑ ' +
          (c.priority ? 'Flagged' : 'Flag') + '</button>' +
        '<button class="btn sm" data-act="pin-project" data-id="' + e(p.id) + '">' +
          ((state.pinnedProjects || []).indexOf(p.id) > -1 ? 'Unpin' : 'Pin') + '</button>' +
        '</div>';
    }

    var items = shown.map(function (x) {
      var un = D.isUnread(user, x);
      var cls = (x.id === c.id ? ' on' : '') + (un ? ' unread' : '');
      return '<li' + (cls ? ' class="' + cls.slice(1) + '"' : '') + '>' +
        '<span class="p11-fh">' + kindTag(typeOfComment(x)) +
          '<b>' + e(CBP.userName(x.author)) + '</b>' +
          '<span class="num">' + e(D.fmtDateY(x.at) + ' · ' + (x.time || '')) + '</span>' +
          (x.edited_at ? '<span class="p11-ed">(edited)</span>' : '') +
        '</span>' +
        '<span class="p11-fb">' + e(x.body) + '</span></li>';
    }).join('');

    var head = '<div class="p11-ph">Recent on this project' +
      '<span class="num">' + e(shown.length + ' of ' + plural(feed.length, 'message')) +
      '</span></div>';

    var composer = '';
    if (mayWrite) {
      var err = (box.err && !box.taken) ? box.err : null;
      if (err) box.taken = true;
      composer =
        '<div class="p11-composer">' +
          '<label class="fldlab" for="p11reply">Quick reply</label>' +
          '<textarea id="p11reply" class="p11-input" rows="3" data-act="p11-draft" ' +
            'data-id="' + e(p.id) + '" placeholder="Reply on ' + e(p.name) +
            '">' + e(ui.msgDraft) + '</textarea>' +
          (err ? '<div class="p11-err">' + e(err) + '</div>' : '') +
          '<div class="p11-cacts">' +
            '<button class="btn brass" data-act="p11-reply" data-id="' + e(p.id) +
              '">Post reply</button>' +
            '<span class="p11-hint">Posts as ' + e(user.name) + ' on ' +
              e(D.fmtDateY(CBP.CONFIG.TODAY)) + ' — the same feed the project page shows, ' +
              'and read for you the moment it lands.</span>' +
          '</div>' +
        '</div>';
    } else {
      composer = '<p class="p11-hint">This account is read-only: the thread is here to read, ' +
        'and replying, flagging and marking read belong to the other roles.</p>';
    }

    return '<div class="p11-panel">' + pacts + head +
      '<ul class="p11-feed">' + items + '</ul>' + composer +
      '<a class="p11-link" href="#/project/' + e(p.id) + '">Open ' + e(p.id) +
      ': full record and activity</a></div>';
  }

  /* ==================================================== event wiring ======
     Registered once at load. CORE already wires msgfilter / msgsort /
     comment-read / comment-readall / comment-priority / pin-project through
     actions.js; everything below is this page's own, under a p11- prefix,
     and ends in a state mutation + CBP.render() exactly like every other
     page. p11-group (the Type/grouping condition) is new in v1.2.4 and lives
     here rather than in K.filterBar because it holds one of four values, not
     a boolean — the shape the frozen `msggroup` HANDLERS entry expects. */

  function on11() {
    return CBP.state && CBP.state.ui && CBP.state.ui.route === 'messages';
  }

  function closest(node, sel) {
    return (node && node.closest) ? node.closest(sel) : null;
  }

  function refocus(id, caret) {
    var el = document.getElementById(id);
    if (!el) return;
    el.focus();
    if (caret === undefined || caret === null) caret = el.value.length;
    try { el.setSelectionRange(caret, caret); } catch (err) { /* older engines */ }
  }

  document.addEventListener('click', function (ev) {
    if (!on11()) return;
    var t = closest(ev.target, '[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    var known = ['p11-open', 'p11-reply', 'p11-clear', 'p11-group', 'p11-clearsel', 'p11-undo',
                 'p11-alerts'];
    if (known.indexOf(act) === -1) return;

    var ui = CBP.state.ui, user = CBP.state.user;
    ev.preventDefault();
    ev.stopImmediatePropagation();

    if (act === 'p11-open') {
      var id = t.getAttribute('data-id');
      ui.msgOpen = (ui.msgOpen === id) ? null : id;
      ui.msgDraft = '';
      ui.err = null;
      CBP.render();

    } else if (act === 'p11-clear') {
      ui.msgSearch = '';
      CBP.render();
      refocus(SEARCH_ID);

    } else if (act === 'p11-group') {
      ui.msgGroup = t.getAttribute('data-g') || '';
      CBP.render();

    } else if (act === 'p11-alerts') {
      ui.p8 = ui.p8 || {};
      ui.p8.tab = 'my';
      location.hash = '#/alerts';

    } else if (act === 'p11-clearsel') {
      var sel = selBag(CBP.state, user);
      var ids = Object.keys(sel).filter(function (k) { return sel[k]; });
      if (!ids.length) return;
      var bag = clearedBag(CBP.state, user);
      ids.forEach(function (i) { bag[i] = true; delete sel[i]; });
      setUndo(CBP.state, user, { ids: ids, n: ids.length });
      CBP.render();

    } else if (act === 'p11-undo') {
      var rec = undoOf(CBP.state, user);
      if (rec) {
        var cb = clearedBag(CBP.state, user);
        rec.ids.forEach(function (i) { delete cb[i]; });
      }
      setUndo(CBP.state, user, null);
      CBP.render();

    } else {
      /* p11-reply: the composer. CBP.actions owns the write, the viewer never
         gets here because the control is not rendered for a read-only account */
      var pid = t.getAttribute('data-id');
      var el = document.getElementById('p11reply');
      if (el) ui.msgDraft = el.value;
      var res = A.commentAdd(pid, ui.msgDraft, 'comment');
      if (res.ok) {
        ui.msgDraft = '';
        CBP.render();
      } else {
        CBP.render();
        refocus('p11reply');
      }
    }
  });

  document.addEventListener('change', function (ev) {
    if (!on11()) return;
    var t = ev.target;
    if (!t || !t.getAttribute) return;
    var act = t.getAttribute('data-act');
    if (act !== 'p11-select' && act !== 'p11-selectall') return;

    var user = CBP.state.user;
    var bag = selBag(CBP.state, user);

    if (act === 'p11-select') {
      var id = t.getAttribute('data-id');
      if (t.checked) bag[id] = true; else delete bag[id];
    } else {
      /* select-all toggles every row currently shown, recomputed the same
         way render() built the visible set */
      var ui = CBP.state.ui;
      var all = buildRows(CBP.state, user).filter(matcher(CBP.state, ui.msgSearch));
      /* AUDIT D2 — the same rule render() uses, and it has to stay the same
         rule: select-all that selects a different set from the one on screen
         is worse than no select-all. */
      var byFilter = ui.msgFilter === 'unread'
        ? all.filter(function (r) { return unreadOf(user, r); })
        : all;
      var cleared = clearedBag(CBP.state, user);
      var shown = byFilter.filter(function (r) { return !cleared[r.id]; });
      if (t.checked) shown.forEach(function (r) { bag[r.id] = true; });
      else shown.forEach(function (r) { delete bag[r.id]; });
    }
    CBP.render();
  });

  /* typing: one state mutation, one render pass, caret restored */
  document.addEventListener('input', function (ev) {
    if (!on11()) return;
    var t = ev.target;
    if (!t || !t.getAttribute) return;
    var act = t.getAttribute('data-act');
    if (act !== 'p11-search' && act !== 'p11-draft') return;

    var caret = null;
    try { caret = t.selectionStart; } catch (err) { caret = null; }

    if (act === 'p11-search') {
      CBP.state.ui.msgSearch = t.value;
      CBP.render();
      refocus(SEARCH_ID, caret);
    } else {
      CBP.state.ui.msgDraft = t.value;
      CBP.state.ui.err = null;
      CBP.render();
      refocus('p11reply', caret);
    }
  });

})();
