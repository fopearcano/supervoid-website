/*
 * Wires the chart and panels together and owns the UI state.
 */
(function (S) {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var app = $('app');
  var chart = S.createChart($('chart'), $('starfield'));
  var mobile = window.matchMedia('(max-width: 680px)');

  var ui = {
    view: 'galaxy',
    selected: null,
    lineage: false,
    sectorsOn: {},
    yearFrom: -Infinity,
    yearTo: Infinity,
    awardsOnly: false,
    tour: null,
    step: 0,
    sort: { key: 'year', dir: 'asc' },
    guideTab: 'themes',
    spotlight: null
  };
  S.sectors.forEach(function (s) { ui.sectorsOn[s.id] = true; });

  var minYear = Math.min.apply(null, S.works.map(function (w) { return w.year; }));
  var maxYear = Math.max.apply(null, S.works.map(function (w) { return w.year; }));

  $('tagline').textContent = S.works.length + ' works · ' + Object.keys(S.authors).length + ' authors · ' +
    S.yearText({ year: minYear, circa: true }) + ' to ' + maxYear;

  // ---- Insets: keep the chart centred in the space the panels leave free ------

  function updateInsets() {
    var small = mobile.matches;
    var detailOpen = !$('detail').hidden;
    var tourOpen = !$('tour-card').hidden;
    var spotOpen = !$('spotlight').hidden;
    var keyOpen = !app.classList.contains('key-closed');
    var H = app.clientHeight;
    chart.setInsets({
      top: small ? 140 : 70,
      left: !small && keyOpen ? $('key').offsetWidth + 24 : 0,
      right: !small && detailOpen ? $('detail').offsetWidth + 24 : 0,
      bottom: small && detailOpen ? H * 0.58 : tourOpen ? $('tour-card').offsetHeight + 24 :
        spotOpen ? $('spotlight').offsetHeight + 28 : 24
    });
    app.classList.toggle('has-detail', detailOpen);
  }

  // ---- Filters ----------------------------------------------------------------

  function passes(w) {
    return ui.sectorsOn[w.sector] && w.year >= ui.yearFrom && w.year <= ui.yearTo &&
      (!ui.awardsOnly || w.awards.length > 0) && (!ui.spotlight || ui.spotlight.ids[w.id]);
  }

  function filtersActive() {
    return ui.awardsOnly || ui.yearFrom > minYear || ui.yearTo < maxYear || !!ui.spotlight ||
      S.sectors.some(function (s) { return !ui.sectorsOn[s.id]; });
  }

  function applyFilters() {
    chart.setFilter(filtersActive() ? passes : null);
    renderSectorList();
    renderSpotlight();
    if (ui.view === 'catalogue') renderCatalogue();
  }

  // ---- Spotlight: a set of works picked from the guide --------------------------

  function renderSpotlight() {
    var bar = $('spotlight');
    if (!ui.spotlight) { bar.hidden = true; return; }
    var shown = S.works.filter(passes).length;
    bar.innerHTML = '<span class="sp-label">Spotlight</span><strong class="sp-name">' + S.esc(ui.spotlight.name) + '</strong>' +
      '<span class="sp-n">' + shown + (shown === 1 ? ' work' : ' works') + '</span>' +
      '<button type="button" class="btn" data-sp="guide">Back to guide</button>' +
      '<button type="button" class="btn" data-sp="clear">Clear</button>';
    bar.hidden = false;
  }

  function spotlight(tab, id) {
    var entry = S.guideEntry(tab, id);
    if (!entry) return;
    if (ui.tour) endTour();
    var ids = {};
    entry.works.forEach(function (w) { ids[w] = true; });
    ui.spotlight = { name: entry.name, ids: ids, tab: tab, entry: id };
    if (ui.selected) deselect();
    setView(chart.getView());
    applyFilters();
    updateInsets();
    chart.fitTo(entry.works);
  }

  function clearSpotlight() {
    ui.spotlight = null;
    applyFilters();
    updateInsets();
    if (ui.view !== 'catalogue' && ui.view !== 'guide') chart.fit(true);
  }

  $('spotlight').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sp]');
    if (!b) return;
    if (b.getAttribute('data-sp') === 'clear') { clearSpotlight(); return; }
    var back = ui.spotlight;
    clearSpotlight();
    setView('guide');
    if (back) showGuide(back.tab, back.entry);
  });

  function renderSectorList() {
    var counts = {};
    S.works.forEach(function (w) { counts[w.sector] = (counts[w.sector] || 0) + 1; });
    $('sector-list').innerHTML = S.sectors.map(function (s) {
      return '<li><button type="button" class="sec-' + s.id + '" data-sector="' + s.id + '" aria-pressed="' + ui.sectorsOn[s.id] + '"' +
        ' title="' + S.esc(s.blurb) + ' (Alt-click to show only this sector.)">' +
        '<span class="dot"></span><span>' + S.esc(s.name) + '</span><span class="count">' + counts[s.id] + '</span></button></li>';
    }).join('');
  }

  $('sector-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sector]');
    if (!b) return;
    var id = b.getAttribute('data-sector');
    if (e.altKey || e.metaKey) {
      S.sectors.forEach(function (s) { ui.sectorsOn[s.id] = s.id === id; });
    } else {
      ui.sectorsOn[id] = !ui.sectorsOn[id];
    }
    applyFilters();
    var again = $('sector-list').querySelector('[data-sector="' + id + '"]');
    if (again) again.focus();
  });

  $('sectors-all').addEventListener('click', function () {
    S.sectors.forEach(function (s) { ui.sectorsOn[s.id] = true; });
    applyFilters();
  });

  // Year sliders run along the chart's own piecewise scale, so the sparse
  // early centuries take up only a little of the track.
  var G = S.geo;
  var X0 = G.yearToX(minYear);
  var X1 = G.yearToX(maxYear);
  function sliderToYear(v) {
    var x = X0 + (X1 - X0) * v / 100;
    for (var i = 1; i < G.XS.length; i++) {
      if (x <= G.XS[i]) {
        var t = (x - G.XS[i - 1]) / (G.XS[i] - G.XS[i - 1]);
        return Math.round(G.YEARS[i - 1] + t * (G.YEARS[i] - G.YEARS[i - 1]));
      }
    }
    return maxYear;
  }

  function onRange() {
    var a = +$('year-from').value;
    var b = +$('year-to').value;
    if (a > b) {
      if (this === $('year-from')) $('year-from').value = a = b;
      else $('year-to').value = b = a;
    }
    ui.yearFrom = a === 0 ? minYear : sliderToYear(a);
    ui.yearTo = b === 100 ? maxYear : sliderToYear(b);
    $('year-from-out').textContent = ui.yearFrom < 1000 ? ui.yearFrom + ' CE' : ui.yearFrom;
    $('year-to-out').textContent = ui.yearTo;
    $('range-fill').style.left = a + '%';
    $('range-fill').style.right = (100 - b) + '%';
    applyFilters();
  }
  $('year-from').addEventListener('input', onRange);
  $('year-to').addEventListener('input', onRange);

  $('awards-only').addEventListener('change', function () {
    ui.awardsOnly = this.checked;
    applyFilters();
  });
  $('show-links').addEventListener('change', function () { chart.setShowLinks(this.checked); });

  var legend = $('era-legend');
  legend.innerHTML = S.eras.map(function (e, i) {
    var end = i === S.eras.length - 1 ? 'today' : e.end;
    var start = i === 0 ? 'before' : e.start;
    return '<li class="era-' + e.id + '"><span class="dot"></span><span>' + S.esc(e.name) + '</span>' +
      '<span class="yrs">' + (i === 0 ? 'to 1817' : start + '–' + end) + '</span></li>';
  }).join('') + '<li class="era-note">Red for the oldest works and blue for the newest, the way stars run from cool to hot.</li>';

  document.querySelectorAll('[data-color]').forEach(function (b) {
    b.addEventListener('click', function () {
      var mode = b.getAttribute('data-color');
      document.querySelectorAll('[data-color]').forEach(function (o) { o.setAttribute('aria-checked', String(o === b)); });
      app.classList.toggle('color-era', mode === 'era');
      legend.hidden = mode !== 'era';
    });
  });

  // ---- Selection & record panel -------------------------------------------------

  function select(id, opts) {
    opts = opts || {};
    var w = S.byId[id];
    if (!w) return;
    ui.selected = id;
    chart.select(id);
    if (!opts.keepPanel) {
      $('detail').innerHTML = S.renderDetail(w, { lineage: ui.lineage });
      $('detail').hidden = false;
      $('detail').scrollTop = 0;
    }
    updateInsets();
    if (opts.fly || !chart.isVisible(id)) chart.flyTo(id, opts.zoom);
    if (location.hash.slice(1) !== id && !opts.fromHash) {
      try { history.replaceState(null, '', '#' + id); } catch (err) { location.hash = id; }
    }
    if (ui.view === 'catalogue') markCatalogueSelection();
  }

  function deselect() {
    ui.selected = null;
    ui.lineage = false;
    chart.setLineage(false);
    chart.select(null);
    $('detail').hidden = true;
    updateInsets();
    if (location.hash) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (err) { location.hash = ''; }
    }
    if (ui.view === 'catalogue') markCatalogueSelection();
  }

  $('detail').addEventListener('click', function (e) {
    var t = e.target.closest('[data-goto],[data-act],[data-tag]');
    if (!t) return;
    if (t.hasAttribute('data-goto')) {
      select(t.getAttribute('data-goto'), { fly: !pageView() });
    } else if (t.getAttribute('data-act') === 'close') {
      deselect();
    } else if (t.getAttribute('data-act') === 'lineage') {
      ui.lineage = !ui.lineage;
      t.setAttribute('aria-pressed', String(ui.lineage));
      chart.setLineage(ui.lineage);
    } else if (t.hasAttribute('data-tag')) {
      var input = $('search');
      input.value = t.getAttribute('data-tag');
      input.focus();
      runSearch();
    }
  });

  chart.onSelect = function (id) {
    if (ui.tour) {
      var idx = ui.tour.steps.findIndex(function (s) { return s.id === id; });
      if (idx >= 0) { goStep(idx); return; }
    }
    select(id);
  };
  chart.onBackground = function () {
    if (ui.selected && !ui.tour) deselect();
  };

  // ---- Tooltip ------------------------------------------------------------------

  var tip = $('tooltip');
  chart.onHover = function (id, x, y) {
    if (!id) { tip.hidden = true; return; }
    tip.innerHTML = S.renderTooltip(S.byId[id]);
    tip.hidden = false;
    var r = app.getBoundingClientRect();
    var px = x - r.left + 14;
    var py = y - r.top + 14;
    if (px + tip.offsetWidth > r.width - 8) px = x - r.left - tip.offsetWidth - 14;
    if (py + tip.offsetHeight > r.height - 8) py = y - r.top - tip.offsetHeight - 14;
    tip.style.left = px + 'px';
    tip.style.top = py + 'px';
  };

  // ---- Search ---------------------------------------------------------------------

  var input = $('search');
  var list = $('search-results');
  var results = [];
  var active = 0;

  function runSearch() {
    var q = input.value;
    results = S.searchWorks(q, 9);
    active = 0;
    if (!q.trim()) { closeResults(); return; }
    list.innerHTML = S.renderResults(results, q);
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-activedescendant', results.length ? 'opt-' + results[0].id : '');
  }

  function closeResults() {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function moveActive(d) {
    if (!results.length) return;
    active = (active + d + results.length) % results.length;
    list.querySelectorAll('[role="option"]').forEach(function (li, i) { li.setAttribute('aria-selected', String(i === active)); });
    var cur = list.children[active];
    input.setAttribute('aria-activedescendant', cur.id);
    cur.scrollIntoView({ block: 'nearest' });
  }

  function choose(id) {
    closeResults();
    input.blur();
    if (ui.tour) endTour();
    select(id, { fly: !pageView(), zoom: 2.6 });
  }

  input.addEventListener('input', runSearch);
  input.addEventListener('focus', function () { if (input.value.trim()) runSearch(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1); }
    else if (e.key === 'Enter') { if (results[active]) choose(results[active].id); }
    else if (e.key === 'Escape') { if (!list.hidden) { closeResults(); e.stopPropagation(); } else input.blur(); }
  });
  list.addEventListener('mousedown', function (e) { e.preventDefault(); });
  list.addEventListener('click', function (e) {
    var li = e.target.closest('[data-id]');
    if (li) choose(li.getAttribute('data-id'));
  });
  input.addEventListener('blur', function () { setTimeout(closeResults, 120); });

  // ---- Voyages ----------------------------------------------------------------------

  $('tour-list').innerHTML = S.tours.map(function (t) {
    return '<li><button type="button" data-tour-id="' + t.id + '"><span class="t-name">' + S.esc(t.name) + '</span>' +
      '<span class="t-blurb">' + S.esc(t.blurb) + ' ' + t.steps.length + ' stops.</span></button></li>';
  }).join('');

  $('tour-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tour-id]');
    if (!b) return;
    var tour = S.tours.find(function (t) { return t.id === b.getAttribute('data-tour-id'); });
    startTour(tour);
  });

  function startTour(tour) {
    if (ui.spotlight) { ui.spotlight = null; applyFilters(); }
    if (pageView()) setView(chart.getView());
    ui.tour = tour;
    app.classList.add('touring');
    if (mobile.matches) app.classList.add('key-closed');
    syncKeyButton();
    chart.setRoute(tour.steps.map(function (s) { return s.id; }));
    goStep(0);
  }

  function goStep(i) {
    ui.step = i;
    var card = $('tour-card');
    card.innerHTML = S.renderTourCard(ui.tour, i);
    card.hidden = false;
    $('detail').hidden = true;
    var id = ui.tour.steps[i].id;
    ui.selected = id;
    chart.select(id);
    updateInsets();
    chart.flyTo(id, 2.4);
  }

  function endTour() {
    ui.tour = null;
    app.classList.remove('touring');
    $('tour-card').hidden = true;
    chart.setRoute(null);
    deselect();
  }

  $('tour-card').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tour]');
    if (!b || !ui.tour) return;
    var act = b.getAttribute('data-tour');
    if (act === 'next') goStep(Math.min(ui.step + 1, ui.tour.steps.length - 1));
    else if (act === 'prev') goStep(Math.max(ui.step - 1, 0));
    else if (act === 'end') endTour();
    else if (act === 'open') {
      var id = ui.tour.steps[ui.step].id;
      $('detail').innerHTML = S.renderDetail(S.byId[id], { lineage: ui.lineage });
      $('detail').hidden = false;
      updateInsets();
    }
  });

  // ---- Views & catalogue ---------------------------------------------------------------

  function renderCatalogue() {
    var works = S.works.filter(passes);
    $('catalogue').innerHTML = S.renderCatalogue(works, ui.sort, S.works.length, ui.selected);
  }

  function markCatalogueSelection() {
    $('catalogue').querySelectorAll('tr[data-id]').forEach(function (tr) {
      tr.classList.toggle('sel', tr.getAttribute('data-id') === ui.selected);
    });
  }

  $('catalogue').addEventListener('click', function (e) {
    var s = e.target.closest('[data-sort]');
    if (s) {
      var key = s.getAttribute('data-sort');
      ui.sort = { key: key, dir: ui.sort.key === key && ui.sort.dir === 'asc' ? 'desc' : 'asc' };
      renderCatalogue();
      var again = $('catalogue').querySelector('[data-sort="' + key + '"]');
      if (again) again.focus();
      return;
    }
    var tr = e.target.closest('tr[data-id]');
    if (tr) select(tr.getAttribute('data-id'));
  });
  $('catalogue').addEventListener('keydown', function (e) {
    var tr = e.target.closest('tr[data-id]');
    if (tr && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(tr.getAttribute('data-id')); }
  });

  // ---- Field guide ------------------------------------------------------------------------

  function renderGuide() {
    $('guide').innerHTML = S.renderGuide(ui.guideTab);
  }

  // Open a guide tab, optionally scrolled to one entry.
  function showGuide(tab, entryId) {
    if (tab !== ui.guideTab || !$('guide').firstChild) { ui.guideTab = tab; renderGuide(); }
    var target = entryId && document.getElementById('g-' + entryId);
    if (target) {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    } else {
      $('guide').scrollTop = 0;
    }
  }

  $('guide').addEventListener('click', function (e) {
    var t = e.target.closest('[data-gtab],[data-goto],[data-spot],[data-jump]');
    if (!t) return;
    if (t.hasAttribute('data-gtab')) {
      showGuide(t.getAttribute('data-gtab'));
      var tab = $('guide').querySelector('[data-gtab="' + ui.guideTab + '"]');
      if (tab) tab.focus();
    } else if (t.hasAttribute('data-goto')) {
      select(t.getAttribute('data-goto'));
    } else if (t.hasAttribute('data-spot')) {
      var parts = t.getAttribute('data-spot').split(':');
      spotlight(parts[0], parts[1]);
    } else if (t.hasAttribute('data-jump')) {
      showGuide(ui.guideTab, t.getAttribute('data-jump'));
    }
  });

  $('guide').addEventListener('keydown', function (e) {
    var tab = e.target.closest('[data-gtab]');
    if (!tab || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    var ids = S.guideTabs.map(function (g) { return g.id; });
    var i = ids.indexOf(tab.getAttribute('data-gtab'));
    var next = ids[(i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length];
    showGuide(next);
    $('guide').querySelector('[data-gtab="' + next + '"]').focus();
  });

  // Catalogue and Guide are pages laid over the chart rather than chart views.
  function pageView() {
    return ui.view === 'catalogue' || ui.view === 'guide';
  }

  function setView(v) {
    if (v === ui.view) return;
    if (ui.tour && (v === 'catalogue' || v === 'guide')) endTour();
    ui.view = v;
    app.setAttribute('data-view', v);
    document.querySelectorAll('.views [data-view]').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute('data-view') === v));
    });
    var cat = $('catalogue');
    cat.hidden = v !== 'catalogue';
    $('guide').hidden = v !== 'guide';
    if (v === 'catalogue') { renderCatalogue(); cat.scrollTop = 0; return; }
    if (v === 'guide') { showGuide(ui.guideTab); return; }
    updateInsets();
    chart.setView(v, true);
    if (ui.selected) setTimeout(function () { if (ui.selected) chart.flyTo(ui.selected); }, 1150);
  }

  document.querySelectorAll('.views [data-view]').forEach(function (b) {
    b.addEventListener('click', function () { setView(b.getAttribute('data-view')); });
  });

  // ---- Key panel, zoom, theme -------------------------------------------------------------

  function syncKeyButton() {
    $('key-toggle').setAttribute('aria-expanded', String(!app.classList.contains('key-closed')));
  }
  $('key-toggle').addEventListener('click', function () {
    app.classList.toggle('key-closed');
    syncKeyButton();
    updateInsets();
  });
  if (mobile.matches) app.classList.add('key-closed');
  syncKeyButton();

  $('zoom-in').addEventListener('click', function () { chart.zoomBy(1.6); });
  $('zoom-out').addEventListener('click', function () { chart.zoomBy(1 / 1.6); });
  $('zoom-reset').addEventListener('click', function () { chart.fit(true); });

  var root = document.documentElement;
  function effectiveTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  try {
    var saved = localStorage.getItem('aif-theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (err) { /* storage unavailable */ }
  $('theme-toggle').addEventListener('click', function () {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('aif-theme', next); } catch (err) { /* storage unavailable */ }
    chart.refreshTheme();
  });
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { chart.refreshTheme(); });
  new MutationObserver(function () { chart.refreshTheme(); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  // ---- Keyboard ---------------------------------------------------------------------------

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); input.focus(); input.select(); return; }
    if (typing) return;
    if (e.key === 'Escape') {
      if (ui.tour) endTour();
      else if (ui.selected) deselect();
    } else if (ui.tour && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      var d = e.key === 'ArrowRight' ? 1 : -1;
      goStep(Math.max(0, Math.min(ui.tour.steps.length - 1, ui.step + d)));
    } else if (e.key === '+' || e.key === '=') chart.zoomBy(1.4);
    else if (e.key === '-') chart.zoomBy(1 / 1.4);
    else if (e.key === '0') chart.fit(true);
  });

  // ---- Deep links ---------------------------------------------------------------------------

  function fromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (id && S.byId[id] && id !== ui.selected) select(id, { fly: true, fromHash: true, zoom: 2.4 });
  }
  window.addEventListener('hashchange', fromHash);

  window.addEventListener('resize', function () { updateInsets(); });
  mobile.addEventListener('change', updateInsets);

  // ---- Start ----------------------------------------------------------------------------------

  renderSectorList();
  onRange.call($('year-to'));
  updateInsets();
  chart.fit(false);
  fromHash();
})(window.SFMAP);
