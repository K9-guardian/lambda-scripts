const fetch = require('node-fetch')
const cheerio = require('cheerio')

async function fetchApi(word) {
    const response = await fetch(`https://www.dictionary.com/browse/${word}?s=t`)
    const $ = cheerio.load(await response.text())
    const definitions = [],
        sentences = []

    const content = $('#top-definitions-section').parent()

    $('[value]', content.html()).each(function (i, e) {
        // If ordered list, then ignore
        if ($(e).find('ol') != '') {
            $(e).find('li').each(function (i, e) {
                // If has sentence, add sentence and remove for definition
                if ($(e).find('.luna-example') != '') {
                    sentences.push($('.luna-example', e).text())
                    $('.luna-example', e).remove()
                }

                // Add definition
                definitions.push($(e).text())
            })
        } else {
            // If has sentence, add sentence and remove for definition
            if ($(e).find('.luna-example') != '') {
                sentences.push($('.luna-example', e).text())
                $('.luna-example', e).remove()
            }

            // Add definition
            definitions.push($(e).text())
        }
    })

    return {
        definitions: definitions,
        sentences: sentences
    }
}

fetchApi('law').then(dict => console.log(dict))