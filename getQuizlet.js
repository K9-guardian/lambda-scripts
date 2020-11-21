// const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

exports.handler = async (event) => {
    let browser = null
    const url = event.queryStringParameters.url

    // Catch empty input
    if (url == null || url === '' || !url.startsWith('https://quizlet.com'))
        return

    // browser = await chromium.puppeteer.launch({
    //     args: chromium.args,
    //     executablePath: await chromium.executablePath,
    // })
    browser = await puppeteer.launch()
    let page = await browser.newPage()
    await page.goto(url, {waitUntil: "networkidle2"})
    let response = {}
    const english = [], spanish = []

    const $ = cheerio.load(await page.content())
    $('.TermText.notranslate.lang-en').each((i, e) => english.push($(e).text()))
    $('.TermText.notranslate.lang-es').each((i, e) => spanish.push($(e).text()))

    // Catch bad quizlet website
    if (english.length == 0 || spanish.length == 0)
        return
    
    for (let i = 0; i < english.length; i++)
        response[english[i]] = spanish[i]
    
    const result = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(response),
        isBase64Encoded: false
    }
    await browser.close()
    return result
}

const testEvent = {
    queryStringParameters: {
        url: "https://quizlet.com/489864145/tema-2-contexto-2-flash-cards/"
    }
}
this.handler(testEvent).then(response => console.log(response.body))