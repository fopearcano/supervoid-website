/*
 * Static scenery for both views: nebulae, era rings, the year ruler and sector
 * names for the galaxy; lanes, ticks and era bands for the timeline.
 */
(function (S) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }
  S.svgEl = el;

  function arcPath(r, a0, a1, reverse) {
    var x0 = r * Math.cos(a0), y0 = r * Math.sin(a0);
    var x1 = r * Math.cos(a1), y1 = r * Math.sin(a1);
    var large = a1 - a0 > Math.PI ? 1 : 0;
    return reverse
      ? 'M' + x1 + ',' + y1 + ' A' + r + ',' + r + ' 0 ' + large + ' 0 ' + x0 + ',' + y0
      : 'M' + x0 + ',' + y0 + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x1 + ',' + y1;
  }

  S.drawGalaxyDecor = function (g, defs) {
    var G = S.geo;
    var R = G.RADII[G.RADII.length - 1];

    // Core glow.
    var core = el('radialGradient', { id: 'core-glow' }, defs);
    el('stop', { offset: '0', style: 'stop-color: var(--beacon); stop-opacity: 0.22' }, core);
    el('stop', { offset: '1', style: 'stop-color: var(--beacon); stop-opacity: 0' }, core);
    el('circle', { class: 'core-glow', r: 150, fill: 'url(#core-glow)' }, g);

    // Nebulae: a few soft blobs of each sector's colour along its wedge.
    var neb = el('g', { class: 'nebula' }, g);
    S.sectors.forEach(function (s) {
      var grad = el('radialGradient', { id: 'neb-' + s.id, class: 'sec-' + s.id }, defs);
      el('stop', { offset: '0', style: 'stop-color: var(--c); stop-opacity: 0.16' }, grad);
      el('stop', { offset: '0.55', style: 'stop-color: var(--c); stop-opacity: 0.05' }, grad);
      el('stop', { offset: '1', style: 'stop-color: var(--c); stop-opacity: 0' }, grad);
      var ang = G.sectorAngles(s);
      [[0.42, 120], [0.66, 160], [0.88, 190]].forEach(function (b, i) {
        var a = ang.mid + (i - 1) * G.WEDGE * 0.12;
        el('circle', {
          cx: (R * b[0] * Math.cos(a)).toFixed(1),
          cy: (R * b[0] * Math.sin(a)).toFixed(1),
          r: b[1],
          fill: 'url(#neb-' + s.id + ')'
        }, neb);
      });
    });

    // Minor rings every few decades, major rings at era boundaries.
    [1700, 1900, 1950, 1970, 1990, 2010].forEach(function (y) {
      el('circle', { class: 'ring', r: G.yearToR(y).toFixed(1) }, g);
    });
    S.eras.slice(1).forEach(function (e) {
      el('circle', { class: 'ring major', r: G.yearToR(e.start).toFixed(1) }, g);
    });
    el('circle', { class: 'ring rim', r: R }, g);

    // Sector boundaries.
    S.sectors.forEach(function (s) {
      var a = G.sectorAngles(s).a0;
      el('line', {
        class: 'spoke',
        x1: (60 * Math.cos(a)).toFixed(1), y1: (60 * Math.sin(a)).toFixed(1),
        x2: ((R + 10) * Math.cos(a)).toFixed(1), y2: ((R + 10) * Math.sin(a)).toFixed(1)
      }, g);
    });
    var lastA = G.sectorAngles(S.sectors[S.sectors.length - 1]).a1;
    el('line', {
      class: 'spoke',
      x1: (60 * Math.cos(lastA)).toFixed(1), y1: (60 * Math.sin(lastA)).toFixed(1),
      x2: ((R + 10) * Math.cos(lastA)).toFixed(1), y2: ((R + 10) * Math.sin(lastA)).toFixed(1)
    }, g);

    // Year ruler up the gap at twelve o'clock: years on the rings, era names between them.
    var ruler = el('g', { class: 'ruler' }, g);
    S.eras.forEach(function (e, i) {
      var r0 = i === 0 ? G.RADII[0] : G.yearToR(e.start);
      var next = S.eras[i + 1];
      var r1 = next ? G.yearToR(next.start) : R;
      var mid = (r0 + r1) / 2;
      var label = el('text', {
        class: 'ring-label era',
        transform: 'translate(6,' + (-mid).toFixed(1) + ') rotate(-90)',
        'text-anchor': 'middle'
      }, ruler);
      label.textContent = e.name;
      if (i > 0) {
        var y = -G.yearToR(e.start);
        el('rect', { class: 'ring-label-bg', x: -19, y: y - 8, width: 38, height: 16, rx: 2 }, ruler);
        var yr = el('text', { class: 'ring-label', x: 0, y: y + 4.5, 'text-anchor': 'middle' }, ruler);
        yr.textContent = e.start;
      }
    });
    var rimY = -R;
    el('rect', { class: 'ring-label-bg', x: -24, y: rimY - 8, width: 48, height: 16, rx: 2 }, ruler);
    var rimLabel = el('text', { class: 'ring-label', x: 0, y: rimY + 4.5, 'text-anchor': 'middle' }, ruler);
    rimLabel.textContent = 'TODAY';

    // Sector names curve around the rim; the lower half is flipped to stay upright.
    S.sectors.forEach(function (s) {
      var ang = G.sectorAngles(s);
      var mid = ((ang.mid % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      var bottom = mid > 0.08 && mid < Math.PI - 0.08;
      var r = bottom ? R + 44 : R + 26;
      el('path', { id: 'arc-' + s.id, d: arcPath(r, ang.a0, ang.a1, bottom), fill: 'none' }, defs);
      var text = el('text', { class: 'sector-name sec-' + s.id }, g);
      var tp = el('textPath', { href: '#arc-' + s.id, startOffset: '50%', 'text-anchor': 'middle' }, text);
      tp.textContent = s.name;
    });
  };

  S.drawTimelineDecor = function (g) {
    var G = S.geo;
    var W = G.XS[G.XS.length - 1];
    var H = S.sectors.length * G.LANE;

    S.sectors.forEach(function (s, i) {
      el('rect', { class: 'lane' + (i % 2 ? ' alt' : ''), x: -160, y: i * G.LANE, width: W + 180, height: G.LANE }, g);
      var name = el('text', { class: 'lane-name sec-' + s.id, x: -18, y: i * G.LANE + G.LANE / 2 }, g);
      name.textContent = s.short;
    });

    [1600, 1700, 1800, 1850, 1900, 1950, 1970, 1990, 2010, 2020].forEach(function (y) {
      var x = G.yearToX(y);
      el('line', { class: 'tick', x1: x, x2: x, y1: -6, y2: H }, g);
      var t = el('text', { class: 'tick-label', x: x, y: -14 }, g);
      t.textContent = y;
    });

    S.eras.forEach(function (e, i) {
      var x0 = i === 0 ? 0 : G.yearToX(e.start);
      var next = S.eras[i + 1];
      var x1 = next ? G.yearToX(next.start) : W;
      if (i > 0) {
        el('line', { class: 'tick major', x1: x0, x2: x0, y1: -62, y2: H + 8 }, g);
        var t = el('text', { class: 'tick-label', x: x0, y: H + 28 }, g);
        t.textContent = e.start;
      }
      var label = el('text', { class: 'era-band-label', x: (x0 + x1) / 2, y: -42, 'text-anchor': 'middle' }, g);
      label.textContent = x1 - x0 < 120 ? e.name.split(' ')[0] : e.name;
    });
  };
})(window.SFMAP);
