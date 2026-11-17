/*
 * Field guide: the real science behind the stories. Each entry pairs one
 * concrete figure with what the science says, how fiction uses it, and where
 * fiction bends it. `works` are atlas ids.
 */
SFMAP.guide = SFMAP.guide || {};
SFMAP.guide.fields = ['Physics & space', 'Life & Earth sciences', 'Technology & mind', 'Language & society'];
SFMAP.guide.science = [
  {
    id: 'relativity', name: 'Relativity and time dilation', field: 'Physics & space',
    fact: { value: 'γ ≈ 7.1', label: 'Time-dilation factor at 99% of light speed: one year on board, about seven at home.' },
    science: 'Special relativity says a clock on a fast-moving ship runs slow compared with clocks at home, by the Lorentz factor γ = 1/√(1 − v²/c²). The effect is tiny at everyday speeds and grows without limit as a ship approaches the speed of light.',
    fiction: '*The Forever War* turns time dilation into the soldier’s alienation: every tour of duty returns Mandella to an Earth decades or centuries stranger. *Tau Zero* pushes γ toward infinity until the crew outlives the universe. Ender reaches *Speaker for the Dead* three thousand years after his war.',
    bends: 'Reaching these speeds would need more energy than any known propulsion can supply, and at near light speed a grain of interstellar dust hits like a bomb. Most stories quietly skip both problems.',
    works: ['tau-zero', 'forever-war', 'speaker-for-the-dead', 'light-brigade']
  },
  {
    id: 'ftl', name: 'Faster than light: wormholes, warp and the ansible', field: 'Physics & space',
    fact: { value: '4.24 ly', label: 'Distance to Proxima Centauri, the nearest star: about 75,000 years at Voyager 1’s speed.' },
    science: 'Relativity forbids anything from outrunning light in ordinary space. Physicists have described loopholes on paper, such as traversable wormholes (Morris and Thorne, 1988) and the Alcubierre warp metric (1994), but each needs “exotic matter” with negative energy that has never been found in usable amounts.',
    fiction: 'Most space opera assumes a jump drive and moves on. Carl Sagan asked the physicist Kip Thorne for a plausible way across the galaxy for *Contact*, and the answer became a real research paper. Le Guin named the instant communicator the “ansible” in 1966 and gave it a theory in *The Dispossessed*; Card and many others borrowed the word.',
    bends: 'In relativity, faster-than-light travel also allows travel into the past, so any story with FTL has quietly accepted time paradoxes as well.',
    works: ['dispossessed', 'enders-game', 'contact-sagan', 'hyperion', 'fire-upon-the-deep']
  },
  {
    id: 'orbits', name: 'Rockets and orbital mechanics', field: 'Physics & space',
    fact: { value: '11.2 km/s', label: 'Earth’s escape velocity: the speed needed to leave Earth for good without further thrust.' },
    science: 'Spaceflight is ruled by Tsiolkovsky’s rocket equation, Δv = vₑ ln(m₀/m_f): each extra kilometre per second of velocity change costs exponentially more propellant. In orbit, intuition runs backwards. To catch something ahead of you, you slow down and drop to a lower, faster orbit.',
    fiction: '*The Cold Equations* turns a fuel margin into a moral dilemma. *The Martian*’s rescue depends on a gravity-assist slingshot around Earth. *Seveneves* builds a whole civilization out of orbital mechanics, and *The Expanse* made fuel, thrust and acceleration couches part of its texture.',
    bends: 'Verne got the idea of a launch velocity right, but firing a crewed shell from a cannon would have subjected its passengers to accelerations of thousands of g and killed them instantly.',
    works: ['from-earth-to-moon', 'cold-equations', 'the-martian', 'leviathan-wakes', 'seveneves']
  },
  {
    id: 'gravity', name: 'Gravity and alien worlds', field: 'Physics & space',
    fact: { value: '~10¹¹ g', label: 'Approximate surface gravity of a neutron star, the home of the cheela in *Dragon’s Egg*.' },
    science: 'A world’s mass, radius and spin set its gravity, atmosphere, tides and day length, and those constrain everything that lives there. Fast rotation flattens a planet and reduces its effective gravity at the equator. A body orbiting close to its star can become tidally locked, with one face always toward it.',
    fiction: 'Hal Clement designed Mesklin, a fast-spinning, flattened world with about 3 g at the equator and hundreds of g at the poles, and published his working in the essay “Whirligig World” (1953). The physicist Robert L. Forward put life on the surface of a neutron star. *Hothouse* imagines an Earth tidally locked to the Sun.',
    bends: 'Space opera usually gives its ships artificial gravity plates, which have no basis in known physics. Spinning habitats, as in *Rendezvous with Rama*, are the realistic alternative.',
    works: ['mission-of-gravity', 'hothouse', 'dragons-egg', 'rendezvous-with-rama']
  },
  {
    id: 'megastructures', name: 'Megastructures', field: 'Physics & space',
    fact: { value: '1 AU', label: 'Radius of Niven’s Ringworld: about 150 million km, the distance from Earth to the Sun.' },
    science: 'Physicists have sketched structures on the scale of planets and stars: Freeman Dyson’s 1960 proposal for capturing a star’s output, Gerard O’Neill’s rotating space colonies of the 1970s, and spinning rings. Rotation provides artificial gravity on the inner surface.',
    fiction: '*Star Maker* described star-enclosing worlds in 1937, and Dyson credited Stapledon with the idea. *Ringworld* circles its sun with a band a million miles wide. *Rendezvous with Rama* sends a hollow, spinning cylinder through the solar system and never explains it.',
    bends: 'Fans soon worked out that the Ringworld is unstable: any nudge would drift it into its sun. Niven added attitude-control jets in *The Ringworld Engineers* (1980). Readers checking the sums is part of the hard-SF game.',
    works: ['star-maker', 'ringworld', 'rendezvous-with-rama', '2001-space-odyssey']
  },
  {
    id: 'fermi', name: 'The Fermi paradox and the Great Silence', field: 'Physics & space',
    fact: { value: '1950', label: 'The year Enrico Fermi asked colleagues at Los Alamos, “Where is everybody?”' },
    science: 'The galaxy is old and large enough that even slow colonizers should have spread across it, yet we see no sign of anyone. The Drake equation (1961) breaks the question into factors such as the number of planets and the lifetime of civilizations. Proposed answers include rare life, self-destruction, deliberate silence and looking in the wrong way.',
    fiction: 'SF has supplied many of the best-known answers. Liu Cixin’s trilogy proposes a “dark forest” where every civilization hides from every other. *Revelation Space* imagines ancient machines that destroy any species that grows too loud. *Roadside Picnic* suggests visitors who barely noticed us at all.',
    bends: 'Most fictional answers require every civilization to behave the same way, which is also the weak point of many real proposals.',
    works: ['roadside-picnic', 'contact-sagan', 'revelation-space', 'blindsight', 'three-body-problem']
  },
  {
    id: 'nuclear', name: 'Nuclear physics and the bomb', field: 'Physics & space',
    fact: { value: '1944', label: 'Cleve Cartmill’s story “Deadline” described a uranium bomb accurately enough that security agents questioned *Astounding*’s editor.' },
    science: 'Fission splits heavy nuclei and releases millions of times more energy per kilogram than any chemical fuel. A chain reaction can power a reactor or destroy a city, and fallout spreads radioactive isotopes far beyond the blast.',
    fiction: 'Wells predicted “atomic bombs” in 1914. After 1945 the bomb became the genre’s central fear: *On the Beach* waits for the fallout to arrive, *A Canticle for Leibowitz* watches a rebuilt civilization reinvent the weapon, and *Riddley Walker* remembers it as myth.',
    bends: 'Post-nuclear fiction loves mutants with strange powers. The documented effects of radiation are cancers, birth defects and sterility.',
    works: ['on-the-beach', 'canticle-for-leibowitz', 'alas-babylon', 'cats-cradle', 'riddley-walker']
  },
  {
    id: 'evolution', name: 'Evolution and natural selection', field: 'Life & Earth sciences',
    fact: { value: '3.5 bn yrs', label: 'Age of the oldest widely accepted fossil evidence of life on Earth.' },
    science: 'Species change through variation, inheritance and selection, with no goal in view. Evolution is slow, branching and blind, which is exactly what makes it hard to dramatize. About 8% of the human genome consists of the remains of ancient viral infections.',
    fiction: '*The Time Machine* splits humanity into two species along class lines. *Last and First Men* runs through eighteen human species over two billion years. *Darwin’s Radio* builds its sudden speciation on those ancient viral sequences, and *Children of Time* follows spiders whose evolution has been accelerated.',
    bends: 'Fiction often treats evolution as a ladder toward higher forms, when it is closer to a branching bush with no top. The superior next species is a cultural idea more than a biological one.',
    works: ['time-machine', 'island-of-doctor-moreau', 'last-and-first-men', 'darwins-radio', 'children-of-time']
  },
  {
    id: 'genetics', name: 'Genetic engineering and cloning', field: 'Life & Earth sciences',
    fact: { value: '1996', label: 'Birth of Dolly the sheep, the first mammal cloned from an adult cell.' },
    science: 'Since recombinant DNA (1973) and CRISPR gene editing (2012), genomes can be altered directly. A clone shares its original’s genome but none of its experience: it is, in effect, an identical twin born later.',
    fiction: '*Brave New World* industrialized human reproduction two decades before the structure of DNA was known. *Cyteen* asks whether a cloned scientist can be raised into the same person. *Never Let Me Go* treats clones as a harvested underclass, and *Oryx and Crake* follows engineering through to extinction.',
    bends: 'Fiction tends to treat genes as destiny. Studies of real twins show that genes shape tendencies, not personalities or fates.',
    works: ['brave-new-world', 'cyteen', 'beggars-in-spain', 'oryx-and-crake', 'never-let-me-go', 'windup-girl']
  },
  {
    id: 'epidemics', name: 'Epidemics', field: 'Life & Earth sciences',
    fact: { value: '~500 m', label: 'People infected in the 1918 influenza pandemic, about a third of the world’s population.' },
    science: 'An outbreak grows when each case infects more than one other person, measured as the basic reproduction number R₀. Incubation time, lethality and how the pathogen spreads decide whether it burns out locally or circles the world.',
    fiction: 'Mary Shelley imagined a global plague in 1826. *Earth Abides* watches ecosystems recover after one. *Doomsday Book* sets the Black Death against a modern outbreak, and *Station Eleven*, published in 2014, found new readers in 2020 for its account of how quickly the networks of daily life stop.',
    bends: 'Fictional plagues are often too deadly to spread: a disease that kills its hosts fast tends to burn out before it reaches everyone. Real pandemics are more often survivable and slower.',
    works: ['last-man', 'scarlet-plague', 'earth-abides', 'the-stand', 'doomsday-book', 'station-eleven']
  },
  {
    id: 'climate', name: 'Climate and planetary ecology', field: 'Life & Earth sciences',
    fact: { value: '35 °C', label: 'Wet-bulb temperature long cited as the limit of human survival. Recent studies put the real limit lower.' },
    science: 'Earth’s climate is set by the balance between incoming sunlight and outgoing heat, which greenhouse gases shift. Feedbacks such as melting ice, which reflects less sunlight, push changes further. Ecology studies how living things and their environments regulate each other.',
    fiction: 'Herbert built *Dune*’s planet-wide water economy after reporting on a project to stabilize sand dunes in Oregon. Ballard imagined drowned cities in 1962. *The Ministry for the Future* opens with a lethal wet-bulb heatwave and spends the rest of the book on policy, finance and carbon.',
    bends: 'Older climate fiction made change sudden and cinematic. The real crisis is gradual, political and unevenly shared, which is much harder to plot.',
    works: ['drowned-world', 'dune', 'sheep-look-up', 'red-mars', 'parable-of-the-sower', 'windup-girl', 'ministry-for-the-future']
  },
  {
    id: 'nanotech', name: 'Nanotechnology', field: 'Technology & mind',
    fact: { value: '1959', label: 'Richard Feynman’s lecture “There’s Plenty of Room at the Bottom”, the usual starting point for the idea.' },
    science: 'Nanotechnology works with matter at the scale of molecules, around a billionth of a metre. K. Eric Drexler’s *Engines of Creation* (1986) popularized molecular assemblers that could build almost anything atom by atom.',
    fiction: '*Blood Music* lets intelligent cells remake the world. *The Diamond Age* imagines matter compilers that make goods nearly free and asks what still has value. *Accelerando* dismantles planets to build computers.',
    bends: 'Chemists such as Richard Smalley argued that general-purpose assemblers face basic chemical obstacles. Real nanotechnology so far means new materials and medicines, not universal factories.',
    works: ['blood-music', 'diamond-age', 'accelerando', 'children-of-time']
  },
  {
    id: 'ai', name: 'Computing and artificial intelligence', field: 'Technology & mind',
    fact: { value: '1950', label: 'Alan Turing’s paper “Computing Machinery and Intelligence” proposed the imitation game.' },
    science: 'Modern AI systems learn patterns from data rather than following hand-written rules, and their abilities have grown fast since the 2010s. Whether such systems understand anything, or could become conscious, is still disputed.',
    fiction: 'Asimov’s Three Laws (1942) treated robot ethics as an engineering specification. *Do Androids Dream of Electric Sheep?* turned the Turing test into the Voigt-Kampff empathy test. Vernor Vinge’s 1993 essay on the “technological singularity” grew out of ideas he had explored in fiction.',
    bends: 'Fictional AIs tend to be either human characters in metal or cold logic engines. Real systems are stranger, with uneven abilities that fit neither picture.',
    works: ['i-robot', 'colossus', 'do-androids-dream', 'neuromancer', 'fire-upon-the-deep', 'lifecycle-of-software-objects', 'all-systems-red']
  },
  {
    id: 'uploads', name: 'Mind uploading and simulation', field: 'Technology & mind',
    fact: { value: '86 bn', label: 'Neurons in a human brain, each with thousands of connections. A full fruit-fly brain, about 140,000 neurons, was mapped in 2024.' },
    science: 'Uploading assumes a mind is a pattern of information that could be scanned and run on another substrate. Neuroscientists have mapped the complete wiring of a roundworm (302 neurons) and an adult fruit fly. Nick Bostrom’s simulation argument (2003) asks whether we might already be inside one.',
    fiction: '*Simulacron-3* put people inside a simulation in 1964. *Permutation City* and *Diaspora* follow uploaded minds to their logical extremes, and *Altered Carbon* makes bodies into interchangeable sleeves.',
    bends: 'A wiring map may not be enough to capture a mind, which also depends on chemistry and timing. And a copy raises the question every upload story has to face: does the original survive?',
    works: ['simulacron-3', 'software', 'permutation-city', 'diaspora', 'altered-carbon', 'accelerando']
  },
  {
    id: 'consciousness', name: 'Consciousness and the brain', field: 'Technology & mind',
    fact: { value: '1995', label: 'David Chalmers named the “hard problem”: why physical processing gives rise to experience at all.' },
    science: 'Neuroscience can link functions to brain regions, but how experience arises is unresolved. In the real condition called blindsight, people with damage to the visual cortex respond to objects they say they cannot see, which suggests that much processing happens without awareness.',
    fiction: '*Flowers for Algernon* and *Camp Concentration* ask what happens when intelligence is raised and then taken away. *Blindsight* argues that consciousness may be an evolutionary accident that intelligence does not need. *The Demolished Man* imagines committing a murder in a society where telepaths read minds for the police.',
    bends: 'Intelligence-boost stories treat intelligence as a single dial and often lean on the myth that we use only 10% of our brains. Psychologists describe several abilities that do not rise together, and imaging shows activity across the whole brain.',
    works: ['demolished-man', 'flowers-for-algernon', 'camp-concentration', 'blindsight']
  },
  {
    id: 'linguistics', name: 'Linguistics and the Sapir–Whorf hypothesis', field: 'Language & society',
    fact: { value: '~7,000', label: 'Languages spoken in the world today.' },
    science: 'Linguistic relativity, associated with Edward Sapir and Benjamin Lee Whorf, holds that language influences thought. Most linguists reject its strong form, that language determines what we can think, but experiments support weaker effects on perception and memory, for example in how people sort colours.',
    fiction: 'SF prefers the strong form because it is dramatic. Newspeak aims to make dissent unthinkable. *Babel-17* is a language that reprograms its speakers. *Story of Your Life* gives a linguist the aliens’ simultaneous view of time, and Suzette Haden Elgin, herself a linguist, built a real language, Láadan, for *Native Tongue*.',
    bends: 'Stories assume one language makes one worldview. Real speakers are often multilingual and stubbornly creative with whatever words they have.',
    works: ['nineteen-eighty-four', 'babel-17', 'native-tongue', 'story-of-your-life', 'embassytown']
  },
  {
    id: 'society', name: 'Social science and psychohistory', field: 'Language & society',
    fact: { value: '1798', label: 'Thomas Malthus’s *Essay on the Principle of Population* argued that population growth will outrun food.' },
    science: 'Sociology, economics and anthropology study how societies organize themselves. They have long tempted writers to imagine predicting, or redesigning, whole civilizations.',
    fiction: 'Asimov modelled psychohistory on statistical mechanics: one person is unpredictable, but vast populations might be forecast like molecules in a gas. Le Guin, daughter of the anthropologist Alfred Kroeber, wrote *Always Coming Home* as an ethnography. *Stand on Zanzibar* and *The Mote in God’s Eye* work through Malthus’s arithmetic.',
    bends: 'Asimov’s own sequels break psychohistory with a single unpredictable individual, the Mule. Real social forecasting is far weaker, and Malthus’s famines were repeatedly postponed by gains in farming.',
    works: ['walden-two', 'foundation', 'stand-on-zanzibar', 'mote-in-gods-eye', 'always-coming-home', 'infomocracy']
  }
];
