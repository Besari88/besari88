const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 2245, height: 3179 }, deviceScaleFactor: 0.4 });
  await p.goto('file://' + __dirname + '/../canva-editable.html'); await p.waitForTimeout(1500);
  await p.screenshot({ path: process.argv[2] }); await b.close(); })();
