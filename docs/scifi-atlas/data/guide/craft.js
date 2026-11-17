/*
 * Field guide: techniques particular to writing science fiction.
 * `example.id` is the atlas work the example comes from; `works` are atlas ids.
 */
SFMAP.guide = SFMAP.guide || {};
SFMAP.guide.craft = [
  {
    id: 'novum', name: 'The novum',
    origin: 'Darko Suvin, *Metamorphoses of Science Fiction* (1979)',
    summary: 'Suvin defined science fiction by its novum, a “new thing” such as an invention, a discovery or a social change, which the story treats as real and explores logically. The world around it is estranged from ours but still explained by reason rather than magic. He called this effect cognitive estrangement.',
    how: [
      'Choose one change and state it in a single precise sentence.',
      'Ask what it alters in work, law, money, family and love.',
      'Let the plot grow out of those consequences rather than arriving from outside them.'
    ],
    example: { id: 'beggars-in-spain', text: 'The novum is one genetic edit: children who never need to sleep. Kress follows that single change into school, economics, jealousy and politics.' },
    pitfall: 'A novum that changes only the scenery. If the story would run the same without it, it is decoration.',
    exercise: 'Write your world’s change in one sentence, then list ten ways it would alter an ordinary Tuesday.',
    works: ['beggars-in-spain', 'flowers-for-algernon', 'lathe-of-heaven', 'the-power']
  },
  {
    id: 'one-impossible-thing', name: 'One impossible thing',
    origin: 'H. G. Wells, preface to his collected scientific romances (1933)',
    summary: 'Wells advised writers to help the reader “domesticate the impossible hypothesis”, then keep everything else human and real. The effect depends on contrast: one wild premise, handled with ordinary, specific detail.',
    how: [
      'Commit to a single break with reality.',
      'Keep everything else everyday and exact: weather, food, money, the way people talk.',
      'Never add a second miracle to get out of a plot problem.'
    ],
    example: { id: 'time-machine', text: 'Wells allows one machine. Everything after it is careful observation: the fruit the Eloi eat, the Thames valley in the year 802,701, the narrator’s growing fear of the dark.' },
    pitfall: 'Miracle creep, where every chapter introduces a new exception and nothing is at stake any more.',
    exercise: 'Write a scene where the impossible element is present but the characters are arguing about something mundane.',
    works: ['time-machine', 'war-of-the-worlds', 'lathe-of-heaven', 'never-let-me-go']
  },
  {
    id: 'extrapolation', name: 'Extrapolation: “If this goes on…”',
    origin: 'Named after Robert A. Heinlein’s 1940 novella “If This Goes On—”',
    summary: 'Take a trend that is already visible and push it forward, in steps that each feel plausible, until it becomes strange. Most dystopias and much near-future fiction work this way.',
    how: [
      'Start from a trend with real numbers behind it.',
      'Extend it, then imagine the reactions it provokes: laws, fashions, black markets, backlash.',
      'Let two or three trends collide rather than following one in isolation.'
    ],
    example: { id: 'stand-on-zanzibar', text: 'Brunner took 1960s population projections to seven billion people in 2010 and filled the world with their consequences, from eugenic laws to mass-media noise.' },
    pitfall: 'Straight-line prediction. Trends rarely continue forever, and the most interesting story is often in the counter-trend.',
    exercise: 'Take a statistic from this week’s news and write the headline it produces thirty years from now.',
    works: ['space-merchants', 'stand-on-zanzibar', 'handmaids-tale', 'feed', 'ministry-for-the-future']
  },
  {
    id: 'incluing', name: 'Incluing: worldbuilding by implication',
    origin: 'Term coined by Jo Walton (2004). Heinlein’s “The door dilated” comes from *Beyond This Horizon* (1942)',
    summary: 'Instead of explaining the world, scatter clues through action and let the reader assemble them. Heinlein’s “The door dilated” gives you the technology, the setting and the character’s indifference to both in three words. Experienced SF readers treat every such detail as information.',
    how: [
      'Let characters use things without explaining them, the way you use a phone.',
      'Place essential facts where a character needs them to make a choice.',
      'Trust the reader to hold a question open for a few pages.'
    ],
    example: { id: 'neuromancer', text: '“The sky above the port was the color of television, tuned to a dead channel.” The first sentence sets the mood, the technology and a whole sensibility before any exposition.' },
    pitfall: 'Too many unexplained terms at once, so the reader cannot tell which ones matter.',
    exercise: 'Describe a character’s morning in your world without explaining any technology or custom. Ask a reader what they worked out.',
    works: ['neuromancer', 'shadow-of-the-torturer', 'ancillary-justice', 'memory-called-empire']
  },
  {
    id: 'info-dump', name: 'The info-dump, and how to avoid it',
    origin: 'Named in the Turkey City Lexicon, a workshop glossary compiled by Lewis Shiner and Bruce Sterling',
    summary: 'Some stories need a block of explanation. The info-dump delivers it as a lecture that stops the story. Its cousin, “As you know, Bob”, has characters tell each other things they both already know.',
    how: [
      'Deliver information at the moment a character needs it to act.',
      'Use someone who genuinely does not know: a newcomer, a child, a visitor.',
      'Turn the explanation into conflict, with two characters who disagree about the facts.',
      'Or make the explanation itself a pleasure, as an in-world document or a joke.'
    ],
    example: { id: 'hitchhikers-guide', text: 'Adams turns exposition into comedy by quoting entries from the Guide itself, so the explanations become some of the best jokes in the book.' },
    pitfall: 'Front-loading a history lesson before the reader cares about anyone in it.',
    exercise: 'Rewrite a page of explanation as an argument between two characters who each know half of it.',
    works: ['foundation', 'dune', 'hitchhikers-guide', 'the-martian']
  },
  {
    id: 'neologism', name: 'Invented words and languages',
    origin: 'A long tradition. The Turkey City Lexicon warns against “calling a rabbit a smeerp”',
    summary: 'A few well-made words can carry a world. “Robot”, “cyberspace” and “Newspeak” all entered English from SF. Whole invented dialects, such as Nadsat or *Riddley Walker*’s future English, make the reader do the work of a time traveller.',
    how: [
      'Coin words only for things that are new in the world.',
      'Build them the way real languages do: compounds, borrowings, slang and worn-down phrases.',
      'Let context define each word; avoid glossaries where you can.'
    ],
    example: { id: 'clockwork-orange', text: 'Burgess built Nadsat from English and Russian-derived slang (droog, horrorshow), so the reader learns it by immersion and ends up thinking in Alex’s voice.' },
    pitfall: 'The smeerp: an exotic name for an ordinary thing, which adds strangeness without meaning.',
    exercise: 'Invent three slang words a teenager in your world would use, and work out where each one came from.',
    works: ['rur', 'nineteen-eighty-four', 'clockwork-orange', 'riddley-walker', 'burning-chrome', 'snow-crash']
  },
  {
    id: 'documents', name: 'Found documents and invented scholarship',
    origin: 'An old device, used by *The Iron Heel* (1908) and *The Handmaid’s Tale*',
    summary: 'Presenting the story as an artefact from the future (a manuscript, a log, letters, a lab report, an academic paper) makes the world feel solid, because a document implies the world that produced it. A frame can also overturn the story at the end.',
    how: [
      'Decide who wrote the document, for whom, and when and how it was found.',
      'Use the gap between the writer and the later reader for irony.',
      'Let footnotes, epigraphs or editors disagree with the narrator.'
    ],
    example: { id: 'handmaids-tale', text: 'The novel ends with “Historical Notes”, a transcript of a 2195 academic symposium on Gilead. The scholars’ detachment changes how the reader looks back on Offred’s story.' },
    pitfall: 'A frame that only explains. It should add a second point of view, not more length.',
    exercise: 'Write the footnote a historian 200 years from now would add to one sentence of your story.',
    works: ['iron-heel', 'flowers-for-algernon', 'dune', 'handmaids-tale', 'the-martian', 'time-war']
  },
  {
    id: 'collage', name: 'Collage and the many-voiced world',
    origin: 'Adapted by John Brunner from John Dos Passos’s *U.S.A.* trilogy',
    summary: 'A world-sized story can be told in fragments: news clips, adverts, overheard voices and slogans, threaded between a few continuing characters. The reader assembles a whole society out of its noise.',
    how: [
      'Alternate a small cast’s chapters with short, varied fragments.',
      'Make each fragment carry one new fact about the world.',
      'Let juxtaposition comment on events so the narrator does not have to.'
    ],
    example: { id: 'stand-on-zanzibar', text: 'Brunner sorts his chapters into four kinds, “Context”, “Continuity”, “Tracking with Closeups” and “The Happening World”, and the mix becomes the texture of 2010.' },
    pitfall: 'Fragments that repeat one point. Each piece should add a new layer.',
    exercise: 'Write five 30-word fragments (an advert, a headline, a text message, a law, a joke) that together describe your world.',
    works: ['stand-on-zanzibar', 'sheep-look-up', 'hyperion', 'cloud-atlas', 'ministry-for-the-future']
  },
  {
    id: 'outsider', name: 'The outsider narrator',
    origin: 'As old as Gulliver; a staple of utopias and first-contact stories',
    summary: 'A visitor sees a world without the locals’ habits, so the reader learns alongside them and our own customs start to look strange. The reverse, a native who takes everything for granted, can be even more unsettling.',
    how: [
      'Decide what your narrator misunderstands, and make each misunderstanding reveal something.',
      'Decide what they never notice because, to them, it is normal.',
      'Let the outsider change as they understand more.'
    ],
    example: { id: 'left-hand-of-darkness', text: 'The envoy Genly Ai keeps reading the Gethenians through his own ideas about men and women, and the novel makes the reader notice that bias in themselves.' },
    pitfall: 'An outsider who conveniently knows exactly what the reader needs at each moment.',
    exercise: 'Describe something ordinary from our world, such as a supermarket or a wedding, as a visitor who has never seen one.',
    works: ['gullivers-travels', 'looking-backward', 'left-hand-of-darkness', 'never-let-me-go', 'embassytown', 'memory-called-empire']
  },
  {
    id: 'thought-experiment', name: 'Fiction as thought experiment',
    origin: 'Ursula K. Le Guin, introduction to *The Left Hand of Darkness* (1976)',
    summary: 'Le Guin wrote that science fiction is not predictive but descriptive, and called her novel a thought experiment: change one condition, hold the rest, and see what follows. The question is not “will this happen?” but “what does this show about us?”',
    how: [
      'Frame your premise as a question about the present.',
      'Hold everything constant except the variable you changed.',
      'Follow the logic even when the answer is uncomfortable or ambiguous.'
    ],
    example: { id: 'dispossessed', text: 'Le Guin sets an anarchist moon against its capitalist twin planet and gives neither a clean victory. Its subtitle, “An Ambiguous Utopia”, states the method.' },
    pitfall: 'An experiment rigged to prove what the author already believed.',
    exercise: 'State your story’s premise as a question: “What would happen to ___ if ___?”',
    works: ['cold-equations', 'left-hand-of-darkness', 'dispossessed', 'beggars-in-spain', 'the-power']
  },
  {
    id: 'first-principles', name: 'Worldbuilding from first principles',
    origin: 'Hal Clement, “Whirligig World” (1953); Poul Anderson, “The Creation of Imaginary Worlds” (1974)',
    summary: 'Hard SF often starts with numbers: the star’s type, the planet’s mass and spin, its atmosphere and energy budget. Each constraint narrows the possibilities for climate, life and culture, and the story grows out of the constraints.',
    how: [
      'Work out the basics before drafting: gravity, day length, temperature, available energy.',
      'Ask what life could exist there and what it would need.',
      'Keep a notebook of decisions so the world stays consistent.'
    ],
    example: { id: 'mission-of-gravity', text: 'Clement published the calculations behind Mesklin and treated the novel as a game with his readers, who were welcome to find his mistakes.' },
    pitfall: 'Putting the spreadsheet on the page. Most of this work should stay invisible.',
    exercise: 'Pick a real exoplanet and list five ways its gravity, light or length of year would change daily life.',
    works: ['mission-of-gravity', 'ringworld', 'dragons-egg', 'red-mars', 'the-martian', 'seveneves']
  },
  {
    id: 'breakthrough', name: 'The conceptual breakthrough',
    origin: 'Peter Nicholls, *The Encyclopedia of Science Fiction* (1979)',
    summary: 'Many SF plots turn on the moment when characters, and the reader, discover that the world is not what they thought: the ship is not the universe, reality is a simulation, the object is vastly bigger than anyone imagined. Nicholls saw this as a main source of the genre’s sense of wonder.',
    how: [
      'Plant clues that make sense both before and after the reveal.',
      'Make the new frame larger, not just different.',
      'Give characters a real cost for accepting it.'
    ],
    example: { id: 'universe', text: 'The descendants of a generation ship’s crew believe the ship is the entire cosmos, until one of them reaches the control room and sees the stars.' },
    pitfall: 'A twist that cancels the story instead of enlarging it, the “it was all a dream” ending.',
    exercise: 'List three things your characters believe about their world that the reader will later discover are wrong.',
    works: ['universe', 'simulacron-3', '2001-space-odyssey', 'ubik', 'rendezvous-with-rama', 'three-body-problem']
  },
  {
    id: 'future-history', name: 'Future history and the fix-up',
    origin: 'Heinlein’s Future History chart, published in *Astounding* (1941); “fix-up” is A. E. van Vogt’s term',
    summary: 'Some writers plan a timeline of the future and set many stories at points along it, so each story deepens the others. Linked stories are often revised later into a single book, a “fix-up”.',
    how: [
      'Draft a timeline of the major changes before writing.',
      'Set stories at turning points and tell them from different viewpoints.',
      'Let later stories reveal the long consequences of earlier ones.'
    ],
    example: { id: 'foundation', text: '*Foundation* was assembled from stories in 1940s *Astounding*, each jumping further into Hari Seldon’s thousand-year plan.' },
    pitfall: 'Consistency for its own sake. The timeline should serve the stories, not the reverse.',
    exercise: 'Draw a 500-year timeline for your world with five turning points, then write the one nobody else would choose.',
    works: ['last-and-first-men', 'foundation', 'martian-chronicles', 'canticle-for-leibowitz', 'accelerando']
  },
  {
    id: 'grammar', name: 'Grammar and point of view as worldbuilding',
    origin: 'A modern technique, used memorably by Le Guin, Leckie and Jemisin',
    summary: 'The grammar of the narration can carry the world: a default pronoun, an unusual grammatical person, a narrator spread across many bodies. Readers feel the difference before they can name it.',
    how: [
      'Ask whether your world would change how a narrator refers to people, time or itself.',
      'Make one grammatical choice and hold it consistently.',
      'Use the reader’s friction on purpose, as part of the meaning.'
    ],
    example: { id: 'ancillary-justice', text: 'Breq calls everyone “she” because the Radch language does not mark gender, and readers catch themselves trying to guess.' },
    pitfall: 'A device that reads as a puzzle rather than as an expression of character.',
    exercise: 'Rewrite a paragraph in a different person or tense and note what the change reveals about the narrator.',
    works: ['left-hand-of-darkness', 'ancillary-justice', 'fifth-season', 'time-war']
  },
  {
    id: 'constraints', name: 'Writing to a constraint: Mundane SF and hopepunk',
    origin: 'The Mundane SF manifesto (Geoff Ryman and others, 2004); “hopepunk”, coined by Alexandra Rowland (2017)',
    summary: 'Some movements set rules to break the genre’s habits. Mundane SF ruled out faster-than-light travel and aliens to focus on the Earth we might actually get. Solarpunk and hopepunk insist on futures worth building, against the default of collapse.',
    how: [
      'Choose a rule that forbids your easiest option.',
      'Use the rule to find new subject matter.',
      'Check how the constraint changes the kind of conflict your story can hold.'
    ],
    example: { id: 'psalm-for-the-wild-built', text: 'Chambers builds the story on curiosity and conversation rather than violence, in a future that has already repaired its world.' },
    pitfall: 'Treating optimism as the absence of conflict. Hopeful fiction still needs something at stake.',
    exercise: 'Outline a story with no villain, where the conflict comes from a genuine trade-off.',
    works: ['the-martian', 'long-way-small-angry-planet', 'walkaway', 'ministry-for-the-future', 'psalm-for-the-wild-built']
  }
];
