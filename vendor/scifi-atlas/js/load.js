/* Load only the selected catalog tier before building the chart and search. */
(function (S) {
  'use strict';

  var VERSION = '?v=8';
  var params = new URLSearchParams(location.search);
  var mode = params.get('load');
  if (mode !== 'curated' && mode !== 'full') mode = 'featured';

  var sectorIds = S.sectors.map(function (s) { return s.id; });
  var requested = params.get('sectors');
  var sectors = requested === null ? null : requested.split(',').filter(function (id) {
    return sectorIds.indexOf(id) >= 0;
  });

  function year(name, fallback) {
    var value = params.get(name);
    if (value === null || !/^\d{1,4}$/.test(value)) return fallback;
    return Math.max(S.catalog.minYear, Math.min(S.catalog.maxYear, +value));
  }

  var fromYear = year('from', S.catalog.minYear);
  var toYear = year('to', S.catalog.maxYear);
  if (fromYear > toYear) { fromYear = S.catalog.minYear; toYear = S.catalog.maxYear; }
  var awardsOnly = params.get('awards') === '1';

  // Existing catalog deep links still open even when the default load is light.
  var hash = '';
  try { hash = decodeURIComponent(location.hash.slice(1)); } catch (e) { /* bad hash */ }
  if (/^catalog-\d+$/.test(hash)) {
    mode = 'full';
    sectors = null;
    fromYear = S.catalog.minYear;
    toYear = S.catalog.maxYear;
    awardsOnly = false;
  }

  S.loadOptions = {
    mode: mode, sectors: sectors, fromYear: fromYear, toYear: toYear,
    awardsOnly: awardsOnly, errors: []
  };

  function script(src) {
    return new Promise(function (resolve, reject) {
      var tag = document.createElement('script');
      tag.src = src + VERSION;
      tag.async = false;
      tag.onload = resolve;
      tag.onerror = function () { reject(new Error('Could not load ' + src)); };
      document.body.appendChild(tag);
    });
  }

  async function start() {
    var addWorks = S.addWorks;
    S.addWorks = function (sector, list) {
      addWorks(sector, list.filter(function (w) {
        return w.year >= fromYear && w.year <= toYear;
      }));
    };
    try {
      if (mode !== 'curated' && !awardsOnly) {
        for (var i = 0; i < S.catalog.sectors.length; i++) {
          var sector = S.catalog.sectors[i];
          if (sectors && sectors.indexOf(sector) < 0) continue;
          var file = 'data/sectors/catalog-' + (mode === 'featured' ? 'featured-' : '') + sector + '.js';
          try { await script(file); }
          catch (err) { S.loadOptions.errors.push(file); console.error(err); }
        }
      }
    } finally {
      S.addWorks = addWorks;
    }
    S.loadOptions.loaded = S.works.length;
    var runtime = ['layout', 'decor', 'chart', 'panels', 'guide', 'app'];
    for (var j = 0; j < runtime.length; j++) await script('js/' + runtime[j] + '.js');
  }

  start().catch(function (err) {
    console.error(err);
    document.getElementById('load-summary').textContent = 'The atlas could not start. Reload to try again.';
  });
})(window.SFMAP);
