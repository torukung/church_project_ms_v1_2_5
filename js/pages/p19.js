/* pages/p19.js — P19 document print view, route #/doc/<docId> (v1.2.7, R-1a).
   Fullbleed (no sidebar, no top bar): an A4-ish sheet rendered from the stored
   document model through CBP.docgen.toHtml (the same renderer the public
   review page uses), with a toolbar that print.css hides under @media print:
   ← Back · hint · Save as PDF (dev-doc-pdf → window.print()) · Download .docx
   (dev-doc-docx). Markup per docs/RESEARCH_v1.2.7_review.md; styles in
   css/print.css, which re-points the tone tokens to ink-on-white when printing.

   Reading is not gated by persona: anyone who reached the id can view it (the
   id is only ever shown on the record to people who can open the record). */
(function () {
  'use strict';
  var D = CBP.D, e = CBP.ui.esc;
  CBP.pages = CBP.pages || {};

  function empty(title, lines, backHref) {
    return '<div class="dc-page"><div class="dc-bar">' +
      '<a class="btn sm" href="' + e(backHref || '#/projects') + '">← Back</a></div>' +
      '<article class="dc-sheet dc-empty" aria-label="Document preview">' +
      '<header class="dc-head"><p class="dc-kind">Document</p>' +
      '<h1 class="dc-title">' + e(title) + '</h1></header>' +
      lines.map(function (l) { return '<p>' + e(l) + '</p>'; }).join('') +
      '</article></div>';
  }

  CBP.pages.doc = function (state) {
    var id = state.ui.param;
    if (!id) {
      return empty('No document selected',
        ['Open a project record, generate a document on its Development tab, then press Open (print / PDF) on the document row.',
         'The address for a document is #/doc/<document id>.']);
    }
    var hit = D.devDocById(id);
    if (!hit || !hit.doc || !hit.doc.model) {
      return empty('Document not found',
        ['No generated document carries the id “' + id + '”. It may have been generated in another session or the id was mistyped.',
         'Open the project record and generate it again from the Development tab.']);
    }
    var p = hit.p, doc = hit.doc;
    var model = doc.model;
    var back = p ? '#/project/' + p.id : '#/projects';
    var stage = D.devStageLabel(hit.stageKey);
    var note = state.ui.notice ? '<div class="hintbar dc-notice">' + e(state.ui.notice) + '</div>' : '';

    return '<div class="dc-page">' +
      '<div class="dc-bar" role="toolbar" aria-label="Document actions">' +
        '<a class="btn sm" href="' + e(back) + '" title="Back to the project record">← Back</a>' +
        '<span class="dc-hint">' + (p ? '<b>' + e(p.id) + '</b> · ' + e(stage) + ' · ' : '') +
          'To save a PDF, press <b>Save as PDF</b> and pick “Save as PDF” as the printer.</span>' +
        '<button class="btn sm brass" type="button" data-act="dev-doc-pdf" data-doc="' + e(doc.id) + '">Save as PDF</button>' +
        '<button class="btn sm" type="button" data-act="dev-doc-docx" data-doc="' + e(doc.id) + '">Download .docx</button>' +
      '</div>' + note +
      '<article class="dc-sheet" aria-label="Document preview" data-doc="' + e(doc.id) + '">' +
        CBP.docgen.toHtml(model, { top: 1 }) +
      '</article>' +
      '<p class="dc-meta no-print">Generated ' + e(D.fmtDateY(doc.at)) + ' by ' + e(CBP.userName(doc.by)) +
        ' · document id ' + e(doc.id) + '</p>' +
    '</div>';
  };

  /* rendered without the sidebar and top bar; the sheet is the page */
  CBP.pages.doc.fullbleed = true;

})();
