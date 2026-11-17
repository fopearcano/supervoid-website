/*
 * HTML for the side panels: search results, a work's record, the catalogue
 * table, the voyage card and the hover tooltip.
 */
(function (S) {
  'use strict';

  var esc = S.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  function fold(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[‘’]/g, "'").toLowerCase();
  }

  S.yearText = function (w) {
    return (w.circa ? 'c. ' : '') + w.year + (w.year < 1000 ? ' CE' : '');
  };

  // ---- Search ---------------------------------------------------------------

  var index = S.works.map(function (w) {
    var sector = S.sectorById[w.sector];
    return {
      w: w,
      title: fold(w.title),
      author: fold(w.author),
      tags: fold(w.tags.join(' | ')),
      all: fold([w.title, w.author, w.tags.join(' '), sector.name, w.year, w.lang || '', w.form].join(' '))
    };
  });

  S.searchWorks = function (query, limit) {
    var q = fold(query.trim());
    if (!q) return [];
    var tokens = q.split(/\s+/);
    var hits = [];
    index.forEach(function (it) {
      for (var i = 0; i < tokens.length; i++) if (it.all.indexOf(tokens[i]) < 0) return;
      var score = 0;
      if (it.title.indexOf(q) === 0 || it.title.indexOf('the ' + q) === 0) score += 100;
      else if (it.title.indexOf(q) >= 0) score += 60;
      if (it.author.indexOf(q) >= 0) score += 45;
      if (it.tags.indexOf(q) >= 0) score += 25;
      score += it.w.importance;
      hits.push({ w: it.w, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score || a.w.year - b.w.year; });
    return hits.slice(0, limit || 8).map(function (h) { return h.w; });
  };

  S.renderResults = function (works, query) {
    if (!works.length) {
      return '<li class="empty" role="option" aria-disabled="true">No works match “' + esc(query) + '”.</li>';
    }
    return works.map(function (w, i) {
      return '<li role="option" id="opt-' + w.id + '" data-id="' + w.id + '" aria-selected="' + (i === 0) + '" class="sec-' + w.sector + '">' +
        '<span class="dot"></span><span class="r-title">' + esc(w.title) + '</span>' +
        '<span class="r-year">' + esc(S.yearText(w)) + '</span>' +
        '<span class="r-meta">' + esc(w.author) + ' · ' + esc(S.sectorById[w.sector].short) + '</span></li>';
    }).join('');
  };

  // ---- Record -----------------------------------------------------------------

  function workList(ids, sameAuthor) {
    var works = ids.map(function (id) { return S.byId[id]; }).sort(function (a, b) { return a.year - b.year; });
    return '<ul class="d-list' + (sameAuthor ? ' same-author' : '') + '">' + works.map(function (w) {
      return '<li><button type="button" data-goto="' + w.id + '" class="sec-' + w.sector + '"><span class="dot"></span>' +
        '<span><span class="t">' + esc(w.title) + '</span> <span class="by">' + esc(w.author) + '</span></span>' +
        '<span class="yr">' + esc(S.yearText(w)) + '</span></button></li>';
    }).join('') + '</ul>';
  }

  function bearing(w) {
    var p = S.geo.galaxy.pos[w.id];
    var deg = Math.atan2(p.y, p.x) * 180 / Math.PI + 90;
    return Math.round((deg + 360) % 360);
  }

  S.renderDetail = function (w, opts) {
    var sector = S.sectorById[w.sector];
    var form = w.form + (w.lang ? ', translated from ' + w.lang : '');
    var others = (S.authors[w.author] || []).filter(function (id) { return id !== w.id; });
    var up = S.lineage(w.id, 'up').length;
    var down = S.lineage(w.id, 'down').length;
    var q = encodeURIComponent(w.title + ' ' + w.author.replace(/\s*\(editor\)/, ''));
    var html = '';
    html += '<button type="button" class="d-close" data-act="close" aria-label="Close record">×</button>';
    html += '<div class="d-eyebrow"><span class="sec sec-' + w.sector + '"><span class="dot"></span>' + esc(sector.short) + '</span>' +
      '<span>' + esc(w.era.name) + '</span></div>';
    html += '<h2 class="d-title" id="detail-title">' + esc(w.title) + '</h2>';
    html += '<p class="d-byline">' + esc(w.author) + ' · <span class="yr">' + esc(S.yearText(w)) + '</span> · ' + esc(form) + '</p>';
    if (w.awards.length) {
      html += '<ul class="d-awards" aria-label="Awards">' + w.awards.map(function (a) {
        return '<li>' + esc(S.awardNames[a]) + '</li>';
      }).join('') + '</ul>';
    }
    html += '<p class="d-blurb">' + esc(w.blurb) + '</p>';
    if (w.note) html += '<p class="d-note">' + esc(w.note) + '</p>';
    if (w.tags.length) {
      html += '<ul class="d-tags" aria-label="Themes">' + w.tags.map(function (t) {
        return '<li><button type="button" data-tag="' + esc(t) + '">' + esc(t) + '</button></li>';
      }).join('') + '</ul>';
    }
    html += '<div class="d-section"><h3 class="d-h">Draws on</h3>' +
      (w.inf.length ? workList(w.inf) : '<p class="d-empty">No recorded ancestors in this atlas.</p>') + '</div>';
    html += '<div class="d-section"><h3 class="d-h">Echoed in</h3>' +
      (w.children.length ? workList(w.children) : '<p class="d-empty">No recorded descendants in this atlas yet.</p>') + '</div>';
    if (others.length) {
      html += '<div class="d-section"><h3 class="d-h">Also by ' + esc(w.author) + '</h3>' + workList(others, true) + '</div>';
    }
    html += '<div class="d-actions">';
    if (up + down > w.inf.length + w.children.length) {
      html += '<button type="button" class="btn" data-act="lineage" aria-pressed="' + !!opts.lineage + '">' +
        'Trace full lineage (' + up + ' up, ' + down + ' down)</button>';
    }
    html += '<a class="btn" href="https://en.wikipedia.org/w/index.php?search=' + q + '" target="_blank" rel="noopener">Wikipedia ↗</a>';
    html += '<a class="btn" href="https://openlibrary.org/search?q=' + q + '" target="_blank" rel="noopener">Open Library ↗</a>';
    html += '</div>';
    html += '<p class="d-cat">' + esc(w.catalogue) + ' · bearing ' + bearing(w) + '° · orbit ' + esc(S.yearText(w)) + '</p>';
    return html;
  };

  // ---- Catalogue ----------------------------------------------------------------

  var columns = [
    { key: 'year', label: 'Year' },
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'sector', label: 'Sector' },
    { key: 'awards', label: 'Awards' },
    { key: 'catalogue', label: 'Cat. no.' }
  ];

  function sortValue(w, key) {
    if (key === 'sector') return S.sectorById[w.sector].index;
    if (key === 'awards') return -w.awards.length;
    if (key === 'title') return w.title.replace(/^(The|A|An)\s+/, '').replace(/^[“”"—]+/, '');
    if (key === 'author') {
      var parts = w.author.replace(/\s*\(editor\)/, '').split(' and ')[0].split(' ');
      return parts[parts.length - 1] + ' ' + parts.join(' ');
    }
    return w[key];
  }

  S.renderCatalogue = function (works, sort, total, selected) {
    var dir = sort.dir === 'desc' ? -1 : 1;
    var rows = works.slice().sort(function (a, b) {
      var va = sortValue(a, sort.key);
      var vb = sortValue(b, sort.key);
      var c = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
      return c * dir || a.year - b.year;
    });
    var html = '<div class="cat-inner"><p class="cat-summary">Showing <strong>' + works.length + '</strong> of ' + total +
      ' works. The sector, year and award filters in the key apply here too.</p>';
    html += '<div class="cat-scroll"><table class="cat-table"><thead><tr>';
    columns.forEach(function (c) {
      var active = c.key === sort.key;
      html += '<th scope="col" class="c-' + c.key + '"><button type="button" data-sort="' + c.key + '"' +
        (active ? ' aria-sort="' + (sort.dir === 'desc' ? 'descending' : 'ascending') + '"' : '') + '>' +
        c.label + (active ? (sort.dir === 'desc' ? ' ↓' : ' ↑') : '') + '</button></th>';
    });
    html += '</tr></thead><tbody>';
    rows.forEach(function (w) {
      html += '<tr data-id="' + w.id + '" tabindex="0"' + (w.id === selected ? ' class="sel"' : '') + '>' +
        '<td class="c-year">' + esc(S.yearText(w)) + '</td>' +
        '<td class="c-title">' + esc(w.title) + '</td>' +
        '<td class="c-author">' + esc(w.author) + '</td>' +
        '<td class="c-sector sec-' + w.sector + '"><span class="dot"></span>' + esc(S.sectorById[w.sector].short) + '</td>' +
        '<td class="c-awards">' + esc(w.awards.join(', ')) + '</td>' +
        '<td class="c-cat">' + esc(w.catalogue) + '</td></tr>';
    });
    html += '</tbody></table></div></div>';
    return html;
  };

  // ---- Voyage card & tooltip ----------------------------------------------------

  S.renderTourCard = function (tour, i) {
    var step = tour.steps[i];
    var w = S.byId[step.id];
    var html = '<div class="tc-head"><span>Voyage · <strong>' + esc(tour.name) + '</strong></span>' +
      '<span>' + (i + 1) + ' / ' + tour.steps.length + '</span></div>';
    html += '<h2 class="tc-title">' + esc(w.title) + ' <span class="by">' + esc(w.author) + ', ' + esc(S.yearText(w)) + '</span></h2>';
    html += '<p class="tc-note">' + esc(step.note || w.blurb) + '</p>';
    html += '<div class="tc-nav"><div class="tc-progress" aria-hidden="true">' + tour.steps.map(function (_, j) {
      return '<span' + (j <= i ? ' class="on"' : '') + '></span>';
    }).join('') + '</div><span class="spacer"></span>';
    html += '<button type="button" class="btn" data-tour="prev"' + (i === 0 ? ' disabled' : '') + '>Back</button>';
    html += '<button type="button" class="btn" data-tour="open">Record</button>';
    html += i < tour.steps.length - 1
      ? '<button type="button" class="btn" data-tour="next" aria-pressed="true">Next star</button>'
      : '<button type="button" class="btn" data-tour="end" aria-pressed="true">Finish</button>';
    html += '<button type="button" class="btn" data-tour="end" aria-label="Leave the voyage">×</button></div>';
    return html;
  };

  S.renderTooltip = function (w) {
    return '<div class="tt-title">' + esc(w.title) + '</div><div class="tt-meta">' + esc(w.author) + ' · ' + esc(S.yearText(w)) +
      (w.awards.length ? ' · ' + esc(w.awards.join(', ')) : '') + '</div>';
  };
})(window.SFMAP);
