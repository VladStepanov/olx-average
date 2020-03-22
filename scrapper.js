const puppeteer = require('puppeteer');

const argv = require('yargs')
  .help('h')
  .alias('h', 'help')
  .alias('q', 'query')
  .demandOption(['query'])
  .describe('query', 'Olx query for searching').argv;

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.olx.ua')

  await page.focus('.queryfield')
  await page.keyboard.type(argv.query)
  await page.keyboard.press('Enter')
  await page.waitForNavigation()

  const prices = await page.evaluate(() => {
    const prices = [...document.querySelectorAll('.price strong')].map(node => node.innerText)
    return prices.map(price => parseInt(price.replace(' ', '')))
  })
  const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)

  console.log(`Average price of ${argv.query}: `, averagePrice)

  await browser.close()
})()
