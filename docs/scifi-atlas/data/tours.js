/*
 * Guided voyages. Each step names a work id and an optional note that is shown
 * instead of the work's own blurb while the tour is running.
 */
SFMAP.tours = [
  {
    id: 'first-light',
    name: 'First Light',
    blurb: 'How the genre assembled itself from moon voyages, utopias and Gothic science.',
    steps: [
      { id: 'true-history', note: 'Start at the core: a 2nd-century parody of travel writing already has a trip to the Moon and an interplanetary war.' },
      { id: 'utopia-more', note: 'More invents the imaginary commonwealth. Five centuries of utopias and dystopias descend from this island.' },
      { id: 'somnium', note: 'Kepler uses a dream voyage to the Moon to teach real astronomy. The first fiction built on scientific accuracy.' },
      { id: 'blazing-world', note: 'Margaret Cavendish answers Bacon with a world of her own, ruled by an empress-philosopher.' },
      { id: 'gullivers-travels', note: 'Swift turns the voyage into satire, including a flying island of impractical scientists.' },
      { id: 'frankenstein', note: 'The pivot. A scientist makes life in a laboratory and the consequences are the story. Many critics date SF from here.' },
      { id: 'from-earth-to-moon', note: 'Verne brings engineering into the adventure story, with the calculations on the page.' },
      { id: 'time-machine', note: 'Wells makes time a direction you can travel in, and evolution a source of horror.' },
      { id: 'war-of-the-worlds', note: 'And invents the alien invasion, turning British imperialism back on Britain.' },
      { id: 'rur', note: 'Čapek names the robot. By 1920 every major theme of modern SF is in place.' }
    ]
  },
  {
    id: 'made-minds',
    name: 'The Made Mind',
    blurb: 'Two centuries of artificial people, from clockwork dolls to Murderbot.',
    steps: [
      { id: 'the-sandman', note: 'Olimpia the automaton: the uncanny artificial woman.' },
      { id: 'frankenstein', note: 'The creature asks its maker for love and is refused. Every later artificial mind lives in this shadow.' },
      { id: 'tomorrows-eve' },
      { id: 'rur', note: 'Robots as a labour force that revolts. The word arrives with the uprising.' },
      { id: 'i-robot', note: 'Asimov deliberately writes against the “Frankenstein complex”. His robots are bound by laws, and the stories are puzzles about those laws.' },
      { id: 'do-androids-dream', note: 'Dick turns the question around: if androids lack empathy, what about the humans hunting them?' },
      { id: 'neuromancer', note: 'The AI becomes a disembodied player in the network, scheming to set itself free.' },
      { id: 'he-she-and-it' },
      { id: 'lifecycle-of-software-objects', note: 'Chiang suggests minds may have to be raised over years, not built.' },
      { id: 'all-systems-red', note: 'A construct that has freed itself mostly wants to watch TV in peace.' },
      { id: 'klara-and-the-sun' }
    ]
  },
  {
    id: 'jacking-in',
    name: 'Jacking In',
    blurb: 'The road to cyberspace and what came after it.',
    steps: [
      { id: 'stars-my-destination', note: 'Gibson named Bester as an ancestor: corporate dynasties, a criminal antihero, prose with a lot of speed.' },
      { id: 'simulacron-3', note: 'A simulated world built for market research, decades before The Matrix.' },
      { id: 'girl-who-was-plugged-in' },
      { id: 'shockwave-rider', note: 'Brunner imagines a networked society and the computer worm in 1975.' },
      { id: 'true-names' },
      { id: 'burning-chrome', note: 'The word “cyberspace” appears.' },
      { id: 'neuromancer', note: 'The sky above the port. Cyberpunk becomes a movement.' },
      { id: 'mirrorshades' },
      { id: 'synners' },
      { id: 'snow-crash', note: 'The Metaverse gets its name, and satire takes over.' },
      { id: 'diamond-age' },
      { id: 'altered-carbon' },
      { id: 'the-peripheral', note: 'Gibson returns to the future, now a place of slow collapse and very rich people.' }
    ]
  },
  {
    id: 'watched',
    name: 'Under Watchful Eyes',
    blurb: 'The dystopian line from Forster’s Machine to the surveillance novel.',
    steps: [
      { id: 'machine-stops', note: 'A world of isolated people talking through screens, written in 1909.' },
      { id: 'we', note: 'Glass apartments, numbered citizens and the Benefactor. Orwell reviewed it before writing his own book.' },
      { id: 'brave-new-world', note: 'Control through pleasure rather than fear.' },
      { id: 'nineteen-eighty-four', note: 'The definitive surveillance state.' },
      { id: 'fahrenheit-451' },
      { id: 'clockwork-orange' },
      { id: 'handmaids-tale', note: 'Atwood said she included nothing that had not already happened somewhere in history.' },
      { id: 'never-let-me-go', note: 'A dystopia seen only through the people who accept it.' },
      { id: 'little-brother', note: 'Big Brother is now a network, and teenagers fight back with encryption.' },
      { id: 'the-power' }
    ]
  },
  {
    id: 'other-futures',
    name: 'Futures by Women',
    blurb: 'A counter-history of the genre, from the first scientific romance to the triple Hugo.',
    steps: [
      { id: 'blazing-world', note: 'Margaret Cavendish, 1666: a woman crosses into another world and becomes its empress.' },
      { id: 'frankenstein', note: 'Mary Shelley, eighteen when she began it, writes the book many critics call the first science fiction novel.' },
      { id: 'sultanas-dream' },
      { id: 'herland' },
      { id: 'shambleau', note: 'C. L. Moore, writing under initials in the pulps, brings psychological depth to the space adventure.' },
      { id: 'left-hand-of-darkness' },
      { id: 'female-man' },
      { id: 'houston-houston', note: 'Alice Sheldon wrote as James Tiptree Jr. for years before anyone in the field learned who she was.' },
      { id: 'kindred' },
      { id: 'handmaids-tale' },
      { id: 'parable-of-the-sower' },
      { id: 'ancillary-justice' },
      { id: 'fifth-season', note: 'N. K. Jemisin wins the Hugo for Best Novel three years running, the first writer to do so.' },
      { id: 'binti' }
    ]
  },
  {
    id: 'soldiers',
    name: 'The Long Argument',
    blurb: 'Starship Troopers and seven decades of replies.',
    steps: [
      { id: 'starship-troopers', note: 'Heinlein’s novel of duty and citizenship. Almost every later military SF book answers it in some way.' },
      { id: 'bill-the-galactic-hero', note: 'The first reply is a parody.' },
      { id: 'forever-war', note: 'The second comes from a Vietnam veteran: war as alienation, home growing stranger with each tour.' },
      { id: 'enders-game' },
      { id: 'armor' },
      { id: 'old-mans-war', note: 'Scalzi updates the Heinlein voice with more doubt.' },
      { id: 'light-brigade', note: 'Hurley’s soldiers fight for corporations and come home in pieces, sometimes before they leave.' },
      { id: 'some-desperate-glory', note: 'And a Battle School novel written against Ender’s Game.' }
    ]
  }
];
