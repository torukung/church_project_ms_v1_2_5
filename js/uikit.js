/* uikit.js — v1.2.2 shared view kit.

   Everything the v1.2.2 fine-tuning pass needs in more than one place lives
   here and nowhere else, so five pages can be worked in parallel without any
   two of them editing the same file:

     K.viewBar     the framed page top bar (header · status · country)
     K.filterBar   the multi-condition filter + sort strip
     K.applyFilter the pure AND-ing of those conditions over a row set
     K.sortRows    the sort half of the same strip
     K.segTabs     the inline segment tab strip used inside an open row
     K.seg         which segment is showing for a given row
     K.isOpen      collapse state for a page's rows (minimised by default)
     K.expandAll   the Expand all / Collapse all control
     K.attention   the flag cell model — over deadline, or your next action
     K.flagCell    that model as markup
     K.band        the country band header, generalised from P3
     K.scrollCue   wraps a wide table with the right-edge fade + cue (UX-03)

   House rules this file keeps: vanilla ES5, no build step, file:// safe, no
   Date.now, no Math.random, tokens not literals, U.flagMark for every flag.
   It renders markup only — every mutation goes through the delegated listener
   at the foot, which follows the one-pass rule: mutate CBP.state, CBP.render().

   State it owns (all additive; see docs/CORE_API_v1.2.2.md §1):
     state.ui.flt[page]  { owner, aging, flag, sort, dir }  new conditions
     state.ui.col[page]  { mode:'min'|'all', open:{ id:true } }
     state.ui.seg[key]   the open segment of one row

   The conditions that already had a home in v1.2.1 — status filter, search
   text, country chips — keep it. K.BIND maps a page to those legacy keys so
   the walks, the persist migrations and every deep link keep working. */
(function () {
  'use strict';

  var K = {};
  CBP.uikit = K;
  CBP.K = K;

  var D = CBP.D, U = CBP.ui, e = CBP.ui.esc;

  function S() { return CBP.state; }
  function UI() { return CBP.state.ui; }

  /* ====================================================== 1 · state ====== */

  /* legacy keys per page — null means "this page has no such key yet" */
  K.BIND = {
    p3:  { status: 'p3Filter',  q: 'p3Search',  country: 'p3Countries' },
    p6:  { status: 'p6Filter',  q: null,        country: null },
    p5:  { status: null,        q: null,        country: null },
    p7:  { status: null,        q: null,        country: null },
    p12: { status: 'p12Filter', q: 'p12Search', country: 'p12Countries' }
  };

  var FLT_DEFAULT = { owner: '', aging: '', flag: false, sort: '', dir: 'asc' };

  /* the new-condition bag for one page, created on first read */
  K.flt = function (page) {
    var ui = UI();
    if (!ui.flt || typeof ui.flt !== 'object') ui.flt = {};
    if (!ui.flt[page]) {
      ui.flt[page] = { owner: '', aging: '', flag: false, sort: '', dir: 'asc' };
    }
    var f = ui.flt[page];
    Object.keys(FLT_DEFAULT).forEach(function (k) {
      if (!(k in f)) f[k] = FLT_DEFAULT[k];
    });
    return f;
  };

  /* legacy-bound reads, so a page never has to know where a condition lives */
  K.status = function (page) {
    var b = K.BIND[page] || {};
    return b.status ? String(UI()[b.status] || 'all') : 'all';
  };
  K.query = function (page) {
    var b = K.BIND[page] || {};
    return b.q ? String(UI()[b.q] || '') : '';
  };
  K.countries = function (page, codes) {
    var b = K.BIND[page] || {};
    if (!b.country) return codes.slice();
    return U.selectedCodes(S(), b.country, codes);
  };

  /* ------------------------------------------------------ collapse state -- */

  K.col = function (page) {
    var ui = UI();
    if (!ui.col || typeof ui.col !== 'object') ui.col = {};
    if (!ui.col[page]) ui.col[page] = { mode: 'min', open: {} };
    var c = ui.col[page];
    if (c.mode !== 'min' && c.mode !== 'all') c.mode = 'min';
    if (!c.open || typeof c.open !== 'object') c.open = {};
    return c;
  };

  /* A row is open when Expand all is on, or when it was opened by hand.
     'all' mode keeps its own exception map so one row can be shut again
     without collapsing the rest. */
  K.isOpen = function (page, id) {
    var c = K.col(page);
    if (c.mode === 'all') return c.open[id] !== false;
    return c.open[id] === true;
  };

  K.toggleRow = function (page, id) {
    var c = K.col(page);
    if (c.mode === 'all') {
      c.open[id] = (c.open[id] === false);
      if (c.open[id]) delete c.open[id];
    } else {
      if (c.open[id]) delete c.open[id]; else c.open[id] = true;
    }
  };

  K.openCount = function (page, ids) {
    var n = 0;
    (ids || []).forEach(function (id) { if (K.isOpen(page, id)) n++; });
    return n;
  };

  /* the Expand all / Collapse all control — label says what the click does */
  K.expandAll = function (page, ids) {
    var n = K.openCount(page, ids);
    var total = (ids || []).length;
    var expanded = total > 0 && n === total;
    return '<button class="k-xall" data-act="k-expand" data-page="' + e(page) + '"' +
      ' aria-pressed="' + (expanded ? 'true' : 'false') + '">' +
      '<span class="k-xchev" aria-hidden="true">' + (expanded ? '▴' : '▾') + '</span>' +
      (expanded ? 'Collapse all' : 'Expand all') +
      '<span class="n num">' + n + '/' + total + '</span></button>';
  };

  /* -------------------------------------------------------- segment state -- */

  K.seg = function (ns, id, tabs, fallback) {
    var ui = UI();
    if (!ui.seg || typeof ui.seg !== 'object') ui.seg = {};
    var key = ns + ':' + id;
    var cur = ui.seg[key];
    var legal = (tabs || []).some(function (t) { return t.v === cur; });
    if (!legal) cur = fallback || ((tabs && tabs[0]) ? tabs[0].v : '');
    return cur;
  };

  K.segTabs = function (o) {
    var tabs = o.tabs || [];
    if (!tabs.length) return '';
    var cur = K.seg(o.ns, o.id, tabs, o.fallback);
    return '<div class="k-seg" role="tablist" aria-label="' + e(o.label || 'Sections') + '">' +
      tabs.map(function (t) {
        var on = t.v === cur;
        return '<button class="k-segb' + (on ? ' on' : '') + '" role="tab"' +
          ' aria-selected="' + (on ? 'true' : 'false') + '"' +
          ' data-act="k-seg" data-ns="' + e(o.ns) + '" data-id="' + e(o.id) + '"' +
          ' data-v="' + e(t.v) + '">' + e(t.label) +
          (t.n ? ' <span class="n num">' + t.n + '</span>' : '') +
          (t.dot ? '<span class="k-segdot" aria-hidden="true"></span>' : '') +
          '</button>';
      }).join('') + '</div>';
  };

  /* ================================================ 2 · attention flag ==== */

  /* The one rule for "what is wrong with this row", used identically on
     Projects, Needs-you, TimeBlock and Contracts so the same colour always
     means the same thing:

       over   past its target date          rose   "over by 12 d"
       needs  this persona owes an action   brass  "you: Request approved"
       wait   sitting longer than the stage threshold   amber-ink  "197 d waiting"
       quiet  nothing owed                  muted  "—"

     Precedence is over > needs > wait > quiet: a late project is late even
     when somebody else is holding it. */

  var NEEDS_CACHE = { user: null, map: null };

  function needsMap(user) {
    if (!user) return {};
    if (NEEDS_CACHE.user === user.id && NEEDS_CACHE.map) return NEEDS_CACHE.map;
    var map = {};
    (D.needsYou(user) || []).forEach(function (it) {
      if (it.kind === 'watching') return;
      var pid = it.project ? it.project.id : it.id;
      if (!pid || map[pid]) return;
      var a = (it.actions || []).filter(function (x) { return x && x.label; })[0];
      map[pid] = { kind: it.kind, label: a ? a.label : 'Open',
                   short: a && a.short ? a.short : null, days: it.waiting_days || 0 };
    });
    NEEDS_CACHE.user = user.id;
    NEEDS_CACHE.map = map;
    return map;
  }

  /* invalidated on every render, because an act can change what is owed */
  K.resetAttention = function () { NEEDS_CACHE.user = null; NEEDS_CACHE.map = null; };

  K.attention = function (p, user) {
    if (!p) return { level: 'quiet', text: '', days: 0 };

    var over = D.pastTarget ? D.pastTarget(p) : null;
    if (over) {
      return { level: 'over', days: over,
               text: 'over by ' + D.days(over), full: 'Past its target date by ' + D.days(over) };
    }

    var owed = needsMap(user)[p.id];
    if (owed) {
      return { level: 'needs', days: owed.days, act: owed.label,
               text: 'you: ' + (owed.short || owed.label),
               full: 'Waiting on you: ' + owed.label };
    }

    var w = D.waitingFor ? D.waitingFor(p) : null;
    var thr = (CBP.CONFIG.REVIEW_THRESHOLD_DAYS || 14);
    if (w && w.days > thr && p.status !== 1 && p.status !== 'declined') {
      return { level: 'wait', days: w.days,
               text: D.days(w.days) + ' waiting', full: w.at + ' · ' + D.days(w.days) };
    }

    return { level: 'quiet', days: 0, text: '', full: 'Nothing outstanding' };
  };

  /* v1.2.6 R-B — opts.labelled (P3 register only): the same flag as two
     labelled lines, "Attention · <dot+text>" then the plain-language reason
     (a.full, the string already in title). Without opts the markup below is
     byte-identical to v1.2.5.2, so P5/P6/P7/P12/home read exactly as before. */
  K.flagCell = function (a, opts) {
    if (opts && opts.labelled) {
      var quiet = !a || a.level === 'quiet';
      var full = quiet ? 'Nothing outstanding' : (a.full || a.text);
      return '<span class="k-flag k-flab ' + (quiet ? 'quiet' : e(a.level)) + '" title="' + e(full) + '">' +
        '<span class="l3-line"><span class="l3-k">Attention</span>' +
        (quiet
          ? '<span class="k-ftxt">Nothing outstanding</span></span>'
          : '<span class="k-fdot" aria-hidden="true"></span>' +
            '<span class="k-ftxt">' + e(a.text) + '</span></span>' +
            '<span class="l3-why">' + e(full) + '</span>') +
        '</span>';
    }
    if (!a || a.level === 'quiet') {
      return '<span class="k-flag quiet" title="Nothing outstanding">' +
             '<span class="k-fmark" aria-hidden="true"></span>' +
             '<span class="vh">Nothing outstanding</span></span>';
    }
    return '<span class="k-flag ' + e(a.level) + '" title="' + e(a.full || a.text) + '">' +
      '<span class="k-fdot" aria-hidden="true"></span>' +
      '<span class="k-ftxt">' + e(a.text) + '</span></span>';
  };

  /* rank for the "attention" sort and for the over-deadline-first ordering */
  K.attnRank = function (a) {
    return { over: 0, needs: 1, wait: 2, quiet: 3 }[(a && a.level) || 'quiet'];
  };

  /* ================================================ 3 · filter + sort ===== */

  /* A condition is one of:
       { key, label, kind:'chips',  options:[{v,label,n,cc,flag}] , bind:'country'|'status' }
       { key, label, kind:'select', options:[{v,label}] }
       { key, label, kind:'toggle', on:bool, toggleLabel }
     `bind` names a legacy state key (see K.BIND); without it the value lives
     in state.ui.flt[page]. */

  K.AGING = [
    { v: '',    label: 'Any time in process' },
    { v: '7',   label: '7 days or more' },
    { v: '30',  label: '30 days or more' },
    { v: '90',  label: '90 days or more' },
    { v: '180', label: '180 days or more' }
  ];

  K.ownerOptions = function (rows, get) {
    var seen = {}, out = [{ v: '', label: 'Any owner' }];
    (rows || []).forEach(function (r) {
      var id = get ? get(r) : (r.owner || '');
      if (!id || seen[id]) return;
      seen[id] = 1;
      out.push({ v: id, label: CBP.userName(id) });
    });
    out.sort(function (a, b) {
      if (!a.v) return -1; if (!b.v) return 1;
      return a.label.localeCompare(b.label);
    });
    return out;
  };

  K.filterBar = function (o) {
    var page = o.page;
    var f = K.flt(page);
    var conds = o.conditions || [];
    var html = '<div class="k-flt" role="group" aria-label="Filter and sort">';

    conds.forEach(function (c) {
      if (c.kind === 'chips') {
        html += chipsBlock(page, c);
      } else if (c.kind === 'select') {
        html += selectBlock(page, c, f);
      } else if (c.kind === 'toggle') {
        html += toggleBlock(page, c, f);
      }
    });

    if (o.sorts && o.sorts.length) {
      var cur = f.sort || o.sorts[0].v;
      html += '<div class="k-fb k-fb-sort">' +
        '<label class="k-flab" for="k-sort-' + e(page) + '">Sort</label>' +
        '<select class="k-fsel" id="k-sort-' + e(page) + '" data-act="k-sort" data-page="' + e(page) + '">' +
        o.sorts.map(function (s) {
          return '<option value="' + e(s.v) + '"' + (s.v === cur ? ' selected' : '') + '>' +
                 e(s.label) + '</option>';
        }).join('') + '</select>' +
        '<button class="k-fdir" data-act="k-dir" data-page="' + e(page) + '"' +
        ' title="' + (f.dir === 'desc' ? 'Descending — click for ascending'
                                       : 'Ascending — click for descending') + '"' +
        ' aria-label="' + (f.dir === 'desc' ? 'Sorted descending' : 'Sorted ascending') + '">' +
        (f.dir === 'desc' ? '↓' : '↑') + '</button></div>';
    }

    if (o.search) {
      var b = K.BIND[page] || {};
      html += '<div class="k-fb k-fb-q">' +
        '<label class="vh" for="k-q-' + e(page) + '">' + e(o.search.label || 'Search') + '</label>' +
        '<input class="k-fq" id="k-q-' + e(page) + '" type="search" autocomplete="off"' +
        ' data-act="' + e(o.search.act || 'k-q') + '" data-page="' + e(page) + '"' +
        ' placeholder="' + e(o.search.placeholder || 'Search…') + '"' +
        /* v1.2.2 audit — a page whose search key is not in K.BIND (p5) passes
           its own value, so it can use this standard slot instead of `right`. */
        ' value="' + e(o.search.value !== undefined
          ? (o.search.value || '')
          : (b.q ? (UI()[b.q] || '') : '')) + '"></div>';
    }

    if (o.right) html += '<div class="k-fright">' + o.right + '</div>';

    html += '</div>';

    if (o.summary !== false) html += summaryLine(page, o, conds, f);
    return html;
  };

  function chipsBlock(page, c) {
    var opts = c.options || [];
    if (!opts.length) return '';
    return '<div class="k-fb k-fb-chips' + (c.wide ? ' wide' : '') + '">' +
      '<span class="k-flab">' + e(c.label) + '</span>' +
      '<div class="k-fchips">' + opts.map(function (t) {
        return '<button class="k-chip' + (t.cc ? ' ' + t.cc : '') + (t.on ? ' on' : '') + '"' +
          ' data-act="' + e(c.act) + '"' +
          (c.dataKey ? ' data-' + e(c.dataKey) + '="' + e(t.v) + '"' : '') +
          ' aria-pressed="' + (t.on ? 'true' : 'false') + '">' +
          (t.flag ? U.flagMark(t.v) : '') + e(t.label) +
          (t.n === undefined ? '' : ' <span class="n num">' + t.n + '</span>') +
          '</button>';
      }).join('') + '</div></div>';
  }

  function selectBlock(page, c, f) {
    var cur = String(f[c.key] === undefined ? '' : f[c.key]);
    var id = 'k-' + c.key + '-' + page;
    return '<div class="k-fb">' +
      '<label class="k-flab" for="' + e(id) + '">' + e(c.label) + '</label>' +
      '<select class="k-fsel" id="' + e(id) + '" data-act="k-set" data-page="' + e(page) + '"' +
      ' data-k="' + e(c.key) + '">' +
      (c.options || []).map(function (t) {
        return '<option value="' + e(t.v) + '"' + (String(t.v) === cur ? ' selected' : '') + '>' +
               e(t.label) + '</option>';
      }).join('') + '</select></div>';
  }

  function toggleBlock(page, c, f) {
    var on = !!f[c.key];
    return '<div class="k-fb">' +
      '<button class="k-ftog' + (on ? ' on' : '') + '" data-act="k-tog" data-page="' + e(page) + '"' +
      ' data-k="' + e(c.key) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
      '<span class="k-fdot" aria-hidden="true"></span>' +
      e(c.toggleLabel || c.label) + '</button></div>';
  }

  /* the one line that says what is on and offers a way out of it */
  function summaryLine(page, o, conds, f) {
    var on = [];
    conds.forEach(function (c) {
      if (c.kind === 'toggle' && f[c.key]) on.push(c.toggleLabel || c.label);
      else if (c.kind === 'select' && f[c.key]) {
        var t = (c.options || []).filter(function (x) { return String(x.v) === String(f[c.key]); })[0];
        if (t) on.push(t.label);
      } else if (c.kind === 'chips' && c.narrowed) on.push(c.narrowLabel || c.label);
    });
    /* R-07 — a page may narrow the list by keys the kit's own conditions don't
       cover (P3's `p3Filter` status chip, `p3Search`). It reports them with an
       optional "dirty" signal on the options object — `o.extraDirty`, a boolean
       or a count of active page-owned narrowers. When either the kit conditions
       or that signal is non-default, the Clear affordance renders; the k-clear
       handler already resets the page's own keys via K.BIND, so it works. A page
       that passes nothing leaves extraDirty falsy, so this line is byte-identical
       to before for every existing caller. */
    var extraDirty = !!o.extraDirty;
    var clear = on.length || extraDirty;
    var counts = o.count
      ? '<span class="k-fcount num">' + o.count.shown + ' of ' + o.count.total +
        ' ' + e(o.count.noun || 'rows') + '</span>'
      : '';
    if (!on.length && !counts && !extraDirty) return '';
    return '<div class="k-fsum">' + counts +
      (on.length
        ? '<span class="k-fon">Filtered: ' + e(on.join(' · ')) + '</span>'
        : '') +
      (clear
        ? '<button class="k-fclear" data-act="k-clear" data-page="' + e(page) + '">Clear filters</button>'
        : '') +
      '</div>';
  }

  /* ------------------------------------------------------------ applying -- */

  /* rows: the candidate list. get: an adapter { country, status, owner,
     aging, attn, text } — each a function(row) returning the row's value for
     that condition. Missing adapters skip their condition, so a page opts in
     to exactly the conditions it renders. */
  K.applyFilter = function (page, rows, get, opts) {
    var f = K.flt(page);
    var o = opts || {};
    var q = (o.q === undefined ? K.query(page) : o.q);
    q = String(q || '').trim().toLowerCase();
    var status = (o.status === undefined ? K.status(page) : o.status);
    var codes = o.codes || null;

    return (rows || []).filter(function (r) {
      if (codes && get.country) {
        if (codes.indexOf(get.country(r)) === -1) return false;
      }
      if (status && status !== 'all' && get.status) {
        if (String(get.status(r)) !== String(status)) return false;
      }
      if (f.owner && get.owner) {
        if (String(get.owner(r) || '') !== String(f.owner)) return false;
      }
      if (f.aging && get.aging) {
        if ((get.aging(r) || 0) < Number(f.aging)) return false;
      }
      if (f.flag && get.attn) {
        var lvl = (get.attn(r) || {}).level;
        if (lvl !== 'over' && lvl !== 'needs') return false;
      }
      if (q && get.text) {
        if (String(get.text(r) || '').toLowerCase().indexOf(q) === -1) return false;
      }
      return true;
    });
  };

  /* sorters: { key: function(row) -> comparable }. Stable by the tie key. */
  K.sortRows = function (page, rows, sorters, tie) {
    var f = K.flt(page);
    var keys = Object.keys(sorters || {});
    var key = f.sort && sorters[f.sort] ? f.sort : keys[0];
    if (!key) return rows;
    var pick = sorters[key];
    var dir = f.dir === 'desc' ? -1 : 1;
    var out = rows.slice();
    out.sort(function (a, b) {
      var x = pick(a), y = pick(b);
      if (x === y) return tie ? String(tie(a)).localeCompare(String(tie(b))) : 0;
      if (x === null || x === undefined) return 1;
      if (y === null || y === undefined) return -1;
      if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir;
      return String(x).localeCompare(String(y)) * dir;
    });
    return out;
  };

  /* ================================================= 4 · frames ========== */

  /* The framed page top bar. Three segments, always in this order, so every
     page in the platform opens with the same shape:
       head    crumb · title · scope figure · page actions
       status  the status / stage filter row
       country the country chip row
     A segment left out simply does not render its frame. */
  K.viewBar = function (o) {
    var html = '<div class="k-bar">';

    html += '<div class="k-bseg k-bhead">' +
      (o.crumb ? '<div class="crumb">' + o.crumb + '</div>' : '') +
      '<div class="k-bhrow"><h1>' + e(o.title || '') + '</h1>' +
      (o.sub ? '<span class="sub num">' + o.sub + '</span>' : '') +
      (o.actions ? '<div class="k-bacts">' + o.actions + '</div>' : '') +
      '</div></div>';

    if (o.status) {
      html += '<div class="k-bseg k-bstatus">' +
        (o.statusLabel ? '<span class="k-blab">' + e(o.statusLabel) + '</span>' : '') +
        '<div class="k-bwrap">' + o.status + '</div></div>';
    }
    if (o.country) {
      html += '<div class="k-bseg k-bcountry">' +
        (o.countryLabel ? '<span class="k-blab">' + e(o.countryLabel) + '</span>' : '') +
        '<div class="k-bwrap">' + o.country + '</div></div>';
    }
    if (o.extra) html += '<div class="k-bseg k-bextra"><div class="k-bwrap">' +
      o.extra + '</div></div>';

    return html + '</div>';
  };

  /* the country band header — P3's, generalised so Contracts and Budget can
     carry their own figures in the same frame */
  K.band = function (o) {
    var cc = o.cc || U.ccOf(o.code);
    var figs = (o.figures || []).map(function (f) {
      return '<span class="k-bfig' + (f.tone ? ' ' + f.tone : '') + '">' +
        (f.label ? e(f.label) + ' ' : '') +
        '<b class="num">' + (f.html || e(String(f.value))) + '</b>' +
        (f.after ? ' <span class="num">' + e(f.after) + '</span>' : '') + '</span>';
    }).join('');

    return '<header class="k-band ' + cc + '">' +
      '<div class="k-btitle">' + U.flagMark(o.code) + '<b>' + e(o.name) + '</b>' +
        (o.count === undefined ? ''
          : '<span class="cnt num">' + o.count + ' ' + e(o.noun || 'items') + '</span>') +
      '</div>' +
      '<div class="k-bfigs">' + figs + (o.tail || '') + '</div>' +
      '</header>';
  };

  /* ------------------------------------------------------- today marker --
     v1.2.3 — the "today · 28 Aug 26" pill was readable but it sat in the
     chart and covered whatever fell under it. It becomes a small chapel that
     perches on top of the today line and says the date on hover, so the line
     keeps its full height and nothing is hidden behind a label.

     The chapel is the brandmark's own silhouette (app.js `brandIcon`), drawn
     small: the same building in both places rather than a second icon nobody
     recognises. The animation is a slow breath on the halo and a two-degree
     sway on the building — enough to catch the eye once, never enough to
     distract while somebody reads a chart. It is switched off entirely under
     prefers-reduced-motion.

     Returns BOTH the line and the marker, positioned by the caller's own
     `left` value, so P5's overlay() maths and U.gantt's pos() maths each keep
     their own coordinate system. */
  K.todayMark = function (o) {
    var left = o.left;
    var label = o.label || '';
    var pre = o.cls || 'k';

    return '<div class="' + e(pre) + '-today" style="left:' + left + '"></div>' +
      '<div class="k-todaymark" style="left:' + left + '" tabindex="0" role="img"' +
      ' aria-label="Today, ' + e(label) + '" title="Today · ' + e(label) + '">' +
        '<span class="k-tmhalo" aria-hidden="true"></span>' +
        '<svg class="k-tmico" viewBox="0 0 24 24" aria-hidden="true">' +
          '<g fill="currentColor">' +
            '<path d="M11.4 2h1.2v1.6H14v1.2h-1.4v1.7l4.9 3.6v1.4l-1.5-.5V18H8V11l-1.5.5V10.1l4.9-3.6V4.8H10V3.6h1.4V2z"/>' +
            '<path d="M4.5 12.6 7 11.8V18H4.5v-5.4zM19.5 12.6 17 11.8V18h2.5v-5.4z"/>' +
            '<rect x="3.2" y="18.6" width="17.6" height="1.6" rx=".8"/>' +
          '</g>' +
        '</svg>' +
        '<span class="k-tmtip" aria-hidden="true">Today · ' + e(label) + '</span>' +
      '</div>';
  };

  /* UX-03 — a wide table keeps its own scroll, and says so */
  K.scrollCue = function (inner, label) {
    return '<div class="k-scroll"><div class="tbl-wrap k-scrollin" tabindex="0" role="region"' +
      ' aria-label="' + e(label || 'Scrollable table') + '">' + inner + '</div>' +
      '<span class="k-scue" aria-hidden="true">scroll →</span></div>';
  };

  /* ================================================ 5 · listener ========= */

  function closest(node, sel) {
    return node && node.closest ? node.closest(sel) : null;
  }

  document.addEventListener('click', function (ev) {
    var t = closest(ev.target, '[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    var page = t.getAttribute('data-page');

    if (act === 'k-expand') {
      var c = K.col(page);
      c.mode = c.mode === 'all' ? 'min' : 'all';
      c.open = {};
    } else if (act === 'k-row') {
      K.toggleRow(page, t.getAttribute('data-id'));
    } else if (act === 'k-seg') {
      UI().seg = UI().seg || {};
      UI().seg[t.getAttribute('data-ns') + ':' + t.getAttribute('data-id')] =
        t.getAttribute('data-v');
    } else if (act === 'k-tog') {
      var f = K.flt(page);
      var k = t.getAttribute('data-k');
      f[k] = !f[k];
    } else if (act === 'k-dir') {
      var fd = K.flt(page);
      fd.dir = fd.dir === 'desc' ? 'asc' : 'desc';
    } else if (act === 'k-clear') {
      /* v1.2.2 audit — clear the WHOLE bag, not just the FLT_DEFAULT keys.
         Pages add their own conditions to flt[page] (p5: countries/project/q,
         p7: countries) and those used to survive a "Clear filters", so the
         strip said it had cleared and the list stayed narrowed. Sort and dir
         are kept on purpose: an ordering is not a filter, and resetting it
         would move rows the user never filtered. Unknown keys are reset by
         type, so a page that invents another condition is covered too. */
      var fc = K.flt(page);
      Object.keys(fc).forEach(function (k) {
        if (k === 'sort' || k === 'dir') return;
        if (Object.prototype.hasOwnProperty.call(FLT_DEFAULT, k)) { fc[k] = FLT_DEFAULT[k]; return; }
        var v = fc[k];
        fc[k] = typeof v === 'boolean' ? false : typeof v === 'string' ? '' : null;
      });
      var b = K.BIND[page] || {};
      if (b.status) UI()[b.status] = 'all';
      if (b.q) UI()[b.q] = '';
      if (b.country) UI()[b.country] = null;
    } else {
      return;
    }

    ev.preventDefault();
    ev.stopImmediatePropagation();
    CBP.render();
  });

  document.addEventListener('change', function (ev) {
    var t = closest(ev.target, '[data-act]');
    if (!t) return;
    var act = t.getAttribute('data-act');
    var page = t.getAttribute('data-page');
    if (act === 'k-set') {
      K.flt(page)[t.getAttribute('data-k')] = t.value;
    } else if (act === 'k-sort') {
      K.flt(page).sort = t.value;
    } else {
      return;
    }
    CBP.render();
  });

  /* search boxes rendered by K.filterBar and bound to a legacy key */
  document.addEventListener('input', function (ev) {
    var t = closest(ev.target, '[data-act="k-q"]');
    if (!t) return;
    var b = K.BIND[t.getAttribute('data-page')] || {};
    if (!b.q) return;
    UI()[b.q] = t.value;
    CBP.render();
    var again = document.getElementById(t.id);
    if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
  });

})();
