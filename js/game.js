/* ============================================
   ANIMAL FEED CHAIN — Main game logic
   ============================================ */

const Game = {
  // ---------- state ----------
  state: {
    screen: 'menu',
    mode: 'farm',
    difficulty: 'easy',
    phaseIndex: 0,
    score: 0,
    combo: 1,
    lives: 3,
    animalsSaved: 0,
    chainsCompleted: 0,
    paused: false,
    gameOver: false,
    powerups: { vet: 1, rain: 1, shield: 1, slow: 1 },
    shieldActive: false,
    slowActive: false,
    leftItems: [],   // [{id, uid, ...}]
    rightItems: [],  // [{id, uid, hp, dead, eaten}]
    phaseTimer: null,
    phaseTimerLeft: 0,
    phaseTimerTotal: 0,
    night: false,
    powerupsUsedThisGame: new Set(),
    mistakesThisPhase: 0,
    correctRequired: 0,
  },

  // ---------- difficulty profiles ----------
  difficulties: {
    easy:   { speedMul: 0.5, animalHp: 3, hints: true, fakes: 0, poison: 0, timeLimit: 0, requireAll: false },
    medium: { speedMul: 1.0, animalHp: 2, hints: false, fakes: 1, poison: 0, timeLimit: 0, requireAll: true },
    hard:   { speedMul: 1.5, animalHp: 2, hints: false, fakes: 2, poison: 1, timeLimit: 45, requireAll: true },
  },

  // ---------- init ----------
  init() {
    i18n.init();
    Audio2.init();
    Progress.load();
    BG.init();

    // Loading screen → menu
    setTimeout(() => {
      this.showScreen('menu');
    }, 1600);

    this.bindEvents();
    this.maybeShowDaily();
  },

  // ---------- screen management ----------
  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
    this.state.screen = name;

    if (name === 'menu') {
      BG.stop();
    } else if (name === 'game') {
      BG.start();
    }
  },

  closeAllOverlays() {
    document.querySelectorAll('.overlay').forEach(o => o.classList.remove('active'));
  },

  openOverlay(id) {
    this.closeAllOverlays();
    const o = document.getElementById(id);
    if (o) o.classList.add('active');
  },

  // ---------- events ----------
  bindEvents() {
    const $ = id => document.getElementById(id);

    // Menu navigation
    $('btn-play').addEventListener('click', () => { Audio2.click(); Audio2.resume(); Audio2.startMusic(); this.showScreen('modes'); });
    $('btn-how-to-play').addEventListener('click', () => { Audio2.click(); this.openOverlay('overlay-howto'); });
    $('btn-achievements').addEventListener('click', () => { Audio2.click(); this.renderAchievements(); this.openOverlay('overlay-achievements'); });
    $('btn-facts').addEventListener('click', () => { Audio2.click(); this.renderFacts(); this.openOverlay('overlay-facts'); });
    $('btn-settings').addEventListener('click', () => { Audio2.click(); this.openSettings(); });

    // Close buttons
    $('btn-modes-back').addEventListener('click', () => { Audio2.click(); this.showScreen('menu'); });
    $('btn-difficulty-back').addEventListener('click', () => { Audio2.click(); this.showScreen('modes'); });
    $('btn-howto-close').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); });
    $('btn-ach-close').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); });
    $('btn-facts-close').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); });
    $('btn-settings-close').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); });

    // Mode cards
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        Audio2.click();
        this.state.mode = card.dataset.mode;
        this.showScreen('difficulty');
      });
    });

    // Difficulty cards
    document.querySelectorAll('.difficulty-card').forEach(card => {
      card.addEventListener('click', () => {
        Audio2.click();
        this.state.difficulty = card.dataset.difficulty;
        this.startGame();
      });
    });

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Audio2.click();
        i18n.setLang(btn.dataset.lang);
      });
    });

    // Settings language select
    document.getElementById('settings-lang').addEventListener('change', e => i18n.setLang(e.target.value));
    document.getElementById('btn-reset-progress').addEventListener('click', () => {
      if (confirm(i18n.t('reset.confirm'))) {
        Progress.reset();
        this.toast(i18n.t('reset.done'), 'success');
      }
    });

    // Audio toggles in settings
    const bindToggle = (selector, audioFn, key) => {
      document.querySelectorAll(selector).forEach(input => {
        input.checked = Audio2.enabled[key];
        input.addEventListener('change', e => {
          audioFn(e.target.checked);
          // sync other instances
          document.querySelectorAll(selector).forEach(o => { if (o !== e.target) o.checked = e.target.checked; });
        });
      });
    };
    bindToggle('#toggle-music, .toggle-music', v => Audio2.setMusic(v), 'music');
    bindToggle('#toggle-sfx, .toggle-sfx', v => Audio2.setSfx(v), 'sfx');
    bindToggle('#toggle-voice, .toggle-voice', v => Audio2.setVoice(v), 'voice');

    // Pause overlay
    document.getElementById('btn-pause').addEventListener('click', () => { Audio2.click(); this.togglePause(true); });
    document.getElementById('btn-resume').addEventListener('click', () => { Audio2.click(); this.togglePause(false); });
    document.getElementById('btn-restart').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); this.startGame(); });
    document.getElementById('btn-quit').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); this.endGame(false); this.showScreen('menu'); });

    // Chain overlay
    document.getElementById('btn-chain-next').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); this.nextPhase(); });

    // Game over
    document.getElementById('btn-go-retry').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); this.startGame(); });
    document.getElementById('btn-go-menu').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); this.showScreen('menu'); });

    // Victory
    document.getElementById('btn-vc-next').addEventListener('click', () => {
      Audio2.click();
      this.closeAllOverlays();
      const order = ['farm','forest','ocean','savannah'];
      const i = order.indexOf(this.state.mode);
      this.state.mode = order[(i+1) % order.length];
      this.startGame();
    });
    document.getElementById('btn-vc-menu').addEventListener('click', () => { Audio2.click(); this.closeAllOverlays(); this.showScreen('menu'); });

    // Fullscreen
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      Audio2.click();
      const el = document.documentElement;
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    });

    // Powerups
    document.querySelectorAll('.powerup-btn').forEach(btn => {
      btn.addEventListener('click', () => this.usePowerup(btn.dataset.power));
    });

    // Daily
    document.getElementById('btn-daily-accept').addEventListener('click', () => {
      Audio2.click();
      this.closeAllOverlays();
      this.showScreen('modes');
    });
    document.getElementById('btn-daily-skip').addEventListener('click', () => {
      Audio2.click();
      this.closeAllOverlays();
    });

    // Visibility — pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state.screen === 'game' && !this.state.gameOver) {
        this.togglePause(true);
      }
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', e => {
      if (this.state.screen === 'game') {
        if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
          this.togglePause(!this.state.paused);
        }
      }
    });
  },

  // ---------- daily challenge ----------
  maybeShowDaily() {
    const today = new Date().toISOString().slice(0,10);
    const prog = Progress.data;
    if (prog.dailyDate !== today) {
      prog.dailyDate = today;
      prog.dailyCompleted = false;
      const idx = Math.floor((+new Date(today)) / 86400000) % DAILY.length;
      prog.dailyId = DAILY[idx].id;
      Progress.save();
      setTimeout(() => {
        document.getElementById('daily-text').textContent = DAILY[idx].text[i18n.lang] || DAILY[idx].text.en;
        this.openOverlay('overlay-daily');
      }, 1800);
    }
  },

  openSettings() {
    document.getElementById('settings-lang').value = i18n.lang;
    document.querySelectorAll('.toggle-music').forEach(i => i.checked = Audio2.enabled.music);
    document.querySelectorAll('.toggle-sfx').forEach(i => i.checked = Audio2.enabled.sfx);
    document.querySelectorAll('.toggle-voice').forEach(i => i.checked = Audio2.enabled.voice);
    this.openOverlay('overlay-settings');
  },

  // ---------- achievements / facts rendering ----------
  renderAchievements() {
    const list = document.getElementById('achievements-list');
    list.innerHTML = '';
    ACHIEVEMENTS.forEach(a => {
      const u = Progress.isUnlocked(a.id);
      const card = document.createElement('div');
      card.className = 'achievement-card ' + (u ? 'unlocked' : 'locked');
      card.innerHTML = `
        <div class="achievement-icon">${u ? a.icon : '🔒'}</div>
        <div class="achievement-info">
          <h4>${a.name[i18n.lang] || a.name.en}</h4>
          <p>${a.desc[i18n.lang] || a.desc.en}</p>
        </div>
      `;
      list.appendChild(card);
    });
  },

  renderFacts() {
    const list = document.getElementById('facts-list');
    list.innerHTML = '';
    FACTS.forEach(f => {
      const c = document.createElement('div');
      c.className = 'fact-card';
      c.innerHTML = `<div class="fact-icon">${f.icon}</div><p>${f.text[i18n.lang] || f.text.en}</p>`;
      list.appendChild(c);
    });
  },

  // ---------- start / setup ----------
  startGame() {
    this.state.phaseIndex = 0;
    this.state.score = 0;
    this.state.combo = 1;
    this.state.lives = 3;
    this.state.animalsSaved = 0;
    this.state.chainsCompleted = 0;
    this.state.gameOver = false;
    this.state.paused = false;
    this.state.shieldActive = false;
    this.state.slowActive = false;
    this.state.powerups = { vet: 1, rain: 1, shield: 1, slow: 1 };
    this.state.powerupsUsedThisGame = new Set();
    this.state.mistakesThisPhase = 0;

    // Mode background
    const screen = document.getElementById('screen-game');
    screen.className = 'screen active mode-' + this.state.mode;
    BG.setMode(this.state.mode);
    BG.setNight(false);
    this.state.night = false;

    Progress.data.lastMode = this.state.mode;
    Progress.save();

    this.showScreen('game');
    this.updateHUD();
    this.setupPhase();

    // Voice intro
    const intro = (MODES[this.state.mode].name[i18n.lang] || MODES[this.state.mode].name.en);
    Audio2.voice(intro);
  },

  setupPhase() {
    const mode = MODES[this.state.mode];
    const phase = mode.phases[this.state.phaseIndex];
    if (!phase) return this.win();

    const diff = this.difficulties[this.state.difficulty];

    // Left items (foods) — ensure every right animal has at least one valid food.
    this.state.leftItems = [];
    const rightAnimals = phase.right;
    // Start by adding one of each food in phase.left
    phase.left.forEach(id => {
      this.state.leftItems.push({ id, uid: 'L' + Math.random().toString(36).slice(2,8) });
    });
    // Then for each animal, guarantee at least 2 valid foods exist
    rightAnimals.forEach(animalId => {
      const ent = ENTITIES[animalId];
      const eats = (ent && ent.eats) || [];
      const validInLeft = eats.filter(f => phase.left.includes(f));
      let count = this.state.leftItems.filter(li => validInLeft.includes(li.id)).length;
      while (count < 2 && validInLeft.length > 0) {
        const id = validInLeft[count % validInLeft.length];
        this.state.leftItems.push({ id, uid: 'L' + Math.random().toString(36).slice(2,8) });
        count++;
      }
    });
    // Top up to a comfortable minimum
    const minTotal = rightAnimals.length * 2 + 2;
    let idx = 0;
    while (this.state.leftItems.length < minTotal) {
      const id = phase.left[idx % phase.left.length];
      this.state.leftItems.push({ id, uid: 'L' + Math.random().toString(36).slice(2,8) });
      idx++;
    }
    // Add fake/poison foods on hard
    if (diff.poison > 0) {
      for (let i=0; i<diff.poison; i++) {
        const p = ['poison','candy','rock'][i % 3];
        this.state.leftItems.push({ id:p, uid:'P'+Math.random().toString(36).slice(2,8), poison:true });
      }
    }
    if (diff.fakes > 0) {
      // add foods this phase's animals will not eat
      const validIds = new Set();
      phase.right.forEach(a => (ENTITIES[a].eats || []).forEach(e => validIds.add(e)));
      const candidates = Object.values(ENTITIES).filter(e => e.kind === 'plant' && !validIds.has(e.id) && !phase.left.includes(e.id));
      for (let i=0; i<diff.fakes && i<candidates.length; i++) {
        this.state.leftItems.push({ id:candidates[i].id, uid:'F'+Math.random().toString(36).slice(2,8), fake:true });
      }
    }

    // Shuffle left
    this.state.leftItems = shuffle(this.state.leftItems);

    // Right items (animals) — duplicate if medium/hard for more action
    this.state.rightItems = [];
    let rightSrc = phase.right.slice();
    if (this.state.difficulty !== 'easy' && rightSrc.length < 4) {
      rightSrc = rightSrc.concat(phase.right);
    }
    rightSrc.forEach(id => {
      this.state.rightItems.push({
        id, uid: 'R' + Math.random().toString(36).slice(2,8),
        hp: diff.animalHp, maxHp: diff.animalHp, dead:false, eaten:false
      });
    });

    this.state.correctRequired = this.state.rightItems.length;
    this.state.mistakesThisPhase = 0;

    this.renderItems();

    // Timer for hard mode
    this.clearTimer();
    if (diff.timeLimit > 0) {
      const tWrap = document.getElementById('hud-timer-wrap');
      tWrap.style.display = 'block';
      this.state.phaseTimerTotal = diff.timeLimit;
      this.state.phaseTimerLeft = diff.timeLimit;
      this.state.phaseTimer = setInterval(() => {
        if (this.state.paused) return;
        this.state.phaseTimerLeft -= 0.1;
        const pct = Math.max(0, this.state.phaseTimerLeft / this.state.phaseTimerTotal) * 100;
        document.getElementById('hud-timer-fill').style.width = pct + '%';
        if (this.state.phaseTimerLeft <= 0) {
          this.clearTimer();
          this.eduMessage(i18n.t('eco.unstable'), 1500);
          this.loseLife('Time up!');
        }
      }, 100);
    } else {
      document.getElementById('hud-timer-wrap').style.display = 'none';
    }

    // Random event chance
    if (Math.random() < 0.4) this.triggerRandomEvent();

    this.updateHUD();
  },

  clearTimer() {
    if (this.state.phaseTimer) {
      clearInterval(this.state.phaseTimer);
      this.state.phaseTimer = null;
    }
  },

  // ---------- render items ----------
  renderItems() {
    const leftEl = document.getElementById('left-items');
    const rightEl = document.getElementById('right-items');
    leftEl.innerHTML = '';
    rightEl.innerHTML = '';

    this.state.leftItems.forEach(it => leftEl.appendChild(this.makeItem(it, 'left')));
    this.state.rightItems.forEach(it => rightEl.appendChild(this.makeItem(it, 'right')));

    // Apply hints on easy
    if (this.difficulties[this.state.difficulty].hints) {
      // Suggest one valid pairing
      this.updateHints();
    }
  },

  makeItem(item, side) {
    const div = document.createElement('div');
    div.className = 'item';
    div.dataset.uid = item.uid;
    div.dataset.id = item.id;
    div.dataset.side = side;
    if (item.poison) div.classList.add('poisonous');
    if (item.fake) div.classList.add('fake');
    const ent = ENTITIES[item.id];
    const name = (ent && ent.names && (ent.names[i18n.lang] || ent.names.en)) || item.id;
    div.innerHTML = `
      <div class="emoji">${ent ? ent.emoji : '❓'}</div>
      <div class="label">${name}</div>
      ${side === 'right' ? `<div class="health-bar"><div class="health-bar-fill" style="width:${(item.hp/item.maxHp)*100}%"></div></div>` : ''}
    `;
    if (side === 'left') {
      this.attachDrag(div, item);
    }
    return div;
  },

  updateHints() {
    document.querySelectorAll('#left-items .item').forEach(el => el.classList.remove('hint-glow'));
    // Glow one food that matches a hungry animal
    for (const li of this.state.leftItems) {
      if (li.poison) continue;
      for (const ri of this.state.rightItems) {
        if (ri.dead || ri.eaten) continue;
        const eats = (ENTITIES[ri.id] && ENTITIES[ri.id].eats) || [];
        if (eats.includes(li.id)) {
          const el = document.querySelector(`.item[data-uid="${li.uid}"]`);
          if (el) el.classList.add('hint-glow');
          return;
        }
      }
    }
  },

  // ---------- drag and drop ----------
  attachDrag(el, item) {
    let dragging = null;
    let startX, startY;
    let origRect;

    const onStart = (e) => {
      if (this.state.paused || this.state.gameOver) return;
      const pt = pointFromEvent(e);
      if (!pt) return;
      e.preventDefault();
      dragging = el;
      origRect = el.getBoundingClientRect();
      startX = pt.x;
      startY = pt.y;

      // Clone visual to fx-layer
      const clone = el.cloneNode(true);
      clone.classList.add('dragging');
      clone.style.position = 'fixed';
      clone.style.left = origRect.left + 'px';
      clone.style.top = origRect.top + 'px';
      clone.style.width = origRect.width + 'px';
      clone.style.height = origRect.height + 'px';
      clone.style.zIndex = 9999;
      document.body.appendChild(clone);
      el.style.opacity = '0.3';
      el.dragClone = clone;
      Audio2.pop();
    };

    const onMove = (e) => {
      if (!dragging) return;
      const pt = pointFromEvent(e);
      if (!pt) return;
      e.preventDefault();
      const dx = pt.x - startX;
      const dy = pt.y - startY;
      const clone = dragging.dragClone;
      if (clone) {
        clone.style.transform = `translate(${dx}px, ${dy}px) scale(1.18) rotate(-3deg)`;
      }
      // Hover detection
      const targetEl = document.elementsFromPoint(pt.x, pt.y).find(n => n.classList && n.classList.contains('item') && n.dataset.side === 'right');
      document.querySelectorAll('#right-items .item').forEach(n => n.classList.remove('target-hot','target-bad'));
      if (targetEl) {
        const targetItem = this.state.rightItems.find(r => r.uid === targetEl.dataset.uid);
        if (targetItem && !targetItem.dead && !targetItem.eaten) {
          const ok = this.canEat(targetItem.id, item.id);
          targetEl.classList.add(ok ? 'target-hot' : 'target-bad');
        }
      }
    };

    const onEnd = (e) => {
      if (!dragging) return;
      const pt = pointFromEvent(e) || { x:startX, y:startY };
      const clone = dragging.dragClone;
      const targetEl = document.elementsFromPoint(pt.x, pt.y).find(n => n.classList && n.classList.contains('item') && n.dataset.side === 'right');
      document.querySelectorAll('#right-items .item').forEach(n => n.classList.remove('target-hot','target-bad'));

      if (targetEl) {
        const target = this.state.rightItems.find(r => r.uid === targetEl.dataset.uid);
        if (target && !target.dead && !target.eaten) {
          this.attemptFeed(item, target);
        }
      }

      if (clone) clone.remove();
      dragging.style.opacity = '';
      dragging.dragClone = null;
      dragging = null;
    };

    el.addEventListener('mousedown', onStart, { passive:false });
    el.addEventListener('touchstart', onStart, { passive:false });
    window.addEventListener('mousemove', onMove, { passive:false });
    window.addEventListener('touchmove', onMove, { passive:false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
  },

  canEat(animalId, foodId) {
    const ent = ENTITIES[animalId];
    if (!ent) return false;
    if (isPoisonous(foodId)) return false;
    return (ent.eats || []).includes(foodId);
  },

  // ---------- feeding ----------
  attemptFeed(food, animal) {
    if (animal.dead || animal.eaten) return;
    const animalEl = document.querySelector(`.item[data-uid="${animal.uid}"]`);
    const foodEl = document.querySelector(`.item[data-uid="${food.uid}"]`);

    if (this.canEat(animal.id, food.id)) {
      this.onCorrectFeed(food, animal, foodEl, animalEl);
    } else {
      this.onWrongFeed(food, animal, foodEl, animalEl);
    }
  },

  onCorrectFeed(food, animal, foodEl, animalEl) {
    animal.eaten = true;
    this.state.animalsSaved++;
    this.state.score += 10 * this.state.combo;
    this.state.combo = Math.min(this.state.combo + 1, 99);
    if (this.state.combo > Progress.data.maxCombo) {
      Progress.data.maxCombo = this.state.combo;
      Progress.save();
    }

    if (animalEl) {
      animalEl.classList.add('happy');
      this.spawnParticles(animalEl, ['✨','💖','⭐'], 8);
      this.floatText(animalEl, `+${10 * (this.state.combo-1)}`, false);
    }
    Audio2.correct();
    if (this.state.combo >= 3) Audio2.combo();

    // remove food item from left
    this.removeLeftItem(food.uid);

    // Educational message
    const animalName = getName(animal.id);
    const foodName = getName(food.id);
    const isPrey = ENTITIES[food.id] && ENTITIES[food.id].kind === 'animal';
    const msg = isPrey
      ? i18n.t('edu.hunts', { predator: animalName, prey: foodName })
      : i18n.t('edu.eats', { animal: animalName, food: foodName });
    this.eduMessage(msg, 1500);
    Audio2.voice(msg);

    // Achievements
    Progress.unlock('first_feed') && this.notifyAchievement('first_feed');
    if (this.state.combo >= 5) Progress.unlock('combo_5') && this.notifyAchievement('combo_5');
    if (this.state.combo >= 10) Progress.unlock('combo_10') && this.notifyAchievement('combo_10');

    if (animalEl) {
      const fill = animalEl.querySelector('.health-bar-fill');
      if (fill) fill.style.width = '100%';
    }

    this.updateHUD();
    this.checkPhaseComplete();
    if (this.difficulties[this.state.difficulty].hints) this.updateHints();
  },

  onWrongFeed(food, animal, foodEl, animalEl) {
    if (this.state.shieldActive) {
      this.state.shieldActive = false;
      this.eduMessage(i18n.t('power.shield.use'), 1200);
      if (animalEl) animalEl.classList.remove('shielded');
      Audio2.pop();
      return;
    }
    this.state.combo = 1;
    this.state.mistakesThisPhase++;
    animal.hp -= 1;

    if (animalEl) {
      animalEl.classList.add('sick');
      setTimeout(() => animalEl.classList.remove('sick'), 600);
      const fill = animalEl.querySelector('.health-bar-fill');
      if (fill) {
        const pct = Math.max(0, (animal.hp / animal.maxHp) * 100);
        fill.style.width = pct + '%';
        if (pct < 50) fill.style.background = 'var(--warning)';
        if (pct <= 0) fill.style.background = 'var(--danger)';
      }
      this.floatText(animalEl, '-HP', true);
    }
    Audio2.sick();

    const msg = isPoisonous(food.id)
      ? i18n.t('edu.poison')
      : i18n.t('edu.wrong', { animal: getName(animal.id) });
    this.eduMessage(msg, 1500);

    // Wrong food is consumed too (mistake removes it sometimes for fakes/poison)
    if (isPoisonous(food.id) || food.fake) {
      this.removeLeftItem(food.uid);
    }

    if (animal.hp <= 0) {
      this.killAnimal(animal);
    }

    this.updateHUD();
  },

  killAnimal(animal) {
    animal.dead = true;
    const el = document.querySelector(`.item[data-uid="${animal.uid}"]`);
    if (el) {
      el.classList.add('dying');
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 800);
    }
    this.loseLife();
  },

  loseLife(reason) {
    this.state.lives--;
    if (this.state.lives <= 0) {
      this.endGame(false);
    } else {
      this.updateHUD();
      // Ecosystem messages
      if (this.state.lives === 1) this.eduMessage(i18n.t('eco.unstable'), 1800);
    }
  },

  removeLeftItem(uid) {
    this.state.leftItems = this.state.leftItems.filter(i => i.uid !== uid);
    const el = document.querySelector(`#left-items .item[data-uid="${uid}"]`);
    if (el) {
      el.style.transition = 'transform 0.3s, opacity 0.3s';
      el.style.transform = 'scale(0)';
      el.style.opacity = '0';
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 300);
    }
  },

  // ---------- phase complete / chain display ----------
  checkPhaseComplete() {
    const remaining = this.state.rightItems.filter(r => !r.dead && !r.eaten);
    if (remaining.length === 0) {
      this.clearTimer();
      this.state.chainsCompleted++;

      // Flawless achievement
      if (this.state.mistakesThisPhase === 0) {
        if (Progress.unlock('no_mistakes')) this.notifyAchievement('no_mistakes');
      }

      // Show chain overlay
      setTimeout(() => this.showChainOverlay(), 600);
    }
  },

  showChainOverlay() {
    const phase = MODES[this.state.mode].phases[this.state.phaseIndex];
    const chainEl = document.getElementById('chain-display');
    chainEl.innerHTML = '';
    phase.chain.forEach((id, i) => {
      if (i > 0) {
        const arrow = document.createElement('span');
        arrow.className = 'chain-arrow';
        arrow.textContent = '→';
        arrow.style.animationDelay = (i * 0.2) + 's';
        chainEl.appendChild(arrow);
      }
      const item = document.createElement('span');
      item.className = 'chain-item';
      item.textContent = getEmoji(id);
      item.style.animationDelay = (i * 0.2 + 0.1) + 's';
      chainEl.appendChild(item);
    });
    const narration = phase.narration[i18n.lang] || phase.narration.en;
    document.getElementById('chain-narration').textContent = narration;
    Audio2.star();
    Audio2.voice(narration);
    this.openOverlay('overlay-chain');
  },

  nextPhase() {
    this.state.phaseIndex++;
    const mode = MODES[this.state.mode];
    if (this.state.phaseIndex >= mode.phases.length) {
      this.win();
      return;
    }
    this.setupPhase();
  },

  // ---------- end game ----------
  endGame(victory) {
    this.state.gameOver = true;
    this.clearTimer();
    Audio2.cancelVoice();

    // update progress
    if (victory) {
      Progress.data.modesCompleted[this.state.mode] = true;
      const allDone = ['farm','forest','ocean','savannah'].every(m => Progress.data.modesCompleted[m]);
      if (allDone && Progress.unlock('food_chain_master')) this.notifyAchievement('food_chain_master');
      if (this.state.mode === 'ocean' && Progress.unlock('ocean_explorer')) this.notifyAchievement('ocean_explorer');
      if (this.state.mode === 'savannah' && Progress.unlock('savannah_king')) this.notifyAchievement('savannah_king');
      if (this.state.mode === 'farm' && this.state.lives === 3 && Progress.unlock('perfect_farmer')) this.notifyAchievement('perfect_farmer');
    }
    Progress.data.totalSaved = (Progress.data.totalSaved || 0) + this.state.animalsSaved;
    if (this.state.animalsSaved >= 30 && Progress.unlock('nature_protector')) this.notifyAchievement('nature_protector');
    if (this.state.powerupsUsedThisGame.size >= 4 && Progress.unlock('powerup_user')) this.notifyAchievement('powerup_user');
    if ((Progress.data.bestScore[this.state.mode] || 0) < this.state.score) {
      Progress.data.bestScore[this.state.mode] = this.state.score;
    }
    Progress.save();

    if (victory) {
      Audio2.victory();
      this.populateSummary('vc', true);
      this.openOverlay('overlay-victory');
    } else {
      Audio2.gameover();
      this.populateSummary('go', false);
      this.openOverlay('overlay-gameover');
    }
  },

  win() {
    this.endGame(true);
  },

  populateSummary(prefix, victory) {
    const score = this.state.score;
    const totalAnimals = (this.state.animalsSaved + (3 - this.state.lives));
    const health = totalAnimals > 0 ? Math.round((this.state.animalsSaved / totalAnimals) * 100) : 100;
    document.getElementById(prefix + '-score').textContent = score;
    document.getElementById(prefix + '-health').textContent = health + '%';
    if (prefix === 'go') {
      document.getElementById('go-saved').textContent = this.state.animalsSaved;
      document.getElementById('go-chains').textContent = this.state.chainsCompleted;
    }
    // Stars
    let stars = 0;
    if (victory) {
      if (this.state.lives === 3) stars = 3;
      else if (this.state.lives === 2) stars = 2;
      else stars = 1;
    } else {
      stars = score > 500 ? 2 : score > 200 ? 1 : 0;
    }
    const starsEl = document.getElementById(prefix + '-stars');
    starsEl.innerHTML = '';
    for (let i=0; i<3; i++) {
      const s = document.createElement('span');
      s.className = 'star' + (i < stars ? '' : ' empty');
      s.textContent = '⭐';
      starsEl.appendChild(s);
    }
    // Edu summary — pick based on what kinds of feedings happened
    let key = 'summary.eduBalance';
    if (this.state.mode === 'farm') key = 'summary.eduHerbivore';
    else if (this.state.mode === 'forest' || this.state.mode === 'savannah') key = 'summary.eduCarnivore';
    else if (this.state.mode === 'ocean') key = 'summary.eduOmnivore';
    document.getElementById(prefix + '-summary').textContent = i18n.t(key);
  },

  // ---------- powerups ----------
  usePowerup(type) {
    if (this.state.paused || this.state.gameOver) return;
    if (this.state.powerups[type] <= 0) {
      this.toast(i18n.t('power.empty'), 'warning');
      Audio2.wrong();
      return;
    }
    this.state.powerups[type]--;
    this.state.powerupsUsedThisGame.add(type);
    Audio2.power();
    const btn = document.querySelector(`.powerup-btn[data-power="${type}"]`);
    if (btn) {
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 800);
    }

    if (type === 'vet') {
      // Heal all wounded animals; revive last dead if any
      let revived = false;
      this.state.rightItems.forEach(a => {
        if (!a.dead && a.hp < a.maxHp) { a.hp = a.maxHp; revived = true; }
      });
      // Try to revive a dead animal
      const dead = this.state.rightItems.find(a => a.dead);
      if (dead) {
        dead.dead = false; dead.hp = dead.maxHp;
        this.state.lives = Math.min(3, this.state.lives + 1);
        // Remove any lingering element first, then re-add fresh
        const existing = document.querySelector(`.item[data-uid="${dead.uid}"]`);
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
        const list = document.getElementById('right-items');
        list.appendChild(this.makeItem(dead, 'right'));
        revived = true;
      }
      this.renderHealthBars();
      this.eduMessage(i18n.t('power.vet.use'), 1200);
    } else if (type === 'rain') {
      // Add more plant foods
      this.toggleWeather('rain', 4000);
      const mode = MODES[this.state.mode];
      const phase = mode.phases[this.state.phaseIndex];
      const plantPool = phase.left.filter(id => ENTITIES[id] && ENTITIES[id].kind === 'plant');
      for (let i=0; i<3; i++) {
        const id = plantPool[i % plantPool.length] || 'grass';
        const it = { id, uid:'R'+Math.random().toString(36).slice(2,8) };
        this.state.leftItems.push(it);
        const el = this.makeItem(it, 'left');
        document.getElementById('left-items').appendChild(el);
      }
      this.eduMessage(i18n.t('power.rain.use'), 1200);
    } else if (type === 'shield') {
      this.state.shieldActive = true;
      // visual on all animals
      document.querySelectorAll('#right-items .item').forEach(el => el.classList.add('shielded'));
      this.eduMessage(i18n.t('power.shield.use'), 1200);
    } else if (type === 'slow') {
      this.state.slowActive = true;
      this.eduMessage(i18n.t('power.slow.use'), 1200);
      // Slow timer
      if (this.state.phaseTimer && this.state.phaseTimerLeft > 0) {
        this.state.phaseTimerLeft += 10;
      }
      setTimeout(() => { this.state.slowActive = false; }, 6000);
    }
    this.updatePowerHUD();
  },

  renderHealthBars() {
    this.state.rightItems.forEach(a => {
      const el = document.querySelector(`.item[data-uid="${a.uid}"]`);
      if (!el) return;
      const fill = el.querySelector('.health-bar-fill');
      if (fill) {
        const pct = (a.hp / a.maxHp) * 100;
        fill.style.width = pct + '%';
        fill.style.background = pct < 50 ? 'var(--warning)' : 'var(--success)';
      }
    });
  },

  updatePowerHUD() {
    document.getElementById('pw-vet').textContent = this.state.powerups.vet;
    document.getElementById('pw-rain').textContent = this.state.powerups.rain;
    document.getElementById('pw-shield').textContent = this.state.powerups.shield;
    document.getElementById('pw-slow').textContent = this.state.powerups.slow;
    document.querySelectorAll('.powerup-btn').forEach(btn => {
      btn.disabled = this.state.powerups[btn.dataset.power] <= 0;
    });
  },

  // ---------- HUD ----------
  updateHUD() {
    document.getElementById('hud-score').textContent = this.state.score;
    document.getElementById('hud-combo').textContent = 'x' + this.state.combo;
    document.getElementById('hud-phase').textContent = (this.state.phaseIndex + 1);
    const livesEl = document.getElementById('hud-lives');
    livesEl.innerHTML = '';
    for (let i=0; i<3; i++) {
      const s = document.createElement('span');
      s.textContent = '❤️';
      if (i >= this.state.lives) s.classList.add('lost');
      livesEl.appendChild(s);
    }
    this.updatePowerHUD();
  },

  // ---------- pause ----------
  togglePause(on) {
    if (this.state.gameOver) return;
    this.state.paused = !!on;
    if (on) this.openOverlay('overlay-pause');
    else this.closeAllOverlays();
  },

  // ---------- random events / weather ----------
  triggerRandomEvent() {
    const ev = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    this.eduMessage(ev.icon + ' ' + (ev.text[i18n.lang] || ev.text.en), 2200);
    if (ev.effect === 'weather:rain') this.toggleWeather('rain', 8000);
    else if (ev.effect === 'storm') this.toggleWeather('rain', 6000);
    else if (ev.effect === 'night') { this.state.night = true; BG.setNight(true); document.getElementById('screen-game').classList.add('night'); }
    else if (ev.effect === 'day') { this.state.night = false; BG.setNight(false); document.getElementById('screen-game').classList.remove('night'); }
  },

  toggleWeather(kind, duration) {
    const layer = document.getElementById('weather-layer');
    layer.innerHTML = '';
    if (kind === 'rain') {
      for (let i=0; i<60; i++) {
        const d = document.createElement('div');
        d.className = 'rain-drop';
        d.style.left = Math.random()*100 + 'vw';
        d.style.animationDuration = (0.5 + Math.random()*0.8) + 's';
        d.style.animationDelay = (Math.random()*1) + 's';
        layer.appendChild(d);
      }
    }
    setTimeout(() => { layer.innerHTML = ''; }, duration);
  },

  // ---------- educational message ----------
  eduMessage(text, dur=1500) {
    const b = document.getElementById('edu-bubble');
    b.textContent = text;
    b.classList.add('show');
    clearTimeout(this._eduTimer);
    this._eduTimer = setTimeout(() => b.classList.remove('show'), dur);
  },

  // ---------- effects ----------
  spawnParticles(targetEl, emojis, count=8) {
    const fx = document.getElementById('fx-layer');
    const rect = targetEl.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    for (let i=0; i<count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      const dx = (Math.random() - 0.5) * 120;
      const dy = -(40 + Math.random()*80);
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      fx.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  },

  floatText(targetEl, text, bad) {
    const fx = document.getElementById('fx-layer');
    const rect = targetEl.getBoundingClientRect();
    const t = document.createElement('div');
    t.className = 'float-text' + (bad ? ' bad' : '');
    t.textContent = text;
    t.style.left = (rect.left + rect.width/2 - 20) + 'px';
    t.style.top = (rect.top + 10) + 'px';
    fx.appendChild(t);
    setTimeout(() => t.remove(), 1200);
  },

  // ---------- toast ----------
  toast(msg, kind='success', duration=2200) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + kind;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('show'), duration);
  },

  notifyAchievement(id) {
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (!a) return;
    const name = a.name[i18n.lang] || a.name.en;
    this.toast(i18n.t('achievement.unlocked', { name }) + ' ' + a.icon, 'success', 3000);
    Audio2.star();
  },
};

// ---------- helpers ----------
function pointFromEvent(e) {
  if (e.touches && e.touches[0]) return { x:e.touches[0].clientX, y:e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches[0]) return { x:e.changedTouches[0].clientX, y:e.changedTouches[0].clientY };
  if (typeof e.clientX === 'number') return { x:e.clientX, y:e.clientY };
  return null;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i=a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- bootstrap ----------
window.addEventListener('DOMContentLoaded', () => Game.init());

// Wake speechSynthesis voices on iOS
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {};
}
