/* ============================================
   ANIMAL FEED CHAIN — Animated background canvas per mode
   ============================================ */

const BG = {
  canvas: null,
  ctx: null,
  raf: null,
  mode: 'farm',
  t: 0,
  particles: [],
  night: false,
  dpr: 1,

  init() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.dpr = dpr;
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },

  setMode(mode) {
    this.mode = mode;
    this.particles = [];
    this.spawnInitial();
  },

  setNight(on) { this.night = on; },

  spawnInitial() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (this.mode === 'farm') {
      // clouds + birds
      for (let i=0; i<5; i++) this.particles.push({ type:'cloud', x:Math.random()*w, y:30 + Math.random()*h*0.35, s:0.8+Math.random()*0.8, v:0.2+Math.random()*0.3 });
      for (let i=0; i<3; i++) this.particles.push({ type:'bird', x:Math.random()*w, y:60 + Math.random()*h*0.3, s:1, v:0.5+Math.random()*0.4, phase:Math.random()*6.28 });
    } else if (this.mode === 'forest') {
      for (let i=0; i<15; i++) this.particles.push({ type:'leaf', x:Math.random()*w, y:Math.random()*h, s:0.7+Math.random()*0.6, v:0.3+Math.random()*0.4, swing:Math.random()*6.28 });
      for (let i=0; i<4; i++) this.particles.push({ type:'bird', x:Math.random()*w, y:60 + Math.random()*h*0.35, s:0.8, v:0.4+Math.random()*0.5, phase:Math.random()*6.28 });
    } else if (this.mode === 'ocean') {
      for (let i=0; i<20; i++) this.particles.push({ type:'bubble', x:Math.random()*w, y:h + Math.random()*h, s:0.5+Math.random()*1.2, v:0.4+Math.random()*0.6, swing:Math.random()*6.28 });
      for (let i=0; i<3; i++) this.particles.push({ type:'fish_far', x:Math.random()*w, y:Math.random()*h, s:0.6+Math.random()*0.6, v:0.4+Math.random()*0.5 });
    } else if (this.mode === 'savannah') {
      for (let i=0; i<3; i++) this.particles.push({ type:'cloud', x:Math.random()*w, y:30 + Math.random()*h*0.25, s:0.9+Math.random()*0.7, v:0.15+Math.random()*0.2 });
      for (let i=0; i<8; i++) this.particles.push({ type:'dust', x:Math.random()*w, y:Math.random()*h, s:0.5+Math.random()*0.7, v:0.4+Math.random()*0.6 });
      for (let i=0; i<2; i++) this.particles.push({ type:'bird', x:Math.random()*w, y:50 + Math.random()*h*0.2, s:0.9, v:0.4+Math.random()*0.4, phase:Math.random()*6.28 });
    }
  },

  start() {
    if (this.raf) cancelAnimationFrame(this.raf);
    const loop = () => {
      this.t += 1/60;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  },

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  },

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // Mode-specific landscape
    if (this.mode === 'farm') this.drawFarm(ctx, w, h);
    else if (this.mode === 'forest') this.drawForest(ctx, w, h);
    else if (this.mode === 'ocean') this.drawOcean(ctx, w, h);
    else if (this.mode === 'savannah') this.drawSavannah(ctx, w, h);

    // Particles
    for (const p of this.particles) this.updateParticle(p, w, h);

    // Night overlay
    if (this.night) {
      ctx.fillStyle = 'rgba(20,20,60,0.35)';
      ctx.fillRect(0, 0, w, h);
    }
  },

  drawFarm(ctx, w, h) {
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h*0.7);
    sky.addColorStop(0, '#87ceeb');
    sky.addColorStop(1, '#f9d976');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h*0.7);
    // Sun
    ctx.fillStyle = 'rgba(255,220,100,0.8)';
    ctx.beginPath(); ctx.arc(w*0.85, h*0.18, 40, 0, 6.28); ctx.fill();
    // Hills
    ctx.fillStyle = '#7ac74f';
    ctx.beginPath();
    ctx.moveTo(0, h*0.7);
    for (let x=0; x<=w; x+=20) {
      ctx.lineTo(x, h*0.7 - Math.sin(x*0.01 + this.t*0.1)*15 - 20);
    }
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
    // Ground
    ctx.fillStyle = '#6ab83f';
    ctx.fillRect(0, h*0.85, w, h*0.15);
    // Tiny grass blades
    ctx.strokeStyle = 'rgba(80,140,60,0.5)';
    ctx.lineWidth = 1;
    for (let x=0; x<w; x+=12) {
      const sway = Math.sin(this.t*2 + x*0.05) * 2;
      ctx.beginPath();
      ctx.moveTo(x, h*0.95);
      ctx.lineTo(x+sway, h*0.95 - 8);
      ctx.stroke();
    }
  },

  drawForest(ctx, w, h) {
    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#cce6c9');
    sky.addColorStop(0.5, '#a3d39a');
    sky.addColorStop(1, '#2d5e2d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    // Far trees
    ctx.fillStyle = '#3d5a3d';
    for (let i=0; i<10; i++) {
      const x = (i/10) * w + Math.sin(this.t*0.1 + i)*5;
      const y = h*0.55;
      ctx.beginPath();
      ctx.moveTo(x-30, y+50); ctx.lineTo(x, y-30); ctx.lineTo(x+30, y+50);
      ctx.closePath(); ctx.fill();
    }
    // Near trees
    ctx.fillStyle = '#2d4a2d';
    for (let i=0; i<6; i++) {
      const x = (i/6) * w + Math.cos(this.t*0.05 + i)*8 + 60;
      const y = h*0.72;
      ctx.beginPath();
      ctx.moveTo(x-50, y+80); ctx.lineTo(x, y-50); ctx.lineTo(x+50, y+80);
      ctx.closePath(); ctx.fill();
    }
    // Ground
    ctx.fillStyle = '#5b3a1d';
    ctx.fillRect(0, h*0.9, w, h*0.1);
  },

  drawOcean(ctx, w, h) {
    // Water gradient
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#2a8ec0');
    g.addColorStop(0.5, '#1a5e8a');
    g.addColorStop(1, '#0c3550');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // Light rays
    ctx.save();
    ctx.globalAlpha = 0.18;
    for (let i=0; i<5; i++) {
      const x = (i/5)*w + Math.sin(this.t*0.5 + i)*30;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x-30, h); ctx.lineTo(x+30, h); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    // Sand bottom
    ctx.fillStyle = '#d4b481';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x=0; x<=w; x+=20) ctx.lineTo(x, h - 30 - Math.sin(x*0.02 + this.t*0.2)*5);
    ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    // Sea weeds
    ctx.strokeStyle = '#2d7a2d';
    ctx.lineWidth = 3;
    for (let x=30; x<w; x+=70) {
      ctx.beginPath();
      ctx.moveTo(x, h-30);
      for (let yy=0; yy<40; yy+=4) {
        ctx.lineTo(x + Math.sin(this.t*2 + yy*0.3 + x*0.1)*5, h-30-yy);
      }
      ctx.stroke();
    }
  },

  drawSavannah(ctx, w, h) {
    // Sky sunset
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#ff9966');
    sky.addColorStop(0.4, '#ffcc70');
    sky.addColorStop(0.7, '#f4a460');
    sky.addColorStop(1, '#c4955c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    // Sun
    ctx.fillStyle = 'rgba(255,200,100,0.95)';
    ctx.beginPath(); ctx.arc(w*0.7, h*0.45, 55, 0, 6.28); ctx.fill();
    // Mountains
    ctx.fillStyle = '#a86d3f';
    ctx.beginPath();
    ctx.moveTo(0, h*0.6);
    ctx.lineTo(w*0.2, h*0.45);
    ctx.lineTo(w*0.45, h*0.55);
    ctx.lineTo(w*0.7, h*0.4);
    ctx.lineTo(w, h*0.55);
    ctx.lineTo(w, h); ctx.lineTo(0, h);
    ctx.closePath(); ctx.fill();
    // Grass
    ctx.fillStyle = '#c4894a';
    ctx.fillRect(0, h*0.78, w, h*0.22);
    // Acacia silhouette
    ctx.fillStyle = '#3a2d1d';
    const tx = w*0.15;
    ctx.fillRect(tx-2, h*0.55, 4, h*0.25);
    ctx.beginPath(); ctx.ellipse(tx, h*0.5, 40, 12, 0, 0, 6.28); ctx.fill();
  },

  updateParticle(p, w, h) {
    const ctx = this.ctx;
    if (p.type === 'cloud') {
      p.x += p.v;
      if (p.x > w + 80) p.x = -80;
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.font = `${30*p.s}px serif`;
      ctx.fillText('☁️', p.x, p.y);
      ctx.restore();
    } else if (p.type === 'leaf') {
      p.x += Math.sin(p.swing + this.t)*0.6;
      p.y += p.v;
      p.swing += 0.02;
      if (p.y > h) { p.y = -10; p.x = Math.random()*w; }
      ctx.save();
      ctx.font = `${16*p.s}px serif`;
      ctx.globalAlpha = 0.75;
      ctx.fillText('🍃', p.x, p.y);
      ctx.restore();
    } else if (p.type === 'bubble') {
      p.y -= p.v;
      p.x += Math.sin(p.swing + this.t*2)*0.4;
      p.swing += 0.05;
      if (p.y < -20) { p.y = h + 20; p.x = Math.random()*w; }
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4*p.s, 0, 6.28);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.stroke();
      ctx.restore();
    } else if (p.type === 'fish_far') {
      p.x += p.v;
      if (p.x > w + 30) { p.x = -30; p.y = Math.random()*h*0.7 + 50; }
      ctx.save();
      ctx.font = `${20*p.s}px serif`;
      ctx.globalAlpha = 0.5;
      ctx.fillText('🐠', p.x, p.y);
      ctx.restore();
    } else if (p.type === 'bird') {
      p.x += p.v;
      if (p.x > w + 30) p.x = -30;
      p.phase += 0.2;
      ctx.save();
      ctx.font = `${14*p.s}px serif`;
      ctx.globalAlpha = 0.8;
      const flap = Math.sin(p.phase) > 0 ? '🕊️' : '🐦';
      ctx.fillText(flap, p.x, p.y + Math.sin(p.phase*0.5)*4);
      ctx.restore();
    } else if (p.type === 'dust') {
      p.x += p.v;
      p.y += Math.sin(p.x*0.05 + this.t)*0.2;
      if (p.x > w + 10) { p.x = -10; p.y = Math.random()*h; }
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#d4a574';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5*p.s, 0, 6.28);
      ctx.fill();
      ctx.restore();
    }
  }
};
