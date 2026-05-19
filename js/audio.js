/* ============================================
   ANIMAL FEED CHAIN — Audio system (Web Audio API, no external files)
   ============================================ */

const Audio2 = {
  ctx: null,
  enabled: { music: true, sfx: true, voice: true },
  musicGain: null,
  sfxGain: null,
  musicNodes: null,
  musicTimer: null,

  init() {
    this.enabled.music = localStorage.getItem('afc.music') !== '0';
    this.enabled.sfx   = localStorage.getItem('afc.sfx')   !== '0';
    this.enabled.voice = localStorage.getItem('afc.voice') !== '0';
  },

  ensureCtx() {
    if (this.ctx) return this.ctx;
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      this.ctx = new C();
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.12;
      this.musicGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.4;
      this.sfxGain.connect(this.ctx.destination);
    } catch(e) { /* ignore */ }
    return this.ctx;
  },

  resume() {
    this.ensureCtx();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  setMusic(on) {
    this.enabled.music = on;
    localStorage.setItem('afc.music', on ? '1' : '0');
    if (!on) this.stopMusic();
    else this.startMusic();
  },
  setSfx(on)   { this.enabled.sfx = on; localStorage.setItem('afc.sfx', on ? '1' : '0'); },
  setVoice(on) { this.enabled.voice = on; localStorage.setItem('afc.voice', on ? '1' : '0'); },

  // ---------- SFX ----------
  beep(freq, dur, type='sine', vol=0.3, slide=0) {
    if (!this.enabled.sfx) return;
    this.ensureCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g).connect(this.sfxGain);
    o.start(now); o.stop(now + dur + 0.05);
  },

  correct() {
    this.beep(523, 0.08, 'triangle', 0.3);
    setTimeout(() => this.beep(784, 0.12, 'triangle', 0.3), 80);
    setTimeout(() => this.beep(1047, 0.18, 'triangle', 0.25), 180);
  },
  wrong() {
    this.beep(200, 0.2, 'sawtooth', 0.25, -80);
  },
  pop() { this.beep(880, 0.05, 'sine', 0.18); },
  click() { this.beep(440, 0.04, 'square', 0.12); },
  combo() {
    this.beep(660, 0.06, 'triangle', 0.3);
    setTimeout(() => this.beep(880, 0.06, 'triangle', 0.3), 60);
    setTimeout(() => this.beep(1320, 0.1, 'triangle', 0.28), 120);
  },
  star() {
    this.beep(1000, 0.06, 'triangle', 0.3);
    setTimeout(() => this.beep(1500, 0.06, 'triangle', 0.3), 80);
    setTimeout(() => this.beep(2000, 0.12, 'triangle', 0.28), 160);
  },
  gameover() {
    this.beep(440, 0.2, 'sawtooth', 0.25);
    setTimeout(() => this.beep(330, 0.2, 'sawtooth', 0.25), 200);
    setTimeout(() => this.beep(220, 0.4, 'sawtooth', 0.25), 400);
  },
  victory() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n,i) => setTimeout(() => this.beep(n, 0.18, 'triangle', 0.3), i*120));
  },
  sick() { this.beep(300, 0.15, 'sawtooth', 0.2, -100); },
  power() {
    this.beep(440, 0.08, 'triangle', 0.3);
    setTimeout(() => this.beep(660, 0.08, 'triangle', 0.3), 80);
    setTimeout(() => this.beep(880, 0.12, 'triangle', 0.3), 160);
  },

  // ---------- BACKGROUND MUSIC (gentle ambient loop) ----------
  startMusic() {
    if (!this.enabled.music) return;
    this.ensureCtx();
    if (!this.ctx) return;
    this.stopMusic();

    // Build a slow ambient pad with two detuned oscillators + gentle filter
    const ctx = this.ctx;
    const out = this.musicGain;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 1.2;
    filter.connect(out);

    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    a.type = 'sine'; b.type = 'triangle';
    const gA = ctx.createGain(); gA.gain.value = 0.0;
    const gB = ctx.createGain(); gB.gain.value = 0.0;
    a.connect(gA).connect(filter);
    b.connect(gB).connect(filter);
    a.start(); b.start();
    this.musicNodes = { a, b, gA, gB, filter };

    // Soft chord progression
    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 293.66, 349.23], // Am
      [196.00, 246.94, 349.23], // G
      [174.61, 220.00, 329.63], // F
    ];

    let i = 0;
    const playChord = () => {
      if (!this.musicNodes) return;
      const c = chords[i % chords.length];
      const now = this.ctx.currentTime;
      a.frequency.setTargetAtTime(c[0], now, 0.4);
      b.frequency.setTargetAtTime(c[1] / 2, now, 0.4);
      gA.gain.setTargetAtTime(0.5, now, 0.6);
      gB.gain.setTargetAtTime(0.4, now, 0.6);
      i++;
    };
    playChord();
    this.musicTimer = setInterval(playChord, 4000);
  },

  stopMusic() {
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
    if (this.musicNodes) {
      try {
        this.musicNodes.gA.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
        this.musicNodes.gB.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
        setTimeout(() => {
          try { this.musicNodes.a.stop(); this.musicNodes.b.stop(); } catch(e) {}
          this.musicNodes = null;
        }, 500);
      } catch(e) { this.musicNodes = null; }
    }
  },

  // ---------- VOICE NARRATION (SpeechSynthesis) ----------
  voice(text) {
    if (!this.enabled.voice) return;
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = i18n.getVoiceLang();
      u.rate = 0.95;
      u.pitch = 1.1;
      u.volume = 0.85;
      // pick a matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const m = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(u.lang.slice(0,2).toLowerCase()));
      if (m) u.voice = m;
      window.speechSynthesis.speak(u);
    } catch(e) { /* silent fail */ }
  },

  cancelVoice() {
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch(e) {}
    }
  }
};
