/* ============================================
   ANIMAL FEED CHAIN — Achievements & Persistence
   ============================================ */

const Storage = {
  get(key, def) {
    try {
      const v = localStorage.getItem('afc.' + key);
      return v === null ? def : JSON.parse(v);
    } catch(e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem('afc.' + key, JSON.stringify(val)); } catch(e) {}
  },
  remove(key) { try { localStorage.removeItem('afc.' + key); } catch(e) {} }
};

const Progress = {
  data: null,

  load() {
    this.data = Storage.get('progress', {
      achievements: {},        // id -> true
      modesCompleted: {},      // modeKey -> true
      bestScore: {},           // modeKey -> number
      totalSaved: 0,
      maxCombo: 0,
      powerupsUsed: {},        // set of types used in current game (reset on new game)
      seenFacts: [],
      dailyDate: null,
      dailyCompleted: false,
      lastMode: null,
    });
    return this.data;
  },

  save() { Storage.set('progress', this.data); },

  unlock(id) {
    if (this.data.achievements[id]) return false;
    this.data.achievements[id] = true;
    this.save();
    return true;
  },

  reset() {
    Storage.remove('progress');
    this.load();
  },

  isUnlocked(id) { return !!this.data.achievements[id]; },

  totalUnlocked() {
    return Object.keys(this.data.achievements).length;
  }
};
