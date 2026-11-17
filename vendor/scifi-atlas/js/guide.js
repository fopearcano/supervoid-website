/*
 * HTML for the Field Guide view: themes, the science behind the stories, and
 * writing methods. Every entry links back to works on the chart.
 */
(function (S) {
  'use strict';

  var esc = S.esc;
  var G = S.guide;

  S.guideTabs = [
    { id: 'themes', label: 'Themes', items: G.themes },
    { id: 'science', label: 'The Science', items: G.science },
    { id: 'craft', label: 'Writing Methods', items: G.craft }
  ];

  var intros = {
    themes: 'The questions science fiction keeps returning to. Each theme is tied to its sector of the chart, with the motifs it reuses and the books where it is worked out most fully.',
    science: 'The real science the stories draw on. Each entry gives one figure that sets the scale, what the science says, how fiction uses it, and where fiction bends it.',
    craft: 'Techniques that are particular to writing science fiction. Each method has its origin, how it works, an example from a book in the atlas, a common mistake, and an exercise to try.'
  };

  // Book titles are marked *like this* in the guide text. Titles of works in
  // the atlas become links to their records; other titles are just set as titles.
  var titleIndex = {};
  S.works.forEach(function (w) {
    var short = w.title.split(/[;:]\s/)[0];
    titleIndex[w.title] = w.id;
    if (!titleIndex[short]) titleIndex[short] = w.id;
  });

  function rich(text) {
    return text.split(/\*([^*]+)\*/).map(function (part, i) {
      if (i % 2 === 0) return esc(part);
      var id = titleIndex[part];
      return id
        ? '<button type="button" class="g-cite" data-goto="' + id + '">' + esc(part) + '</button>'
        : '<cite class="g-cite">' + esc(part) + '</cite>';
    }).join('');
  }

  S.guideEntry = function (tab, id) {
    var t = S.guideTabs.find(function (x) { return x.id === tab; });
    return t && t.items.find(function (e) { return e.id === id; });
  };

  function chips(ids) {
    return '<ul class="g-works" aria-label="Books in the atlas">' + ids.map(function (id) {
      var w = S.byId[id];
      return '<li><button type="button" class="g-chip sec-' + w.sector + '" data-goto="' + w.id + '">' +
        '<span class="dot"></span><cite>' + esc(w.title) + '</cite> <span class="yr">' + esc(S.yearText(w)) + '</span></button></li>';
    }).join('') + '</ul>';
  }

  function footer(tab, e) {
    return '<div class="g-foot"><h4 class="g-h">Read in the atlas</h4>' + chips(e.works) +
      '<button type="button" class="btn g-spot" data-spot="' + tab + ':' + e.id + '">Spotlight these ' + e.works.length +
      ' on the map</button></div>';
  }

  function theme(e) {
    var sector = S.sectorById[e.sector];
    return '<article class="g-card sec-' + e.sector + '" id="g-' + e.id + '" tabindex="-1">' +
      '<p class="g-kicker"><span class="dot"></span>' + esc(sector.short) + ' sector</p>' +
      '<h3 class="g-name">' + esc(e.name) + '</h3>' +
      '<p class="g-summary">' + rich(e.summary) + '</p>' +
      '<h4 class="g-h">Questions it asks</h4><ul class="g-questions">' +
      e.questions.map(function (q) { return '<li>' + rich(q) + '</li>'; }).join('') + '</ul>' +
      '<h4 class="g-h">Recurring motifs</h4><p class="g-motifs">' +
      e.motifs.map(esc).join('<span aria-hidden="true"> · </span>') + '</p>' +
      footer('themes', e) + '</article>';
  }

  function science(e) {
    return '<article class="g-sci" id="g-' + e.id + '" tabindex="-1">' +
      '<div class="g-fact"><span class="g-fact-value">' + esc(e.fact.value) + '</span>' +
      '<span class="g-fact-label">' + rich(e.fact.label) + '</span></div>' +
      '<div class="g-body"><h3 class="g-name">' + esc(e.name) + '</h3>' +
      '<dl class="g-dl"><dt>The science</dt><dd>' + rich(e.science) + '</dd>' +
      '<dt>In the fiction</dt><dd>' + rich(e.fiction) + '</dd>' +
      '<dt>Where it bends</dt><dd>' + rich(e.bends) + '</dd></dl>' +
      footer('science', e) + '</div></article>';
  }

  function craft(e) {
    var ex = S.byId[e.example.id];
    return '<article class="g-craft" id="g-' + e.id + '" tabindex="-1">' +
      '<h3 class="g-name">' + esc(e.name) + '</h3>' +
      '<p class="g-origin">' + rich(e.origin) + '</p>' +
      '<p class="g-summary">' + rich(e.summary) + '</p>' +
      '<div class="g-cols"><div><h4 class="g-h">How it’s done</h4><ul class="g-how">' +
      e.how.map(function (h) { return '<li>' + rich(h) + '</li>'; }).join('') + '</ul></div>' +
      '<figure class="g-example"><figcaption class="g-h">In practice</figcaption><p>' + rich(e.example.text) + '</p>' +
      '<button type="button" class="g-source sec-' + ex.sector + '" data-goto="' + ex.id + '"><span class="dot"></span>' +
      '<cite>' + esc(ex.title) + '</cite>, ' + esc(ex.author) + '</button></figure></div>' +
      '<div class="g-cols"><div><h4 class="g-h">Watch out for</h4><p class="g-pitfall">' + rich(e.pitfall) + '</p></div>' +
      '<div><h4 class="g-h">Try it</h4><p class="g-exercise">' + rich(e.exercise) + '</p></div></div>' +
      footer('craft', e) + '</article>';
  }

  function contents(items) {
    return '<nav class="g-contents" aria-label="In this section"><ul>' + items.map(function (e) {
      return '<li><button type="button" data-jump="' + e.id + '">' + esc(e.name) + '</button></li>';
    }).join('') + '</ul></nav>';
  }

  function panel(tab) {
    if (tab === 'themes') return '<div class="g-grid">' + G.themes.map(theme).join('') + '</div>';
    if (tab === 'craft') return '<div class="g-list">' + G.craft.map(craft).join('') + '</div>';
    return G.fields.map(function (f) {
      var items = G.science.filter(function (e) { return e.field === f; });
      return '<section class="g-field"><h3 class="g-field-name">' + esc(f) + '</h3><div class="g-list">' +
        items.map(science).join('') + '</div></section>';
    }).join('');
  }

  S.renderGuide = function (tab) {
    var current = S.guideTabs.find(function (t) { return t.id === tab; });
    var html = '<div class="guide-inner"><header class="guide-head">' +
      '<p class="guide-eyebrow">Field guide</p>' +
      '<h2 class="guide-title">How science fiction works</h2>' +
      '<div class="guide-tabs" role="tablist" aria-label="Guide sections">' +
      S.guideTabs.map(function (t) {
        var on = t.id === tab;
        return '<button type="button" role="tab" id="gtab-' + t.id + '" aria-controls="guide-panel" aria-selected="' + on + '"' +
          ' tabindex="' + (on ? 0 : -1) + '" data-gtab="' + t.id + '">' + esc(t.label) +
          ' <span class="n">' + t.items.length + '</span></button>';
      }).join('') + '</div></header>';
    html += '<div class="guide-panel" id="guide-panel" role="tabpanel" aria-labelledby="gtab-' + tab + '">' +
      '<p class="guide-intro">' + esc(intros[tab]) + '</p>' + contents(current.items) + panel(tab) + '</div></div>';
    return html;
  };
})(window.SFMAP);
