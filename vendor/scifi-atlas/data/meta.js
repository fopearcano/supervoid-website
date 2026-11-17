/*
 * Atlas of Imagined Futures: dataset scaffolding.
 *
 * Sectors are the thematic regions of the chart, listed in clockwise order
 * starting from the top. Neighbouring sectors are deliberately related
 * (Military SF sits between Space Opera and First Contact, Cyberpunk between
 * the Posthuman and Robots), so that influence lines stay short where the
 * genre's own conversations are close.
 *
 * Eras are the concentric rings. A work's distance from the centre encodes
 * its year of first publication.
 *
 * Works live in data/sectors/<sector>.js and register themselves with
 * SFMAP.addWorks(). See README.md for the field reference.
 */
window.SFMAP = window.SFMAP || {};

(function (S) {
  S.sectors = [
    { id: 'opera', name: 'Space Opera & Galactic Empire', short: 'Space Opera',
      blurb: 'Vast canvases of interstellar war, politics and adventure, from pulp ray-guns to the far-future empires of the Culture and the Radch.' },
    { id: 'military', name: 'Military SF', short: 'Military',
      blurb: 'Soldiers, fleets and the cost of war. An argument that has run from Starship Troopers through all of its rebuttals.' },
    { id: 'contact', name: 'First Contact & the Alien', short: 'First Contact',
      blurb: 'Meetings with the truly other: invaders, enigmas, and minds that may never be understood.' },
    { id: 'hard', name: 'Hard SF & Exploration', short: 'Hard SF',
      blurb: 'Fiction that plays fair with physics and engineering. Voyages to the Moon, the deep sea and the stars.' },
    { id: 'eco', name: 'Ecology & Climate', short: 'Ecology',
      blurb: 'Planets as living systems, from desert worlds and sentient forests to drowned cities and the climate crisis.' },
    { id: 'apoc', name: 'Apocalypse & After', short: 'Apocalypse',
      blurb: 'Plague, bombs and slow collapse, and the stories people tell each other in the ruins.' },
    { id: 'dystopia', name: 'Dystopia & Control', short: 'Dystopia',
      blurb: 'Societies of surveillance, conformity and engineered happiness, and the people who refuse them.' },
    { id: 'utopia', name: 'Utopia & Political Imagination', short: 'Utopia',
      blurb: 'Blueprints for better worlds, and the long argument about whether any of them could work.' },
    { id: 'identity', name: 'Gender, Race & Identity', short: 'Identity',
      blurb: 'Science fiction as a tool for rethinking gender, race and colonialism, and for asking who gets to have a future.' },
    { id: 'posthuman', name: 'Evolution & the Posthuman', short: 'Posthuman',
      blurb: 'Mutation, uplift, engineered bodies, uploaded minds, and whatever comes after us.' },
    { id: 'cyber', name: 'Cyberpunk & Virtual Worlds', short: 'Cyberpunk',
      blurb: 'High tech and low life: networks, simulations, corporations and the minds that live inside the machine.' },
    { id: 'ai', name: 'Robots & Artificial Minds', short: 'Robots & AI',
      blurb: 'Made beings, from Frankenstein’s creature and the first robots to companionable machines that want to be left alone.' },
    { id: 'time', name: 'Time Travel & Alternate History', short: 'Time & History',
      blurb: 'Paradoxes, branching timelines, and histories that went another way.' },
    { id: 'inner', name: 'New Wave & Inner Space', short: 'New Wave',
      blurb: 'Experiments in style, myth and perception that turned science fiction toward the mind and away from the machine.' },
    { id: 'satire', name: 'Satire & Comic SF', short: 'Satire',
      blurb: 'Imaginary voyages that skewer the present, from Swift’s flying island to the Hitchhiker’s Guide.' }
  ];

  // `start` is inclusive. The first era starts at the beginning of the chart.
  S.eras = [
    { id: 'ancestors', name: 'Ancestors', start: 0, end: 1817,
      blurb: 'Imaginary voyages, utopias and philosophical fantasies written long before the genre had a name.' },
    { id: 'romance', name: 'Scientific Romance', start: 1818, end: 1925,
      blurb: 'From Frankenstein to Verne and Wells: science becomes the engine of the fantastic.' },
    { id: 'pulp', name: 'Pulp Era', start: 1926, end: 1937,
      blurb: 'Hugo Gernsback launches Amazing Stories in 1926 and gives the genre its magazines, its fandom and, soon, its name.' },
    { id: 'golden', name: 'Golden Age', start: 1938, end: 1959,
      blurb: 'John W. Campbell takes over Astounding. Ideas, engineers, the Three Laws and the first paperbacks.' },
    { id: 'newwave', name: 'New Wave', start: 1960, end: 1979,
      blurb: 'Literary experiment, the social sciences, sex, drugs and inner space. The genre grows up and argues with itself.' },
    { id: 'postmodern', name: 'Cyberpunk & Postmodern', start: 1980, end: 1999,
      blurb: 'Networks, corporations and the body made of data, while the mainstream starts borrowing SF’s tools.' },
    { id: 'newcentury', name: 'New Century', start: 2000, end: 2100,
      blurb: 'A global, more diverse field writing about climate, artificial minds, empire and the cost of the future.' }
  ];

  S.awardNames = {
    Hugo: 'Hugo Award',
    Nebula: 'Nebula Award',
    Clarke: 'Arthur C. Clarke Award'
  };

  // First-magnitude works: always labelled and drawn brighter, whatever
  // their number of links inside this dataset.
  S.landmarks = [
    'true-history', 'utopia-more', 'gullivers-travels', 'frankenstein', 'twenty-thousand-leagues',
    'time-machine', 'war-of-the-worlds', 'rur', 'we', 'brave-new-world', 'last-and-first-men',
    'nineteen-eighty-four', 'i-robot', 'martian-chronicles', 'foundation', 'childhoods-end',
    'fahrenheit-451', 'stars-my-destination', 'starship-troopers', 'canticle-for-leibowitz',
    'flowers-for-algernon', 'solaris', 'man-in-the-high-castle', 'dune', 'do-androids-dream',
    '2001-space-odyssey', 'left-hand-of-darkness', 'slaughterhouse-five', 'ringworld',
    'rendezvous-with-rama', 'dispossessed', 'forever-war', 'kindred', 'hitchhikers-guide',
    'neuromancer', 'enders-game', 'handmaids-tale', 'hyperion', 'snow-crash',
    'parable-of-the-sower', 'story-of-your-life', 'three-body-problem', 'the-road',
    'ancillary-justice', 'station-eleven', 'fifth-season', 'ministry-for-the-future'
  ];

  S.works = [];

  S.addWorks = function (sector, list) {
    list.forEach(function (w) {
      w.sector = sector;
      S.works.push(w);
    });
  };
})(window.SFMAP);
