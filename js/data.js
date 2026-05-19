/* ============================================
   ANIMAL FEED CHAIN — Data (Animals, Foods, Phases, Facts, Achievements)
   ============================================ */

// Diet types: HERB = herbivore, CARN = carnivore, OMNI = omnivore
const DIET = { HERB: 'herbivore', CARN: 'carnivore', OMNI: 'omnivore' };

// Each entity has: id, emoji, names {en,sq,de}, diet, eats: [ids]
const ENTITIES = {
  // ---------- PLANTS / BASE ----------
  grass:      { id:'grass',      emoji:'🌱', kind:'plant', names:{en:'Grass',     sq:'Bar',      de:'Gras'} },
  corn:       { id:'corn',       emoji:'🌽', kind:'plant', names:{en:'Corn',      sq:'Misër',    de:'Mais'} },
  carrot:     { id:'carrot',     emoji:'🥕', kind:'plant', names:{en:'Carrots',   sq:'Karrota',  de:'Karotten'} },
  wheat:      { id:'wheat',      emoji:'🌾', kind:'plant', names:{en:'Wheat',     sq:'Grurë',    de:'Weizen'} },
  veggies:    { id:'veggies',    emoji:'🥬', kind:'plant', names:{en:'Vegetables',sq:'Perime',   de:'Gemüse'} },
  berries:    { id:'berries',    emoji:'🫐', kind:'plant', names:{en:'Berries',   sq:'Manaferra', de:'Beeren'} },
  apple:      { id:'apple',      emoji:'🍎', kind:'plant', names:{en:'Apple',     sq:'Mollë',    de:'Apfel'} },
  acorn:      { id:'acorn',      emoji:'🌰', kind:'plant', names:{en:'Acorn',     sq:'Lis i vogël', de:'Eichel'} },
  leaves:     { id:'leaves',     emoji:'🍃', kind:'plant', names:{en:'Leaves',    sq:'Gjethe',   de:'Blätter'} },
  algae:      { id:'algae',      emoji:'🪸', kind:'plant', names:{en:'Algae',     sq:'Alga',     de:'Algen'} },
  honey:      { id:'honey',      emoji:'🍯', kind:'plant', names:{en:'Honey',     sq:'Mjaltë',   de:'Honig'} },
  fish_food:  { id:'fish_food',  emoji:'🥫', kind:'plant', names:{en:'Fish food', sq:'Ushqim peshku', de:'Fischfutter'} },
  bug:        { id:'bug',        emoji:'🐛', kind:'animal',diet:DIET.HERB, eats:['leaves','grass'], names:{en:'Caterpillar', sq:'Vemje',     de:'Raupe'} },
  worm:       { id:'worm',       emoji:'🪱', kind:'animal',diet:DIET.HERB, eats:['leaves','grass'], names:{en:'Worm',    sq:'Krimb',    de:'Wurm'} },
  plankton:   { id:'plankton',   emoji:'🦠', kind:'animal',diet:DIET.HERB, eats:['algae'],         names:{en:'Plankton', sq:'Plankton', de:'Plankton'} },

  // ---------- FARM ANIMALS ----------
  chicken:    { id:'chicken',    emoji:'🐔', kind:'animal',diet:DIET.OMNI, eats:['corn','wheat','worm','bug'], names:{en:'Chicken', sq:'Pula',     de:'Huhn'} },
  cow:        { id:'cow',        emoji:'🐄', kind:'animal',diet:DIET.HERB, eats:['grass','wheat','corn'],     names:{en:'Cow',     sq:'Lopa',     de:'Kuh'} },
  sheep:      { id:'sheep',      emoji:'🐑', kind:'animal',diet:DIET.HERB, eats:['grass','veggies'],          names:{en:'Sheep',   sq:'Dele',     de:'Schaf'} },
  duck:       { id:'duck',       emoji:'🦆', kind:'animal',diet:DIET.OMNI, eats:['corn','worm','bug','wheat'], names:{en:'Duck',  sq:'Rosa',     de:'Ente'} },
  pig:        { id:'pig',        emoji:'🐖', kind:'animal',diet:DIET.OMNI, eats:['corn','veggies','apple'],    names:{en:'Pig',   sq:'Derri',    de:'Schwein'} },
  horse:      { id:'horse',      emoji:'🐎', kind:'animal',diet:DIET.HERB, eats:['grass','wheat','apple','carrot'], names:{en:'Horse', sq:'Kali', de:'Pferd'} },
  goat:       { id:'goat',       emoji:'🐐', kind:'animal',diet:DIET.HERB, eats:['grass','leaves','veggies'],  names:{en:'Goat',  sq:'Dhia',     de:'Ziege'} },

  // ---------- FOREST ANIMALS ----------
  rabbit:     { id:'rabbit',     emoji:'🐰', kind:'animal',diet:DIET.HERB, eats:['carrot','grass','veggies','leaves'], names:{en:'Rabbit', sq:'Lepuri', de:'Hase'} },
  mouse:      { id:'mouse',      emoji:'🐭', kind:'animal',diet:DIET.HERB, eats:['corn','wheat','berries'], names:{en:'Mouse', sq:'Miu',      de:'Maus'} },
  squirrel:   { id:'squirrel',   emoji:'🐿️', kind:'animal',diet:DIET.HERB, eats:['acorn','berries','apple'], names:{en:'Squirrel', sq:'Ketri', de:'Eichhörnchen'} },
  deer:       { id:'deer',       emoji:'🦌', kind:'animal',diet:DIET.HERB, eats:['grass','leaves','berries'], names:{en:'Deer',  sq:'Dreri',    de:'Hirsch'} },
  hedgehog:   { id:'hedgehog',   emoji:'🦔', kind:'animal',diet:DIET.OMNI, eats:['worm','bug','berries'],     names:{en:'Hedgehog', sq:'Iriqi', de:'Igel'} },
  fox:        { id:'fox',        emoji:'🦊', kind:'animal',diet:DIET.CARN, eats:['rabbit','mouse','chicken','hedgehog'], names:{en:'Fox', sq:'Dhelpra', de:'Fuchs'} },
  owl:        { id:'owl',        emoji:'🦉', kind:'animal',diet:DIET.CARN, eats:['mouse','rabbit','bug'], names:{en:'Owl', sq:'Bufi', de:'Eule'} },
  wolf:       { id:'wolf',       emoji:'🐺', kind:'animal',diet:DIET.CARN, eats:['rabbit','deer','sheep','fox'], names:{en:'Wolf', sq:'Ujku', de:'Wolf'} },
  bear:       { id:'bear',       emoji:'🐻', kind:'animal',diet:DIET.OMNI, eats:['honey','berries','fish','rabbit','fox'], names:{en:'Bear', sq:'Ariu', de:'Bär'} },

  // ---------- OCEAN ANIMALS ----------
  fish:       { id:'fish',       emoji:'🐟', kind:'animal',diet:DIET.OMNI, eats:['plankton','algae','worm'],     names:{en:'Small Fish', sq:'Peshk i Vogël', de:'Kleiner Fisch'} },
  tropical:   { id:'tropical',   emoji:'🐠', kind:'animal',diet:DIET.HERB, eats:['algae','plankton'],            names:{en:'Tropical Fish', sq:'Peshk Tropikal', de:'Tropenfisch'} },
  shrimp:     { id:'shrimp',     emoji:'🦐', kind:'animal',diet:DIET.OMNI, eats:['algae','plankton'],            names:{en:'Shrimp', sq:'Karkalec deti', de:'Garnele'} },
  crab:       { id:'crab',       emoji:'🦀', kind:'animal',diet:DIET.OMNI, eats:['algae','plankton','shrimp'],   names:{en:'Crab',   sq:'Gaforrja',     de:'Krabbe'} },
  squid:      { id:'squid',      emoji:'🦑', kind:'animal',diet:DIET.CARN, eats:['fish','shrimp','tropical'],    names:{en:'Squid',  sq:'Kallamari',    de:'Tintenfisch'} },
  octopus:    { id:'octopus',    emoji:'🐙', kind:'animal',diet:DIET.CARN, eats:['fish','crab','shrimp'],        names:{en:'Octopus',sq:'Oktapodi',     de:'Krake'} },
  turtle:     { id:'turtle',     emoji:'🐢', kind:'animal',diet:DIET.OMNI, eats:['algae','tropical','shrimp'],   names:{en:'Sea Turtle', sq:'Breshkë deti', de:'Schildkröte'} },
  dolphin:    { id:'dolphin',    emoji:'🐬', kind:'animal',diet:DIET.CARN, eats:['fish','squid','tropical'],     names:{en:'Dolphin', sq:'Delfini',     de:'Delphin'} },
  shark:      { id:'shark',      emoji:'🦈', kind:'animal',diet:DIET.CARN, eats:['fish','octopus','turtle','dolphin'], names:{en:'Shark', sq:'Peshkaqeni', de:'Hai'} },
  whale:      { id:'whale',      emoji:'🐋', kind:'animal',diet:DIET.CARN, eats:['plankton','fish','squid','octopus'], names:{en:'Whale', sq:'Balena', de:'Wal'} },

  // ---------- SAVANNAH ----------
  gazelle:    { id:'gazelle',    emoji:'🦌', kind:'animal',diet:DIET.HERB, eats:['grass','leaves'], names:{en:'Gazelle', sq:'Gazela', de:'Gazelle'} },
  zebra:      { id:'zebra',      emoji:'🦓', kind:'animal',diet:DIET.HERB, eats:['grass','leaves'], names:{en:'Zebra',   sq:'Zebra',  de:'Zebra'} },
  giraffe:    { id:'giraffe',    emoji:'🦒', kind:'animal',diet:DIET.HERB, eats:['leaves','acorn'], names:{en:'Giraffe', sq:'Gjirafa',de:'Giraffe'} },
  elephant:   { id:'elephant',   emoji:'🐘', kind:'animal',diet:DIET.HERB, eats:['grass','leaves','apple','wheat'], names:{en:'Elephant', sq:'Elefanti', de:'Elefant'} },
  hippo:      { id:'hippo',      emoji:'🦛', kind:'animal',diet:DIET.HERB, eats:['grass','leaves','veggies'], names:{en:'Hippo', sq:'Hipopotami', de:'Nilpferd'} },
  monkey:     { id:'monkey',     emoji:'🐒', kind:'animal',diet:DIET.OMNI, eats:['apple','berries','bug'], names:{en:'Monkey', sq:'Majmuni', de:'Affe'} },
  ostrich:    { id:'ostrich',    emoji:'🦩', kind:'animal',diet:DIET.OMNI, eats:['grass','bug','berries'], names:{en:'Ostrich', sq:'Struci', de:'Strauß'} },
  hyena:      { id:'hyena',      emoji:'🐺', kind:'animal',diet:DIET.CARN, eats:['gazelle','zebra','rabbit'], names:{en:'Hyena', sq:'Hiena', de:'Hyäne'} },
  cheetah:    { id:'cheetah',    emoji:'🐆', kind:'animal',diet:DIET.CARN, eats:['gazelle','zebra','ostrich'], names:{en:'Cheetah', sq:'Geparti', de:'Gepard'} },
  crocodile:  { id:'crocodile',  emoji:'🐊', kind:'animal',diet:DIET.CARN, eats:['fish','zebra','gazelle','monkey'], names:{en:'Crocodile', sq:'Krokodili', de:'Krokodil'} },
  lion:       { id:'lion',       emoji:'🦁', kind:'animal',diet:DIET.CARN, eats:['zebra','gazelle','hyena','cheetah'], names:{en:'Lion', sq:'Luani', de:'Löwe'} },
  tiger:      { id:'tiger',      emoji:'🐅', kind:'animal',diet:DIET.CARN, eats:['deer','rabbit','fox','wolf'], names:{en:'Tiger', sq:'Tigri', de:'Tigër'} },
  eagle:      { id:'eagle',      emoji:'🦅', kind:'animal',diet:DIET.CARN, eats:['mouse','rabbit','fish'], names:{en:'Eagle', sq:'Shqiponja', de:'Adler'} },

  // ---------- TRAPS (hard mode) ----------
  poison:     { id:'poison',     emoji:'🍄', kind:'poison', names:{en:'Poison Mushroom', sq:'Kërpudhë helmuese', de:'Giftiger Pilz'} },
  candy:      { id:'candy',      emoji:'🍬', kind:'poison', names:{en:'Candy',    sq:'Karamele',  de:'Bonbon'} },
  rock:       { id:'rock',       emoji:'🪨', kind:'poison', names:{en:'Rock',     sq:'Gur',       de:'Stein'} },
};

// Modes: each is a sequence of phases. Each phase: left (foods), right (animals to feed).
// 'chain' is the displayed food chain after the phase. 'narration' is shown in chain overlay.
const MODES = {
  farm: {
    name: { en:'Farm', sq:'Ferma', de:'Bauernhof' },
    bg: 'farm',
    phases: [
      {
        left:  ['grass','corn','wheat','carrot'],
        right: ['cow','sheep','horse'],
        chain: ['grass','cow','sheep'],
        narration: {
          en: 'Plants feed herbivores like cows and sheep.',
          sq: 'Bimët ushqejnë bimëngrënësit si lopët dhe delet.',
          de: 'Pflanzen ernähren Pflanzenfresser wie Kühe und Schafe.'
        }
      },
      {
        left:  ['corn','wheat','veggies','worm','bug'],
        right: ['chicken','duck','pig','goat'],
        chain: ['corn','chicken','duck','pig'],
        narration: {
          en: 'Omnivores like chickens, ducks and pigs eat seeds, vegetables and insects.',
          sq: 'Gjithëngrënësit si pulat, rosat dhe derrat hanë fara, perime dhe insekte.',
          de: 'Allesfresser wie Hühner, Enten und Schweine fressen Samen, Gemüse und Insekten.'
        }
      },
      {
        left:  ['grass','corn','wheat','carrot','apple','veggies'],
        right: ['cow','sheep','horse','goat','pig','chicken'],
        chain: ['grass','corn','cow','horse','pig'],
        narration: {
          en: 'A balanced farm needs many plant kinds for many animals.',
          sq: 'Një fermë e ekuilibruar ka nevojë për bimë të ndryshme për kafshë të ndryshme.',
          de: 'Ein ausgewogener Bauernhof braucht viele Pflanzenarten für viele Tiere.'
        }
      }
    ]
  },

  forest: {
    name: { en:'Forest', sq:'Pylli', de:'Wald' },
    bg: 'forest',
    phases: [
      {
        left:  ['grass','carrot','leaves','berries','acorn'],
        right: ['rabbit','mouse','squirrel','deer'],
        chain: ['grass','rabbit','mouse'],
        narration: {
          en: 'Small herbivores eat plants and become prey for predators.',
          sq: 'Bimëngrënësit e vegjël hanë bimë dhe bëhen pre për grabitqarët.',
          de: 'Kleine Pflanzenfresser fressen Pflanzen und werden zur Beute der Räuber.'
        }
      },
      {
        left:  ['rabbit','mouse','squirrel','hedgehog','worm'],
        right: ['fox','owl','wolf'],
        chain: ['grass','rabbit','fox','wolf'],
        narration: {
          en: 'Foxes, owls and wolves hunt smaller forest animals.',
          sq: 'Dhelprat, bufët dhe ujqit gjuajnë kafshë më të vogla të pyllit.',
          de: 'Füchse, Eulen und Wölfe jagen kleinere Waldtiere.'
        }
      },
      {
        left:  ['rabbit','fox','berries','honey','fish'],
        right: ['wolf','bear'],
        chain: ['rabbit','fox','wolf','bear'],
        narration: {
          en: 'Bears are omnivores — they eat berries, honey and fish, and even hunt foxes.',
          sq: 'Arinjtë janë gjithëngrënës — hanë manaferra, mjaltë, peshk dhe gjuajnë dhelpra.',
          de: 'Bären sind Allesfresser — sie fressen Beeren, Honig, Fisch und jagen Füchse.'
        }
      }
    ]
  },

  ocean: {
    name: { en:'Ocean', sq:'Oqeani', de:'Ozean' },
    bg: 'ocean',
    phases: [
      {
        left:  ['algae','plankton'],
        right: ['plankton','tropical','shrimp'],
        chain: ['algae','plankton','tropical'],
        narration: {
          en: 'Algae and plankton are the base of every ocean food chain.',
          sq: 'Algat dhe planktoni janë baza e çdo zinxhiri ushqimor në oqean.',
          de: 'Algen und Plankton sind die Basis jeder Meereskette.'
        }
      },
      {
        left:  ['plankton','shrimp','tropical','algae'],
        right: ['fish','crab','turtle'],
        chain: ['plankton','fish','turtle'],
        narration: {
          en: 'Small ocean creatures feed on plankton and algae.',
          sq: 'Krijesat e vogla të oqeanit ushqehen me plankton dhe alga.',
          de: 'Kleine Meerestiere fressen Plankton und Algen.'
        }
      },
      {
        left:  ['fish','shrimp','tropical','crab'],
        right: ['squid','octopus','dolphin'],
        chain: ['plankton','fish','squid','dolphin'],
        narration: {
          en: 'Predators like squid, octopus and dolphins hunt smaller fish.',
          sq: 'Grabitqarët si kallamari, oktapodi dhe delfinët gjuajnë peshq të vegjël.',
          de: 'Räuber wie Tintenfische, Kraken und Delphine jagen kleine Fische.'
        }
      },
      {
        left:  ['fish','octopus','turtle','dolphin','plankton'],
        right: ['shark','whale'],
        chain: ['plankton','fish','dolphin','shark','whale'],
        narration: {
          en: 'Sharks are apex predators. Whales are huge but eat tiny plankton!',
          sq: 'Peshkaqenët janë grabitqarët kryesorë. Balenat janë të mëdha, por hanë plankton të vogël!',
          de: 'Haie sind Spitzenräuber. Wale sind riesig, fressen aber winziges Plankton!'
        }
      }
    ]
  },

  savannah: {
    name: { en:'Savannah', sq:'Savana', de:'Savanne' },
    bg: 'savannah',
    phases: [
      {
        left:  ['grass','leaves','berries','apple','acorn'],
        right: ['zebra','gazelle','giraffe','elephant'],
        chain: ['grass','zebra','elephant'],
        narration: {
          en: 'Big herbivores need lots of plants every day.',
          sq: 'Bimëngrënësit e mëdhenj kanë nevojë për shumë bimë çdo ditë.',
          de: 'Große Pflanzenfresser brauchen täglich viele Pflanzen.'
        }
      },
      {
        left:  ['grass','leaves','berries','bug','fish'],
        right: ['monkey','ostrich','hippo','elephant'],
        chain: ['leaves','monkey','ostrich','elephant'],
        narration: {
          en: 'Monkeys and ostriches are omnivores; hippos and elephants are herbivores.',
          sq: 'Majmunët dhe strucat janë gjithëngrënës; hipopotamët dhe elefantët janë bimëngrënës.',
          de: 'Affen und Strauße sind Allesfresser; Nilpferde und Elefanten sind Pflanzenfresser.'
        }
      },
      {
        left:  ['zebra','gazelle','rabbit','monkey','fish'],
        right: ['hyena','cheetah','crocodile'],
        chain: ['grass','zebra','cheetah','crocodile'],
        narration: {
          en: 'Cheetahs and hyenas chase gazelles; crocodiles ambush near rivers.',
          sq: 'Gepardët dhe hienat ndjekin gazelat; krokodilët presin pranë lumenjve.',
          de: 'Geparde und Hyänen jagen Gazellen; Krokodile lauern an Flüssen.'
        }
      },
      {
        left:  ['zebra','gazelle','hyena','cheetah'],
        right: ['lion'],
        chain: ['grass','zebra','cheetah','lion'],
        narration: {
          en: 'The lion is the king of the savannah — an apex predator.',
          sq: 'Luani është mbreti i savanës — një grabitqar kryesor.',
          de: 'Der Löwe ist der König der Savanne — ein Spitzenräuber.'
        }
      }
    ]
  }
};

// Nature facts
const FACTS = [
  { icon:'🦉', text:{ en:'Owls hunt mostly at night using sharp hearing.', sq:'Bufët gjuajnë kryesisht natën me dëgjim të mprehtë.', de:'Eulen jagen meist nachts mit scharfem Gehör.' } },
  { icon:'🦈', text:{ en:'Sharks are apex predators — nothing hunts them.', sq:'Peshkaqenët janë grabitqarët kryesorë — askush nuk i gjuan.', de:'Haie sind Spitzenräuber — niemand jagt sie.' } },
  { icon:'🐝', text:{ en:'Bees pollinate plants and keep ecosystems alive.', sq:'Bletët polenizojnë bimët dhe ruajnë ekosistemet.', de:'Bienen bestäuben Pflanzen und halten Ökosysteme am Leben.' } },
  { icon:'🐺', text:{ en:'Wolves live and hunt in packs led by an alpha.', sq:'Ujqit jetojnë dhe gjuajnë në tufa të udhëhequra nga një alfa.', de:'Wölfe leben und jagen in Rudeln, geführt von einem Alpha.' } },
  { icon:'🐋', text:{ en:'Some whales eat tiny plankton — billions of them!', sq:'Disa balena hanë plankton të vogël — miliarda të tilla!', de:'Manche Wale fressen winziges Plankton — Milliarden davon!' } },
  { icon:'🦁', text:{ en:'Female lions do most of the hunting in a pride.', sq:'Luaneshat bëjnë shumicën e gjuetisë në tufë.', de:'Löwinnen erledigen die meiste Jagd im Rudel.' } },
  { icon:'🦒', text:{ en:'Giraffes use their long necks to reach high leaves.', sq:'Gjirafat përdorin qafat e tyre të gjata për të arritur gjethet e larta.', de:'Giraffen erreichen mit ihrem langen Hals hohe Blätter.' } },
  { icon:'🐊', text:{ en:'Crocodiles haven\'t changed much in 200 million years.', sq:'Krokodilët nuk kanë ndryshuar shumë në 200 milionë vjet.', de:'Krokodile haben sich seit 200 Millionen Jahren kaum verändert.' } },
  { icon:'🐘', text:{ en:'Elephants eat up to 150 kg of plants every day.', sq:'Elefantët hanë deri në 150 kg bimë çdo ditë.', de:'Elefanten fressen bis zu 150 kg Pflanzen pro Tag.' } },
  { icon:'🦅', text:{ en:'Eagles can spot small prey from over a kilometre away.', sq:'Shqiponjat mund të dallojnë pre të vogël nga më shumë se një kilometër larg.', de:'Adler erkennen kleine Beute aus über einem Kilometer.' } },
  { icon:'🐬', text:{ en:'Dolphins communicate using clicks and whistles.', sq:'Delfinët komunikojnë me klikime dhe fishkëllima.', de:'Delphine kommunizieren mit Klicks und Pfiffen.' } },
  { icon:'🐢', text:{ en:'Sea turtles travel thousands of kilometres each year.', sq:'Breshkat e detit udhëtojnë mijëra kilometra çdo vit.', de:'Meeresschildkröten reisen jedes Jahr Tausende von Kilometern.' } },
  { icon:'🌱', text:{ en:'Plants are producers — they make their own food from sunlight.', sq:'Bimët janë prodhues — ato e bëjnë vetë ushqimin nga drita e diellit.', de:'Pflanzen sind Produzenten — sie machen ihr Essen aus Sonnenlicht.' } },
  { icon:'🦊', text:{ en:'Foxes have a great sense of hearing and can locate prey under snow.', sq:'Dhelprat kanë një dëgjim të shkëlqyer dhe e gjejnë prenë nën borë.', de:'Füchse hören sehr gut und finden Beute sogar unter Schnee.' } },
  { icon:'🐻', text:{ en:'Bears are omnivores — they eat berries, fish and even small mammals.', sq:'Arinjtë janë gjithëngrënës — hanë manaferra, peshk dhe gjitarë të vegjël.', de:'Bären sind Allesfresser — sie fressen Beeren, Fisch und sogar kleine Säugetiere.' } },
];

// Achievements
const ACHIEVEMENTS = [
  { id:'first_feed',    icon:'🥕', name:{en:'First Bite', sq:'Kafshim i Parë', de:'Erster Bissen'}, desc:{en:'Feed your first animal.', sq:'Ushqe kafshën e parë.', de:'Füttere dein erstes Tier.'} },
  { id:'perfect_farmer', icon:'🚜', name:{en:'Perfect Farmer', sq:'Fermer i Përkryer', de:'Perfekter Bauer'}, desc:{en:'Complete farm mode without losing a life.', sq:'Plotëso fermën pa humbur jetë.', de:'Schließe den Bauernhof ohne Verluste ab.'} },
  { id:'nature_protector', icon:'🌿', name:{en:'Nature Protector', sq:'Mbrojtës i Natyrës', de:'Naturschützer'}, desc:{en:'Save 30 animals in a single game.', sq:'Shpëto 30 kafshë në një lojë.', de:'Rette 30 Tiere in einem Spiel.'} },
  { id:'food_chain_master', icon:'🔗', name:{en:'Food Chain Master', sq:'Mjeshtër i Zinxhirit', de:'Nahrungsketten-Meister'}, desc:{en:'Complete every mode at least once.', sq:'Plotëso çdo modalitet të paktën një herë.', de:'Schließe jeden Modus mindestens einmal ab.'} },
  { id:'combo_5', icon:'🔥', name:{en:'On Fire', sq:'Si Zjarri', de:'Auf der Welle'}, desc:{en:'Get a 5x combo.', sq:'Arrijë kombo 5x.', de:'Erreiche eine 5er-Combo.'} },
  { id:'combo_10', icon:'💥', name:{en:'Unstoppable', sq:'I Pandalshëm', de:'Unaufhaltsam'}, desc:{en:'Get a 10x combo.', sq:'Arrijë kombo 10x.', de:'Erreiche eine 10er-Combo.'} },
  { id:'ocean_explorer', icon:'🌊', name:{en:'Ocean Explorer', sq:'Eksplorues i Oqeanit', de:'Ozean-Forscher'}, desc:{en:'Complete the ocean mode.', sq:'Plotëso oqeanin.', de:'Schließe den Ozean-Modus ab.'} },
  { id:'savannah_king', icon:'🦁', name:{en:'Savannah King', sq:'Mbreti i Savanës', de:'Savannen-König'}, desc:{en:'Complete the savannah mode.', sq:'Plotëso savanën.', de:'Schließe die Savanne ab.'} },
  { id:'no_mistakes', icon:'💎', name:{en:'Flawless', sq:'Pa Gabime', de:'Makellos'}, desc:{en:'Finish a phase without any mistakes.', sq:'Plotëso një fazë pa asnjë gabim.', de:'Beende eine Phase ohne Fehler.'} },
  { id:'powerup_user', icon:'⚡', name:{en:'Power Player', sq:'Lojtar i Fuqishëm', de:'Power-Spieler'}, desc:{en:'Use all four power-ups in a single game.', sq:'Përdor të katër fuqitë në një lojë.', de:'Nutze alle vier Power-ups in einem Spiel.'} },
];

// Daily challenges
const DAILY = [
  { id:'no_loss', text:{en:'Complete a phase without losing health.', sq:'Plotëso një fazë pa humbur shëndet.', de:'Phase ohne Schaden abschließen.'} },
  { id:'combo_7', text:{en:'Get a 7x combo today.', sq:'Arrijë kombo 7x sot.', de:'Erreiche heute eine 7er-Combo.'} },
  { id:'score_1000', text:{en:'Reach 1000 points in one game.', sq:'Arrijë 1000 pikë në një lojë.', de:'Erreiche 1000 Punkte in einem Spiel.'} },
  { id:'use_vet', text:{en:'Use the veterinarian power-up.', sq:'Përdor fuqinë e veterinerit.', de:'Nutze den Tierarzt-Power-up.'} },
  { id:'try_ocean', text:{en:'Play the ocean mode today.', sq:'Luaj në modalitetin e oqeanit sot.', de:'Spiele heute den Ozean-Modus.'} },
];

// Random events
const RANDOM_EVENTS = [
  { id:'rain', icon:'🌧️', text:{en:'It started raining!', sq:'Filloi shiu!', de:'Es regnet!'}, effect:'weather:rain' },
  { id:'sun', icon:'☀️', text:{en:'Sunshine! Animals are happy.', sq:'Diell! Kafshët janë të lumtura.', de:'Sonnenschein! Tiere sind glücklich.'}, effect:'bonus' },
  { id:'wind', icon:'🍃', text:{en:'A gentle wind blows...', sq:'Frynë një erë e lehtë...', de:'Ein sanfter Wind weht...'}, effect:'none' },
  { id:'storm', icon:'⛈️', text:{en:'A storm rolls in — be careful!', sq:'Po vjen një stuhi — kujdes!', de:'Ein Sturm zieht auf — Vorsicht!'}, effect:'storm' },
  { id:'night', icon:'🌙', text:{en:'Night falls. Predators wake up.', sq:'Bie nata. Grabitqarët zgjohen.', de:'Die Nacht bricht herein. Räuber erwachen.'}, effect:'night' },
  { id:'dawn', icon:'🌅', text:{en:'A new day begins.', sq:'Fillon një ditë e re.', de:'Ein neuer Tag beginnt.'}, effect:'day' },
];

function getName(id) {
  const e = ENTITIES[id];
  if (!e) return id;
  return (e.names[i18n.lang] || e.names.en);
}
function getEmoji(id) { return (ENTITIES[id] && ENTITIES[id].emoji) || '❓'; }
function isPoisonous(id) { return ENTITIES[id] && ENTITIES[id].kind === 'poison'; }
