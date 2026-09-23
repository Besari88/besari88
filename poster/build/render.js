const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => {
  const b = await chromium.launch();
  const scale = parseFloat(process.argv[3] || '2');
  const p = await b.newPage({ viewport: { width: 2245, height: 3179 }, deviceScaleFactor: scale });
  await p.goto('file://' + __dirname + '/poster.html' + (process.argv[4] || ''));
  await p.waitForFunction(() => document.title === 'ready');
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: process.argv[2], omitBackground: true, fullPage: false });
  const L = await p.evaluate(() => window.LAYOUT);
  require('fs').writeFileSync(__dirname + '/layout.json', JSON.stringify(L, null, 1));
  await b.close();
})();
