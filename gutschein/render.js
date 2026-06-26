const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const file = 'file://' + path.resolve(__dirname, 'hegart-gutschein.html');
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  });
  const page = await browser.newPage({
    viewport: { width: 1240, height: 775 },
    deviceScaleFactor: 2,
  });
  await page.goto(file, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.waitForTimeout(400);

  // PNG (2x = 2480x1550)
  await page.screenshot({
    path: path.resolve(__dirname, 'hegart-gutschein.png'),
    clip: { x: 0, y: 0, width: 1240, height: 775 },
  });

  // PDF at exact canvas size
  await page.pdf({
    path: path.resolve(__dirname, 'hegart-gutschein.pdf'),
    width: '1240px',
    height: '775px',
    printBackground: true,
    pageRanges: '1',
  });

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
