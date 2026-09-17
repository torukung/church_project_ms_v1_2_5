/* docgen.js — v1.2.7 (Lane A). One document model feeds a real .docx (zip of
   OOXML, STORED, no library) and the print view (#/doc/<id>, R-1 / R-1a).

   Loads after derive.js and before actions.js. Pure: no DOM except inside
   download() (guarded), no Date.now / Math.random — every stamp comes from
   model.generated_at (= CONFIG.TODAY when built) and a fixed DOS date, so the
   same model gives byte-identical bytes (brief §0, RESEARCH_v1.2.7_docx.md).

   Surface (CBP.docgen):
     KINDS, KIND_LABEL
     draftSections(p, dev)          → the 9 R-7 concept pre-draft sections
     build(kind, p, dev)            → document model (kind concept|orgpack|areapack)
     toHtml(model, {top})           → print markup (.dc-* classes, print.css)
     toDocx(model)                  → Uint8Array (the .docx bytes)
     download(model | bytes, title) → Blob + <a download>; false when headless
     sanitize(html) · htmlToBlocks(html) · blocksToPlain(blocks) · plainToHtml(text)
     internals: zip, crc32, utf8, b64bytes, dataUrl, imgSize, esc

   Model (brief §2 + research): { id, kind, title, subtitle, kindLabel, meta:[[k,v]],
   generated_at:'YYYY-MM-DD', by, sections:[{ key, heading, blocks:[ {t:'p',text|runs}
   | {t:'h3',text} | {t:'ul',items:[string|runs]} | {t:'kv',rows:[[k,v]]} | {t:'img',data,caption} ] }] } */
(function (root) {
  'use strict';
  var CBP = root.CBP = root.CBP || {};
  var G = CBP.docgen = {};

  function CFG() { return CBP.CONFIG || {}; }
  function D() { return CBP.D || {}; }
  function S() { return CBP.state || null; }

  /* ================================================================ text == */

  function utf8(s) {                       /* string -> Uint8Array (UTF-8) */
    var out = [], i, c, c2;
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c >= 0xD800 && c <= 0xDBFF && i + 1 < s.length) {
        c2 = s.charCodeAt(i + 1);
        if (c2 >= 0xDC00 && c2 <= 0xDFFF) { c = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00); i++; }
      }
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xC0 | c >> 6, 0x80 | c & 63);
      else if (c < 0x10000) out.push(0xE0 | c >> 12, 0x80 | c >> 6 & 63, 0x80 | c & 63);
      else out.push(0xF0 | c >> 18, 0x80 | c >> 12 & 63, 0x80 | c >> 6 & 63, 0x80 | c & 63);
    }
    return new Uint8Array(out);
  }
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function b64bytes(b64) {                 /* no atob dependency: works in Node and browser */
    var clean = String(b64 || '').replace(/[^A-Za-z0-9+\/]/g, ''), n = clean.length;
    var out = new Uint8Array(Math.floor(n * 3 / 4)), o = 0, bits = 0, acc = 0, i;
    for (i = 0; i < n; i++) {
      acc = ((acc << 6) | B64.indexOf(clean.charAt(i))) & 0xFFFFFF; bits += 6;
      if (bits >= 8) { bits -= 8; out[o++] = (acc >> bits) & 255; }
    }
    return out.subarray(0, o);
  }
  function dataUrl(u) {                    /* -> {mime, ext, bytes} or null (PNG/JPEG only) */
    var m = /^data:(image\/(png|jpeg|jpg));base64,(.*)$/i.exec(u || '');
    if (!m) return null;
    var ext = m[2].toLowerCase() === 'png' ? 'png' : 'jpeg';
    return { mime: 'image/' + ext, ext: ext, bytes: b64bytes(m[3]) };
  }
  function imgSize(img) {                  /* PNG IHDR / JPEG SOFn -> {w,h} or null */
    var b = img.bytes, i, len, mk;
    if (img.ext === 'png' && b.length > 24 && b[12] === 0x49 && b[13] === 0x48)
      return { w: (b[16] << 24 | b[17] << 16 | b[18] << 8 | b[19]) >>> 0,
               h: (b[20] << 24 | b[21] << 16 | b[22] << 8 | b[23]) >>> 0 };
    if (img.ext === 'jpeg' && b[0] === 0xFF && b[1] === 0xD8) {
      i = 2;
      while (i + 9 < b.length) {
        if (b[i] !== 0xFF) { i++; continue; }
        mk = b[i + 1];
        if (mk === 0xD8 || mk === 0x01 || (mk >= 0xD0 && mk <= 0xD7) || mk === 0xFF) { i += (mk === 0xFF ? 1 : 2); continue; }
        len = b[i + 2] << 8 | b[i + 3];
        if (mk >= 0xC0 && mk <= 0xCF && mk !== 0xC4 && mk !== 0xC8 && mk !== 0xCC)
          return { h: b[i + 5] << 8 | b[i + 6], w: b[i + 7] << 8 | b[i + 8] };
        i += 2 + len;
      }
    }
    return null;
  }

  /* ================================================================ zip === */

  var CRC = (function () {
    var t = [], c, n, k;
    for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(b) {
    var c = 0xFFFFFFFF, i;
    for (i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  /* fixed DOS stamp 2026-08-28 00:00:00 (brief §6) */
  var DOS_TIME = 0, DOS_DATE = ((2026 - 1980) << 9) | (8 << 5) | 28;
  function zip(files) {                    /* files: [{name, data:Uint8Array}] in fixed order; STORED */
    var parts = [], central = [], off = 0, total, i;
    function u16(a, v) { a.push(v & 255, v >>> 8 & 255); }
    function u32(a, v) { a.push(v & 255, v >>> 8 & 255, v >>> 16 & 255, v >>> 24 & 255); }
    for (i = 0; i < files.length; i++) {
      var f = files[i], nm = utf8(f.name), crc = crc32(f.data), sz = f.data.length, h = [];
      u32(h, 0x04034b50); u16(h, 20); u16(h, 0x0800); u16(h, 0); u16(h, DOS_TIME); u16(h, DOS_DATE);
      u32(h, crc); u32(h, sz); u32(h, sz); u16(h, nm.length); u16(h, 0);
      parts.push(new Uint8Array(h), nm, f.data);
      var c = [];
      u32(c, 0x02014b50); u16(c, 20); u16(c, 20); u16(c, 0x0800); u16(c, 0); u16(c, DOS_TIME); u16(c, DOS_DATE);
      u32(c, crc); u32(c, sz); u32(c, sz); u16(c, nm.length); u16(c, 0); u16(c, 0); u16(c, 0); u16(c, 0);
      u32(c, 0); u32(c, off);
      central.push(new Uint8Array(c), nm);
      off += h.length + nm.length + sz;
    }
    var cdSize = 0; for (i = 0; i < central.length; i++) cdSize += central[i].length;
    var e = []; u32(e, 0x06054b50); u16(e, 0); u16(e, 0); u16(e, files.length); u16(e, files.length);
    u32(e, cdSize); u32(e, off); u16(e, 0);
    var all = parts.concat(central, [new Uint8Array(e)]);
    total = 0; for (i = 0; i < all.length; i++) total += all[i].length;
    var out = new Uint8Array(total), p = 0;
    for (i = 0; i < all.length; i++) { out.set(all[i], p); p += all[i].length; }
    return out;
  }

  /* =========================================================== sanitizer == */
  /* RESEARCH_v1.2.7_editor.md EDK pure part — whitelist p/h3/strong/em/ul/ol/
     li/br, no attributes survive, output balanced and idempotent. */

  var KEEP = { p: 'p', h3: 'h3', strong: 'strong', em: 'em', b: 'strong', i: 'em', ul: 'ul', ol: 'ol', li: 'li', br: 'br',
               div: 'p', h1: 'h3', h2: 'h3', h4: 'h3', h5: 'h3', h6: 'h3' };
  var BLOCK = { p: 1, h3: 1, ul: 1, ol: 1, li: 1 };
  var ENT = { amp: 1, lt: 1, gt: 1, quot: 1, apos: 1, nbsp: 1, '#39': 1 };
  function escText(t) {
    return t.replace(/&(?!(?:[a-z]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});)/gi, '&amp;')
            .replace(/&([a-z]+);/gi, function (m, n) { return ENT[n.toLowerCase()] ? m : '&amp;' + n + ';'; })
            .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function sanitize(html) {
    var s = String(html == null ? '' : html);
    s = s.replace(/<!--[\s\S]*?(-->|$)/g, '')
         .replace(/<(script|style|template|iframe|object|embed|noscript|svg|math|textarea|title|xmp)\b[\s\S]*?(<\/\1\s*>|$)/gi, '')
         .replace(/<![\s\S]*?>|<\?[\s\S]*?>/g, '');
    var TAG = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^\s>"'=\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g;
    var out = [], stack = [], last = 0, m, name, i;
    function text(t) { if (t) out.push(escText(t)); }
    while ((m = TAG.exec(s))) {
      text(s.slice(last, m.index)); last = TAG.lastIndex;
      name = KEEP[m[2].toLowerCase()];
      if (!name) continue;
      if (name === 'br') { out.push('<br>'); continue; }
      if (!m[1]) {
        if (BLOCK[name] && name !== 'li') {
          while (stack.length && !/^(ul|ol|li)$/.test(stack[stack.length - 1])) out.push('</' + stack.pop() + '>');
        }
        if (name === 'li') {
          if (stack.indexOf('ul') < 0 && stack.indexOf('ol') < 0) { out.push('<ul>'); stack.push('ul'); }
          while (!/^(ul|ol)$/.test(stack[stack.length - 1])) out.push('</' + stack.pop() + '>');
        }
        out.push('<' + name + '>'); stack.push(name);
      } else {
        i = stack.lastIndexOf(name);
        if (i < 0) continue;
        while (stack.length > i) out.push('</' + stack.pop() + '>');
      }
    }
    text(s.slice(last).replace(/</g, '&lt;'));
    while (stack.length) out.push('</' + stack.pop() + '>');
    return out.join('').replace(/<(strong|em|p|h3)><\/\1>/g, '');
  }
  function decode(t) {
    return t.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
            .replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(+n); })
            .replace(/&amp;/g, '&');
  }
  /* sanitized html -> model blocks [{t:'p',runs}|{t:'h3',text}|{t:'ul',items:[runs]}] */
  function htmlToBlocks(html) {
    var s = sanitize(html), TAG = /<(\/?)(p|h3|strong|em|ul|ol|li|br)>/g, blocks = [], m, last = 0;
    var cur = null, list = null, b = 0, it = 0;
    function flush() {
      if (!cur) return;
      var runs = cur.runs.filter(function (r) { return r.text.replace(/\s+/g, '') !== ''; });
      if (runs.length) {
        if (cur.t === 'h3') blocks.push({ t: 'h3', text: runs.map(function (r) { return r.text; }).join('').replace(/\s+/g, ' ').trim() });
        else if (cur.t === 'li') { if (list) list.items.push(runs); else blocks.push({ t: 'p', runs: runs }); }
        else blocks.push({ t: 'p', runs: runs });
      }
      cur = null;
    }
    function add(t) {
      if (!t) return;
      t = decode(t).replace(/\s+/g, ' ');
      if (!cur) { if (list && !t.trim()) return; cur = { t: list ? 'li' : 'p', runs: [] }; }
      var prev = cur.runs[cur.runs.length - 1];
      if (prev && !!prev.b === b > 0 && !!prev.i === it > 0) prev.text += t;
      else cur.runs.push(b || it ? { text: t, b: b > 0, i: it > 0 } : { text: t });
    }
    while ((m = TAG.exec(s))) {
      add(s.slice(last, m.index)); last = TAG.lastIndex;
      var close = !!m[1], n = m[2];
      if (n === 'strong') b += close ? -1 : 1;
      else if (n === 'em') it += close ? -1 : 1;
      else if (n === 'br') { var keep = cur && cur.t; flush(); if (keep === 'li') cur = { t: 'li', runs: [] }; }
      else if (n === 'ul' || n === 'ol') { flush(); if (close) { if (list && list.items.length) blocks.push(list); list = null; }
                                          else list = { t: 'ul', items: [], ordered: n === 'ol' }; }
      else if (close) flush();
      else { flush(); cur = { t: n === 'li' ? 'li' : n, runs: [] }; }
    }
    add(s.slice(last)); flush();
    if (list && list.items.length) blocks.push(list);
    blocks.forEach(function (x) { if (x.runs) { x.runs[0].text = x.runs[0].text.replace(/^\s+/, ''); var r = x.runs[x.runs.length - 1]; r.text = r.text.replace(/\s+$/, ''); } });
    return blocks;
  }
  function runsText(x) {
    if (typeof x === 'string') return x;
    return (x || []).map(function (y) { return y.text; }).join('');
  }
  function blocksToPlain(blocks) {         /* for D.devFront brief lines */
    return (blocks || []).map(function (x) {
      if (x.t === 'h3') return x.text;
      if (x.t === 'ul') return x.items.map(function (r) { return '• ' + runsText(r); }).join('\n');
      if (x.t === 'kv') return x.rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');
      if (x.t === 'img') return x.caption || '';
      return x.runs ? runsText(x.runs) : (x.text || '');
    }).join('\n');
  }
  function plainToHtml(t) {                /* generated text -> safe html */
    return String(t || '').split(/\n{2,}/).map(function (para) {
      return '<p>' + para.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }
  /* an array of lines -> one <ul> */
  function listHtml(items) {
    return '<ul>' + items.map(function (t) {
      return '<li>' + String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</li>';
    }).join('') + '</ul>';
  }

  /* ============================================================= content == */

  G.KINDS = ['concept', 'orgpack', 'areapack'];
  G.KIND_LABEL = {
    concept:  'Project Concept Draft',
    orgpack:  'Organisation Background Check — Project Information Pack',
    areapack: 'Area Humane Society Communication — Project Information Pack'
  };
  G.KIND_OF_STAGE = { concept: 'concept', orgcheck: 'orgpack', areacomm: 'areapack' };

  /* the 9 R-7 sections, in order */
  G.SECTIONS = [
    { key: 'summary',       title: 'Title & summary' },
    { key: 'background',    title: 'Background & need' },
    { key: 'objectives',    title: 'Objectives' },
    { key: 'activities',    title: 'Key activities' },
    { key: 'beneficiaries', title: 'Beneficiaries & location' },
    { key: 'partner',       title: 'Implementing partner' },
    { key: 'budget',        title: 'Budget summary' },
    { key: 'timeline',      title: 'Timeline' },
    { key: 'risks',         title: 'Risks & assumptions' }
  ];

  function countryName(code) {
    var st = S();
    var c = st ? st.countries.filter(function (x) { return x.code === code; })[0] : null;
    return c ? c.name : (code || '');
  }
  function userName(id) { return CBP.userName ? CBP.userName(id) : (id || 'unassigned'); }
  function money(n) { return D().money ? D().money(n) : ('$' + n); }
  function fmt(iso) { return (iso && D().fmtDateY) ? D().fmtDateY(iso) : (iso || '—'); }
  function stageOf(dev, key) { return (dev && dev.stages && dev.stages[key]) || {}; }
  function phases(p) {
    var ph = (D().phases ? D().phases(p) : (p.phases || [])) || [];
    return ph;
  }
  /* generated text per section — from the record + Assessment inputs */
  function generatedHtml(key, p, dev) {
    var a = stageOf(dev, 'assessment');
    var obs = (a.observations || []).map(function (o) { return o.text; }).filter(Boolean);
    var year = CFG().BUDGET_YEAR || '';
    switch (key) {
      case 'summary':
        return plainToHtml(p.name + ' (' + p.id + ') is a ' + (p.project_type ? p.project_type.toLowerCase() + ' ' : '') +
          'project proposed for ' + countryName(p.country) + (p.city ? ' (' + p.city + ')' : '') +
          ' in the ' + year + ' budget year, requesting ' + money(p.amount) + '.' +
          (p.description ? '\n\n' + p.description : ''));
      case 'background':
        return plainToHtml(obs.length
          ? 'The assessment recorded the following observations:'
          : 'No assessment observations have been recorded yet. Complete the Assessment stage to pre-fill this section.') +
          (obs.length ? listHtml(obs) : '') +
          (a.justification ? '<h3>Justification</h3>' + plainToHtml(a.justification) : '');
      case 'objectives':
        return listHtml([
          'Address the need identified in the assessment' + (p.strategic_priority ? ' under the ' + p.strategic_priority + ' priority' : '') + '.',
          'Deliver the planned activities within the ' + year + ' budget year and the country ceiling.',
          'Hand over to ' + (p.primary_implementer || 'the implementing partner') + ' with no continuing dependency on Church funds.'
        ]);
      case 'activities':
        var acts = phases(p).map(function (ph) { return ph.name || ph.label || ph.id; }).filter(Boolean);
        return acts.length ? listHtml(acts)
          : listHtml(['Mobilise the implementing partner and confirm the site.',
                      'Procure and deliver the planned inputs.',
                      'Monitor delivery and report to the Area office.']);
      case 'beneficiaries':
        return plainToHtml('Location: ' + countryName(p.country) + (p.city ? ', ' + p.city : '') + '.\n\n' +
          'Beneficiaries: to be confirmed from the assessment' + (obs.length ? ' (see Background & need)' : '') + '.');
      case 'partner':
        return plainToHtml('Implementing partner: ' + (p.primary_implementer || 'not yet named') + '.' +
          (p.classification ? '\n\nClassification: ' + p.classification + '.' : ''));
      case 'budget':
        /* v1.2.7 F1 (ToR) — outbound documents carry only this project's own
           request and budget year; the country ceiling / committed / available
           triple stays internal (P3 front view, D.devFront). */
        return listHtml([
          'Requested: ' + money(p.amount),
          'Budget year: ' + year
        ]);
      case 'timeline':
        var ph2 = phases(p);
        return ph2.length
          ? listHtml(ph2.map(function (ph) { return (ph.name || ph.label || ph.id) + ': ' + fmt(ph.start) + ' → ' + fmt(ph.end); }))
          : plainToHtml('Planned window: ' + fmt(p.created_at || (year + '-01-01')) + ' → ' + fmt(p.target_date || (year + '-12-31')) + '.');
      case 'risks':
        return listHtml([
          'Partner capacity and procurement lead times.',
          'Access and seasonal constraints at the site.',
          'Assumes the requested ' + money(p.amount) + ' is confirmed for the ' + year + ' budget year at approval.'
        ]);
    }
    return '<p></p>';
  }

  /* the concept pre-draft: 9 sections {key,title,html,generated_html,edited} */
  G.draftSections = function (p, dev) {
    return G.SECTIONS.map(function (s) {
      var h = sanitize(generatedHtml(s.key, p, dev));
      return { key: s.key, title: s.title, html: h, generated_html: h, edited: false };
    });
  };

  function metaRows(p, dev) {
    var rows = [
      ['Project', p.id + ' · ' + p.name],
      ['Country', countryName(p.country) + (p.city ? ' · ' + p.city : '')],
      ['Requested', money(p.amount)],
      ['Owner', userName(p.owner) + (p.backup ? ' · backup ' + userName(p.backup) : '')],
      ['Status', 'In development' + (dev && dev.released ? ' · released ' + fmt(dev.released_at) : '')],
      ['Target date', fmt(p.target_date)]
    ];
    if (p.primary_implementer) rows.push(['Implementing partner', p.primary_implementer]);
    return rows;
  }

  function appendixImages(dev) {
    var a = stageOf(dev, 'assessment');
    return (a.images || []).map(function (im) {
      return { t: 'img', data: im.data, caption: im.caption || im.name || '' };
    });
  }

  /* v1.2.7 F1 — defensive scrub for drafts saved before the ruling: drop the
     internal country figures from Budget summary and reword the old Risks line. */
  var INTERNAL_BUDGET = /^(Country ceiling \(|Committed by other projects:|Available before this request:)/;
  var OLD_RISK = /^Assumes the country ceiling leaves (.+) available at approval\.$/;
  function itemText(it) { return typeof it === 'string' ? it : (it || []).map(function (r) { return r.text; }).join(''); }
  function scrubBlocks(key, blocks, year) {
    if (key !== 'budget' && key !== 'risks') return blocks;
    year = year || CFG().BUDGET_YEAR || '';
    return (blocks || []).map(function (b) {
      if (b.t !== 'ul') return b;
      var items = [], dropped = false;
      b.items.forEach(function (it) {
        var t = itemText(it), m = OLD_RISK.exec(t);
        if (key === 'budget' && INTERNAL_BUDGET.test(t)) { dropped = true; return; }
        if (key === 'risks' && m) { items.push([{ text: 'Assumes the requested ' + m[1] + ' is confirmed for the ' + year + ' budget year at approval.' }]); return; }
        items.push(it);
      });
      if (dropped && !items.some(function (it) { return /^Budget year:/.test(itemText(it)); })) items.push([{ text: 'Budget year: ' + year }]);
      return { t: 'ul', items: items, ordered: b.ordered };
    });
  }
  /* applied to every model on its way out (toHtml / toDocx), so a stored doc
     snapshot from before F1 never shows the internal figures either */
  G.outbound = function (m) {
    if (!m || !m.sections) return m;
    var out = {}; Object.keys(m).forEach(function (k) { out[k] = m[k]; });
    out.sections = m.sections.map(function (s) {
      return { key: s.key, heading: s.heading, blocks: scrubBlocks(s.key, s.blocks) };
    });
    return out;
  };

  /* build(kind, p, dev) → model. `id`/`by` are filled by the act that stores it. */
  G.build = function (kind, p, dev) {
    if (G.KINDS.indexOf(kind) === -1) throw new Error('docgen.build: unknown kind ' + kind);
    dev = dev || (D().devOf ? D().devOf(p) : { stages: {} });
    var today = CFG().TODAY || '';
    var sections = [];
    var c = stageOf(dev, 'concept');
    var draft = (c.draft && c.draft.sections && c.draft.sections.length) ? c.draft.sections : G.draftSections(p, dev);

    if (kind === 'concept') {
      draft.forEach(function (s) {
        sections.push({ key: s.key, heading: s.title, blocks: scrubBlocks(s.key, htmlToBlocks(s.html)) });
      });
    } else {
      var sec = function (k) { return draft.filter(function (s) { return s.key === k; })[0]; };
      sections.push({ key: 'purpose', heading: 'Purpose of this pack', blocks: [
        { t: 'p', text: kind === 'orgpack'
          ? 'Information pack for the organisation background check of the implementing partner, prepared for HQ review.'
          : 'Information pack for the Area Humane Society communication, prepared for the Area office.' }
      ] });
      sections.push({ key: 'record', heading: 'Project record', blocks: [{ t: 'kv', rows: [
        ['Project id', p.id], ['Name', p.name], ['Country', countryName(p.country)],
        ['Requested', money(p.amount)], ['Owner', userName(p.owner)],
        ['Implementing partner', p.primary_implementer || 'not yet named'],
        ['Strategic priority', p.strategic_priority || '—'], ['Classification', p.classification || '—'],
        ['Target date', fmt(p.target_date)]
      ] }] });
      var sum = sec('summary'), bg = sec('background');
      if (sum) sections.push({ key: 'summary', heading: 'Summary', blocks: htmlToBlocks(sum.html) });
      if (bg) sections.push({ key: 'background', heading: 'Assessment findings', blocks: htmlToBlocks(bg.html) });
      if (kind === 'orgpack') {
        sections.push({ key: 'partner', heading: 'Implementing partner', blocks: htmlToBlocks((sec('partner') || {}).html || '') });
        sections.push({ key: 'checks', heading: 'Checks requested', blocks: [{ t: 'ul', items: [
          'Legal registration and governance of the partner',
          'Sanctions and due-diligence screening',
          'Track record with comparable projects',
          'Financial controls and reporting capacity'
        ] }] });
      } else {
        sections.push({ key: 'activities', heading: 'Planned activities', blocks: htmlToBlocks((sec('activities') || {}).html || '') });
        sections.push({ key: 'coordination', heading: 'Coordination with the Area Humane Society', blocks: [{ t: 'ul', items: [
          'Confirm no duplication with Society programmes in ' + countryName(p.country),
          'Agree the communication line for beneficiaries and local authorities',
          'Share the timeline and the point of contact (' + userName(p.owner) + ')'
        ] }] });
      }
      sections.push({ key: 'budget', heading: 'Budget summary', blocks: scrubBlocks('budget', htmlToBlocks((sec('budget') || {}).html || '')) });
      sections.push({ key: 'stages', heading: 'Development stages', blocks: [{ t: 'kv', rows:
        (CFG().DEV_STAGES || []).map(function (st) {
          var sg = stageOf(dev, st.key);
          return [st.label, (CFG().DEV_STATUS || {})[sg.status] || 'Not started'];
        }) }] });
    }
    var imgs = appendixImages(dev);
    if (imgs.length) sections.push({ key: 'appendix', heading: 'Appendix — Assessment images', blocks: imgs });

    return {
      id: null, kind: kind,
      kindLabel: G.KIND_LABEL[kind],
      title: G.KIND_LABEL[kind] + ' — ' + p.name,
      subtitle: p.id + ' · ' + countryName(p.country) + ' · ' + money(p.amount),
      meta: metaRows(p, dev),
      generated_at: today, by: null,
      sections: sections
    };
  };

  /* ================================================================ html == */

  function e(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function hruns(x) {
    if (typeof x === 'string') return e(x);
    return (x || []).map(function (r) { var t = e(r.text); if (r.i) t = '<em>' + t + '</em>'; if (r.b) t = '<strong>' + t + '</strong>'; return t; }).join('');
  }
  function hkv(rows) {
    return '<table class="dc-kv"><tbody>' + rows.map(function (r) {
      return '<tr><th scope="row">' + e(r[0]) + '</th><td>' + e(r[1]) + '</td></tr>';
    }).join('') + '</tbody></table>';
  }
  /* shared by #/doc/<id> (p19, top:1) and #/review/<token> (p18, top:2) */
  G.toHtml = function (m, opt) {
    m = G.outbound(m);
    var h = (opt && opt.top) || 1, H = function (n) { return 'h' + Math.min(6, h + n); };
    var out = '<header class="dc-head"><p class="dc-kind">' + e(m.kindLabel || 'Document') + '</p>' +
      '<' + H(0) + ' class="dc-title">' + e(m.title) + '</' + H(0) + '>' + (m.subtitle ? '<p class="dc-sub">' + e(m.subtitle) + '</p>' : '') +
      (m.meta && m.meta.length ? hkv(m.meta) : '') + '</header>';
    (m.sections || []).forEach(function (s) {
      out += '<section class="dc-sec"><' + H(1) + '>' + e(s.heading) + '</' + H(1) + '>';
      (s.blocks || []).forEach(function (b) {
        if (b.t === 'p') out += '<p>' + hruns(b.runs || b.text) + '</p>';
        else if (b.t === 'h3') out += '<' + H(2) + ' class="dc-h3">' + e(b.text) + '</' + H(2) + '>';
        else if (b.t === 'ul') out += (b.ordered ? '<ol>' : '<ul>') + b.items.map(function (i) { return '<li>' + hruns(i) + '</li>'; }).join('') + (b.ordered ? '</ol>' : '</ul>');
        else if (b.t === 'kv') out += hkv(b.rows);
        else if (b.t === 'img' && /^data:image\/(png|jpeg);base64,/.test(b.data))
          out += '<figure class="dc-fig"><img src="' + e(b.data) + '" alt="' + e(b.caption || 'Assessment image') + '">' +
            (b.caption ? '<figcaption>' + e(b.caption) + '</figcaption>' : '') + '</figure>';
      });
      out += '</section>';
    });
    return out + '<footer class="dc-foot">Generated by the portal · ' + e(m.generatedLabel || fmt(m.generated_at)) +
      (m.by ? ' · ' + e(userName(m.by)) : '') + '</footer>';
  };

  /* ================================================================ docx == */

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  }
  var W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"';
  var XH = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  function run(t, b, i) {
    return '<w:r>' + (b || i ? '<w:rPr>' + (b ? '<w:b/>' : '') + (i ? '<w:i/>' : '') + '</w:rPr>' : '') +
      '<w:t xml:space="preserve">' + esc(t) + '</w:t></w:r>';
  }
  function runs(x) {
    if (typeof x === 'string') return run(x);
    var s = '', k; for (k = 0; k < x.length; k++) s += run(x[k].text, x[k].b, x[k].i); return s;
  }
  function para(style, x) {
    return '<w:p>' + (style ? '<w:pPr><w:pStyle w:val="' + style + '"/></w:pPr>' : '') + runs(x) + '</w:p>';
  }
  function kvTable(rows) {
    var s = '<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblBorders>' +
      '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>' +
      '<w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>' +
      '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/></w:tblBorders></w:tblPr>' +
      '<w:tblGrid><w:gridCol w:w="2600"/><w:gridCol w:w="6400"/></w:tblGrid>', r;
    for (r = 0; r < rows.length; r++)
      s += '<w:tr><w:tc><w:tcPr><w:tcW w:w="2600" w:type="dxa"/></w:tcPr>' + para(null, [{ text: String(rows[r][0]), b: true }]) +
        '</w:tc><w:tc><w:tcPr><w:tcW w:w="6400" w:type="dxa"/></w:tcPr>' + para(null, String(rows[r][1])) + '</w:tc></w:tr>';
    return s + '</w:tbl><w:p/>';
  }
  var EMU_IN = 914400, MAX_W = 5.5 * EMU_IN;
  function drawing(rid, n, name, sz) {
    var ar = sz && sz.w && sz.h ? sz.h / sz.w : 0.75;           /* fallback 4:3 */
    var px = sz && sz.w ? sz.w : 800, cx = Math.min(MAX_W, Math.round(px * 9525)); /* 96 dpi */
    var cy = Math.round(cx * ar);
    return '<w:p><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">' +
      '<wp:extent cx="' + cx + '" cy="' + cy + '"/><wp:docPr id="' + n + '" name="' + esc(name) + '"/>' +
      '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">' +
      '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
      '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
      '<pic:nvPicPr><pic:cNvPr id="' + n + '" name="' + esc(name) + '"/><pic:cNvPicPr/></pic:nvPicPr>' +
      '<pic:blipFill><a:blip r:embed="' + rid + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>' +
      '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm>' +
      '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic>' +
      '</wp:inline></w:drawing></w:r></w:p>';
  }
  function hs(id, name, sz, lvl) {
    return '<w:style w:type="paragraph" w:styleId="' + id + '"><w:name w:val="' + name + '"/><w:basedOn w:val="Normal"/>' +
      '<w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="80"/>' +
      (id === 'Title' ? '' : '<w:outlineLvl w:val="' + lvl + '"/>') + '</w:pPr><w:rPr><w:b/><w:sz w:val="' + sz + '"/></w:rPr></w:style>';
  }
  var STYLES = XH + '<w:styles ' + W + '>' +
    '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>' +
    '<w:sz w:val="22"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>' +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>' +
    hs('Title', 'Title', 40, 0) + hs('Heading1', 'heading 1', 32, 0) + hs('Heading2', 'heading 2', 26, 1) + hs('Heading3', 'heading 3', 23, 2) +
    '<w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/>' +
    '<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:ind w:left="360" w:hanging="360"/><w:spacing w:after="60"/></w:pPr></w:style>' +
    '<w:style w:type="paragraph" w:styleId="ListNumber"><w:name w:val="List Number"/><w:basedOn w:val="Normal"/>' +
    '<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr><w:ind w:left="360" w:hanging="360"/><w:spacing w:after="60"/></w:pPr></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Caption"><w:name w:val="caption"/><w:basedOn w:val="Normal"/><w:rPr><w:i/><w:sz w:val="18"/></w:rPr></w:style>' +
    '</w:styles>';
  /* research finding 1 — bullets need a numbering part */
  var NUMBERING = XH + '<w:numbering ' + W + '>' +
    '<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/>' +
    '<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/>' +
    '<w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>' +
    '<w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="singleLevel"/>' +
    '<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="decimal"/><w:lvlText w:val="%1."/><w:lvlJc w:val="left"/>' +
    '<w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum>' +
    '<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>' +
    '<w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num></w:numbering>';

  G.toDocx = function (model) {
    model = G.outbound(model);
    var body = '', media = [], rels = [], i, j, k, b, s;
    body += para('Title', model.title);
    if (model.subtitle) body += para(null, [{ text: model.subtitle, i: true }]);
    if (model.meta && model.meta.length) body += kvTable(model.meta);
    for (i = 0; i < model.sections.length; i++) {
      s = model.sections[i];
      body += para('Heading1', s.heading);
      for (j = 0; j < (s.blocks || []).length; j++) {
        b = s.blocks[j];
        if (b.t === 'p') body += para(null, b.runs || b.text || '');
        else if (b.t === 'h3') body += para('Heading3', b.text);
        else if (b.t === 'ul') for (k = 0; k < b.items.length; k++) body += para(b.ordered ? 'ListNumber' : 'ListBullet', b.items[k]);
        else if (b.t === 'kv') body += kvTable(b.rows);
        else if (b.t === 'img') {
          var img = dataUrl(b.data);
          if (!img) { body += para('Caption', '[image not embeddable] ' + (b.caption || '')); continue; }
          var n = media.length + 1, rid = 'rIdImg' + n, fn = 'image' + n + '.' + img.ext;
          media.push({ name: 'word/media/' + fn, data: img.bytes, ext: img.ext });
          rels.push('<Relationship Id="' + rid + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/' + fn + '"/>');
          body += drawing(rid, n, fn, imgSize(img));
          if (b.caption) body += para('Caption', b.caption);
        }
      }
    }
    body += para('Caption', 'Generated by the portal · ' + model.generated_at + (model.by ? ' · ' + userName(model.by) : ''));
    var doc = XH + '<w:document ' + W +
      ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"' +
      ' xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body>' + body +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>' +
      '</w:body></w:document>';
    var hasPng = false, hasJpg = false;
    for (i = 0; i < media.length; i++) { if (media[i].ext === 'png') hasPng = true; else hasJpg = true; }
    var stamp = String(model.generated_at || '2026-01-01').slice(0, 10) + 'T00:00:00Z';   /* from CONFIG.TODAY, never Date.now */
    var files = [
      { name: '[Content_Types].xml', data: utf8(XH + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        (hasPng ? '<Default Extension="png" ContentType="image/png"/>' : '') +
        (hasJpg ? '<Default Extension="jpeg" ContentType="image/jpeg"/>' : '') +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
        '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
        '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>' +
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
        '</Types>') },
      { name: '_rels/.rels', data: utf8(XH + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
        '</Relationships>') },
      { name: 'docProps/core.xml', data: utf8(XH + '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"' +
        ' xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
        '<dc:title>' + esc(model.title) + '</dc:title><dc:creator>' + esc(model.by ? userName(model.by) : 'portal') + '</dc:creator>' +
        '<dcterms:created xsi:type="dcterms:W3CDTF">' + stamp + '</dcterms:created>' +
        '<dcterms:modified xsi:type="dcterms:W3CDTF">' + stamp + '</dcterms:modified></cp:coreProperties>') },
      { name: 'word/document.xml', data: utf8(doc) },
      { name: 'word/styles.xml', data: utf8(STYLES) },
      { name: 'word/numbering.xml', data: utf8(NUMBERING) },
      { name: 'word/_rels/document.xml.rels', data: utf8(XH + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '<Relationship Id="rIdNum" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>' +
        rels.join('') + '</Relationships>') }
    ];
    return zip(files.concat(media));
  };

  /* ASCII-only: Chromium ignores a non-ASCII `download` name on an opaque
     (file://) origin and falls back to "download", so dashes are mapped and
     every other non-ASCII character dropped. */
  G.fileName = function (title) {
    var t = String(title || 'document')
      .replace(/[\u2012-\u2015\u2212]/g, '-')            /* figure/en/em/horizontal-bar/minus → - */
      .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '')
      .replace(/[^\x20-\x7E]/g, '')
      .replace(/[\\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, ' ').trim();
    return (t || 'document').slice(0, 120) + '.docx';
  };

  /* download(model | bytes, title?) → true when a download was triggered,
     false where Blob / document / createObjectURL are missing (headless). */
  G.download = function (modelOrBytes, title) {
    var bytes = modelOrBytes, name;
    if (modelOrBytes && !(modelOrBytes instanceof Uint8Array)) {
      bytes = G.toDocx(modelOrBytes);
      title = title || modelOrBytes.title;
    }
    name = G.fileName(title);
    if (typeof Blob === 'undefined' || typeof document === 'undefined' ||
        typeof document.createElement !== 'function' || !document.body) return false;
    var blob;
    try { blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }); }
    catch (err) { return false; }
    if (root.navigator && root.navigator.msSaveOrOpenBlob) { root.navigator.msSaveOrOpenBlob(blob, name); return true; }
    var URLx = root.URL || root.webkitURL; if (!URLx || !URLx.createObjectURL) return false;
    var url = URLx.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; a.style.display = 'none';
    document.body.appendChild(a); a.click();
    setTimeout(function () { try { document.body.removeChild(a); URLx.revokeObjectURL(url); } catch (err) {} }, 0);
    return true;
  };

  /* exposed helpers */
  G.sanitize = sanitize;
  G.htmlToBlocks = htmlToBlocks;
  G.blocksToPlain = blocksToPlain;
  G.plainToHtml = plainToHtml;
  G.zip = zip; G.crc32 = crc32; G.utf8 = utf8; G.b64bytes = b64bytes;
  G.dataUrl = dataUrl; G.imgSize = imgSize; G.esc = esc;
})(typeof window !== 'undefined' ? window : this);
