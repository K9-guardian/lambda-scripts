// const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer')

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
    let response = []

    const english = page.evaluate(() => Array.from(document.querySelectorAll('.TermText.notranslate.lang-en'), e => e.innerText))
    const spanish = page.evaluate(() => Array.from(document.querySelectorAll('.TermText.notranslate.lang-es'), e => e.innerText))
    
    const words = await Promise.all([english, spanish])

    // Catch bad quizlet website
    if (words[0].length == 0 || words[1].length == 0)
        return
    
    for (let i = 0; i < words[0].length; i++)
        response.push({english: words[0][i], spanish: words[1][i]})
    
    const result = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "https://k9-guardian.github.io",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify(responsthis),
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