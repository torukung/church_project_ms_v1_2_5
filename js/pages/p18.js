/* pages/p18.js — P18 public review page, route #/review/<token> (v1.2.7, R-2).
   Fullbleed: no sidebar, no top bar, no persona. A reviewer who was sent the
   link reads the document (CBP.docgen.toHtml, the renderer the print view
   uses, nested under this page's own h1 with {top:2}) and leaves a comment:
   name optional, e-mail and comment required. The one act is review-comment
   (actions.js); `data-again="1"` on the thanks panel clears the thanks state.
   An unknown and a revoked token get the same page, and neither shows the
   document. Markup and copy per docs/RESEARCH_v1.2.7_review.md; styles in
   css/p18.css (.rv-*) plus print.css (.dc-*).

   Session-only ui: ui.rvDraft[token] = {name, email, body} keeps what was
   typed through a failed submit (the render replaces the form). */
(function () {
  'use strict';
  var D = CBP.D, e = CBP.ui.esc;
  CBP.pages = CBP.pages || {};

  var focusNext = null;          /* 'done' | 'sum' — set by a submit, used once */

  function brand() {
    return '<header class="rv-brand"><b>Church Budget Platform</b>' +
      '<span>Review request · no sign-in needed</span></header>';
  }

  function gone() {
    return '<div class="rv">' + brand() + '<main class="rv-main">' +
      '<section class="rv-gone" aria-labelledby="rvh">' +
        '<h1 id="rvh">This review link is no longer active</h1>' +
        '<p>The project team has withdrawn this link or replaced it with a newer one, so the ' +
        'document is no longer shown here.</p>' +
        '<p>If you still want to comment, reply to the e-mail that brought you here.</p>' +
      '</section></main></div>';
  }

  function draftOf(ui, token) {
    return (ui.rvDraft && ui.rvDraft[token]) || { name: '', email: '', body: '' };
  }

  function form(token, ui) {
    var d = draftOf(ui, token);
    var x = ui.err && ui.err.key === 'review' ? ui.err : null;
    var probs = (x && x.problems) || [];
    function pf(field) { return probs.filter(function (q) { return q.field === field; })[0] || null; }
    var pe = pf('rvEmail'), pb = pf('rvBody');

    var sum = '';
    if (x) {
      sum = '<div class="rv-sum" role="alert" tabindex="-1" id="rvSum"><b>' + e(x.msg) + '</b>' +
        (probs.length ? '<ul>' + probs.map(function (q) {
          return '<li><a href="#' + e(q.field) + '" data-rvfocus="' + e(q.field) + '">' + e(q.msg) + '</a></li>';
        }).join('') + '</ul>' : '') + '</div>';
    }

    return '<section class="rv-form" aria-labelledby="rvfh">' +
      '<h2 id="rvfh">Leave a comment</h2>' +
      '<p>Fields marked required must be filled in.</p>' + sum +
      '<div class="rv-f"><label for="rvName">Your name <small>(optional)</small></label>' +
        '<input class="inp" id="rvName" type="text" autocomplete="name" value="' + e(d.name) + '"></div>' +
      '<div class="rv-f"><label for="rvEmail">Your e-mail <small>(required)</small></label>' +
        '<input class="inp" id="rvEmail" type="email" inputmode="email" autocomplete="email" required ' +
        'aria-describedby="rvEmailHint' + (pe ? ' rvEmailErr' : '') + '"' + (pe ? ' aria-invalid="true"' : '') +
        ' value="' + e(d.email) + '">' +
        '<span class="hint" id="rvEmailHint">Used only so the project team can reply to you.</span>' +
        (pe ? '<span class="rv-err" id="rvEmailErr">' + e(pe.msg) + '</span>' : '') + '</div>' +
      '<div class="rv-f"><label for="rvBody">Your comment <small>(required)</small></label>' +
        '<textarea class="inp" id="rvBody" rows="6" required' +
        (pb ? ' aria-invalid="true" aria-describedby="rvBodyErr"' : '') + '>' + e(d.body) + '</textarea>' +
        (pb ? '<span class="rv-err" id="rvBodyErr">' + e(pb.msg) + '</span>' : '') + '</div>' +
      '<div class="rv-act"><button class="btn brass" type="button" data-act="review-comment" data-token="' +
        e(token) + '">Send comment</button><small>Sent to the project team only.</small></div>' +
      '</section>';
  }

  function thanks(token, sent) {
    return '<section class="rv-done" role="status" tabindex="-1" id="rvDone" aria-labelledby="rvdh">' +
      '<h1 id="rvdh">Thank you. Your comment was sent to the project team.</h1>' +
      '<p class="rv-who">' + (sent.name ? e(sent.name) + ' · ' : '') + e(sent.email) + ' · ' +
        '<span class="num">' + e(D.fmtDateY(sent.at)) + '</span></p>' +
      '<blockquote>' + e(sent.body) + '</blockquote>' +
      '<p>You can close this page. If the team has questions, they will reply to <b>' + e(sent.email) + '</b>.</p>' +
      '<div class="rv-act"><button class="btn" type="button" data-act="review-comment" data-token="' + e(token) +
        '" data-again="1">Add another comment</button></div>' +
      '</section>';
  }

  CBP.pages.review = function (state) {
    var ui = state.ui;
    var token = ui.param;
    var hit = token ? D.reviewByToken(token) : null;
    if (!hit || !hit.p || !hit.link || !hit.link.active || !hit.doc || !hit.doc.model) return gone();

    var p = hit.p, model = hit.doc.model;
    var aud = (CBP.CONFIG.DEV_AUDIENCE || {})[hit.link.audience] || D.devAudience(p, hit.stageKey).label;
    var owner = p.owner ? CBP.userName(p.owner) : 'The project team';
    var country = (state.countries.filter(function (c) { return c.code === p.country; })[0] || {}).name || p.country;
    var sent = ui.reviewSent && ui.reviewSent[token];

    var ask = '<section class="rv-ask" aria-labelledby="rvh">' +
      '<h1 id="rvh">Review request · ' + e(aud) + '</h1>' +
      '<p><b>' + e(owner) + '</b>, project owner for ' + e(country) + ', asks you to review the <b>' +
      e(model.kindLabel || 'document') + '</b> for <b>' + e(p.id) + ' · ' + e(p.name) + '</b>.</p>' +
      '<ul class="rv-facts">' +
        '<li>Read the draft below and leave one comment, or several.</li>' +
        '<li>There is no deadline and nothing to sign in to.</li>' +
        '<li>Your comment goes only to the project team; your e-mail lets them reply.</li>' +
      '</ul></section>';

    var sheet = '<article class="dc-sheet" aria-label="Document under review">' +
      CBP.docgen.toHtml(model, { top: 2 }) + '</article>';

    var html = '<div class="rv">' + brand() + '<main class="rv-main">' +
      (sent ? thanks(token, sent) + sheet : ask + sheet + form(token, ui)) +
      '</main></div>';

    if (focusNext) {
      var want = sent ? 'rvDone' : (ui.err && ui.err.key === 'review' ? 'rvSum' : null);
      focusNext = null;
      if (want) setTimeout(function () {
        var el = document.getElementById(want);
        if (!el) return;
        try {
          el.focus({ preventScroll: true });
          if (want === 'rvDone') window.scrollTo(0, 0);
          else if (el.scrollIntoView) el.scrollIntoView({ block: 'center' });
        } catch (x) {}
      }, 0);
    }
    return html;
  };

  /* rendered without the sidebar and top bar; nothing on it reads a persona */
  CBP.pages.review.fullbleed = true;

  /* ---- listeners (once). No acts: typed text is kept in ui without a
     render, and a submit only records what was typed before actions.js runs. */
  function bag(token) {
    var ui = CBP.state.ui;
    ui.rvDraft = ui.rvDraft || {};
    ui.rvDraft[token] = ui.rvDraft[token] || { name: '', email: '', body: '' };
    return ui.rvDraft[token];
  }
  function v(id) { var el = document.getElementById(id); return el ? el.value : ''; }

  document.addEventListener('click', function (ev) {
    var f = ev.target.closest ? ev.target.closest('[data-rvfocus]') : null;
    if (f) {
      var el = document.getElementById(f.getAttribute('data-rvfocus'));
      if (el) { ev.preventDefault(); el.focus(); }
      return;
    }
    var t = ev.target.closest ? ev.target.closest('[data-act="review-comment"]') : null;
    if (!t) return;
    var token = t.getAttribute('data-token');
    var b = bag(token);
    focusNext = 'yes';
    if (t.getAttribute('data-again')) {
      b.body = '';                      /* name and e-mail carry over */
      return;
    }
    b.name = v('rvName'); b.email = v('rvEmail'); b.body = v('rvBody');
    /* after actions.js: a sent comment empties the box for the next one */
    setTimeout(function () {
      var ui = CBP.state.ui;
      if (ui.reviewSent && ui.reviewSent[token]) bag(token).body = '';
    }, 0);
  }, true);

  document.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!t || CBP.state.ui.route !== 'review') return;
    var key = { rvName: 'name', rvEmail: 'email', rvBody: 'body' }[t.id];
    if (!key || !CBP.state.ui.param) return;
    bag(CBP.state.ui.param)[key] = t.value;
  });

})();
