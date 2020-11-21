// const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

exports.handler = async (event) => {
    let browser = null
    const url = 'https://translate.google.com'
    const from = 'en'
    const to = 'es'
    const text = event.queryStringParameters.text

    // Catch empty input
    if (text == null || text === '')
        return

    // browser = await chromium.puppeteer.launch({
    //     args: chromium.args,
    //     executablePath: await chromium.executablePath
    // })
    browser = await puppeteer.launch()
    let page = await browser.newPage()
    await page.goto(`${url}/?sl=${from}&tl=${to}&text=${text}&op=translate`, {waitUntil: "networkidle2"})
    const $ = cheerio.load(await page.content())
    const response = $('span[lang=es]').text()

    const result = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        body: response,
        isBase64Encoded: false
    }
    await browser.close()
    return result
}

const testEvent = {
    queryStringParameters: {
        text: "She hadn't had her cup of coffee, and that made things all the worse."
    }
}
this.handler(testEvent).then(response => console.log(response.body))