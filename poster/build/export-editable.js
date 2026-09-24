// Snapshot poster.html into a flat, fully editable HTML page for Canva import:
// every shape, line, pill and text becomes its own absolutely positioned element.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2245, height: 3179 } });
  await p.goto('file://' + __dirname + '/poster.html');
  await p.waitForFunction(() => document.title === 'ready');
  await p.evaluate(() => document.fonts.ready);
  const items = await p.evaluate(() => {
    const out = [];
    const fam = f => /Serif/.test(f) ? "'Instrument Serif', serif" : "'Poppins', sans-serif";
    const hasDeco = cs => (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || parseFloat(cs.borderTopWidth) > 0;
    const textStyle = cs => ({
      fontFamily: fam(cs.fontFamily), fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle,
      color: cs.color, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform, lineHeight: cs.lineHeight,
    });
    const inlineStyles = root => {
      // bake computed text styles into inline styles so class rules survive the export
      [root, ...root.querySelectorAll('*')].forEach(el => {
        const cs = getComputedStyle(el), st = textStyle(cs);
        const keep = el.getAttribute('style') || '';
        el.removeAttribute('class');
        el.setAttribute('style', keep + ';' + Object.entries(st).map(([k, v]) => k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()) + ':' + v).join(';'));
      });
    };
    const pushText = (html, r, cs, align = 'left') => out.push({ kind: 'text', html, x: r.left, y: r.top, w: r.width, h: r.height, align, style: textStyle(cs) });
    document.querySelectorAll('.t').forEach(t => {
      const decos = [...t.querySelectorAll('*')].filter(e => hasDeco(getComputedStyle(e)));
      const alignRight = t.style.right !== '';
      decos.forEach(d => {
        const r = d.getBoundingClientRect(), cs = getComputedStyle(d);
        out.push({ kind: 'box', x: r.left, y: r.top, w: r.width, h: r.height, bg: cs.backgroundColor,
          border: parseFloat(cs.borderTopWidth) > 0 ? `${cs.borderTopWidth} solid ${cs.borderTopColor}` : '', radius: cs.borderTopLeftRadius,
          shadow: cs.boxShadow !== 'none' ? cs.boxShadow : '' });
      });
      // every text node becomes its own text box at its exact rendered position
      const walker = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
      let n; while ((n = walker.nextNode())) {
        if (!n.textContent.trim()) continue;
        const tc = n.textContent, lead = tc.length - tc.trimStart().length, trail = tc.length - tc.trimEnd().length; const range = document.createRange(); range.setStart(n, lead); range.setEnd(n, tc.length - trail);
        const r = range.getBoundingClientRect();
        pushText(n.textContent.trim().replace(/&/g, '&amp;'), r, getComputedStyle(n.parentElement), 'left');
      }
    });
    return { items: out, L: window.LAYOUT };
  });
  await b.close();
  fs.writeFileSync(__dirname + '/editable.json', JSON.stringify(items));
})();
