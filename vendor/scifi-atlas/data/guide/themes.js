/*
 * Field guide: the big themes of science fiction. `sector` sets the colour
 * and links the theme to its region of the chart; `works` are atlas ids.
 */
SFMAP.guide = SFMAP.guide || {};
SFMAP.guide.themes = [
  {
    id: 'alien', name: 'The Alien and the Other', sector: 'contact',
    summary: 'The genre’s oldest way of thinking about difference: imagine a mind that did not evolve on Earth, then see what meeting it does to ours. Aliens run from invaders that mirror human empires to intelligences no human concept can reach.',
    questions: [
      'Could we recognize a mind built on different principles from ours?',
      'Is the alien a mirror for human others: the colonized, the stranger, the enemy?',
      'What do we owe a being we cannot understand?'
    ],
    motifs: ['invasion', 'the benevolent overlord', 'the incomprehensible ocean', 'the language barrier', 'the abandoned artifact', 'the dark forest'],
    works: ['war-of-the-worlds', 'martian-odyssey', 'childhoods-end', 'solaris', 'roadside-picnic', 'dawn', 'story-of-your-life', 'blindsight', 'three-body-problem', 'embassytown']
  },
  {
    id: 'made-minds', name: 'Artificial Minds', sector: 'ai',
    summary: 'From *Frankenstein*’s creature to Murderbot, the made mind asks what makes a person and what a maker owes what it makes. Robots begin as figures of labour and revolt; AIs become gods, slaves, children and colleagues.',
    questions: [
      'Can consciousness be built, or does it have to be grown?',
      'Who is responsible when a created being suffers, or does harm?',
      'Would an artificial mind want anything we want?'
    ],
    motifs: ['creator and creation', 'the robot revolt', 'the Three Laws', 'the empathy test', 'the AI that escapes its box', 'the companion machine'],
    works: ['frankenstein', 'rur', 'i-robot', 'do-androids-dream', 'neuromancer', 'lifecycle-of-software-objects', 'ancillary-justice', 'all-systems-red', 'klara-and-the-sun']
  },
  {
    id: 'time', name: 'Time, Causality and Other Histories', sector: 'time',
    summary: 'Wells turned time into a direction you could travel in. Later writers used the device to test free will, causality and the fragility of history, and alternate history asks the same questions without a machine at all.',
    questions: [
      'Can the past be changed, and if so, which present is the real one?',
      'Is history driven by individuals, by accidents or by deep forces?',
      'What do we owe the dead, and the not yet born?'
    ],
    motifs: ['the paradox loop', 'the butterfly effect', 'time police', 'the point of divergence', 'the observer who must not intervene'],
    works: ['time-machine', 'by-his-bootstraps', 'sound-of-thunder', 'all-you-zombies', 'man-in-the-high-castle', 'kindred', 'doomsday-book', 'years-of-rice-and-salt', 'time-war']
  },
  {
    id: 'control', name: 'Power, Surveillance and the State', sector: 'dystopia',
    summary: 'The dystopia takes the tendencies of the present and carries them to their end. Some regimes rule through fear and watching; others through pleasure, comfort or the management of bodies.',
    questions: [
      'How does a society persuade people to accept their own control?',
      'What is lost when privacy goes, and who gains from it?',
      'Where does resistance come from once the past has been rewritten?'
    ],
    motifs: ['the all-seeing state', 'rewritten history', 'conditioning', 'the controlled language', 'the rebel who reads', 'reproductive control'],
    works: ['machine-stops', 'we', 'brave-new-world', 'nineteen-eighty-four', 'fahrenheit-451', 'handmaids-tale', 'never-let-me-go', 'hunger-games', 'little-brother']
  },
  {
    id: 'better-worlds', name: 'Utopia and the Better World', sector: 'utopia',
    summary: 'Utopias are arguments about how to live, written as places. The modern form admits its doubts: Le Guin subtitled hers “an ambiguous utopia”, and Delany answered with “an ambiguous heterotopia”.',
    questions: [
      'What would have to change about property, work, family and power?',
      'Can a perfect society survive contact with real people?',
      'Who pays for one group’s paradise?'
    ],
    motifs: ['the visitor from our time', 'the sleeper who wakes', 'the island society', 'life without money', 'the critical utopia'],
    works: ['utopia-more', 'looking-backward', 'news-from-nowhere', 'herland', 'dispossessed', 'triton', 'always-coming-home', 'walkaway', 'psalm-for-the-wild-built']
  },
  {
    id: 'catastrophe', name: 'Catastrophe and Survival', sector: 'apoc',
    summary: 'The end of the world is rarely the end of the story. Apocalyptic fiction clears the stage to ask what people keep, what they rebuild, and who they become when institutions fail.',
    questions: [
      'What knowledge is worth saving, and who gets to save it?',
      'Does collapse reveal human nature or remake it?',
      'Was the disaster sudden or slow, and who saw it coming?'
    ],
    motifs: ['the last man', 'the plague', 'nuclear war', 'the cosy catastrophe', 'the monastery of knowledge', 'the long walk'],
    works: ['last-man', 'earth-abides', 'day-of-the-triffids', 'canticle-for-leibowitz', 'riddley-walker', 'parable-of-the-sower', 'the-road', 'station-eleven']
  },
  {
    id: 'planet', name: 'Ecology and the Living Planet', sector: 'eco',
    summary: '*Dune* made a planet’s ecology the engine of its plot. Climate fiction now writes about the planet we already live on, where the catastrophe is gradual, political and partly our own doing.',
    questions: [
      'How do environments shape cultures, beliefs and power?',
      'Can a technological civilization live within the limits of its world?',
      'What does a non-human intelligence such as a forest or an ecosystem want?'
    ],
    motifs: ['the desert planet', 'the drowned city', 'the engineered crop', 'the living world', 'terraforming', 'solarpunk repair'],
    works: ['drowned-world', 'dune', 'word-for-world-is-forest', 'sheep-look-up', 'red-mars', 'windup-girl', 'annihilation', 'semiosis', 'ministry-for-the-future']
  },
  {
    id: 'beyond-human', name: 'Becoming Something Else', sector: 'posthuman',
    summary: 'Evolution did not stop with us. Posthuman fiction imagines the next human species, engineered children and uploaded minds, along with the strange freedoms and new inequalities they bring.',
    questions: [
      'Which parts of being human are worth keeping?',
      'What happens to equality when some people can be improved?',
      'Is a perfect copy of you still you?'
    ],
    motifs: ['the superchild', 'the mutant in hiding', 'the gestalt mind', 'the upload', 'the Singularity', 'uplifted animals'],
    works: ['last-and-first-men', 'slan', 'more-than-human', 'flowers-for-algernon', 'beggars-in-spain', 'permutation-city', 'diaspora', 'accelerando', 'children-of-time']
  },
  {
    id: 'identity', name: 'Gender, Race and Who Gets a Future', sector: 'identity',
    summary: 'SF can change one variable in a human society and watch what follows. Writers have used it to unsettle gender, expose the logic of race, and imagine futures written from outside the genre’s old centre.',
    questions: [
      'Which differences are biological and which are social habit?',
      'What would society look like if a different group held power?',
      'Whose future does the genre usually imagine, and who is missing from it?'
    ],
    motifs: ['the single-sex world', 'the role reversal', 'ambisexuality', 'the time slip into slavery', 'Afrofuturist and Africanfuturist futures'],
    works: ['sultanas-dream', 'the-comet', 'left-hand-of-darkness', 'female-man', 'kindred', 'bloodchild', 'brown-girl-in-the-ring', 'binti', 'the-power']
  },
  {
    id: 'empire', name: 'Empire and Colonization', sector: 'opera',
    summary: 'Space opera borrowed the shapes of earthly empires: navies, provinces, frontiers and subject peoples. Its best work asks who the frontier belonged to before the settlers arrived.',
    questions: [
      'Is expansion into space a new beginning, or old colonialism with new ships?',
      'How do empires make their subjects want to belong?',
      'What happens to the cultures an empire absorbs?'
    ],
    motifs: ['the galactic empire in decline', 'the frontier world', 'the native uprising', 'the imperial capital', 'the culture-shocked ambassador'],
    works: ['war-of-the-worlds', 'martian-chronicles', 'foundation', 'dune', 'word-for-world-is-forest', 'consider-phlebas', 'hyperion', 'ancillary-justice', 'memory-called-empire']
  },
  {
    id: 'war', name: 'War and the Soldier', sector: 'military',
    summary: 'Military SF is one long argument. Heinlein’s *Starship Troopers* presented service as the root of citizenship, and generations of writers, many of them veterans, have answered back.',
    questions: [
      'Is war a test of virtue, or a machine that consumes people?',
      'What happens to soldiers who come home to a world that has moved on?',
      'What is the moral status of an enemy you have never met?'
    ],
    motifs: ['powered armour', 'the training camp', 'the insect enemy', 'time-dilated tours of duty', 'the child commander', 'war by remote control'],
    works: ['starship-troopers', 'bill-the-galactic-hero', 'forever-war', 'armor', 'enders-game', 'forever-peace', 'old-mans-war', 'light-brigade', 'some-desperate-glory']
  },
  {
    id: 'networks', name: 'Networks, Simulation and the Self', sector: 'cyber',
    summary: 'Once minds can live in machines, reality becomes a design problem. Cyberpunk tied this to corporate power and street life, and later writers followed the network into everyday life.',
    questions: [
      'If a world is simulated well enough, does it matter that it is not real?',
      'Who owns the spaces where people now spend much of their lives?',
      'What becomes of the body when identity moves online?'
    ],
    motifs: ['jacking in', 'the simulated city', 'the avatar', 'the hacker outlaw', 'the megacorporation', 'the uploaded consciousness'],
    works: ['simulacron-3', 'true-names', 'neuromancer', 'synners', 'snow-crash', 'permutation-city', 'feed', 'ready-player-one', 'the-peripheral']
  },
  {
    id: 'language', name: 'Language and Thought', sector: 'inner',
    summary: 'A favourite SF experiment is to change a language and watch the mind change with it. These stories dramatize the idea that the words we have shape what we are able to think.',
    questions: [
      'Could learning a language change how you experience time, gender or the self?',
      'Can a language be a weapon, or an instrument of control?',
      'How do you write dialogue for a mind with no human grammar?'
    ],
    motifs: ['the alien script', 'the weaponized language', 'the invented women’s language', 'future slang', 'Newspeak'],
    works: ['nineteen-eighty-four', 'clockwork-orange', 'babel-17', 'native-tongue', 'riddley-walker', 'story-of-your-life', 'embassytown']
  },
  {
    id: 'wonder', name: 'Deep Time and Cosmic Scale', sector: 'hard',
    summary: 'SF is the literature that can make a reader feel the size of the universe and the length of time. Its “sense of wonder” comes from scale: billion-year histories, structures larger than worlds, the end of everything.',
    questions: [
      'How does humanity look against billions of years?',
      'What would it mean to meet something vastly larger than ourselves?',
      'Is there any meaning or purpose at cosmic scale?'
    ],
    motifs: ['the big dumb object', 'the generation ship', 'the far future', 'the end of the universe', 'the cosmic creator'],
    works: ['last-and-first-men', 'star-maker', 'dying-earth', 'childhoods-end', '2001-space-odyssey', 'ringworld', 'tau-zero', 'rendezvous-with-rama', 'universe']
  }
];
