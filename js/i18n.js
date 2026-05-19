/* ============================================
   ANIMAL FEED CHAIN — Translations (EN / SQ / DE)
   ============================================ */

const I18N = {
  en: {
    'game.title': 'Animal Feed Chain',
    'game.tagline': 'Learn the food chain by feeding animals!',

    'menu.play': '▶ Play',
    'menu.howToPlay': 'How to Play',
    'menu.achievements': '🏆 Achievements',
    'menu.facts': '📚 Nature Facts',
    'menu.settings': '⚙ Settings',
    'menu.freeBadge': '100% Free • No Ads • For Kids',

    'modes.title': 'Choose an Ecosystem',
    'mode.farm': 'Farm',
    'mode.farm.desc': 'Feed chickens, cows and sheep',
    'mode.forest': 'Forest',
    'mode.forest.desc': 'Rabbits, foxes and wolves',
    'mode.ocean': 'Ocean',
    'mode.ocean.desc': 'Plankton, fish and sharks',
    'mode.savannah': 'Savannah',
    'mode.savannah.desc': 'Zebras, lions and elephants',

    'difficulty.title': 'Choose Difficulty',
    'diff.easy': 'Easy',
    'diff.easy.desc': 'Visual hints, glowing targets, slow gameplay',
    'diff.medium': 'Medium',
    'diff.medium.desc': 'No hints, more animals, faster gameplay',
    'diff.hard': 'Hard',
    'diff.hard.desc': 'Fake foods, poisonous traps, time limits',

    'hud.phase': 'Phase',
    'play.foods': 'Foods',
    'play.animals': 'Animals',

    'pause.title': '⏸ Paused',
    'pause.resume': '▶ Resume',
    'pause.restart': '🔁 Restart',
    'pause.quit': '🏠 Main Menu',

    'chain.title': '🌟 Food Chain Discovered!',
    'chain.next': 'Next Phase →',

    'gameover.title': 'Game Over',
    'gameover.retry': '🔁 Try Again',
    'gameover.menu': '🏠 Menu',
    'victory.title': 'Ecosystem Master!',
    'victory.message': 'You completed the entire food chain!',
    'victory.next': '▶ Next Mode',
    'victory.menu': '🏠 Menu',

    'summary.score': 'Score',
    'summary.health': 'Ecosystem Health',
    'summary.saved': 'Animals Saved',
    'summary.chains': 'Chains Completed',

    'achievements.title': '🏆 Achievements',
    'facts.title': '📚 Nature Facts',
    'howto.title': 'How to Play',
    'settings.title': '⚙ Settings',
    'settings.music': 'Music',
    'settings.sfx': 'Sound Effects',
    'settings.voice': 'Voice Narration',
    'settings.language': 'Language',
    'settings.reset': 'Reset Progress',

    'howto.step1': 'Drag food from the left side to an animal on the right side.',
    'howto.step2': 'Match the correct food to make the animal happy and gain points.',
    'howto.step3': 'Wrong foods make animals sick. If 3 animals die, the game ends.',
    'howto.step4': 'After each phase, the food chain grows: prey become food for predators!',
    'howto.step5': 'Use power-ups: revive, rain, shield, slow-motion.',

    'daily.title': '🎁 Daily Challenge',
    'daily.accept': 'Accept',
    'daily.skip': 'Maybe later',

    // Power-ups
    'power.vet': 'Veterinarian',
    'power.rain': 'Rain',
    'power.shield': 'Shield',
    'power.slow': 'Slow Motion',
    'power.vet.use': 'A sick animal was healed!',
    'power.rain.use': 'Rain brings new plants!',
    'power.shield.use': 'Shield activated — next mistake blocked!',
    'power.slow.use': 'Time slows down...',
    'power.empty': 'No more uses!',

    // Educational messages
    'edu.eats': '{animal} eats {food}',
    'edu.hunts': '{predator} hunts {prey}',
    'edu.wrong': '{animal} cannot eat that!',
    'edu.poison': 'Poisonous! Be careful.',

    // Ecosystem
    'eco.unstable': 'Ecosystem unstable!',
    'eco.prey.gone': 'Too many prey animals disappeared.',
    'eco.predator.starving': 'Predators are starving.',
    'eco.balanced': 'Nature is in balance.',

    // Combo
    'combo.text': 'Combo x{n}!',
    'combo.perfect': 'Perfect!',
    'combo.great': 'Great!',
    'combo.good': 'Good!',

    // Game end summaries
    'summary.eduHerbivore': 'Herbivores like rabbits and cows eat plants. They are the base of every food chain.',
    'summary.eduCarnivore': 'Carnivores like wolves and sharks hunt other animals to survive.',
    'summary.eduOmnivore': 'Omnivores like bears and pigs eat both plants and animals.',
    'summary.eduBalance': 'Every ecosystem needs balance: producers, prey and predators all matter.',

    'reset.confirm': 'Reset all progress?',
    'reset.done': 'Progress reset!',

    'phase.complete': 'Phase complete!',
    'achievement.unlocked': '🏆 Achievement unlocked: {name}',
  },

  sq: {
    'game.title': 'Zinxhiri i Ushqimit',
    'game.tagline': 'Mëso zinxhirin ushqimor duke ushqyer kafshët!',

    'menu.play': '▶ Luaj',
    'menu.howToPlay': 'Si të luash',
    'menu.achievements': '🏆 Arritjet',
    'menu.facts': '📚 Fakte për Natyrën',
    'menu.settings': '⚙ Cilësimet',
    'menu.freeBadge': '100% Falas • Pa Reklama • Për Fëmijë',

    'modes.title': 'Zgjidh një Ekosistem',
    'mode.farm': 'Ferma',
    'mode.farm.desc': 'Ushqe pulat, lopët dhe delet',
    'mode.forest': 'Pylli',
    'mode.forest.desc': 'Lepuj, dhelpra dhe ujqër',
    'mode.ocean': 'Oqeani',
    'mode.ocean.desc': 'Plankton, peshq dhe peshkaqenë',
    'mode.savannah': 'Savana',
    'mode.savannah.desc': 'Zebra, luanë dhe elefantë',

    'difficulty.title': 'Zgjidh Vështirësinë',
    'diff.easy': 'E Lehtë',
    'diff.easy.desc': 'Sugjerime vizuale, objektiva të ndriçuar, lojë e ngadaltë',
    'diff.medium': 'Mesatare',
    'diff.medium.desc': 'Pa sugjerime, më shumë kafshë, lojë më e shpejtë',
    'diff.hard': 'E Vështirë',
    'diff.hard.desc': 'Ushqime të rreme, gracka helmuese, kufi kohor',

    'hud.phase': 'Faza',
    'play.foods': 'Ushqime',
    'play.animals': 'Kafshë',

    'pause.title': '⏸ Pauzë',
    'pause.resume': '▶ Vazhdo',
    'pause.restart': '🔁 Rifillo',
    'pause.quit': '🏠 Menyja',

    'chain.title': '🌟 Zbulove Zinxhirin Ushqimor!',
    'chain.next': 'Faza Tjetër →',

    'gameover.title': 'Loja Mbaroi',
    'gameover.retry': '🔁 Provo Përsëri',
    'gameover.menu': '🏠 Menyja',
    'victory.title': 'Mjeshtër i Ekosistemit!',
    'victory.message': 'E plotësove zinxhirin e plotë ushqimor!',
    'victory.next': '▶ Modaliteti Tjetër',
    'victory.menu': '🏠 Menyja',

    'summary.score': 'Pikët',
    'summary.health': 'Shëndeti i Ekosistemit',
    'summary.saved': 'Kafshë të Shpëtuara',
    'summary.chains': 'Zinxhirë të Plotësuar',

    'achievements.title': '🏆 Arritjet',
    'facts.title': '📚 Fakte për Natyrën',
    'howto.title': 'Si të Luash',
    'settings.title': '⚙ Cilësimet',
    'settings.music': 'Muzika',
    'settings.sfx': 'Efektet zanore',
    'settings.voice': 'Narracioni',
    'settings.language': 'Gjuha',
    'settings.reset': 'Rivendos përparimin',

    'howto.step1': 'Tërhiq ushqimin nga e majta tek një kafshë në të djathtë.',
    'howto.step2': 'Përputh ushqimin e duhur për të bërë kafshën të lumtur dhe për të fituar pikë.',
    'howto.step3': 'Ushqimet e gabuara i sëmurin kafshët. Nëse 3 kafshë vdesin, loja mbaron.',
    'howto.step4': 'Pas çdo faze, zinxhiri rritet: preja bëhet ushqim për grabitqarët!',
    'howto.step5': 'Përdor fuqi: ringjallje, shi, mburojë, lëvizje e ngadaltë.',

    'daily.title': '🎁 Sfida e Ditës',
    'daily.accept': 'Prano',
    'daily.skip': 'Më vonë',

    'power.vet': 'Veteriner',
    'power.rain': 'Shi',
    'power.shield': 'Mburojë',
    'power.slow': 'Lëvizje e Ngadaltë',
    'power.vet.use': 'Një kafshë e sëmurë u shërua!',
    'power.rain.use': 'Shiu sjell bimë të reja!',
    'power.shield.use': 'Mburoja u aktivizua — gabimi tjetër bllokohet!',
    'power.slow.use': 'Koha ngadalësohet...',
    'power.empty': 'Pa përdorime të tjera!',

    'edu.eats': '{animal} ha {food}',
    'edu.hunts': '{predator} gjuan {prey}',
    'edu.wrong': '{animal} nuk mund ta hajë këtë!',
    'edu.poison': 'Helmues! Ki kujdes.',

    'eco.unstable': 'Ekosistemi i paqëndrueshëm!',
    'eco.prey.gone': 'Shumë kafshë preje u zhdukën.',
    'eco.predator.starving': 'Grabitqarët po vdesin urie.',
    'eco.balanced': 'Natyra është në ekuilibër.',

    'combo.text': 'Kombo x{n}!',
    'combo.perfect': 'Perfekte!',
    'combo.great': 'Shumë mirë!',
    'combo.good': 'Mirë!',

    'summary.eduHerbivore': 'Bimëngrënësit si lepujt dhe lopët hanë bimë. Ato janë baza e çdo zinxhiri ushqimor.',
    'summary.eduCarnivore': 'Mishngrënësit si ujqit dhe peshkaqenët gjuajnë kafshë të tjera për të mbijetuar.',
    'summary.eduOmnivore': 'Gjithëngrënësit si ariu dhe derri hanë bimë dhe kafshë.',
    'summary.eduBalance': 'Çdo ekosistem ka nevojë për ekuilibër: prodhuesit, preja dhe grabitqarët.',

    'reset.confirm': 'Të rivendoset i gjithë përparimi?',
    'reset.done': 'Përparimi u rivendos!',

    'phase.complete': 'Faza u plotësua!',
    'achievement.unlocked': '🏆 Arritje e shkyçur: {name}',
  },

  de: {
    'game.title': 'Tiernahrungskette',
    'game.tagline': 'Lerne die Nahrungskette beim Tierefüttern!',

    'menu.play': '▶ Spielen',
    'menu.howToPlay': 'Wie man spielt',
    'menu.achievements': '🏆 Erfolge',
    'menu.facts': '📚 Naturfakten',
    'menu.settings': '⚙ Einstellungen',
    'menu.freeBadge': '100% kostenlos • Keine Werbung • Für Kinder',

    'modes.title': 'Wähle ein Ökosystem',
    'mode.farm': 'Bauernhof',
    'mode.farm.desc': 'Hühner, Kühe und Schafe füttern',
    'mode.forest': 'Wald',
    'mode.forest.desc': 'Hasen, Füchse und Wölfe',
    'mode.ocean': 'Ozean',
    'mode.ocean.desc': 'Plankton, Fische und Haie',
    'mode.savannah': 'Savanne',
    'mode.savannah.desc': 'Zebras, Löwen und Elefanten',

    'difficulty.title': 'Schwierigkeit wählen',
    'diff.easy': 'Leicht',
    'diff.easy.desc': 'Visuelle Hinweise, leuchtende Ziele, langsames Spiel',
    'diff.medium': 'Mittel',
    'diff.medium.desc': 'Keine Hinweise, mehr Tiere, schneller',
    'diff.hard': 'Schwer',
    'diff.hard.desc': 'Falsche Nahrung, giftige Fallen, Zeitlimit',

    'hud.phase': 'Phase',
    'play.foods': 'Nahrung',
    'play.animals': 'Tiere',

    'pause.title': '⏸ Pause',
    'pause.resume': '▶ Weiter',
    'pause.restart': '🔁 Neustart',
    'pause.quit': '🏠 Hauptmenü',

    'chain.title': '🌟 Nahrungskette entdeckt!',
    'chain.next': 'Nächste Phase →',

    'gameover.title': 'Spiel vorbei',
    'gameover.retry': '🔁 Nochmal',
    'gameover.menu': '🏠 Menü',
    'victory.title': 'Ökosystem-Meister!',
    'victory.message': 'Du hast die gesamte Nahrungskette gemeistert!',
    'victory.next': '▶ Nächster Modus',
    'victory.menu': '🏠 Menü',

    'summary.score': 'Punkte',
    'summary.health': 'Ökosystem-Gesundheit',
    'summary.saved': 'Gerettete Tiere',
    'summary.chains': 'Komplette Ketten',

    'achievements.title': '🏆 Erfolge',
    'facts.title': '📚 Naturfakten',
    'howto.title': 'Wie man spielt',
    'settings.title': '⚙ Einstellungen',
    'settings.music': 'Musik',
    'settings.sfx': 'Soundeffekte',
    'settings.voice': 'Sprachausgabe',
    'settings.language': 'Sprache',
    'settings.reset': 'Fortschritt zurücksetzen',

    'howto.step1': 'Ziehe Nahrung von links zu einem Tier rechts.',
    'howto.step2': 'Passende Nahrung macht das Tier glücklich und gibt Punkte.',
    'howto.step3': 'Falsche Nahrung macht Tiere krank. Bei 3 Toten endet das Spiel.',
    'howto.step4': 'Nach jeder Phase wächst die Kette: Beute wird zur Nahrung der Räuber!',
    'howto.step5': 'Nutze Power-ups: Heilen, Regen, Schild, Zeitlupe.',

    'daily.title': '🎁 Tägliche Herausforderung',
    'daily.accept': 'Annehmen',
    'daily.skip': 'Später',

    'power.vet': 'Tierarzt',
    'power.rain': 'Regen',
    'power.shield': 'Schild',
    'power.slow': 'Zeitlupe',
    'power.vet.use': 'Ein krankes Tier wurde geheilt!',
    'power.rain.use': 'Regen lässt Pflanzen wachsen!',
    'power.shield.use': 'Schild aktiviert — nächster Fehler blockiert!',
    'power.slow.use': 'Die Zeit wird langsamer...',
    'power.empty': 'Keine weiteren Anwendungen!',

    'edu.eats': '{animal} frisst {food}',
    'edu.hunts': '{predator} jagt {prey}',
    'edu.wrong': '{animal} kann das nicht fressen!',
    'edu.poison': 'Giftig! Vorsicht.',

    'eco.unstable': 'Ökosystem instabil!',
    'eco.prey.gone': 'Zu viele Beutetiere sind verschwunden.',
    'eco.predator.starving': 'Räuber verhungern.',
    'eco.balanced': 'Die Natur ist im Gleichgewicht.',

    'combo.text': 'Combo x{n}!',
    'combo.perfect': 'Perfekt!',
    'combo.great': 'Großartig!',
    'combo.good': 'Gut!',

    'summary.eduHerbivore': 'Pflanzenfresser wie Hasen und Kühe fressen Pflanzen. Sie sind die Basis jeder Nahrungskette.',
    'summary.eduCarnivore': 'Fleischfresser wie Wölfe und Haie jagen andere Tiere, um zu überleben.',
    'summary.eduOmnivore': 'Allesfresser wie Bären und Schweine fressen Pflanzen und Tiere.',
    'summary.eduBalance': 'Jedes Ökosystem braucht Gleichgewicht: Erzeuger, Beute und Räuber.',

    'reset.confirm': 'Allen Fortschritt zurücksetzen?',
    'reset.done': 'Fortschritt zurückgesetzt!',

    'phase.complete': 'Phase abgeschlossen!',
    'achievement.unlocked': '🏆 Erfolg freigeschaltet: {name}',
  }
};

const i18n = {
  lang: localStorage.getItem('afc.lang') || (navigator.language || 'en').slice(0,2),
  voiceLangMap: { en: 'en-US', sq: 'sq-AL', de: 'de-DE' },

  init() {
    if (!I18N[this.lang]) this.lang = 'en';
    this.apply();
  },

  setLang(lang) {
    if (!I18N[lang]) return;
    this.lang = lang;
    localStorage.setItem('afc.lang', lang);
    this.apply();
  },

  t(key, vars) {
    let str = (I18N[this.lang] && I18N[this.lang][key]) || I18N.en[key] || key;
    if (vars) {
      for (const k in vars) {
        str = str.replace(`{${k}}`, vars[k]);
      }
    }
    return str;
  },

  apply() {
    document.documentElement.lang = this.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === this.lang);
    });
    const select = document.getElementById('settings-lang');
    if (select) select.value = this.lang;
  },

  getVoiceLang() {
    return this.voiceLangMap[this.lang] || 'en-US';
  }
};
