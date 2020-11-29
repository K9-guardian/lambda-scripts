const fetch = require('node-fetch')
const cheerio = require('cheerio')

exports.handler = async (event) => {
    const word = event.queryStringParameters.word
    const response = await fetch(`https://www.dictionary.com/browse/${word}?s=t`)
    const $ = cheerio.load(await response.text())
    const definitions = [], sentences = []

    const content = $('#top-definitions-section').parent()

    $('[value]', content.html()).each((i, e) => {
        // If ordered list, then iterate over ordered list
        if ($(e).find('ol') != '') {
            $(e).find('li').each((i, e) => {
                // If has sentence, add sentence and remove for definition
                if ($(e).find('.luna-example') != '') {
                    sentences.push($('.luna-example', e).text())
                    $('.luna-example', e).remove()
                }

                // Add definition
                if ($(e).text() != '')
                    definitions.push($(e).text())
            })
        } else {
            // If has sentence, add sentence and remove for definition
            if ($(e).find('.luna-example') != '') {
                sentences.push($('.luna-example', e).text())
                $('.luna-example', e).remove()
            }

            // Add definition
            if ($(e).text() != '')
                definitions.push($(e).text())
        }

    })

    $('.default-content', '#examples-section').find('ul').children().each((i, e) => sentences.push($(e).find('p').text()))
    $('.expandable-content', '#examples-section').find('ul').children().each((i, e) => sentences.push($(e).find('p').text()))

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "https://k9-guardian.github.io",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
        },
        body: JSON.stringify({definitions: definitions, sentences: sentences}),
        isBase64Encoded: false
    }
}

const testEvent = {
    queryStringParameters: {
        word: "test"
    }
}
this.handler(testEvent).then(dict => console.log(dict))