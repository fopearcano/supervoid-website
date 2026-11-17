/*
 * Derived data and geometry.
 *
 * Galaxy view: a polar chart. Distance from the core encodes the year of
 * first publication on a piecewise scale (the sparse centuries before 1818 are
 * compressed into the core), and each sector owns an equal wedge of the disc.
 *
 * Timeline view: year runs left to right on the same piecewise scale, and each
 * sector gets a horizontal lane.
 */
(function (S) {
  'use strict';

  // Shared piecewise year scale. Breakpoints sit on era boundaries.
  var YEARS = [100, 1500, 1818, 1926, 1938, 1960, 1980, 2000, 2027];
  var RADII = [34, 66, 124, 252, 300, 420, 540, 660, 790];
  var XS = [0, 60, 190, 430, 490, 830, 1170, 1510, 1950];

  function piecewise(stops, out, v) {
    if (v <= stops[0]) return out[0];
    for (var i = 1; i < stops.length; i++) {
      if (v <= stops[i]) {
        var t = (v - stops[i - 1]) / (stops[i] - stops[i - 1]);
        return out[i - 1] + t * (out[i] - out[i - 1]);
      }
    }
    return out[out.length - 1];
  }

  var yearToR = piecewise.bind(null, YEARS, RADII);
  var yearToX = piecewise.bind(null, YEARS, XS);

  // Small deterministic PRNG so the chart looks the same on every load.
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967296;
  }

  function eraOf(year) {
    for (var i = 0; i < S.eras.length; i++) {
      if (year >= S.eras[i].start && year <= S.eras[i].end) return S.eras[i];
    }
    return S.eras[S.eras.length - 1];
  }

  // ---- Derived fields -------------------------------------------------------

  S.byId = {};
  S.sectorById = {};
  S.sectors.forEach(function (s, i) { s.index = i; S.sectorById[s.id] = s; });
  S.eras.forEach(function (e, i) { e.index = i; });

  var landmark = {};
  S.landmarks.forEach(function (id) { landmark[id] = true; });

  var tourCount = {};
  (S.tours || []).forEach(function (t) {
    t.steps.forEach(function (st) { tourCount[st.id] = (tourCount[st.id] || 0) + 1; });
  });

  S.works.forEach(function (w) {
    w.inf = w.inf || [];
    w.awards = w.awards || [];
    w.tags = w.tags || [];
    w.form = w.form || 'novel';
    w.children = [];
    w.era = eraOf(w.year);
    w.landmark = !!landmark[w.id];
    S.byId[w.id] = w;
  });

  S.links = [];
  S.works.forEach(function (w) {
    w.inf.forEach(function (src) {
      var from = S.byId[src];
      if (!from) return;
      from.children.push(w.id);
      S.links.push({ source: src, target: w.id });
    });
  });

  S.works.forEach(function (w) {
    w.importance = (w.landmark ? 3 : 0) + 1.2 * w.children.length +
      0.8 * w.awards.length + 0.5 * (tourCount[w.id] || 0);
    w.size = 2.4 + 1.45 * Math.sqrt(w.importance);
  });

  // Catalogue numbers in chronological order, like a star catalogue.
  S.works.slice().sort(function (a, b) {
    return a.year - b.year || a.title.localeCompare(b.title);
  }).forEach(function (w, i) {
    w.catalogue = 'AIF ' + String(i + 1).padStart(3, '0');
  });

  S.authors = {};
  S.works.forEach(function (w) {
    (S.authors[w.author] = S.authors[w.author] || []).push(w.id);
  });

  // Transitive ancestors or descendants of a work.
  S.lineage = function (id, dir) {
    var seen = {};
    var stack = [id];
    while (stack.length) {
      var w = S.byId[stack.pop()];
      var next = dir === 'up' ? w.inf : w.children;
      next.forEach(function (n) {
        if (!seen[n]) { seen[n] = true; stack.push(n); }
      });
    }
    return Object.keys(seen);
  };

  // ---- Galaxy layout --------------------------------------------------------

  // A thin gap at twelve o'clock holds the year ruler.
  var N = S.sectors.length;
  var GAP = 0.13;
  var WEDGE = (Math.PI * 2 - GAP) / N;
  var START = -Math.PI / 2 + GAP / 2;

  function sectorAngles(sector) {
    var a0 = START + sector.index * WEDGE;
    return { a0: a0, a1: a0 + WEDGE, mid: a0 + WEDGE / 2 };
  }

  function relax(nodes, iterations, constrain) {
    for (var it = 0; it < iterations; it++) {
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = b.x - a.x;
          var dy = b.y - a.y;
          var min = a.r + b.r + 4;
          var d2 = dx * dx + dy * dy;
          if (d2 >= min * min) continue;
          var d = Math.sqrt(d2) || 0.01;
          var push = (min - d) / 2;
          var ux = dx / d;
          var uy = dy / d;
          a.x -= ux * push; a.y -= uy * push;
          b.x += ux * push; b.y += uy * push;
        }
      }
      nodes.forEach(constrain);
    }
  }

  function galaxyLayout() {
    var nodes = S.works.map(function (w) {
      var ang = sectorAngles(S.sectorById[w.sector]);
      var r = yearToR(w.year);
      var t = 0.15 + 0.7 * hash(w.id);
      var a = ang.a0 + t * WEDGE;
      return { w: w, r: w.size, r0: r, ang: ang, x: r * Math.cos(a), y: r * Math.sin(a) };
    });

    relax(nodes, 260, function (n) {
      var rad = Math.sqrt(n.x * n.x + n.y * n.y);
      var a = Math.atan2(n.y, n.x);
      // Keep the angle on the same branch as the wedge.
      while (a < n.ang.a0 - Math.PI) a += Math.PI * 2;
      while (a > n.ang.a1 + Math.PI) a -= Math.PI * 2;
      var margin = Math.min(WEDGE * 0.45, (n.r + 5) / Math.max(rad, 1));
      a = Math.max(n.ang.a0 + margin, Math.min(n.ang.a1 - margin, a));
      rad = Math.max(n.r0 - 8, Math.min(n.r0 + 8, rad));
      n.x = rad * Math.cos(a);
      n.y = rad * Math.sin(a);
    });

    var pos = {};
    nodes.forEach(function (n) { pos[n.w.id] = { x: n.x, y: n.y }; });
    var R = RADII[RADII.length - 1];
    return { pos: pos, bounds: { x: -R - 70, y: -R - 70, w: 2 * R + 140, h: 2 * R + 140 } };
  }

  // ---- Timeline layout ------------------------------------------------------

  var LANE = 58;

  function timelineLayout() {
    var nodes = S.works.map(function (w) {
      var s = S.sectorById[w.sector];
      var cy = s.index * LANE + LANE / 2;
      var x0 = yearToX(w.year);
      return { w: w, r: w.size, x0: x0, cy: cy, x: x0, y: cy + (hash(w.id + '~') - 0.5) * (LANE - 22) };
    });

    relax(nodes, 200, function (n) {
      var span = LANE / 2 - n.r - 3;
      n.y = Math.max(n.cy - span, Math.min(n.cy + span, n.y));
      n.x = Math.max(n.x0 - 5, Math.min(n.x0 + 5, n.x));
    });

    var pos = {};
    nodes.forEach(function (n) { pos[n.w.id] = { x: n.x, y: n.y }; });
    var W = XS[XS.length - 1];
    return { pos: pos, bounds: { x: -200, y: -80, w: W + 240, h: N * LANE + 120 } };
  }

  S.geo = {
    YEARS: YEARS,
    RADII: RADII,
    XS: XS,
    LANE: LANE,
    WEDGE: WEDGE,
    GAP: GAP,
    START: START,
    yearToR: yearToR,
    yearToX: yearToX,
    sectorAngles: sectorAngles,
    galaxy: galaxyLayout(),
    timeline: timelineLayout()
  };
})(window.SFMAP);
