'use strict';

const iterHeaders = require('./tal_common').iterHeaders;
const feedTableBodyFromData = require('./tal_common').feedTableBodyFromData;
const localeComparator = require('./tal_common').localeComparator;

var languages = {};
var languageGroups = {};
var languageAlphabets = {};

module.exports = function (md) {
    md.core.ruler.push('tal_languages', function (state) {
        iterHeaders(state.tokens, /^jezyk-(powszechny|tajemny)/, function (titleFull, content, match) {
            var title = titleFull.replace(/\s*\([^)]*\)/, '');
            var language = languages[title] = content;

            language['id'] = match.input;
            language['Typ'] = match[1];
            language['Natywnie'] = titleFull.match(/\(([^)]+)\)/)[1];
            language['Koszt podstawowy'] = language['Wymagania'].match(/^(\d+|brak)\s*\/\s*(?:\d+|brak)/)[1];
            language['Koszt zaawansowany'] = language['Wymagania'].match(/^(?:\d+|brak)\s*\/\s*(\d+|brak)/)[1];

            if (!languageGroups[language['Grupa językowa']]) {
                languageGroups[language['Grupa językowa']] = [];
            }

            languageGroups[language['Grupa językowa']].push(title);

            if (!languageAlphabets[language['Alfabet']]) {
                languageAlphabets[language['Alfabet']] = [];
            }

            languageAlphabets[language['Alfabet']].push(title);
        });

        delete languageAlphabets['Brak'];

        feedTableBodyFromData(state.tokens, state.Token, 'tabela-jezyki-powszechne', languages, function (key) {
            return languages[key]['Typ'] !== 'tajemny';
        }, languageFields);

        feedTableBodyFromData(state.tokens, state.Token, 'tabela-jezyki-tajemne', languages, function (key) {
            return languages[key]['Typ'] === 'tajemny';
        }, languageFields);

        feedTableBodyFromData(state.tokens, state.Token, 'tabela-grupy-jezykowe', languageGroups, null, groupFields);

        feedTableBodyFromData(state.tokens, state.Token, 'tabela-alfabety', languageAlphabets, null, groupFields);
    });
};

function languageFields(key, entry) {
    return [{href: '#' + entry['id'], text: key}, entry['Grupa językowa'], entry['Koszt podstawowy'], entry['Koszt zaawansowany']];
}

function groupFields(key, entry) {
    var requirements = entry.sort(localeComparator).map(function(title) {
        return {href: '#' + languages[title]['id'], text: title};
    }).reduce(function(array, value) {
        return array.concat([value, ', ']);
    }, []);
    
    requirements.pop();
    
    return [key, requirements];
}
