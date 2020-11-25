const fetch = require('node-fetch')
const cheerio = require('cheerio')

exports.handler = async (event) => {
    const word = event.queryStringParameters.word
    const response = await fetch(`https://www.dictionary.com/browse/${word}?s=t`)
    const $ = cheerio.load(await response.text())
    const definitions = [], sentences = []

    const content = $('#top-definitions-section').parent()

    $('[value]', content.html()).each(function() {
        // If ordered list, then iterate over ordered list
        if ($(this).find('ol') != '') {
            $(this).find('li').each(function() {
                // If has sentence, add sentence and remove for definition
                if ($(this).find('.luna-example') != '') {
                    sentences.push($('.luna-example', this).text())
                    $('.luna-example', this).remove()
                }

                // Add definition
                if ($(this).text() != '')
                    definitions.push($(this).text())
            })
        } else {
            // If has sentence, add sentence and remove for definition
            if ($(this).find('.luna-example') != '') {
                sentences.push($('.luna-example', this).text())
                $('.luna-example', this).remove()
            }

            // Add definition
            if ($(this).text() != '')
                definitions.push($(this).text())
        }
    })

    return {
        definitions: definitions,
        sentences: sentences
    }
}

const testEvent = {
    queryStringParameters: {
        word: "help"
    }
}
this.handler(testEvent).then(dict => console.log(dict))