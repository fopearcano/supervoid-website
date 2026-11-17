/*
 * The interactive chart: stars, influence lines, labels, pan and zoom, and the
 * animated move between the galaxy and timeline layouts.
 */
(function (S) {
  'use strict';

  var el = S.svgEl;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function tween(duration, step, done) {
    if (reduceMotion || duration <= 0) { step(1); if (done) done(); return function () {}; }
    var start = performance.now();
    var raf;
    var stopped = false;
    function frame(now) {
      if (stopped) return;
      var t = Math.min(1, (now - start) / duration);
      step(ease(t));
      if (t < 1) raf = requestAnimationFrame(frame);
      else if (done) done();
    }
    raf = requestAnimationFrame(frame);
    return function () { stopped = true; cancelAnimationFrame(raf); };
  }

  function shortTitle(w) {
    var parts = w.title.split(/[;:]\s/);
    return parts[0].length >= 6 ? parts[0] : w.title;
  }

  S.createChart = function (svg, canvas) {
    var G = S.geo;
    var view = 'galaxy';
    var t = { x: 0, y: 0, k: 1 };
    var cur = {};
    var stars = {};
    var labels = {};
    var linkEls = [];
    var state = { focus: null, selected: null, lineage: false, filter: null, route: null };
    var insets = { left: 0, right: 0, top: 0, bottom: 0 };
    var stopCamera = function () {};
    var stopMove = function () {};
    var api = { onHover: null, onSelect: null, onBackground: null, onTransform: null };

    // ---- Build -------------------------------------------------------------

    var defs = el('defs', {}, svg);
    var viewport = el('g', { class: 'viewport' }, svg);
    var decorGalaxy = el('g', { class: 'decor decor-galaxy' }, viewport);
    var decorTimeline = el('g', { class: 'decor decor-timeline off' }, viewport);
    var linksG = el('g', { class: 'links' }, viewport);
    var route = el('path', { class: 'route', d: '' }, viewport);
    var starsG = el('g', { class: 'stars' }, viewport);
    var labelsG = el('g', { class: 'labels' }, svg);

    S.drawGalaxyDecor(decorGalaxy, defs);
    S.drawTimelineDecor(decorTimeline);

    S.links.forEach(function (l) {
      var target = S.byId[l.target];
      var p = el('path', { class: 'link sec-' + target.sector + ' era-' + target.era.id }, linksG);
      linkEls.push({ el: p, source: l.source, target: l.target });
    });

    // Draw the brightest stars last so they sit on top.
    S.works.slice().sort(function (a, b) { return a.importance - b.importance; }).forEach(function (w) {
      var g = el('g', { class: 'star sec-' + w.sector + ' era-' + w.era.id, 'data-id': w.id }, starsG);
      if (w.importance >= 2.5) el('circle', { class: 'halo', r: (w.size * 2.3).toFixed(2) }, g);
      el('circle', { class: 'core', r: w.size.toFixed(2) }, g);
      el('circle', { class: 'ring-sel', r: (w.size + 4).toFixed(2) }, g);
      el('circle', { class: 'hit', r: Math.max(w.size + 4, 9).toFixed(2) }, g);
      stars[w.id] = g;

      var lab = el('text', { class: 'label' + (w.landmark ? ' landmark' : ''), 'data-id': w.id }, labelsG);
      lab.textContent = shortTitle(w);
      lab.style.display = 'none';
      labels[w.id] = { el: lab, width: shortTitle(w).length * (w.landmark ? 7.4 : 6.1) };

      cur[w.id] = { x: G.galaxy.pos[w.id].x, y: G.galaxy.pos[w.id].y };
    });

    // Measure label widths with the real fonts (again once web fonts have
    // loaded), so collision avoidance matches what is drawn.
    function measureLabels() {
      var ctx2 = document.createElement('canvas').getContext('2d');
      var fontFor = {};
      S.works.forEach(function (w) {
        var lab = labels[w.id];
        var key = w.landmark ? 'landmark' : 'plain';
        if (!fontFor[key]) {
          var cs = getComputedStyle(lab.el);
          fontFor[key] = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
        }
        ctx2.font = fontFor[key];
        var width = ctx2.measureText(lab.el.textContent).width;
        if (width > 0) lab.width = width;
      });
    }
    measureLabels();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { measureLabels(); queueLabels(); });
    }

    // ---- Geometry ----------------------------------------------------------

    function linkPath(a, b) {
      if (view === 'galaxy') {
        var mx = (a.x + b.x) / 2 * 0.6;
        var my = (a.y + b.y) / 2 * 0.6;
        return 'M' + a.x.toFixed(1) + ',' + a.y.toFixed(1) + 'Q' + mx.toFixed(1) + ',' + my.toFixed(1) +
          ' ' + b.x.toFixed(1) + ',' + b.y.toFixed(1);
      }
      var dx = Math.max(40, (b.x - a.x) * 0.5);
      return 'M' + a.x.toFixed(1) + ',' + a.y.toFixed(1) + 'C' + (a.x + dx).toFixed(1) + ',' + a.y.toFixed(1) +
        ' ' + (b.x - dx).toFixed(1) + ',' + b.y.toFixed(1) + ' ' + b.x.toFixed(1) + ',' + b.y.toFixed(1);
    }

    function drawLinks() {
      linkEls.forEach(function (l) { l.el.setAttribute('d', linkPath(cur[l.source], cur[l.target])); });
    }

    function drawRoute() {
      if (!state.route || state.route.length < 2) { route.setAttribute('d', ''); return; }
      var d = state.route.map(function (id, i) {
        var p = cur[id];
        return (i ? 'L' : 'M') + p.x.toFixed(1) + ',' + p.y.toFixed(1);
      }).join('');
      route.setAttribute('d', d);
    }

    function starScale() { return Math.pow(t.k, -0.55); }

    function placeStars() {
      var s = starScale().toFixed(3);
      for (var id in stars) {
        var p = cur[id];
        stars[id].setAttribute('transform', 'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ') scale(' + s + ')');
      }
    }

    // ---- Labels (screen space, greedy collision avoidance) -----------------

    var labelQueued = false;
    function queueLabels() {
      if (labelQueued) return;
      labelQueued = true;
      requestAnimationFrame(function () { labelQueued = false; placeLabels(); drawStarfield(); });
    }

    function labelThreshold() {
      if (t.k < 0.55) return 4.5;
      if (t.k < 0.8) return 3;
      if (t.k < 1.2) return 2;
      if (t.k < 1.8) return 1.2;
      if (t.k < 2.6) return 0.5;
      return 0;
    }

    function placeLabels() {
      var W = svg.clientWidth;
      var H = svg.clientHeight;
      // When a filter leaves only a few stars, label all of them.
      var thr = passCount <= 40 ? 0 : labelThreshold();
      var lit = currentLit();
      var placed = [];
      var s = starScale();
      var order = S.works.slice().sort(function (a, b) { return rank(b) - rank(a); });

      function rank(w) {
        if (w.id === state.selected) return 1000;
        if (lit && lit[w.id]) return 500 + w.importance;
        return w.importance + (w.landmark ? 2 : 0);
      }

      order.forEach(function (w) {
        var lab = labels[w.id];
        var p = cur[w.id];
        var sx = t.x + p.x * t.k;
        var sy = t.y + p.y * t.k;
        var r = w.size * t.k * s;
        var isLit = lit && lit[w.id];
        var out = state.filter && !state.filter(w);
        var want = !out && (w.id === state.selected || isLit || w.importance + (w.landmark ? 2 : 0) >= thr);
        if (want && (sx < -50 || sy < -20 || sx > W + 20 || sy > H + 20)) want = false;
        var left = sx + r + 5 + lab.width > W - 6;
        var box = left
          ? { x0: sx - r - 5 - lab.width, y0: sy - 8, x1: sx - r - 3, y1: sy + 6 }
          : { x0: sx + r + 3, y0: sy - 8, x1: sx + r + 5 + lab.width, y1: sy + 6 };
        if (want && left && box.x0 < 4) want = false;
        if (want) {
          for (var i = 0; i < placed.length; i++) {
            var b = placed[i];
            if (box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0) { want = false; break; }
          }
        }
        if (!want) { lab.el.style.display = 'none'; return; }
        placed.push(box);
        lab.el.style.display = '';
        lab.el.setAttribute('x', (left ? box.x1 : box.x0).toFixed(1));
        lab.el.setAttribute('text-anchor', left ? 'end' : 'start');
        lab.el.setAttribute('y', (sy + 4).toFixed(1));
        lab.el.classList.toggle('lit', !!isLit);
        lab.el.classList.toggle('sel', w.id === state.selected);
      });
    }

    // ---- Starfield ---------------------------------------------------------

    var ctx = canvas.getContext('2d');
    var dust = [];
    var dustRGB = '220,228,255';
    (function seed() {
      var rnd = 1;
      function r() { rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647; }
      for (var i = 0; i < 520; i++) {
        dust.push({ x: r() * 1400, y: r() * 1400, s: r() < 0.08 ? 1.4 : r() * 0.9 + 0.3, a: 0.15 + r() * 0.55, d: 0.02 + r() * 0.06 });
      }
    })();

    function readDust() {
      dustRGB = getComputedStyle(document.documentElement).getPropertyValue('--dust').trim() || dustRGB;
    }

    function sizeCanvas() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawStarfield() {
      var W = canvas.clientWidth;
      var H = canvas.clientHeight;
      ctx.clearRect(0, 0, W, H);
      var T = 1400;
      for (var i = 0; i < dust.length; i++) {
        var d = dust[i];
        var x = ((d.x + t.x * d.d) % T + T) % T;
        var y = ((d.y + t.y * d.d) % T + T) % T;
        ctx.fillStyle = 'rgba(' + dustRGB + ',' + d.a.toFixed(2) + ')';
        for (var ox = x; ox < W; ox += T) {
          for (var oy = y; oy < H; oy += T) {
            ctx.fillRect(ox, oy, d.s, d.s);
          }
        }
      }
    }

    // ---- Camera ------------------------------------------------------------

    function applyTransform() {
      viewport.setAttribute('transform', 'translate(' + t.x.toFixed(2) + ',' + t.y.toFixed(2) + ') scale(' + t.k.toFixed(4) + ')');
      svg.classList.toggle('zoomed', t.k > 1.6);
      placeStars();
      queueLabels();
      if (api.onTransform) api.onTransform(t);
    }

    function clampK(k) { return Math.max(0.2, Math.min(9, k)); }

    function fitTransform(v) {
      var b = G[v].bounds;
      var W = svg.clientWidth - insets.left - insets.right;
      var H = svg.clientHeight - insets.top - insets.bottom;
      var k = clampK(Math.min(W / b.w, H / b.h));
      return {
        k: k,
        x: insets.left + (W - b.w * k) / 2 - b.x * k,
        y: insets.top + (H - b.h * k) / 2 - b.y * k
      };
    }

    function animateTo(target, duration) {
      stopCamera();
      var from = { x: t.x, y: t.y, k: t.k };
      stopCamera = tween(duration, function (e) {
        // Interpolate zoom in log space and keep the screen centre on a straight path.
        var k = Math.exp(Math.log(from.k) + (Math.log(target.k) - Math.log(from.k)) * e);
        var W = svg.clientWidth / 2;
        var H = svg.clientHeight / 2;
        var c0x = (W - from.x) / from.k, c0y = (H - from.y) / from.k;
        var c1x = (W - target.x) / target.k, c1y = (H - target.y) / target.k;
        var cx = c0x + (c1x - c0x) * e;
        var cy = c0y + (c1y - c0y) * e;
        t.k = k;
        t.x = W - cx * k;
        t.y = H - cy * k;
        applyTransform();
      });
    }

    function zoomAt(factor, sx, sy) {
      stopCamera();
      var k = clampK(t.k * factor);
      var f = k / t.k;
      t.x = sx - (sx - t.x) * f;
      t.y = sy - (sy - t.y) * f;
      t.k = k;
      applyTransform();
    }

    // ---- Pointer input -----------------------------------------------------

    var pointers = new Map();
    var gesture = null;

    function local(e) {
      var r = svg.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function starAt(e) {
      var g = e.target.closest && e.target.closest('.star');
      return g ? g.getAttribute('data-id') : null;
    }

    svg.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      stopCamera();
      svg.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, local(e));
      if (pointers.size === 1) {
        var p = local(e);
        gesture = { type: 'pan', sx: p.x, sy: p.y, tx: t.x, ty: t.y, moved: false, star: starAt(e) };
      } else if (pointers.size === 2) {
        var pts = Array.from(pointers.values());
        gesture = {
          type: 'pinch', moved: true,
          dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
          cx: (pts[0].x + pts[1].x) / 2, cy: (pts[0].y + pts[1].y) / 2,
          k: t.k, tx: t.x, ty: t.y
        };
      }
    });

    svg.addEventListener('pointermove', function (e) {
      if (!pointers.has(e.pointerId)) {
        if (e.pointerType === 'mouse') {
          var id = starAt(e);
          if (id !== state.focus) setFocus(id);
          if (api.onHover) api.onHover(id, e.clientX, e.clientY);
        }
        return;
      }
      pointers.set(e.pointerId, local(e));
      if (!gesture) return;
      if (gesture.type === 'pan') {
        var p = local(e);
        var dx = p.x - gesture.sx;
        var dy = p.y - gesture.sy;
        if (!gesture.moved && Math.hypot(dx, dy) < 5) return;
        if (!gesture.moved) { gesture.moved = true; svg.classList.add('dragging'); if (api.onHover) api.onHover(null); }
        t.x = gesture.tx + dx;
        t.y = gesture.ty + dy;
        applyTransform();
      } else if (gesture.type === 'pinch' && pointers.size >= 2) {
        var pts = Array.from(pointers.values());
        var dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        var cx = (pts[0].x + pts[1].x) / 2;
        var cy = (pts[0].y + pts[1].y) / 2;
        var k = clampK(gesture.k * dist / gesture.dist);
        var f = k / gesture.k;
        t.k = k;
        t.x = cx - (gesture.cx - gesture.tx) * f;
        t.y = cy - (gesture.cy - gesture.ty) * f;
        applyTransform();
      }
    });

    function endPointer(e) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      svg.classList.remove('dragging');
      if (gesture && gesture.type === 'pan' && !gesture.moved && e.type === 'pointerup') {
        var id = starAt(e) || gesture.star;
        if (id) { if (api.onSelect) api.onSelect(id); }
        else if (api.onBackground) api.onBackground();
      }
      if (pointers.size === 1 && gesture && gesture.type === 'pinch') {
        var p = Array.from(pointers.values())[0];
        gesture = { type: 'pan', sx: p.x, sy: p.y, tx: t.x, ty: t.y, moved: true };
      } else if (pointers.size === 0) {
        gesture = null;
      }
    }
    svg.addEventListener('pointerup', endPointer);
    svg.addEventListener('pointercancel', endPointer);
    svg.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse' && !pointers.size) {
        setFocus(null);
        if (api.onHover) api.onHover(null);
      }
    });

    svg.addEventListener('wheel', function (e) {
      e.preventDefault();
      var p = local(e);
      var dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomAt(Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0016)), p.x, p.y);
    }, { passive: false });

    svg.addEventListener('dblclick', function (e) {
      var p = local(e);
      zoomAt(e.shiftKey ? 0.5 : 2, p.x, p.y);
    });

    // ---- Highlighting & filtering ------------------------------------------

    var litCache = null;
    function currentLit() {
      if (litCache !== null) return litCache || null;
      var base = state.focus || state.selected;
      if (!base) { litCache = false; return null; }
      var w = S.byId[base];
      var lit = {};
      lit[base] = true;
      if (state.lineage && base === state.selected) {
        S.lineage(base, 'up').forEach(function (id) { lit[id] = 'up'; });
        S.lineage(base, 'down').forEach(function (id) { lit[id] = 'down'; });
      } else {
        w.inf.forEach(function (id) { lit[id] = 'up'; });
        w.children.forEach(function (id) { lit[id] = 'down'; });
      }
      litCache = lit;
      return lit;
    }

    function refreshHighlight() {
      litCache = null;
      var lit = currentLit();
      var base = state.focus || state.selected;
      svg.classList.toggle('has-focus', !!lit);
      for (var id in stars) {
        stars[id].classList.toggle('lit', !!(lit && lit[id]));
        stars[id].classList.toggle('selected', id === state.selected);
      }
      linkEls.forEach(function (l) {
        var on = false;
        if (lit) {
          var ls = lit[l.source];
          var lt = lit[l.target];
          if (l.source === base || l.target === base) on = !!(ls && lt);
          else if (state.lineage && base === state.selected) on = (ls === 'up' && (lt === 'up')) || (ls === 'down' && lt === 'down');
        }
        l.el.classList.toggle('lit', on);
      });
      queueLabels();
    }

    function setFocus(id) {
      if (state.focus === id) return;
      state.focus = id;
      refreshHighlight();
    }

    var passCount = S.works.length;
    function refreshFilter() {
      var f = state.filter;
      var outIds = {};
      passCount = 0;
      S.works.forEach(function (w) {
        var out = !!(f && !f(w));
        if (out) outIds[w.id] = true;
        else passCount++;
        stars[w.id].classList.toggle('out', out);
      });
      linkEls.forEach(function (l) { l.el.classList.toggle('out', !!(outIds[l.source] || outIds[l.target])); });
      queueLabels();
    }

    // ---- Views -------------------------------------------------------------

    function setView(v, animate) {
      if (v === view || !G[v]) return;
      stopMove();
      view = v;
      decorGalaxy.classList.toggle('off', v !== 'galaxy');
      decorTimeline.classList.toggle('off', v !== 'timeline');
      linksG.classList.add('moving');
      route.style.opacity = 0;
      var from = {};
      for (var id in cur) from[id] = { x: cur[id].x, y: cur[id].y };
      var to = G[v].pos;
      var d = animate ? 1100 : 0;
      stopMove = tween(d, function (e) {
        for (var id in cur) {
          cur[id].x = from[id].x + (to[id].x - from[id].x) * e;
          cur[id].y = from[id].y + (to[id].y - from[id].y) * e;
        }
        placeStars();
        queueLabels();
      }, function () {
        drawLinks();
        drawRoute();
        linksG.classList.remove('moving');
        route.style.opacity = '';
      });
      animateTo(fitTransform(v), d);
    }

    function flyTo(id, minK) {
      var p = G[view].pos[id];
      var k = clampK(Math.max(t.k, minK || 2.2));
      var W = svg.clientWidth - insets.left - insets.right;
      var H = svg.clientHeight - insets.top - insets.bottom;
      animateTo({ k: k, x: insets.left + W / 2 - p.x * k, y: insets.top + H / 2 - p.y * k }, 800);
    }

    // Frame a set of works in the current view, leaving room for their labels.
    function fitTo(ids, duration) {
      var pos = G[view].pos;
      var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      ids.forEach(function (id) {
        var p = pos[id];
        x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y);
        x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
      });
      var W = svg.clientWidth - insets.left - insets.right - 220;
      var H = svg.clientHeight - insets.top - insets.bottom - 60;
      var k = clampK(Math.min(2.6, W / Math.max(x1 - x0, 1), H / Math.max(y1 - y0, 1)));
      var cx = (x0 + x1) / 2 + 60 / k;
      var cy = (y0 + y1) / 2;
      animateTo({
        k: k,
        x: insets.left + (svg.clientWidth - insets.left - insets.right) / 2 - cx * k,
        y: insets.top + (svg.clientHeight - insets.top - insets.bottom) / 2 - cy * k
      }, duration === undefined ? 900 : duration);
    }

    function resize() {
      sizeCanvas();
      queueLabels();
    }
    window.addEventListener('resize', resize);

    // ---- Init & API --------------------------------------------------------

    sizeCanvas();
    readDust();
    drawLinks();
    var initial = fitTransform('galaxy');
    t.x = initial.x; t.y = initial.y; t.k = initial.k;
    applyTransform();

    api.setView = setView;
    api.getView = function () { return view; };
    api.fit = function (animate) { animateTo(fitTransform(view), animate ? 700 : 0); };
    api.zoomBy = function (f) {
      var W = svg.clientWidth - insets.left - insets.right;
      var H = svg.clientHeight - insets.top - insets.bottom;
      var target = clampK(t.k * f);
      var cx = insets.left + W / 2;
      var cy = insets.top + H / 2;
      var ff = target / t.k;
      animateTo({ k: target, x: cx - (cx - t.x) * ff, y: cy - (cy - t.y) * ff }, 300);
    };
    api.flyTo = flyTo;
    api.fitTo = fitTo;
    api.setInsets = function (i) { insets = i; };
    api.select = function (id) { state.selected = id; refreshHighlight(); };
    api.focus = setFocus;
    api.setLineage = function (on) { state.lineage = on; refreshHighlight(); };
    api.setFilter = function (f) { state.filter = f; refreshFilter(); };
    api.setShowLinks = function (on) { linksG.classList.toggle('hidden', !on); };
    api.setRoute = function (ids) { state.route = ids; drawRoute(); };
    api.refreshTheme = function () { readDust(); drawStarfield(); };
    api.isVisible = function (id) {
      var p = cur[id];
      var sx = t.x + p.x * t.k;
      var sy = t.y + p.y * t.k;
      return sx > insets.left + 20 && sx < svg.clientWidth - insets.right - 20 && sy > insets.top + 20 && sy < svg.clientHeight - insets.bottom - 20;
    };
    return api;
  };
})(window.SFMAP);
